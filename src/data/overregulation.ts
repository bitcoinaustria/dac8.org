import { historyAsOf } from "@/data/history"
import {
  accountsExchanged,
  accountsSources,
  formatNumber,
  reportingBenefit,
  reportingCosts,
  reportingCostSources,
  unexplained,
} from "@/data/history-evidence"
import { nextSteps, type Status } from "@/data/history-next"
import { pairs } from "@/data/history-promises"
import { leaks, peopleAffected, roundPeople } from "@/data/leaks"
import { type Language, pathFor } from "@/lib/i18n"

// The history page's scroll film: how the rules piled up, step by small
// step, how little came of it, what is decided next, what it means for the
// reader, what it costs and what was promised: nine chapters of 23 short
// steps, all of them in one rendered world, a panopticon at night
// (scripts/artwork/render-panopticon.py). It starts at a table in one
// cell, with the amount from which you have to show ID, rises over the
// ring while the year runs from 1977 and the searchlights come on, and
// goes back into the cell and the yard for every figure after that.
// Each step is a headline of a few words, at most one line under it, and
// one still; where a step has a clip, the camera's way to its still plays
// once when the step comes up. Every figure is verified in
// dac8-wiki/.wiki/wiki/references/rule-growth-and-effect-evidence.md and
// aml-kyc-history-austria.md; the section to check below the film carries
// the full series. Keep both languages in sync and say no more than the
// source does.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

const eurlex = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://eur-lex.europa.eu/eli/${path}/oj`,
})

// The stills, rendered in the panopticon's world: the table in the crypto
// cell with the two limits in notes, in gold and the cent; the cell's walls
// with the first directive's pages and with all of them; the yard with one
// slip per report; the note on the table; the EU's 27 account registers;
// the view from the cell; the breach in the tower; the notice on the
// table; the pallets in the yard and the loudspeakers. A step without a
// still shows the overview, where the year runs with the scroll.
export type Shot =
  | "cash"
  | "gold"
  | "cent"
  | "wall6"
  | "wall"
  | "reports"
  | "kept"
  | "convictions"
  | "note"
  | "wide"
  | "cell"
  | "leak"
  | "letter"
  | "yard-cost"
  | "yard-benefit"
  | "horn"

// The clips (public/film/<name>.mp4): the camera's way to a step's still
// and what happens in the world on the way.
export type Clip =
  | "cent"
  | "rise"
  | "wall"
  | "paper"
  | "reports"
  | "note"
  | "back"
  | "wide"
  | "cell"
  | "leak"
  | "letter"
  | "yard"
  | "benefit"
  | "horn"

// The story's order: what is asked of you, how many rules ask it, who gets
// to look, how much paper they fill, and what comes of it.
export const chapters: { id: string; label: Text }[] = [
  { id: "ausweis", label: { de: "Ausweis", en: "ID" } },
  { id: "regeln", label: { de: "Regeln", en: "Rules" } },
  { id: "zweck", label: { de: "Zugriff", en: "Access" } },
  { id: "papier", label: { de: "Papier", en: "Paper" } },
  { id: "ergebnis", label: { de: "Ergebnis", en: "Result" } },
  { id: "weiter", label: { de: "Weiter", en: "Next" } },
  { id: "du", label: { de: "Für dich", en: "For you" } },
  { id: "rechnung", label: { de: "Rechnung", en: "Bill" } },
  { id: "versprochen", label: { de: "Versprochen", en: "Promised" } },
]

export type Step = {
  id: string
  chapter: string
  // In the rules chapter the year runs with the scroll over this span.
  years?: [number, number]
  title: Text
  // One short line at most; the picture says the rest.
  text?: Text
  sources: Source[]
  // Sources whose address depends on the language, such as another page.
  more?: (language: Language) => Source[]
  // A date and its procedural status, above the headline.
  when?: Text
  status?: Status
  // The still this step shows, and the clip that leads the camera to it.
  shot?: Shot
  clip?: Clip
  // In the overview from the paper chapter on, the pages hang in the cell.
  late?: boolean
  // What the picture names in a few words: what was promised and what is
  // on record, or what a part of it stands for.
  marks?: { id: string; text: Text }[]
  caption?: Text
}

export const sourcesOf = (step: Step, language: Language) => [
  ...step.sources,
  ...(step.more?.(language) ?? []),
]

const fiu2025: Source = {
  label: {
    de: "Geldwäschemeldestelle, Lagebericht Geldwäsche 2025",
    en: "Financial intelligence unit, money laundering report 2025",
  },
  href: "https://www.bundeskriminalamt.at/308/files/374-2026-geldwaeschebericht-2025-a4-v20260915-web-bf.pdf",
}
// Europol's latest estimate of the share confiscated, the same source as
// the bill's scissors chart (src/data/history-gap.ts, recovery).
const socta: Source = {
  label: {
    de: "Europol, EU-SOCTA 2025, S. 13 und 25",
    en: "Europol, EU-SOCTA 2025, pp. 13 and 25",
  },
  href: "https://www.europol.europa.eu/cms/sites/default/files/documents/EU-SOCTA-2025.pdf",
}

// Austria's consumer price index (VPI 86, 1986 = 100), annual averages, by
// Statistik Austria, to show past amounts in today's money. 2025 is the
// last full year. ECU became euro one to one (Regulation (EC) 1103/97,
// Art. 2), so 1991 amounts convert like euro amounts.
export const priceIndex: Record<number, number> = {
  1991: 113.1,
  2025: 255.7,
}
export const priceBase = 2025
export const priceSources: Source[] = [
  {
    label: {
      de: "Statistik Austria, VPI 86",
      en: "Statistik Austria, CPI 86",
    },
    href: "https://www.landesentwicklung.steiermark.at/cms/dokumente/12656747_144433982/914d3cca/6%20vpi86.pdf",
  },
  eurlex(
    "reg/1997/1103",
    "Verordnung (EG) 1103/97, Art. 2",
    "Regulation (EC) 1103/97, Art. 2",
  ),
]
// An amount of a past year in money of the base year, rounded so it does
// not pretend more precision than an index gives.
export const inTodaysMoney = (amount: number, year: number) => {
  const index = priceIndex[year]
  if (!index || year >= priceBase) return amount
  const value = (amount * priceIndex[priceBase]) / index
  const step = value >= 10000 ? 100 : 10
  return Math.round(value / step) * step
}

// The same thresholds in gold, which no index has to translate: price per
// troy ounce in ECU on 10 June 1991, the day the first directive was
// adopted (Frankfurt fixing of 21,040 DM per kilogram, 32.1507 ounces to the
// kilogram, 2.05858 DM to the ECU), and in euros at the Eurosystem's latest
// quarter-end revaluation. Later thresholds are priced at the latest.
export const goldPrice = {
  1991: 21040 / 32.1507 / 2.05858,
  latest: 3688.86,
  asOf: { de: "Ende September 2026", en: "the end of September 2026" },
}
export const goldSources: Source[] = [
  {
    label: {
      de: "Bundesbank, Goldpreis Frankfurt, 10. Juni 1991",
      en: "Bundesbank, Frankfurt gold price, 10 June 1991",
    },
    href: "https://www.bundesbank.de/dynamic/action/de/statistiken/zeitreihen-datenbanken/zeitreihen-datenbank/723452/723452?tsId=BBEX3.D.XAU.DEM.EA.AC.C01",
  },
  {
    label: {
      de: "Eurostat, ECU-Kurs der D-Mark, 10. Juni 1991",
      en: "Eurostat, ECU rate of the Deutsche Mark, 10 June 1991",
    },
    href: "https://doi.org/10.2908/ERT_H_EUR_D",
  },
  {
    label: {
      de: "EZB, Goldpreis zum Quartalsende, Ausweis vom 2. Oktober 2026",
      en: "ECB, quarter-end gold price, statement as at 2 October 2026",
    },
    href: "https://www.ecb.europa.eu/press/annual-reports-financial-statements/wfs/2026/html/ecb.fs261007.en.html",
  },
]
// The ounces the coins in the film's pictures add up to, by year of the
// threshold (scripts/artwork/render-panopticon.py, OUNCES_1991 and the coins beside).
export const goldShown: Record<number, number> = { 1991: 47, 2027: 2.7 }
// Troy ounces of gold an amount bought in its year, whole ounces from ten.
export const inGold = (amount: number, year: number) => {
  const ounces = amount / (year === 1991 ? goldPrice[1991] : goldPrice.latest)
  return ounces >= 10 ? Math.round(ounces) : Math.round(ounces * 10) / 10
}

// From which amount ID is needed, shown in today's money; 1991 in ECU.
export const thresholds: {
  step: string
  year: number
  amount: number
  unit: "ECU" | "EUR"
}[] = [
  { step: "ausweis-bar", year: 1991, amount: 15000, unit: "ECU" },
  { step: "ausweis-bar", year: 2027, amount: 10000, unit: "EUR" },
  { step: "ausweis-krypto", year: 2024, amount: 0, unit: "EUR" },
]

// The two cash limits in gold, as the film's headline writes them.
const ounces = (language: Language) =>
  thresholds
    .filter((t) => t.amount > 0)
    .map((t) =>
      new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE").format(
        inGold(t.amount, t.year),
      ),
    )

const allRules: Source = {
  label: {
    de: "Alle Regeln mit Datum, Inhalt und Primärquellen, im Abschnitt zum Nachprüfen",
    en: "Every rule with its date, content and primary sources, in the section to check",
  },
  href: "#regeln-title",
}

const ris = (year: number, number: number): Source => ({
  label: {
    de: `BGBl. I Nr. ${number}/${year}`,
    en: `Federal Law Gazette I No. ${number}/${year}`,
  },
  href: `https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_${year}_I_${number}/BGBLA_${year}_I_${number}.html`,
})

// ---------- What the later chapters draw on --------------------------------
const thisYear = new Date(historyAsOf).getUTCFullYear()
const lastAccounts = accountsExchanged[accountsExchanged.length - 1]
const { germany } = unexplained
// One sheet per documented data leak lies in the leak's picture, red where
// it happened at an authority.
export const leakCount = {
  all: leaks.length,
  authority: leaks.filter((leak) => leak.holders.includes("authority")).length,
}
const bulgariaSources: Source[] = (
  leaks.find((leak) => leak.id === "bulgaria")?.sources.slice(0, 1) ?? []
).map((source) => ({
  href: source.href,
  label: {
    de: "OECD Global Forum, Erklärung zum Datenleck bei Bulgariens Steuerbehörde, 2019",
    en: "OECD Global Forum, statement on the data breach at Bulgaria’s tax authority, 2019",
  },
}))
// The yearly cost of the reporting duties in million euros, and the
// pallets the pictures show: one per 100 million euros, costs beside the
// benefit measured and the benefit modelled.
const costMillions = reportingCosts.reduce((sum, c) => sum + c.millions, 0)
// "über 1,2 Milliarden": rounded down to a tenth of a billion.
const costFloor = (language: Language) =>
  formatNumber(Math.floor(costMillions / 100) / 10, language)
export const pallets = {
  cost: Math.round(costMillions / 50) / 2,
  measured: reportingBenefit.fromData * 10,
  modelled: reportingBenefit.modelled * 10,
}
// A step decided or proposed, with its date, status, wording and sources.
const next = (id: string) => {
  const step = nextSteps.find((item) => item.id === id)
  if (!step) throw new Error(`Film: no next step "${id}"`)
  return {
    when: step.when,
    status: step.status,
    title: step.title,
    text: step.text,
    sources: step.sources,
  }
}
// The pairs shown in the film, by their own short wording.
const promised: Step[] = pairs.flatMap((pair, k) =>
  pair.film
    ? [
        {
          id: `versprochen-${pair.id}`,
          chapter: "versprochen",
          shot: "horn" as const,
          clip: k === 0 ? ("horn" as const) : undefined,
          title: pair.film.title,
          text: pair.film.text,
          marks: [
            { id: "promise", text: pair.token.promise },
            { id: "record", text: pair.token.record },
          ],
          sources: [pair.promise.source, pair.record[pair.film.record].source],
        },
      ]
    : [],
)

export const steps: Step[] = [
  // ---------- Ausweis: from which amount a single cash transaction without
  // an account needs ID, against crypto, where there is no amount at all.
  // The general threshold stayed at 15,000 from 1991 until the AMLR lowers
  // it in 2027 (rule-growth-and-effect-evidence.md, "Thresholds"); the
  // first step shows 1991 and 2027 together, in today's money, the second
  // the same two in gold.
  {
    id: "ausweis-bar",
    chapter: "ausweis",
    shot: "cash",
    caption: {
      de: "Maßstabsgetreu, 1991 in heutigem Geld.",
      en: "At true scale, 1991 in today’s money.",
    },
    title: {
      de: "Die Ausweisgrenze sinkt: von 33.900\u00a0€ auf 10.000\u00a0€.",
      en: "The ID limit falls: from €33,900 to €10,000.",
    },
    text: {
      de: "Ab diesem Betrag musst du dich bei einem einzelnen Geschäft ohne Konto ausweisen. 1991 in heutigem Geld, die neue Grenze ab Juli 2027.",
      en: "From this amount you must show ID for a single transaction without an account. 1991 in today’s money; the new limit from July 2027.",
    },
    sources: [
      eurlex("dir/1991/308", "Richtlinie 91/308/EWG", "Directive 91/308/EEC"),
      ...priceSources,
      eurlex(
        "reg/2024/1624",
        "Verordnung (EU) 2024/1624",
        "Regulation (EU) 2024/1624",
      ),
    ],
  },
  // The same two limits in gold, which needs no price index: the coins lie
  // down in front of the notes.
  {
    id: "ausweis-gold",
    chapter: "ausweis",
    shot: "gold",
    caption: {
      de: `Maßstabsgetreu, Gold zum Preis von 1991 und von ${goldPrice.asOf.de}.`,
      en: `At true scale, gold at the price of 1991 and of ${goldPrice.asOf.en}.`,
    },
    title: {
      de: `In Gold: von ${ounces("de")[0]} auf ${ounces("de")[1]} Unzen.`,
      en: `In gold: from ${ounces("en")[0]} to ${ounces("en")[1]} ounces.`,
    },
    text: {
      de: "In Gold gemessen sinkt die Grenze noch viel stärker als in heutigem Geld.",
      en: "Measured in gold, the limit falls far more than in today’s money.",
    },
    sources: goldSources,
  },
  {
    id: "ausweis-krypto",
    chapter: "ausweis",
    shot: "cent",
    clip: "cent",
    title: {
      de: "Krypto: ab dem ersten Cent.",
      en: "Crypto: from the first cent.",
    },
    text: {
      de: "Jede Übertragung über einen Anbieter trägt deinen Namen.",
      en: "Every transfer through a provider carries your name.",
    },
    sources: [
      eurlex(
        "reg/2023/1113",
        "Verordnung (EU) 2023/1113",
        "Regulation (EU) 2023/1113",
      ),
    ],
  },

  // ---------- Regeln: every way money takes lights up once a rule applies,
  // the year running from 1977 with the scroll; the next step runs on from
  // 2016, so the picture heats up like the water around the frog.
  {
    id: "regeln",
    chapter: "regeln",
    clip: "rise",
    years: [1977, 2015],
    // Only the Savings Directive ever ended, repealed by Directive (EU)
    // 2015/2060 because the broader DAC2 superseded it.
    title: {
      de: "Ein Weg nach dem anderen.",
      en: "One way after another.",
    },
    text: {
      de: "Weggefallen ist seit 1977 eine einzige Regel, für eine umfassendere.",
      en: "Since 1977 a single rule has gone, for a broader one.",
    },
    sources: [allRules],
  },

  // ---------- Zugriff: the same timeline from 2016 to today: the ways go on
  // lighting up, and the watchtower gains a lit window per kind of authority
  // allowed into the Austrian account register (aml-history.ts, row
  // "kontenregister"): three in 2016, five more in 2021, one in 2026.
  {
    id: "zweck",
    chapter: "zweck",
    years: [2016, 2026],
    title: {
      de: "Und immer mehr schauen hinein.",
      en: "And ever more look in.",
    },
    text: {
      de: "Ins Kontenregister 2016 drei Behörden, heute neun.",
      en: "Into the account register: three authorities in 2016, nine today.",
    },
    sources: [ris(2015, 116), ris(2021, 25), ris(2026, 46)],
  },

  // ---------- Papier: the first directive beside everything since.
  {
    id: "papier-1991",
    chapter: "papier",
    shot: "wall6",
    clip: "wall",
    caption: {
      de: "Ein Blatt je Seite im Amtsblatt der EU.",
      en: "One sheet per page in the EU Official Journal.",
    },
    title: {
      de: "1991: 6 Seiten.",
      en: "1991: 6 pages.",
    },
    text: {
      de: "Die erste Geldwäsche-Richtlinie der EU.",
      en: "The EU’s first anti-money-laundering directive.",
    },
    sources: [
      eurlex("dir/1991/308", "Richtlinie 91/308/EWG", "Directive 91/308/EEC"),
    ],
  },
  // Every act in the pile below, repealed ones included, whole texts:
  // about 272,000 words, at 200 words a minute a little over 22 hours.
  {
    id: "papier-heute",
    chapter: "papier",
    shot: "wall",
    clip: "paper",
    caption: {
      de: "Ein Blatt je Seite im Amtsblatt der EU, rot die erste Richtlinie von 1991.",
      en: "One sheet per page in the EU Official Journal; red, the first directive of 1991.",
    },
    title: {
      de: "Seither beschlossen: 488 Seiten.",
      en: "Adopted since: 488 pages.",
    },
    text: {
      de: "Gut 22 Stunden Lesezeit.",
      en: "Over 22 hours of reading.",
    },
    sources: [
      eurlex(
        "reg/2024/1624",
        "Verordnung (EU) 2024/1624",
        "Regulation (EU) 2024/1624",
      ),
      eurlex(
        "dir/2024/1640",
        "Richtlinie (EU) 2024/1640",
        "Directive (EU) 2024/1640",
      ),
      eurlex(
        "reg/2024/1620",
        "Verordnung (EU) 2024/1620",
        "Regulation (EU) 2024/1620",
      ),
    ],
  },

  // ---------- Ergebnis: what comes of it, in Austria.
  {
    id: "ergebnis-2025",
    chapter: "ergebnis",
    shot: "reports",
    clip: "reports",
    caption: {
      de: "Ein Zettel je Verdachtsmeldung.",
      en: "One slip per suspicion report.",
    },
    title: {
      de: "13.989 Verdachtsmeldungen.",
      en: "13,989 suspicion reports.",
    },
    text: {
      de: "Österreich 2025: rund dreißigmal so viele wie 2005, zum Teil anders gezählt.",
      en: "Austria 2025: about thirty times as many as in 2005, partly counted differently.",
    },
    sources: [
      {
        label: {
          de: "Innenministerium, Anfragebeantwortung 4756/AB (XXIII. GP)",
          en: "Interior ministry, answer 4756/AB (23rd legislative period)",
        },
        href: "https://www.parlament.gv.at/dokument/XXIII/AB/4756/fname_141334.pdf",
      },
      fiu2025,
    ],
  },
  {
    id: "ergebnis-liegen",
    chapter: "ergebnis",
    shot: "kept",
    caption: {
      de: "Ein Zettel je Verdachtsmeldung.",
      en: "One slip per suspicion report.",
    },
    title: {
      de: "9.665 bleiben liegen. Gespeichert.",
      en: "9,665 go nowhere. Stored.",
    },
    text: {
      de: "Nicht weitergegeben, mangels Anhaltspunkt für eine Straftat oder weiterer Ansätze.",
      en: "Not passed on, for lack of any indication of a crime or of further leads.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-urteile",
    chapter: "ergebnis",
    shot: "convictions",
    caption: {
      de: "Ein Zettel je Verdachtsmeldung.",
      en: "One slip per suspicion report.",
    },
    title: {
      de: "139 Verurteilungen.",
      en: "139 convictions.",
    },
    text: {
      de: "Wegen Geldwäsche, im selben Jahr.",
      en: "For money laundering, in the same year.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-euro",
    chapter: "ergebnis",
    shot: "note",
    clip: "note",
    title: {
      de: "Von 100 €, die Kriminelle einnehmen, zieht der Staat rund 2 € ein.",
      en: "Of €100 criminals make, the state confiscates about €2.",
    },
    text: {
      de: "Den Rest behalten sie. Schätzt Europol für die EU.",
      en: "They keep the rest. Europol’s estimate for the EU.",
    },
    sources: [socta],
  },

  // ---------- Weiter: the same picture, the year running on past today.
  // Cash, the last dark cell, lights up in 2027; a proposal shows as
  // windows that are not yet open; then the camera pulls back to the EU's
  // 27 account registers, which are to be connected. Titles, dates and
  // status come from history-next.ts; never word a proposal as law.
  {
    id: "weiter-bargeld",
    chapter: "weiter",
    clip: "back",
    late: true,
    years: [thisYear, 2027],
    ...next("amlr"),
    title: {
      de: "Und es geht weiter: Bargeld bis 10.000 €.",
      en: "And it goes on: cash up to 10,000 euros.",
    },
    text: {
      de: "Mehr dürfen Händler dann nicht bar annehmen, und Anbieter dürfen keine anonymen Krypto-Konten führen. Die eigene Wallet betrifft das nicht.",
      en: "Traders may accept no more in cash, and providers may not keep anonymous crypto accounts. Your own wallet is not affected.",
    },
  },
  {
    id: "weiter-finanzamt",
    chapter: "weiter",
    late: true,
    years: [2027, 2028],
    ...next("dac10"),
    text: {
      de: "Ein Vorschlag der Kommission; zustimmen müssen alle EU-Staaten. Der Datenschutzbeauftragte der EU verlangt engere Grenzen.",
      en: "A Commission proposal; every EU country must agree. The EU’s data protection supervisor calls for tighter limits.",
    },
  },
  {
    id: "weiter-register",
    chapter: "weiter",
    shot: "wide",
    clip: "wide",
    years: [2028, 2029],
    ...next("register-eu"),
  },
  {
    id: "weiter-zahlungen",
    chapter: "weiter",
    shot: "wide",
    years: [2029, 2030],
    ...next("r16"),
    marks: [
      {
        id: "tag",
        text: {
          de: "Name, Anschrift, Geburtsdatum",
          en: "name, postal address, date of birth",
        },
      },
    ],
  },

  // ---------- Für dich: the camera goes into one cell, the crypto cell.
  // The figures are those of the balance (history-evidence.ts, leaks.ts).
  {
    id: "du-erfasst",
    chapter: "du",
    shot: "cell",
    clip: "cell",
    title: {
      de: "Und du? Gemeldet wirst du ohne Verdacht.",
      en: "And you? You are reported without suspicion.",
    },
    text: {
      de: `Es reicht ein Konto im Ausland: ${lastAccounts.year} tauschten Steuerbehörden weltweit Daten zu ${lastAccounts.millions} Millionen Konten aus. Mit DAC8 wird jeder Kunde eines Krypto-Anbieters gemeldet, auch wer im selben Land wohnt.`,
      en: `An account abroad is enough: in ${lastAccounts.year} tax authorities worldwide exchanged data on ${lastAccounts.millions} million accounts. With DAC8 every customer of a crypto-asset provider is reported, including those who live in the same country.`,
    },
    sources: [
      ...accountsSources,
      eurlex(
        "dir/2023/2226",
        "Richtlinie (EU) 2023/2226",
        "Directive (EU) 2023/2226",
      ),
    ],
  },
  {
    id: "du-datenleck",
    chapter: "du",
    shot: "leak",
    clip: "leak",
    title: {
      de: "Gesammelte Daten gehen verloren, auch bei Behörden.",
      en: "Collected data get lost, at authorities too.",
    },
    text: {
      de: `${leakCount.all} belegte Fälle, ${leakCount.authority} davon bei Behörden, rund ${roundPeople(peopleAffected, "de")} Betroffene. Bulgariens Steuerbehörde verlor 2019 auch Kontodaten aus dem Austausch, über den künftig DAC8 läuft.`,
      en: `${leakCount.all} documented cases, ${leakCount.authority} of them at authorities, about ${roundPeople(peopleAffected, "en")} people affected. In 2019 Bulgaria’s tax authority also lost account data from the very exchange DAC8 reports will travel through.`,
    },
    caption: {
      de: "Ein Blatt je belegtem Fall, rot bei Behörden.",
      en: "One sheet per documented case, red at authorities.",
    },
    sources: bulgariaSources,
    more: (language) => [
      {
        label: {
          de: "Alle belegten Fälle von Datenlecks mit Primärquellen",
          en: "Every documented data leak with its primary sources",
        },
        href: pathFor("leaks", language),
      },
    ],
  },
  {
    id: "du-grund",
    chapter: "du",
    shot: "letter",
    clip: "letter",
    title: {
      de: "Abgelehnt oder gekündigt, ohne zu erfahren, warum.",
      en: "Refused or closed, without being told why.",
    },
    text: {
      de: `Deutschland, Mitte ${germany.from} bis Mitte ${germany.to}: rund ${formatNumber(germany.refused, "de")} Basiskonten wegen der Geldwäsche-Prüfung abgelehnt, rund ${formatNumber(germany.closed, "de")} gekündigt, ohne dass die Bank den Grund nennen durfte. Österreichs Finanzmarktaufsicht hat dazu keine Zahlen.`,
      en: `Germany, mid-${germany.from} to mid-${germany.to}: about ${formatNumber(germany.refused, "en")} basic accounts refused on anti-money-laundering grounds, about ${formatNumber(germany.closed, "en")} closed without the bank being allowed to give the reason. Austria’s financial market authority has no figures on this.`,
    },
    sources: [
      unexplained.sources.germany,
      unexplained.sources.austria,
      ...unexplained.sources.law,
    ],
  },

  // ---------- Rechnung: the yard, with pallets of 100-euro notes at true
  // scale, one per 100 million euros: what three reporting duties cost a
  // year, then beside it the benefit of all exchanged tax data, measured
  // and modelled. The benefit covers more duties than the costs; the
  // picture names both, so the piles cannot be read as "it pays".
  {
    id: "rechnung-kosten",
    chapter: "rechnung",
    shot: "yard-cost",
    clip: "yard",
    title: {
      de: `Die Rechnung: über ${costFloor("de")} Milliarden Euro im Jahr.`,
      en: `The bill: over ${costFloor("en")} billion euros a year.`,
    },
    text: {
      de: "So viel kosten allein drei Meldepflichten an die Steuer, Jahr für Jahr, schätzt die Kommission.",
      en: "That is what three duties to report to the tax office alone cost, year after year, as the Commission estimates it.",
    },
    marks: [
      {
        id: "cost",
        text: {
          de: "Kosten von drei Meldepflichten",
          en: "cost of three reporting duties",
        },
      },
    ],
    caption: {
      de: "Maßstabsgetreu: Eine Palette trägt eine Million Hunderter, 100 Mio. €.",
      en: "At true scale: a pallet carries a million 100-euro notes, €100m.",
    },
    sources: reportingCostSources,
  },
  {
    id: "rechnung-nutzen",
    chapter: "rechnung",
    shot: "yard-benefit",
    clip: "benefit",
    title: {
      de: `Belegt ist ein Nutzen von ${formatNumber(reportingBenefit.fromData, "de")} Milliarden.`,
      en: `The benefit on record is ${formatNumber(reportingBenefit.fromData, "en")} billion.`,
    },
    text: {
      de: `Aus Daten, für alle ausgetauschten Steuerdaten zusammen. Die Kommission schätzt ${formatNumber(reportingBenefit.billions, "de")} Milliarden im Jahr; die übrigen ${formatNumber(reportingBenefit.modelled, "de")} stammen aus einem Modell.`,
      en: `From data, for all exchanged tax data together. The Commission estimates ${formatNumber(reportingBenefit.billions, "en")} billion a year; the other ${formatNumber(reportingBenefit.modelled, "en")} come from a model.`,
    },
    marks: [
      {
        id: "cost",
        text: {
          de: "Kosten von drei Meldepflichten",
          en: "cost of three reporting duties",
        },
      },
      {
        id: "measured",
        text: { de: "Nutzen aus Daten", en: "benefit from data" },
      },
      {
        id: "modelled",
        text: { de: "Nutzen aus dem Modell", en: "benefit from the model" },
      },
    ],
    caption: {
      de: "Maßstabsgetreu: Eine Palette trägt eine Million Hunderter, 100 Mio. €.",
      en: "At true scale: a pallet carries a million 100-euro notes, €100m.",
    },
    sources: reportingBenefit.sources.slice(0, 1),
  },

  // ---------- Versprochen: the loudspeakers on the tower. The first three
  // pairs of history-promises.ts, DAC8 in the EU, Austria and Germany:
  // what was announced, and what their own institutions have on record.
  ...promised,
]

// The pile: every EU anti-money-laundering act since 1991 by year, in pages
// of the Official Journal (for the 2024 acts, published one per issue, the
// pages of each act). Repealed acts count too: it is what was adopted. The
// first directive also stands alone beside it.
export const pile: { year: number; pages: number; acts: string }[] = [
  { year: 1991, pages: 6, acts: "91/308" },
  { year: 2001, pages: 7, acts: "2001/97" },
  { year: 2005, pages: 22, acts: "2005/60" },
  { year: 2006, pages: 15, acts: "2006/70, 1781/2006" },
  { year: 2015, pages: 63, acts: "2015/849, 2015/847" },
  { year: 2018, pages: 41, acts: "2018/843, 2018/1673" },
  { year: 2023, pages: 39, acts: "2023/1113" },
  { year: 2024, pages: 295, acts: "2024/1624, 2024/1640, 2024/1620" },
]

// Suspicion reports in Austria against convictions for money laundering:
// the first year with a count, 2005, and the latest. 9,665 of the latest
// year's reports were not passed on but kept for later analysis
// (Lagebericht Geldwäsche 2025, pp. 29–34).
export const reportField = {
  firstYear: 2005,
  first: 467,
  latest: 13989,
  kept: 9665,
  convictions: 139,
}
