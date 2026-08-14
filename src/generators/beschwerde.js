// DSGVO-Beschwerde-Generator. Läuft ausschließlich im Browser; keine Eingabe
// verlässt das Gerät. Textbausteine aus dem Handover-Paket (dac8-prototyp_v2).
const SUBJECT =
  "Datenschutzbeschwerde gemäß Art. 77 DSGVO iVm § 24 DSG — anlasslose Massenerfassung von Krypto-Daten (DAC8 / Krypto-MPfG)"

const form = document.getElementById("beschwerde-form")
const boerseSelect = document.getElementById("boerse")
const boerseAndersWrap = document.getElementById("boerse-anders-wrap")
const boerseAndersInput = document.getElementById("boerse-anders")

document.getElementById("datum").valueAsDate = new Date()
document.getElementById("mailto").href =
  "mailto:dsb@dsb.gv.at?subject=" + encodeURIComponent(SUBJECT)

boerseSelect.addEventListener("change", () => {
  const andere = boerseSelect.value === "andere"
  boerseAndersWrap.hidden = !andere
  boerseAndersInput.required = andere
})

const val = (id) => document.getElementById(id).value.trim()

function fmtDate(iso) {
  if (!iso) return ""
  const [y, m, d] = iso.split("-")
  return `${d}.${m}.${y}`
}

function buildText() {
  const vorname = val("vorname")
  const nachname = val("nachname")
  const strasse = val("strasse")
  const plz = val("plz")
  const ort = val("ort")
  const land = val("land")
  const email = val("email")
  const datum = fmtDate(val("datum"))
  let boerse = boerseSelect.value
  if (boerse === "andere")
    boerse =
      val("boerse-anders") ||
      "einer in Österreich niedergelassenen Krypto-Börse"
  const heute = fmtDate(new Date().toISOString().slice(0, 10))
  const grenz =
    land !== "Österreich"
      ? " In meinem Fall werden meine Daten in Österreich erhoben, an das österreichische BMF gemeldet und von dort an die Steuerbehörde meines Wohnsitzstaates " +
        land +
        " übermittelt."
      : ""
  return `Sehr geehrte Damen und Herren,

ich erhebe Beschwerde gemäß Art. 77 DSGVO in Verbindung mit § 24 DSG.

1. Beschwerdeführer
${vorname} ${nachname}, ${strasse}, ${plz} ${ort}, ${land}${email ? "; E-Mail: " + email : ""}.
Ich bin eine von der unten geschilderten Verarbeitung unmittelbar betroffene natürliche Person.

2. Beschwerdegegnerische Partei
Bundesministerium für Finanzen, Johannesgasse 5, 1010 Wien — als für die Sammlung, Speicherung und den automatischen zwischenstaatlichen Austausch der Krypto-Daten verantwortliche Stelle.

3. Als verletzt erachtete Rechte
Grundrecht auf Geheimhaltung (§ 1 Abs. 1 DSG); Datenminimierung und Zweckbindung (Art. 5 Abs. 1 lit. b und c DSGVO); Rechtmäßigkeit der Verarbeitung (Art. 6 DSGVO); Art. 7 und 8 der EU-Grundrechtecharta.

4. Sachverhalt
Ich kaufe bzw. halte Bitcoin über ${boerse}, eine in Österreich niedergelassene Anbieterin von Krypto-Dienstleistungen. Seit dem Inkrafttreten des Krypto-Meldepflichtgesetzes (Krypto-MPfG, BGBl. I Nr. 96/2025) am 1. Jänner 2026 — der österreichischen Umsetzung von DAC8 (Richtlinie (EU) 2023/2226) — ist dieser Anbieter verpflichtet, personenbezogene Daten sämtlicher Kunden zu erheben und jährlich an das Bundesministerium für Finanzen zu melden (Identität, Steueridentifikationsnummer, Art der Kryptowerte sowie Beträge, Einheiten und Transaktionszahlen). Diese Daten werden gesammelt und im Wege des automatischen Informationsaustauschs an die Steuerbehörden anderer Staaten übermittelt. Die betroffenen Personen werden vor der Übermittlung weder informiert noch angehört.${grenz} Die Erfassung erfolgt anlasslos und flächendeckend und trifft auch mich allein deshalb, weil ich Krypto-Werte halte.

5. Gründe der Rechtswidrigkeit
Die anlasslose, flächendeckende Erfassung verstößt gegen Datenminimierung und Verhältnismäßigkeit (Art. 5 DSGVO, § 1 DSG) und greift unverhältnismäßig in Art. 7 und 8 GRC ein. Der EuGH hat anlasslose Massenerfassung wiederholt verworfen (Digital Rights Ireland; La Quadrature du Net; WM und Sovim). Zudem existiert ein milderes Mittel (gezielte, anlassbezogene Auskunft), und die zentrale Zusammenführung sensibler Krypto-Daten schafft ein erhebliches Missbrauchs- und Sicherheitsrisiko.

6. Begehren
Ich beantrage die Feststellung, dass die Verarbeitung mich in den genannten Rechten verletzt; soweit zulässig die Einschränkung/Unterlassung der weiteren Übermittlung meiner Daten; sowie die Anregung, die Frage der Vereinbarkeit mit Art. 7, 8 GRC dem Gerichtshof der Europäischen Union gemäß Art. 267 AEUV zur Vorabentscheidung vorzulegen.

7. Rechtzeitigkeit
Die laufende Verarbeitung besteht seit 1. Jänner 2026; Kenntnis am ${datum || heute}. Die Beschwerde ist fristgerecht iSd § 24 Abs. 4 DSG.

8. Betroffenheit
Meine Betroffenheit ergibt sich aus meiner Kundenbeziehung zu ${boerse}.

${ort}, ${heute}
${vorname} ${nachname}`
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

for (const button of document.querySelectorAll(".copy-glyph")) {
  button.addEventListener("click", () => {
    const text =
      button.dataset.copy ||
      button.closest("dd").querySelector("span").textContent
    copyToClipboard(text).then(() => flash(button, "✓"))
  })
}

const copyTextButton = document.getElementById("copy-text")
copyTextButton.addEventListener("click", () => {
  copyToClipboard(document.getElementById("text").value).then(() =>
    flash(copyTextButton, "✓ Kopiert"),
  )
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
  document.getElementById("text").value = buildText()
  const out = document.getElementById("out")
  out.hidden = false
  out.scrollIntoView({ behavior: "smooth", block: "nearest" })
})
