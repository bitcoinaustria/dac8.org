"""Builds a reviewable document of the X thread from x-thread-de.md: every
post with its text, length and media (a still for films), then the checks.
Writes HTML with embedded images; LibreOffice turns it into .docx and .pdf.
Usage: python3 -I make_thread_doc.py <press-dir> <stills-dir> <logo.png> <out.html>
<stills-dir> holds still-01.jpg, still-05.jpg, ... for the films.
"""
import base64
import re
import subprocess
import sys
from html import escape
from pathlib import Path

press, stills, logo, out = (Path(a) for a in sys.argv[1:5])
source = (press / "x-thread-de.md").read_text()
xlen = Path(__file__).with_name("xlen.py")
lengths = dict(
    line.split()[:2]
    for line in subprocess.run(
        ["python3", "-I", str(xlen), str(press / "x-thread-de.md")], capture_output=True, text=True, check=True
    ).stdout.splitlines()
)


def image(path, width_cm):
    kind = "png" if path.suffix == ".png" else "jpeg"
    data = base64.b64encode(path.read_bytes()).decode()
    return f'<img src="data:image/{kind};base64,{data}" style="width:{width_cm}cm" width="{round(width_cm * 37.8)}">'


def inline(text):
    text = escape(text)
    text = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", text)
    text = re.sub(r"`([^`]+)`", r"\1", text)
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)


thread = source.split("## Vor dem Posten prüfen", 1)[0]
sections = re.split(r"^\*\*(\d)/7\*\* · ", thread, flags=re.M)[1:]
posts = [
    (number, rest.split("\n", 1)[0], re.search(r"```text\n(.*?)\n```", rest, flags=re.S).group(1))
    for number, rest in zip(sections[::2], sections[1::2])
]
checks = source.split("## Vor dem Posten prüfen", 1)[1].strip()
checks = [" ".join(item.split()) for item in re.split(r"\n- ", "\n" + checks) if item.strip()]

parts = []
for number, media_line, text in posts:
    file = re.search(r"media/([\w.-]+)", media_line)
    note = re.search(r"\((.+)\)\s*$", re.sub(r"\[[^\]]*\]\([^)]*\)", "", media_line))
    if file:
        name = file.group(1)
        film = name.endswith(".mp4")
        picture = stills / f"still-{name[:2]}.jpg" if film else press / "media" / name
        wide = "karte" in name
        label = f"{'Film' if film else 'Bild'}: media/{name}" + (f" · {note.group(1)}" if note else "") + (" (hier ein Standbild)" if film else "")
        media = f'<p class="media">{image(picture, 14 if wide else 6.5)}</p><p class="label">{inline(label)}</p>'
    else:
        media = f'<p class="label">{inline(media_line[0].upper() + media_line[1:])}</p>'
    # X shows the thread emoji in colour; Arial has no glyph for it.
    body = "".join(
        f"<p class=\"post\">{inline(block).replace(chr(10), '<br>').replace('🧵', '<span class=emoji>🧵</span>')}</p>"
        for block in text.split("\n\n")
    )
    parts.append(
        f'<h2>{number}/7 <span class="count">{lengths[number]} von 280 Zeichen</span></h2>'
        f'<table class="post-table" width="100%" cellpadding="14" cellspacing="0">'
        f'<tr><td class="box">{body}</td></tr><tr><td class="under">{media}</td></tr></table>'
    )

html = f"""<!doctype html><html lang="de"><head><meta charset="utf-8"><title>dac8.org · X-Thread · 2. November 2026</title>
<style>
body {{ font-family: Arial; font-size: 11pt; color: #202020; }}
p {{ margin: 0 0 6pt 0; line-height: 1.35; }}
.kicker {{ color: #e3000f; font-weight: bold; font-size: 8pt; margin-top: 18pt; }}
h1 {{ font-family: Arial; font-size: 20pt; margin: 4pt 0 8pt 0; }}
.intro {{ color: #5c5c5c; font-size: 10pt; }}
h2 {{ font-family: Arial; font-size: 13pt; margin: 20pt 0 6pt 0; page-break-after: avoid; }}
.count {{ font-size: 9pt; font-weight: normal; color: #5c5c5c; }}
.post-table {{ page-break-inside: avoid; }}
.box {{ background: #f3f3f2; border-left: 3pt solid #e3000f; padding: 10pt 12pt 4pt 12pt; }}
.under {{ padding: 0 0 0 12pt; }}
.emoji {{ font-family: 'Noto Color Emoji'; }}
.post {{ font-size: 11pt; }}
.media {{ margin: 8pt 0 2pt 0; }}
.label {{ color: #5c5c5c; font-size: 9pt; }}
h3 {{ font-family: Arial; font-size: 13pt; margin: 24pt 0 6pt 0; }}
li {{ font-size: 10pt; margin-bottom: 4pt; }}
</style></head><body>
<p>{image(logo, 6.5)}</p>
<p class="kicker">X-THREAD · DEUTSCH</p>
<h1>X-Thread zum Start von dac8.org</h1>
<p class="intro">Start: 2. November 2026, 10:00 Uhr (Embargo). 7 Posts, jeder unter 280 Zeichen (Links zählen bei X 23, Emoji 2). Post 1 anheften. Die Medien liegen im Presseordner unter media/.</p>
{''.join(parts)}
<h3>Vor dem Posten prüfen</h3>
<ul>{''.join(f'<li>{inline(item)}</li>' for item in checks)}</ul>
</body></html>"""
out.write_text(html)
print("wrote", out, "posts", len(posts))
