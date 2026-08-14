// Baut aus Formular-Fragment + Skript eine einzelne HTML-Datei, die ohne
// Internet funktioniert. Wird von den Endpoints unter /offline/ verwendet.
import generatorCss from "@/styles/generator.css?raw"

// Nur was die Einzeldatei zusätzlich zu generator.css braucht: Seitengerüst
// und die .button-Klassen, die auf der Website campaign.css beisteuert.
const baseCss = `
:root { color-scheme: light; }
body {
  margin: 0;
  background: #fff;
  color: #111;
  font-family: system-ui, sans-serif;
  line-height: 1.55;
  overflow-wrap: anywhere;
}
main { max-width: 48rem; margin: 0 auto; padding: 2rem 1rem 4rem; }
h1 { font-size: 1.75rem; line-height: 1.15; letter-spacing: -0.02em; }
.offline-hint, footer { color: #555; font-size: 0.875rem; }
footer { margin-top: 3rem; border-top: 1px solid #bbb; padding-top: 1rem; }
a { color: inherit; }
.button-row { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
.button {
  display: inline-flex;
  min-height: 2.9rem;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border: 1px solid #111;
  background: none;
  color: #111;
  font: inherit;
  font-weight: 500;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
.button.primary { border-color: #e3000f; background: #e3000f; color: #fff; }
`

export function offlinePage(opts: {
  title: string
  intro: string
  formHtml: string
  js: string
  canonical: string
}): string {
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${opts.title} — dac8.org</title>
<style>${baseCss}${generatorCss}</style>
</head>
<body>
<main>
<h1>${opts.title}</h1>
<p>${opts.intro}</p>
<p class="offline-hint">Diese Datei funktioniert ohne Internet: im Browser
öffnen und ausfüllen.</p>
${opts.formHtml}
<footer>Eine Datei von <a href="${opts.canonical}">dac8.org</a>, einer
Initiative des Vereins Bitcoin Austria. Die jeweils aktuelle Fassung dieses
Generators findest du unter <a href="${opts.canonical}">${opts.canonical}</a>.</footer>
</main>
<script>${opts.js}</script>
</body>
</html>`
}
