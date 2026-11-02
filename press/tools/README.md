# Werkzeuge für den Presseordner

Nicht Teil der Website. Einmal `npm install` in diesem Ordner.

- `film-frames.mjs` mit `film.css` und `datenweg.json` (Startseite) oder
  `ausweis.css` und `ausweis.json` (Ausweis-Film von /geschichte/): rendert einen
  Scroll-Film Bild für Bild (60 fps, ohne Ruckeln) mit großen Untertiteln und
  dac8.org als Wasserzeichen. Braucht die gebaute Seite auf
  `127.0.0.1:4329` (`pnpm astro build`, dann `python3 -m http.server 4329
  --bind 127.0.0.1` in `dist/`). `node film-frames.mjs datenweg.json stills`
  zeigt nur die Haltepunkte. Die Bilder landen in `/tmp/pr-film/`, ffmpeg
  macht daraus das Video (siehe `film.sh`).
- `cover-map.mjs`: die Angriffskarte von dac8.org als 1920 × 1080, mit Zahlen
  als Titelbild für bitcoin-austria.at, mit `plain` ohne Zahlen für X.
  `ATTACKS=<attacks.json>` nimmt eine andere Fassung der Liste, etwa von
  `main` (`git show origin/main:src/data/attacks.json`).
- `xlen.py`: zählt die Posts in `x-thread-de.md` wie X.
- `make_thread_doc.py`: baut das Thread-Dokument (.docx und .pdf, siehe
  `film.sh`).
