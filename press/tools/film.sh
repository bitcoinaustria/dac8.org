#!/usr/bin/env bash
# Renders the data film and the ID film, puts them into the press folder
# and rebuilds the thread document with a still from each. Needs the site served on :4329.
set -euo pipefail
tools=$(cd "$(dirname "$0")" && pwd)
press="$tools/../2026-11-02-launch"
work=/tmp/pr-film
doc="dac8.org · X-Thread · 2. November 2026"

film() {
  node "$tools/film-frames.mjs" "$tools/$1.json"
  ffmpeg -loglevel error -y -framerate 60 -i "$work/$1.frames/f%05d.jpg" \
    -vf "scale=1080:1080:flags=lanczos,format=yuv420p" \
    -c:v libx264 -preset slow -crf 17 -profile:v high -movflags +faststart \
    "$press/media/$2.mp4"
}
film datenweg 01-datenweg
film ausweis 05-ausweis

# Stills for the document: the target list from the data film, the gold
# from the ID film.
ffmpeg -loglevel error -y -ss 14.6 -i "$press/media/01-datenweg.mp4" -frames:v 1 -q:v 3 "$work/still-01.jpg"
ffmpeg -loglevel error -y -ss 4.5 -i "$press/media/05-ausweis.mp4" -frames:v 1 -q:v 3 "$work/still-05.jpg"
python3 -I "$tools/make_thread_doc.py" "$press" "$work" "$press/media/presse/logo-bitcoin-austria-dac8.png" "$work/$doc.html"
(
  cd "$work"
  rm -f "$doc.docx" "$doc.pdf"
  soffice --headless --infilter="HTML (StarWriter)" --convert-to 'docx:MS Word 2007 XML' "$doc.html" >/dev/null
  soffice --headless --convert-to pdf "$doc.docx" >/dev/null
  cp "$doc.docx" "$doc.pdf" "$press/"
)
pdfinfo "$press/$doc.pdf" | grep Pages
