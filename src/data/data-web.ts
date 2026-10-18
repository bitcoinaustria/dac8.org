import type { Language } from "@/lib/i18n"

// "What happens to your data", told as one thread in five short steps: an
// invented customer, Max, leaves his data with an exchange, a tax tool and
// a hardware wallet shop; the exchange reports him to the tax office every
// year; every one of these kinds of place has lost such data in real
// cases; the leaks become a target list; the list leads to his front door. The cases and their sources live in
// src/data/leaks.ts; the legal facts follow the dossier (§ 21 FM-GwG,
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
    leak: "coinbase",
  },
  {
    id: "taxTool",
    name: { de: "Steuertool", en: "Tax tool" },
    scene: 0,
    order: 2,
    leak: "waltio",
  },
  {
    id: "shop",
    name: { de: "Wallet-Shop", en: "Wallet shop" },
    scene: 0,
    order: 3,
    leak: "ledger",
  },
  {
    id: "taxOffice",
    name: { de: "Finanzamt", en: "Tax office" },
    scene: 1,
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
      de: "Ans Finanzamt, ohne Wallet-Adressen. Jede Meldung bleibt zehn Jahre bei der Börse.",
      en: "To the tax office, without wallet addresses. Each report stays with the exchange for ten years.",
    },
  },
  {
    id: "lecks",
    short: { de: "Lecks", en: "Leaks" },
    heading: {
      de: "Gespeichert. Gehackt. Verkauft.",
      en: "Stored. Hacked. Sold.",
    },
    text: {
      de: "Börsen, Steuertools, Wallet-Shops und Finanzverwaltungen haben solche Daten schon verloren.",
      en: "Exchanges, tax tools, wallet shops and tax administrations have lost such data before.",
    },
  },
  {
    id: "liste",
    short: { de: "Zielliste", en: "Target list" },
    heading: {
      de: "Aus den Lecks wird eine Zielliste.",
      en: "The leaks become a target list.",
    },
    text: {
      de: "Sortiert nach Bestand, mit Wohnadresse.",
      en: "Ranked by holdings, with home addresses.",
    },
  },
  {
    id: "risiko",
    short: { de: "Haustür", en: "Front door" },
    heading: {
      de: "Dein Profil. Deine Wohnadresse. Ein Angriffsziel.",
      en: "Your profile. Your home address. A target.",
    },
    text: {
      de: "Bitcoin ist wie Bargeld. **Darum sollte niemand wissen, wer wie viel davon hat.**",
      en: "Bitcoin is like cash. **That is why nobody should know who holds how much.**",
    },
  },
]

// A short note under the network.
export const note = {
  de: "Max ist erfunden, die Fälle sind echt.",
  en: "Max is invented, the cases are real.",
}
