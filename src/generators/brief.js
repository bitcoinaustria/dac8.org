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

Mit DAC8 (Richtlinie (EU) 2023/2226) werden seit 1. Jänner 2026 Identität und Transaktionsdaten praktisch aller Krypto-Nutzer in der EU laufend erfasst — anlasslos, flächendeckend, ohne Verdacht und ohne dass die Betroffenen vorab informiert oder angehört werden. Ab 2027 werden diese Daten automatisch zwischen den Steuerbehörden ausgetauscht. Erfasst wird nicht, weil jemand etwas getan hat, sondern weil er etwas besitzt.

Der Europäische Gerichtshof hat anlasslose Vorratsdatenspeicherung und pauschale Transparenzregime wiederholt als unverhältnismäßig verworfen (Digital Rights Ireland, C-293/12 und C-594/12; La Quadrature du Net, C-511/18 u. a.; WM und Sovim, C-37/20 und C-601/20). Das mildere Mittel existiert: Steuerbehörden können im Einzelfall gezielt Auskunft verlangen. Und jede zentrale Sammlung von Vermögensdaten ist nur so sicher wie ihr schwächstes Glied — geleakte Daten über Krypto-Halter haben nachweislich zu Erpressung und Entführungen geführt, auch gegen Angehörige, die selbst nie Kryptowerte besessen haben.

Gegen diese Massenerfassung wird derzeit eine Petition an das Europäische Parlament vorbereitet. Ich bitte Sie, sie aufzugreifen, sobald sie vorliegt, und sich schon jetzt für eine verhältnismäßige, datenschutzkonforme Ausgestaltung von DAC8 einzusetzen: gezielte statt anlassloser Erfassung, Datenminimierung, wirksame Betroffenenrechte und eine unabhängige Grundrechts-Folgenabschätzung.${hinweis}

Der Staat darf Steuern einheben und durchsetzen. Er muss dafür nicht das Vermögen aller sichtbar machen.

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

function flash(button) {
  button.classList.add("copied")
  setTimeout(() => button.classList.remove("copied"), 1800)
}

for (const button of document.querySelectorAll(".copy-rows .copy-mini")) {
  button.addEventListener("click", () => {
    const text =
      button.dataset.copy ||
      button.closest("dd").querySelector("span").textContent
    copyToClipboard(text).then(() => flash(button))
  })
}

const copyTextButton = document.getElementById("mdep-copy-text")
copyTextButton.addEventListener("click", () => {
  // innerText statt textContent: erhält Zeilenumbrüche, die beim Bearbeiten
  // der contenteditable-Vorschau als <br>/<div> entstehen.
  copyToClipboard(document.getElementById("mdep-text").innerText).then(() =>
    flash(copyTextButton),
  )
})

// Live-Vorschau: jede Eingabe rendert die E-Mail neu — bis jemand direkt in
// der Vorschau editiert; ab dann gehört der Text ihm. Empfängerzeile und
// mailto-Link folgen der Länderauswahl immer.
const messageEl = document.getElementById("mdep-text")
let handbearbeitet = false
messageEl.addEventListener("input", () => {
  handbearbeitet = true
})

function render() {
  const { body, empf } = buildBrief()
  const emails = empf.map((e) => e.email).join(",")
  if (!handbearbeitet) messageEl.textContent = body
  document.getElementById("mdep-emails").textContent = emails
  document.getElementById("mdep-names").textContent = empf
    .map((e) => e.name)
    .join(", ")
  document.getElementById("mdep-copy-empf").dataset.copy = emails
  document.getElementById("mdep-mailto").href =
    "mailto:" + emails + "?subject=" + encodeURIComponent(SUBJECT)
}

form.addEventListener("input", render)
form.addEventListener("submit", (event) => event.preventDefault())
render()
