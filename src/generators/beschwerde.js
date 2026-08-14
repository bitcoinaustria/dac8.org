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
      ? " In meinem Fall werden meine Daten in Österreich erhoben, an die österreichische Finanzverwaltung gemeldet und sollen von dort an die Steuerbehörde meines Wohnsitzstaates " +
        land +
        " übermittelt werden."
      : ""
  return `Sehr geehrte Damen und Herren,

ich erhebe Beschwerde gemäß Art. 77 DSGVO in Verbindung mit § 24 DSG.

1. Beschwerdeführer
${vorname} ${nachname}, ${strasse}, ${plz} ${ort}, ${land}${email ? "; E-Mail: " + email : ""}.
Ich bin eine von der unten geschilderten Verarbeitung unmittelbar betroffene natürliche Person.

2. Beschwerdegegnerische Partei
Bundesministerium für Finanzen, Johannesgasse 5, 1010 Wien — als die für den automatischen internationalen Austausch der Krypto-Daten zuständige Behörde (§ 21 Krypto-MPfG); die Meldungen der Anbieter ergehen an das zuständige Finanzamt (§§ 3, 18 f Krypto-MPfG).

3. Als verletzt erachtete Rechte
Grundrecht auf Geheimhaltung (§ 1 Abs. 1 DSG); Datenminimierung und Zweckbindung (Art. 5 Abs. 1 lit. b und c DSGVO); Rechtmäßigkeit der Verarbeitung (Art. 6 DSGVO); Art. 7 und 8 der EU-Grundrechtecharta.

4. Sachverhalt
Ich kaufe bzw. halte Bitcoin über ${boerse}, eine in Österreich niedergelassene Anbieterin von Krypto-Dienstleistungen. Seit dem Inkrafttreten des Krypto-Meldepflichtgesetzes (Krypto-MPfG, BGBl. I Nr. 96/2025) am 1. Jänner 2026 — der österreichischen Umsetzung von DAC8 (Richtlinie (EU) 2023/2226) — ist dieser Anbieter verpflichtet, personenbezogene Daten sämtlicher Kunden laufend zu erfassen und aufzubewahren, und zwar gemäß § 20 Abs. 1 Krypto-MPfG für alle Kunden hinsichtlich aller Transaktionen und Kryptowerte, unabhängig davon, ob eine Meldepflicht besteht. Jährlich sind diese Daten an das zuständige Finanzamt zu melden (Identität, Steueridentifikationsnummer, Art der Kryptowerte sowie Beträge, Einheiten und Transaktionszahlen; §§ 18 f Krypto-MPfG); die erste Meldung hat bis 31. Juli 2027 zu erfolgen, der erste automatische Austausch mit den Steuerbehörden anderer Staaten bis 30. September 2027 (§ 21 Krypto-MPfG). Die betroffenen Personen werden vor der Übermittlung weder informiert noch angehört.${grenz} Die Erfassung erfolgt anlasslos und flächendeckend und trifft auch mich allein deshalb, weil ich Krypto-Werte halte.

5. Gründe der Rechtswidrigkeit
Die anlasslose, flächendeckende Erfassung verstößt gegen Datenminimierung und Verhältnismäßigkeit (Art. 5 DSGVO, § 1 DSG) und greift unverhältnismäßig in Art. 7 und 8 GRC ein. Der EuGH hat anlasslose Vorratsdatenspeicherung und pauschale Transparenzregime wiederholt verworfen (Digital Rights Ireland, C-293/12 und C-594/12; La Quadrature du Net, C-511/18 u. a.; WM und Sovim, C-37/20 und C-601/20). Zudem existiert ein milderes Mittel (Auskunftsverlangen im Einzelfall, § 143 BAO), und die zentrale Zusammenführung sensibler Krypto-Daten schafft ein erhebliches Missbrauchs- und Sicherheitsrisiko.

6. Begehren
Ich beantrage die Feststellung, dass die Verarbeitung mich in den genannten Rechten verletzt; soweit zulässig die Einschränkung bzw. Unterlassung der bevorstehenden Übermittlung meiner Daten; sowie die Anregung, die Frage der Vereinbarkeit mit Art. 7, 8 GRC dem Gerichtshof der Europäischen Union gemäß Art. 267 AEUV zur Vorabentscheidung vorzulegen.

7. Rechtzeitigkeit
Die beanstandete Verarbeitung ist ein andauernder Zustand, der am 1. Jänner 2026 begonnen hat und fortbesteht; Kenntnis von der mich konkret betreffenden Verarbeitung erlangte ich am ${datum || heute}. Die Beschwerde ist daher fristgerecht iSd § 24 Abs. 4 DSG.

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

const copyTextButton = document.getElementById("copy-text")
copyTextButton.addEventListener("click", () => {
  // innerText statt textContent: erhält Zeilenumbrüche, die beim Bearbeiten
  // der contenteditable-Vorschau als <br>/<div> entstehen.
  copyToClipboard(document.getElementById("text").innerText).then(() =>
    flash(copyTextButton),
  )
})

form.addEventListener("submit", (event) => {
  event.preventDefault()
  document.getElementById("text").textContent = buildText()
  const out = document.getElementById("out")
  out.hidden = false
  out.scrollIntoView({ behavior: "smooth", block: "nearest" })
})
