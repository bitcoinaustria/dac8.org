import type { Language } from "@/lib/i18n"

// "What happens to your data", told as one thread in five short steps: an
// invented customer, Max, leaves his data with an exchange, a tax tool and
// a hardware wallet shop; the exchange reports him to the tax office every
// year; every one of these kinds of place has lost such data in real
// cases; the leaks become a target list; the list leads to his bedroom,
// where his savings lie under the mattress. The cases and their sources
// live in src/data/leaks.ts; the legal facts follow the dossier (§ 21 FM-GwG,
// § 18 and § 20 Krypto-MPfG, Directive (EU) 2024/1640).

type Text = Record<Language, string>

export type Place =
  | "you"
  | "provider"
  | "taxTool"
  | "shop"
  | "taxOffice"
  | "crooks"

export interface Node {
  id: Place
  name: Text
  // The scene in which the place appears, and its turn within it.
  scene: number
  order?: number
  // What the place keeps about Max. It arrives as a grey card and stays;
  // a leak copies it as a red card.
  holds?: Text
  // A real case at a place of this kind, from src/data/leaks.ts.
  leak?: string
}

export const nodes: Node[] = [
  { id: "you", name: { de: "Max", en: "Max" }, scene: 0 },
  {
    id: "provider",
    name: { de: "Börse", en: "Exchange" },
    scene: 0,
    order: 1,
    holds: { de: "Ausweis · Transaktionen", en: "ID · transactions" },
    leak: "coinbase",
  },
  {
    id: "taxTool",
    name: { de: "Steuertool", en: "Tax tool" },
    scene: 0,
    order: 2,
    holds: { de: "Bestände", en: "Holdings" },
    leak: "waltio",
  },
  {
    id: "shop",
    name: { de: "Wallet-Shop", en: "Wallet shop" },
    scene: 0,
    order: 3,
    holds: { de: "Wohnadresse", en: "Home address" },
    leak: "ledger",
  },
  {
    id: "taxOffice",
    name: { de: "Finanzamt", en: "Tax office" },
    scene: 1,
    holds: { de: "Jahresmeldungen", en: "Annual reports" },
    leak: "france",
  },
  {
    id: "crooks",
    name: { de: "Betrüger und Erpresser", en: "Fraudsters, extortionists" },
    scene: 2,
  },
]

// Who passes data to whom. The report line carries a packet a year.
export const edges: { from: Place; to: Place }[] = [
  { from: "you", to: "provider" },
  { from: "you", to: "taxTool" },
  { from: "you", to: "shop" },
  { from: "provider", to: "taxOffice" },
]

export interface Scene {
  id: string
  // The scene's name on the timeline.
  short: Text
  heading: Text
  // One line at most. One key phrase may be marked with **…**; the page
  // sets it in bold.
  text: Text
}

export const scenes: Scene[] = [
  {
    id: "konto",
    short: { de: "Deine Daten", en: "Your data" },
    heading: {
      de: "Deine Daten liegen an vielen Stellen.",
      en: "Your data sits in many places.",
    },
    text: {
      de: "Die Börse kennt Ausweis und jede Transaktion, das Steuertool deine Bestände, der Wallet-Shop deine Wohnadresse.",
      en: "The exchange knows your ID and every transaction, the tax tool your holdings, the wallet shop your home address.",
    },
  },
  {
    id: "staat",
    short: { de: "Finanzamt", en: "Tax office" },
    heading: {
      de: "Ab 2027 meldet sie dich jedes Jahr.",
      en: "From 2027, it reports you every year.",
    },
    text: {
      de: "Ans Finanzamt, ohne Wallet-Adressen. **Jede Meldung bleibt zehn Jahre bei der Börse.**",
      en: "To the tax office, without wallet addresses. **Each report stays with the exchange for ten years.**",
    },
  },
  {
    id: "lecks",
    short: { de: "Datenlecks", en: "Leaks" },
    heading: {
      de: "Gespeichert. Gehackt. Verkauft.",
      en: "Stored. Hacked. Sold.",
    },
    text: {
      de: "Börsen, Steuertools, Wallet-Shops und Finanzverwaltungen haben solche Daten schon verloren. **Ein Datenleck nimmt nichts weg, es kopiert.**",
      en: "Exchanges, tax tools, wallet shops and tax administrations have lost such data before. **A data leak takes nothing away; it copies.**",
    },
  },
  {
    id: "liste",
    short: { de: "Zielliste", en: "Target list" },
    heading: {
      de: "Aus den Datenlecks wird eine Zielliste.",
      en: "The leaks become a target list.",
    },
    text: {
      de: "Sortiert nach Bestand, mit Wohnadresse.",
      en: "Ranked by holdings, with home addresses.",
    },
  },
  {
    id: "risiko",
    short: { de: "Zuhause", en: "At home" },
    heading: {
      de: "Dein Profil. Deine Wohnadresse. Ein Angriffsziel.",
      en: "Your profile. Your home address. A target.",
    },
    text: {
      de: "Bitcoin in der eigenen Wallet ist wie Erspartes unter der Matratze. **Darum sollte niemand wissen, wer wie viel davon hat.**",
      en: "Bitcoin in your own wallet is like savings under the mattress. **That is why nobody should know who holds how much.**",
    },
  },
]

// The reports pile up at the exchange: one card a year while the tax
// office scene plays. The first report goes out in 2027 (for 2026), and
// each is kept ten years after its reporting year (§ 20 Abs. 4
// Krypto-MPfG), so a customer who stays has ten on file from 2036 on.
export const reports = {
  first: 2027,
  kept: 10,
  label: {
    de: { one: "Jahresmeldung", many: "Jahresmeldungen" },
    en: { one: "annual report", many: "annual reports" },
  },
  // The card that travels to the tax office, with the year after it.
  card: { de: "Meldung", en: "Report" },
}

// Labels around the cases: the cases in the leak scene open a card with
// what happened, and the card links to the case on the leak page.
export const caseLabels = {
  open: { de: "Was ist passiert?", en: "What happened?" },
  more: {
    de: "Alle Datenlecks mit Quellen",
    en: "All data leaks with sources",
  },
  close: { de: "Schließen", en: "Close" },
}

// A short note under the network.
export const note = {
  de: "Max ist erfunden, die Fälle sind echt.",
  en: "Max is invented, the cases are real.",
}
