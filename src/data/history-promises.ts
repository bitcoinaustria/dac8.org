import type { Language } from "@/lib/i18n"

// Promised, measured: what politicians announced for a rule, set beside
// what their own institutions know about it. Every quotation is verified
// in the dac8-wiki raw records named 2026-10-22-pol-* (the promise) and
// 2026-10-21-gap-*, -dacuse-* or -sidefx-* (the record). Quotation marks
// only around words in the page's language; otherwise the words are
// reported. A promise that was a labelled estimate stays labelled.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

export type Said = {
  who: Text
  year: number
  // The words; `original` says in which language they were spoken.
  quote: Text
  original: Language
  source: Source
}

export type Pair = {
  id: string
  topic: Text
  promise: Said
  record: Said[]
}

const commission = (path: string, ref: string): Source => ({
  label: { de: `EU-Kommission, ${ref}`, en: `European Commission, ${ref}` },
  href: `https://ec.europa.eu/commission/presscorner/detail/en/${path}`,
})

export const pairs: Pair[] = [
  {
    id: "dac8",
    topic: { de: "DAC8", en: "DAC8" },
    promise: {
      who: {
        de: "EU-Kommission im Vorschlag für DAC8",
        en: "European Commission in its DAC8 proposal",
      },
      year: 2022,
      original: "en",
      quote: {
        de: "Nach Schätzungen könnten die zusätzlichen Steuereinnahmen 2,4 Milliarden Euro erreichen.",
        en: "“Based on estimations, additional tax revenues could reach EUR 2.4 billion.”",
      },
      source: {
        label: {
          de: "EU-Kommission, COM(2022) 707, S. 8",
          en: "European Commission, COM(2022) 707, p. 8",
        },
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52022PC0707",
      },
    },
    record: [
      {
        who: {
          de: "Ihre eigene Folgenabschätzung",
          en: "Its own impact assessment",
        },
        year: 2022,
        original: "en",
        quote: {
          de: "Wie viel der Krypto-Gewinne schon versteuert wird, darüber gebe es keine Informationen. Die 2,4 Milliarden sind die Steuer auf alle Gewinne des Jahres 2020 zum Höchstsatz von 35 Prozent.",
          en: "“There is no information available about how much realised capital gains have actually been taxed.” The 2.4 billion is the tax on all 2020 gains at the top rate of 35 percent.",
        },
        source: {
          label: {
            de: "EU-Kommission, SWD(2022) 401, S. 12 und 66–67",
            en: "European Commission, SWD(2022) 401, pp. 12 and 66–67",
          },
          href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=SWD:2022:401:FIN",
        },
      },
      {
        who: {
          de: "Deutsche Bundesregierung im Gesetz zu DAC8",
          en: "Germany’s Federal Government in its DAC8 bill",
        },
        year: 2025,
        original: "de",
        quote: {
          de: "„Eine Evaluierung ist nicht vorgesehen, da es sich um die 1:1-Umsetzung der DAC 8 handelt.“",
          en: "No evaluation is planned, because the law transposes DAC8 one to one.",
        },
        source: {
          label: {
            de: "Bundesregierung, Drucksache 21/1937, S. 46",
            en: "Federal Government, Bundestag paper 21/1937, p. 46, in German",
          },
          href: "https://dserver.bundestag.de/btd/21/019/2101937.pdf",
        },
      },
    ],
  },
  {
    id: "bank-package",
    topic: { de: "Bankenpaket, Österreich", en: "Bank package, Austria" },
    promise: {
      who: {
        de: "Österreichische Bundesregierung zu Kontenregister, Kontenaustausch und Lockerung des Bankgeheimnisses",
        en: "Austria’s government on the account register, account exchange and looser banking secrecy",
      },
      year: 2015,
      original: "de",
      quote: {
        de: "„Die Mehreinnahmen … werden im Jahr 2016 mit 700 Mio Euro angenommen.“",
        en: "The extra revenue is assumed at 700 million euros in 2016.",
      },
      source: {
        label: {
          de: "RV 685 (XXV. GP), Vorblatt und Folgenabschätzung, S. 5",
          en: "RV 685 (25th legislative period), cover sheet and impact assessment, p. 5, in German",
        },
        href: "https://www.parlament.gv.at/dokument/XXV/I/685/fname_423806.pdf",
      },
    },
    record: [
      {
        who: {
          de: "Finanzministerium über die Abfragen im Kontenregister",
          en: "The finance ministry on account-register queries",
        },
        year: 2019,
        original: "de",
        quote: {
          de: "„Es ist elektronisch nicht auswertbar, ob … ein Mehrergebnis erzielt wurde.“",
          en: "Whether the queries produced extra tax cannot be evaluated electronically.",
        },
        source: {
          label: {
            de: "Finanzministerium, Anfragebeantwortung 2843/AB (XXVI. GP), S. 2 und 8",
            en: "Finance ministry, answer 2843/AB (26th legislative period), pp. 2 and 8, in German",
          },
          href: "https://www.parlament.gv.at/dokument/XXVI/AB/2843/imfname_748144.pdf",
        },
      },
      {
        who: {
          de: "Seine eigene Evaluierung, die die Ziele trotzdem „zur Gänze erreicht“ nennt",
          en: "Its own evaluation, which still rates the goals fully achieved",
        },
        year: 2020,
        original: "de",
        quote: {
          de: "„Eine direkte Ermittlung der tatsächlichen Mehreinnahmen … ist nicht möglich.“",
          en: "A direct determination of the actual extra revenue is not possible.",
        },
        source: {
          label: {
            de: "Bundesregierung, Bericht über die Wirkungsorientierte Folgenabschätzung 2020, S. 229–231, Archivkopie",
            en: "Federal Government, report on impact assessments 2020, pp. 229–231, archived copy, in German",
          },
          href: "https://web.archive.org/web/2024/https://wirkungsmonitoring.gv.at/wp-content/uploads/2023/05/WFA_Bericht_2020.pdf",
        },
      },
    ],
  },
  {
    id: "dac6",
    topic: {
      de: "DAC6, Meldepflicht für Steuergestaltungen",
      en: "DAC6, reporting of tax arrangements",
    },
    promise: {
      who: {
        de: "Pierre Moscovici, EU-Steuerkommissar",
        en: "Pierre Moscovici, EU tax commissioner",
      },
      year: 2017,
      original: "en",
      quote: {
        de: "EU-weite Maßnahmen versprächen, ebenso wirksam dafür zu sorgen, dass alle Bürger und Unternehmen ihren fairen Anteil an Steuern zahlen.",
        en: "“EU-wide measures promise to be just as effective in ensuring that all citizens and businesses pay their fair share of tax.”",
      },
      source: commission("speech_17_1753", "SPEECH/17/1753"),
    },
    record: [
      {
        who: {
          de: "EU-Kommission in ihrer Evaluierung",
          en: "The Commission in its evaluation",
        },
        year: 2025,
        original: "en",
        quote: {
          de: "Einen Zusammenhang zwischen den Meldungen und Steuereinnahmen könne man nicht herstellen.",
          en: "“It is not possible to establish a causal link between the information received and tax revenues.”",
        },
        source: {
          label: {
            de: "EU-Kommission, SWD(2025) 365, S. 36–43",
            en: "European Commission, SWD(2025) 365, pp. 36–43",
          },
          href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:52025SC0365",
        },
      },
      {
        who: {
          de: "Deutsche Bundesregierung, gefragt, was die Meldungen an Steuern brachten",
          en: "Germany’s Federal Government, asked what the reports brought in tax",
        },
        year: 2023,
        original: "de",
        quote: {
          de: "„… da die finanziellen Auswirkungen … naturgemäß nicht erfasst werden können.“",
          en: "The financial effects by their nature cannot be captured.",
        },
        source: {
          label: {
            de: "Bundesregierung, Drucksache 20/6734, S. 4",
            en: "Federal Government, Bundestag paper 20/6734, p. 4, in German",
          },
          href: "https://dserver.bundestag.de/btd/20/067/2006734.pdf",
        },
      },
    ],
  },
  {
    id: "dac7",
    topic: {
      de: "DAC7, Meldepflicht für Online-Plattformen",
      en: "DAC7, reporting by online platforms",
    },
    promise: {
      who: {
        de: "Paolo Gentiloni, EU-Steuerkommissar",
        en: "Paolo Gentiloni, EU tax commissioner",
      },
      year: 2020,
      original: "en",
      quote: {
        de: "Das seien gute Nachrichten für die Staatskasse und für ehrliche Unternehmer.",
        en: "“This is good news for the public purse and good news for honest entrepreneurs.”",
      },
      source: commission("ip_20_2253", "IP/20/2253"),
    },
    record: [
      {
        who: {
          de: "EU-Kommission sechs Jahre später",
          en: "The Commission six years later",
        },
        year: 2026,
        original: "en",
        quote: {
          de: "Die Meldepflicht liefere große Mengen an Daten mit geringer steuerlicher Bedeutung, zu unverhältnismäßigen Kosten: rund 678 Millionen Euro im Jahr.",
          en: "It generates “large volumes of information which has limited tax relevance”, at “disproportionate compliance costs” of about 678 million euros a year.",
        },
        source: {
          label: {
            de: "EU-Kommission, SWD(2026) 166, S. 1–2, englisch",
            en: "European Commission, SWD(2026) 166, pp. 1–2",
          },
          href: "https://data.consilium.europa.eu/doc/document/ST-11060-2026-ADD-4/en/pdf",
        },
      },
    ],
  },
  {
    id: "travel-rule",
    topic: {
      de: "Namen bei jeder Krypto-Übertragung",
      en: "Names on every crypto transfer",
    },
    promise: {
      who: {
        de: "Assita Kanko, Berichterstatterin im EU-Parlament, über die Prüfung von Übertragungen an eigene Wallets",
        en: "Assita Kanko, rapporteur in the European Parliament, on checks of transfers to people’s own wallets",
      },
      year: 2023,
      original: "en",
      quote: {
        de: "Der Prüfaufwand für die Krypto-Anbieter sei sehr gering.",
        en: "“The verification burden on CASPs is very limited.”",
      },
      source: {
        label: {
          de: "Europäisches Parlament, Plenardebatte 19. April 2023",
          en: "European Parliament, plenary debate of 19 April 2023",
        },
        href: "https://www.europarl.europa.eu/doceo/document/CRE-9-2023-04-19-ITM-015_EN.html",
      },
    },
    record: [
      {
        who: {
          de: "EU-Kommission im Vorschlag für dieses Gesetz",
          en: "The Commission in its proposal for this law",
        },
        year: 2021,
        original: "en",
        quote: {
          de: "Genaue Kostenschätzungen lägen nicht vor; auch der Nutzen sei nicht leicht abzuschätzen. Die Prüfung von Übertragungen an eigene Wallets kam erst später dazu und wurde nie bewertet.",
          en: "“No precise estimated costs were provided”, and the benefits are “not easy to assess either”. The checks on transfers to people’s own wallets were added later and never assessed.",
        },
        source: {
          label: {
            de: "EU-Kommission, COM(2021) 422",
            en: "European Commission, COM(2021) 422",
          },
          href: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:52021PC0422",
        },
      },
    ],
  },
  {
    id: "amla",
    topic: {
      de: "Neue EU-Geldwäschebehörde AMLA",
      en: "The new EU anti-money-laundering authority, AMLA",
    },
    promise: {
      who: {
        de: "Mairead McGuinness, EU-Kommissarin für Finanzmärkte",
        en: "Mairead McGuinness, EU commissioner for financial services",
      },
      year: 2022,
      original: "en",
      quote: {
        de: "AMLA sei ein Wendepunkt im Kampf gegen Geldwäsche, voll besetzt 2025 und mit direkter Aufsicht ab 2026.",
        en: "“AMLA is a game-changer in the fight against money laundering”, to reach “full staffing in 2025, and to start carrying out direct supervision in 2026”.",
      },
      source: commission("speech_22_5593", "SPEECH/22/5593"),
    },
    record: [
      {
        who: { de: "AMLA im Jahresbericht", en: "AMLA in its annual report" },
        year: 2025,
        original: "de",
        quote: {
          de: "Ende 2025 arbeiteten dort 119 Menschen.",
          en: "At the end of 2025 it had 119 staff.",
        },
        source: {
          label: {
            de: "AMLA, Jahresbericht 2025",
            en: "AMLA, annual activity report 2025",
          },
          href: "https://www.amla.europa.eu/document/download/d126651b-59ba-403a-bc51-a92d14112e08_en?filename=Consolidated_Annual_Activity_Report_2025.pdf",
        },
      },
      {
        who: { de: "AMLA in ihrer Planung", en: "AMLA in its planning" },
        year: 2026,
        original: "de",
        quote: {
          de: "Volle Besetzung ist jetzt für 2027 geplant, die direkte Aufsicht über 40 Institute ab 2028.",
          en: "Full staffing is now planned for 2027, direct supervision of 40 institutions from 2028.",
        },
        source: {
          label: {
            de: "AMLA, Programmplanung 2026–2028",
            en: "AMLA, programming document 2026–2028",
          },
          href: "https://www.amla.europa.eu/document/download/27549516-d110-4e91-b1ed-d3552b8f9661_en?filename=AMLA%20SPD%202026-2028.pdf",
        },
      },
    ],
  },
  {
    id: "dirty-money",
    topic: { de: "Geldwäsche", en: "Money laundering" },
    promise: {
      who: {
        de: "Valdis Dombrovskis, Vizepräsident der EU-Kommission",
        en: "Valdis Dombrovskis, Executive Vice-President of the Commission",
      },
      year: 2020,
      original: "en",
      quote: {
        de: "Für schmutziges Geld gebe es in Europas Finanzsystem keinen Platz.",
        en: "“There is no place for dirty money in Europe’s financial system.”",
      },
      source: commission("speech_20_830", "SPEECH/20/830"),
    },
    record: [
      {
        who: {
          de: "Europäischer Rechnungshof",
          en: "European Court of Auditors",
        },
        year: 2021,
        original: "en",
        quote: {
          de: "Wie viel Geld gewaschen wird, lässt sich nicht schätzen: Eurostat hat dafür keine Methode.",
          en: "“Eurostat does not have a methodology to collect and estimate quantitative volumes of money laundering.”",
        },
        source: {
          label: {
            de: "Europäischer Rechnungshof, Sonderbericht 13/2021, Rn. 48",
            en: "European Court of Auditors, special report 13/2021, para 48",
          },
          href: "https://www.eca.europa.eu/Lists/ECADocuments/SR21_13/SR_AML_EN.pdf",
        },
      },
    ],
  },
]

export const pairSources = (): Source[] =>
  pairs.flatMap((pair) => [
    pair.promise.source,
    ...pair.record.map((said) => said.source),
  ])
