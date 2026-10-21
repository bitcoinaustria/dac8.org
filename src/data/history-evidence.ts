import type { Language } from "@/lib/i18n"

// The figures beside the two chronicles on the history page: how much text
// the rules have grown to, how much data flows, and what audits and the
// authorities themselves found about the effect. Every figure is verified in
// dac8-wiki/.wiki/wiki/references/rule-growth-and-effect-evidence.md and its
// raw records. Say what each figure measures and no more: a report that
// leads nowhere is not a false report, and a seizure is not a confiscation.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

// Words of the enacting terms and annexes, without recitals, so the old and
// the new text count alike. The FATF standard has no recitals; its count is
// the recommendations, their interpretive notes, which carry most of it
// today, and the glossary, without introduction and list of amendments.
export const lawGrowth: {
  id: string
  label: Text
  then: { year: number; words: number; act: Text }
  now: { year: number; words: number; act: Text }
  // What the reader should know about the comparison, if anything.
  note?: Text
  sources: Source[]
}[] = [
  {
    id: "fatf",
    label: {
      de: "Empfehlungen der FATF gegen Geldwäsche",
      en: "FATF recommendations against money laundering",
    },
    then: {
      year: 1990,
      words: 2164,
      act: { de: "40 Empfehlungen", en: "40 recommendations" },
    },
    now: {
      year: 2026,
      words: 45232,
      act: {
        de: "40 Empfehlungen mit Erläuterungen und Begriffen",
        en: "40 recommendations with notes and glossary",
      },
    },
    sources: [
      {
        label: { de: "FATF 1990", en: "FATF 1990" },
        href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/FATF%20Recommendations%201990.pdf",
      },
      {
        label: { de: "FATF, Juni 2026", en: "FATF, June 2026" },
        href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/fatf-recommendations-2012.pdf",
      },
    ],
  },
  {
    id: "aml",
    label: {
      de: "Geldwäsche-Regeln der EU",
      en: "EU anti-money-laundering rules",
    },
    then: {
      year: 1991,
      words: 2028,
      act: { de: "Richtlinie 91/308/EWG", en: "Directive 91/308/EEC" },
    },
    now: {
      year: 2024,
      words: 106142,
      act: {
        de: "Verordnungen 2024/1624 und 2024/1620, Richtlinie 2024/1640",
        en: "Regulations 2024/1624 and 2024/1620, Directive 2024/1640",
      },
    },
    note: {
      de: "2024 mit der Verordnung über die neue EU-Geldwäschebehörde; ohne sie 34-mal so lang.",
      en: "2024 including the regulation setting up the new EU anti-money-laundering authority; without it 34 times as long.",
    },
    sources: [
      {
        label: { de: "91/308/EWG", en: "91/308/EEC" },
        href: "https://eur-lex.europa.eu/eli/dir/1991/308/oj",
      },
      {
        label: { de: "2024/1624", en: "2024/1624" },
        href: "https://eur-lex.europa.eu/eli/reg/2024/1624/oj",
      },
      {
        label: { de: "2024/1640", en: "2024/1640" },
        href: "https://eur-lex.europa.eu/eli/dir/2024/1640/oj",
      },
      {
        label: { de: "2024/1620", en: "2024/1620" },
        href: "https://eur-lex.europa.eu/eli/reg/2024/1620/oj",
      },
    ],
  },
  {
    id: "dac",
    label: {
      de: "Steuer-Amtshilfe der EU",
      en: "EU tax cooperation",
    },
    then: {
      year: 1977,
      words: 1786,
      act: { de: "Richtlinie 77/799/EWG", en: "Directive 77/799/EEC" },
    },
    now: {
      year: 2026,
      words: 57087,
      act: {
        de: "Richtlinie 2011/16/EU, Fassung 2026",
        en: "Directive 2011/16/EU, 2026 version",
      },
    },
    sources: [
      {
        label: { de: "77/799/EWG", en: "77/799/EEC" },
        href: "https://eur-lex.europa.eu/eli/dir/1977/799/oj",
      },
      {
        label: {
          de: "2011/16/EU, konsolidiert",
          en: "2011/16/EU, consolidated",
        },
        href: "https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:02011L0016-20260101",
      },
    ],
  },
]

// A reader manages about 200 words a minute; the page says so.
export const wordsPerMinute = 200

// Accounts on which tax authorities worldwide exchanged data under the
// OECD standard, by year of exchange, in millions. Self-reported by the
// tax administrations; accounts with several owners may count more than
// once.
export const accountsExchanged: { year: number; millions: number }[] = [
  { year: 2017, millions: 11 },
  { year: 2018, millions: 47 },
  { year: 2019, millions: 84 },
  { year: 2020, millions: 75 },
  { year: 2021, millions: 111 },
  { year: 2022, millions: 123 },
  { year: 2023, millions: 134 },
  { year: 2024, millions: 171 },
]
export const accountsSources: Source[] = [
  {
    label: {
      de: "OECD Global Forum, Jahresbericht 2020",
      en: "OECD Global Forum, annual report 2020",
    },
    href: "https://www.oecd.org/tax/transparency/documents/global-forum-annual-report-2020.pdf",
  },
  {
    label: {
      de: "OECD Global Forum, Jahresbericht 2025, S. 13",
      en: "OECD Global Forum, annual report 2025, p. 13",
    },
    href: "https://www.oecd.org/content/dam/oecd/en/networks/global-forum-tax-transparency/global-forum-annual-report-2025.pdf",
  },
]

// The first review of the crypto transfer rules is the Commission's, due by
// 30 June 2027; until then the FATF counts implementation, not effect.
export const cryptoReviewSources: Source[] = [
  {
    label: {
      de: "Verordnung (EU) 2023/1113, Art. 37",
      en: "Regulation (EU) 2023/1113, Article 37",
    },
    href: "https://eur-lex.europa.eu/eli/reg/2023/1113/oj",
  },
  {
    label: {
      de: "FATF, 7. Bericht zu Kryptowerten, 2026",
      en: "FATF, 7th targeted update on virtual assets, 2026",
    },
    href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/reports/7th-targeted-update-on-implementation-fatf-standards-vas-vasps-2026.pdf.coredownload.pdf",
  },
]

// European Court of Auditors, special report 03/2021, para 68: 150 items
// of bank and income data received in 2016 by five Member States, Austria
// not among them. A test of what happens to the data, not an EU-wide rate.
export const auditSample = {
  notMatched: 45,
  disregarded: 60,
  followedUp: 45,
  source: {
    label: {
      de: "Europäischer Rechnungshof, Sonderbericht 03/2021, Rn. 68 und 115",
      en: "European Court of Auditors, special report 03/2021, paras 68 and 115",
    },
    href: "https://www.eca.europa.eu/Lists/ECADocuments/SR21_03/SR_Exchange_tax_inform_DE.pdf",
  } satisfies Source,
}

// Europol, 2010 to 2014: share of estimated criminal proceeds in the EU
// frozen or seized for now, and finally confiscated. The proceeds are an
// estimate.
export const assetRecovery = {
  seized: 2.2,
  confiscated: 1.1,
  source: {
    label: {
      de: "Europol, Criminal asset recovery in the EU, 2016",
      en: "Europol, Criminal asset recovery in the EU, 2016",
    },
    href: "https://www.europol.europa.eu/sites/default/files/documents/criminal_asset_recovery_in_the_eu_web_version_0.pdf",
  } satisfies Source,
}

// Austria's financial intelligence unit, 2025. Convictions are not linked
// to particular reports.
export const reportsLatest = {
  year: 2025,
  received: 13989,
  fromCrypto: 2671,
  passedOn: 4324,
  keptOnFile: 9665,
  convictions: 139,
  source: {
    label: {
      de: "Geldwäschemeldestelle, Lagebericht Geldwäsche 2025, S. 29–37",
      en: "Financial intelligence unit, money laundering report 2025, pp. 29–37",
    },
    href: "https://www.bundeskriminalamt.at/308/files/374-2026-geldwaeschebericht-2025-a4-v20260915-web-bf.pdf",
  } satisfies Source,
}

// Suspicious transaction reports received in Austria and final convictions
// for money laundering, per year, both as the financial intelligence unit
// counts them (2005 to 2008 from the interior ministry's answers to
// parliament). The way reports are counted changed in 2012, 2024 and 2025,
// so read the trend, not single steps. Convictions before 2009 are missing.
export const reportsByYear: {
  year: number
  reports: number
  convictions?: number
}[] = [
  { year: 2005, reports: 467 },
  { year: 2006, reports: 692 },
  { year: 2007, reports: 1085 },
  { year: 2008, reports: 1231 },
  { year: 2009, reports: 1427, convictions: 12 },
  { year: 2010, reports: 2289, convictions: 24 },
  { year: 2011, reports: 2115, convictions: 13 },
  { year: 2012, reports: 1665, convictions: 23 },
  { year: 2013, reports: 1490, convictions: 15 },
  { year: 2014, reports: 1673, convictions: 46 },
  { year: 2015, reports: 1793, convictions: 58 },
  { year: 2016, reports: 2150, convictions: 36 },
  { year: 2017, reports: 3058, convictions: 53 },
  { year: 2018, reports: 2744, convictions: 66 },
  { year: 2019, reports: 3073, convictions: 63 },
  { year: 2020, reports: 4356, convictions: 89 },
  { year: 2021, reports: 4994, convictions: 85 },
  { year: 2022, reports: 6053, convictions: 81 },
  { year: 2023, reports: 7603, convictions: 120 },
  { year: 2024, reports: 11111, convictions: 152 },
  { year: 2025, reports: 13989, convictions: 139 },
]
export const reportsByYearSources: Source[] = [
  {
    label: {
      de: "Anfragebeantwortung 4756/AB (XXIII. GP)",
      en: "Answer 4756/AB (23rd legislative period)",
    },
    href: "https://www.parlament.gv.at/dokument/XXIII/AB/4756/fname_141334.pdf",
  },
  {
    label: {
      de: "Anfragebeantwortung 8594/AB (XXV. GP)",
      en: "Answer 8594/AB (25th legislative period)",
    },
    href: "https://www.parlament.gv.at/dokument/XXV/AB/8594/imfname_538548.pdf",
  },
  {
    label: {
      de: "Lageberichte Geldwäsche 2010 bis 2025",
      en: "Money laundering reports 2010 to 2025",
    },
    href: "https://www.bundeskriminalamt.at/308/start.aspx",
  },
]

// Germany, 2025: reports received and the prosecutors' feedback that
// reached a court stage (judgments, penalty orders, decisions, indictments).
export const germany = {
  reports2008: 7349,
  reports2025: 374693,
  feedback: 41743,
  courtStage: 1669,
  sources: [
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
  ] satisfies Source[],
}

// Assessors' ratings across 120 country evaluations published by December
// 2021: 9 percent rated effective to a high or substantial degree at
// investigating and prosecuting laundering (28 percent for using financial
// intelligence, 19 for confiscation). Ratings, not a measure of crime
// prevented.
export const fatfRatingsSource: Source = {
  label: {
    de: "FATF, Report on the State of Effectiveness, 2022",
    en: "FATF, Report on the State of Effectiveness, 2022",
  },
  href: "https://www.fatf-gafi.org/content/dam/fatf-gafi/reports/Report-on-the-State-of-Effectiveness-Compliance-with-FATF-Standards.pdf.coredownload.pdf",
}

// What the institutions say about measuring the effect. Quotation marks
// only around their own words in that language: the Commission's paper
// exists in English only and the Austrian audit in German only, so the other
// language reports them without quotation marks.
export const admissions: {
  id: string
  who: Text
  quote: Text
  source: Source
}[] = [
  {
    id: "kommission",
    who: {
      de: "EU-Kommission, 2021, über die Geldwäsche-Regeln",
      en: "European Commission, 2021, on the anti-money-laundering rules",
    },
    quote: {
      de: "Ihre Wirkung auf die Geldwäsche lasse sich nur indirekt über Ersatzgrößen erkennen, und diese könnten irreführend sein.",
      en: "Their effect on money laundering “can only be indirectly perceived via proxy indicators”, which “can be misleading”.",
    },
    source: {
      label: {
        de: "SWD(2021) 190, S. 78, englisch",
        en: "SWD(2021) 190, p. 78",
      },
      href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021SC0190",
    },
  },
  {
    id: "rechnungshof-eu",
    who: {
      de: "Europäischer Rechnungshof, 2021, über die Steuerdaten",
      en: "European Court of Auditors, 2021, on the tax data",
    },
    quote: {
      de: "Der „überwiegende Teil“ der ausgetauschten Konto- und Einkommensdaten führe „nur zu wenigen zusätzlichen Steuerfestsetzungen“.",
      en: "“The vast majority” of the account and income data exchanged “is used to little effect in raising additional tax assessments”.",
    },
    source: auditSample.source,
  },
  {
    id: "rechnungshof-at",
    who: {
      de: "Österreichischer Rechnungshof, 2019, über das Finanzministerium",
      en: "Austrian Court of Audit, 2019, on the finance ministry",
    },
    quote: {
      de: "Das Ministerium „hatte keine Kosten–Nutzen–Analyse angedacht“; die Finanzämter sagten, Erfolge des Informationsaustauschs könnten „grundsätzlich nicht gemessen werden“.",
      en: "The ministry had not considered a cost–benefit analysis; tax offices said the success of the information exchange could not in principle be measured.",
    },
    source: {
      label: {
        de: "Rechnungshof, Bericht 2019/33, TZ 19",
        en: "Court of Audit, report 2019/33, para 19, in German",
      },
      href: "https://www.rechnungshof.gv.at/rh/home/home/Intern_Info_Austausch_Steuerangelegenheiten.pdf",
    },
  },
]

// The balance under the film: what the tax reporting duties cost each year
// and what the Commission says they bring. Costs are the Commission's own
// recurring estimates for three duties that report on ordinary people,
// without set-up costs; DAC8's is an estimate made before it applied, which
// "do not necessarily reflect the actual costs". Their sum is ours. The
// benefit is the Commission's central estimate for all exchanged tax data,
// most of it modelled because "no data are available for DAC4". Never put
// costs and benefit on one scale: the benefit covers more duties than the
// costs shown.
const swd2025: Source = {
  label: { de: "SWD(2025) 365, S. 36–43", en: "SWD(2025) 365, pp. 36–43" },
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52025SC0365",
}
const swd2026: Source = {
  label: {
    de: "SWD(2026) 166, S. 1–2, englisch",
    en: "SWD(2026) 166, pp. 1–2",
  },
  href: "https://data.consilium.europa.eu/doc/document/ST-11060-2026-ADD-4/en/pdf",
}
const swd2022: Source = {
  label: { de: "SWD(2022) 401, S. 36", en: "SWD(2022) 401, p. 36" },
  href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=SWD:2022:401:FIN",
}
export const reportingCosts: {
  id: string
  since: number
  // Million euros a year.
  millions: number
  what: Text
  note?: Text
}[] = [
  {
    id: "dac2",
    since: 2016,
    millions: 550,
    what: { de: "Konten im Ausland", en: "Accounts abroad" },
    note: { de: "rund 12 € je Konto", en: "around 12 euros per account" },
  },
  {
    id: "dac7",
    since: 2023,
    millions: 678,
    what: {
      de: "Online verkaufen oder vermieten",
      en: "Selling or renting online",
    },
  },
  {
    id: "dac8",
    since: 2026,
    millions: 22.6,
    what: { de: "Krypto über Anbieter", en: "Crypto through providers" },
    note: {
      de: "dazu 259 Mio. € für den Start",
      en: "plus €259m to set up",
    },
  },
]
export const reportingCostSources: Source[] = [swd2025, swd2026, swd2022]
// Billion euros a year, as the Commission estimates the benefit of all
// exchanged tax data: modelled and data-based parts.
export const reportingBenefit = {
  billions: 6.8,
  modelled: 5.6,
  fromData: 1.2,
  shareOfDirectTaxes: 0.3,
  sources: [swd2025, swd2026],
}

// Thousands with a dot in German, as in the copy ("13.989"); de-AT would
// use a space.
export const formatNumber = (value: number, language: Language) =>
  new Intl.NumberFormat(language === "en" ? "en-GB" : "de-DE", {
    maximumFractionDigits: 1,
  }).format(value)

// Reading time in plain words: minutes below an hour, else hours.
export const readingTime = (words: number, language: Language) => {
  const minutes = Math.round(words / wordsPerMinute)
  const en = language === "en"
  if (minutes < 60) return en ? `${minutes} minutes` : `${minutes} Minuten`
  const hours = Math.round(minutes / 6) / 10
  const text = formatNumber(hours, language)
  return en ? `${text} hours` : `${text} Stunden`
}

// Share of crypto-asset volume that analysis firms trace to addresses they
// attribute to criminals or sanctioned entities, 2025: Chainalysis below one
// percent, TRM 1.2 percent of their own, different denominators. Vendor
// lower bounds, revised upward as labels grow; sanctioned entities were a
// large part. Not a share of people, nor of laundering. The US Treasury's
// official assessment adds the comparison with ordinary money.
export const cryptoIllicit = {
  percent: 1,
  sources: [
    {
      label: {
        de: "Chainalysis, Crypto Crime Report 2026",
        en: "Chainalysis, Crypto Crime Report 2026",
      },
      href: "https://www.chainalysis.com/blog/2026-crypto-crime-report-introduction/",
    },
    {
      label: {
        de: "TRM Labs, Crypto Crime Report 2026",
        en: "TRM Labs, Crypto Crime Report 2026",
      },
      href: "https://www.trmlabs.com/reports-and-whitepapers/2026-crypto-crime-report",
    },
    {
      label: {
        de: "US-Finanzministerium, NMLRA 2026, S. 48",
        en: "US Treasury, NMLRA 2026, p. 48",
      },
      href: "https://home.treasury.gov/system/files/246/2026-NMLRA.pdf",
    },
  ] satisfies Source[],
}

// Single figures beside the charts: one number, one line on what it counts.
export const effectTiles: {
  id: string
  figure: Text
  text: Text
  source: Source
}[] = [
  {
    id: "steuernutzen",
    figure: { de: "0,3 %", en: "0.3%" },
    text: {
      de: "der direkten Steuern in der EU bringen alle ausgetauschten Steuerdaten laut Kommission, großteils geschätzt ohne Daten",
      en: "of direct taxes in the EU is what all exchanged tax data bring, according to the Commission, mostly estimated without data",
    },
    source: {
      label: { de: "SWD(2025) 365, S. 36", en: "SWD(2025) 365, p. 36" },
      href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52025SC0365",
    },
  },
  {
    id: "deutschland",
    figure: { de: "4 %", en: "4%" },
    text: {
      de: "der Rückmeldungen deutscher Staatsanwaltschaften zu Verdachtsmeldungen betrafen 2025 ein Urteil, eine Anklage oder einen Strafbefehl",
      en: "of German prosecutors’ replies on suspicion reports concerned a judgment, indictment or penalty order in 2025",
    },
    source: germany.sources[1],
  },
  {
    id: "fatf",
    figure: { de: "9 %", en: "9%" },
    text: {
      de: "der von der FATF geprüften Staaten verfolgen Geldwäsche wirksam, nach der Bewertung ihrer Prüfer",
      en: "of the countries the FATF evaluated prosecute money laundering effectively, as its assessors rate it",
    },
    source: fatfRatingsSource,
  },
  {
    id: "krypto-anteil",
    figure: { de: "rund 1 %", en: "about 1%" },
    text: {
      de: "des Krypto-Volumens ging 2025 an Kriminelle oder sanktionierte Stellen, nach Schätzung zweier Analysefirmen, eine Untergrenze",
      en: "of crypto volume went to criminals or sanctioned entities in 2025, as two analysis firms estimate it, a lower bound",
    },
    source: cryptoIllicit.sources[0],
  },
  {
    id: "krypto-pruefung",
    figure: { de: "2027", en: "2027" },
    text: {
      de: "muss die EU-Kommission erstmals berichten, wie gut die Regeln zu Krypto-Übertragungen wirken",
      en: "is when the European Commission first has to report how well the crypto transfer rules work",
    },
    source: cryptoReviewSources[0],
  },
]
