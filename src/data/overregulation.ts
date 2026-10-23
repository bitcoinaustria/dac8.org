import type { Language } from "@/lib/i18n"

// The history page's scroll film: how the rules piled up, step by small
// step, and how little came of it, in five chapters of eleven short steps.
// It starts with the reader, from which amount you have to show ID, shows
// the ways money takes filling with rules and the register filling with
// readers, and ends with the result.
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

export type Scene = "threshold" | "rules" | "watch" | "tower" | "result"

// The story's order: what is asked of you, how many rules ask it, who gets
// to look, how much paper they fill, and what comes of it.
export const chapters: { id: string; scene: Scene; label: Text }[] = [
  { id: "ausweis", scene: "threshold", label: { de: "Ausweis", en: "ID" } },
  { id: "regeln", scene: "rules", label: { de: "Regeln", en: "Rules" } },
  { id: "zweck", scene: "watch", label: { de: "Zugriff", en: "Access" } },
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

export const steps: Step[] = [
  // ---------- Ausweis: from which amount a single cash transaction without
  // an account needs ID, against crypto, where there is no amount at all.
  // The general threshold stayed at 15,000 from 1991 until the AMLR lowers
  // it in 2027 (rule-growth-and-effect-evidence.md, "Thresholds"); the
  // first step shows 1991 and 2027 together.
  {
    id: "ausweis-bar",
    chapter: "ausweis",
    title: {
      de: "Bar: Ausweis erst ab 10.000 €.",
      en: "Cash: ID only from 10,000 euros.",
    },
    text: {
      de: "Für ein einzelnes Geschäft ohne Konto, ab 2027. 1991 lag die Grenze bei 33.900 €, in heutigem Geld.",
      en: "For a single transaction without an account, from 2027. In 1991 the limit was 33,900 euros, in today’s money.",
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
  {
    id: "ausweis-krypto",
    chapter: "ausweis",
    title: {
      de: "Krypto: ab dem ersten Cent.",
      en: "Crypto: from the first cent.",
    },
    text: {
      de: "Seit 2024 trägt jede Übertragung über einen Anbieter deinen Namen.",
      en: "Since 2024 every transfer through a provider carries your name.",
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
  // the year running from 1977 with the scroll.
  {
    id: "regeln",
    chapter: "regeln",
    years: [1977, 2029],
    // Only the Savings Directive ever ended, repealed by Directive (EU)
    // 2015/2060 because the broader DAC2 superseded it.
    title: {
      de: "Vom Sparbuch bis zum Bargeld: Es kommt nur dazu.",
      en: "From savings books to cash: rules only get added.",
    },
    text: {
      de: "Seit 1977 ist eine einzige Regel weggefallen, für eine umfassendere.",
      en: "Since 1977 a single rule has gone, for a broader one.",
    },
    sources: [allRules],
  },

  // ---------- Zugriff: who may look into the Austrian account register, and
  // what tax data may be used for. The watchtower gains a lit window per
  // kind of authority (aml-history.ts, row "kontenregister").
  {
    id: "zweck-2016",
    chapter: "zweck",
    title: {
      de: "2016: Drei dürfen ins Kontenregister schauen.",
      en: "2016: three may look into the account register.",
    },
    text: {
      de: "Staatsanwaltschaften, Strafgerichte und Abgabenbehörden sehen, wer bei welcher Bank ein Konto hat.",
      en: "Prosecutors, criminal courts and tax authorities see who holds an account at which bank.",
    },
    sources: [ris(2015, 116)],
  },
  {
    id: "zweck-heute",
    chapter: "zweck",
    title: { de: "Heute: neun.", en: "Today: nine." },
    text: {
      de: "Fünf kamen 2021 dazu, das Amt für Betrugsbekämpfung 2026. Und seit DAC8 dienen alle Steuerdaten, die Behörden austauschen, auch gegen Geldwäsche.",
      en: "Five were added in 2021, the anti-fraud office in 2026. And since DAC8, all tax data authorities exchange also serve against money laundering.",
    },
    sources: [
      ris(2021, 25),
      ris(2026, 46),
      eurlex(
        "dir/2023/2226",
        "Richtlinie (EU) 2023/2226, Art. 1 Nr. 7",
        "Directive (EU) 2023/2226, Article 1(7)",
      ),
    ],
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
  // Every act in the pile below, repealed ones included, whole texts:
  // about 272,000 words, at 200 words a minute a little over 22 hours.
  {
    id: "papier-heute",
    chapter: "papier",
    title: {
      de: "Seither beschlossen: 488 Seiten.",
      en: "Adopted since: 488 pages.",
    },
    text: {
      de: "Gut 22 Stunden Lesezeit, nur die Geldwäsche-Gesetze der EU.",
      en: "Over 22 hours of reading, for the EU’s anti-money-laundering acts alone.",
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
    title: {
      de: "Österreich 2025: 13.989 Verdachtsmeldungen.",
      en: "Austria 2025: 13,989 suspicion reports.",
    },
    text: {
      de: "Banken und andere Anbieter melden der Polizei, was ihnen verdächtig vorkommt, samt Kundendaten. Rund dreißigmal so viele wie 2005, zum Teil, weil heute anders gezählt wird.",
      en: "Banks and other providers report to the police what looks suspicious to them, with the customer’s data. About thirty times as many as in 2005, partly because they are counted differently today.",
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
    title: {
      de: "9.665 davon bleiben liegen. Gespeichert.",
      en: "9,665 of them go nowhere. Stored.",
    },
    text: {
      de: "Fast sieben von zehn gibt die Meldestelle nicht weiter, mangels Anfangsverdachts, also eines Anhaltspunkts für eine Straftat, oder weiterer Ansätze. Sie bleiben für spätere Auswertungen gespeichert.",
      en: "Nearly seven in ten the unit does not pass on, for lack of an initial suspicion, any indication of a crime, or of further leads. They are kept for later analysis.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-urteile",
    chapter: "ergebnis",
    title: {
      de: "139 Verurteilungen wegen Geldwäsche.",
      en: "139 convictions for money laundering.",
    },
    text: {
      de: "In Österreich, im selben Jahr. Ein rotes Korn je Urteil, eines je Meldung in Grau.",
      en: "In Austria, in the same year. One red grain per conviction, one grey grain per report.",
    },
    sources: [fiu2025],
  },
  {
    id: "ergebnis-euro",
    chapter: "ergebnis",
    title: {
      de: "Von 100 € aus Straftaten werden rund 2 € eingezogen.",
      en: "Of 100 euros from crime, about 2 are confiscated.",
    },
    text: {
      de: "Schätzt Europol für die EU, und spricht trotz aller Investitionen und Gesetze von Stillstand.",
      en: "Europol’s estimate for the EU; despite all the investment and laws, it speaks of stagnation.",
    },
    sources: [socta],
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
  { step: "ausweis-bar", year: 1991, amount: 15000, unit: "ECU" },
  { step: "ausweis-bar", year: 2027, amount: 10000, unit: "EUR" },
  { step: "ausweis-krypto", year: 2024, amount: 0, unit: "EUR" },
]

// Suspicion reports in Austria against convictions for money laundering.
// 9,665 of the latest year's reports were not passed on but kept for later
// analysis (Lagebericht Geldwäsche 2025, pp. 29–34).
export const reportField = {
  first: 467,
  latest: 13989,
  kept: 9665,
  convictions: 139,
}
