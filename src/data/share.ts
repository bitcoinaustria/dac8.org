import type { Language } from "@/lib/i18n"

type Text = Record<Language, string>

// Ready-made social graphics from the artwork lab's share kit
// (knowledge/share-kit/{de,en}/scene-*/{square,story}.png). They follow the
// home page story and the legal route. The squares are exported as JPEG to
// public/share/. The stories are exported to src/assets/share/ and get `text`
// and `note` set into the free space at build time
// (src/pages/share/[language]/[scene]-story.jpg.ts), so a story works as a
// post on its own. The text restates the home page scenes; change both
// together. `note` keeps the home page's "Im Bild" distinction between
// linked or leaked records and the annual report.
export const shareScenes: {
  id: string
  title: Text
  text: Text
  note?: Text
}[] = [
  {
    id: "scene-01-customer",
    title: {
      de: "Dein Konto wird zur Akte.",
      en: "Your account becomes a file.",
    },
    text: {
      de: "Du kaufst Kryptowerte bei einer Börse oder einem Broker in Österreich. Seit 2026 bereitet der Anbieter daraus jedes Jahr deine Identität und Jahreswerte für das Finanzamt auf.",
      en: "You buy crypto-assets from an exchange or broker in Austria. Since 2026, the provider has been preparing your identity and annual aggregates for the tax authority every year.",
    },
  },
  {
    id: "scene-02-processing",
    title: {
      de: "Alle erfasst. Ohne Verdacht.",
      en: "Everyone recorded. Without suspicion.",
    },
    text: {
      de: "Der Anbieter muss die Meldedaten für alle Kunden aufbereiten, auch für jene, die am Ende gar nicht gemeldet werden. Das verlangt das österreichische Gesetz, über die EU-Richtlinie hinaus.",
      en: "Providers must prepare reporting data for all customers, including those who will not ultimately be reported. Austrian law requires this, going beyond the EU directive.",
    },
  },
  {
    id: "scene-03-report",
    title: { de: "Was wird gemeldet?", en: "What gets reported?" },
    text: {
      de: "Name, Anschrift, Steuerwohnsitz, Steuernummer und Geburtsdatum. Dazu je Kryptowert der Wert in Euro und die Stückzahl: wie viel du im Jahr kaufst, verkaufst, tauschst und auf eigene Wallets überträgst.",
      en: "Name, address, tax residence, tax number and date of birth. Plus the value in euros and the units for each crypto-asset: how much you buy, sell, exchange and transfer to your own wallets in a year.",
    },
    note: {
      de: "Im Bild: ein Musterblatt für eine natürliche Person, kein amtliches Formular.",
      en: "Pictured: a specimen for a natural person, not an official form.",
    },
  },
  {
    id: "scene-04-retention",
    title: {
      de: "Jedes Jahr mehr über dich.",
      en: "More about you. Every year.",
    },
    text: {
      de: "Die Meldung kommt jedes Jahr, ohne Enddatum, und beim Anbieter bleibt jede zehn Jahre gespeichert. Bleibst du Kunde, liegt dort ab 2036 laufend ein ganzes Jahrzehnt deiner Kryptogeschäfte.",
      en: "The report comes every year, with no end date, and the provider keeps each one for ten years. If you remain a customer, from 2036 there will always be a full decade of your crypto activity on file.",
    },
    note: {
      de: "Im Bild: die Jahresmeldungen einer Person nach einem, fünf und zehn Jahren.",
      en: "Pictured: one person’s annual reports after one, five and ten years.",
    },
  },
  {
    id: "scene-05-leak",
    title: {
      de: "Ein Datenleck. Persönliche Folgen.",
      en: "A data leak. Personal consequences.",
    },
    text: {
      de: "Beim Anbieter liegt weit mehr als die Meldung: dein Ausweis, deine Wallet-Adressen und jede einzelne Transaktion. Ein Leck dort legt offen, welche Adressen zu deinem Namen gehören.",
      en: "Your provider holds far more than the report: your ID, your wallet addresses and every single transaction. A breach there reveals which blockchain addresses belong to your name.",
    },
    note: {
      de: "Im Bild: verknüpfte Daten, wie sie ein Leck beim Anbieter offenlegen kann.",
      en: "Pictured: linked data of the kind a provider breach can expose.",
    },
  },
  {
    id: "scene-06-risk",
    title: {
      de: "Sortierbar nach Vermögen. Gefährlich in falschen Händen.",
      en: "Sortable by wealth. Dangerous in the wrong hands.",
    },
    text: {
      de: "Aus den Jahreswerten mehrerer Jahre lässt sich grob schätzen, wer viel Geld in Krypto bewegt. Für Täter reicht eine Liste von Menschen, die vermögend wirken.",
      en: "Several years of annual totals give a rough estimate of who moves a lot of money in crypto. For criminals, a list of people who appear wealthy is enough.",
    },
    note: {
      de: "Im Bild: eine Zielliste aus verknüpften, geleakten Daten.",
      en: "Pictured: a target list built from linked, leaked data.",
    },
  },
  {
    // Restates the procedural status in src/data/campaign.ts; update it
    // together with that status.
    id: "scene-07-route",
    title: { de: "Datensammlung anfechten.", en: "Challenge data collection." },
    text: {
      de: "Wir sind überzeugt, dass die anlasslose Erfassung aller Kunden gegen Grundrechte verstößt. Bitcoin Austria bereitet ein Verfahren bei der Datenschutzbehörde vor, mit dem Ziel einer Klärung bis vor den Europäischen Gerichtshof.",
      en: "We are convinced that recording every customer without suspicion violates fundamental rights. Bitcoin Austria is preparing proceedings before the Data Protection Authority, aiming for a ruling all the way up to the EU Court of Justice.",
    },
  },
  {
    id: "scene-08-support",
    title: {
      de: "Gemeinsam Privatsphäre verteidigen.",
      en: "Together, defend privacy.",
    },
    text: {
      de: "Mit deiner Spende bezahlen wir das Verfahren. Und schreib deinen Abgeordneten: Der Nationalrat kann das Gesetz ändern. Alles dazu auf dac8.org/mitmachen",
      en: "Your donation funds the case. And write to your MPs: the Austrian parliament can change the law. Find out how at dac8.org/en/get-involved",
    },
  },
]

export const shareFile = (
  language: Language,
  id: string,
  format: "square" | "story",
) => `/share/${language}/${id}-${format}.jpg`
