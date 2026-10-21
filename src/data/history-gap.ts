import type { Language } from "@/lib/i18n"

// The gap between the film and the balance on the history page: the
// apparatus grows, what it costs is rarely estimated, what it brings is
// hardly measured, and in between the authorities say so in their own
// words. Every figure and quotation is verified in the dac8-wiki raw
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

// ---------- What it brings: suspicion reports in Germany against the
// prosecutors' replies that reached a court.
export const germanReports = {
  first: { year: 2008, value: 7349 },
  latest: { year: 2025, value: 374693 },
  replies: 41743,
  atCourt: 1669,
}

// ---------- Austria's bank package of 2015 (account register, capital
// outflow reports, account exchange): promised, counted, ticked off. The
// revenue table of the 2020 evaluation repeats the plan year by year.
export const bankPackage = {
  promised: { year: 2016, millions: 700 },
  queries: 13174,
  inspections: { count: 8, euros: 387829 },
  sources: {
    bill: wfa("XXV/I/685/fname_423806.pdf", "RV 685 (XXV. GP)"),
    answer: parliament(
      "XXVI/AB/2843/imfname_748144.pdf",
      "Finanzministerium, Anfragebeantwortung 2843/AB (XXVI. GP), S. 2 und 8",
      "Finance ministry, answer 2843/AB (26th legislative period), pp. 2 and 8, in German",
    ),
    evaluation: {
      label: {
        de: "Bundesregierung, Bericht über die Wirkungsorientierte Folgenabschätzung 2020, S. 229–231, Archivkopie",
        en: "Federal Government, report on impact assessments 2020, pp. 229–231, archived copy, in German",
      },
      href: "https://web.archive.org/web/2024/https://wirkungsmonitoring.gv.at/wp-content/uploads/2023/05/WFA_Bericht_2020.pdf",
    } satisfies Source,
  },
}

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
  costs: {
    id: "dac6-many-times",
    who: {
      de: "Deutsche Bundesregierung über ihre eigene Kostenschätzung zu DAC6, 2019",
      en: "Germany’s Federal Government on its own DAC6 cost estimate, 2019",
    },
    quote: {
      de: "„Da jedoch die Belastung … insgesamt um ein vielfaches höher liegen dürfte …“",
      en: "The burden overall, it conceded, was likely to be many times higher.",
    },
    source: bundestag(
      "19/146/1914685.pdf",
      "Bundesregierung, Drucksache 19/14685, S. 2",
      "Federal Government, Bundestag paper 19/14685, p. 2, in German",
    ),
  },
  outcomes: {
    id: "a-fiu-outcomes",
    who: {
      de: "FATF über Österreichs Geldwäschemeldestelle, 2026",
      en: "FATF on Austria’s financial intelligence unit, 2026",
    },
    quote: {
      de: "Den Ausgang der Strafverfahren kennt die Geldwäschemeldestelle nicht, nicht einmal für ihre eigene Arbeit: Diese Daten werden weder erhoben noch verfolgt.",
      en: "It does not have information on the outcome of criminal proceedings “(not even for its own functioning), as this data is neither collected, nor tracked”.",
    },
    source: {
      label: {
        de: "FATF, Länderprüfung Österreich 2026, Rn. 439",
        en: "FATF, mutual evaluation of Austria, 2026, para 439",
      },
      href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/mer/MER-Austria-2026.pdf.coredownload.inline.pdf",
    },
  },
  revenue: {
    id: "crs-no-basis",
    who: {
      de: "Österreichische Bundesregierung über den Ertrag des Kontenaustauschs, 2015",
      en: "Austria’s government on what the account exchange would bring, 2015",
    },
    quote: {
      de: "„… waren keine seriösen Schätzungsgrundlagen bzw. Statistiken verfügbar … wurde von einer Schätzung der Erträge Abstand genommen.“",
      en: "There was no serious basis or statistic for an estimate, so it refrained from estimating the revenue.",
    },
    source: wfa("XXV/I/685/fname_423806.pdf", "RV 685 (XXV. GP), S. 7"),
  },
  austria: {
    id: "dac8-at-evaluation",
    who: {
      de: "Österreichische Bundesregierung in der Folgenabschätzung zu DAC8, 2025",
      en: "Austria’s government in its DAC8 impact assessment, 2025",
    },
    quote: {
      de: "„Zeitpunkt der internen Evaluierung: 2030.“",
      en: "Internal evaluation: 2030.",
    },
    source: wfa("XXVIII/I/306/imfname_1723218.pdf", "RV 306 (XXVIII. GP)"),
  },
  last: {
    id: "dac8-no-evaluation",
    who: {
      de: "Deutsche Bundesregierung im Gesetzentwurf zu DAC8, 2025",
      en: "Germany’s Federal Government in its DAC8 bill, 2025",
    },
    quote: {
      de: "„Eine Evaluierung ist nicht vorgesehen, da es sich um die 1:1-Umsetzung der DAC 8 handelt.“",
      en: "No evaluation is planned, it says, because the law transposes DAC8 one to one.",
    },
    source: bundestag(
      "21/019/2101937.pdf",
      "Bundesregierung, Drucksache 21/1937, S. 46",
      "Federal Government, Bundestag paper 21/1937, p. 46, in German",
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
