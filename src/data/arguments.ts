import type { Language } from "@/lib/i18n"

// Why we oppose DAC8, told in the order of the press briefing of October 2026:
// reasons, objections with our answers, demands. The lists will change, so
// no page names how many there are. The press
// and the site must say the same, so change a reason here and in the
// briefing together. The arguments page shows each reason as a headline and
// one sentence; the evidence sits behind a disclosure with its sources. The
// letter to members of the National Council takes its demands from here.
//
// This page owns the why. What is reported, what stays with the provider and
// for how long is set out in the dossier; restate a fact here only where a
// reason rests on it, and only with a primary source. The wording restates
// vetted texts, including the campaign lawyer's notes on what the
// anti-money-laundering rules already require, so change claims in both
// languages together. Never word it so that wallet addresses seem reported,
// and keep the danger on the data, never on bitcoin or self-custody.

export type Source = { href: string; label: string }

type ReasonText = {
  // The reason's name: a claim a reader can repeat, close to the title of
  // its talking point in the press briefing. It stands above the headline
  // and, with the same number, in the overview in the hero.
  short: string
  title: string
  // One sentence, two at most: the reason in plain words.
  text: string
  // The evidence behind the disclosure, one paragraph per entry.
  proof: string[]
  sources: Source[]
}

export type Reason = {
  // Stable anchor for press links, such as /argumente/#zielliste.
  id: string
  // Anchors of the page before October 2026 that other pages and shared
  // links still use: `alias` sits on the headline, `proofId` on the
  // evidence, which opens when the address points to it.
  alias?: string
  proofId?: string
  // The one link of the reasons, to the map of documented attacks.
  attacks?: true
} & Record<Language, ReasonText>

const section20 =
  "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273819/NOR40273819.pdf"
const amlRetention =
  "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009769"
const fractal =
  "http://web.archive.org/web/20240726003733/https://web.fractal.id/fractal-id-data-breach-post-mortem/"
const paymentStudy = "https://petsymposium.org/popets/2018/popets-2018-0038.php"
const waltio =
  "https://help.waltio.com/en/articles/13482134-questions-answers-security-incident"
const gendarmerie =
  "https://www.gendarmerie.interieur.gouv.fr/gendinfo/terrain/immersion/2026/la-strategie-de-la-gendarmerie-face-aux-cryptorapts-partie-2-2"
// Federal government's answer on account lookups, with figures per authority
// since 2005. It warns that 2005 and 2023 totals are not comparable because
// the counting changed, so compare users, not totals.
const accountLookups = "https://dserver.bundestag.de/btd/20/108/2010841.pdf"
const transferRegulation = "https://eur-lex.europa.eu/eli/reg/2023/1113/oj"
const accountRegistries = "https://eur-lex.europa.eu/eli/dir/2024/1640/oj"

export const reasons: Reason[] = [
  {
    id: "bargeld",
    alias: "verdacht",
    de: {
      short: "Gemeldet wird auch, was keine Steuer auslöst",
      title:
        "Stell dir vor, deine Bank meldet dem Finanzamt jedes Jahr, wie viel Bargeld du abgehoben hast.",
      text: "Bei Bitcoin verlangt DAC8 genau das: Hebst du Bitcoin von der Börse ab, um sie selbst zu verwahren, steht die Jahressumme in der Regel in der Meldung, obwohl das für sich genommen keine Steuer auslöst.",
      proof: [
        "Der Anbieter muss die Meldedaten für alle Kunden aufbereiten, bevor feststeht, wer überhaupt gemeldet wird. Damit geht Österreich über die EU-Richtlinie hinaus.",
        "Die Wallet-Adresse, gleichsam die Kontonummer deiner Wallet, steht nicht in der Meldung, nur die Summe. Gelangt so eine Meldung in falsche Hände, zeigt sie trotzdem, wer vermutlich Erspartes selbst verwahrt.",
      ],
      sources: [{ href: section20, label: "§ 20 Abs. 1 Krypto-MPfG" }],
    },
    en: {
      short: "Reported even when no tax is due",
      title:
        "Imagine your bank telling the tax authority every year how much cash you withdrew.",
      text: "For bitcoin, DAC8 requires exactly that: withdraw bitcoin from an exchange to keep it yourself, and the annual total usually appears in the report, although the transfer triggers no tax by itself.",
      proof: [
        "Providers must prepare reporting data for all customers before it is clear who will be reported at all. Here Austria goes beyond the EU directive.",
        "The wallet address, in effect your wallet’s account number, is not in the report, only the total. In the wrong hands, such a report still shows who probably keeps savings in self-custody.",
      ],
      sources: [{ href: section20, label: "Section 20(1) Krypto-MPfG" }],
    },
  },
  {
    id: "selbstverwahrung",
    de: {
      short: "Bitcoin selbst verwahren ist legitim",
      title: "Bitcoin in der eigenen Wallet ist wie Bargeld daheim.",
      text: "Diese Selbstverwahrung verteidigen wir. Gefährlich wird es wie beim Bargeld erst, wenn andere erfahren, wer vermutlich wie viel hat.",
      proof: [
        "Eine Wallet ist eine App oder ein Gerät mit den Schlüsseln zu deinen Bitcoin. Wer die Schlüssel hat, kann sie übertragen, ohne dass jemand zustimmen muss, wie beim Bargeld. Das zieht Kriminelle an, aus der Ferne ebenso wie vor Ort.",
        "Darum sollte niemand wissen, wer wie viel besitzt. Wir kritisieren Datenbestände, die Menschen identifizieren, nicht die eigene Wallet.",
      ],
      sources: [],
    },
    en: {
      short: "Holding your own bitcoin is legitimate",
      title: "Bitcoin in your own wallet is like cash at home.",
      text: "We defend this self-custody. As with cash, the danger starts when others learn who probably holds how much.",
      proof: [
        "A wallet is an app or device that holds the keys to your bitcoin. Whoever has the keys can move it without anyone’s approval, just like cash. That draws criminals, from far away as well as in person.",
        "That is why nobody should know who holds how much. We criticise data stores that identify people, not your own wallet.",
      ],
      sources: [],
    },
  },
  {
    id: "pseudonym",
    proofId: "zahlungsprofile",
    de: {
      short: "Pseudonym ist nicht anonym",
      title: "Die Blockchain zeigt Zahlungen, aber keine Namen.",
      text: "Sie stehen öffentlich unter Wallet-Adressen, einer Art Kontonummer. Verrät ein Datenleck, welche davon dir gehören, lassen sich dir auch ihre früheren Zahlungen und ihr Bestand zuordnen.",
      proof: [
        "Wer diese Zuordnung einmal hat, behält sie: Aus pseudonymen Daten wird ein persönliches Finanzprofil. Ein einzelnes Datenleck kann schon beides enthalten. Beim Identifizierungsdienst Fractal ID lagen Ausweis, Wohnadresse und Wallet-Adresse in einem Datensatz.",
        "Ist eine Wallet-Adresse einmal einem Namen zugeordnet, lassen ihre Zahlungen mit Angaben über die Empfänger Rückschlüsse auf Einkäufe, Spenden und Beziehungen zu.",
      ],
      sources: [
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
      ],
    },
    en: {
      short: "Pseudonymous is not anonymous",
      title: "The blockchain shows payments, but no names.",
      text: "They appear publicly under wallet addresses, a kind of account number. If a data breach reveals which ones are yours, their past payments and holdings can be traced to you as well.",
      proof: [
        "Whoever has that link keeps it: pseudonymous data becomes a personal financial profile. A single breach can already hold both. At the identity verification service Fractal ID, ID documents, home addresses and wallet addresses sat in one record.",
        "Once a wallet address is tied to a name, its payments, together with information about the recipients, reveal purchases, donations and relationships.",
      ],
      sources: [
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
      ],
    },
  },
  {
    id: "akte",
    alias: "speicherdauer",
    proofId: "verknuepfung",
    de: {
      short: "Jede Jahresmeldung bleibt zehn Jahre",
      title: "Mit jedem Jahr wird die Akte dicker.",
      text: "Bleibst du Kunde, liegen ab 2036 laufend zehn Jahresmeldungen beim Anbieter. So wächst ein Honeypot, ein Datenbestand, der Angreifer umso mehr anzieht, je mehr darin liegt.",
      proof: [
        "Der Anbieter löscht jede Jahresmeldung erst zehn Jahre nach ihrem Meldejahr. Für Meldungen über Bankkonten gelten fünf Jahre.",
        "Daneben bewahrt der Anbieter nach den Geldwäschevorschriften Ausweis, Wallet-Adressen und einzelne Transaktionen auf, derzeit bis zehn Jahre nach Ende der Kundenbeziehung. Für DAC8 kommen Steuernummer und Steuerwohnsitz dazu. Beim Finanzamt laufen die Jahresmeldungen aller Anbieter zusammen, bei denen du Kunde bist.",
        "Entscheidend ist das Gesamtbild: Meldungen über mehrere Anbieter und Jahre, das Datenleck eines Steuertools und zuordenbare Blockchain-Daten können zusammen ein weitreichendes Profil von Vermögen und Aktivität ergeben.",
      ],
      sources: [
        { href: section20, label: "§ 20 Abs. 4 Krypto-MPfG" },
        { href: amlRetention, label: "§ 21 FM-GwG" },
      ],
    },
    en: {
      short: "Each annual report is kept ten years",
      title: "Every year, the file grows thicker.",
      text: "If you remain a customer, from 2036 ten annual reports will always be on file. That builds a honeypot, a data store that draws more attackers the more it holds.",
      proof: [
        "The provider deletes each annual report only ten years after its reporting year. For reports on bank accounts, the period is five years.",
        "Under anti-money-laundering rules, the provider also keeps your ID, wallet addresses and individual transactions, currently until ten years after the relationship ends. For DAC8, it adds your tax identification number and tax residence. At the tax authority, the annual reports from every provider you use come together.",
        "What matters is the overall picture: reports across several providers and years, a breach at a tax tool and attributable blockchain data can together add up to a far-reaching profile of wealth and activity.",
      ],
      sources: [
        { href: section20, label: "Section 20(4) Krypto-MPfG" },
        { href: amlRetention, label: "Section 21 FM-GwG" },
      ],
    },
  },
  {
    id: "zielliste",
    alias: "sicherheit",
    attacks: true,
    de: {
      short: "Daten verraten, bei wem etwas zu holen ist",
      title: "Aus Datenlecks werden Ziellisten.",
      text: "Schon der Verdacht auf Krypto-Vermögen kann Überfälle und Entführungen auslösen, ob der vermutete Bestand stimmt oder nicht. Daten bei Anbietern, Dienstleistern und Behörden können Tätern dafür Ansatzpunkte liefern.",
      proof: [
        "Aus Summe und Anzahl der Käufe und Übertragungen lässt sich grob schätzen, wie viel jemand bewegt. Die Schätzung kann weit danebenliegen, weil dasselbe Geld mehrfach zählen kann. Wer die Daten erbeutet, filtert trotzdem Menschen heraus, die vermögend wirken.",
        "Beim französischen Krypto-Steuerdienst Waltio gelangten E-Mail-Adressen, Gewinne und Verluste sowie Jahresendbestände der Kunden in fremde Hände. Laut Gendarmerie wählen Täter damit Opfer für Gewalttaten aus und irren sich dabei teils über deren tatsächliche Bestände.",
      ],
      sources: [
        { href: waltio, label: "Waltio" },
        { href: gendarmerie, label: "Gendarmerie nationale" },
      ],
    },
    en: {
      short: "Data shows where there is something to take",
      title: "Data breaches turn into target lists.",
      text: "Suspected crypto wealth alone can lead to robberies and kidnappings, whether the presumed holdings are real or not. Data held by providers, service providers and authorities can give offenders a starting point.",
      proof: [
        "Totals and counts of purchases and transfers give a rough estimate of how much someone moves. The estimate can be far off, because the same money can count more than once. Anyone who gets hold of the data still singles out people who appear wealthy.",
        "At the French crypto tax service Waltio, customers’ email addresses, gains and losses and year-end balances fell into the wrong hands. According to the Gendarmerie, criminals use the data to select victims of violent crime, sometimes misjudging what they actually hold.",
      ],
      sources: [
        { href: waltio, label: "Waltio" },
        { href: gendarmerie, label: "Gendarmerie nationale" },
      ],
    },
  },
  {
    id: "alle",
    de: {
      short: "Privatsphäre betrifft alle",
      title:
        "Niemand muss reich sein, um finanzielle Privatsphäre zu brauchen.",
      text: "Beim Anbieter liegen auch einzelne Transaktionen. Aus ihnen lässt sich ablesen, wem du spendest, wo du Mitglied bist und wen du unterstützt.",
      proof: [
        "Bei jeder Übertragung erfasst der Anbieter nach der EU-Geldtransferverordnung Absender und Empfänger. Die Geldwäschevorschriften verlangen, diese Aufzeichnungen bei allen Kunden aufzubewahren, ohne Verdacht und derzeit bis zehn Jahre nach Ende der Kundenbeziehung.",
      ],
      sources: [
        { href: transferRegulation, label: "Verordnung (EU) 2023/1113" },
        { href: amlRetention, label: "§ 21 FM-GwG" },
      ],
    },
    en: {
      short: "Privacy concerns everyone",
      title: "Nobody has to be rich to need financial privacy.",
      text: "The provider also holds individual transactions. They show whom you donate to, where you are a member and whom you support.",
      proof: [
        "With every transfer, the provider records the sender and recipient under the EU transfer of funds regulation. Anti-money-laundering rules require it to keep these records for every customer, without suspicion, currently for up to ten years after the relationship ends.",
      ],
      sources: [
        { href: transferRegulation, label: "Regulation (EU) 2023/1113" },
        { href: amlRetention, label: "Section 21 FM-GwG" },
      ],
    },
  },
  {
    id: "zweck",
    alias: "ausbau",
    de: {
      short: "Finanzielle Überwachung braucht Grenzen",
      title: "Was gesammelt ist, wird für mehr genutzt.",
      text: "Laut Richtlinie dürfen die Daten auch für Zoll, gegen Geldwäsche und für EU-Sanktionen verwendet werden. Wir lassen prüfen, ob mildere Mittel genügen, und wollen finanzielle Überwachung begrenzen, bevor sie weiter wächst.",
      proof: [
        "Wie so etwas wächst, zeigt Deutschland: Seit 2005 dürfen Finanzämter und Sozialbehörden abfragen, wer welche Konten hat. 2013 kamen Gerichtsvollzieher dazu, 2023 fragten sie 844.427 Mal ab.",
        "DAC8 ist ein Baustein unter mehreren: Den Ausweis prüft der Anbieter schon bei der Kontoeröffnung, Absender und Empfänger erfasst er bei jeder Übertragung. Bis 2029 werden die Kontenregister EU-weit vernetzt; sie erfassen dann auch Krypto-Konten.",
      ],
      sources: [
        { href: accountLookups, label: "BT-Drucksache 20/10841" },
        { href: accountRegistries, label: "Richtlinie (EU) 2024/1640" },
      ],
    },
    en: {
      short: "Financial surveillance needs limits",
      title: "What is collected gets used for more.",
      text: "Under the directive, the data may also be used for customs, against money laundering and for EU sanctions. We are seeking a review of whether milder means would do, and we want to limit financial surveillance before it grows further.",
      proof: [
        "Germany shows how such uses grow: since 2005, tax offices and social benefit agencies may look up who holds which bank accounts. Bailiffs were added in 2013, and in 2023 they ran 844,427 lookups.",
        "DAC8 is one building block among several: the provider checks your ID when you open the account and records the sender and recipient of every transfer. By 2029, account registries will be connected across the EU and will then also cover crypto-asset accounts.",
      ],
      sources: [
        { href: accountLookups, label: "Bundestag paper 20/10841" },
        { href: accountRegistries, label: "Directive (EU) 2024/1640" },
      ],
    },
  },
]

export type Point = {
  title: string
  text: string
  source?: Source
}

// What we hear most often, in quotation marks, with our answer. Only claims
// the site already makes elsewhere; no tax facts specific to one country.
export const objections: Record<Language, Point[]> = {
  de: [
    {
      title: "„Ich habe nichts zu verbergen.“",
      text: "Privatsphäre braucht keine Rechtfertigung, staatliche Eingriffe schon. Deine Bank kennt deinen Kontostand, deine Ärztin deine Diagnose. Privatsphäre heißt, dass Regeln festlegen, wer sonst davon erfährt, wofür und wie lange.",
    },
    {
      title: "„Es geht doch um Steuergerechtigkeit.“",
      text: "Steuern zahlen soll jeder, das bestreiten wir nicht. Aber auch dafür darf der Staat nur so viele Daten verlangen und so lange speichern, wie er begründen kann.",
    },
    {
      title: "„Ich nutze nur meine eigene Wallet.“",
      text: "Solange du nie über einen Anbieter kaufst oder verkaufst, meldet DAC8 dich nicht. Hast du dort gekauft und auf deine Wallet übertragen, steht die Jahressumme in der Regel in der Meldung, ohne Wallet-Adresse.",
    },
    {
      title: "„Dann kauf halt nicht über eine Börse.“",
      text: "Für die meisten ist eine Börse, ein Broker oder eine App der einfachste Weg zu Bitcoin. Privatsphäre, die man nur behält, wenn man auf diesen Weg verzichtet, schützt niemanden. Der Schutz muss im Gesetz stehen.",
    },
  ],
  en: [
    {
      title: "“I have nothing to hide.”",
      text: "Privacy needs no justification; state interference does. Your bank knows your balance, your doctor your diagnosis. Privacy means that rules decide who else learns it, for what, and for how long.",
    },
    {
      title: "“It’s about tax fairness.”",
      text: "Everyone should pay their taxes; we do not dispute that. But even for that, the state may only demand as much data, and keep it as long, as it can justify.",
    },
    {
      title: "“I only use my own wallet.”",
      text: "As long as you never buy or sell through a provider, DAC8 does not report you. If you bought there and transferred to your wallet, the annual total usually appears in the report, without the wallet address.",
    },
    {
      title: "“Then don’t buy through an exchange.”",
      text: "For most people, an exchange, broker or app is the easiest way to buy bitcoin. Privacy you only keep by avoiding that route protects nobody. The protection has to be in the law.",
    },
  ],
}

// The page shows title and text; the letter uses `letter` where the page
// wording addresses the reader or leans on the page around it, and title and
// text joined otherwise.
export type Demand = { title: string; text: string; letter?: string }

export const demands: Record<Language, Demand[]> = {
  de: [
    {
      title: "Keine Daten auf Vorrat.",
      text: "Erst klären, wessen Daten gemeldet werden müssen, statt sie für alle Kunden aufzubereiten.",
    },
    {
      title: "Übertragungen auf die eigene Wallet nicht melden.",
      text: "Sie lösen für sich genommen keine Steuer aus, verraten nach einem Datenleck aber, wer vermutlich wie viel Bitcoin daheim hat.",
      letter:
        "Übertragungen auf die eigene Wallet nicht melden. Sie lösen für sich genommen keine Steuer aus. Sie trotzdem zu melden ist, als würde die Bank dem Finanzamt sagen, wie viel Bargeld jemand nach Hause getragen hat. Nach einem Datenleck steht dann auf einer Liste, wer vermutlich wie viel Bitcoin daheim hat.",
    },
    {
      title: "Nur erheben, was die Steuer braucht.",
      text: "Der zusätzliche Nutzen von Stückzahlen und Transaktionszahlen muss belegt werden.",
    },
    {
      title: "Kürzer speichern.",
      text: "Für Meldungen über Bankkonten gelten fünf Jahre. Zehn Jahre muss der Staat begründen.",
      letter:
        "Kürzer speichern. Für Meldungen über Bankkonten gelten fünf Jahre; zehn Jahre brauchen eine nachvollziehbare Begründung.",
    },
    {
      title: "Zugriff begrenzen, Rechte sichern.",
      text: "Für jeden Zweck eine klare Grenze, Zugriffe nachvollziehbar und unabhängig kontrolliert. Du musst Auskunft erhalten, Fehler korrigieren und unrechtmäßig gespeicherte Daten bei allen Empfängern löschen lassen können. Nutzen und Risiken gehören regelmäßig und öffentlich überprüft.",
      letter:
        "Zweck, Zugriff und Weitergabe eng begrenzen und unabhängig kontrollieren. Die Rechte der Betroffenen müssen praktisch funktionieren: Auskunft, Korrektur und Löschung unrechtmäßig gespeicherter Daten bei allen Empfängern. Nutzen und Risiken regelmäßig und öffentlich überprüfen, damit unnötige Eingriffe beendet werden.",
    },
  ],
  en: [
    {
      title: "No stockpiling of data.",
      text: "Determine first whose data must be reported, instead of preparing it for all customers.",
    },
    {
      title: "Do not report transfers to your own wallet.",
      text: "They trigger no tax by themselves, yet after a breach they reveal who probably keeps how much bitcoin at home.",
      letter:
        "Do not report transfers to your own wallet. They trigger no tax by themselves. Reporting their total is like a bank telling the tax authority how much cash someone has carried home. After a breach, it becomes a list of who probably keeps how much bitcoin at home.",
    },
    {
      title: "Collect only what taxation needs.",
      text: "The additional value of units and transaction counts must be demonstrated.",
    },
    {
      title: "Keep data for less time.",
      text: "For reports on bank accounts, the period is five years. The state must justify ten.",
      letter:
        "Keep data for less time. For reports on bank accounts, the period is five years; ten years needs a clear justification.",
    },
    {
      title: "Limit access, secure rights.",
      text: "A clear limit for each purpose, with traceable access and independent oversight. You must be able to access your data, correct errors and have unlawfully stored data deleted by every recipient. Benefits and risks need regular, public review.",
      letter:
        "Strictly limit purpose, access and onward disclosure, with independent oversight. The rights of those affected must work in practice: access, correction and deletion of unlawfully stored data by every recipient. Independently review benefits and risks, regularly and publicly, so unnecessary intrusions can be ended.",
    },
  ],
}

export const letterDemands = (language: Language) =>
  demands[language].map(
    (demand) => demand.letter ?? `${demand.title} ${demand.text}`,
  )
