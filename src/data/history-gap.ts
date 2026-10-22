import type { Language } from "@/lib/i18n"

// Figures for the bill on the history page (src/components/RuleBill.astro):
// how the apparatus grows, how rarely its cost is estimated, the German
// report series and what Europol says is confiscated. Every figure and quotation is verified in the dac8-wiki raw
// records named 2026-10-21-gap-* and 2026-10-21-sidefx-*. Quotation marks
// only around words in their own language: on the English page German
// quotations are reported without them, and the other way round.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

const parliament = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://www.parlament.gv.at/dokument/${path}`,
})
const bundestag = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://dserver.bundestag.de/btd/${path}`,
})

// ---------- The apparatus: start, latest and planned, each on its own
// scale. Posts are budgeted posts, not heads.
export type Growth = {
  id: string
  who: Text
  unit: Text
  start: { year: number; value: number }
  now: { year: number; value: number }
  // The plan, with its year where the source gives one.
  planned?: { year?: number; value: number }
  // Decimals to show.
  digits: number
  sources: Source[]
}

export const apparatus: Growth[] = [
  {
    id: "fiu-de",
    who: {
      de: "Geldwäschemeldestelle in Deutschland",
      en: "Germany’s financial intelligence unit",
    },
    unit: { de: "Planstellen", en: "budgeted posts" },
    start: { year: 2017, value: 100 },
    now: { year: 2021, value: 515 },
    planned: { year: 2026, value: 720 },
    digits: 0,
    sources: [
      bundestag(
        "19/325/1932556.pdf",
        "Bundesregierung, Drucksache 19/32556, Frage 12",
        "Federal Government, Bundestag paper 19/32556, question 12, in German",
      ),
    ],
  },
  {
    id: "fma",
    who: {
      de: "Geldwäsche-Aufsicht der FMA in Österreich",
      en: "Anti-money-laundering supervision at Austria’s FMA",
    },
    unit: { de: "Vollzeitstellen", en: "full-time posts" },
    start: { year: 2016, value: 13.25 },
    now: { year: 2025, value: 33.15 },
    planned: { value: 44.25 },
    digits: 0,
    sources: [
      {
        label: {
          de: "FATF, Länderprüfung Österreich 2026",
          en: "FATF, mutual evaluation of Austria, 2026",
        },
        href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/mer/MER-Austria-2026.pdf.coredownload.inline.pdf",
      },
    ],
  },
  {
    id: "amla",
    who: {
      de: "Neue EU-Geldwäschebehörde AMLA",
      en: "The new EU anti-money-laundering authority, AMLA",
    },
    unit: { de: "Mio. € Budget", en: "€ million budget" },
    start: { year: 2025, value: 12.9 },
    now: { year: 2026, value: 43.1 },
    planned: { year: 2028, value: 96 },
    digits: 1,
    sources: [
      {
        label: {
          de: "AMLA, Programmplanung 2026–2028",
          en: "AMLA, programming document 2026–2028",
        },
        href: "https://www.amla.europa.eu/document/download/27549516-d110-4e91-b1ed-d3552b8f9661_en?filename=AMLA%20SPD%202026-2028.pdf",
      },
    ],
  },
]

// ---------- What each Austrian law on money laundering or tax reporting
// since 2015 was estimated to cost business a year, as put before
// parliament. A selection, not every amendment.
export type Estimate = {
  year: number
  law: Text
  // Million euros a year; or why there is no figure.
  millions?: string
  note?: Text
  none?: "no-assessment" | "no-figure" | "not-estimable" | "not-material"
  source: Source
}

const motion = (path: string, name: string): Source => ({
  label: {
    de: `Initiativantrag ${name}, ohne Folgenabschätzung`,
    en: `Members’ motion ${name}, without impact assessment, in German`,
  },
  href: `https://www.parlament.gv.at/gegenstand/${path}`,
})
const wfa = (path: string, name: string): Source =>
  parliament(
    path,
    `${name}, Vorblatt und Folgenabschätzung`,
    `${name}, cover sheet and impact assessment, in German`,
  )

export const estimates: Estimate[] = [
  {
    year: 2015,
    law: {
      de: "Kontenregister und Kontenaustausch",
      en: "Account register and account exchange",
    },
    millions: "5–10",
    note: {
      de: "nur der Kontenaustausch; dazu 40–60 Mio. € einmalig",
      en: "the account exchange alone; plus €40–60m once",
    },
    source: wfa("XXV/I/685/fname_423806.pdf", "RV 685 (XXV. GP)"),
  },
  {
    year: 2016,
    law: { de: "Geldwäschegesetz", en: "Anti-money-laundering act" },
    none: "no-figure",
    source: wfa("XXV/I/1335/fname_571798.pdf", "RV 1335 (XXV. GP)"),
  },
  {
    year: 2017,
    law: { de: "Register der Eigentümer", en: "Beneficial ownership register" },
    millions: "0,19",
    note: {
      de: "nur neue Firmen; die erste Meldung aller nicht beziffert",
      en: "new firms only; everyone’s first filing not costed",
    },
    source: wfa("XXV/I/1660/fname_639898.pdf", "RV 1660 (XXV. GP)"),
  },
  {
    year: 2019,
    law: {
      de: "Krypto-Anbieter unter Geldwäsche-Aufsicht",
      en: "Crypto providers under anti-money-laundering supervision",
    },
    none: "no-assessment",
    source: parliament(
      "XXVI/I/644/fname_758502.pdf",
      "Finanzausschuss, Bericht 644 (XXVI. GP)",
      "Finance Committee, report 644 (26th legislative period), in German",
    ),
  },
  {
    year: 2019,
    law: {
      de: "Meldepflicht für Steuergestaltungen DAC6",
      en: "Reporting of tax arrangements, DAC6",
    },
    none: "no-assessment",
    source: motion("XXVI/A/983", "983/A (XXVI. GP)"),
  },
  {
    year: 2021,
    law: {
      de: "Kontenregister für mehr Behörden",
      en: "Account register opened to more authorities",
    },
    none: "no-assessment",
    source: motion("XXVII/A/1191", "1191/A (XXVII. GP)"),
  },
  {
    year: 2022,
    law: { de: "Meldepflicht für Plattformen", en: "Reporting by platforms" },
    millions: "0,44",
    source: wfa("XXVII/I/1534/fname_1452749.pdf", "RV 1534 (XXVII. GP)"),
  },
  {
    year: 2023,
    law: {
      de: "Register der Eigentümer, neu",
      en: "Ownership register, amended",
    },
    none: "not-material",
    source: wfa("XXVII/I/2091/fname_1569627.pdf", "RV 2091 (XXVII. GP)"),
  },
  {
    year: 2024,
    law: {
      de: "Anpassung des Geldwäschegesetzes",
      en: "Anti-money-laundering act adjusted",
    },
    none: "no-assessment",
    source: motion("XXVIII/A/1", "1/A (XXVIII. GP)"),
  },
  {
    year: 2025,
    law: { de: "Krypto-Meldepflicht DAC8", en: "Crypto reporting, DAC8" },
    millions: "5,1",
    note: {
      de: "dazu 6 Mio. € einmalig",
      en: "plus €6m once",
    },
    source: wfa("XXVIII/I/306/imfname_1723218.pdf", "RV 306 (XXVIII. GP)"),
  },
  {
    year: 2026,
    law: { de: "Register der Eigentümer 2027", en: "Ownership register 2027" },
    none: "not-estimable",
    source: wfa("XXVIII/I/622/imfname_1779255.pdf", "RV 622 (XXVIII. GP)"),
  },
]

// Amendments passed as members' or committee motions come without an
// impact assessment; the parliament's page for each lists none.

// German estimates raised once parliament looked again.
export const corrected: {
  id: string
  law: Text
  what: Text
  before: number
  after: number
  sources: Source[]
}[] = [
  {
    id: "dac6",
    law: { de: "DAC6, Deutschland 2019", en: "DAC6, Germany 2019" },
    what: { de: "Mio. € im Jahr", en: "€ million a year" },
    before: 7,
    after: 32.2,
    sources: [
      bundestag(
        "19/146/1914685.pdf",
        "Bundesregierung, Drucksache 19/14685, S. 2",
        "Federal Government, Bundestag paper 19/14685, p. 2, in German",
      ),
      bundestag(
        "19/158/1915876.pdf",
        "Finanzausschuss, Drucksache 19/15876, S. 3–4",
        "Finance Committee, Bundestag paper 19/15876, pp. 3–4, in German",
      ),
    ],
  },
  {
    id: "dac8",
    law: { de: "DAC8, Deutschland 2025", en: "DAC8, Germany 2025" },
    what: { de: "Mio. € einmalig", en: "€ million one-off" },
    before: 9.3,
    after: 50,
    sources: [
      bundestag(
        "21/019/2101937.pdf",
        "Bundesregierung, Drucksache 21/1937",
        "Federal Government, Bundestag paper 21/1937, in German",
      ),
      bundestag(
        "21/026/2102623.pdf",
        "Haushaltsausschuss, Drucksache 21/2623, S. 2",
        "Budget Committee, Bundestag paper 21/2623, p. 2, in German",
      ),
    ],
  },
]

// ---------- In their own words. Each quotation in its original language.
export type Admission = {
  id: string
  who: Text
  quote: Text
  source: Source
}

export const admissions: Record<string, Admission> = {
  staff: {
    id: "a-fiu-budget",
    who: {
      de: "Innenministerium über die Geldwäschemeldestelle, 2024",
      en: "Austria’s interior ministry on its financial intelligence unit, 2024",
    },
    quote: {
      de: "„Budgetmittel für die Geldwäschemeldestelle sind … nicht gesondert veranschlagt. Es können daher keine detaillierten Angaben … gegeben werden.“",
      en: "The unit’s funds are not budgeted separately, so no detailed figures can be given.",
    },
    source: parliament(
      "XXVII/AB/16404/imfname_1605860.pdf",
      "Anfragebeantwortung 16404/AB (XXVII. GP)",
      "Answer 16404/AB (27th legislative period), in German",
    ),
  },
}

export const reportSources: Source[] = [
  {
    label: {
      de: "BKA, FIU-Jahresbericht 2016, S. 9",
      en: "BKA, FIU annual report 2016, p. 9",
    },
    href: "https://www.bka.de/SharedDocs/Downloads/DE/Publikationen/JahresberichteUndLagebilder/FIU/Jahresberichte/fiuJahresbericht2016.pdf?__blob=publicationFile&v=4",
  },
  {
    label: {
      de: "FIU, Jahresbericht 2025",
      en: "FIU, annual report 2025",
    },
    href: "https://www.zoll.de/SharedDocs/Downloads/DE/Links-fuer-Inhaltseiten/Fachthemen/FIU/fiu_jahresbericht_2025.pdf?__blob=publicationFile&v=2",
  },
]

// ---------- The scissors: suspicion reports in Germany per year, as the
// financial intelligence unit counts them (first-time reports until 2016,
// from 2017 first and follow-up reports together, so 2017 is a break).
export const germanReportsByYear: { year: number; reports: number }[] = [
  { year: 2008, reports: 7349 },
  { year: 2009, reports: 9046 },
  { year: 2010, reports: 11042 },
  { year: 2011, reports: 12868 },
  { year: 2012, reports: 14361 },
  { year: 2013, reports: 19095 },
  { year: 2014, reports: 24054 },
  { year: 2015, reports: 29108 },
  { year: 2016, reports: 40690 },
  { year: 2017, reports: 59845 },
  { year: 2018, reports: 77252 },
  { year: 2019, reports: 114914 },
  { year: 2020, reports: 144005 },
  { year: 2021, reports: 298507 },
  { year: 2022, reports: 337186 },
  { year: 2023, reports: 322590 },
  { year: 2024, reports: 265708 },
  { year: 2025, reports: 374693 },
]
export const germanReportsSources: Source[] = [
  reportSources[0],
  {
    label: {
      de: "FIU, Jahresberichte 2017 bis 2025",
      en: "FIU, annual reports 2017 to 2025, in German",
    },
    href: "https://www.zoll.de/DE/FIU/Fachliche-Informationen/Jahresberichte/jahresberichte_node.html",
  },
]

// Germany: persons convicted with money laundering (§ 261 StGB) as the
// recorded offence, by year of the final decision. Only the offence with
// the heaviest penalty is recorded, so laundering beside a heavier crime
// is missing; the reform of March 2021 widened the offence to all crimes.
// Verified in dac8-wiki raw records 2026-10-21-gap-de-destatis-*.
export const germanConvictionsByYear: { year: number; convictions: number }[] =
  [
    { year: 2008, convictions: 608 },
    { year: 2009, convictions: 416 },
    { year: 2010, convictions: 704 },
    { year: 2011, convictions: 903 },
    { year: 2012, convictions: 897 },
    { year: 2013, convictions: 828 },
    { year: 2014, convictions: 781 },
    { year: 2015, convictions: 734 },
    { year: 2016, convictions: 854 },
    { year: 2017, convictions: 763 },
    { year: 2018, convictions: 727 },
    { year: 2019, convictions: 712 },
    { year: 2020, convictions: 829 },
    { year: 2021, convictions: 1146 },
    { year: 2022, convictions: 1375 },
    { year: 2023, convictions: 2098 },
    { year: 2024, convictions: 3157 },
  ]
export const germanConvictionsSources: Source[] = [
  {
    label: {
      de: "Statistisches Bundesamt, Strafverfolgung, Fachserie 10 Reihe 3, Tabelle 2.1, 2008 bis 2021",
      en: "Federal Statistical Office, prosecution statistics, series 10.3, table 2.1, 2008 to 2021, in German",
    },
    href: "https://www.destatis.de/DE/Themen/Staat/Justiz-Rechtspflege/Publikationen/Downloads-Strafverfolgung-Strafvollzug/strafverfolgung-2100300217004.pdf?__blob=publicationFile",
  },
  {
    label: {
      de: "Statistisches Bundesamt, Statistischer Bericht Strafverfolgung 2024, Tabelle 24311-05",
      en: "Federal Statistical Office, prosecution report 2024, table 24311-05, in German",
    },
    href: "https://www.destatis.de/static/DE/dokumente/2100300247005_SBb.xlsx",
  },
]

// The share of criminal proceeds confiscated in the EU, as Europol puts
// it: 1.1 percent for 2010 to 2014, and in 2025 "stagnated at around an
// estimated 2 %", without a period or method. Nothing measured between.
export const recovery = {
  measured: { from: 2010, to: 2014, percent: 1.1 },
  latest: { year: 2025, percent: 2 },
  sources: [
    {
      label: {
        de: "Europol, Criminal asset recovery in the EU, 2016",
        en: "Europol, Criminal asset recovery in the EU, 2016",
      },
      href: "https://www.europol.europa.eu/sites/default/files/documents/criminal_asset_recovery_in_the_eu_web_version_0.pdf",
    },
    {
      label: {
        de: "Europol, EU-SOCTA 2025, S. 13 und 25",
        en: "Europol, EU-SOCTA 2025, pp. 13 and 25",
      },
      href: "https://www.europol.europa.eu/cms/sites/default/files/documents/EU-SOCTA-2025.pdf",
    },
  ] satisfies Source[],
  quote: {
    de: "Trotz erheblicher Investitionen in Personal, Mittel und Gesetze stagniere das Einziehen von Erträgen aus Straftaten bei geschätzt rund 2 Prozent.",
    en: "“Despite substantial investments in resources and legislative frameworks, the confiscation of criminal proceeds has stagnated at around an estimated 2 % of illicit proceeds.”",
  } satisfies Text,
}
