import type { Language } from "@/lib/i18n"

// "Your DAC8 file": what a provider reports and keeps about one reader,
// computed from a few answers. The page renders the default answers on the
// server and the browser recomputes the same model as the reader answers;
// nothing is sent or stored. The statements restate the vetted wording of the
// dossier (#was-ist-dac8, #gemeldet, FAQ), of AffectedCheck.astro and of the
// campaign lawyer's notes, so change them together. Two rules from those
// notes: the report never tells the tax office that a wallet is yours, and
// what goes to the tax office stays apart from what the provider keeps.
// Tax residence decides whether a report is sent at all (§ 7 Abs. 4 and
// § 14 Abs. 1 Krypto-MPfG): residents of EU countries and of non-EU countries
// that exchange crypto data with Austria are reported; the provider prepares
// the data for everyone else too (§ 20 Abs. 1).

export type ProviderAnswer = "provider" | "self" | "unsure"
export type Residence = "at" | "eu" | "third"
export type Activity = "buy" | "sell" | "swap" | "transfer"
export type Asset = "btc" | "eth" | "other"
export type Field = "value" | "units" | "count"
export type RowId =
  | "buy"
  | "sell"
  | "swapIn"
  | "swapOut"
  | "transfer"
  | "unhosted"

export type FileAnswers = {
  provider: ProviderAnswer
  residence: Residence
  since: number
  until: number | "open"
  activities: Activity[]
  assets: Asset[]
}

// The first reporting period is 2026; nothing before it is reported.
export const firstYear = 2026
// The provider deletes each annual report only ten years after its reporting
// period, and keeps identification and transaction records until ten years
// after the customer relationship ends (§ 21 FM-GwG).
export const retention = 10

const span = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

// Customers since any year up to the first reporting year, so every reader's
// first report is the one for 2026. Revisit both ranges with the content.
export const sinceYears = span(2010, firstYear).reverse()
export const untilYears = span(firstYear, 2040)
// Without a planned end the chart runs to here and the reports carry on past
// its edge.
export const openHorizon = 2040
const lastUntil = untilYears.at(-1) ?? firstYear
// Every row and tick the chart can show; the browser hides the rest.
export const chartYears = span(firstYear, lastUntil)
export const chartTicks = span(firstYear, lastUntil + retention).filter(
  (year) => year === firstYear || year % 5 === 0,
)

export const defaults: FileAnswers = {
  provider: "provider",
  residence: "at",
  since: 2021,
  until: "open",
  activities: ["buy", "transfer"],
  assets: ["btc"],
}

export const providerAnswers: ProviderAnswer[] = ["provider", "self", "unsure"]
export const residences: Residence[] = ["at", "eu", "third"]
export const activities: Activity[] = ["buy", "sell", "swap", "transfer"]
export const assets: Asset[] = ["btc", "eth", "other"]
export const fields: Field[] = ["value", "units", "count"]

// One row per reported category, as on the report specimen. A swap is
// reported on both sides. Transfers out of the account carry a count;
// transfers to addresses with no known link to a provider or financial
// institution are reported as sums of value and units only.
export const rows: { id: RowId; activity: Activity; fields: Field[] }[] = [
  { id: "buy", activity: "buy", fields: ["value", "units", "count"] },
  { id: "sell", activity: "sell", fields: ["value", "units", "count"] },
  { id: "swapIn", activity: "swap", fields: ["value", "units", "count"] },
  { id: "swapOut", activity: "swap", fields: ["value", "units", "count"] },
  { id: "transfer", activity: "transfer", fields: ["value", "units", "count"] },
  { id: "unhosted", activity: "transfer", fields: ["value", "units"] },
]

export const labels = {
  de: {
    provider: {
      provider: "Ja",
      self: "Nein, nur eigene Wallet",
      unsure: "Weiß ich nicht",
    },
    residence: {
      at: "Österreich",
      eu: "Anderer EU-Staat",
      third: "Außerhalb der EU",
    },
    activity: {
      buy: "Kaufen",
      sell: "Verkaufen",
      swap: "Krypto gegen Krypto tauschen",
      transfer: "Auf eigene Wallet übertragen",
    },
    asset: { btc: "Bitcoin", eth: "Ether", other: "Andere" },
    sheetAsset: {
      btc: "Bitcoin (BTC)",
      eth: "Ether (ETH)",
      other: "Jeder weitere Kryptowert",
    },
    field: { value: "Wert in Euro", units: "Stückzahl", count: "Anzahl" },
    row: {
      buy: { title: "Kauf" },
      sell: { title: "Verkauf" },
      swapIn: {
        title: "Tausch, erhalten",
        note: "gegen einen anderen Kryptowert",
      },
      swapOut: {
        title: "Tausch, abgegeben",
        note: "gegen einen anderen Kryptowert",
      },
      transfer: { title: "Übertragung", note: "Ausgang von deinem Konto" },
      unhosted: {
        title: "An Adressen ohne bekannten Anbieter",
        note: "in der Regel auch deine eigene Wallet",
      },
    },
  },
  en: {
    provider: {
      provider: "Yes",
      self: "No, only my own wallet",
      unsure: "Not sure",
    },
    residence: {
      at: "Austria",
      eu: "Another EU country",
      third: "Outside the EU",
    },
    activity: {
      buy: "Buy",
      sell: "Sell",
      swap: "Swap crypto for crypto",
      transfer: "Transfer to my own wallet",
    },
    asset: { btc: "Bitcoin", eth: "Ether", other: "Others" },
    sheetAsset: {
      btc: "Bitcoin (BTC)",
      eth: "Ether (ETH)",
      other: "Every other crypto-asset",
    },
    field: { value: "Euro value", units: "Units", count: "Count" },
    row: {
      buy: { title: "Purchases" },
      sell: { title: "Sales" },
      swapIn: { title: "Swaps, received", note: "for another crypto-asset" },
      swapOut: { title: "Swaps, given", note: "for another crypto-asset" },
      transfer: { title: "Transfers", note: "out of your account" },
      unhosted: {
        title: "To addresses not associated with a known provider",
        note: "usually including your own wallet",
      },
    },
  },
} satisfies Record<Language, unknown>

// Keep the canonical order whatever order the answers arrive in.
const ordered = <T>(order: T[], picked: T[]) =>
  order.filter((item) => picked.includes(item))

export const showsAsset = (answers: FileAnswers, asset: Asset) =>
  answers.activities.length > 0 && answers.assets.includes(asset)

export const showsRow = (answers: FileAnswers, row: RowId) =>
  answers.activities.includes(
    rows.find((entry) => entry.id === row)?.activity ?? "buy",
  )

export const isComplete = (answers: FileAnswers) =>
  answers.activities.length > 0 && answers.assets.length > 0

export const fileModel = (answers: FileAnswers) => {
  const last =
    answers.until === "open" ? undefined : Math.max(firstYear, answers.until)
  // In the key year the provider holds the most reports at once: from 2036
  // ten (2026 to 2035), with a shorter stay all of them, the year after the
  // last one.
  const keyCount =
    last === undefined ? retention : Math.min(retention, last - firstYear + 1)
  const keyYear = firstYear + keyCount
  return {
    last,
    lastRow: last ?? openHorizon - 1,
    axisEnd: last === undefined ? openHorizon : last + retention,
    keyYear,
    keyCount,
    keyFrom: keyYear - keyCount,
    keyTo: keyYear - 1,
    keptUntil: last === undefined ? undefined : last + retention,
    // Years as a customer, drawn against the ten years after. Without a
    // planned end the bar runs a few years past 2026 and stops short.
    customerYears: (last ?? firstYear + 3) - answers.since + 1,
  }
}

const numbers = {
  de: [
    "keine",
    "eine",
    "zwei",
    "drei",
    "vier",
    "fünf",
    "sechs",
    "sieben",
    "acht",
    "neun",
    "zehn",
  ],
  en: [
    "no",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ],
}

const list = (items: string[], and: string) =>
  items.length < 2
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} ${and} ${items.at(-1)}`

// The summary names what is reported, not where transfers go: the report
// shows sums per category, never whose wallet an address is.
const verbs = {
  de: {
    buy: "kaufst",
    sell: "verkaufst",
    swap: "tauschst",
    transfer: "überträgst",
  },
  en: { buy: "buy", sell: "sell", swap: "swap", transfer: "transfer" },
}

const assetWords = {
  de: { btc: "Bitcoin", eth: "Ether", other: "andere Kryptowerte" },
  en: { btc: "bitcoin", eth: "ether", other: "other crypto-assets" },
}

// Every sentence the answers change, keyed like the [data-text] slots.
export const fileTexts = (answers: FileAnswers, language: Language) => {
  const en = language === "en"
  const { last, keyYear, keyCount, keptUntil } = fileModel(answers)
  const picked = ordered(assets, answers.assets)
  const done = ordered(activities, answers.activities)
  const and = en ? "and" : "und"
  const assetPhrase =
    picked.length === 1 && picked[0] === "other"
      ? en
        ? "crypto"
        : "Krypto"
      : list(
          picked.map((asset) => assetWords[language][asset]),
          and,
        )
  const verbPhrase = list(
    done.map((activity) => verbs[language][activity]),
    and,
  )

  const what = !picked.length
    ? en
      ? "Choose at least one crypto-asset."
      : "Wähle mindestens einen Kryptowert."
    : !done.length
      ? en
        ? "Choose what you do with your provider."
        : "Wähle, was du bei deinem Anbieter machst."
      : answers.provider === "unsure"
        ? en
          ? `If you use such a provider, it reports every year from 2026 how much ${assetPhrase} you ${verbPhrase}.`
          : `Nutzt du so einen Anbieter, meldet er ab 2026 jedes Jahr, wie viel ${assetPhrase} du ${verbPhrase}.`
        : answers.residence === "third"
          ? en
            ? `From 2026, your provider prepares every year how much ${assetPhrase} you ${verbPhrase}. It is reported only if your country exchanges crypto data with Austria.`
            : `Ab 2026 bereitet dein Anbieter jedes Jahr auf, wie viel ${assetPhrase} du ${verbPhrase}. Gemeldet wird das nur, wenn dein Staat mit Österreich Kryptodaten austauscht.`
          : en
            ? `From 2026, your provider reports every year how much ${assetPhrase} you ${verbPhrase}.`
            : `Ab 2026 meldet dein Anbieter jedes Jahr, wie viel ${assetPhrase} du ${verbPhrase}.`

  const count = numbers[language][keyCount]
  const key =
    keyCount === 1
      ? en
        ? `Your annual report for ${firstYear} stays with your provider until ${firstYear + retention}.`
        : `Deine Jahresmeldung für ${firstYear} liegt bis ${firstYear + retention} beim Anbieter.`
      : en
        ? `In ${keyYear}, your provider will hold ${count} annual reports on you.`
        : `${keyYear} liegen ${count} Jahresmeldungen über dich beim Anbieter.`
  const keyFollow =
    last === undefined
      ? en
        ? "As long as you remain a customer, it stays at ten: every year one is added and the oldest is deleted."
        : "Solange du Kunde bist, bleibt es bei zehn: Jedes Jahr kommt eine dazu, die älteste wird gelöscht."
      : keyCount === 1
        ? en
          ? `If you leave in ${last}, it remains the only one.`
          : `Kündigst du ${last}, bleibt es bei dieser einen.`
        : en
          ? `Your last report, for ${last}, is only deleted in ${last + retention}.`
          : `Deine letzte Meldung, für ${last}, wird erst ${last + retention} gelöscht.`

  const verdict = {
    provider: en ? "Then you are affected." : "Dann bist du betroffen.",
    self: en
      ? "Then DAC8 does not report you."
      : "Dann meldet DAC8 dich nicht.",
    unsure: en
      ? "It depends on where you buy crypto-assets."
      : "Das hängt davon ab, wo du Kryptowerte kaufst.",
  }[answers.provider]

  const third = answers.residence === "third"

  return {
    what,
    finanzamtHeading: third
      ? en
        ? "What your provider prepares every year"
        : "Was dein Anbieter jedes Jahr aufbereitet"
      : en
        ? "What goes to the tax authority every year"
        : "Was jedes Jahr ans Finanzamt geht",
    sheetIntro: third
      ? en
        ? "This is the annual report your provider prepares for you. It goes to the tax authority only if your country exchanges crypto data with Austria. Activity before 2026 is not in it, but your provider keeps records of it under anti-money-laundering rules."
        : "So sieht die Jahresmeldung aus, die dein Anbieter für dich aufbereitet. Ans Finanzamt geht sie nur, wenn dein Staat mit Österreich Kryptodaten austauscht. Vorgänge vor 2026 stehen nicht darin, dein Anbieter bewahrt sie aber nach den Geldwäschevorschriften auf."
      : en
        ? "This is your first annual report. Your provider fills in the fields with your data. Activity before 2026 is not reported, but your provider keeps records of it under anti-money-laundering rules."
        : "So sieht deine erste Jahresmeldung aus. Die Felder füllt dein Anbieter mit deinen Daten. Vorgänge vor 2026 meldet er nicht, er bewahrt sie aber nach den Geldwäschevorschriften auf.",
    sheetTo: third
      ? en
        ? "To the tax authority only with data exchange"
        : "Ans Finanzamt nur bei Datenaustausch"
      : en
        ? "To the tax authority by 31 July 2027"
        : "An das Finanzamt bis 31. Juli 2027",
    taxOfficeText: third
      ? en
        ? "Only if you are reported: the tax authority receives your report for 2026."
        : "Nur wenn du gemeldet wirst: Das Finanzamt bekommt deine Meldung für 2026."
      : en
        ? "The tax authority receives your report for 2026 and analyses it."
        : "Das Finanzamt bekommt deine Meldung für 2026 und wertet sie aus.",
    exchangeText: {
      at: en
        ? "Other EU countries receive it if you are tax-resident there."
        : "Andere EU-Staaten bekommen sie, wenn du dort steuerlich ansässig bist.",
      eu: en
        ? "Austria passes it on to the EU country where you are tax-resident."
        : "Österreich gibt sie an den EU-Staat weiter, in dem du steuerlich ansässig bist.",
      third: en
        ? "Your country receives it only if it exchanges crypto data with Austria."
        : "Dein Staat bekommt sie nur, wenn er mit Österreich Kryptodaten austauscht.",
    }[answers.residence],
    yearsIntro: third
      ? en
        ? "If you are reported, your provider keeps every annual report and deletes each one only ten years after its reporting period."
        : "Wirst du gemeldet, behält dein Anbieter jede Jahresmeldung und löscht sie erst zehn Jahre nach ihrem Meldezeitraum."
      : en
        ? "Your provider keeps every annual report and deletes each one only ten years after its reporting period."
        : "Dein Anbieter behält jede Jahresmeldung und löscht sie erst zehn Jahre nach ihrem Meldezeitraum.",
    key,
    keyFollow,
    keyYear: String(keyYear),
    keyCount: en
      ? `${keyCount} ${keyCount === 1 ? "report" : "reports"}`
      : `${keyCount} ${keyCount === 1 ? "Meldung" : "Meldungen"}`,
    legendOn: en ? `Held in ${keyYear}` : `Liegt ${keyYear} beim Anbieter`,
    nextWhen:
      last === firstYear
        ? en
          ? "After that"
          : "Danach"
        : en
          ? "Then every year"
          : "Danach jährlich",
    nextText:
      last === undefined
        ? en
          ? "Another report each year, for as long as you remain a customer."
          : "Eine weitere Meldung pro Jahr, solange du Kunde bist."
        : last === firstYear
          ? en
            ? `If you leave in ${last}, this remains your only report.`
            : `Kündigst du ${last}, bleibt es bei dieser einen Meldung.`
          : en
            ? `Another report each year, the last one for ${last}.`
            : `Eine weitere Meldung pro Jahr, zuletzt die für ${last}.`,
    keptSince: en
      ? `Not in the report, but held by your provider since ${answers.since}, already under anti-money-laundering rules. DAC8 links these records with your tax data:`
      : `Nicht in der Meldung, aber seit ${answers.since} bei deinem Anbieter, schon aufgrund der Geldwäschevorschriften. Mit DAC8 werden sie mit deinen Steuerdaten verknüpft:`,
    keptFrom: String(answers.since),
    keptTurn: last === undefined ? (en ? "open" : "offen") : String(last),
    keptToLabel:
      keptUntil === undefined
        ? en
          ? "then another"
          : "danach noch"
        : en
          ? "kept until"
          : "aufbewahrt bis",
    keptTo:
      keptUntil === undefined
        ? en
          ? "10 years"
          : "10 Jahre"
        : String(keptUntil),
    // Follows the label "Aufbewahrung:" / "Retention:".
    keptRule:
      keptUntil === undefined
        ? en
          ? "identification and transaction records currently for up to ten years after the relationship ends. The clock only starts when you close your account."
          : "Ausweis- und Transaktionsunterlagen derzeit bis zehn Jahre nach Ende der Kundenbeziehung. Die Frist beginnt erst, wenn du kündigst."
        : en
          ? `identification and transaction records currently until ${keptUntil}, ten years after you leave.`
          : `Ausweis- und Transaktionsunterlagen derzeit bis ${keptUntil}, zehn Jahre nach deiner Kündigung.`,
    live:
      answers.provider === "self"
        ? verdict
        : [verdict, what, isComplete(answers) ? key : ""]
            .filter(Boolean)
            .join(" "),
  }
}

export type FileTexts = ReturnType<typeof fileTexts>
