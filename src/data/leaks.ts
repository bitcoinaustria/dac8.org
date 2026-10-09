import type { Language } from "@/lib/i18n"

// Documented cases in which companies, authorities or their service
// providers lost data on people, or let it be misused. This is the only
// copy: the leak page lists every case, the dossier and the home page's
// matrix show the featured ones. Add new cases here, in both languages and
// with at least one primary source (the body's own notice, a court ruling,
// a prosecutor, regulator or parliamentary record). Press may only add to
// it. Say "accused" or "suspected" until a court has ruled.

// The columns are the pieces a provider holds together for DAC8. Mark a
// field only when a source says it was lost.
export type Field = "identity" | "document" | "wallet" | "holdings"

// Who lost the data. A case can name several, such as a tax tool that lost
// data through its email service.
export type Holder = "provider" | "taxTool" | "vendor" | "authority"

export interface Leak {
  id: string
  name: Record<Language, string>
  // The year the case became known. Left out where it spans years and no
  // single one fits.
  year?: number
  holders: Holder[]
  kind: Record<Language, string>
  lost: Field[]
  headline: Record<Language, string>
  text: Record<Language, string>
  // One short line for the matrix; needed for featured cases.
  then?: Record<Language, string>
  sources: { label: Record<Language, string>; href: string }[]
  featured?: boolean
}

const same = (label: string) => ({ de: label, en: label })

export const fields: { id: Field; label: Record<Language, string> }[] = [
  {
    id: "identity",
    label: { de: "Name und Anschrift", en: "Name and home address" },
  },
  { id: "document", label: { de: "Ausweis", en: "ID document" } },
  { id: "wallet", label: { de: "Wallet", en: "Wallet" } },
  {
    id: "holdings",
    label: { de: "Bestände oder Steuerdaten", en: "Holdings or tax data" },
  },
]

export const holders: { id: Holder; label: Record<Language, string> }[] = [
  { id: "provider", label: { de: "Krypto-Anbieter", en: "Crypto providers" } },
  { id: "taxTool", label: { de: "Steuertools", en: "Tax tools" } },
  { id: "vendor", label: { de: "Dienstleister", en: "Service providers" } },
  { id: "authority", label: { de: "Behörden", en: "Authorities" } },
]

export const leaks: Leak[] = [
  {
    id: "ledger",
    name: same("Ledger"),
    year: 2020,
    holders: ["provider"],
    kind: { de: "Hardware-Wallet-Shop", en: "Hardware wallet shop" },
    lost: ["identity"],
    headline: {
      de: "Die Wohnadressen von 272.000 Wallet-Käufern.",
      en: "The home addresses of 272,000 wallet buyers.",
    },
    text: {
      de: "Aus dem Onlineshop des Hardware-Wallet-Herstellers gelangten Namen, Anschriften und Telefonnummern ins Netz. Es folgten Phishing-Mails, SMS und Briefe an die Wohnadresse, die nach der Wiederherstellungsphrase fragten. In einer Umfrage der Universität Innsbruck berichteten 93 von 104 Betroffenen von Betrugsversuchen, 33 von Erpressungsdrohungen.",
      en: "Names, postal addresses and phone numbers leaked from the hardware wallet maker’s online shop. Phishing emails, text messages and letters to home addresses followed, asking for the recovery phrase. In a University of Innsbruck survey, 93 of 104 affected customers reported scam attempts and 33 reported extortion threats.",
    },
    then: {
      de: "Danach Erpressungsdrohungen und Briefe an die Wohnadresse",
      en: "Then extortion threats and letters to home addresses",
    },
    sources: [
      {
        label: same("Ledger"),
        href: "https://www.ledger.com/message-ledgers-ceo-data-leak",
      },
      {
        label: { de: "Abramova und Böhme", en: "Abramova and Böhme" },
        href: "https://www.usenix.org/system/files/usenixsecurity23-abramova.pdf",
      },
    ],
    featured: true,
  },
  {
    id: "kroll",
    name: same("Kroll"),
    year: 2023,
    holders: ["vendor"],
    kind: { de: "Insolvenzdienstleister", en: "Bankruptcy claims agent" },
    lost: ["identity", "holdings"],
    headline: {
      de: "Die Guthaben von Krypto-Gläubigern.",
      en: "The balances of crypto creditors.",
    },
    text: {
      de: "Über die gekaperte Handynummer eines Mitarbeiters griffen Angreifer beim Insolvenzdienstleister der FTX-Pleite auf Namen, Anschriften und Guthaben von Gläubigern dreier Krypto-Firmen zu. Kroll warnte vor Betrügern, die dazu auffordern, eine Wallet zu verbinden oder die Wiederherstellungsphrase einzugeben.",
      en: "Through an employee’s hijacked phone number, attackers at the FTX bankruptcy’s claims agent accessed the names, postal addresses and balances of creditors of three crypto companies. Kroll warned of fraudsters asking people to connect a wallet or enter their recovery phrase.",
    },
    then: {
      de: "Danach warnte Kroll vor Betrügern",
      en: "Kroll then warned of fraudsters",
    },
    sources: [
      {
        label: same("Kroll"),
        href: "https://ftxquestions.kroll.com/docs/Kroll_Notice_to_FTX_Claimants_4879-3276-7625-2.pdf",
      },
    ],
  },
  {
    id: "fractal-id",
    name: same("Fractal ID"),
    year: 2024,
    holders: ["vendor"],
    kind: { de: "Identifizierungsdienst", en: "Identity verification" },
    lost: ["identity", "document", "wallet"],
    headline: {
      de: "Ausweis, Wohnadresse und Wallet in einem Datensatz.",
      en: "ID, home address and wallet in one record.",
    },
    text: {
      de: "Mit dem wiederverwendeten Passwort eines Administrators holte ein Angreifer beim Berliner Identifizierungsdienst die Daten von rund 6.300 Nutzern: Namen, Ausweisbilder, Wohnadressen und Wallet-Adressen. Danach verlangten die Angreifer Lösegeld.",
      en: "Using an administrator’s reused password, an attacker took the data of around 6,300 users from the Berlin identity verification service: names, ID images, home addresses and wallet addresses. The attackers then demanded a ransom.",
    },
    then: {
      de: "Danach verlangten die Angreifer Lösegeld",
      en: "Then the attackers demanded a ransom",
    },
    sources: [
      {
        label: same("Fractal ID"),
        href: "http://web.archive.org/web/20240726003733/https://web.fractal.id/fractal-id-data-breach-post-mortem/",
      },
    ],
    featured: true,
  },
  {
    id: "coinbase",
    name: same("Coinbase"),
    year: 2025,
    holders: ["provider"],
    kind: { de: "Börse", en: "Exchange" },
    lost: ["identity", "document", "holdings"],
    headline: {
      de: "Betrogen mit echten Kundendaten.",
      en: "Defrauded with real customer data.",
    },
    text: {
      de: "Bestochene Support-Mitarbeiter kopierten Kundendaten bis hin zu Ausweisbildern und Kontoständen. Betrüger gaben sich danach als Coinbase aus und brachten Kunden dazu, ihnen Geld zu überweisen. Coinbase schätzt die Kosten samt Entschädigungen auf 180 bis 400 Millionen Dollar. Auch in Österreich nahm danach das Phishing in Coinbases Namen zu.",
      en: "Bribed support staff copied customer data, down to ID images and balances. Fraudsters then posed as Coinbase and persuaded customers to send them money. Coinbase estimates the costs, including reimbursements, at 180 to 400 million dollars. Phishing in Coinbase’s name then also rose in Austria.",
    },
    then: {
      de: "Betrüger nutzten die Daten, Kosten bis zu 400 Mio. $",
      en: "Fraudsters used the data, costs of up to $400m",
    },
    sources: [
      {
        label: same("Coinbase (Form 8-K)"),
        href: "https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/coin-20250514.htm",
      },
      {
        label: same("Watchlist Internet"),
        href: "https://www.watchlist-internet.at/news/datenleck-bei-coinbase-phishing",
      },
    ],
    featured: true,
  },
  {
    id: "waltio",
    name: same("Waltio"),
    year: 2026,
    holders: ["taxTool"],
    kind: { de: "Krypto-Steuerdienst", en: "Crypto tax service" },
    lost: ["holdings"],
    headline: {
      de: "Steuerdaten als Zielliste.",
      en: "Tax data as a target list.",
    },
    text: {
      de: "Beim französischen Krypto-Steuerdienst gelangten E-Mail-Adressen, Gewinne und Verluste sowie Jahresendbestände der Kunden in fremde Hände. Laut Gendarmerie nutzen Täter die Daten, um Opfer für Gewalttaten auszuwählen, und irren sich dabei teils über deren tatsächliche Bestände.",
      en: "At the French crypto tax service, customers’ email addresses, gains and losses and year-end balances fell into the wrong hands. According to the Gendarmerie, criminals use the data to select victims of violent crime, sometimes misjudging what they actually hold.",
    },
    then: {
      de: "Laut Gendarmerie wählen Täter damit Opfer für Gewalttaten aus",
      en: "According to the Gendarmerie, criminals use it to pick victims",
    },
    sources: [
      {
        label: same("Waltio"),
        href: "https://help.waltio.com/en/articles/13482134-questions-answers-security-incident",
      },
      {
        label: same("Gendarmerie"),
        href: "https://www.gendarmerie.interieur.gouv.fr/gendinfo/terrain/immersion/2026/la-strategie-de-la-gendarmerie-face-aux-cryptorapts-partie-2-2",
      },
    ],
    featured: true,
  },
  {
    id: "france",
    name: { de: "Frankreich", en: "France" },
    year: 2026,
    holders: ["authority"],
    kind: { de: "Finanzverwaltung", en: "Tax administration" },
    lost: ["identity", "holdings"],
    headline: {
      de: "Die Finanzverwaltung verliert zweimal.",
      en: "The tax administration is breached twice.",
    },
    text: {
      de: "Mit gestohlenen Zugangsdaten von Beamten zogen Angreifer im Februar 1,2 Millionen Datensätze aus dem nationalen Kontenregister, mit IBAN, Namen und Anschrift. Im Sommer folgten Daten zu Einkommen, Anschrift und Grundbesitz von 678.000 Menschen und Unternehmen aus dem Steuersystem.",
      en: "Using officials’ stolen credentials, attackers extracted 1.2 million records from the national bank-account register in February, with IBAN, name and postal address. In the summer, data on income, postal address and property on 678,000 individuals and businesses followed from the tax system.",
    },
    then: {
      de: "Zwei Einbrüche, ins Kontenregister und ins Steuersystem",
      en: "Two breaches, of the bank-account register and the tax system",
    },
    sources: [
      {
        label: { de: "Kontenregister", en: "account register" },
        href: "https://www.impots.gouv.fr/actualite/acces-illegitimes-au-fichier-national-des-comptes-bancaires-ficoba",
      },
      {
        label: { de: "Steuersystem", en: "tax system" },
        href: "https://presse.economie.gouv.fr/acces-illegitime-au-systeme-dinformation-de-la-direction-generale-des-finances-publiques/",
      },
    ],
    featured: true,
  },
  {
    id: "netherlands",
    name: { de: "Niederlande", en: "Netherlands" },
    year: 2026,
    holders: ["authority"],
    kind: { de: "Justiz", en: "Courts" },
    lost: [],
    headline: {
      de: "Gerichtsdaten für Erpressung.",
      en: "Court data used for extortion.",
    },
    text: {
      de: "Eine Gerichtsmitarbeiterin verkaufte vertrauliche Daten aus dem Justizsystem und erpresste mit solchen Daten selbst einen Mann, unter Drohungen gegen seine Familie. Er zahlte mehr als 92.000 Euro. Sie bekam vier Jahre Haft.",
      en: "A court employee sold confidential data from the justice system and used such data herself to extort a man, threatening his family. He paid more than 92,000 euros. She was sentenced to four years in prison.",
    },
    then: {
      de: "Erpressung mit Drohungen gegen die Familie",
      en: "Extortion with threats against the family",
    },
    sources: [
      {
        label: same("Rechtbank Overijssel"),
        href: "https://www.rechtspraak.nl/organisatie-en-contact/organisatie/rechtbanken/rechtbank-overijssel/nieuws/2026/05/oud-medewerker-rechtbank-amsterdam-krijgt-vier-jaar-cel-voor-het-verkopen-van-vertrouwelijke-gegevens-en-afpersing",
      },
    ],
  },
  {
    id: "austria",
    name: { de: "Österreich", en: "Austria" },
    holders: ["authority"],
    kind: { de: "Finanzverwaltung", en: "Tax administration" },
    lost: ["holdings"],
    headline: {
      de: "Tausende private Abfragen im Steuersystem.",
      en: "Thousands of private queries in the tax system.",
    },
    text: {
      de: "Ein Finanzbeamter griff sechs Jahre lang ohne dienstlichen Grund mehrere tausend Mal auf Steuerdaten zu, darunter von mehr als 1.000 Menschen aus seinem Heimatort. 2024 registrierte das Bundesamt zur Korruptionsbekämpfung im öffentlichen Dienst 116 neue Fälle unbefugter Datenabfragen und -weitergaben.",
      en: "For six years, a tax official accessed tax records several thousand times without any official reason, including those of more than 1,000 people from his home town. In 2024, Austria’s anti-corruption office registered 116 new cases of unauthorised data queries and disclosures in the public sector.",
    },
    then: {
      de: "Tausende Abfragen ohne dienstlichen Grund",
      en: "Thousands of queries without any official reason",
    },
    sources: [
      {
        label: {
          de: "Disziplinarkommission beim BMF",
          en: "Finance Ministry disciplinary board",
        },
        href: "https://www.ris.bka.gv.at/Dokumente/Dok/DKT_BMF_20160930_01069_7_DK_14_01072_7_DK_15_00/DKT_BMF_20160930_01069_7_DK_14_01072_7_DK_15_00.html",
      },
      {
        label: {
          de: "BAK-Jahresbericht 2024",
          en: "BAK annual report 2024",
        },
        href: "https://www.bak.gv.at/Downloads/files/Jahresberichte/BAK_Jahresbericht_2024_bf_20250422.pdf",
      },
    ],
    featured: true,
  },
  {
    id: "bulgaria",
    name: { de: "Bulgarien", en: "Bulgaria" },
    year: 2019,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Tax authority" },
    lost: ["holdings"],
    headline: {
      de: "Die Steuerbehörde verliert Daten aus dem Kontenaustausch.",
      en: "The tax authority loses data from the account exchange.",
    },
    text: {
      de: "Angreifer drangen in die Systeme der bulgarischen Steuerbehörde ein, danach standen Steuer- und Sozialversicherungsdaten von mehr als sechs Millionen Menschen im Netz. Darunter waren Kontodaten, die Bulgarien im automatischen Informationsaustausch von anderen Staaten erhalten hatte, auch über Konten in der Schweiz und in Deutschland. Der Austausch mit Bulgarien wurde ausgesetzt. Über denselben Austausch gehen künftig die DAC8-Meldungen zu Kryptowerten.",
      en: "Attackers broke into the Bulgarian tax authority’s systems, and tax and social security data on more than six million people then appeared online. It included account data that Bulgaria had received from other states through the automatic exchange of information, including on accounts in Switzerland and Germany. Exchanges with Bulgaria were suspended. DAC8 reports on crypto-assets will travel through the same exchange.",
    },
    then: {
      de: "Der Kontenaustausch mit Bulgarien wurde ausgesetzt",
      en: "Account data exchange with Bulgaria was suspended",
    },
    sources: [
      {
        label: same("OECD Global Forum"),
        href: "https://web.archive.org/web/20240123063026/https://www.oecd.org/tax/transparency/documents/statement-on-the-data-breach-in-the-national-revenue-agency-of-bulgaria.htm",
      },
      {
        label: { de: "Schweizer SIF", en: "Swiss SIF" },
        href: "https://www.sif.admin.ch/en/switzerland-suspends-aeoi-bulgaria",
      },
      {
        label: {
          de: "Bundestag, Drs. 19/22077",
          en: "Bundestag, Drs. 19/22077",
        },
        href: "https://dserver.bundestag.de/btd/19/220/1922077.pdf",
      },
      {
        label: { de: "EuGH C-340/21", en: "CJEU C-340/21" },
        href: "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62021CJ0340",
      },
    ],
    featured: true,
  },
  {
    id: "usa-irs-contractor",
    name: same("USA"),
    year: 2020,
    holders: ["authority", "vendor"],
    kind: { de: "Steuerbehörde", en: "Tax administration" },
    lost: ["holdings"],
    headline: {
      de: "Die Steuererklärungen der Reichsten.",
      en: "The tax returns of the wealthiest.",
    },
    text: {
      de: "Ein IT-Auftragnehmer der US-Steuerbehörde IRS tarnte seine Abfragen mit breit angelegten Suchen und kopierte die Steuerdaten tausender der reichsten Menschen des Landes. Er gab sie an Medien weiter. Laut einem späteren Prüfbericht waren rund 406.000 Steuerpflichtige betroffen. Er wurde 2024 zu fünf Jahren Haft verurteilt.",
      en: "An IT contractor at the US tax authority, the IRS, hid his queries behind broad searches and copied the tax data of thousands of the country’s wealthiest people. He passed it to news organisations. According to a later audit, around 406,000 taxpayers were affected. In 2024 he was sentenced to five years in prison.",
    },
    sources: [
      {
        label: { de: "US-Justizministerium", en: "US Department of Justice" },
        href: "https://web.archive.org/web/20241224231604/https://www.justice.gov/opa/pr/former-irs-contractor-sentenced-disclosing-tax-return-information-news-organizations",
      },
      {
        label: { de: "TIGTA-Prüfbericht", en: "TIGTA audit" },
        href: "https://www.tigta.gov/sites/default/files/reports/2025-05/2025ier019fr.pdf",
      },
    ],
  },
  {
    id: "italy-guardia-di-finanza",
    name: { de: "Italien", en: "Italy" },
    year: 2024,
    holders: ["authority"],
    kind: { de: "Finanzpolizei", en: "Financial police" },
    lost: ["holdings"],
    headline: {
      de: "Tausende Abfragen in Bank- und Steuerdaten.",
      en: "Thousands of searches in bank and tax data.",
    },
    text: {
      de: "Laut dem Staatsanwalt von Perugia sah ein Offizier der Finanzpolizei Guardia di Finanza von 2019 bis 2022 mehr als 4.000 Geldwäsche-Verdachtsmeldungen von Banken ein und fragte über 1.100 Personen in der Steuerdatenbank ab. Ins Rollen kam der Fall, als Details über die Finanzen des Verteidigungsministers in der Zeitung standen. 2026 beantragte die Staatsanwaltschaft Rom einen Prozess; verurteilt ist bisher niemand.",
      en: "According to the Perugia prosecutor, an officer of the financial police, the Guardia di Finanza, viewed more than 4,000 money-laundering suspicion reports from banks between 2019 and 2022 and searched more than 1,100 people in the tax database. The case began when details of the defence minister’s finances appeared in the press. In 2026 Rome prosecutors asked for a trial; no one has been convicted so far.",
    },
    sources: [
      {
        label: {
          de: "Abgeordnetenkammer, Anhörung 2024",
          en: "Chamber of Deputies, 2024 hearing",
        },
        href: "https://documenti.camera.it/leg19/resoconti/commissioni/stenografici/html/24/audiz2/audizione/2024/03/07/indice_stenografico.0036.html",
      },
      {
        label: same("Sky TG24"),
        href: "https://tg24.sky.it/cronaca/2026/05/15/caso-dossieraggio-antonio-laudati-pasquale-striano-processo",
      },
    ],
  },
  {
    id: "spain-bizkaia",
    name: { de: "Spanien", en: "Spain" },
    year: 2024,
    holders: ["authority"],
    kind: { de: "Regionale Steuerbehörde", en: "Regional tax authority" },
    lost: ["holdings"],
    headline: {
      de: "Steuerdaten für die eigene Beratungsfirma.",
      en: "Tax data for his own advisory firm.",
    },
    text: {
      de: "Ein Beamter der Steuerbehörde von Bizkaia war zugleich Mitinhaber einer Steuerberatung. Von mindestens 2017 bis 2019 sah er ohne Befugnis vertrauliche Steuerdaten der Kunden seiner Firma und von Menschen und Unternehmen in deren Umfeld ein und nutzte sie für die Firma. 2024 verurteilte ihn das Provinzgericht von Bizkaia in erster Instanz zu zehn Jahren Haft.",
      en: "An official at the Bizkaia tax authority also co-owned a tax advisory firm. From at least 2017 to 2019 he viewed confidential tax data on his firm’s clients and on people and companies around them without authorisation, and used it for the firm. In 2024 the Bizkaia provincial court sentenced him at first instance to ten years in prison.",
    },
    sources: [
      {
        label: { de: "Spanischer Justizrat", en: "Spanish judiciary" },
        href: "https://www.poderjudicial.es/cgpj/es/Poder-Judicial/Tribunales-Superiores-de-Justicia/TSJ-Pais-Vasco/Oficina-de-Comunicacion/Archivo-de-notas-de-prensa/-Condenan-a-un-funcionario-de-la-Hacienda-vizcaina-a-10-anos-de-prision-por-acceder-a-datos-tributarios-a-los-que-no-estaba-autorizado-y-usarlos-en-beneficio-de-su-asesoria",
      },
    ],
  },
  {
    id: "germany-bavaria",
    name: { de: "Deutschland", en: "Germany" },
    year: 2021,
    holders: ["authority"],
    kind: { de: "Finanzamt", en: "Tax office" },
    lost: ["holdings"],
    headline: {
      de: "Steuerdaten von Nachbarn und Vereinskollegen.",
      en: "Tax data on neighbours and club mates.",
    },
    text: {
      de: "Bei einer Stichprobe der Protokolle fand der Datenschutzbeauftragte der bayerischen Steuerverwaltung 54 eindeutig unbefugte Abfragen eines Mitarbeiters der Poststelle, zu Kollegen, Nachbarn und Mitgliedern seines Fußballvereins. Das Landesarbeitsgericht Nürnberg bestätigte 2021 seine Kündigung.",
      en: "In a random check of the logs, the data protection officer of the Bavarian tax administration found 54 clearly unauthorised queries by a mail-room employee, on colleagues, neighbours and members of his football club. In 2021 the Nuremberg labour court of appeal upheld his dismissal.",
    },
    sources: [
      {
        label: {
          de: "LAG Nürnberg, 3 Sa 265/20",
          en: "LAG Nürnberg, 3 Sa 265/20",
        },
        href: "https://lag.bayern.de/imperia/md/content/stmas/lag/nuernberg/entscheidungen/2021/3_sa_265_20.pdf",
      },
    ],
  },
  {
    id: "canada-cra",
    name: { de: "Kanada", en: "Canada" },
    year: 2020,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Revenue agency" },
    lost: ["identity", "holdings"],
    headline: {
      de: "Steuerkonten übernommen, Rückzahlungen umgeleitet.",
      en: "Tax accounts taken over, refunds redirected.",
    },
    text: {
      de: "Mit anderswo gestohlenen Passwörtern meldeten sich Kriminelle in rund 26.000 Online-Konten der kanadischen Steuerbehörde an und sahen Daten von etwa 34.000 Menschen ein, darunter Anschrift, Steuer- und Bankdaten. Sie änderten Bankverbindungen und Anschriften und kassierten Rückzahlungen und Sozialleistungen. Bis 2025 zählte die Behörde 42.755 bestätigte Fälle, in denen Dritte Steuerdaten unbefugt nutzten; der Datenschutzbeauftragte stellte 2026 Verstöße gegen das Datenschutzgesetz fest.",
      en: "Using passwords stolen elsewhere, criminals logged into around 26,000 online accounts at the Canada Revenue Agency and saw data on about 34,000 people, including postal address, tax and banking details. They changed bank details and addresses and collected refunds and benefits. By 2025 the agency counted 42,755 confirmed cases of third parties using taxpayer data without authorisation; in 2026 the privacy commissioner found breaches of the Privacy Act.",
    },
    sources: [
      {
        label: {
          de: "Datenschutzbeauftragter Kanadas 2024",
          en: "Privacy Commissioner of Canada 2024",
        },
        href: "https://www.priv.gc.ca/en/opc-actions-and-decisions/ar_index/202324/sr_pa_20240215_gckey/",
      },
      {
        label: {
          de: "Datenschutzbeauftragter Kanadas 2026",
          en: "Privacy Commissioner of Canada 2026",
        },
        href: "https://www.priv.gc.ca/en/opc-actions-and-decisions/ar_index/202526/sr_pa_20260507_cra",
      },
    ],
  },
  {
    id: "uk-hmrc-2025",
    name: { de: "Großbritannien", en: "United Kingdom" },
    year: 2025,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Revenue agency" },
    lost: ["holdings"],
    headline: {
      de: "47 Millionen Pfund über Steuerkonten.",
      en: "£47m taken through tax accounts.",
    },
    text: {
      de: "Mit Identitätsdaten, die sie anderswo per Phishing erbeutet hatten, legten Kriminelle Steuerkonten bei der britischen Steuerbehörde HMRC an oder übernahmen bestehende und forderten Rückzahlungen. HMRC schrieb rund 100.000 Betroffene an und nannte dem Parlament einen Schaden von 47 Millionen Pfund. Die eigenen Systeme seien dabei nicht gehackt worden.",
      en: "Using identity data phished elsewhere, criminals created or took over tax accounts at HMRC, the British tax authority, and claimed repayments. HMRC wrote to around 100,000 people affected and told Parliament that £47 million had been taken. It says its own systems were not hacked.",
    },
    sources: [
      {
        label: same("HMRC"),
        href: "https://web.archive.org/web/20250608095334/https://www.gov.uk/guidance/unauthorised-access-of-hmrc-online-accounts",
      },
      {
        label: {
          de: "Finanzausschuss des Unterhauses",
          en: "Treasury Committee",
        },
        href: "https://web.archive.org/web/20251204113240/https://committees.parliament.uk/oralevidence/16014/pdf/",
      },
    ],
  },
  {
    id: "usa-irs-transcripts",
    name: same("USA"),
    year: 2015,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Tax administration" },
    lost: ["holdings"],
    headline: {
      de: "Steuerauszüge für Betrüger.",
      en: "Tax transcripts for fraudsters.",
    },
    text: {
      de: "Mit anderswo gestohlenen persönlichen Daten bestanden Betrüger die Online-Identitätsprüfung der US-Steuerbehörde und luden Steuerauszüge herunter. Laut Prüfbericht gelang ihnen das bei weiteren 355.262 Steuerpflichtigen, über die rund 220.000 hinaus, die die Behörde selbst gemeldet hatte. Bei später damit eingereichten Steuererklärungen stoppte die Behörde Rückzahlungen über 119 Millionen Dollar.",
      en: "Using personal data stolen elsewhere, fraudsters passed the US tax authority’s online identity check and downloaded tax transcripts. According to the audit, they succeeded for another 355,262 taxpayers beyond the roughly 220,000 the authority had reported itself. On tax returns later filed with this data, the authority stopped refunds of 119 million dollars.",
    },
    sources: [
      {
        label: { de: "TIGTA-Prüfbericht", en: "TIGTA audit" },
        href: "https://www.oversight.gov/sites/default/files/oig-reports/201640037fr.pdf",
      },
    ],
  },
  {
    id: "uk-hmrc-2007",
    name: { de: "Großbritannien", en: "United Kingdom" },
    year: 2007,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Revenue agency" },
    lost: ["identity"],
    headline: {
      de: "Zwei CDs mit 25 Millionen Datensätzen verschwinden.",
      en: "Two CDs with 25 million records go missing.",
    },
    text: {
      de: "Die britische Steuerbehörde HMRC schickte die gesamte Kindergeld-Datenbank auf zwei CDs per Kurier an den Rechnungshof. Sie kamen nie an: Namen, Anschriften, Geburtsdaten und Versicherungsnummern von 25 Millionen Menschen, teils mit Bankverbindung. Ein Untersuchungsbericht nannte den Verlust „völlig vermeidbar“. Der Behördenchef trat zurück.",
      en: "HMRC, the British tax authority, sent the entire child benefit database on two CDs by courier to the National Audit Office. They never arrived: names, postal addresses, dates of birth and National Insurance numbers of 25 million people, some with bank details. A review called the loss “entirely avoidable”. The chairman of HMRC resigned.",
    },
    sources: [
      {
        label: {
          de: "Unterhaus, Erklärung 2007",
          en: "House of Commons, 2007 statement",
        },
        href: "https://web.archive.org/web/2020/https://publications.parliament.uk/pa/cm200708/cmhansrd/cm071120/debtext/71120-0004.htm",
      },
      {
        label: { de: "Poynter-Bericht", en: "Poynter review" },
        href: "https://webarchive.nationalarchives.gov.uk/ukgwa/+mp_/http://www.hm-treasury.gov.uk/media/0/1/poynter_review250608.pdf",
      },
    ],
  },
  {
    id: "netherlands-fsv",
    name: { de: "Niederlande", en: "Netherlands" },
    year: 2022,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Tax authority" },
    lost: [],
    headline: {
      de: "Eine schwarze Liste mit 270.000 Namen.",
      en: "A blacklist of 270,000 names.",
    },
    text: {
      de: "Die niederländische Steuerbehörde führte mehr als sechs Jahre lang rechtswidrig eine Liste mit rund 270.000 Menschen, die sie des Betrugs verdächtigte, oft auf falscher Grundlage. Wer darauf stand, bekam zum Beispiel keine Ratenzahlung. Die Datenschutzbehörde verhängte 2022 eine Strafe von 3,7 Millionen Euro, auch wegen mangelhafter Sicherung der Liste.",
      en: "For more than six years, the Dutch tax authority unlawfully kept a list of around 270,000 people it suspected of fraud, often on wrong grounds. Those on it were, for example, refused payment plans. In 2022 the data protection authority fined it 3.7 million euros, in part for failing to secure the list.",
    },
    sources: [
      {
        label: {
          de: "Autoriteit Persoonsgegevens",
          en: "Dutch Data Protection Authority",
        },
        href: "https://web.archive.org/web/20230922011752/https://autoriteitpersoonsgegevens.nl/actueel/boete-belastingdienst-voor-zwarte-lijst-fsv",
      },
    ],
  },
  {
    id: "netherlands-bailiff",
    name: { de: "Niederlande", en: "Netherlands" },
    year: 2024,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Tax authority" },
    lost: [],
    headline: {
      de: "Ein Vollstrecker der Steuerbehörde verkauft Halterdaten.",
      en: "A tax bailiff sells vehicle owner data.",
    },
    text: {
      de: "Ein Vollstreckungsbeamter der niederländischen Steuerbehörde fragte von 2020 bis 2022 außerhalb der Dienstzeit Kennzeichen samt Personendaten ab und verkaufte sie an Kriminelle. Kurz nach zweien seiner Abfragen wurde ein Fahrzeughalter nahe seiner Wohnung erschossen; einen direkten Zusammenhang konnte die Staatsanwaltschaft nicht nachweisen. 2024 wurde er zu drei Jahren Haft verurteilt.",
      en: "Between 2020 and 2022, a bailiff at the Dutch tax authority looked up licence plates with the owners’ personal data outside working hours and sold them to criminals. Shortly after two of his lookups, a vehicle owner was shot dead near his home; the prosecution could not establish a direct link. In 2024 he was sentenced to three years in prison.",
    },
    sources: [
      {
        label: {
          de: "Rechtbank Den Haag",
          en: "District Court of The Hague",
        },
        href: "https://uitspraken.rechtspraak.nl/details?id=ECLI:NL:RBDHA:2024:15487",
      },
      {
        label: {
          de: "Niederländische Staatsanwaltschaft",
          en: "Dutch Public Prosecution Service",
        },
        href: "https://www.om.nl/actueel/nieuws/2024/09/16/belastingambtenaar-verkocht-kentekens-aan-criminelen",
      },
    ],
  },
  {
    id: "netherlands-amsterdam",
    name: { de: "Niederlande", en: "Netherlands" },
    year: 2025,
    holders: ["authority"],
    kind: { de: "Stadtverwaltung", en: "City administration" },
    lost: ["identity"],
    headline: {
      de: "Der Vorwurf: Wohnadressen aus dem Melderegister verkauft.",
      en: "The charge: home addresses sold from the population register.",
    },
    text: {
      de: "Ein Mitarbeiter der Stadt Amsterdam soll 2024 und 2025 Namen und Wohnadressen aus dem Melderegister abgefragt und über Mittelsmänner an Kriminelle verkauft haben. Die Staatsanwaltschaft bringt mindestens 95 Gewalttaten mit seinen Abfragen in Verbindung, darunter 36 Sprengstoffanschläge, Schüsse auf Wohnungen und eine Entführung. Die Verteidigung bestreitet den Zusammenhang; das Urteil steht aus.",
      en: "An Amsterdam city employee is accused of looking up names and home addresses in the population register in 2024 and 2025 and selling them to criminals through middlemen. The prosecution links at least 95 violent incidents to his lookups, including 36 explosions, shootings at homes and a kidnapping. The defence disputes the link; the verdict is pending.",
    },
    sources: [
      {
        label: {
          de: "Niederländische Staatsanwaltschaft 2025",
          en: "Dutch Public Prosecution Service 2025",
        },
        href: "https://www.om.nl/actueel/nieuws/2025/05/12/amsterdamse-ambtenaar-aangehouden-wegens-corruptie-en-medeplichtigheid-aan-explosies",
      },
      {
        label: {
          de: "Niederländische Staatsanwaltschaft 2026",
          en: "Dutch Public Prosecution Service 2026",
        },
        href: "https://www.om.nl/actueel/agenda/2026/09/18/amsterdamse-ambtenaar-verdacht-van-corruptie-en-medeplichtigheid-aan-explosies",
      },
    ],
  },
  {
    id: "usa-irs-insider",
    name: same("USA"),
    year: 2016,
    holders: ["authority"],
    kind: { de: "Steuerbehörde", en: "Tax administration" },
    lost: [],
    headline: {
      de: "Eine Steuerbeamtin stiehlt Identitäten.",
      en: "A tax employee steals identities.",
    },
    text: {
      de: "Eine Mitarbeiterin der US-Steuerbehörde holte sich unbefugt Namen, Geburtsdaten und Sozialversicherungsnummern aus den Systemen. Ihre Gruppe reichte damit falsche Steuererklärungen ein, mit Hunderten Opfern und mehr als 400.000 Dollar ausgezahlten Rückzahlungen. 2016 wurde sie zu neun Jahren und zwei Monaten Haft verurteilt.",
      en: "An employee of the US tax authority took names, dates of birth and Social Security numbers from its systems without authorisation. Her group used them to file false tax returns, with hundreds of victims and more than 400,000 dollars in refunds paid out. In 2016 she was sentenced to nine years and two months in prison.",
    },
    sources: [
      {
        label: { de: "US-Justizministerium", en: "US Department of Justice" },
        href: "http://web.archive.org/web/20170106092616/https://www.justice.gov/usao-ndal/pr/irs-employee-sentenced-nine-years-and-two-months-prison-leading-1-million-id-theft-tax",
      },
    ],
  },
  {
    id: "austria-ersb",
    name: { de: "Österreich", en: "Austria" },
    year: 2020,
    holders: ["authority"],
    kind: { de: "Bundesregister", en: "Federal register" },
    lost: ["identity"],
    headline: {
      de: "Ein öffentliches Register mit Wohnadressen.",
      en: "A public register with home addresses.",
    },
    text: {
      de: "Das Ergänzungsregister für sonstige Betroffene zeigte online Namen, Geburtsdaten und Anschriften, für viele Selbstständige ihre Wohnadresse. Die Einträge stammten zu einem großen Teil aus der Finanzverwaltung, die Veröffentlichung war gesetzlich vorgesehen. Als der Härtefallfonds 2020 die Registernummer verlangte, wurde das breit bekannt. Seither ist das Register nicht mehr öffentlich.",
      en: "The Supplementary Register for Other Affected Parties showed names, dates of birth and postal addresses online; for many self-employed people that was their home address. Many of the entries came from the tax administration, and publication was required by law. When the Covid hardship fund asked for the register number in 2020, this became widely known. The register has not been public since.",
    },
    sources: [
      {
        label: {
          de: "Parlament, Anfragebeantwortung 2007/AB",
          en: "Parliament, answer 2007/AB",
        },
        href: "https://www.parlament.gv.at/dokument/XXVII/AB/2007/imfname_811807.pdf",
      },
      { label: same("ORF"), href: "https://orf.at/stories/3164870/" },
    ],
  },
  {
    id: "denmark-cpr",
    name: { de: "Dänemark", en: "Denmark" },
    year: 2026,
    holders: ["authority", "vendor"],
    kind: { de: "Personenregister", en: "Population register" },
    lost: ["identity"],
    headline: {
      de: "Das Personenregister, über den Zugang einer Firma.",
      en: "The population register, through a company’s access.",
    },
    text: {
      de: "Unbekannte missbrauchten den rechtmäßigen Suchzugang eines privaten Unternehmens zum dänischen Personenregister. Sie holten Namen, Anschriften und Personennummern von rund 8,8 Millionen Menschen, Lebenden, Ausgewanderten und Verstorbenen. Die Polizei ermittelt.",
      en: "Unknown parties misused a private company’s lawful search access to the Danish population register. They obtained names, postal addresses and personal ID numbers of around 8.8 million people, living, emigrated and dead. The police are investigating.",
    },
    sources: [
      {
        label: { de: "Dänisches Ministerium", en: "Danish ministry" },
        href: "https://via.ritzau.dk/pressemeddelelse/15205753/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger?lang=da",
      },
    ],
  },
  {
    id: "xplain",
    name: same("Xplain"),
    year: 2023,
    holders: ["vendor", "authority"],
    kind: {
      de: "IT-Dienstleister des Schweizer Bundes",
      en: "IT contractor of Swiss federal authorities",
    },
    lost: ["identity"],
    headline: {
      de: "Behördendaten beim IT-Dienstleister.",
      en: "Government data at the IT contractor.",
    },
    text: {
      de: "Eine Erpressergruppe stahl beim Softwarelieferanten mehrerer Schweizer Bundesämter Daten und veröffentlichte rund 1,3 Millionen Dateien. Rund 65.000 davon betrafen den Bund, 4.779 enthielten Personendaten, darunter Anschriften. Betroffen waren vor allem Justiz- und Polizeibehörden.",
      en: "A ransomware group stole data from a software supplier to several Swiss federal offices and published around 1.3 million files. Around 65,000 of them concerned the federal government, and 4,779 contained personal data, including postal addresses. Justice and police authorities were hit hardest.",
    },
    sources: [
      {
        label: {
          de: "Bundesamt für Cybersicherheit",
          en: "Swiss National Cyber Security Centre",
        },
        href: "https://www.bacs.admin.ch/en/2024-bericht-datenanalyse-en",
      },
      {
        label: { de: "Schweizer Bundesrat", en: "Swiss Federal Council" },
        href: "https://www.admin.ch/gov/en/start/documentation/media-releases.msg-id-100884.html",
      },
    ],
  },
  {
    id: "mixpanel",
    name: same("Mixpanel"),
    year: 2025,
    holders: ["vendor", "taxTool"],
    kind: {
      de: "Analysedienst von Krypto-Steuertools",
      en: "Analytics provider of crypto tax tools",
    },
    lost: [],
    headline: {
      de: "Nutzerdaten von Krypto-Steuertools beim Analysedienst.",
      en: "Crypto tax tool users’ data at the analytics provider.",
    },
    text: {
      de: "Über Phishing-SMS an Mitarbeiter gelangten Angreifer in den Analysedienst Mixpanel und exportierten Kundendaten. Betroffen waren unter anderem die Krypto-Steuertools CoinLedger und CoinTracker: E-Mail-Adressen, Namen, ungefährer Standort und bei CoinTracker etwa die Zahl der Transaktionen eines Jahres. Wallet-Adressen und Steuerformulare waren laut den Firmen nicht dabei.",
      en: "Through phishing text messages to staff, attackers got into the analytics service Mixpanel and exported customer data. Among those affected were the crypto tax tools CoinLedger and CoinTracker: email addresses, names, approximate location and, at CoinTracker, details such as a year’s transaction count. According to the companies, wallet addresses and tax forms were not included.",
    },
    sources: [
      {
        label: same("Mixpanel"),
        href: "https://web.archive.org/web/20251212035209/https://mixpanel.com/blog/sms-security-incident/",
      },
      {
        label: same("CoinLedger"),
        href: "https://help.coinledger.io/en/articles/12904021-notice-of-security-incident-involving-analytics-vendor",
      },
      {
        label: same("Protos"),
        href: "https://protos.com/openai-cointracker-user-data-leaked-after-third-party-hacked-via-sms/",
      },
    ],
  },
  {
    id: "cointracker",
    name: same("CoinTracker"),
    year: 2022,
    holders: ["taxTool", "vendor"],
    kind: { de: "Krypto-Steuertool", en: "Crypto tax tool" },
    lost: [],
    headline: {
      de: "E-Mail-Adressen über den Mailversand.",
      en: "Email addresses through its email provider.",
    },
    text: {
      de: "Über die Zugangsdaten eines Twilio-Mitarbeiters gelangten die E-Mail-Adressen von Nutzern des Krypto-Steuertools aus dessen Mailversand SendGrid in fremde Hände. Finanzdaten waren laut CoinTracker nicht betroffen. Das Unternehmen warnte seine Nutzer vor gezielten Angriffen.",
      en: "Through a Twilio employee’s credentials, the email addresses of users of the crypto tax tool fell into the wrong hands from its email service, SendGrid. According to CoinTracker, no financial data was exposed. The company warned its users of targeted attacks.",
    },
    sources: [
      {
        label: same("CoinTracker"),
        href: "https://web.archive.org/web/20240227061931/https://www.cointracker.io/blog/sendgrid-data-breach",
      },
    ],
  },
  {
    id: "brevo",
    name: same("Brevo"),
    year: 2026,
    holders: ["vendor", "provider", "taxTool"],
    kind: {
      de: "Newsletter-Dienst von Krypto-Firmen",
      en: "Newsletter service of crypto firms",
    },
    lost: [],
    headline: {
      de: "347.000 E-Mail-Adressen aus dem Trezor-Newsletter.",
      en: "347,000 email addresses from Trezor’s newsletter.",
    },
    text: {
      de: "Über eine Lücke in der Anmeldung drangen Angreifer in 138 Kundenkonten des Newsletter-Dienstes Brevo ein, exportierten aus 43 die Kontakte und verschickten aus sechs Phishing. Aus der Liste des Wallet-Herstellers Trezor gingen 347.149 E-Mail-Adressen verloren. Eine gefälschte Sicherheitswarnung an diese Liste führte zu einer App, die nach der Wallet-Sicherung fragte; rund 2.500 Menschen klickten. Laut Fachpresse waren auch BitBox und der Krypto-Steuerdienst CoinTracking betroffen.",
      en: "Through a login flaw, attackers got into 138 customer accounts at the newsletter service Brevo, exported contacts from 43 and sent phishing from six. 347,149 email addresses were taken from the list of the wallet maker Trezor. A fake security alert to that list led to an app that asked for the wallet backup; around 2,500 people clicked. According to the trade press, BitBox and the crypto tax service CoinTracking were also affected.",
    },
    sources: [
      {
        label: same("Brevo"),
        href: "https://status.brevo.com/incidents/01M266V1CZKJQNGZRNEGFD5CQE/write-up",
      },
      {
        label: same("Trezor"),
        href: "https://trezor.io/blog/news/security-incident-at-brevo-our-third-party-email-provider",
      },
      {
        label: same("Cointelegraph"),
        href: "https://cointelegraph.com/news/brevo-login-flaw-trezor-bitbox-cointracking-phishing",
      },
    ],
  },
  {
    id: "trezor-2024",
    name: same("Trezor"),
    year: 2024,
    holders: ["provider", "vendor"],
    kind: { de: "Hardware-Wallet-Hersteller", en: "Hardware wallet maker" },
    lost: [],
    headline: {
      de: "Supportanfragen als Phishing-Liste.",
      en: "Support contacts as a phishing list.",
    },
    text: {
      de: "Angreifer gelangten in das externe Support-Portal des Hardware-Wallet-Herstellers. Dort lagen Name oder Spitzname und E-Mail-Adresse von bis zu 66.000 Menschen, die seit Dezember 2021 den Support kontaktiert hatten. 41 von ihnen schrieben die Angreifer direkt an und fragten nach der Wiederherstellungsphrase.",
      en: "Attackers got into the hardware wallet maker’s third-party support portal. It held the name or nickname and email address of up to 66,000 people who had contacted support since December 2021. The attackers wrote to 41 of them directly, asking for their recovery phrase.",
    },
    sources: [
      {
        label: same("Trezor"),
        href: "https://web.archive.org/web/20250108012157/https://blog.trezor.io/trezor-security-update-stay-vigilant-against-potential-phishing-attack-bb05015a21f8",
      },
    ],
  },
  {
    id: "mailchimp",
    name: same("Mailchimp"),
    year: 2022,
    holders: ["vendor", "provider"],
    kind: { de: "Newsletter-Dienst", en: "Newsletter service" },
    lost: [],
    headline: {
      de: "Gezielt die Listen von Krypto-Firmen.",
      en: "Crypto firms’ lists, targeted.",
    },
    text: {
      de: "Angreifer erbeuteten über Wochen die Zugänge von Mitarbeitern des Newsletter-Dienstes Mailchimp und griffen gezielt die Listen von mehr als 200 Krypto- und Finanzfirmen ab. Beim Wallet-Hersteller Trezor gingen E-Mail-Adressen der Newsletter-Liste verloren, teils mit Namen. Danach folgten Phishing-Mails im Namen von Trezor.",
      en: "Over several weeks, attackers took over staff access at the newsletter service Mailchimp and targeted the lists of more than 200 crypto and finance firms. At the wallet maker Trezor, email addresses from the newsletter list were taken, some with names. Phishing emails in Trezor’s name followed.",
    },
    sources: [
      {
        label: same("Trezor"),
        href: "https://web.archive.org/web/20220414172735/https://blog.trezor.io/details-of-the-mailchimp-data-breach-a06872caa1fd",
      },
      {
        label: same("The Record"),
        href: "https://therecord.media/hacker-accessed-319-crypto-and-finance-related-mailchimp-accounts-company-said/",
      },
    ],
  },
  {
    id: "hubspot",
    name: same("HubSpot"),
    year: 2022,
    holders: ["vendor"],
    kind: {
      de: "Kundendatenbank von Krypto-Firmen",
      en: "Customer database of crypto firms",
    },
    lost: [],
    headline: {
      de: "Ein gezielter Angriff auf die Kryptobranche.",
      en: "A targeted attack on the crypto industry.",
    },
    text: {
      de: "Über einen getäuschten Mitarbeiter exportierte ein Angreifer beim Kundendatenbank-Anbieter HubSpot Kontaktdaten aus weniger als 30 Kundenkonten. HubSpot bestätigte einen gezielten Angriff auf Kunden aus der Kryptobranche. Laut Fachpresse waren unter anderen BlockFi, Swan Bitcoin und NYDIG betroffen und warnten ihre Kunden vor Phishing.",
      en: "Through a deceived employee, an attacker exported contact data from fewer than 30 customer accounts at the customer database provider HubSpot. HubSpot confirmed a targeted attack on customers in the crypto industry. According to the trade press, BlockFi, Swan Bitcoin and NYDIG were among those affected and warned their customers of phishing.",
    },
    sources: [
      {
        label: same("HubSpot"),
        href: "https://web.archive.org/web/20230111123057/https://www.hubspot.com/en-us/march-2022-security-incident",
      },
      {
        label: same("The Block"),
        href: "https://www.theblock.co/news/regulation/2022-03-20-crypto-blockfi-pantera-hubspot-security-data-138563",
      },
    ],
  },
  {
    id: "customer-io",
    name: same("Customer.io"),
    year: 2022,
    holders: ["vendor"],
    kind: {
      de: "E-Mail-Dienst von Krypto-Firmen",
      en: "Email service of crypto firms",
    },
    lost: [],
    headline: {
      de: "Ein Mitarbeiter gibt E-Mail-Adressen weiter.",
      en: "An employee hands over email addresses.",
    },
    text: {
      de: "Ein leitender Techniker des E-Mail-Dienstes Customer.io gab die E-Mail-Adressen von Nutzern des NFT-Marktplatzes OpenSea und von fünf weiteren Kunden an einen Angreifer weiter. Laut Fachpresse gehörte der Krypto-Verleiher Celsius dazu. Customer.io entließ den Mitarbeiter und zeigte ihn an.",
      en: "A senior engineer at the email service Customer.io handed the email addresses of users of the NFT marketplace OpenSea and of five other customers to an attacker. According to the trade press, the crypto lender Celsius was one of them. Customer.io fired the employee and reported him to law enforcement.",
    },
    sources: [
      {
        label: same("Customer.io"),
        href: "https://customer.io/learn/announcements/update-to-compromised-email-addresses-incident",
      },
      {
        label: same("The Block"),
        href: "https://www.theblock.co/news/regulation/2022-07-28-celsius-also-hit-by-costumer-io-email-data-breach-160148",
      },
    ],
  },
  {
    id: "gemini-2022",
    name: same("Gemini"),
    year: 2022,
    holders: ["provider", "vendor"],
    kind: { de: "Börse", en: "Exchange" },
    lost: [],
    headline: {
      de: "Kundendaten beim Dienstleister, danach Phishing.",
      en: "Customer data at a vendor, then phishing.",
    },
    text: {
      de: "Bei einem Dienstleister der Krypto-Börse Gemini sammelten Angreifer E-Mail-Adressen und Teile der Telefonnummern von Kunden. Darauf folgten Phishing-Kampagnen gegen diese Kunden. Die Systeme und Konten von Gemini selbst waren laut Gemini nicht betroffen.",
      en: "At a vendor of the crypto exchange Gemini, attackers collected customers’ email addresses and partial phone numbers. Phishing campaigns against those customers followed. According to Gemini, its own systems and accounts were not affected.",
    },
    sources: [
      {
        label: same("Gemini"),
        href: "https://www.gemini.com/blog/protecting-our-customers-from-phishing-campaigns",
      },
    ],
  },
  {
    id: "gemini-2024",
    name: same("Gemini"),
    year: 2024,
    holders: ["vendor", "provider"],
    kind: { de: "Börse", en: "Exchange" },
    lost: [],
    headline: {
      de: "Bankverbindungen beim Zahlungsdienstleister.",
      en: "Bank details at the payment processor.",
    },
    text: {
      de: "Bei einem Dienstleister der Bank, über die die Krypto-Börse Gemini Überweisungen abwickelt, lagen Anfang Juni 2024 Namen und Bankkontonummern von Gemini-Kunden offen. Gemini meldete den Vorfall der Generalstaatsanwaltschaft Kaliforniens.",
      en: "At a service provider of the bank that handles transfers for the crypto exchange Gemini, names and bank account numbers of Gemini customers were exposed in early June 2024. Gemini reported the incident to the California Attorney General.",
    },
    sources: [
      {
        label: {
          de: "Gemini (Meldung in Kalifornien)",
          en: "Gemini (California filing)",
        },
        href: "https://oag.ca.gov/system/files/2024-6-25_Gemini%20Notification%20Email.pdf",
      },
    ],
  },
  {
    id: "coinbase-2021",
    name: same("Coinbase"),
    year: 2021,
    holders: ["provider"],
    kind: { de: "Börse", en: "Exchange" },
    lost: ["identity", "holdings"],
    headline: {
      de: "Konten übernommen, Guthaben abgezogen.",
      en: "Accounts taken over, funds drained.",
    },
    text: {
      de: "Mit E-Mail-Adresse, Passwort und Telefonnummer, die laut Coinbase aus Phishing stammten, und einer Lücke in der Kontowiederherstellung per SMS übernahmen Angreifer die Konten von mindestens 6.000 Kunden. Dort sahen sie Name, Wohnadresse, Kontostände und Transaktionen und zogen Guthaben ab. Coinbase erstattete die Verluste.",
      en: "Using email addresses, passwords and phone numbers that Coinbase says came from phishing, and a flaw in its SMS account recovery, attackers took over the accounts of at least 6,000 customers. There they saw name, home address, balances and transactions, and drained funds. Coinbase reimbursed the losses.",
    },
    sources: [
      {
        label: {
          de: "Coinbase (Meldung in Kalifornien)",
          en: "Coinbase (California filing)",
        },
        href: "https://oag.ca.gov/system/files/09-24-2021%20Customer%20Notification.pdf",
      },
    ],
  },
  {
    id: "blockfi",
    name: same("BlockFi"),
    year: 2020,
    holders: ["provider"],
    kind: { de: "Krypto-Verleiher", en: "Crypto lender" },
    lost: ["identity", "holdings"],
    headline: {
      de: "Über das Handy eines Mitarbeiters an die Kundendaten.",
      en: "Into customer data through an employee’s phone.",
    },
    text: {
      de: "Über die gekaperte Handynummer eines Mitarbeiters gelangte ein Angreifer in die interne Verwaltung des Krypto-Verleihers und sah Namen, Anschriften, Geburtsdaten und Kontobewegungen von Kunden. Seine Versuche, Guthaben abzuziehen, scheiterten.",
      en: "Through an employee’s hijacked phone number, an attacker got into the crypto lender’s back office and saw customers’ names, postal addresses, dates of birth and account activity. His attempts to withdraw funds failed.",
    },
    sources: [
      {
        label: same("BlockFi"),
        href: "https://web.archive.org/web/20201207231242/https://blockfi.com/wp-content/uploads/2020/05/Incident-Report-05-14-20.pdf",
      },
    ],
  },
  {
    id: "bits-of-gold",
    name: same("Bits of Gold"),
    year: 2026,
    holders: ["provider"],
    kind: { de: "Krypto-Broker", en: "Crypto broker" },
    lost: ["wallet"],
    headline: {
      de: "Wallet-Adressen mit Namen und Ausweisnummer.",
      en: "Wallet addresses with name and ID number.",
    },
    text: {
      de: "Beim israelischen Krypto-Broker gelangten Unbekannte in ein internes Analysesystem. Betroffen waren Namen, Ausweisnummern, E-Mail-Adressen, Telefonnummern, Bankverbindungen und Wallet-Adressen der Kunden. Ausweisbilder, Passwörter und private Schlüssel waren laut dem Unternehmen nicht dabei.",
      en: "At the Israeli crypto broker, unknown parties got into an internal analytics system. Customers’ names, ID numbers, email addresses, phone numbers, bank details and wallet addresses were affected. According to the company, ID images, passwords and private keys were not.",
    },
    sources: [
      {
        label: same("Bits of Gold"),
        href: "https://blog.bitsofgold.co.il/security-update-august-26/",
      },
      {
        label: same("Calcalist"),
        href: "https://www.calcalistech.com/ctechnews/article/v90cccn73",
      },
    ],
  },
]

export const featuredLeaks = leaks.filter((leak) => leak.featured)

// Newest first; cases without a single year go last.
export const newestLeaksFirst = [...leaks].sort(
  (a, b) => (b.year ?? 0) - (a.year ?? 0),
)

// The dossier's case list reads "Ledger · 2020" above the headline.
export const asCase = (leak: Leak, language: Language) => ({
  dateline: [leak.name[language], leak.year].filter(Boolean).join(" · "),
  title: leak.headline[language],
  text: leak.text[language],
  sources: leak.sources.map((source) => ({
    label: source.label[language],
    href: source.href,
  })),
})
