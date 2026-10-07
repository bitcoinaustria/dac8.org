import type { Language } from "@/lib/i18n"

// "Your DAC8 file": what a provider reports and keeps about one reader,
// computed from a few answers. The page renders the default answers on the
// server and the browser recomputes the same texts as the reader answers;
// nothing is sent or stored. The statements restate the vetted wording of the
// dossier (#was-ist-dac8, #gemeldet, FAQ), of AffectedCheck.astro and of the
// campaign lawyer's notes, so change them together. Two rules from those
// notes: the report never tells the tax office that a wallet is yours, and
// what goes to the tax office stays apart from what the provider keeps.
// Tax residence decides whether a report is sent at all (§ 7 Abs. 4 and
// § 14 Abs. 1 Krypto-MPfG): residents of EU countries and of non-EU countries
// that exchange crypto data with Austria are reported; the provider prepares
// the data for everyone else too (§ 20 Abs. 1). Germany is its own answer
// because many readers are German customers of Austrian providers.
// The result is three figures and two lists, not a mock report: the October
// 2026 feedback found the earlier sheet, timeline and chart long and hard to
// read for how little the answers changed.

export type ProviderAnswer = "provider" | "self" | "unsure"
export type Residence = "at" | "de" | "eu" | "third"
export type Activity = "buy" | "sell" | "swap" | "transfer"

export type FileAnswers = {
  provider: ProviderAnswer
  residence: Residence
  since: number
  until: number | "open"
  activities: Activity[]
}

// The first reporting period is 2026; nothing before it is reported.
export const firstYear = 2026
// The provider deletes each annual report only ten years after its reporting
// period, and keeps identification and transaction records until ten years
// after the customer relationship ends (§ 21 FM-GwG).
export const retention = 10
// Crypto providers have been obliged entities under the FM-GwG since
// 10 January 2020 (AMLD5); their records start there at the earliest.
export const amlSince = 2020

const span = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, index) => from + index)

// Customers since any year up to the first reporting year, so every reader's
// first report is the one for 2026. Revisit both ranges with the content.
export const sinceYears = span(2010, firstYear).reverse()
export const untilYears = span(firstYear, 2040)

export const defaults: FileAnswers = {
  provider: "provider",
  residence: "at",
  since: 2021,
  until: "open",
  activities: ["buy", "transfer"],
}

export const providerAnswers: ProviderAnswer[] = ["provider", "self", "unsure"]
export const residences: Residence[] = ["at", "de", "eu", "third"]
export const activities: Activity[] = ["buy", "sell", "swap", "transfer"]

export const labels = {
  de: {
    provider: {
      provider: "Ja",
      self: "Nein, nie über einen Anbieter",
      unsure: "Weiß ich nicht",
    },
    residence: {
      at: "Österreich",
      de: "Deutschland",
      eu: "Anderer EU-Staat",
      third: "Außerhalb der EU",
    },
    activity: {
      buy: "Kaufen",
      sell: "Verkaufen",
      swap: "Krypto gegen Krypto tauschen",
      transfer: "Auf eigene Wallet übertragen",
    },
    // What the annual report holds for each activity, per crypto-asset.
    reported: {
      buy: "Deine Käufe: Wert in Euro, Stückzahl und Anzahl",
      sell: "Deine Verkäufe: Wert in Euro, Stückzahl und Anzahl",
      swap: "Jeder Tausch auf beiden Seiten, obwohl er für Privatpersonen steuerlich meist kein Verkauf ist",
      transfer:
        "Deine Übertragungen, davon gesondert die Summe an Wallets ohne bekannten Anbieter, meist deine eigene. Wallet-Adressen stehen nicht darin.",
    },
  },
  en: {
    provider: {
      provider: "Yes",
      self: "No, never through a provider",
      unsure: "Not sure",
    },
    residence: {
      at: "Austria",
      de: "Germany",
      eu: "Another EU country",
      third: "Outside the EU",
    },
    activity: {
      buy: "Buy",
      sell: "Sell",
      swap: "Swap crypto for crypto",
      transfer: "Transfer to my own wallet",
    },
    reported: {
      buy: "Your purchases: euro value, units and count",
      sell: "Your sales: euro value, units and count",
      swap: "Every swap on both sides, although for individuals it usually is not a taxable disposal",
      transfer:
        "Your transfers, and separately the total sent to wallets with no known provider, usually your own. Wallet addresses are not in it.",
    },
  },
} satisfies Record<Language, unknown>

// Keep the canonical order whatever order the answers arrive in.
const ordered = <T>(order: T[], picked: T[]) =>
  order.filter((item) => picked.includes(item))

export const fileModel = (answers: FileAnswers) => {
  const last =
    answers.until === "open" ? undefined : Math.max(firstYear, answers.until)
  // In the key year the provider holds the most reports at once: from 2036
  // ten (2026 to 2035), with a shorter stay all of them, the year after the
  // last one.
  const keyCount =
    last === undefined ? retention : Math.min(retention, last - firstYear + 1)
  return {
    last,
    keyYear: firstYear + keyCount,
    keyCount,
    keptUntil: last === undefined ? undefined : last + retention,
    keptFrom: Math.max(answers.since, amlSince),
  }
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

// Every sentence the answers change, keyed like the [data-text] slots.
export const fileTexts = (answers: FileAnswers, language: Language) => {
  const en = language === "en"
  const { last, keyYear, keyCount, keptUntil, keptFrom } = fileModel(answers)
  const done = ordered(activities, answers.activities)
  const verbPhrase = list(
    done.map((activity) => verbs[language][activity]),
    en ? "and" : "und",
  )
  const third = answers.residence === "third"

  const what = !done.length
    ? en
      ? "Choose what you do with your provider."
      : "Wähle, was du bei deinem Anbieter machst."
    : answers.provider === "unsure"
      ? en
        ? `If you use such a provider, it reports every year from 2026 how much crypto you ${verbPhrase}.`
        : `Nutzt du so einen Anbieter, meldet er ab 2026 jedes Jahr, wie viel Krypto du ${verbPhrase}.`
      : third
        ? en
          ? `From 2026, your provider prepares every year how much crypto you ${verbPhrase}. It is reported only if your country exchanges crypto data with Austria.`
          : `Ab 2026 bereitet dein Anbieter jedes Jahr auf, wie viel Krypto du ${verbPhrase}. Gemeldet wird das nur, wenn dein Staat mit Österreich Kryptodaten austauscht.`
        : en
          ? `From 2026, your provider reports every year how much crypto you ${verbPhrase}.`
          : `Ab 2026 meldet dein Anbieter jedes Jahr, wie viel Krypto du ${verbPhrase}.`

  const verdict = {
    provider: en ? "Then you are affected." : "Dann bist du betroffen.",
    self: en
      ? "Then DAC8 does not report you."
      : "Dann meldet DAC8 dich nicht.",
    unsure: en
      ? "It depends on where you buy crypto-assets."
      : "Das hängt davon ab, wo du Kryptowerte kaufst.",
  }[answers.provider]

  const reportsUnit = en
    ? keyCount === 1
      ? "report"
      : "reports"
    : keyCount === 1
      ? "Meldung"
      : "Meldungen"

  return {
    what,
    firstText: third
      ? en
        ? "for 2026, to the tax authority only if your country exchanges crypto data with Austria."
        : "für 2026, ans Finanzamt nur, wenn dein Staat mit Österreich Kryptodaten austauscht."
      : en
        ? "for 2026 to the tax authority, then one every year."
        : "für 2026 ans Finanzamt, danach jedes Jahr eine.",
    reportsValue: String(keyCount),
    reportsUnit,
    reportsTerm: en
      ? `On file at once in ${keyYear}.`
      : `${keyYear} gleichzeitig beim Anbieter.`,
    reportsText:
      last === undefined
        ? en
          ? "Each is deleted only ten years after its reporting year."
          : "Er löscht jede erst zehn Jahre nach ihrem Meldejahr."
        : en
          ? `The last one, for ${last}, is deleted in ${last + retention}.`
          : `Die letzte, für ${last}, löscht er ${last + retention}.`,
    keptValue: keptUntil === undefined ? "+10" : String(keptUntil),
    keptUnit: keptUntil === undefined ? (en ? "years" : "Jahre") : "",
    keptTerm:
      keptUntil === undefined
        ? en
          ? "After you leave,"
          : "Nach deiner Kündigung"
        : en
          ? "Until then,"
          : "Bis dahin",
    keptText: en
      ? `your provider keeps your ID, wallet addresses and transactions since ${keptFrom}.`
      : `bewahrt dein Anbieter Ausweis, Wallet-Adressen und Transaktionen seit ${keptFrom} auf.`,
    reportedHeading: third
      ? en
        ? "Prepared every year for the tax authority"
        : "Jedes Jahr fürs Finanzamt aufbereitet"
      : en
        ? "Goes to the tax authority every year"
        : "Geht jedes Jahr ans Finanzamt",
    transactionsSince: en
      ? `Individual transactions since ${keptFrom}, with time and amount`
      : `Einzelne Transaktionen seit ${keptFrom}, mit Zeitpunkt und Betrag`,
    live:
      answers.provider === "self"
        ? verdict
        : [
            verdict,
            what,
            done.length
              ? en
                ? `In ${keyYear}, your provider will hold ${keyCount} annual ${reportsUnit} on you.`
                : `${keyYear} liegen ${keyCount} Jahresmeldungen über dich bei deinem Anbieter.`
              : "",
          ]
            .filter(Boolean)
            .join(" "),
  }
}

export type FileTexts = ReturnType<typeof fileTexts>
