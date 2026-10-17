import type { Language } from "@/lib/i18n"

// "How scattered leaks become a file": an invented reader, Max Mustermann,
// who was in three real cases. Each case brings a record; what the file
// already knows is only matched, so every piece lands once, with the case
// that brought it. Then DAC8 adds a yearly report, which is stored, not
// leaked. The cases and their sources live in src/data/leaks.ts.

export type Piece =
  | "name"
  | "birth"
  | "home"
  | "email"
  | "phone"
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
    id: "phone",
    label: { de: "Handynummer", en: "Mobile number" },
    value: { de: "+43 660 ··· ·· 07", en: "+43 660 ··· ·· 07" },
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
    id: "email",
    label: { de: "E-Mail", en: "Email" },
    value: { de: "max.m@example.com", en: "max.m@example.com" },
  },
  {
    id: "document",
    label: { de: "Ausweis", en: "ID document" },
    value: { de: "Bild, Vorder- und Rückseite", en: "image, front and back" },
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

export interface Breach {
  // The case in src/data/leaks.ts, which carries name, year and sources.
  leak: string
  // Where the data came from, for the head of the record, and what the
  // people in it were, for the counter. The count comes from leaks.ts.
  where: Text
  unit: Text
  // The source names a lower bound.
  atLeast?: boolean
  // Other lines of the copied data, masked, which scroll past before Max's.
  others: string[]
  // Max's line in the record, field by field, as it might look in the
  // copied data. Pieces the file already holds are matched, not added.
  fields: { piece: Piece; raw: Text }[]
  text: Text
}

export const breaches: Breach[] = [
  {
    leak: "gis",
    where: { de: "Testserver", en: "Test server" },
    unit: { de: "Menschen", en: "people" },
    atLeast: true,
    others: [
      "H••••;J••••••;1958-••-••;••••GASSE ••;1100;WIEN",
      "K•••••;M•••;1991-••-••;••••STRASSE •;8010;GRAZ",
      "P••••••;A••••;1973-••-••;••••WEG ••;4020;LINZ",
      "W•••;S••••••;1986-••-••;••••PLATZ •;5020;SALZBURG",
      "B•••••;T•••;1965-••-••;••••GASSE •;6020;INNSBRUCK",
      "G•••••;L••••;1999-••-••;••••ZEILE ••;1210;WIEN",
    ],
    fields: [
      { piece: "name", raw: same("MUSTERMANN;MAX") },
      { piece: "birth", raw: same("1980-01-01") },
      { piece: "home", raw: same("MUSTERSTRASSE 7;1010;WIEN") },
    ],
    text: {
      de: "Ein IT-Dienstleister der GIS, der Stelle für die Rundfunkgebühr, lädt echte Meldedaten zum Testen auf einen ungesicherten Server. Daten von mindestens fünf Millionen Menschen werden danach im Netz zum Kauf angeboten.",
      en: "An IT contractor of GIS, the office that collected Austria’s broadcasting fee, loads real registration data onto an unsecured server for a test. Records on at least five million people are then offered for sale online.",
    },
  },
  {
    leak: "ledger",
    where: { de: "Shop-Bestellungen", en: "Shop orders" },
    unit: { de: "Käufer", en: "buyers" },
    others: [
      "M•••• K••••, ••••weg 3, Graz, +43664·····12, order #·····",
      "J•••• S••••••, ••••str. 18, München, +49151·····40, order #·····",
      "A•••• P•••, ••••gasse 2, Linz, +43676·····85, order #·····",
      "T•••• B•••••, ••••platz 9, Wien, +43699·····03, order #·····",
      "L•••• H•••, ••••allee 5, Berlin, +49170·····66, order #·····",
      "S•••• W•••••, ••••ring 11, Salzburg, +43664·····29, order #·····",
    ],
    fields: [
      { piece: "name", raw: same("Max Mustermann") },
      { piece: "home", raw: same("Musterstrasse 7, Wien") },
      { piece: "phone", raw: same("+43660·····07") },
      { piece: "wallet", raw: same("order #·····") },
    ],
    text: {
      de: "Aus dem Onlineshop eines Herstellers von Hardware-Wallets, kleinen Geräten, auf denen man Bitcoin selbst verwahrt, gelangen Namen, Anschriften und Telefonnummern von 272.000 Käufern ins Netz. Name und Anschrift passen zur ersten Liste.",
      en: "Names, postal addresses and phone numbers of 272,000 buyers leak from the online shop of a hardware wallet maker; such a wallet is a small device for keeping your bitcoin yourself. Name and home address match the first list.",
    },
  },
  {
    leak: "coinbase",
    where: { de: "Support-Zugang", en: "Support access" },
    unit: { de: "Kunden", en: "customers" },
    others: [
      "S•••• P•••, +49 151 ··· ·· 31, s••••@•••.de, id_front.jpg, balance · 37 tx",
      "D•••• R••••, +43 664 ··· ·· 58, d••••@•••.at, passport.jpg, balance · 112 tx",
      "E•••• N•••••, +41 79 ··· ·· 20, e••••@•••.ch, id_front.jpg, balance · 9 tx",
      "F•••• M••••, +49 160 ··· ·· 77, f••••@•••.com, id_front.jpg, balance · 341 tx",
      "C•••• L•••, +43 676 ··· ·· 14, c••••@•••.at, passport.jpg, balance · 56 tx",
      "R•••• K•••••, +49 176 ··· ·· 92, r••••@•••.de, id_front.jpg, balance · 23 tx",
    ],
    fields: [
      { piece: "name", raw: same("Max Mustermann") },
      { piece: "phone", raw: same("+43 660 ··· ·· 07") },
      { piece: "email", raw: same("max.m@example.com") },
      { piece: "document", raw: same("id_front.jpg, id_back.jpg") },
      { piece: "balance", raw: same("balance · 214 tx") },
    ],
    text: {
      de: "Bestochene Support-Mitarbeiter einer Krypto-Börse geben Daten von 69.461 Kunden weiter, bis hin zu Ausweisbildern, Kontostand und Transaktionen. Über Name und Handynummer lässt sich das Max zuordnen.",
      en: "Bribed support staff at a crypto exchange pass on data on 69,461 customers, down to ID images, balances and transactions. Name and mobile number tie it to Max.",
    },
  },
]

// The scenes around the cases, in order: before, the match, DAC8 and the
// end. Each has a short name for the timeline.
export const intro = {
  heading: {
    de: "Wie aus verstreuten Datenlecks eine Akte wird.",
    en: "How scattered data leaks become a file.",
  },
  text: {
    de: "Max ist erfunden, die drei Datenlecks sind echt. Jedes für sich verrät wenig über ihn. Scroll weiter und sieh zu, wie daraus ein Bild wird.",
    en: "Max is invented, the three leaks are real. Each on its own gives away little about him. Scroll on and watch them add up to a picture.",
  },
}

export const match = {
  short: { de: "Abgleich", en: "Match" },
  heading: { de: "Drei Lecks, ein Profil.", en: "Three leaks, one profile." },
  text: {
    de: "Listen über Name, Anschrift oder Handynummer zusammenzuführen, erledigt gewöhnliche Software in Minuten, einer KI genügt dafür ein Satz. Aus Millionen Menschen bleibt übrig, wer Bitcoin hat, mit Wohnadresse und Kontostand. Bitcoin ist wie Bargeld ein Inhaberwert, deshalb ziehen solche Listen Kriminelle an.",
    en: "Ordinary software joins lists on name, home address or mobile number in minutes, and an AI needs a single sentence. Out of millions of people, those who hold bitcoin remain, with home address and balance. Like cash, bitcoin is a bearer asset, which is why such lists draw criminals.",
  },
  // The sentence typed into the search on the stage, and what it finds.
  prompt: { de: "Suchauftrag an eine KI", en: "Prompt to an AI" },
  query: {
    de: "Gleiche die drei Listen ab und zeig mir, wer Bitcoin hat, mit Wohnadresse und Kontostand.",
    en: "Match the three lists and show me who holds bitcoin, with home address and balance.",
  },
  result: {
    de: "1 Treffer · Max Mustermann · 1010 Wien · Hardware-Wallet · Kontostand",
    en: "1 match · Max Mustermann · 1010 Vienna · hardware wallet · balance",
  },
  found: { de: "in allen drei Listen", en: "in all three lists" },
}

export const reports = {
  // The first report covers 2026 and is due in 2027; the provider keeps
  // each for ten years.
  first: 2026,
  count: 10,
  short: { de: "DAC8", en: "DAC8" },
  heading: {
    de: "Ab 2027: jedes Jahr eine Meldung.",
    en: "From 2027: a report every year.",
  },
  text: {
    de: "Sein Anbieter meldet jedes Jahr ans Finanzamt: Name, Anschrift, Geburtsdatum, Steuerwohnsitz, Steuernummer und je Kryptowert die Summen aus Käufen, Verkäufen, Tausch und Auszahlungen an Wallets, ohne Wallet-Adressen. Das ist kein Leck. Die Meldungen werden aufbewahrt, beim Anbieter zehn Jahre lang.",
    en: "His provider reports to the tax authority every year: name, postal address, date of birth, tax residence, tax number and, per crypto-asset, the totals of purchases, sales, swaps and withdrawals to wallets, without wallet addresses. This is no leak. The reports are kept, by the provider for ten years.",
  },
  sheet: {
    de: [
      "Name, Anschrift, Geburtsdatum",
      "Steuerwohnsitz, Steuernummer",
      "Summen je Kryptowert",
      "ohne Wallet-Adressen",
    ],
    en: [
      "Name, postal address, date of birth",
      "Tax residence, tax number",
      "Totals per crypto-asset",
      "no wallet addresses",
    ],
  },
  // Where the reports are kept.
  places: {
    provider: { de: "beim Anbieter", en: "with the provider" },
    authority: { de: "beim Finanzamt", en: "with the tax authority" },
  },
}

export const end = {
  // The case that shows authorities lose data too, from src/data/leaks.ts.
  leak: "bulgaria",
  short: { de: "10 Jahre", en: "10 years" },
  heading: {
    de: "Zehn Meldungen, an zwei Stellen.",
    en: "Ten reports, in two places.",
  },
  text: {
    de: "Ab jetzt liegen über Max immer zehn Jahresmeldungen beim Anbieter und beim Finanzamt. Auch Steuerbehörden verlieren Daten: In Bulgarien gelangten 2019 Steuerdaten von mehr als sechs Millionen Menschen ins Netz.",
    en: "From now on, ten annual reports on Max always sit with the provider and the tax authority. Tax authorities lose data too: in Bulgaria in 2019, tax data on more than six million people ended up online.",
  },
  closing: {
    de: "Je weniger über dich gesammelt wird, desto weniger kann verloren gehen.",
    en: "The less is collected about you, the less can be lost.",
  },
}

function same(text: string): Text {
  return { de: text, en: text }
}
