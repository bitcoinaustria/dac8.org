// Abgeordneten-Brief-Generator. Läuft ausschließlich im Browser; keine
// Eingabe verlässt das Gerät. Textbausteine aus dem Handover-Paket
// (dac8-prototyp_v2). PETI-Mitglieder: Stand 14.08.2026 gegen die
// MEP-Profile auf europarl.europa.eu geprüft; Ausschussbesetzungen ändern
// sich, vor Erweiterung um weitere Länder erneut prüfen.
const SUBJECT =
  "Petition gegen die anlasslose Krypto-Datenerfassung (DAC8) – Bitte um Unterstützung"

const PETI_CHAIR = {
  name: "Bogdan Rzońca (Ausschussvorsitzender)",
  email: "bogdan.rzonca@europarl.europa.eu",
}
const MDEP = {
  Österreich: [
    {
      name: "Alexander Bernhuber",
      email: "alexander.bernhuber@europarl.europa.eu",
    },
    { name: "Georg Mayer", email: "georg.mayer@europarl.europa.eu" },
  ],
  Deutschland: [
    {
      name: "Norbert Herhammer",
      email: "norbert.herhammer@europarl.europa.eu",
    },
    { name: "Stefan Köhler", email: "stefan.koehler@europarl.europa.eu" },
  ],
}

const form = document.getElementById("brief-form")

function buildBrief() {
  const land = document.getElementById("mdep-land").value
  const name = document.getElementById("mdep-name").value.trim()
  const empf = (MDEP[land] || []).concat(PETI_CHAIR)
  const landLabel = land === "andere" ? "einem EU-Mitgliedstaat" : land
  const hinweis =
    land === "andere"
      ? " (Für dein Land ergänzen wir die zuständigen Ausschussmitglieder – vorerst geht die E-Mail an den Ausschussvorsitzenden.)"
      : ""
  const body = `Sehr geehrte Damen und Herren,

als Bürger aus ${landLabel} wende ich mich an Sie als Mitglied des Petitionsausschusses des Europäischen Parlaments.

Mit DAC8 (Richtlinie (EU) 2023/2226) werden seit 2026 die personenbezogenen Daten und Krypto-Transaktionen praktisch aller Krypto-Nutzer in der EU anlasslos und flächendeckend erfasst und automatisch zwischen den Steuerbehörden ausgetauscht – ohne dass die Betroffenen vorab informiert oder angehört werden.

Gegen diese unverhältnismäßige Massenerfassung wird derzeit eine Petition an das Europäische Parlament vorbereitet. Ich bitte Sie, sie aufzugreifen, sobald sie vorliegt, und sich schon jetzt für eine verhältnismäßige, datenschutzkonforme Ausgestaltung von DAC8 einzusetzen: zielgerichtete statt anlassloser Erfassung, Datenminimierung, wirksame Betroffenenrechte sowie eine unabhängige Grundrechts-Folgenabschätzung.

Der Europäische Gerichtshof hat anlasslose Massenerfassung wiederholt als unverhältnismäßig verworfen. Die zentrale Zusammenführung sensibler Krypto-Daten schafft zudem erhebliche Sicherheitsrisiken für die Betroffenen und ihr Umfeld.${hinweis}

Mit freundlichen Grüßen
${name}`
  return { body, empf }
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText)
    return navigator.clipboard.writeText(text)
  // Fallback für Kontexte ohne Clipboard-API (z. B. manche file://-Browser).
  const helper = document.createElement("textarea")
  helper.value = text
  document.body.append(helper)
  helper.select()
  document.execCommand("copy")
  helper.remove()
  return Promise.resolve()
}

function flash(button, label) {
  const original = button.textContent
  button.textContent = label
  setTimeout(() => {
    button.textContent = original
  }, 1800)
}

for (const button of document.querySelectorAll(".copy-rows .copy-mini")) {
  button.addEventListener("click", () => {
    const text =
      button.dataset.copy ||
      button.closest("dd").querySelector("span").textContent
    copyToClipboard(text).then(() => flash(button, "✓ Kopiert"))
  })
}

const copyTextButton = document.getElementById("mdep-copy-text")
copyTextButton.addEventListener("click", () => {
  // innerText statt textContent: erhält Zeilenumbrüche, die beim Bearbeiten
  // der contenteditable-Vorschau als <br>/<div> entstehen.
  copyToClipboard(document.getElementById("mdep-text").innerText).then(() =>
    flash(copyTextButton, "✓ Kopiert"),
  )
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
  const { body, empf } = buildBrief()
  const emails = empf.map((e) => e.email).join(",")
  document.getElementById("mdep-text").textContent = body
  document.getElementById("mdep-emails").textContent = emails
  document.getElementById("mdep-names").textContent = empf
    .map((e) => e.name)
    .join(", ")
  document.getElementById("mdep-copy-empf").dataset.copy = emails
  document.getElementById("mdep-mailto").href =
    "mailto:" + emails + "?subject=" + encodeURIComponent(SUBJECT)
  const out = document.getElementById("mdep-out")
  out.hidden = false
  out.scrollIntoView({ behavior: "smooth", block: "nearest" })
})
