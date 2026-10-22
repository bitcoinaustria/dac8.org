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
  // A few words each side, set large, so the pair reads at a glance.
  token: { promise: Text; record: Text }
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
    token: {
      promise: { de: "2,4 Mrd. €", en: "€2.4bn" },
      record: { de: "keine Informationen", en: "no information" },
    },
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
    ],
  },
  {
    id: "fraud-package-at",
    token: {
      promise: { de: "270 Mio. €", en: "€270m" },
      record: { de: "schwer zu messen", en: "hard to measure" },
    },
    topic: {
      de: "Paket gegen Steuerbetrug mit Krypto-Datenaustausch, Österreich",
      en: "Anti-fraud package with crypto data exchange, Austria",
    },
    promise: {
      who: {
        de: "Markus Marterbauer, Finanzminister, in der Fragestunde des Nationalrats, über ein Paket, das auch den Datenaustausch zu Kryptowerten umfasst",
        en: "Markus Marterbauer, finance minister, at question time in the Nationalrat, on a package that includes the data exchange on crypto",
      },
      year: 2026,
      original: "de",
      quote: {
        de: "„Wir erwarten im heurigen Jahr ein Aufkommen von zusätzlich 270 Millionen Euro …“",
        en: "We expect additional revenue of 270 million euros this year.",
      },
      source: {
        label: {
          de: "Nationalrat, 73. Sitzung, 26. März 2026, Fragestunde",
          en: "Nationalrat, 73rd sitting, 26 March 2026, question time, in German",
        },
        href: "https://www.parlament.gv.at/dokument/XXVIII/NRSITZ/73/A_-_10_09_23_00931336.html",
      },
    },
    record: [
      {
        who: {
          de: "Derselbe Minister in derselben Antwort",
          en: "The same minister in the same answer",
        },
        year: 2026,
        original: "de",
        quote: {
          de: "„Es ist gar nicht so einfach, das sozusagen zu messen …“ Und zur Steuerlücke: „Wir haben auch nicht vor, eine eigene Studie dazu zu machen.“",
          en: "It is not at all easy to measure this, he said; and on the tax gap: nor do we plan a study of our own.",
        },
        source: {
          label: {
            de: "Nationalrat, 73. Sitzung, 26. März 2026, Fragestunde",
            en: "Nationalrat, 73rd sitting, 26 March 2026, question time, in German",
          },
          href: "https://www.parlament.gv.at/dokument/XXVIII/NRSITZ/73/A_-_10_09_23_00931336.html",
        },
      },
      {
        who: {
          de: "Die Folgenabschätzung zur Krypto-Meldepflicht",
          en: "The impact assessment of the crypto reporting duty",
        },
        year: 2025,
        original: "de",
        quote: {
          de: "Aus der Krypto-Meldepflicht erwartet sie für 2026 Mehreinnahmen von 5 Millionen Euro.",
          en: "From the crypto reporting duty it expects extra revenue of 5 million euros in 2026.",
        },
        source: {
          label: {
            de: "RV 306 (XXVIII. GP), Vorblatt und Folgenabschätzung",
            en: "RV 306 (28th legislative period), cover sheet and impact assessment, in German",
          },
          href: "https://www.parlament.gv.at/dokument/XXVIII/I/306/imfname_1723218.pdf",
        },
      },
    ],
  },
  {
    id: "bank-package",
    token: {
      promise: { de: "700 Mio. €", en: "€700m" },
      record: { de: "nicht auswertbar", en: "cannot be evaluated" },
    },
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
          de: "Finanzminister Hans Jörg Schelling, gefragt, was das Bankenpaket 2016 brachte",
          en: "Finance minister Hans Jörg Schelling, asked what the bank package brought in 2016",
        },
        year: 2017,
        original: "de",
        quote: {
          de: "„Die meisten Mehreinnahmen durch das so genannte Bankenpaket sind nicht separat auswertbar.“",
          en: "Most of the extra revenue from the bank package cannot be evaluated separately.",
        },
        source: {
          label: {
            de: "Finanzministerium, Anfragebeantwortung 11924/AB (XXV. GP), S. 4",
            en: "Finance ministry, answer 11924/AB (25th legislative period), p. 4, in German",
          },
          href: "https://www.parlament.gv.at/dokument/XXV/AB/11924/imfname_635488.pdf",
        },
      },
      {
        who: {
          de: "Die eigene Evaluierung, die die Ziele trotzdem „zur Gänze erreicht“ nennt",
          en: "The government’s own evaluation, which still rates the goals fully achieved",
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
    id: "dac8-de",
    token: {
      promise: { de: "besser verhindern", en: "better prevented" },
      record: { de: "kein Nachweis", en: "no proof" },
    },
    topic: { de: "DAC8 in Deutschland", en: "DAC8 in Germany" },
    promise: {
      who: {
        de: "Jens Behrens (SPD) in der Schlussdebatte im Bundestag",
        en: "Jens Behrens (SPD) in the Bundestag’s final debate",
      },
      year: 2025,
      original: "de",
      quote: {
        de: "„So können wir Steuervermeidung und -hinterziehung im Bereich der Kryptowährung besser verhindern.“",
        en: "This way, he said, tax avoidance and evasion with crypto can be better prevented.",
      },
      source: {
        label: {
          de: "Bundestag, Plenarprotokoll 21/37, S. 4202",
          en: "Bundestag, plenary record 21/37, p. 4202, in German",
        },
        href: "https://dserver.bundestag.de/btp/21/21037.pdf",
      },
    },
    record: [
      {
        who: {
          de: "Deutsche Bundesregierung sieben Wochen davor",
          en: "Germany’s Federal Government seven weeks earlier",
        },
        year: 2025,
        original: "de",
        quote: {
          de: "„Daher ist ein statistischer Nachweis der Höhe der Einnahmen aus der Besteuerung von Kryptowerten nicht möglich.“",
          en: "A statistical proof of how much tax crypto brings in is therefore not possible.",
        },
        source: {
          label: {
            de: "Bundesregierung, Drucksache 21/1707, S. 2",
            en: "Federal Government, Bundestag paper 21/1707, p. 2, in German",
          },
          href: "https://dserver.bundestag.de/btd/21/017/2101707.pdf",
        },
      },
      {
        who: {
          de: "Und im Gesetz selbst",
          en: "And in the law itself",
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
    id: "a-fiu-at",
    token: {
      promise: { de: "zeigt Wirkung", en: "it works" },
      record: { de: "−5 % Urteile", en: "−5% convictions" },
    },
    topic: {
      de: "Geldwäschemeldestelle, Österreich",
      en: "Financial intelligence unit, Austria",
    },
    promise: {
      who: {
        de: "Innenministerium unter Gerhard Karner, Presseaussendung",
        en: "Interior ministry under Gerhard Karner, press release",
      },
      year: 2023,
      original: "de",
      quote: {
        de: "„Karner: Sensibilisierung bei Geldwäsche zeigt Wirkung“ – das Dunkelfeld werde „immer weiter verkleinert“.",
        en: "Raising awareness of money laundering is working, it said; the hidden part is shrinking ever further.",
      },
      source: {
        label: {
          de: "Innenministerium, OTS-Aussendung vom 5. Oktober 2023",
          en: "Interior ministry, press release of 5 October 2023, in German",
        },
        href: "https://www.ots.at/presseaussendung/OTS_20231005_OTS0135",
      },
    },
    record: [
      {
        who: {
          de: "Dieselbe Aussendung, weiter unten",
          en: "The same release, further down",
        },
        year: 2023,
        original: "de",
        quote: {
          de: "„… 81 rechtskräftige Urteile wegen Geldwäscherei …, was ein Minus von fünf Prozent im Vergleich zum Vorjahr bedeutet.“",
          en: "81 final convictions for money laundering, five percent fewer than the year before.",
        },
        source: {
          label: {
            de: "Innenministerium, OTS-Aussendung vom 5. Oktober 2023",
            en: "Interior ministry, press release of 5 October 2023, in German",
          },
          href: "https://www.ots.at/presseaussendung/OTS_20231005_OTS0135",
        },
      },
      {
        who: {
          de: "Derselbe Minister, gefragt, was aus den Meldungen wurde",
          en: "The same minister, asked what came of the reports",
        },
        year: 2024,
        original: "de",
        quote: {
          de: "„Die gewünschte statistische Auswertung … gegliedert nach Urhebern, Empfängern und Ausgang des Verfahrens ist technisch nicht möglich.“",
          en: "A breakdown by sender, recipient and outcome of the proceedings is technically impossible.",
        },
        source: {
          label: {
            de: "Innenministerium, Anfragebeantwortung 16404/AB (XXVII. GP), S. 10",
            en: "Interior ministry, answer 16404/AB (27th legislative period), p. 10, in German",
          },
          href: "https://www.parlament.gv.at/dokument/XXVII/AB/16404/imfname_1605860.pdf",
        },
      },
    ],
  },
  {
    id: "fiu-de",
    token: {
      promise: { de: "größte weltweit", en: "largest in the world" },
      record: { de: "289.823 offen", en: "289,823 open" },
    },
    topic: {
      de: "Geldwäschemeldestelle, Deutschland",
      en: "Financial intelligence unit, Germany",
    },
    promise: {
      who: {
        de: "Christian Lindner, Finanzminister, im Bundestag",
        en: "Christian Lindner, finance minister, in the Bundestag",
      },
      year: 2023,
      original: "de",
      quote: {
        de: "„… unsere Behörde zur Bekämpfung der Geldwäsche, die FIU, ist die größte weltweit.“",
        en: "Germany’s financial intelligence unit, he said, is the largest in the world.",
      },
      source: {
        label: {
          de: "Bundestag, Plenarprotokoll 20/87, S. 10356",
          en: "Bundestag, plenary record 20/87, p. 10356, in German",
        },
        href: "https://dserver.bundestag.de/btp/20/20087.pdf",
      },
    },
    record: [
      {
        who: {
          de: "Die Geldwäschemeldestelle an die Bundesregierung, einen Monat davor",
          en: "The unit to the Federal Government, a month earlier",
        },
        year: 2023,
        original: "de",
        quote: {
          de: "289.823 Meldungen waren nicht abgeschlossen oder hatten einen unklaren Status.",
          en: "289,823 reports were not finalised or of unclear status.",
        },
        source: {
          label: {
            de: "Bundesregierung, Drucksache 20/6467, S. 12",
            en: "Federal Government, Bundestag paper 20/6467, p. 12, in German",
          },
          href: "https://dserver.bundestag.de/btd/20/064/2006467.pdf",
        },
      },
    ],
  },
  {
    id: "travel-rule",
    token: {
      promise: { de: "sehr gering", en: "very limited" },
      record: { de: "keine Kostenschätzung", en: "no cost estimate" },
    },
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
    token: {
      promise: { de: "ab 2026", en: "from 2026" },
      record: { de: "ab 2028", en: "from 2028" },
    },
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
    id: "fatf-at",
    token: {
      promise: { de: "gut funktionierend", en: "well-functioning" },
      record: { de: "„Low“", en: "“Low”" },
    },
    topic: { de: "FATF-Prüfung, Österreich", en: "FATF evaluation, Austria" },
    promise: {
      who: {
        de: "Alma Zadić, Justizministerin, die zugleich Probleme bei der Strafverfolgung nannte",
        en: "Alma Zadić, justice minister, who also mentioned problems with prosecution",
      },
      year: 2024,
      original: "de",
      quote: {
        de: "„Die Prüfung durch die FATF kam zu dem Ergebnis, dass in Österreich ein umfassendes und gut funktionierendes System … existiert und angewendet wird.“",
        en: "The FATF evaluation, she wrote, found a comprehensive and well-functioning system in Austria.",
      },
      source: {
        label: {
          de: "Justizministerium, Anfragebeantwortung 17872/AB (XXVII. GP), S. 4–5",
          en: "Justice ministry, answer 17872/AB (27th legislative period), pp. 4–5, in German",
        },
        href: "https://www.parlament.gv.at/dokument/XXVII/AB/17872/imfname_1639379.pdf",
      },
    },
    record: [
      {
        who: {
          de: "Die FATF in dieser Prüfung",
          en: "The FATF in that evaluation",
        },
        year: 2016,
        original: "en",
        quote: {
          de: "Die Nutzung der Verdachtsmeldungen und die Verfolgung von Geldwäsche bewertete sie mit „Low“, der schlechtesten Stufe; Staatsanwälte sähen in den Meldungen keine wertvolle Informationsquelle.",
          en: "It rated the use of financial intelligence and the prosecution of money laundering “Low”, its lowest grade; prosecutors “do not see STRs … as a valuable source of information”.",
        },
        source: {
          label: {
            de: "FATF, Länderprüfung Österreich 2016, S. 11",
            en: "FATF, mutual evaluation of Austria, 2016, p. 11",
          },
          href: "https://www.fatf-gafi.org/media/fatf/documents/reports/mer4/MER-Austria-2016.pdf",
        },
      },
    ],
  },
  {
    id: "crs-de",
    token: {
      promise: { de: "Milliarden", en: "billions" },
      record: { de: "nicht signifikant", en: "not significant" },
    },
    topic: {
      de: "Kontenaustausch, Deutschland",
      en: "Account exchange, Germany",
    },
    promise: {
      who: {
        de: "Wolfgang Schäuble, Finanzminister, in einer Regierungserklärung",
        en: "Wolfgang Schäuble, finance minister, in a government statement",
      },
      year: 2014,
      original: "de",
      quote: {
        de: "„Damit bekämpfen wir das Problem, dass den öffentlichen Haushalten durch Steuerflucht Steuereinnahmen in Milliardenhöhe fehlen.“",
        en: "With the exchange, he said, Germany was tackling the billions in tax revenue lost to tax flight.",
      },
      source: {
        label: {
          de: "Bundestag, Plenarprotokoll 18/63, S. 5786–5788",
          en: "Bundestag, plenary record 18/63, pp. 5786–5788, in German",
        },
        href: "https://dserver.bundestag.de/btp/18/18063.pdf",
      },
    },
    record: [
      {
        who: {
          de: "Deutsche Bundesregierung fünf Jahre später",
          en: "Germany’s Federal Government five years later",
        },
        year: 2019,
        original: "de",
        quote: {
          de: "Sie erwartet „keine signifikanten Steuermehreinnahmen“; der Austausch „hat insgesamt auch nicht zum Ziel, steuerliche Mehreinnahmen zu generieren“.",
          en: "It expects no significant extra revenue, and the exchange is not even meant to raise any.",
        },
        source: {
          label: {
            de: "Bundesregierung, Drucksache 19/12586, S. 4",
            en: "Federal Government, Bundestag paper 19/12586, p. 4, in German",
          },
          href: "https://dserver.bundestag.de/btd/19/125/1912586.pdf",
        },
      },
    ],
  },
  {
    id: "dac6",
    token: {
      promise: { de: "ebenso wirksam", en: "just as effective" },
      record: { de: "kein Zusammenhang", en: "no causal link" },
    },
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
    token: {
      promise: { de: "gute Nachricht", en: "good news" },
      record: { de: "geringe Relevanz", en: "limited relevance" },
    },
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
    id: "dirty-money",
    token: {
      promise: { de: "kein Platz", en: "no place" },
      record: { de: "keine Methode", en: "no method" },
    },
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

// Shown open; the rest fold away under "more".
export const openPairs = 6

export const pairSources = (): Source[] =>
  pairs.flatMap((pair) => [
    pair.promise.source,
    ...pair.record.map((said) => said.source),
  ])
