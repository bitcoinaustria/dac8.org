import type { Language } from "@/lib/i18n"

// "Where your data goes": an invented reader, Max Mustermann, buys bitcoin
// once. The story follows his data to every place that keeps a copy, by
// law or in practice, shows that places like each of them have lost data
// in a real case, and how the copies come together again in the wrong
// hands. The cases and their sources live in src/data/leaks.ts; the legal
// facts follow the dossier (§ 21 FM-GwG, § 18 and § 20 Krypto-MPfG,
// Directive (EU) 2024/1640).

type Text = Record<Language, string>

export type Place =
  | "you"
  | "provider"
  | "vendor"
  | "shop"
  | "taxApp"
  | "taxOffice"
  | "foreign"
  | "accounts"
  | "residents"
  | "crooks"

export interface Node {
  id: Place
  name: Text
  // A shorter name for narrow screens, where the name is longer.
  brief?: Text
  // What the place keeps, in at most two short lines.
  holds: Record<Language, string[]>
  // The scene in which the place appears.
  scene: number
  // A real case at a place of this kind, from src/data/leaks.ts, and a
  // short line for the tag beside the node.
  leak?: string
  tag?: Text
  // Only if Max lived in another EU country.
  maybe?: boolean
}

export const nodes: Node[] = [
  {
    id: "you",
    name: { de: "Max", en: "Max" },
    holds: { de: ["kauft einmal Bitcoin"], en: ["buys bitcoin once"] },
    scene: 0,
  },
  {
    id: "provider",
    name: { de: "Krypto-Anbieter", en: "Crypto provider" },
    brief: { de: "Anbieter", en: "Provider" },
    holds: {
      de: ["Ausweis, Wallet-Adressen,", "jede Transaktion"],
      en: ["ID, wallet addresses,", "every transaction"],
    },
    scene: 1,
    leak: "coinbase",
    tag: { de: "69.461 Kunden", en: "69,461 customers" },
  },
  {
    id: "vendor",
    name: { de: "Dienstleister", en: "Contractors" },
    holds: {
      de: ["Ausweisprüfung, Support,", "Newsletter"],
      en: ["ID checks, support,", "newsletters"],
    },
    scene: 2,
    leak: "fractal-id",
    tag: { de: "Ausweisbilder", en: "ID images" },
  },
  {
    id: "shop",
    name: { de: "Wallet-Shop", en: "Wallet shop" },
    holds: {
      de: ["Name, Wohnadresse,", "Telefonnummer"],
      en: ["name, home address,", "phone number"],
    },
    scene: 2,
    leak: "ledger",
    tag: { de: "272.000 Käufer", en: "272,000 buyers" },
  },
  {
    id: "taxApp",
    name: { de: "Steuer-App", en: "Tax app" },
    holds: {
      de: ["Bestände, Gewinne", "und Verluste"],
      en: ["holdings, gains", "and losses"],
    },
    scene: 2,
    leak: "waltio",
    tag: { de: "Jahresendbestände", en: "year-end holdings" },
  },
  {
    id: "taxOffice",
    name: { de: "Finanzamt", en: "Tax authority" },
    holds: {
      de: ["ab 2027 jedes Jahr", "eine DAC8-Meldung"],
      en: ["from 2027 a DAC8", "report every year"],
    },
    scene: 3,
    leak: "austria",
    tag: { de: "private Abfragen", en: "private queries" },
  },
  {
    id: "foreign",
    name: { de: "Steuerbehörde im EU-Ausland", en: "Tax authority elsewhere" },
    brief: { de: "EU-Steuerbehörde", en: "EU tax authority" },
    holds: {
      de: ["wenn du dort lebst,", "mindestens 5 Jahre"],
      en: ["if you live there,", "at least 5 years"],
    },
    scene: 4,
    leak: "bulgaria",
    tag: { de: "6 Mio. Menschen", en: "6 million people" },
    maybe: true,
  },
  {
    id: "accounts",
    name: { de: "Kontenregister", en: "Account register" },
    brief: { de: "Kontenregister", en: "Accounts" },
    holds: {
      de: ["bis 2029 EU-weit vernetzt,", "auch Krypto-Konten"],
      en: ["linked EU-wide by 2029,", "crypto accounts too"],
    },
    scene: 4,
    leak: "france",
    tag: { de: "1,2 Mio. Datensätze", en: "1.2 million records" },
  },
  {
    id: "residents",
    name: { de: "Melderegister", en: "Population register" },
    brief: { de: "Melderegister", en: "Residents" },
    holds: {
      de: ["Name, Geburtsdatum,", "Wohnadresse"],
      en: ["name, date of birth,", "home address"],
    },
    scene: 4,
    leak: "gis",
    tag: { de: "5 Mio. Menschen", en: "5 million people" },
  },
  {
    id: "crooks",
    name: { de: "Betrüger und Erpresser", en: "Fraudsters, extortionists" },
    brief: { de: "Betrüger, Erpresser", en: "Fraudsters" },
    holds: {
      de: ["kaufen und tauschen", "geleakte Listen"],
      en: ["buy and trade", "leaked lists"],
    },
    scene: 5,
  },
]

// Who passes data to whom, and in which scene the line appears. The
// report line carries a packet a year.
export const edges: { from: Place; to: Place; scene: number }[] = [
  { from: "you", to: "provider", scene: 1 },
  { from: "provider", to: "vendor", scene: 2 },
  { from: "you", to: "shop", scene: 2 },
  { from: "you", to: "taxApp", scene: 2 },
  { from: "provider", to: "taxOffice", scene: 3 },
  { from: "taxOffice", to: "foreign", scene: 4 },
  { from: "provider", to: "accounts", scene: 4 },
  { from: "you", to: "residents", scene: 4 },
]

export interface Scene {
  id: string
  // The scene's name on the timeline.
  short: Text
  eyebrow: Text
  heading: Text
  // One key phrase may be marked with **…**; the page sets it in bold.
  text: Text
}

export const scenes: Scene[] = [
  {
    id: "start",
    short: { de: "Start", en: "Start" },
    eyebrow: { de: "Wo deine Daten liegen", en: "Where your data goes" },
    heading: {
      de: "Einmal Bitcoin kaufen. Wer weiß danach alles davon?",
      en: "Buy bitcoin once. Who knows about it afterwards?",
    },
    text: {
      de: "Max ist erfunden, **die Stellen und die Datenlecks sind echt.** Scroll und sieh zu, wohin seine Daten wandern.",
      en: "Max is invented, **the places and the leaks are real.** Scroll and watch where his data travels.",
    },
  },
  {
    id: "anbieter",
    short: { de: "Anbieter", en: "Provider" },
    eyebrow: { de: "Der Anbieter", en: "The provider" },
    heading: {
      de: "Ausweis, Wallet-Adressen, jede Transaktion.",
      en: "ID, wallet addresses, every transaction.",
    },
    text: {
      de: "Wer über eine Börse oder App kauft, zeigt seinen Ausweis. Der Anbieter speichert ihn mit deinen Wallet-Adressen und jeder Übertragung, nach den Regeln gegen Geldwäsche **bis zehn Jahre nach der Kündigung.**",
      en: "Buying through an exchange or app means showing your ID. The provider keeps it with your wallet addresses and every transfer, under anti-money-laundering rules **until ten years after you leave.**",
    },
  },
  {
    id: "rundherum",
    short: { de: "Rundherum", en: "Around it" },
    eyebrow: { de: "Rundherum", en: "All around" },
    heading: {
      de: "Deine Daten bleiben nicht an einem Ort.",
      en: "Your data does not stay in one place.",
    },
    text: {
      de: "Dienstleister prüfen Ausweise, beantworten Supportanfragen und verschicken Newsletter. **Der Shop kennt deine Wohnadresse, die Steuer-App deine Bestände.**",
      en: "Contractors check IDs, answer support requests and send newsletters. **The wallet shop knows your home address, the tax app your holdings.**",
    },
  },
  {
    id: "dac8",
    short: { de: "DAC8", en: "DAC8" },
    eyebrow: { de: "DAC8", en: "DAC8" },
    heading: {
      de: "Ab 2027 geht jedes Jahr eine Meldung ans Finanzamt.",
      en: "From 2027, a report goes to the tax authority every year.",
    },
    text: {
      de: "Name, Anschrift, Geburtsdatum, Steuernummer und die Summen je Kryptowert, **ohne Wallet-Adressen.** Der Anbieter hebt jede Meldung zehn Jahre auf.",
      en: "Name, postal address, date of birth, tax number and the totals per crypto-asset, **without wallet addresses.** The provider keeps each report for ten years.",
    },
  },
  {
    id: "staat",
    short: { de: "Staat", en: "State" },
    eyebrow: { de: "Der Staat", en: "The state" },
    heading: { de: "Und von dort weiter.", en: "And on from there." },
    text: {
      de: "Lebst du in einem anderen EU-Staat, geht die Meldung an die Steuerbehörde dort. **Bis 2029 werden die Kontenregister EU-weit vernetzt** und erfassen auch Krypto-Konten. Deine Wohnadresse steht ohnehin im Melderegister.",
      en: "If you live in another EU country, the report goes to the tax authority there. **By 2029, account registers will be linked across the EU** and cover crypto accounts too. Your home address is in the population register anyway.",
    },
  },
  {
    id: "lecks",
    short: { de: "Lecks", en: "Leaks" },
    eyebrow: { de: "Datenlecks", en: "Data leaks" },
    heading: {
      de: "Stellen wie diese haben alle schon Daten verloren.",
      en: "Places like these have all lost data before.",
    },
    text: {
      de: "Echte Fälle, von Börsen bis zu Finanzverwaltungen. **Was ausläuft, landet bei Betrügern und Erpressern.**",
      en: "Real cases, from exchanges to tax administrations. **What leaks ends up with fraudsters and extortionists.**",
    },
  },
  {
    id: "abgleich",
    short: { de: "Abgleich", en: "Matching" },
    eyebrow: { de: "Abgleich", en: "Matching" },
    heading: {
      de: "Getrennt verrät jede Liste wenig. Zusammen eine Akte.",
      en: "Apart, each list says little. Together, a file.",
    },
    text: {
      de: "Listen über Name, Anschrift oder Handynummer zusammenzuführen, erledigt gewöhnliche Software in Minuten. **Einer KI genügt ein Satz.**",
      en: "Ordinary software joins lists on name, home address or mobile number in minutes. **An AI needs one sentence.**",
    },
  },
  {
    id: "risiko",
    short: { de: "Risiko", en: "Risk" },
    eyebrow: { de: "Das Risiko", en: "The risk" },
    heading: {
      de: "Die Liste führt zur Haustür.",
      en: "The list leads to the front door.",
    },
    text: {
      de: "Bitcoin ist wie Bargeld ein Inhaberwert. Laut Gendarmerie wählen Täter ihre Opfer anhand geleakter Daten aus. **In Frankreich zählte das Innenministerium im ersten Halbjahr 2026 77 Entführungen, Freiheitsberaubungen und Erpressungen** rund um Kryptowerte.",
      en: "Like cash, bitcoin is a bearer asset. According to the Gendarmerie, offenders pick their victims from leaked data. **In France, the interior ministry counted 77 kidnappings, unlawful detentions and extortions** around crypto-assets in the first half of 2026.",
    },
  },
  {
    id: "ende",
    short: { de: "Darum", en: "So" },
    eyebrow: { de: "Darum", en: "That is why" },
    heading: {
      de: "Was nie gesammelt wird, kann nie verloren gehen.",
      en: "What is never collected can never be lost.",
    },
    text: {
      de: "DAC8 legt jedes Jahr eine weitere Kopie an. **Dagegen gehen wir vor, mit Verfahren und mit dir.**",
      en: "DAC8 adds another copy every year. **We are challenging it, in proceedings and with you.**",
    },
  },
]

// The file the matching produces: Max's details and the leak each came
// from. Values are invented and use reserved or masked forms.
export const profile: { label: Text; value: Text; from: string }[] = [
  {
    label: { de: "Name", en: "Name" },
    value: same("Max Mustermann"),
    from: "gis",
  },
  {
    label: { de: "Wohnadresse", en: "Home address" },
    value: {
      de: "Musterstraße 7, 1010 Wien",
      en: "Musterstraße 7, 1010 Vienna",
    },
    from: "gis",
  },
  {
    label: { de: "Handynummer", en: "Mobile number" },
    value: same("+43 660 ··· ·· 07"),
    from: "ledger",
  },
  {
    label: { de: "Hardware-Wallet", en: "Hardware wallet" },
    value: { de: "nach Hause geliefert", en: "delivered home" },
    from: "ledger",
  },
  {
    label: { de: "Ausweis", en: "ID document" },
    value: { de: "Vorder- und Rückseite", en: "front and back" },
    from: "coinbase",
  },
  {
    label: { de: "Bestände", en: "Holdings" },
    value: { de: "Stand Jahresende", en: "at year end" },
    from: "waltio",
  },
]

// The sentence typed into the search, and what it finds.
export const search = {
  label: { de: "Suchauftrag an eine KI", en: "Prompt to an AI" },
  query: {
    de: "Gleiche die Listen ab und zeig mir, wer Bitcoin hat, mit Wohnadresse und Beständen.",
    en: "Match the lists and show me who holds bitcoin, with home address and holdings.",
  },
  result: {
    de: "1 Treffer · Max Mustermann · 1010 Wien",
    en: "1 match · Max Mustermann · 1010 Vienna",
  },
}

function same(text: string): Text {
  return { de: text, en: text }
}
