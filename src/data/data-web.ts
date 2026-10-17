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
  // The scene in which the place appears, and its turn within it.
  scene: number
  order?: number
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
    scene: 0,
    order: 0,
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
    scene: 0,
    order: 1,
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
    scene: 0,
    order: 2,
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
    scene: 0,
    order: 3,
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
    scene: 1,
    order: 0,
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
    scene: 1,
    order: 1,
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
    scene: 1,
    order: 2,
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
    scene: 1,
    order: 3,
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
    scene: 2,
  },
]

// Who passes data to whom. A line appears with the place it leads to; the
// report line carries a packet a year.
export const edges: { from: Place; to: Place }[] = [
  { from: "you", to: "provider" },
  { from: "provider", to: "vendor" },
  { from: "you", to: "shop" },
  { from: "you", to: "taxApp" },
  { from: "provider", to: "taxOffice" },
  { from: "taxOffice", to: "foreign" },
  { from: "provider", to: "accounts" },
  { from: "you", to: "residents" },
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
    id: "konto",
    short: { de: "Konto", en: "Account" },
    eyebrow: { de: "01 Dein Anbieter", en: "01 Your provider" },
    heading: {
      de: "Dein Konto wird zur Akte.",
      en: "Your account becomes a file.",
    },
    text: {
      de: "Ausweis, Wallet-Adressen und jede Transaktion speichert dein Anbieter nach den Geldwäschevorschriften, **bis zehn Jahre nach Ende der Kundenbeziehung.** Dazu kommen Dienstleister, Shop und Steuer-App.",
      en: "Your provider keeps your ID, wallet addresses and every transaction under anti-money-laundering rules, **until ten years after you leave.** Contractors, the wallet shop and the tax app add more.",
    },
  },
  {
    id: "staat",
    short: { de: "Jedes Jahr", en: "Every year" },
    eyebrow: { de: "02 DAC8", en: "02 DAC8" },
    heading: {
      de: "Jedes Jahr mehr über dich.",
      en: "More about you. Every year.",
    },
    text: {
      de: "Ab 2027 meldet der Anbieter jedes Jahr ans Finanzamt, **ohne Wallet-Adressen,** und hebt jede Meldung zehn Jahre auf. Lebst du in einem anderen EU-Staat, geht sie dorthin weiter.",
      en: "From 2027 the provider reports to the tax authority every year, **without wallet addresses,** and keeps each report for ten years. If you live in another EU country, it goes on there.",
    },
  },
  {
    id: "lecks",
    short: { de: "Lecks", en: "Leaks" },
    eyebrow: { de: "03 Datenlecks", en: "03 Data leaks" },
    heading: {
      de: "Gespeichert. Gehackt. Verkauft.",
      en: "Stored. Hacked. Sold.",
    },
    text: {
      de: "Je mehr an einer Stelle liegt und je länger, desto lohnender der Einbruch. **Stellen wie diese haben alle schon Daten verloren.**",
      en: "The more sits in one place and the longer, the more a break-in pays. **Places like these have all lost data before.**",
    },
  },
  {
    id: "abgleich",
    short: { de: "Abgleich", en: "Matching" },
    eyebrow: { de: "04 Abgleich", en: "04 Matching" },
    heading: {
      de: "Getrennt verrät jede Liste wenig. Zusammen eine Akte.",
      en: "Apart, each list says little. Together, a file.",
    },
    text: {
      de: "Listen über Name, Anschrift oder Handynummer zusammenzuführen, erledigt Software in Minuten. **Einer KI genügt ein Satz.**",
      en: "Software joins lists on name, home address or mobile number in minutes. **An AI needs one sentence.**",
    },
  },
  {
    id: "risiko",
    short: { de: "Haustür", en: "Front door" },
    eyebrow: { de: "05 Das Risiko", en: "05 The risk" },
    heading: {
      de: "Dein Profil. Deine Wohnadresse. Ein Angriffsziel.",
      en: "Your profile. Your home address. A target.",
    },
    text: {
      de: "Bitcoin funktioniert wie Bargeld. Laut Gendarmerie wählen Täter ihre Opfer anhand geleakter Daten aus. **Allein im ersten Halbjahr 2026 zählte Frankreich 77 Entführungen, Freiheitsberaubungen und Erpressungen** rund um Kryptowerte.",
      en: "Bitcoin works like cash. According to the Gendarmerie, offenders pick their victims from leaked data. **In the first half of 2026 alone, France counted 77 kidnappings, unlawful detentions and extortions** around crypto-assets.",
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
