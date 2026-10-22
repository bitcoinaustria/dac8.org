import {
  bgbl,
  type Chronicle,
  type Entry,
  eli,
  history,
  historyCommon,
  historyStack,
  type StackGroup,
  same,
} from "@/data/history"

// What anti-money-laundering rules ask of people in Austria, by the step
// that introduced it, from the first ID duty to the cash cap. Rows start in
// the year a duty applies in Austria. Every date and claim is verified in
// dac8-wiki/.wiki/wiki/references/aml-kyc-history-austria.md and its raw
// records (2026-10-21-atprivacy-*, -cryptoaml-*, -amlgrowth-*). The page
// shows the research date of the tax chronicle, so update `historyAsOf` in
// history.ts with every change here too. Keep both translations in sync.

const fatf1990 =
  "https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/FATF%20Recommendations%201990.pdf"
const fatfAnnual2000 =
  "https://www.fatf-gafi.org/media/fatf/documents/reports/1999%202000%20ENG.pdf"
const fatf2015 =
  "https://www.fatf-gafi.org/media/fatf/documents/reports/Guidance-RBA-Virtual-Currencies.pdf"
const fatfRecommendations =
  "https://www.fatf-gafi.org/content/dam/fatf-gafi/recommendations/fatf-recommendations-2012.pdf"
const ecb500 =
  "https://www.ecb.europa.eu/press/pr/date/2016/html/pr160504.de.html"
const ecb500En =
  "https://www.ecb.europa.eu/press/pr/date/2016/html/pr160504.en.html"
const cashMotion2019 = "https://www.parlament.gv.at/gegenstand/XXVI/A/870"
const cashAnswer2026 =
  "https://www.parlament.gv.at/dokument/XXVIII/AB/3569/imfname_1736778.pdf"
const bwg1993 = same(
  "https://www.ris.bka.gv.at/Dokumente/BgblPdf/1993_532_0/1993_532_0.pdf",
  "BWG, BGBl. Nr. 532/1993",
  "Banking Act, Federal Law Gazette No. 532/1993",
)
const amlr = eli("reg/2024/1624", {
  de: "Verordnung (EU) 2024/1624",
  en: "Regulation (EU) 2024/1624",
})

const amlEntries: Entry[] = [
  {
    id: "fatf-1990",
    status: "context",
    year: "1990",
    date: "1990-02-07",
    short: { de: "FATF", en: "FATF" },
    translations: {
      de: {
        when: "1989 gegründet, Empfehlungen 1990",
        title: "Die FATF und ihre 40 Empfehlungen",
        text: "Die sieben großen Industriestaaten gründen 1989 die FATF, eine Arbeitsgruppe gegen Geldwäsche. Ihre 40 Empfehlungen verlangen, dass Banken ihre Kunden identifizieren, Unterlagen aufbewahren und auf ungewöhnliche Geschäfte achten.",
        more: "Die Empfehlungen sind kein Gesetz. Staaten setzen sie um, und die FATF prüft, ob sie es tun. 1990 umfassten sie gut 2.000 Wörter, heute mit Erläuterungen und Begriffen gut 45.000.",
      },
      en: {
        when: "Founded in 1989, recommendations in 1990",
        title: "The FATF and its 40 recommendations",
        text: "In 1989 the G7 founded the FATF, a task force against money laundering. Its 40 recommendations ask banks to identify their customers, keep records and watch for unusual transactions.",
        more: "The recommendations are not law. States put them into law, and the FATF checks whether they do. In 1990 they ran to just over 2,000 words; today, with their notes and glossary, to just over 45,000.",
      },
    },
    sources: [
      same(fatf1990, "FATF-Empfehlungen 1990", "FATF Recommendations 1990"),
      same(
        fatfRecommendations,
        "FATF-Empfehlungen, Fassung Juni 2026",
        "FATF Recommendations, June 2026 edition",
      ),
    ],
  },
  {
    id: "geldwaesche-1991",
    status: "repealed",
    year: "1991",
    date: "1991-06-10",
    short: { de: "1. Geldwäsche-RL", en: "1st AML directive" },
    translations: {
      de: {
        when: "10. Juni 1991",
        title: "Die erste Geldwäsche-Richtlinie der EU",
        text: "Die EU übernimmt die Empfehlungen: Banken müssen Kunden bei der Kontoeröffnung und bei einzelnen Geschäften ab 15.000 ECU identifizieren und Verdacht melden.",
        more: "Ihr Regelungstext hatte rund 2.000 Wörter. Die drei Rechtsakte, die die EU 2024 beschlossen hat, haben zusammen rund 106.000, mehr als fünfzigmal so viel.",
      },
      en: {
        when: "10 June 1991",
        title: "The EU’s first anti-money-laundering directive",
        text: "The EU adopts the recommendations: banks must identify customers when they open an account and for single transactions from 15,000 ECU, and report suspicion.",
        more: "Its provisions ran to about 2,000 words. The three acts the EU adopted in 2024 run to about 106,000 together, more than fifty times as many.",
      },
    },
    sources: [
      eli("dir/1991/308", {
        de: "Richtlinie 91/308/EWG",
        en: "Directive 91/308/EEC",
      }),
      amlr,
      eli("dir/2024/1640", {
        de: "Richtlinie (EU) 2024/1640",
        en: "Directive (EU) 2024/1640",
      }),
      eli("reg/2024/1620", {
        de: "Verordnung (EU) 2024/1620",
        en: "Regulation (EU) 2024/1620",
      }),
    ],
  },
  {
    id: "ausweis",
    status: "past",
    year: "1994",
    date: "1994-01-01",
    short: { de: "Ausweis", en: "ID" },
    translations: {
      de: {
        when: "1. Jänner 1994",
        title: "Die Bank muss wissen, wer ihr Kunde ist",
        text: "Mit dem Bankwesengesetz halten Banken die Identität ihrer Kunden fest: bei jeder dauernden Geschäftsbeziehung, bei einzelnen Geschäften ab 200.000 Schilling und bei Verdacht auf Geldwäsche.",
        more: "Sparbücher und Wertpapierdepots bleiben zunächst ausdrücklich ausgenommen. Die Unterlagen bewahrt die Bank mindestens fünf Jahre auf.",
        reporters: "Banken und Finanzinstitute",
        austria: "BWG, BGBl. Nr. 532/1993, § 40",
      },
      en: {
        when: "1 January 1994",
        title: "The bank must know who its customer is",
        text: "Under the Banking Act, banks record their customers’ identity: for every lasting business relationship, for single transactions from 200,000 schillings and on suspicion of money laundering.",
        more: "Savings books and securities accounts are at first expressly exempt. The bank keeps the records for at least five years.",
        reporters: "Banks and financial institutions",
        austria: "Banking Act, Federal Law Gazette No. 532/1993, § 40",
      },
    },
    sources: [bwg1993],
  },
  {
    id: "verdacht",
    status: "past",
    year: "1994",
    date: "1994-01-01",
    short: { de: "Verdachtsmeldung", en: "Suspicion reports" },
    translations: {
      de: {
        when: "1. Jänner 1994",
        title: "Verdacht wird gemeldet, ohne dass der Kunde es erfährt",
        text: "Sieht ein Geschäft nach Geldwäsche aus, meldet die Bank es der Behörde und hält es an. Den Kunden darf sie nicht warnen.",
        more: "2025 gingen bei der Geldwäschemeldestelle 13.989 Meldungen ein, 2.671 davon von Krypto-Anbietern. 9.665, fast sieben von zehn, wurden vorerst nicht weitergegeben, mangels Anfangsverdachts, also eines Anhaltspunkts für eine Straftat, oder weiterer Ansätze, und bleiben für spätere Auswertungen gespeichert.",
        reporters:
          "Banken, heute auch Krypto-Anbieter, Notare, Anwälte und andere",
        austria: "BWG, BGBl. Nr. 532/1993, § 41; heute FM-GwG § 16",
      },
      en: {
        when: "1 January 1994",
        title: "Suspicion is reported without the customer knowing",
        text: "If a transaction looks like money laundering, the bank reports it to the authority and holds it. It may not warn the customer.",
        more: "In 2025 the financial intelligence unit received 13,989 reports, 2,671 of them from crypto-asset providers. 9,665, almost seven in ten, were not passed on for now, for lack of an initial suspicion of a crime or further leads, and stay on file for later analysis.",
        reporters:
          "Banks, today also crypto-asset providers, notaries, lawyers and others",
        austria:
          "Banking Act, Federal Law Gazette No. 532/1993, § 41; today FM-GwG § 16",
      },
    },
    sources: [
      bwg1993,
      same(
        "https://www.bundeskriminalamt.at/308/files/374-2026-geldwaeschebericht-2025-a4-v20260915-web-bf.pdf",
        "Lagebericht Geldwäsche 2025, S. 29–34",
        "Money laundering report 2025, pp. 29–34",
      ),
    ],
  },
  {
    id: "depot",
    status: "past",
    year: "1996",
    date: "1996-08-01",
    short: { de: "Depot", en: "Securities" },
    translations: {
      de: {
        when: "1. August 1996",
        title: "Kein neues anonymes Wertpapierdepot",
        text: "Wer ein Wertpapierdepot eröffnet, muss sich ausweisen. In alte anonyme Depots kommen neue Wertpapiere nur noch nach Ausweis.",
        more: "Verkaufen und auszahlen ließ sich aus alten Depots noch bis Mitte 2002 anonym.",
        reporters: "Banken",
        austria: "BGBl. Nr. 446/1996",
      },
      en: {
        when: "1 August 1996",
        title: "No new anonymous securities accounts",
        text: "Anyone opening a securities account must show ID. New securities go into old anonymous accounts only after ID.",
        more: "Sales and payouts from old accounts stayed anonymous until mid-2002.",
        reporters: "Banks",
        austria: "Federal Law Gazette No. 446/1996",
      },
    },
    sources: [
      same(
        "https://www.ris.bka.gv.at/Dokumente/BgblPdf/1996_445_0/1996_445_0.pdf",
        "BGBl. Nr. 446/1996",
        "Federal Law Gazette No. 446/1996",
      ),
    ],
  },
  {
    id: "fatf-2000",
    status: "context",
    year: "2000",
    date: "2000-02-03",
    short: { de: "FATF-Druck", en: "FATF pressure" },
    translations: {
      de: {
        when: "3. Februar 2000",
        title: "Die FATF droht, Österreichs Mitgliedschaft auszusetzen",
        text: "Die FATF kündigt an, Österreichs Mitgliedschaft ab 15. Juni 2000 auszusetzen, wenn die Regierung nicht zusagt, die anonymen Sparbücher bis Mitte 2002 abzuschaffen. Die Regierung sagt zu, das Parlament beschließt das Gesetz im Juni.",
        more: "Zugleich lief ein Verfahren der EU-Kommission gegen Österreich vor dem Gerichtshof der EU wegen der anonymen Sparbücher.",
      },
      en: {
        when: "3 February 2000",
        title: "The FATF threatens to suspend Austria",
        text: "The FATF announces it will suspend Austria from 15 June 2000 unless the government commits to abolishing anonymous savings books by mid-2002. The government commits, and parliament passes the law in June.",
        more: "At the same time, the European Commission was taking Austria to the EU Court of Justice over the anonymous savings books.",
      },
    },
    sources: [
      same(
        fatfAnnual2000,
        "FATF-Jahresbericht 1999–2000, Rn. 89–93",
        "FATF Annual Report 1999–2000, paras 89–93",
      ),
      same(
        "https://curia.europa.eu/de/actu/communiques/cp00/aff/cp0037de.htm",
        "EuGH C-290/98, Schlussanträge",
        "CJEU C-290/98, Opinion",
      ),
    ],
  },
  {
    id: "sparbuch",
    status: "past",
    year: "2000",
    date: "2000-11-01",
    short: { de: "Sparbuch", en: "Savings book" },
    translations: {
      de: {
        when: "1. November 2000 und 1. Juli 2002",
        title: "Das Ende des anonymen Sparbuchs",
        text: "Neue Sparbücher gibt es ab November 2000 nur nach Ausweis. Ab Juli 2002 sind alte anonyme Sparbücher gesperrt, bis sich jemand ausweist.",
        more: "Ein Losungswort bleibt möglich, schützt aber nur gegenüber Dritten: Die Bank kennt den Kunden. Seit 2008 verbietet das Gesetz anonyme Konten und Spareinlagen ausdrücklich.",
        reporters: "Banken",
        austria: "BGBl. I Nr. 33/2000; heute § 12 FM-GwG",
      },
      en: {
        when: "1 November 2000 and 1 July 2002",
        title: "The end of the anonymous savings book",
        text: "From November 2000, new savings books require ID. From July 2002, old anonymous books are frozen until someone shows ID.",
        more: "A password is still possible but only shields against third parties: the bank knows the customer. Since 2008 the law expressly bans anonymous accounts and savings deposits.",
        reporters: "Banks",
        austria: "Federal Law Gazette I No. 33/2000; today FM-GwG § 12",
      },
    },
    sources: [
      same(
        "https://www.ris.bka.gv.at/Dokumente/BgblPdf/2000_33_1/2000_33_1.pdf",
        "BGBl. I Nr. 33/2000",
        "Federal Law Gazette I No. 33/2000",
      ),
      bgbl(2007, "I", 108),
      bgbl(2016, "I", 118),
    ],
  },
  {
    id: "sorgfalt",
    status: "past",
    year: "2008",
    date: "2008-01-01",
    short: { de: "Überwachung", en: "Monitoring" },
    translations: {
      de: {
        when: "1. Jänner 2008",
        title: "Die Bank beobachtet das Konto laufend",
        text: "Die Bank muss die Geschäftsbeziehung laufend überwachen, Geschäfte prüfen und, wo nötig, nach der Herkunft des Geldes fragen. Sie muss wissen, wem eine Firma oder ein Treuhandvermögen letztlich gehört.",
        more: "Dazu kommt eine Risikoanalyse: Je nach Produkt, Kunde und Land prüft die Bank genauer oder weniger genau.",
        reporters: "Banken und Finanzinstitute",
        austria: "BWG § 40 Abs. 2a, §§ 40a, 40b, BGBl. I Nr. 108/2007",
      },
      en: {
        when: "1 January 2008",
        title: "The bank watches the account continuously",
        text: "The bank must monitor the business relationship continuously, check transactions and, where needed, ask where the money comes from. It must know who ultimately owns a company or trust.",
        more: "Add a risk analysis: depending on product, customer and country, the bank checks more or less closely.",
        reporters: "Banks and financial institutions",
        austria:
          "Banking Act § 40(2a), §§ 40a, 40b, Federal Law Gazette I No. 108/2007",
      },
    },
    sources: [
      eli("dir/2005/60", {
        de: "Richtlinie 2005/60/EG",
        en: "Directive 2005/60/EC",
      }),
      same(
        "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2007_I_108/BGBLA_2007_I_108.pdfsig",
        "BGBl. I Nr. 108/2007",
        "Federal Law Gazette I No. 108/2007",
      ),
    ],
  },
  {
    id: "bankgeheimnis",
    status: "context",
    year: "1979",
    date: "1979-03-01",
    short: { de: "Bankgeheimnis", en: "Banking secrecy" },
    translations: {
      de: {
        when: "1979, 1994 und 2015",
        title: "Das Bankgeheimnis",
        text: "1979 schreibt das Kreditwesengesetz das Bankgeheimnis fest. Seit 1994 kann der Nationalrat es nur mit Zweidrittelmehrheit ändern.",
        more: "2015 hat eine Zweidrittelmehrheit es für Steuerzwecke gelockert, im selben Gesetz, das das Kontenregister schuf.",
      },
      en: {
        when: "1979, 1994 and 2015",
        title: "Banking secrecy",
        text: "In 1979 the Banking Act enshrines banking secrecy. Since 1994 parliament can change it only by a two-thirds majority.",
        more: "In 2015 a two-thirds majority loosened it for tax purposes, in the same act that created the account register.",
      },
    },
    sources: [
      same(
        "https://www.ris.bka.gv.at/Dokumente/BgblPdf/1979_63_0/1979_63_0.pdf",
        "KWG, BGBl. Nr. 63/1979, § 23",
        "Banking Act, Federal Law Gazette No. 63/1979, § 23",
      ),
      bwg1993,
      same(
        "https://www.parlament.gv.at/gegenstand/XXV/I/685",
        "Regierungsvorlage 685 d.B. (XXV. GP)",
        "Government bill 685 d.B. (25th legislative period)",
      ),
    ],
  },
  {
    id: "kontenregister",
    status: "past",
    year: "2016",
    date: "2016-08-10",
    short: { de: "Kontenregister", en: "Account register" },
    translations: {
      de: {
        when: "Seit 10. August 2016",
        title: "Das Kontenregister: wer welche Konten hat",
        text: "Ein zentrales Register hält fest, wer bei welcher Bank in Österreich Konten und Depots hat, ohne Kontostände. Abfragen durften zuerst Staatsanwaltschaften, Strafgerichte und Abgabenbehörden.",
        more: "2021 kamen die Geldwäschemeldestelle, der Staatsschutz, die Finanzmarktaufsicht, das Bundeskriminalamt und die Sanktionsbehörden dazu, außerdem Schließfächer. Seit Juli 2026 fragt auch das Amt für Betrugsbekämpfung ab, etwa gegen Sozialbetrug. Kontostände und Umsätze bekommt die Steuerbehörde von der Bank weiterhin nur mit Zustimmung des Bundesfinanzgerichts.",
        reporters: "Banken",
        austria:
          "Kontenregister- und Konteneinschaugesetz, BGBl. I Nr. 116/2015",
      },
      en: {
        when: "Since 10 August 2016",
        title: "The account register: who holds which accounts",
        text: "A central register records who holds accounts and securities accounts at which bank in Austria, without balances. At first, prosecutors, criminal courts and tax authorities could look it up.",
        more: "In 2021 the financial intelligence unit, state security, the financial market authority, the Federal Criminal Police Office and sanctions authorities were added, along with safe-deposit boxes. Since July 2026 the anti-fraud office looks it up too, for example against benefit fraud. The tax authority still gets balances and transactions from the bank only with the Federal Fiscal Court’s approval.",
        reporters: "Banks",
        austria:
          "Account Register and Account Inspection Act, Federal Law Gazette I No. 116/2015",
      },
    },
    sources: [bgbl(2015, "I", 116), bgbl(2021, "I", 25), bgbl(2026, "I", 46)],
  },
  {
    id: "register-eu",
    status: "planned",
    year: "2029",
    date: "2029-07-10",
    short: { de: "EU-Register", en: "EU registers" },
    translations: {
      de: {
        when: "Bis 10. Juli 2029",
        title: "Die Kontenregister der EU werden verbunden",
        text: "Die Kontenregister der Mitgliedstaaten werden über eine gemeinsame Schnittstelle abfragbar. Sie erfassen dann auch Konten bei Krypto-Anbietern, ohne Kontostände.",
        reporters: "Banken und Krypto-Anbieter",
        austria: "Umsetzung offen",
      },
      en: {
        when: "By 10 July 2029",
        title: "The EU’s account registers are connected",
        text: "Member States’ account registers become searchable through a common interface. They will then also cover accounts at crypto-asset providers, without balances.",
        reporters: "Banks and crypto-asset providers",
        austria: "Implementation pending",
      },
    },
    sources: [
      eli("dir/2024/1640", {
        de: "Richtlinie (EU) 2024/1640, Art. 16",
        en: "Directive (EU) 2024/1640, Article 16",
      }),
    ],
  },
  {
    id: "fatf-krypto",
    status: "context",
    year: "2015",
    date: "2015-06-26",
    short: { de: "FATF und Krypto", en: "FATF and crypto" },
    translations: {
      de: {
        when: "Juni 2015 und Juni 2019",
        title: "Die FATF und Bitcoin",
        text: "2015 empfiehlt die FATF, die Wechselstuben zwischen Kryptowerten und Euro oder Dollar zu regeln, ausdrücklich nicht die Menschen, die Bitcoin zum Bezahlen verwenden.",
        more: "2019 verlangt sie für jeden Krypto-Anbieter Lizenz oder Registrierung, eine Ausweisprüfung ab 1.000 Euro und dass Anbieter Angaben zu Absender und Empfänger einer Übertragung erheben und weitergeben.",
      },
      en: {
        when: "June 2015 and June 2019",
        title: "The FATF and bitcoin",
        text: "In 2015 the FATF recommends regulating the exchanges between crypto-assets and euros or dollars, expressly not the people who use bitcoin to pay.",
        more: "In 2019 it asks for a licence or registration for every crypto-asset provider, an ID check from 1,000 euros, and that providers obtain and pass on sender and recipient details for transfers.",
      },
    },
    sources: [
      same(
        fatf2015,
        "FATF, Leitfaden virtuelle Währungen 2015, Rn. 14 und 36",
        "FATF, virtual currency guidance 2015, paras 14 and 36",
      ),
      same(
        fatfRecommendations,
        "FATF-Empfehlung 15 mit Erläuterung",
        "FATF Recommendation 15 and its note",
      ),
    ],
  },
  {
    id: "krypto-anbieter",
    status: "past",
    year: "2020",
    date: "2020-01-10",
    short: { de: "Krypto-Anbieter", en: "Crypto providers" },
    translations: {
      de: {
        when: "Seit 10. Jänner 2020",
        title: "Ausweis auch beim Krypto-Anbieter",
        text: "Krypto-Börsen und Anbieter, die Kryptowerte für Kunden verwahren, mussten sich bei der Finanzmarktaufsicht registrieren und identifizieren ihre Kunden seither wie eine Bank.",
        more: "Österreich erfasst auch den Tausch zwischen Kryptowerten, Übertragungen und die Ausgabe neuer Kryptowerte. Seit 2026 braucht jeder Anbieter eine Lizenz nach der EU-Verordnung über Märkte für Kryptowerte, kurz MiCA.",
        reporters: "Krypto-Anbieter",
        austria: "FM-GwG § 32a, BGBl. I Nr. 62/2019",
      },
      en: {
        when: "Since 10 January 2020",
        title: "ID at the crypto-asset provider too",
        text: "Crypto exchanges and providers that hold crypto-assets for customers had to register with the financial market authority and have identified their customers like a bank ever since.",
        more: "Austria also covers exchange between crypto-assets, transfers and the issue of new crypto-assets. Since 2026 every provider needs a licence under the EU regulation on markets in crypto-assets, MiCA for short.",
        reporters: "Crypto-asset providers",
        austria: "FM-GwG § 32a, Federal Law Gazette I No. 62/2019",
      },
    },
    sources: [
      eli("dir/2018/843", {
        de: "Richtlinie (EU) 2018/843",
        en: "Directive (EU) 2018/843",
      }),
      bgbl(2019, "I", 62),
    ],
  },
  {
    id: "uebertragung",
    status: "current",
    year: "2024",
    date: "2024-12-30",
    short: { de: "Jede Übertragung", en: "Every transfer" },
    translations: {
      de: {
        when: "Seit 30. Dezember 2024",
        title: "Namen reisen mit jeder Übertragung",
        text: "Bei jeder Übertragung über einen Anbieter gehen Name und Wallet-Adresse, ähnlich einer Kontonummer, von Absender und Empfänger mit, ohne Mindestbetrag, dazu die Wohnadresse und Ausweisnummer oder Geburtsdatum und -ort des Absenders. Die Anbieter speichern sie.",
        more: "Auch bei Übertragungen auf die eigene Wallet, also ein Programm oder Gerät, mit dem du die Schlüssel selbst hältst, hält der Anbieter diese Angaben fest; ab 1.000 Euro muss er prüfen, ob die Wallet dem Kunden gehört. Wer von Mensch zu Mensch überträgt, ohne Anbieter, fällt nicht darunter.",
        reporters: "Krypto-Anbieter",
        austria: "Gilt als EU-Verordnung unmittelbar",
      },
      en: {
        when: "Since 30 December 2024",
        title: "Names travel with every transfer",
        text: "Every transfer through a provider carries the name and wallet address, much like an account number, of sender and recipient, with no minimum amount, plus the sender’s home address and ID number or date and place of birth. The providers store them.",
        more: "For transfers to your own wallet, a program or device with which you hold the keys yourself, the provider records these details; from 1,000 euros it must check that the wallet belongs to the customer. Transfers from person to person, without a provider, are not covered.",
        reporters: "Crypto-asset providers",
        austria: "Applies directly as an EU regulation",
      },
    },
    sources: [
      eli("reg/2023/1113", {
        de: "Verordnung (EU) 2023/1113, Art. 14 und 16",
        en: "Regulation (EU) 2023/1113, Articles 14 and 16",
      }),
    ],
  },
  {
    id: "anonym-2027",
    status: "planned",
    year: "2027",
    date: "2027-07-10",
    short: { de: "Keine anonymen Konten", en: "No anonymous accounts" },
    translations: {
      de: {
        when: "Ab 10. Juli 2027",
        title: "Keine anonymen Konten und Coins beim Anbieter",
        text: "Banken und Krypto-Anbieter dürfen keine anonymen Konten führen, auch nicht über Kryptowerte, die Übertragungen unkenntlich machen. Die eigene Wallet und ihre Software betrifft das nicht.",
        more: "Bei einzelnen Geschäften prüfen Krypto-Anbieter ab 1.000 Euro vollständig und identifizieren den Kunden auch darunter.",
        reporters: "Banken, Finanzinstitute und Krypto-Anbieter",
        austria: "Gilt als EU-Verordnung unmittelbar",
      },
      en: {
        when: "From 10 July 2027",
        title: "No anonymous accounts or coins at the provider",
        text: "Banks and crypto-asset providers may not keep anonymous accounts, including through crypto-assets that obscure transfers. Your own wallet and its software are not affected.",
        more: "For single transactions, crypto-asset providers run full checks from 1,000 euros and identify the customer below that too.",
        reporters: "Banks, financial institutions and crypto-asset providers",
        austria: "Applies directly as an EU regulation",
      },
    },
    sources: [
      eli("reg/2024/1624", {
        de: "Verordnung (EU) 2024/1624, Art. 19 und 79",
        en: "Regulation (EU) 2024/1624, Articles 19 and 79",
      }),
    ],
  },
  {
    id: "500er",
    status: "past",
    year: "2019",
    date: "2019-04-26",
    short: { de: "500er", en: "€500 note" },
    translations: {
      de: {
        when: "Seit 26. April 2019",
        title: "Kein neuer 500-Euro-Schein",
        text: "Auch die Oesterreichische Nationalbank gibt keine 500-Euro-Scheine mehr aus. Die Europäische Zentralbank begründete das mit der Sorge, der Schein könne illegale Geschäfte erleichtern; Zahlen nannte sie dazu keine.",
        more: "Der Schein bleibt gesetzliches Zahlungsmittel und behält seinen Wert.",
        reporters: "Notenbanken",
        austria: "Die Nationalbank gab ihn mit der Bundesbank am längsten aus",
      },
      en: {
        when: "Since 26 April 2019",
        title: "No new 500-euro notes",
        text: "Austria’s central bank, too, stops issuing 500-euro notes. The European Central Bank cited the concern that the note could facilitate illicit activity; it gave no figures.",
        more: "The note remains legal tender and keeps its value.",
        reporters: "Central banks",
        austria: "With the Bundesbank, the last central bank to issue it",
      },
    },
    sources: [
      {
        label: { de: "EZB, 4. Mai 2016", en: "ECB, 4 May 2016" },
        href: { de: ecb500, en: ecb500En },
      },
      same(
        "https://www.bundesbank.de/de/aufgaben/themen/herstellung-und-ausgabe-des-500-euro-scheins-wird-eingestellt-599234",
        "Deutsche Bundesbank",
        "Deutsche Bundesbank",
      ),
    ],
  },
  {
    id: "bargeld-2027",
    status: "planned",
    year: "2027",
    date: "2027-07-10",
    short: { de: "Bargeldgrenze", en: "Cash cap" },
    translations: {
      de: {
        when: "Ab 10. Juli 2027",
        title: "Bar höchstens 10.000 Euro",
        text: "Händler und Dienstleister dürfen höchstens 10.000 Euro bar annehmen oder zahlen. Zwischen Privatpersonen bleibt Bargeld frei. Ab 3.000 Euro bar müssen Banken und andere Verpflichtete dann auch bei einzelnen Geschäften den Ausweis prüfen.",
        more: "Österreich hat bisher keine allgemeine Obergrenze. Ein Recht auf Bargeld in der Verfassung scheiterte 2019 im Nationalrat; Anfang 2026 war laut Finanzminister kein solches Vorhaben bekannt.",
        reporters: "Händler, Dienstleister, Banken",
        austria: "Gilt als EU-Verordnung unmittelbar",
      },
      en: {
        when: "From 10 July 2027",
        title: "Cash only up to 10,000 euros",
        text: "Traders and service providers may accept or pay at most 10,000 euros in cash. Between private persons, cash stays free. From 3,000 euros in cash, banks and other obliged firms will also have to check ID for single transactions.",
        more: "Austria has no general cap so far. A right to cash in the constitution failed in parliament in 2019; in early 2026 the finance minister knew of no such plan.",
        reporters: "Traders, service providers, banks",
        austria: "Applies directly as an EU regulation",
      },
    },
    sources: [
      eli("reg/2024/1624", {
        de: "Verordnung (EU) 2024/1624, Art. 19 und 80",
        en: "Regulation (EU) 2024/1624, Articles 19 and 80",
      }),
      same(
        cashMotion2019,
        "Antrag 870/A (XXVI. GP)",
        "Motion 870/A (26th legislative period)",
      ),
      same(
        cashAnswer2026,
        "Anfragebeantwortung 3569/AB (XXVIII. GP)",
        "Answer 3569/AB (28th legislative period)",
      ),
    ],
  },
]

// Who has to act, rather than who reports.
const amlWho = { de: "Wer es tun muss", en: "Who must do it" }
export const amlHistory: Entry[] = amlEntries.map((entry) => ({
  ...entry,
  who: amlWho,
}))

export const amlStack: StackGroup[] = [
  {
    label: { de: "Bei der Bank", en: "At the bank" },
    rows: [
      {
        id: "ausweis",
        from: 1994,
        context: ["fatf-1990", "geldwaesche-1991"],
        what: { de: "Ausweis beim Konto", en: "ID for an account" },
      },
      {
        id: "verdacht",
        from: 1994,
        what: { de: "Verdachtsmeldungen", en: "Suspicion reports" },
      },
      {
        id: "depot",
        from: 1996,
        what: { de: "Ausweis beim Depot", en: "ID for securities" },
      },
      {
        id: "sparbuch",
        from: 2000,
        context: ["fatf-2000"],
        what: { de: "Ausweis beim Sparbuch", en: "ID for savings books" },
      },
      {
        id: "sorgfalt",
        from: 2008,
        what: {
          de: "Laufende Überwachung",
          en: "Continuous monitoring",
        },
      },
      {
        id: "kontenregister",
        from: 2016,
        context: ["bankgeheimnis"],
        what: {
          de: "Kontenregister",
          en: "Account register",
        },
      },
      {
        id: "register-eu",
        from: 2029,
        what: {
          de: "Vernetzte Kontenregister der EU",
          en: "Connected EU account registers",
        },
      },
    ],
  },
  {
    label: { de: "Beim Krypto-Anbieter", en: "At the crypto-asset provider" },
    rows: [
      {
        id: "krypto-anbieter",
        from: 2020,
        context: ["fatf-krypto"],
        what: { de: "Ausweis beim Anbieter", en: "ID at the provider" },
      },
      {
        id: "uebertragung",
        from: 2024,
        what: {
          de: "Namen bei jeder Übertragung",
          en: "Names with every transfer",
        },
      },
      {
        id: "anonym-2027",
        from: 2027,
        what: {
          de: "Keine anonymen Konten",
          en: "No anonymous accounts",
        },
      },
    ],
  },
  {
    label: { de: "Beim Bargeld", en: "With cash" },
    rows: [
      {
        id: "bargeld-2027",
        from: 2027,
        context: ["500er"],
        what: { de: "Bar höchstens 10.000 €", en: "Cash up to €10,000" },
      },
    ],
  },
]

export const amlChronicle: Chronicle = {
  id: "geldwaesche",
  entries: amlHistory,
  stack: amlStack,
  commons: [
    {
      id: "aufbewahrung",
      translations: {
        de: {
          label: "Für alle Geldwäsche-Pflichten",
          summary:
            "Was die Anbieter dafür erfassen, bewahren sie derzeit bis zehn Jahre nach Ende der Kundenbeziehung auf.",
          text: [
            "Ausweis, Wallet-Adressen und einzelne Transaktionen bleiben beim Anbieter, derzeit bis zehn Jahre nach Ende der Kundenbeziehung. Behörden bekommen sie bei einer Verdachtsmeldung oder auf Anfrage, etwa im Strafverfahren.",
          ],
        },
        en: {
          label: "For every AML duty",
          summary:
            "What providers record for these duties, they currently keep for up to ten years after the customer relationship ends.",
          text: [
            "ID, wallet addresses and individual transactions stay with the provider, currently for up to ten years after the customer relationship ends. Authorities receive them with a suspicion report or on request, for example in criminal proceedings.",
          ],
        },
      },
      sources: [
        same(
          "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009769",
          "FM-GwG § 21",
          "FM-GwG § 21",
        ),
      ],
    },
  ],
  // From 1988, so the first years have room for their labels.
  axisStart: 1988,
  ticks: [1990, 2000, 2010, 2020, 2030],
  title: {
    de: "Was die Geldwäsche-Regeln verlangen",
    en: "What anti-money-laundering rules require",
  },
  note: {
    de: "Eine Zeile je Pflicht, ab dem Jahr, in dem sie in Österreich gilt. Jede Zeile öffnet Einzelheiten und Quellen.",
    en: "One row per duty, from the year it applies in Austria. Open a row for details and sources.",
  },
  noun: { de: "dieser Pflichten", en: "of these duties" },
  sum: { de: "Zusammen, Jahr für Jahr", en: "Together, year by year" },
  who: { de: "Wer es tun muss", en: "Who must do it" },
}

// Both lines in one chart, on one axis: what tax authorities receive and
// what anti-money-laundering rules require of banks, providers and their
// customers. One count adds them up, because together they are what has
// piled up. Each line keeps its head, so tax reporting and what stays with
// the provider never read as one.
const taxDomain = {
  id: "steuern",
  label: {
    de: "Steuern: was Behörden automatisch bekommen",
    en: "Tax: what authorities receive automatically",
  },
}
const amlDomain = {
  id: "geldwaesche",
  label: {
    de: "Geldwäsche: was Banken und Anbieter prüfen und melden müssen",
    en: "Money laundering: what banks and providers must check and report",
  },
}

export const ruleChronicle: Chronicle = {
  id: "regeln",
  entries: [...history, ...amlHistory],
  stack: [
    ...historyStack.map((group) => ({ ...group, domain: taxDomain })),
    ...amlStack.map((group) => ({ ...group, domain: amlDomain })),
  ],
  commons: [
    { id: "gemeinsam", ...historyCommon },
    ...(amlChronicle.commons ?? []),
  ],
  axisStart: 1988,
  ticks: [1990, 2000, 2010, 2020, 2030],
  title: {
    de: "Wie sich die Regeln stapeln",
    en: "How the rules pile up",
  },
  note: {
    de: "Eine Zeile je Regel, ab dem Jahr, in dem sie gilt; bei der Geldwäsche in Österreich. Jede Zeile öffnet Einzelheiten und Quellen.",
    en: "One row per rule, from the year it applies; for money laundering, in Austria. Open a row for details and sources.",
  },
  noun: { de: "dieser Regeln", en: "of these rules" },
  sum: { de: "Zusammen, Jahr für Jahr", en: "Together, year by year" },
}
