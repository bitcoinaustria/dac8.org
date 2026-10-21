import type { Language } from "@/lib/i18n"

// The history page's scroll film: how the rules piled up and how little
// came of it, in five chapters of very short steps. It starts with the
// reader, from which amount you have to show ID, and ends with the result.
// Each step is a headline of a few words, at most one line under it, and
// changes one picture: a contrast you see before you read. Every figure is verified in
// dac8-wiki/.wiki/wiki/references/rule-growth-and-effect-evidence.md and
// aml-kyc-history-austria.md; the charts below the film carry the full
// series. Keep both languages in sync and say no more than the source does.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

const eurlex = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://eur-lex.europa.eu/eli/${path}/oj`,
})

export type Scene = "threshold" | "rules" | "tower" | "result"

// The story's order: what is asked of you, how many rules ask it, how much
// paper they fill, and what comes of it.
export const chapters: { id: string; scene: Scene; label: Text }[] = [
  { id: "ausweis", scene: "threshold", label: { de: "Ausweis", en: "ID" } },
  { id: "regeln", scene: "rules", label: { de: "Regeln", en: "Rules" } },
  { id: "papier", scene: "tower", label: { de: "Papier", en: "Paper" } },
  { id: "ergebnis", scene: "result", label: { de: "Ergebnis", en: "Result" } },
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
}

const fiu2025: Source = {
  label: {
    de: "Geldwäschemeldestelle, Lagebericht Geldwäsche 2025",
    en: "Financial intelligence unit, money laundering report 2025",
  },
  href: "https://www.bundeskriminalamt.at/308/files/374-2026-geldwaeschebericht-2025-a4-v20260915-web-bf.pdf",
}
const europol: Source = {
  label: {
    de: "Europol, Criminal asset recovery in the EU, 2016",
    en: "Europol, Criminal asset recovery in the EU, 2016",
  },
  href: "https://www.europol.europa.eu/sites/default/files/documents/criminal_asset_recovery_in_the_eu_web_version_0.pdf",
}

// Austria's consumer price index (VPI 86, 1986 = 100), annual averages, by
// Statistik Austria, to show past amounts in today's money. 2025 is the
// last full year. ECU became euro one to one (Regulation (EC) 1103/97,
// Art. 2), so 1991 amounts convert like euro amounts.
export const priceIndex: Record<number, number> = {
  1991: 113.1,
  2017: 189.9,
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

const allRules: Source = {
  label: {
    de: "Alle Regeln mit Datum, Inhalt und Primärquellen, im Abschnitt zum Nachprüfen",
    en: "Every rule with its date, content and primary sources, in the section to check",
  },
  href: "#regeln-title",
}

export const steps: Step[] = [
  // ---------- Ausweis: from which amount you must show ID, in today's money.
  {
    id: "ausweis-1991",
    chapter: "ausweis",
    title: {
      de: "1991: Ausweis erst ab 33.900 €.",
      en: "1991: ID only from 33,900 euros.",
    },
    text: {
      de: "Für ein einzelnes Geschäft ohne Konto, in heutigem Geld.",
      en: "For a single transaction without an account, in today’s money.",
    },
    sources: [
      eurlex("dir/1991/308", "Richtlinie 91/308/EWG", "Directive 91/308/EEC"),
      ...priceSources,
    ],
  },
  {
    id: "ausweis-2017",
    chapter: "ausweis",
    title: { de: "2017: ab 1.350 €.", en: "2017: from 1,350 euros." },
    text: {
      de: "Für einen Geldtransfer ohne Konto, in heutigem Geld.",
      en: "For a money transfer without an account, in today’s money.",
    },
    sources: [
      eurlex(
        "dir/2015/849",
        "Richtlinie (EU) 2015/849",
        "Directive (EU) 2015/849",
      ),
      priceSources[0],
    ],
  },
  {
    id: "ausweis-heute",
    chapter: "ausweis",
    title: {
      de: "Heute gibt es keine Grenze mehr.",
      en: "Today there is no limit left.",
    },
    text: {
      de: "Jede Krypto-Übertragung über einen Anbieter trägt deinen Namen.",
      en: "Every crypto transfer through a provider carries your name.",
    },
    sources: [
      eurlex(
        "reg/2023/1113",
        "Verordnung (EU) 2023/1113",
        "Regulation (EU) 2023/1113",
      ),
    ],
  },

  // ---------- Regeln: every rule as a card, the year running with the scroll.
  {
    id: "regeln-1977",
    chapter: "regeln",
    years: [1977, 1993],
    title: {
      de: "Bis 1993: keine dieser Regeln.",
      en: "Until 1993: none of these rules.",
    },
    text: {
      de: "Steuerbehörden fragten einander nur im Einzelfall.",
      en: "Tax authorities asked each other only in single cases.",
    },
    sources: [allRules],
  },
  {
    id: "regeln-heute",
    chapter: "regeln",
    years: [1994, 2029],
    // Only the Savings Directive ever ended, repealed by Directive (EU)
    // 2015/2060 because the broader DAC2 superseded it.
    title: {
      de: "Vom Sparbuch bis zum Bargeld: Es kommt nur dazu.",
      en: "From savings books to cash: rules only get added.",
    },
    text: {
      de: "Weggefallen ist seit 1977 eine einzige Regel, für eine umfassendere.",
      en: "Since 1977 a single rule has gone, for a broader one.",
    },
    sources: [allRules],
  },

  // ---------- Papier: the first directive beside everything since.
  {
    id: "papier-1991",
    chapter: "papier",
    title: { de: "1991: 6 Seiten.", en: "1991: 6 pages." },
    text: {
      de: "Die erste Geldwäsche-Richtlinie der EU.",
      en: "The EU’s first anti-money-laundering directive.",
    },
    sources: [
      eurlex("dir/1991/308", "Richtlinie 91/308/EWG", "Directive 91/308/EEC"),
    ],
  },
  {
    id: "papier-heute",
    chapter: "papier",
    title: { de: "Heute: 488 Seiten.", en: "Today: 488 pages." },
    text: {
      de: "Gut 22 Stunden Lesezeit, nur für das Geldwäsche-Recht der EU.",
      en: "Over 22 hours of reading, for EU anti-money-laundering law alone.",
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

  // ---------- Ergebnis: what comes of it.
  {
    id: "ergebnis-2005",
    chapter: "ergebnis",
    title: {
      de: "Österreich 2005: 467 Meldungen.",
      en: "Austria 2005: 467 reports.",
    },
    text: {
      de: "Banken und andere Anbieter melden der Geldwäschemeldestelle der Polizei Geschäfte, die ihnen verdächtig vorkommen, samt Kundendaten. Ein Korn je Meldung.",
      en: "Banks and other providers report transactions that look suspicious to them, with the customer’s data, to the police’s financial intelligence unit. One grain per report.",
    },
    sources: [
      {
        label: {
          de: "Innenministerium, Anfragebeantwortung 4756/AB (XXIII. GP)",
          en: "Interior ministry, answer 4756/AB (23rd legislative period)",
        },
        href: "https://www.parlament.gv.at/dokument/XXIII/AB/4756/fname_141334.pdf",
      },
    ],
  },
  {
    id: "ergebnis-2025",
    chapter: "ergebnis",
    title: { de: "Österreich 2025: 13.989.", en: "Austria 2025: 13,989." },
    text: {
      de: "Rund dreißigmal so viele wie 2005, zum Teil, weil heute anders gezählt wird.",
      en: "About thirty times as many as in 2005, partly because they are counted differently today.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-urteile",
    chapter: "ergebnis",
    title: { de: "139 Verurteilungen.", en: "139 convictions." },
    text: {
      de: "Wegen Geldwäsche, in Österreich, im selben Jahr. Ein rotes Korn je Urteil.",
      en: "For money laundering, in Austria, in the same year. One red grain per conviction.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-euro",
    chapter: "ergebnis",
    title: {
      de: "Von 100 € aus Straftaten wird rund 1 € eingezogen.",
      en: "Of 100 euros from crime, about 1 is confiscated.",
    },
    text: {
      de: "In der EU, nach Schätzung von Europol.",
      en: "In the EU, as Europol estimates it.",
    },
    sources: [europol],
  },
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

// From which amount ID is needed, shown in today's money; 1991 in ECU.
export const thresholds: {
  step: string
  year: number
  amount: number
  unit: "ECU" | "EUR"
}[] = [
  { step: "ausweis-1991", year: 1991, amount: 15000, unit: "ECU" },
  { step: "ausweis-2017", year: 2017, amount: 1000, unit: "EUR" },
  { step: "ausweis-heute", year: 2024, amount: 0, unit: "EUR" },
]

// Suspicion reports in Austria against convictions for money laundering.
export const reportField = { first: 467, latest: 13989, convictions: 139 }
