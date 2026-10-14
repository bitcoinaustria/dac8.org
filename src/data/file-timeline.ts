import type { Language } from "@/lib/i18n"

// "Your file over time": an invented reader, Max Mustermann, who was unlucky
// enough to be in every one of these real cases. Each step puts on his file
// only the pieces its source says were lost, so a piece can come up again in
// a later case. From 2027 DAC8 adds a yearly report; those are stored, not
// leaked, and look different on the page. Cases in src/data/leaks.ts carry
// their sources there; the others name theirs here, and their links stand
// in the dossier's source list (src/data/sources.ts).

export type Piece =
  | "name"
  | "birth"
  | "home"
  | "email"
  | "phone"
  | "bank"
  | "party"
  | "wallet"
  | "document"
  | "balance"

type Text = Record<Language, string>

export interface Row {
  id: Piece
  label: Text
  value: Text
}

// The rows of the file, top to bottom. Values are invented and use reserved
// or masked forms, so none can belong to a real person.
export const rows: Row[] = [
  {
    id: "name",
    label: { de: "Name", en: "Name" },
    value: { de: "Max Mustermann", en: "Max Mustermann" },
  },
  {
    id: "birth",
    label: { de: "Geburtsdatum", en: "Date of birth" },
    value: { de: "01.01.1980", en: "1 January 1980" },
  },
  {
    id: "home",
    label: { de: "Wohnadresse", en: "Home address" },
    value: {
      de: "Musterstraße 7, 1010 Wien",
      en: "Musterstraße 7, 1010 Vienna",
    },
  },
  {
    id: "email",
    label: { de: "E-Mail", en: "Email" },
    value: { de: "max.m@example.com", en: "max.m@example.com" },
  },
  {
    id: "phone",
    label: { de: "Handynummer", en: "Mobile number" },
    value: { de: "+43 660 ··· ·· 07", en: "+43 660 ··· ·· 07" },
  },
  {
    id: "bank",
    label: { de: "Kontodaten", en: "Bank account" },
    value: { de: "AT·· ···· ···· ···· 0815", en: "AT·· ···· ···· ···· 0815" },
  },
  {
    id: "party",
    label: { de: "Parteinähe", en: "Party affinity" },
    value: { de: "geschätzt, je Partei", en: "estimated, per party" },
  },
  {
    id: "wallet",
    label: { de: "Hardware-Wallet", en: "Hardware wallet" },
    value: {
      de: "gekauft, nach Hause geliefert",
      en: "bought, delivered home",
    },
  },
  {
    id: "document",
    label: { de: "Ausweis", en: "ID document" },
    value: {
      de: "Bild von Vorder- und Rückseite",
      en: "image, front and back",
    },
  },
  {
    id: "balance",
    label: { de: "Börsenkonto", en: "Exchange account" },
    value: {
      de: "Kontostand und Transaktionen",
      en: "balance and transactions",
    },
  },
]

export interface Step {
  year: number
  // A case in src/data/leaks.ts, or a name and source given here. A name
  // given here wins over the case's own.
  leak?: string
  name?: Text
  source?: Text
  // Short label for steps without a case, such as the DAC8 milestones.
  label?: Text
  // What happened, in one or two plain sentences. Name the data problem,
  // not bitcoin.
  text: Text
  adds: Piece[]
  // DAC8 steps: how many annual reports on Max exist by then.
  reports?: number
}

export const steps: Step[] = [
  {
    year: 2010,
    label: { de: "Anfang", en: "Start" },
    text: {
      de: "Max ist erfunden: 30 Jahre alt, wohnt in Wien, zahlt Rundfunkgebühr und kauft online ein. Über ihn steht noch nichts im Netz.",
      en: "Max is invented: 30, lives in Vienna, pays the broadcasting fee and shops online. Nothing about him is on the net yet.",
    },
    adds: [],
  },
  {
    year: 2011,
    name: { de: "GIS-Website", en: "GIS website" },
    source: { de: "GIS, 25. Juli 2011", en: "GIS, 25 July 2011" },
    text: {
      de: "Hacker stehlen von einem Webserver der Gebührenstelle GIS rund 214.000 Kundendatensätze, 96.000 davon mit Kontodaten.",
      en: "Hackers steal around 214,000 customer records from a web server of GIS, the fee office, 96,000 of them with bank account details.",
    },
    adds: ["name", "bank"],
  },
  {
    year: 2014,
    name: same("eBay"),
    source: { de: "eBay, Mai 2014", en: "eBay, May 2014" },
    text: {
      de: "Angreifer kopieren die Kundendatenbank von eBay: Name, E-Mail, Anschrift, Telefonnummer und Geburtsdatum.",
      en: "Attackers copy eBay’s customer database: name, email, postal address, phone number and date of birth.",
    },
    adds: ["name", "birth", "home", "email", "phone"],
  },
  {
    year: 2019,
    name: { de: "Post", en: "Austrian Post" },
    source: {
      de: "Verwaltungsgerichtshof, 24. Juni 2026",
      en: "Supreme Administrative Court, 24 June 2026",
    },
    text: {
      de: "Die Post schätzt für rund 2,2 Millionen Menschen, wie nah sie welcher Partei stehen, und verkauft solche Werte weiter. 2026 bestätigt der Verwaltungsgerichtshof 13 Millionen Euro Strafe.",
      en: "Austrian Post estimates for around 2.2 million people how close they are to each party, and sells such scores on. In 2026 the Supreme Administrative Court confirms a fine of 13 million euros.",
    },
    adds: ["party"],
  },
  {
    year: 2020,
    leak: "gis",
    name: { de: "GIS-Meldedaten", en: "GIS registration data" },
    text: {
      de: "Ein IT-Dienstleister der GIS lädt echte Meldedaten zum Testen auf einen ungesicherten Server. Name, Anschrift und Geburtsdatum von mindestens fünf Millionen Menschen werden im Netz zum Kauf angeboten.",
      en: "An IT contractor of GIS loads real registration data onto an unsecured server for a test. Name, postal address and date of birth of at least five million people are offered for sale online.",
    },
    adds: ["name", "birth", "home"],
  },
  {
    year: 2020,
    leak: "ledger",
    text: {
      de: "Aus dem Onlineshop eines Hardware-Wallet-Herstellers gelangen Namen, Anschriften und Telefonnummern von 272.000 Käufern ins Netz.",
      en: "Names, postal addresses and phone numbers of 272,000 buyers leak from a hardware wallet maker’s online shop.",
    },
    adds: ["name", "home", "phone", "email", "wallet"],
  },
  {
    year: 2021,
    name: same("Facebook"),
    source: {
      de: "Irische Datenschutzbehörde, 2022",
      en: "Irish Data Protection Commission, 2022",
    },
    text: {
      de: "Handynummern und Namen von rund 533 Millionen Facebook-Nutzern stehen frei im Netz.",
      en: "Mobile numbers and names of around 533 million Facebook users are freely available online.",
    },
    adds: ["name", "phone"],
  },
  {
    year: 2025,
    leak: "coinbase",
    text: {
      de: "Bestochene Support-Mitarbeiter einer Krypto-Börse geben Daten von 69.461 Kunden weiter, mit Ausweisbildern, Kontostand und Transaktionen.",
      en: "Bribed support staff at a crypto exchange pass on data on 69,461 customers, with ID images, balances and transactions.",
    },
    adds: ["name", "home", "email", "phone", "document", "balance"],
  },
  {
    year: 2027,
    label: { de: "Erste Meldung", en: "First report" },
    text: {
      de: "Sein Anbieter meldet das Jahr 2026 ans Finanzamt: Name, Anschrift, Geburtsdatum, Steuernummer und je Kryptowert die Summen aus Käufen, Verkäufen, Tausch und Auszahlungen an Wallets, ohne Wallet-Adressen.",
      en: "His provider reports 2026 to the tax office: name, postal address, date of birth, tax number and, per crypto-asset, the totals of purchases, sales, swaps and withdrawals to wallets, without wallet addresses.",
    },
    adds: [],
    reports: 1,
  },
  {
    year: 2031,
    label: { de: "Fünf Meldungen", en: "Five reports" },
    text: {
      de: "Jedes Jahr kommt eine Meldung dazu, und der Anbieter hebt jede zehn Jahre auf.",
      en: "Every year another report is added, and the provider keeps each one for ten years.",
    },
    adds: [],
    reports: 5,
  },
  {
    year: 2036,
    label: { de: "Zehn Meldungen", en: "Ten reports" },
    text: {
      de: "Ab jetzt liegen beim Anbieter immer zehn Jahresmeldungen über Max. Auch Steuerbehörden haben schon Daten verloren: In Bulgarien gelangten 2019 Steuerdaten von mehr als sechs Millionen Menschen ins Netz.",
      en: "From now on the provider always holds ten annual reports on Max. Tax authorities have lost data too: in Bulgaria in 2019, tax data on more than six million people ended up online.",
    },
    adds: [],
    reports: 10,
  },
]

function same(label: string): Text {
  return { de: label, en: label }
}
