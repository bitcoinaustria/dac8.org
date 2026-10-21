import type { Language } from "@/lib/i18n"
import type { PlatePart } from "@/data/target-plate"

// "What happens to your data", told as one thread in five short steps: an
// invented customer, Max, leaves his data with an exchange, a tax tool and
// a hardware wallet maker; the exchange reports him to the tax office every
// year; every one of these kinds of place has lost such data in real
// cases, and each leak fills in a part of a target list at the offenders,
// with Max at number 07; the list leads to his bedroom, where his savings
// lie under the mattress. The list is a rendered plate (see
// src/data/target-plate.ts) and matches the site's illustrations of Max:
// Musterstraße 7, 1010 Wien, 7.2 BTC. The cases and their sources live in
// src/data/leaks.ts; the legal facts follow the dossier (§ 21 FM-GwG, § 18
// and § 20 Krypto-MPfG, Directive (EU) 2024/1640).

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
  // What the copy fills in on the target list: the parts of the plate it
  // reveals, the first being where the copy lands.
  fills?: PlatePart[]
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
    fills: ["photo", "name"],
  },
  {
    id: "taxTool",
    name: { de: "Steuertool", en: "Tax tool" },
    scene: 0,
    order: 2,
    holds: { de: "Bestände", en: "Holdings" },
    leak: "waltio",
    fills: ["rank"],
  },
  {
    id: "shop",
    name: { de: "Wallet-Hersteller", en: "Wallet maker" },
    scene: 0,
    order: 3,
    holds: { de: "Wohnadresse", en: "Home address" },
    leak: "ledger",
    fills: ["address"],
  },
  {
    id: "taxOffice",
    name: { de: "Finanzamt", en: "Tax office" },
    scene: 1,
    holds: { de: "Jahresmeldungen", en: "Annual reports" },
    leak: "france",
    fills: ["reports"],
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
  // A short caption. One key phrase may be marked with **…**; the page
  // sets it in bold.
  text: Text
  // A shorter text for phones, where the caption shares the screen with
  // the network, in the same style as text.
  brief?: Text
}

// The tax tool combines the accounts a user imports (not just one exchange):
// https://help.waltio.com/en/articles/3633362-getting-started-on-waltio
// Report deletion: § 20(4) Krypto-MPfG; other customer records: § 21 FM-GwG.
export const scenes: Scene[] = [
  {
    id: "konto",
    short: { de: "Deine Daten", en: "Your data" },
    heading: {
      de: "Deine Daten liegen an immer mehr Stellen.",
      en: "Your data ends up in more and more places.",
    },
    text: {
      de: "Börse: Ausweis und Geschäfte. Wallet-Hersteller: Lieferanschrift beim Gerätekauf. Steuertool: Daten mehrerer Börsen und Wallets. **Nicht jeden Empfänger wählst du selbst.**",
      en: "Exchange: ID and trades. Wallet maker: delivery address when you order a device. Tax tool: data from multiple exchanges and wallets. **You do not choose every recipient.**",
    },
  },
  {
    id: "staat",
    short: { de: "Finanzamt", en: "Tax office" },
    heading: {
      de: "Ab 2027 meldet dich die Börse jedes Jahr automatisch.",
      en: "From 2027, the exchange reports you automatically every year.",
    },
    text: {
      de: "Ans Finanzamt, ohne Wallet-Adressen. **Die Börse muss die Meldedaten zehn Jahre nach dem betreffenden Kalenderjahr löschen.** Andere Kundenunterlagen können länger bleiben.",
      en: "To the tax office, without wallet addresses. **The exchange must delete the reported data ten years after the calendar year it covers.** Other customer records may remain longer.",
    },
    brief: {
      de: "Ohne Wallet-Adressen. **Meldedaten: Löschung nach zehn Jahren.** Andere Kundenunterlagen können länger bleiben.",
      en: "Without wallet addresses. **Reported data: deleted after ten years.** Other customer records may remain longer.",
    },
  },
  {
    id: "lecks",
    short: { de: "Datenlecks", en: "Leaks" },
    heading: {
      de: "Gespeichert, gehackt und verkauft.",
      en: "Stored, hacked and sold.",
    },
    text: {
      de: "Börsen, Steuertools, Wallet-Hersteller und Finanzverwaltungen haben solche Daten schon verloren. **Ein Datenleck nimmt nichts weg, es kopiert.**",
      en: "Exchanges, tax tools, wallet makers and tax administrations have lost such data before. **A data leak takes nothing away; it copies.**",
    },
    brief: {
      de: "**Ein Datenleck nimmt nichts weg, es kopiert.**",
      en: "**A data leak takes nothing away; it copies.**",
    },
  },
  {
    id: "liste",
    short: { de: "Zielliste", en: "Target list" },
    heading: {
      de: "Aus den Daten wird eine Zielliste.",
      en: "The data becomes a target list.",
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
      de: "Dein Profil wird zum Angriffsziel.",
      en: "Your profile becomes a target.",
    },
    text: {
      de: "Bitcoin in der eigenen Wallet ist wie Bargeld daheim: deine Sache. **Gefährlich wird es, wenn eine Liste verrät, wer wie viel hat.**",
      en: "Bitcoin in your own wallet is like cash at home: your business. **The danger is a list that shows who holds how much.**",
    },
    brief: {
      de: "Wie Bargeld daheim: **Niemand sollte wissen, wer wie viel hat.**",
      en: "Like cash at home: **nobody should know who holds how much.**",
    },
  },
]

// The reports pile up at the exchange: one card a year while the tax
// office scene plays. The first report goes out in 2027 (for 2026), and
// each is deleted ten years after the calendar year it covers (§ 20 Abs. 4
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
