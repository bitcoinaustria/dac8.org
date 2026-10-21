import type { Language } from "@/lib/i18n"

// The history page's scroll film: how the rules piled up and what came of
// them, in seven chapters of short steps. Each step is one sentence on the
// stage and changes one picture. Every figure is verified in
// dac8-wiki/.wiki/wiki/references/rule-growth-and-effect-evidence.md and
// aml-kyc-history-austria.md; the charts below the film carry the full
// series. Keep both languages in sync and say no more than the source does.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }

const eurlex = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://eur-lex.europa.eu/eli/${path}/oj`,
})
const ris = (year: number, number: number): Source => ({
  label: {
    de: `BGBl. I Nr. ${number}/${year}`,
    en: `Federal Law Gazette I No. ${number}/${year}`,
  },
  href: `https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_${year}_I_${number}/BGBLA_${year}_I_${number}.html`,
})

export type Scene =
  | "rules"
  | "tower"
  | "threshold"
  | "register"
  | "reports"
  | "money"
  | "summary"

export const chapters: { id: string; scene: Scene; label: Text }[] = [
  { id: "regeln", scene: "rules", label: { de: "Regeln", en: "Rules" } },
  { id: "seiten", scene: "tower", label: { de: "Seiten", en: "Pages" } },
  {
    id: "schwelle",
    scene: "threshold",
    label: { de: "Schwellen", en: "Thresholds" },
  },
  { id: "zugriff", scene: "register", label: { de: "Zugriff", en: "Access" } },
  {
    id: "meldungen",
    scene: "reports",
    label: { de: "Meldungen", en: "Reports" },
  },
  { id: "ergebnis", scene: "money", label: { de: "Ergebnis", en: "Result" } },
  { id: "bilanz", scene: "summary", label: { de: "Bilanz", en: "Balance" } },
]

export type Step = {
  id: string
  chapter: string
  // In the rules chapter the year runs with the scroll over this span.
  years?: [number, number]
  title: Text
  text: Text
  sources: Source[]
}

const fiu2025: Source = {
  label: {
    de: "Lagebericht Geldwäsche 2025",
    en: "Money laundering report 2025",
  },
  href: "https://www.bundeskriminalamt.at/308/files/374-2026-geldwaeschebericht-2025-a4-v20260915-web-bf.pdf",
}
const europol: Source = {
  label: { de: "Europol 2016", en: "Europol 2016" },
  href: "https://www.europol.europa.eu/sites/default/files/documents/criminal_asset_recovery_in_the_eu_web_version_0.pdf",
}

const allRules: Source = {
  label: {
    de: "Alle Regeln mit Quellen",
    en: "Every rule with its sources",
  },
  href: "#regeln-title",
}

export const steps: Step[] = [
  // ---------- Regeln: every rule as a card on two piles, year by year.
  {
    id: "regeln-1977",
    chapter: "regeln",
    years: [1977, 1993],
    title: {
      de: "1977: Amt fragt Amt.",
      en: "1977: office asks office.",
    },
    text: {
      de: "Steuerbehörden helfen einander im Einzelfall. Niemand muss automatisch etwas über seine Kunden melden, eine Bank braucht noch keinen Ausweis.",
      en: "Tax authorities help each other in single cases. No one has to report anything about customers automatically, and a bank needs no ID yet.",
    },
    sources: [allRules],
  },
  {
    id: "regeln-1994",
    chapter: "regeln",
    years: [1994, 2008],
    title: {
      de: "Ab 1994: Ausweis und Verdacht.",
      en: "From 1994: ID and suspicion.",
    },
    text: {
      de: "Banken müssen Kunden identifizieren und Verdacht melden, anonyme Depots und Sparbücher enden. In der EU werden erstmals Zinsen an Ausländer gemeldet.",
      en: "Banks must identify customers and report suspicion, anonymous securities accounts and savings books end. In the EU, interest paid to foreigners is reported for the first time.",
    },
    sources: [allRules],
  },
  {
    id: "regeln-2015",
    chapter: "regeln",
    years: [2009, 2026],
    title: {
      de: "Ab 2015: jedes Jahr mehr.",
      en: "From 2015: more every year.",
    },
    text: {
      de: "Konten, Löhne, Plattform-Einnahmen, Kryptowerte: Die Steuerbehörden bekommen jedes Jahr neue Daten. Das Kontenregister zeigt, wer wo Konten hat, und Namen gehen mit jeder Krypto-Übertragung mit.",
      en: "Accounts, pay, platform income, crypto-assets: tax authorities get new data every year. The account register shows who holds accounts where, and names travel with every crypto transfer.",
    },
    sources: [allRules],
  },
  {
    id: "regeln-2029",
    chapter: "regeln",
    years: [2027, 2029],
    title: {
      de: "Bis 2029: schon beschlossen.",
      en: "By 2029: already adopted.",
    },
    text: {
      de: "Keine anonymen Konten bei Anbietern, eine Obergrenze für Bargeld, vernetzte Kontenregister, und vorgeschlagen ist noch mehr Zugriff auf Register.",
      en: "No anonymous accounts at providers, a cap on cash, connected account registers, and even more register access is proposed.",
    },
    sources: [allRules],
  },

  // ---------- Seiten: every AML act the EU adopted, as a pile of pages.
  {
    id: "seiten-1991",
    chapter: "seiten",
    title: { de: "1991: sechs Seiten.", en: "1991: six pages." },
    text: {
      de: "So lang ist die erste Geldwäsche-Richtlinie der EU im Amtsblatt. Wer ein Konto eröffnet, weist sich aus.",
      en: "That is the length of the EU’s first anti-money-laundering directive in the Official Journal. Whoever opens an account shows ID.",
    },
    sources: [
      eurlex("dir/1991/308", "Richtlinie 91/308/EWG", "Directive 91/308/EEC"),
    ],
  },
  {
    id: "seiten-2006",
    chapter: "seiten",
    title: { de: "Bis 2006: 44 Seiten mehr.", en: "By 2006: 44 more pages." },
    text: {
      de: "Die zweite und dritte Richtlinie und die ersten Regeln für Überweisungen. Die Bank muss jetzt wissen, wem ein Konto letztlich gehört, und es laufend beobachten.",
      en: "The second and third directives and the first rules on transfers. The bank now has to know who ultimately owns an account and watch it continuously.",
    },
    sources: [
      eurlex("dir/2001/97", "Richtlinie 2001/97/EG", "Directive 2001/97/EC"),
      eurlex("dir/2005/60", "Richtlinie 2005/60/EG", "Directive 2005/60/EC"),
      eurlex("reg/2006/1781", "Verordnung 1781/2006", "Regulation 1781/2006"),
    ],
  },
  {
    id: "seiten-2018",
    chapter: "seiten",
    title: { de: "Bis 2018: 104 Seiten mehr.", en: "By 2018: 104 more pages." },
    text: {
      de: "Die vierte und fünfte Richtlinie, neue Überweisungsregeln und Geldwäsche im Strafrecht. Erstmals müssen auch Krypto-Börsen ihre Kunden prüfen.",
      en: "The fourth and fifth directives, new transfer rules and money laundering in criminal law. For the first time, crypto exchanges must check their customers too.",
    },
    sources: [
      eurlex(
        "dir/2015/849",
        "Richtlinie (EU) 2015/849",
        "Directive (EU) 2015/849",
      ),
      eurlex(
        "dir/2018/843",
        "Richtlinie (EU) 2018/843",
        "Directive (EU) 2018/843",
      ),
    ],
  },
  {
    id: "seiten-2023",
    chapter: "seiten",
    title: {
      de: "2023: 39 Seiten für Krypto-Übertragungen.",
      en: "2023: 39 pages on crypto transfers.",
    },
    text: {
      de: "Ab Ende 2024 gehen Name und Wallet-Adresse, ähnlich einer Kontonummer, mit jeder Übertragung über einen Anbieter mit.",
      en: "From the end of 2024, name and wallet address, much like an account number, travel with every transfer through a provider.",
    },
    sources: [
      eurlex(
        "reg/2023/1113",
        "Verordnung (EU) 2023/1113",
        "Regulation (EU) 2023/1113",
      ),
    ],
  },
  {
    id: "seiten-2024",
    chapter: "seiten",
    title: {
      de: "2024: 295 Seiten auf einmal.",
      en: "2024: 295 pages at once.",
    },
    text: {
      de: "Ein neues Regelwerk, eine neue Richtlinie und eine neue EU-Behörde. Zusammen 488 Seiten Geldwäsche-Recht seit 1991, rund 270.000 Wörter: gut 22 Stunden Lesezeit.",
      en: "A new rulebook, a new directive and a new EU authority. Together, 488 pages of anti-money-laundering law since 1991, about 270,000 words: over 22 hours of reading.",
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

  // ---------- Schwellen: from which amount you have to show ID.
  {
    id: "schwelle-1991",
    chapter: "schwelle",
    title: { de: "1991: ab 15.000 ECU.", en: "1991: from 15,000 ECU." },
    text: {
      de: "Bei einzelnen Geschäften ohne Konto musste man sich erst ab diesem Betrag ausweisen.",
      en: "For single transactions without an account, you had to show ID only from this amount.",
    },
    sources: [
      eurlex(
        "dir/1991/308",
        "Richtlinie 91/308/EWG, Art. 3",
        "Directive 91/308/EEC, Art. 3",
      ),
    ],
  },
  {
    id: "schwelle-2017",
    chapter: "schwelle",
    title: { de: "2017: ab 1.000 Euro.", en: "2017: from 1,000 euros." },
    text: {
      de: "Für Geldtransfers ohne Konto sinkt die Grenze auf 1.000 Euro.",
      en: "For money transfers without an account, the limit falls to 1,000 euros.",
    },
    sources: [
      eurlex(
        "dir/2015/849",
        "Richtlinie (EU) 2015/849, Art. 11",
        "Directive (EU) 2015/849, Art. 11",
      ),
    ],
  },
  {
    id: "schwelle-2024",
    chapter: "schwelle",
    title: { de: "2024: ab null Euro.", en: "2024: from zero euros." },
    text: {
      de: "Bei Krypto-Übertragungen über einen Anbieter gehen die Namen mit, bei jedem Betrag.",
      en: "With crypto transfers through a provider, the names travel along, at any amount.",
    },
    sources: [
      eurlex(
        "reg/2023/1113",
        "Verordnung (EU) 2023/1113, Art. 14",
        "Regulation (EU) 2023/1113, Art. 14",
      ),
    ],
  },
  {
    id: "schwelle-2027",
    chapter: "schwelle",
    title: { de: "2027: auch beim Bargeld.", en: "2027: cash too." },
    text: {
      de: "Ab 3.000 Euro bar braucht es bei einzelnen Geschäften einen Ausweis. Über 10.000 Euro dürfen Händler gar kein Bargeld mehr annehmen.",
      en: "From 3,000 euros in cash, single transactions need ID. Above 10,000 euros, traders may not accept cash at all.",
    },
    sources: [
      eurlex(
        "reg/2024/1624",
        "Verordnung (EU) 2024/1624, Art. 19, 80",
        "Regulation (EU) 2024/1624, Art. 19, 80",
      ),
    ],
  },

  // ---------- Zugriff: who may look up your accounts in Austria.
  {
    id: "zugriff-2016",
    chapter: "zugriff",
    title: { de: "2016: drei dürfen nachsehen.", en: "2016: three may look." },
    text: {
      de: "Das Kontenregister zeigt, wer bei welcher Bank Konten hat, ohne Kontostände. Abfragen dürfen Strafjustiz, Finanzstrafbehörden und Abgabenbehörden.",
      en: "The account register shows who holds accounts at which bank, without balances. Criminal justice, fiscal-penal and tax authorities may look it up.",
    },
    sources: [ris(2015, 116)],
  },
  {
    id: "zugriff-2021",
    chapter: "zugriff",
    title: { de: "2021: sieben.", en: "2021: seven." },
    text: {
      de: "Dazu kommen Geldwäschemeldestelle und Staatsschutz, Finanzmarktaufsicht, Kriminalpolizei für schwere Delikte und Sanktionsbehörden.",
      en: "Added: the financial intelligence unit and state security, the financial market authority, criminal police for serious offences, and sanctions authorities.",
    },
    sources: [ris(2021, 25)],
  },
  {
    id: "zugriff-2026",
    chapter: "zugriff",
    title: { de: "2026: acht.", en: "2026: eight." },
    text: {
      de: "Seit Juli fragt auch das Amt für Betrugsbekämpfung ab, etwa gegen Sozialbetrug.",
      en: "Since July, the anti-fraud office looks too, for example against benefit fraud.",
    },
    sources: [ris(2026, 46)],
  },
  {
    id: "zugriff-2029",
    chapter: "zugriff",
    title: { de: "2029: ganz Europa.", en: "2029: all of Europe." },
    text: {
      de: "Die Kontenregister der EU-Staaten werden verbunden. Sie erfassen dann auch Konten bei Krypto-Anbietern.",
      en: "The EU countries’ account registers get connected. They will then also cover accounts at crypto-asset providers.",
    },
    sources: [
      eurlex(
        "dir/2024/1640",
        "Richtlinie (EU) 2024/1640, Art. 16",
        "Directive (EU) 2024/1640, Art. 16",
      ),
    ],
  },

  // ---------- Meldungen: suspicion reports in Austria.
  {
    id: "meldungen-2005",
    chapter: "meldungen",
    title: { de: "2005: 467 Meldungen.", en: "2005: 467 reports." },
    text: {
      de: "So viele Meldungen über verdächtige Geschäfte erhielt Österreichs Geldwäschemeldestelle. Jeder Punkt ist eine.",
      en: "That many reports of suspicious transactions reached Austria’s financial intelligence unit. Each dot is one.",
    },
    sources: [
      {
        label: { de: "Anfragebeantwortung 4756/AB", en: "Answer 4756/AB" },
        href: "https://www.parlament.gv.at/dokument/XXIII/AB/4756/fname_141334.pdf",
      },
    ],
  },
  {
    id: "meldungen-2025",
    chapter: "meldungen",
    title: { de: "2025: 13.989.", en: "2025: 13,989." },
    text: {
      de: "Rund dreißigmal so viele, bei mehrmals geänderter Zählweise. 2.671 kamen von Krypto-Anbietern.",
      en: "About thirty times as many, though the counting changed several times. 2,671 came from crypto-asset providers.",
    },
    sources: [fiu2025],
  },
  {
    id: "meldungen-urteile",
    chapter: "meldungen",
    title: { de: "139 Verurteilungen.", en: "139 convictions." },
    text: {
      de: "So oft wurde 2025 wegen Geldwäsche verurteilt. Auf eine Verurteilung kommen rund 100 Meldungen, auch wenn sich die Urteile einzelnen Meldungen nicht zuordnen lassen.",
      en: "That is how many convictions for money laundering there were in 2025. There are about 100 reports for each, though the convictions cannot be traced to particular reports.",
    },
    sources: [fiu2025],
  },
  {
    id: "meldungen-gespeichert",
    chapter: "meldungen",
    title: { de: "9.665 bleiben gespeichert.", en: "9,665 stay on file." },
    text: {
      de: "Fast sieben von zehn Meldungen gab die Stelle vorerst nicht weiter, mangels Anfangsverdachts, also eines Anhaltspunkts für eine Straftat. Sie bleiben für spätere Auswertungen liegen.",
      en: "The unit passed almost seven in ten reports on to no one for now, for lack of an initial suspicion of a crime. They stay on file for later analysis.",
    },
    sources: [fiu2025],
  },

  // ---------- Ergebnis: what comes of it.
  {
    id: "ergebnis-gesichert",
    chapter: "ergebnis",
    title: {
      de: "Von 100 Euro aus Straftaten …",
      en: "Of 100 euros from crime …",
    },
    text: {
      de: "… werden in der EU 2,20 Euro vorläufig eingefroren oder beschlagnahmt.",
      en: "… 2.20 euros are frozen or seized for now in the EU.",
    },
    sources: [europol],
  },
  {
    id: "ergebnis-eingezogen",
    chapter: "ergebnis",
    title: {
      de: "… und 1,10 Euro eingezogen.",
      en: "… and 1.10 euros confiscated.",
    },
    text: {
      de: "Endgültig, nach Schätzung von Europol für 2010 bis 2014. Wie viel Straftaten einbringen, ist selbst geschätzt.",
      en: "Finally, as Europol estimates it for 2010 to 2014. How much crime brings in is itself an estimate.",
    },
    sources: [europol],
  },
  {
    id: "ergebnis-krypto",
    chapter: "ergebnis",
    title: {
      de: "Krypto: rund 1 von 100 Euro.",
      en: "Crypto: about 1 in 100 euros.",
    },
    text: {
      de: "So viel ordnen zwei Analysefirmen für 2025 Kriminellen oder sanktionierten Stellen zu, als Untergrenze. Laut US-Finanzministerium wird mit Kryptowerten weit weniger Geld gewaschen als mit herkömmlichem Geld.",
      en: "That is what two analysis firms attribute to criminals or sanctioned entities for 2025, as a lower bound. According to the US Treasury, laundering with crypto-assets “remains well below” laundering with ordinary money.",
    },
    sources: [
      {
        label: { de: "Chainalysis 2026", en: "Chainalysis 2026" },
        href: "https://www.chainalysis.com/blog/2026-crypto-crime-report-introduction/",
      },
      {
        label: { de: "TRM Labs 2026", en: "TRM Labs 2026" },
        href: "https://www.trmlabs.com/reports-and-whitepapers/2026-crypto-crime-report",
      },
      {
        label: { de: "US-Finanzministerium 2026", en: "US Treasury 2026" },
        href: "https://home.treasury.gov/system/files/246/2026-NMLRA.pdf",
      },
    ],
  },
  {
    id: "ergebnis-steuer",
    chapter: "ergebnis",
    title: {
      de: "Steuerdaten: 45 von 150.",
      en: "Tax data: 45 of 150.",
    },
    text: {
      de: "So viele Datensätze über Konten und Einkommen führten in einer Stichprobe des EU-Rechnungshofs zu einer weiteren Maßnahme. Der Rest blieb ohne weiteren Schritt.",
      en: "That many records on accounts and income led to further action in a sample by the European Court of Auditors. The rest led to no further step.",
    },
    sources: [
      {
        label: {
          de: "EU-Rechnungshof 03/2021, Rn. 68",
          en: "European Court of Auditors 03/2021, para 68",
        },
        href: "https://www.eca.europa.eu/Lists/ECADocuments/SR21_03/SR_Exchange_tax_inform_DE.pdf",
      },
    ],
  },

  // ---------- Bilanz: everything at a glance.
  {
    id: "bilanz",
    chapter: "bilanz",
    title: { de: "Die Bilanz.", en: "The balance." },
    text: {
      de: "Immer mehr Regeln erfassen alle, die eine Bank oder einen Anbieter nutzen. Was herauskommt, ist klein und kaum gemessen.",
      en: "More and more rules capture everyone who uses a bank or a provider. What comes of it is small and hardly measured.",
    },
    sources: [
      {
        label: {
          de: "Alle Zahlen zum Nachprüfen",
          en: "Every figure, to check",
        },
        href: "#nachpruefen",
      },
    ],
  },
]

// The pile: every EU anti-money-laundering act since 1991 by year, in pages
// of the Official Journal (for the 2024 acts, published one per issue, the
// pages of each act). Repealed acts count too: it is what was adopted. Each
// year joins the pile at the step named.
export const pile: {
  year: number
  pages: number
  step: string
  acts: string
}[] = [
  { year: 1991, pages: 6, step: "seiten-1991", acts: "91/308" },
  { year: 2001, pages: 7, step: "seiten-2006", acts: "2001/97" },
  { year: 2005, pages: 22, step: "seiten-2006", acts: "2005/60" },
  { year: 2006, pages: 15, step: "seiten-2006", acts: "2006/70, 1781/2006" },
  { year: 2015, pages: 63, step: "seiten-2018", acts: "2015/849, 2015/847" },
  { year: 2018, pages: 41, step: "seiten-2018", acts: "2018/843, 2018/1673" },
  { year: 2023, pages: 39, step: "seiten-2023", acts: "2023/1113" },
  {
    year: 2024,
    pages: 295,
    step: "seiten-2024",
    acts: "2024/1624, 2024/1640, 2024/1620",
  },
]

// From which amount ID is needed, in euros (1991: ECU). The 2027 cap is
// not an ID threshold but a ban above it, so it is drawn as a line.
export const thresholds: {
  step: string
  year: number
  amount: number
  unit: "ECU" | "EUR"
  label: Text
  cap?: true
}[] = [
  {
    step: "schwelle-1991",
    year: 1991,
    amount: 15000,
    unit: "ECU",
    label: { de: "Einzelgeschäft", en: "Single transaction" },
  },
  {
    step: "schwelle-2017",
    year: 2017,
    amount: 1000,
    unit: "EUR",
    label: { de: "Geldtransfer", en: "Money transfer" },
  },
  {
    step: "schwelle-2024",
    year: 2024,
    amount: 0,
    unit: "EUR",
    label: { de: "Krypto-Übertragung", en: "Crypto transfer" },
  },
  {
    step: "schwelle-2027",
    year: 2027,
    amount: 3000,
    unit: "EUR",
    label: { de: "Bargeschäft", en: "Cash transaction" },
  },
  {
    step: "schwelle-2027",
    year: 2027,
    amount: 10000,
    unit: "EUR",
    label: {
      de: "darüber kein Bargeld an Händler",
      en: "no cash to traders above",
    },
    cap: true,
  },
]

// Who may look up the Austrian account register, by the year they joined.
export const lookers: { step: string; label: Text }[] = [
  {
    step: "zugriff-2016",
    label: { de: "Strafjustiz", en: "Criminal justice" },
  },
  {
    step: "zugriff-2016",
    label: { de: "Finanzstrafbehörden", en: "Fiscal-penal authorities" },
  },
  {
    step: "zugriff-2016",
    label: { de: "Abgabenbehörden", en: "Tax authorities" },
  },
  {
    step: "zugriff-2021",
    label: {
      de: "Geldwäschemeldestelle, Staatsschutz",
      en: "Financial intelligence, state security",
    },
  },
  {
    step: "zugriff-2021",
    label: { de: "Finanzmarktaufsicht", en: "Financial market authority" },
  },
  {
    step: "zugriff-2021",
    label: { de: "Kriminalpolizei", en: "Criminal police" },
  },
  {
    step: "zugriff-2021",
    label: { de: "Sanktionsbehörden", en: "Sanctions authorities" },
  },
  {
    step: "zugriff-2026",
    label: { de: "Amt für Betrugsbekämpfung", en: "Anti-fraud office" },
  },
]

// Suspicion reports in Austria and what became of them.
export const reportField = {
  first: 467,
  latest: 13989,
  convictions: 139,
  keptOnFile: 9665,
}

// Shares of 100 euros and of 150 records, for the result chapter.
export const resultGrids = {
  seized: 2.2,
  confiscated: 1.1,
  crypto: 1,
  records: { total: 150, followedUp: 45 },
}
