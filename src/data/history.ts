import type { Language } from "@/lib/i18n"

// Chronology of EU administrative cooperation in taxation. Every date and
// claim is verified in dac8-wiki/.wiki/wiki/references/dac-history-timeline.md
// and its raw source records. Keep both translations in sync.

// Research status shown at the bottom of the history page. Update it with every
// change to the entries below, so readers can tell how current the page is.
export const historyResearchDate: Record<Language, string> = {
  de: "30. September 2026",
  en: "30 September 2026",
}

type Era = "anfaenge" | "automatik" | "konzerne" | "neue-bereiche" | "ausblick"
// context: outside the directive, e.g. OECD standards. proposed: not law.
type Status = "context" | "repealed" | "past" | "current" | "proposed"

type Text = {
  when: string
  title: string
  text: string
  reporters?: string
  austria?: string
}

type Source = {
  label: Record<Language, string>
  href: Record<Language, string>
}

type Entry = {
  id: string
  era: Era
  status: Status
  year: string
  // ISO date of adoption, publication or proposal.
  date: string
  short: Record<Language, string>
  translations: Record<Language, Text>
  sources: Source[]
}

// EUR-Lex in the reader's language.
const eli = (path: string, label: Record<Language, string>): Source => ({
  label,
  href: {
    de: `https://eur-lex.europa.eu/eli/${path}/oj/deu`,
    en: `https://eur-lex.europa.eu/eli/${path}/oj/eng`,
  },
})
const celex = (id: string, label: Record<Language, string>): Source => ({
  label,
  href: {
    de: `https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX:${id}`,
    en: `https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:${id}`,
  },
})
const bgbl = (year: number, part: "I" | "II", number: number): Source => ({
  label: {
    de: `BGBl. ${part} Nr. ${number}/${year}`,
    en: `Federal Law Gazette ${part} No. ${number}/${year}`,
  },
  href: {
    de: `https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_${year}_${part}_${number}/BGBLA_${year}_${part}_${number}.html`,
    en: `https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_${year}_${part}_${number}/BGBLA_${year}_${part}_${number}.html`,
  },
})
const same = (href: string, de: string, en: string): Source => ({
  label: { de, en },
  href: { de: href, en: href },
})

export const history: Entry[] = [
  {
    id: "amtshilfe-1977",
    era: "anfaenge",
    status: "repealed",
    year: "1977",
    date: "1977-12-19",
    short: { de: "Amtshilfe", en: "Mutual assistance" },
    translations: {
      de: {
        when: "19. Dezember 1977",
        title: "Die erste Amtshilfe-Richtlinie",
        text: "Die Steuerbehörden der Mitgliedstaaten helfen einander bei direkten Steuern: vor allem auf Anfrage zu einem bestimmten Fall, auch unaufgefordert. Automatisch fließen Daten nur, wo die Behörden das eigens vereinbaren. Später kommen Mehrwertsteuer (1979) und Verbrauchsteuern (1992) dazu.",
        reporters: "Nur Behörden, keine Unternehmen",
        austria:
          "Gilt seit dem EU-Beitritt am 1. Jänner 1995 (EG-Amtshilfegesetz)",
      },
      en: {
        when: "19 December 1977",
        title: "The first mutual assistance directive",
        text: "Member States’ tax authorities help each other with direct taxes, mainly on request about a specific case, and also spontaneously. Data flows automatically only where authorities agree to it. VAT (1979) and excise duties (1992) are added later.",
        reporters: "Authorities only, no companies",
        austria:
          "Applies since EU accession on 1 January 1995 (EG-Amtshilfegesetz)",
      },
    },
    sources: [
      eli("dir/1977/799", {
        de: "Richtlinie 77/799/EWG",
        en: "Directive 77/799/EEC",
      }),
    ],
  },
  {
    id: "zinsrichtlinie",
    era: "anfaenge",
    status: "repealed",
    year: "2003",
    date: "2003-06-03",
    short: { de: "Zinsrichtlinie", en: "Savings" },
    translations: {
      de: {
        when: "3. Juni 2003, angewendet ab 1. Juli 2005",
        title: "Die Zinsrichtlinie",
        text: "Erstmals melden Private automatisch: Banken als Zahlstellen melden Zinsen an Personen, die in einem anderen EU-Staat wohnen. Österreich, Belgien und Luxemburg dürfen stattdessen anonym eine Quellensteuer einbehalten, ohne Namen zu melden. Mit dem Kontenaustausch unter DAC2 wird die Richtlinie ab 2016 aufgehoben.",
        reporters: "Zahlstellen, meist Banken",
        austria:
          "EU-Quellensteuergesetz 2004: Quellensteuer bis 35 % statt Meldung, bis Ende 2016",
      },
      en: {
        when: "3 June 2003, applied from 1 July 2005",
        title: "The Savings Directive",
        text: "For the first time, private entities report automatically: banks acting as paying agents report interest paid to people resident in another EU country. Austria, Belgium and Luxembourg may instead levy an anonymous withholding tax without reporting names. Once account data is exchanged under DAC2, the directive is repealed from 2016.",
        reporters: "Paying agents, mostly banks",
        austria:
          "EU-Quellensteuergesetz 2004: withholding tax of up to 35% instead of reporting, until the end of 2016",
      },
    },
    sources: [
      eli("dir/2003/48", {
        de: "Richtlinie 2003/48/EG",
        en: "Directive 2003/48/EC",
      }),
      eli("dir/2015/2060", {
        de: "Aufhebung durch Richtlinie (EU) 2015/2060",
        en: "Repeal by Directive (EU) 2015/2060",
      }),
      bgbl(2004, "I", 33),
    ],
  },
  {
    id: "fatca",
    era: "anfaenge",
    status: "context",
    year: "2010",
    date: "2010-03-18",
    short: { de: "FATCA (USA)", en: "FATCA (US)" },
    translations: {
      de: {
        when: "18. März 2010",
        title: "FATCA: Die USA verlangen Kontodaten aus aller Welt",
        text: "Ein US-Gesetz verpflichtet ausländische Banken, Konten von US-Steuerpflichtigen an die US-Steuerbehörde zu melden. Die EU-Richtlinie über den Kontenaustausch (DAC2) nennt FATCA ausdrücklich als Anstoß.",
      },
      en: {
        when: "18 March 2010",
        title: "FATCA: the US demands account data worldwide",
        text: "A US law requires foreign banks to report accounts of US taxpayers to the US tax authority. The EU directive on account exchange (DAC2) expressly names FATCA as a driver.",
      },
    },
    sources: [
      same(
        "https://www.govinfo.gov/content/pkg/PLAW-111publ147/pdf/PLAW-111publ147.pdf",
        "HIRE Act, Public Law 111-147",
        "HIRE Act, Public Law 111-147",
      ),
    ],
  },
  {
    id: "dac1",
    era: "automatik",
    status: "past",
    year: "2011",
    date: "2011-02-15",
    short: { de: "DAC1", en: "DAC1" },
    translations: {
      de: {
        when: "15. Februar 2011, automatischer Austausch ab 2015",
        title: "DAC1: Die Grundrichtlinie",
        text: "Die Richtlinie 2011/16/EU ersetzt die Regeln von 1977 und ist bis heute der Rahmen, den alle weiteren Stufen ändern. Neu ist der verpflichtende automatische Austausch: Was die Behörden über Gehälter, Aufsichtsratsvergütungen, Lebensversicherungen, Pensionen und Immobilien schon wissen, geht jedes Jahr an den Wohnsitzstaat.",
        reporters: "Behörden, aus eigenen Daten",
        austria: "EU-Amtshilfegesetz, in Kraft seit 1. Jänner 2013",
      },
      en: {
        when: "15 February 2011, automatic exchange from 2015",
        title: "DAC1: the framework directive",
        text: "Directive 2011/16/EU replaces the 1977 rules and remains the framework that every later step amends. What is new is mandatory automatic exchange: what authorities already know about salaries, director’s fees, life insurance, pensions and immovable property goes to the country of residence every year.",
        reporters: "Authorities, from their own data",
        austria: "EU-Amtshilfegesetz, in force since 1 January 2013",
      },
    },
    sources: [
      eli("dir/2011/16", {
        de: "Richtlinie 2011/16/EU",
        en: "Directive 2011/16/EU",
      }),
      bgbl(2012, "I", 112),
    ],
  },
  {
    id: "crs",
    era: "automatik",
    status: "context",
    year: "2014",
    date: "2014-07-15",
    short: { de: "CRS (OECD)", en: "CRS (OECD)" },
    translations: {
      de: {
        when: "15. Juli 2014",
        title: "Der Common Reporting Standard der OECD",
        text: "Die OECD beschließt einen weltweiten Standard für den automatischen Austausch von Kontodaten, die G20 billigen ihn. Am 29. Oktober 2014 unterzeichnen in Berlin gut fünfzig Staaten das Abkommen für den Austausch.",
      },
      en: {
        when: "15 July 2014",
        title: "The OECD Common Reporting Standard",
        text: "The OECD adopts a global standard for the automatic exchange of financial account information, endorsed by the G20. On 29 October 2014, around fifty jurisdictions sign the exchange agreement in Berlin.",
      },
    },
    sources: [
      same(
        "https://www.oecd.org/content/dam/oecd/en/publications/reports/2017/03/standard-for-automatic-exchange-of-financial-account-information-in-tax-matters-second-edition_g1g73eb6/9789264267992-en.pdf",
        "OECD: Standard für den automatischen Austausch (Englisch)",
        "OECD: Standard for Automatic Exchange of Financial Account Information",
      ),
    ],
  },
  {
    id: "dac2",
    era: "automatik",
    status: "past",
    year: "2014",
    date: "2014-12-09",
    short: { de: "DAC2", en: "DAC2" },
    translations: {
      de: {
        when: "9. Dezember 2014, angewendet ab 2016, in Österreich ab 2017",
        title: "DAC2: Bankkonten",
        text: "Banken und andere Finanzinstitute melden jährlich Name, Steuernummer, Kontonummer, Kontostand sowie Zinsen, Dividenden und Verkaufserlöse von Kunden, die in einem anderen Staat steuerlich ansässig sind. Um das festzustellen, prüfen sie alle Kunden. Damit übernimmt die EU den OECD-Standard.",
        reporters: "Banken, Depotbanken, Versicherungen, Fonds",
        austria:
          "Gemeinsamer Meldestandard-Gesetz, im selben Paket wie Kontenregister und Lockerung des Bankgeheimnisses (2015). Erster allgemeiner Austausch am 30. September 2018",
      },
      en: {
        when: "9 December 2014, applied from 2016, in Austria from 2017",
        title: "DAC2: bank accounts",
        text: "Banks and other financial institutions report, every year, the name, tax number, account number and balance, as well as interest, dividends and sale proceeds, of customers who are tax resident in another country. To determine this, they review all customers. With this, the EU adopts the OECD standard.",
        reporters: "Banks, custodians, insurers, funds",
        austria:
          "Common Reporting Standard Act (GMSG), in the same 2015 package as the central account register and the easing of bank secrecy. First general exchange on 30 September 2018",
      },
    },
    sources: [
      eli("dir/2014/107", {
        de: "Richtlinie 2014/107/EU",
        en: "Directive 2014/107/EU",
      }),
      bgbl(2015, "I", 116),
    ],
  },
  {
    id: "dac3",
    era: "konzerne",
    status: "past",
    year: "2015",
    date: "2015-12-08",
    short: { de: "DAC3", en: "DAC3" },
    translations: {
      de: {
        when: "8. Dezember 2015, angewendet ab 2017",
        title: "DAC3: Steuervorbescheide",
        text: "Die Behörden tauschen verbindliche Auskünfte und Verrechnungspreis-Zusagen aus, die sie Unternehmen für grenzüberschreitende Fälle gegeben haben, rückwirkend für fünf Jahre. Der Vorschlag folgt auf die Debatte über Steuerabsprachen mit Konzernen. Die Richtlinie selbst nennt die „LuxLeaks“-Enthüllungen nicht.",
        reporters: "Behörden",
        austria: "EU-Amtshilfegesetz, Änderung 2016",
      },
      en: {
        when: "8 December 2015, applied from 2017",
        title: "DAC3: tax rulings",
        text: "Authorities exchange the binding rulings and pricing agreements they have given companies in cross-border cases, going back five years. The proposal follows the debate about tax deals with multinationals. The directive itself does not mention the LuxLeaks revelations.",
        reporters: "Authorities",
        austria: "EU-Amtshilfegesetz, 2016 amendment",
      },
    },
    sources: [
      eli("dir/2015/2376", {
        de: "Richtlinie (EU) 2015/2376",
        en: "Directive (EU) 2015/2376",
      }),
      bgbl(2016, "I", 77),
    ],
  },
  {
    id: "dac4",
    era: "konzerne",
    status: "past",
    year: "2016",
    date: "2016-05-25",
    short: { de: "DAC4", en: "DAC4" },
    translations: {
      de: {
        when: "25. Mai 2016, ab dem Geschäftsjahr 2016",
        title: "DAC4: Konzernberichte",
        text: "Konzerne mit mindestens 750 Millionen Euro Umsatz berichten, in welchem Land sie wie viel Umsatz, Gewinn und Steuern haben. Grundlage ist ein Projekt der OECD gegen Gewinnverlagerung.",
        reporters: "Große Konzerne",
        austria: "Verrechnungspreisdokumentationsgesetz 2016",
      },
      en: {
        when: "25 May 2016, from financial year 2016",
        title: "DAC4: country-by-country reports",
        text: "Groups with revenue of at least 750 million euros report their revenue, profits and taxes country by country. It is based on an OECD project against profit shifting.",
        reporters: "Large groups",
        austria: "Transfer Pricing Documentation Act (VPDG), 2016",
      },
    },
    sources: [
      eli("dir/2016/881", {
        de: "Richtlinie (EU) 2016/881",
        en: "Directive (EU) 2016/881",
      }),
      bgbl(2016, "I", 77),
    ],
  },
  {
    id: "dac5",
    era: "konzerne",
    status: "past",
    year: "2016",
    date: "2016-12-06",
    short: { de: "DAC5", en: "DAC5" },
    translations: {
      de: {
        when: "6. Dezember 2016, angewendet ab 2018",
        title: "DAC5: Zugriff auf Geldwäschedaten",
        text: "Keine neue Meldung, aber ein neuer Zugang: Steuerbehörden dürfen auf Daten zugreifen, die Banken und andere zur Geldwäschebekämpfung erheben, etwa Identifizierung und wirtschaftliche Eigentümer. Vor allem sollen sie so prüfen können, ob die Kontenmeldungen unter DAC2 stimmen. Der Vorschlag erschien kurz nach den „Panama Papers“ und verweist auf „jüngste Medienberichte“.",
        reporters: "Keine neue Meldepflicht",
        austria:
          "Umgesetzt im Paket zum Wirtschaftliche Eigentümer Registergesetz (2017)",
      },
      en: {
        when: "6 December 2016, applied from 2018",
        title: "DAC5: access to anti-money laundering data",
        text: "Not a new report but new access: tax authorities may use data that banks and others collect to fight money laundering, such as customer identification and beneficial owners. Above all, this lets them check whether DAC2 account reports are correct. The proposal came shortly after the Panama Papers and refers to “recent media leaks”.",
        reporters: "No new reporting duty",
        austria:
          "Implemented in the package around the Beneficial Owners Register Act (WiEReG, 2017)",
      },
    },
    sources: [
      eli("dir/2016/2258", {
        de: "Richtlinie (EU) 2016/2258",
        en: "Directive (EU) 2016/2258",
      }),
      bgbl(2017, "I", 136),
    ],
  },
  {
    id: "dac6",
    era: "konzerne",
    status: "past",
    year: "2018",
    date: "2018-05-25",
    short: { de: "DAC6", en: "DAC6" },
    translations: {
      de: {
        when: "25. Mai 2018, angewendet ab 1. Juli 2020",
        title: "DAC6: Steuergestaltungen",
        text: "Berater, Banken und andere Intermediäre melden grenzüberschreitende Gestaltungen mit bestimmten Kennzeichen binnen 30 Tagen, sonst der Steuerpflichtige selbst. Der Vorschlag nennt die „Panama Papers“. Der EuGH hat 2022 die Pflicht von Anwälten gekippt, andere Beteiligte zu informieren, 2024 aber den Rest der Richtlinie bestätigt.",
        reporters: "Berater und Intermediäre",
        austria: "EU-Meldepflichtgesetz, ab 1. Juli 2020",
      },
      en: {
        when: "25 May 2018, applied from 1 July 2020",
        title: "DAC6: tax arrangements",
        text: "Advisers, banks and other intermediaries report cross-border arrangements with certain hallmarks within 30 days; otherwise the taxpayer reports. The proposal names the Panama Papers. In 2022, the CJEU struck down the duty of lawyers to notify other intermediaries, but in 2024 it upheld the rest of the directive.",
        reporters: "Advisers and intermediaries",
        austria: "EU Reporting Obligations Act (EU-MPfG), from 1 July 2020",
      },
    },
    sources: [
      eli("dir/2018/822", {
        de: "Richtlinie (EU) 2018/822",
        en: "Directive (EU) 2018/822",
      }),
      celex("62020CJ0694", { de: "EuGH C-694/20", en: "CJEU C-694/20" }),
      celex("62022CJ0623", { de: "EuGH C-623/22", en: "CJEU C-623/22" }),
      bgbl(2019, "I", 91),
    ],
  },
  {
    id: "dac7",
    era: "neue-bereiche",
    status: "past",
    year: "2021",
    date: "2021-03-22",
    short: { de: "DAC7", en: "DAC7" },
    translations: {
      de: {
        when: "22. März 2021, angewendet ab 2023",
        title: "DAC7: Online-Plattformen",
        text: "Plattformen melden, wer über sie Wohnungen vermietet, Dienstleistungen anbietet, Waren verkauft oder Fahrzeuge vermietet, samt Einnahmen. Wer weniger als 30 Waren um höchstens 2.000 Euro im Jahr verkauft, ist ausgenommen.",
        reporters: "Betreiber digitaler Plattformen",
        austria: "Digitale Plattformen-Meldepflichtgesetz, ab 2023",
      },
      en: {
        when: "22 March 2021, applied from 2023",
        title: "DAC7: online platforms",
        text: "Platforms report who rents out property, offers services, sells goods or rents out vehicles through them, including earnings. Sellers of fewer than 30 items for no more than 2,000 euros a year are exempt.",
        reporters: "Digital platform operators",
        austria: "Digital Platforms Reporting Act (DPMG), from 2023",
      },
    },
    sources: [
      eli("dir/2021/514", {
        de: "Richtlinie (EU) 2021/514",
        en: "Directive (EU) 2021/514",
      }),
      bgbl(2022, "I", 108),
    ],
  },
  {
    id: "carf",
    era: "neue-bereiche",
    status: "context",
    year: "2022",
    date: "2022-08-26",
    short: { de: "CARF (OECD)", en: "CARF (OECD)" },
    translations: {
      de: {
        when: "26. August 2022",
        title: "Der Krypto-Standard der OECD",
        text: "Die OECD beschließt das Crypto-Asset Reporting Framework, 2023 folgen Abkommen und ein überarbeiteter Kontenstandard. Bis September 2026 haben sich 77 Staaten verpflichtet, darunter alle EU-Staaten, die Schweiz ab 2028 und die USA ab 2029.",
      },
      en: {
        when: "26 August 2022",
        title: "The OECD crypto-asset standard",
        text: "The OECD approves the Crypto-Asset Reporting Framework; an exchange agreement and an amended account standard follow in 2023. By September 2026, 77 jurisdictions had committed, including every EU country, Switzerland from 2028 and the US from 2029.",
      },
    },
    sources: [
      same(
        "https://www.oecd.org/content/dam/oecd/en/networks/global-forum-tax-transparency/commitments-carf.pdf",
        "OECD Global Forum: CARF-Zusagen",
        "OECD Global Forum: CARF commitments",
      ),
    ],
  },
  {
    id: "dac8",
    era: "neue-bereiche",
    status: "current",
    year: "2023",
    date: "2023-10-17",
    short: { de: "DAC8", en: "DAC8" },
    translations: {
      de: {
        when: "17. Oktober 2023, gilt seit 1. Jänner 2026",
        title: "DAC8: Kryptowerte",
        text: "Krypto-Anbieter melden Identität und Jahreswerte je Kryptowert, auch für Kunden im eigenen Land. DAC8 bringt außerdem E-Geld in den Kontenaustausch und ändert Regeln, die für alle DAC-Daten gelten: Seither dürfen die Staaten alle ausgetauschten Informationen auch gegen Geldwäsche und Terrorismusfinanzierung einsetzen und, ohne Zustimmung des Herkunftsstaats, für EU-Sanktionen.",
        reporters: "Krypto-Börsen und Broker",
        austria: "Krypto-Meldepflichtgesetz, seit 1. Jänner 2026",
      },
      en: {
        when: "17 October 2023, applies since 1 January 2026",
        title: "DAC8: crypto-assets",
        text: "Crypto-asset service providers report identity and annual values per crypto-asset, including for domestic customers. DAC8 also brings e-money into account reporting and changes rules that apply to all DAC data: since then, Member States may also use every item exchanged to fight money laundering and terrorist financing and, without the sending country’s consent, for EU sanctions.",
        reporters: "Crypto exchanges and brokers",
        austria: "Crypto-Asset Reporting Obligations Act, since 1 January 2026",
      },
    },
    sources: [
      eli("dir/2023/2226", {
        de: "Richtlinie (EU) 2023/2226",
        en: "Directive (EU) 2023/2226",
      }),
      bgbl(2025, "I", 96),
    ],
  },
  {
    id: "dac9",
    era: "neue-bereiche",
    status: "past",
    year: "2025",
    date: "2025-04-14",
    short: { de: "DAC9", en: "DAC9" },
    translations: {
      de: {
        when: "14. April 2025, erste Meldung am 30. Juni 2026",
        title: "DAC9: Globale Mindeststeuer",
        text: "Große Konzerne reichen die Erklärung zur Mindeststeuer von 15 % zentral in einem Staat ein, die Behörden tauschen sie untereinander aus. Private sind nicht betroffen.",
        reporters: "Große Konzerne",
        austria: "Abgabenänderungsgesetz 2025, seit 1. Jänner 2026",
      },
      en: {
        when: "14 April 2025, first filing on 30 June 2026",
        title: "DAC9: global minimum tax",
        text: "Large groups file the return for the 15% minimum tax centrally in one country, and authorities exchange it among themselves. Individuals are not affected.",
        reporters: "Large groups",
        austria: "Tax Amendment Act 2025, since 1 January 2026",
      },
    },
    sources: [
      eli("dir/2025/872", {
        de: "Richtlinie (EU) 2025/872",
        en: "Directive (EU) 2025/872",
      }),
      bgbl(2025, "I", 97),
    ],
  },
  {
    id: "neufassung",
    era: "ausblick",
    status: "proposed",
    year: "2026",
    date: "2026-06-24",
    short: { de: "Neufassung", en: "Recast" },
    translations: {
      de: {
        when: "Vorgeschlagen am 24. Juni 2026",
        title: "Die Neufassung, oft „DAC10“ genannt",
        text: "Die Kommission will alle Stufen in einer neuen Richtlinie zusammenführen und vereinfachen: Bei Steuergestaltungen gelten 90 statt 30 Tage, Plattform-Schwellen ändern sich, ein EU-Werkzeug prüft Steuernummern. Zugleich sollen Steuerbehörden Zugang zu Geldwäsche-Registern, auch für Immobilien, und zu Pensionsregistern bekommen. Die Kryptofelder bleiben inhaltlich gleich. Der Datenschutzbeauftragte der EU hat im August 2026 engere Grenzen für diese Zugriffe und die Speicherdauer empfohlen.",
        reporters: "Noch kein Recht",
        austria:
          "Braucht die Zustimmung aller EU-Staaten im Rat; das Parlament wird nur angehört. Geplante Anwendung 2028 und 2030",
      },
      en: {
        when: "Proposed on 24 June 2026",
        title: "The recast, often called “DAC10”",
        text: "The Commission wants to merge all steps into one new directive and simplify them: 90 instead of 30 days for tax arrangements, changed platform thresholds and an EU tool to verify tax numbers. At the same time, tax authorities would gain access to anti-money laundering registers, including for real estate, and to pension registers. The crypto fields stay the same in substance. In August 2026, the European Data Protection Supervisor recommended tighter limits on this access and on retention.",
        reporters: "Not yet law",
        austria:
          "Needs the agreement of every EU country in the Council; Parliament is only consulted. Planned to apply in 2028 and 2030",
      },
    },
    sources: [
      celex("52026PC0308", {
        de: "Kommissionsvorschlag COM(2026) 308",
        en: "Commission proposal COM(2026) 308",
      }),
      same(
        "https://data.consilium.europa.eu/doc/document/ST-12521-2026-INIT/en/pdf",
        "EDSB-Stellungnahme 20/2026 (Englisch)",
        "EDPS Opinion 20/2026",
      ),
    ],
  },
]

export const historyEras: Record<
  Language,
  { id: Era; label: string; title: string; intro: string }[]
> = {
  de: [
    {
      id: "anfaenge",
      label: "1977–2010",
      title: "Amtshilfe im Einzelfall",
      intro:
        "Drei Jahrzehnte lang fragen Steuerbehörden einander zu bestimmten Fällen. Automatische Meldungen durch Banken gibt es nur für Zinsen.",
    },
    {
      id: "automatik",
      label: "2011–2014",
      title: "Der automatische Austausch",
      intro:
        "Ab 2011 wird der automatische Austausch zur Regel: erst für Daten, die Behörden schon haben, dann für Kontodaten, die Banken über alle Kunden aufbereiten.",
    },
    {
      id: "konzerne",
      label: "2015–2018",
      title: "Konzerne und Berater",
      intro:
        "Nach Enthüllungen über Steuerabsprachen und Briefkastenfirmen richten sich neue Stufen an Konzerne und Berater. Steuerbehörden erhalten Zugang zu Geldwäschedaten.",
    },
    {
      id: "neue-bereiche",
      label: "2021–2025",
      title: "Plattformen, Krypto, Mindeststeuer",
      intro:
        "Die Meldepflichten folgen der Wirtschaft in neue Bereiche. Jeweils kurz zuvor hat die OECD einen Standard beschlossen.",
    },
    {
      id: "ausblick",
      label: "Ab 2026",
      title: "Was noch kommt",
      intro:
        "Die Kommission will das ganze System neu fassen. Der Vorschlag ist noch kein Recht und kann sich in den Verhandlungen ändern.",
    },
  ],
  en: [
    {
      id: "anfaenge",
      label: "1977–2010",
      title: "Assistance in individual cases",
      intro:
        "For three decades, tax authorities ask each other about specific cases. Banks report automatically only on interest.",
    },
    {
      id: "automatik",
      label: "2011–2014",
      title: "Automatic exchange",
      intro:
        "From 2011, automatic exchange becomes the rule: first for data authorities already hold, then for account data that banks compile on all customers.",
    },
    {
      id: "konzerne",
      label: "2015–2018",
      title: "Multinationals and advisers",
      intro:
        "After revelations about tax deals and shell companies, new steps target multinationals and advisers. Tax authorities gain access to anti-money laundering data.",
    },
    {
      id: "neue-bereiche",
      label: "2021–2025",
      title: "Platforms, crypto, minimum tax",
      intro:
        "Reporting follows the economy into new areas. Each time, the OECD had adopted a standard shortly before.",
    },
    {
      id: "ausblick",
      label: "From 2026",
      title: "What comes next",
      intro:
        "The Commission wants to recast the whole system. The proposal is not yet law and may change in negotiations.",
    },
  ],
}

export const historyFor = (language: Language) =>
  history.map((entry) => {
    const { translations, short, sources, ...rest } = entry
    const text = translations[language]
    const en = language === "en"
    return {
      ...rest,
      short: short[language],
      when: text.when,
      title: text.title,
      text: text.text,
      details: [
        text.reporters && {
          label: en ? "Who reports" : "Wer meldet",
          text: text.reporters,
        },
        text.austria && {
          label:
            entry.status === "proposed"
              ? en
                ? "Procedure"
                : "Verfahren"
              : en
                ? "In Austria"
                : "In Österreich",
          text: text.austria,
        },
      ].filter((detail): detail is { label: string; text: string } =>
        Boolean(detail),
      ),
      sources: sources.map((source) => ({
        label: source.label[language],
        href: source.href[language],
      })),
    }
  })

// The steps shown on the home page, each linking to its entry.
export const homeSteps = [
  "amtshilfe-1977",
  "dac1",
  "dac2",
  "dac7",
  "dac8",
  "dac9",
  "neufassung",
]
