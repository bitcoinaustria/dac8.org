import type { Language } from "@/lib/i18n"

// Documented leaks in which lost or misused data made the harm possible.
// Cases without that link do not belong here. This is the only copy: the
// leak page lists every case, the dossier and the home page's matrix show
// the featured ones. Add new cases here, in both languages and with primary
// sources; the newest come first on the leak page by year.

// The columns are the pieces a provider holds together for DAC8. Mark a
// field only when a source says it was lost.
export type Field = "identity" | "document" | "wallet" | "holdings"

// Who lost the data: a company the customer dealt with, or the state.
export type Holder = "provider" | "authority"

export interface Leak {
  id: string
  name: Record<Language, string>
  // Left out where the case spans years and no single one fits.
  year?: number
  holder: Holder
  kind: Record<Language, string>
  lost: Field[]
  headline: Record<Language, string>
  text: Record<Language, string>
  // One short line for the matrix.
  then: Record<Language, string>
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
  { id: "provider", label: { de: "Unternehmen", en: "Companies" } },
  { id: "authority", label: { de: "Behörden", en: "Authorities" } },
]

export const leaks: Leak[] = [
  {
    id: "ledger",
    name: same("Ledger"),
    year: 2020,
    holder: "provider",
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
    holder: "provider",
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
    holder: "provider",
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
    holder: "provider",
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
    holder: "provider",
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
    holder: "authority",
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
    holder: "authority",
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
    holder: "authority",
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
