"""
Reads passages of EU anti-money-laundering law aloud for the history film's
paper chapter, with Qwen3-TTS (VoiceDesign): a few officials' voices, each
designed from a description, take turns. Every passage is spoken a few
times; Whisper checks each take against the text and the closest is kept.

    python scripts/artwork/speak-law.py scripts/artwork/law-passages.json outdir

passages.json: [{"id", "voice", "text": {"de", "en"}, "spoken": {"de", "en"}}]
`spoken` is the text as read aloud (references written out), `text` what
the page shows. Writes outdir/<id>-<lang>.wav (24 kHz mono); public/audio/law
holds them as loudness-normalised MP3 (ffmpeg loudnorm I=-18, 48 kbps mono).

Needs a Python with qwen-tts, torch, transformers, librosa, soundfile and
jiwer, on an NVIDIA or AMD (ROCm) GPU.
"""

import contextlib
import io
import json
import logging
import re
import sys
import warnings
from pathlib import Path

import jiwer
import librosa
import numpy as np
import soundfile as sf
import torch

logging.getLogger("sox").disabled = True
warnings.filterwarnings("ignore")
with contextlib.redirect_stdout(io.StringIO()):
    from qwen_tts import Qwen3TTSModel
from transformers import pipeline  # noqa: E402

MODEL = "Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign"
ASR = "openai/whisper-large-v3-turbo"
TAKES = 3

VOICES = {
    "de": {
        "a": "A middle-aged male civil servant reading a legal text aloud in standard German. Monotone, matter-of-fact, slightly bored, clear articulation, steady pace. Dry close-microphone studio recording.",
        "b": "A woman in her fifties, a senior administrative official, reading regulations aloud in standard German. Flat, precise, a little weary, clear diction, even pace. Dry studio recording.",
        "c": "An older man with a deep, dry voice reading from an official gazette in standard German. Slow, formal, without emotion, clear studio recording.",
        "d": "A young male clerk reading legal text aloud in standard German, quick and even, neutral tone, clear diction. Dry studio recording.",
    },
    "en": {
        "a": "A middle-aged male civil servant reading a legal text aloud in neutral British English. Monotone, matter-of-fact, slightly bored, clear articulation, steady pace. Dry close-microphone studio recording.",
        "b": "A woman in her fifties, a senior administrative official, reading regulations aloud in neutral British English. Flat, precise, a little weary, clear diction, even pace. Dry studio recording.",
        "c": "An older man with a deep, dry voice reading from an official journal in British English. Slow, formal, without emotion, clear studio recording.",
        "d": "A young male clerk reading legal text aloud in neutral English, quick and even, neutral tone, clear diction. Dry studio recording.",
    },
}
LANGUAGE = {"de": "German", "en": "English"}

device = "cuda:0" if torch.cuda.is_available() else "cpu"
dtype = torch.bfloat16 if device != "cpu" else torch.float32
if torch.version.hip:
    # MIOpen's convolutions are very slow in the speech decoder on RDNA3.
    torch.backends.cudnn.enabled = False


def normalise(text):
    text = text.lower()
    text = re.sub(r"[„“”‘’'\"«»(),.;:!?—–-]", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def trim(wav, sr):
    """Cut silence before and after the speech, with short fades."""
    frame = int(sr * 0.02)
    n = len(wav) // frame
    if n < 3:
        return wav
    db = 20 * np.log10(np.sqrt(np.mean(wav[: n * frame].reshape(n, frame) ** 2, axis=1) + 1e-12))
    loud = np.where(db > -40)[0]
    if not len(loud):
        return wav
    start = max(0, loud[0] * frame - int(sr * 0.04))
    end = min(len(wav), (loud[-1] + 1) * frame + int(sr * 0.12))
    out = wav[start:end].copy()
    fade = min(int(sr * 0.01), len(out) // 2)
    out[:fade] *= np.linspace(0, 1, fade)
    out[-fade:] *= np.linspace(1, 0, fade)
    return out


def main():
    passages = json.loads(Path(sys.argv[1]).read_text())
    out = Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    model = Qwen3TTSModel.from_pretrained(MODEL, device_map=device, dtype=dtype, attn_implementation="sdpa")
    asr = pipeline("automatic-speech-recognition", model=ASR, dtype=torch.float16, device=device)
    for lang in ("de", "en"):
        for p in passages:
            target = out / f"{p['id']}-{lang}.wav"
            if target.exists():
                continue
            spoken = p["spoken"][lang]
            best = None
            for take in range(TAKES):
                torch.manual_seed(1991 + take * 17 + len(p["id"]))
                wavs, sr = model.generate_voice_design(
                    text=[spoken],
                    instruct=[VOICES[lang][p["voice"]]],
                    language=[LANGUAGE[lang]],
                )
                wav = trim(wavs[0], sr)
                heard = asr(
                    {"raw": librosa.resample(wav.astype(np.float32), orig_sr=sr, target_sr=16000), "sampling_rate": 16000},
                    generate_kwargs={"language": LANGUAGE[lang].lower()},
                    return_timestamps=True,
                )["text"]
                cer = jiwer.cer(normalise(spoken), normalise(heard))
                print(f"{p['id']}-{lang} take {take}: {len(wav) / sr:.1f} s, CER {cer:.3f}", flush=True)
                if best is None or cer < best[0]:
                    best = (cer, wav, sr, heard)
                if cer < 0.06:
                    break
            cer, wav, sr, heard = best
            sf.write(target, wav, sr)
            print(f"  kept CER {cer:.3f}: {heard[:120]}", flush=True)


main()
