import type { Language } from "@/lib/i18n"

// "What happens to your data", told as one thread: an invented customer,
// Max, opens an account with a crypto provider. The provider keeps his
// records and reports him to the tax authority every year; his home
// address also sits in the population register and with the shop that
// sent his hardware wallet. Then each of these three places is shown
// losing data in a real case, and the three copies are joined into one
// file that leads to his front door. Further places that hold data appear
// faintly as context. The cases and their sources live in
// src/data/leaks.ts; the legal facts follow the dossier (§ 21 FM-GwG,
// § 18 and § 20 Krypto-MPfG, Directive (EU) 2024/1640).

type Text = Record<Language, string>

export type Place =
  | "you"
  | "provider"
  | "taxOffice"
  | "residents"
  | "shop"
  | "vendor"
  | "accounts"
  | "foreign"
  | "crooks"

export interface Node {
  id: Place
  name: Text
  // A shorter name for narrow screens, where the name is longer.
  brief?: Text
  // What the place keeps, in at most two short lines.
  holds?: Record<Language, string[]>
  // The scene in which the place appears, and its turn within it.
  scene: number
  order?: number
  // Further places that also hold data: shown faintly, without a case.
  context?: boolean
  // A real case at a place of this kind, from src/data/leaks.ts, and the
  // short line under it.
  leak?: string
  tag?: Text
  // Only if Max lived in another EU country.
  maybe?: boolean
}

export const nodes: Node[] = [
  {
    id: "you",
    name: { de: "Max", en: "Max" },
    holds: { de: ["kauft Bitcoin"], en: ["buys bitcoin"] },
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
    order: 1,
    leak: "coinbase",
    tag: { de: "69.461 Kunden", en: "69,461 customers" },
  },
  {
    id: "taxOffice",
    name: { de: "Finanzamt", en: "Tax authority" },
    holds: {
      de: ["jedes Jahr eine Meldung,", "ohne Wallet-Adressen"],
      en: ["a report every year,", "no wallet addresses"],
    },
    scene: 1,
    order: 0,
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
    order: 1,
    leak: "gis",
    tag: { de: "5 Mio. Menschen", en: "5 million people" },
  },
  {
    id: "shop",
    name: { de: "Wallet-Shop", en: "Wallet shop" },
    holds: {
      de: ["Name, Wohnadresse,", "Telefonnummer"],
      en: ["name, home address,", "phone number"],
    },
    scene: 1,
    order: 2,
    leak: "ledger",
    tag: { de: "272.000 Käufer", en: "272,000 buyers" },
  },
  {
    id: "vendor",
    name: { de: "Dienstleister", en: "Contractors" },
    scene: 1,
    order: 3,
    context: true,
  },
  {
    id: "accounts",
    name: { de: "Kontenregister", en: "Account register" },
    brief: { de: "Kontenregister", en: "Accounts" },
    scene: 1,
    order: 4,
    context: true,
  },
  {
    id: "foreign",
    name: { de: "Steuerbehörde im EU-Ausland", en: "Tax authority abroad" },
    brief: { de: "EU-Ausland", en: "Abroad" },
    scene: 1,
    order: 5,
    context: true,
    maybe: true,
  },
  {
    id: "crooks",
    name: { de: "Betrüger und Erpresser", en: "Fraudsters, extortionists" },
    brief: { de: "Betrüger, Erpresser", en: "Fraudsters" },
    scene: 2,
  },
]

// Who passes data to whom. A line appears with the place it leads to; the
// report line carries a packet a year.
export const edges: { from: Place; to: Place }[] = [
  { from: "you", to: "provider" },
  { from: "provider", to: "taxOffice" },
  { from: "you", to: "residents" },
  { from: "you", to: "shop" },
  { from: "provider", to: "vendor" },
  { from: "provider", to: "accounts" },
  { from: "taxOffice", to: "foreign" },
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
      de: "Max eröffnet ein Konto bei einer Krypto-Börse und zeigt dafür seinen Ausweis. Der Anbieter speichert ihn mit Wallet-Adressen und jeder Transaktion, **bis zehn Jahre nach Ende der Kundenbeziehung.**",
      en: "Max opens an account with a crypto exchange and shows his ID. The provider keeps it with his wallet addresses and every transaction, **until ten years after he leaves.**",
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
      de: "Ab 2027 meldet der Anbieter jedes Jahr ans Finanzamt, ohne Wallet-Adressen, und hebt jede Meldung zehn Jahre auf. **Seine Wohnadresse kennen auch Melderegister und Wallet-Shop.**",
      en: "From 2027 the provider reports to the tax authority every year, without wallet addresses, and keeps each report for ten years. **The population register and the wallet shop know his home address too.**",
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
      de: "2025 gaben bestochene Support-Mitarbeiter einer Börse Daten von 69.461 Kunden weiter, bis hin zu Ausweisbildern. **Auch Wallet-Shops und Melderegister haben schon Daten verloren.**",
      en: "In 2025, bribed support staff at an exchange passed on data on 69,461 customers, down to ID images. **Wallet shops and population registers have lost data too.**",
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
      de: "Wohnadresse aus dem Melderegister, Hardware-Wallet aus dem Shop, Ausweis und Kontostand von der Börse. **Software führt das in Minuten zusammen, einer KI genügt ein Satz.**",
      en: "Home address from the population register, hardware wallet from the shop, ID and balance from the exchange. **Software joins them in minutes, and an AI needs one sentence.**",
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
  {
    id: "drinnen",
    short: { de: "Drinnen", en: "Inside" },
    eyebrow: { de: "06 Hinter der Tür", en: "06 Behind the door" },
    heading: {
      de: "Wer die Liste hat, weiß, was drinnen liegt.",
      en: "Whoever has the list knows what is inside.",
    },
    text: {
      de: "Hardware-Wallet, Kontostand, Wohnadresse: Zusammen sagen sie Tätern, wo sich ein Einbruch lohnt. **Darum sollte niemand wissen, wer wie viel Bitcoin hat.**",
      en: "Hardware wallet, balance, home address: together they tell offenders where a break-in pays. **That is why nobody should know who holds how much bitcoin.**",
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
    label: { de: "Kontostand", en: "Balance" },
    value: { de: "mit allen Transaktionen", en: "with all transactions" },
    from: "coinbase",
  },
]

// The sentence typed into the search, and what it finds.
export const search = {
  label: { de: "Suchauftrag an eine KI", en: "Prompt to an AI" },
  query: {
    de: "Gleiche die Listen ab und sortiere alle in Wien, die Bitcoin haben, nach Bestand.",
    en: "Match the lists and rank everyone in Vienna who holds bitcoin by holdings.",
  },
  result: {
    de: "Zielliste Wien · 07 · Max Mustermann",
    en: "Target list Vienna · 07 · Max Mustermann",
  },
}

// A short note under the network.
export const note = {
  de: "Max ist erfunden, die Fälle sind echt.",
  en: "Max is invented, the cases are real.",
}

function same(text: string): Text {
  return { de: text, en: text }
}
