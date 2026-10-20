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
  // Two reasons link out, each to the page that shows its proof: the map
  // of documented attacks and the history of the directive's growth.
  attacks?: true
  history?: true
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
// Section 5.1: donations, union fees and medical bills as payments that
// reveal sensitive data. It concerns detailed payment data, which the
// provider holds and the annual report does not carry.
const paymentGuidelines =
  "https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202006_psd2_afterpublicconsultation_en.pdf"
const financialAbuse =
  "https://www.fca.org.uk/news/blogs/hidden-cost-domestic-financial-abuse-working-together-improve-outcomes"
// Record linkage: false links between people who share identifiers, and an
// audit of England's hospital linkage that found false and missed matches.
const linkageGuidance =
  "https://www.gov.uk/government/publications/joined-up-data-in-government-the-future-of-data-linking-methods/quality-assessment-in-data-linkage"
const linkageAudit = "https://pmc.ncbi.nlm.nih.gov/articles/PMC4550723/"
// A randomised study measured comfort and choices right after reading about
// surveillance, not lasting silence; keep the claim that narrow.
const chillingStudy = "https://academic.oup.com/joc/article/76/4/277/8667253"
const membershipCase =
  "https://tile.loc.gov/storage-services/service/ll/usrep/usrep357/usrep357449/usrep357449.pdf"
// Church Committee, Book II, summary of findings (PDF page 22): IRS files
// and political tax investigations, tax data passed to FBI and CIA.
const taxMisuse =
  "https://donohueintellaw.ll.georgetown.edu/sites/default/files/assets/94755_II.pdf#page=22"
// Bribed support staff took data from systems they were allowed to use.
const coinbaseIncident =
  "https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/coin-20250514.htm"

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
        "Der Anbieter muss die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden. Damit geht Österreich über die EU-Richtlinie hinaus.",
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
        "Providers must prepare reporting data for all customers, including those who are never reported. Here Austria goes beyond the EU directive.",
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
        "Ein Profil ist kein Beweis, denn auch die Zuordnung kann falsch sein. Teilen zwei Menschen Merkmale wie den Namen, verknüpft ein Abgleich womöglich ihre Daten, als gehörten sie einer Person, heißt es in einer Methodenanleitung der britischen Regierung. In einer Prüfung englischer Krankenhausdaten hielt ein landesweit genutztes Verfahren verschiedene Patienten für dieselbe Person und trennte die Daten anderer, die zusammengehörten. Wer nach einem solchen Profil beurteilt wird, muss Fehler finden und berichtigen können.",
      ],
      sources: [
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
        { href: linkageGuidance, label: "Doidge et al. 2021" },
        { href: linkageAudit, label: "Hagger-Johnson et al. 2015" },
      ],
    },
    en: {
      short: "Pseudonymous is not anonymous",
      title: "The blockchain shows payments, but no names.",
      text: "They appear publicly under wallet addresses, a kind of account number. If a data breach reveals which ones are yours, their past payments and holdings can be traced to you as well.",
      proof: [
        "Whoever has that link keeps it: pseudonymous data becomes a personal financial profile. A single breach can already hold both. At the identity verification service Fractal ID, ID documents, home addresses and wallet addresses sat in one record.",
        "Once a wallet address is tied to a name, its payments, together with information about the recipients, reveal purchases, donations and relationships.",
        "A profile is not proof, because the link itself can be wrong. When two people share identifiers such as a name, matching can join their records as if they belonged to one person, a UK government methods guide warns. In a check of English hospital data, a method used nationwide took different patients for the same person and split the records of others that belonged together. Anyone judged by such a profile must be able to find and correct errors.",
      ],
      sources: [
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
        { href: linkageGuidance, label: "Doidge et al. 2021" },
        { href: linkageAudit, label: "Hagger-Johnson et al. 2015" },
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
        "Entscheidend ist das Gesamtbild: Meldungen über mehrere Anbieter und Jahre, das Datenleck eines Steuertools und zuordenbare Blockchain-Daten können zusammen ein Profil von Aktivität und vermutetem Vermögen ergeben.",
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
        "What matters is the overall picture: reports across several providers and years, a breach at a tax tool and attributable blockchain data can together add up to a profile of activity and presumed wealth.",
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
      text: "Beim Anbieter liegen auch einzelne Transaktionen. Aus ihnen kann hervorgehen, wem du spendest, wo du Mitglied bist und welche Hilfe du suchst.",
      proof: [
        "Bei jeder Übertragung erfasst der Anbieter nach der EU-Geldtransferverordnung Absender und Empfänger. Die Geldwäschevorschriften verlangen, diese Aufzeichnungen bei allen Kunden aufzubewahren, ohne Verdacht und derzeit bis zehn Jahre nach Ende der Kundenbeziehung.",
        "Die europäischen Datenschutzbehörden warnen, dass schon einzelne Zahlungen viel verraten: Spenden etwa politische oder religiöse Überzeugungen, Mitgliedsbeiträge die Gewerkschaft, Arztrechnungen die Gesundheit. In der Jahresmeldung stehen davon nur Jahressummen, beim Anbieter liegt jede einzelne Zahlung.",
        "Hilfe braucht Vertraulichkeit. Wer mit einem Partner lebt, der das Geld kontrolliert, braucht einen sicheren Weg, Hilfe zu suchen und über eigenes Geld zu verfügen. Die britische Finanzaufsicht beschreibt, wie Banken Betroffenen dafür geschützte Anlaufstellen und kleine Notgelder für die Flucht anbieten.",
      ],
      sources: [
        { href: transferRegulation, label: "Verordnung (EU) 2023/1113" },
        { href: amlRetention, label: "§ 21 FM-GwG" },
        { href: paymentGuidelines, label: "EDSA-Leitlinien 06/2020" },
        { href: financialAbuse, label: "FCA 2024" },
      ],
    },
    en: {
      short: "Privacy concerns everyone",
      title: "Nobody has to be rich to need financial privacy.",
      text: "The provider also holds individual transactions. They can show whom you donate to, where you are a member and what help you seek.",
      proof: [
        "With every transfer, the provider records the sender and recipient under the EU transfer of funds regulation. Anti-money-laundering rules require it to keep these records for every customer, without suspicion, currently for up to ten years after the relationship ends.",
        "Europe’s data protection authorities warn that even single payments reveal a lot: donations can show political or religious beliefs, membership fees a trade union, medical bills someone’s health. Of these, the annual report carries only yearly totals; the provider holds every single payment.",
        "Getting help requires confidentiality. Someone living with a partner who controls the money needs a safe way to seek help and to use their own money. The UK’s financial regulator describes banks offering those affected safe spaces to ask for help and small emergency funds to leave.",
      ],
      sources: [
        { href: transferRegulation, label: "Regulation (EU) 2023/1113" },
        { href: amlRetention, label: "Section 21 FM-GwG" },
        { href: paymentGuidelines, label: "EDPB Guidelines 06/2020" },
        { href: financialAbuse, label: "FCA 2024" },
      ],
    },
  },
  {
    id: "zweck",
    alias: "ausbau",
    history: true,
    de: {
      short: "Finanzielle Überwachung braucht Grenzen",
      title: "Was gesammelt ist, wird für mehr genutzt.",
      text: "Laut Richtlinie dürfen die Daten auch für Zoll, gegen Geldwäsche und für EU-Sanktionen verwendet werden. Wir sind überzeugt, dass mildere Mittel genügen, und wollen finanzielle Überwachung begrenzen, bevor sie weiter wächst.",
      proof: [
        "Wie so etwas wächst, zeigt Deutschland: Seit 2005 dürfen Finanzämter und Sozialbehörden abfragen, wer welche Konten hat. 2013 kamen Gerichtsvollzieher dazu, 2023 fragten sie 844.427 Mal ab.",
        "DAC8 ist ein Baustein unter mehreren: Den Ausweis prüft der Anbieter schon bei der Kontoeröffnung, Absender und Empfänger erfasst er bei jeder Übertragung. Bis 2029 werden die Kontenregister EU-weit vernetzt; sie erfassen dann auch Krypto-Konten.",
        "Gute Absichten ersetzen keine Grenzen, denn wer heute über die Daten bestimmt, ist morgen vielleicht nicht mehr zuständig. Ein Untersuchungsausschuss des US-Senats stellte 1976 fest, dass die Steuerbehörde IRS Akten über mehr als 11.000 Personen und Gruppen angelegt, Steuerprüfungen nach politischen statt steuerlichen Kriterien begonnen und Steuerdaten ohne ausreichende Schutzvorkehrungen an FBI und CIA weitergegeben hatte.",
        "Überwachung wirkt auch ohne Datenleck. In einem Experiment mit 827 Internetnutzern aus der Deutschschweiz suchten Teilnehmer, die gerade einen Artikel über Datenüberwachung gelesen hatten, seltener nach heiklen Themen und beantworteten persönliche Fragen seltener. Dass die erzwungene Offenlegung von Mitgliederlisten Menschen davon abhalten kann, eine Vereinigung zu unterstützen, erkannte der US Supreme Court schon 1958 an.",
      ],
      sources: [
        { href: accountLookups, label: "BT-Drucksache 20/10841" },
        { href: accountRegistries, label: "Richtlinie (EU) 2024/1640" },
        { href: taxMisuse, label: "US-Senat 1976" },
        { href: chillingStudy, label: "Festic et al. 2026" },
        { href: membershipCase, label: "NAACP v. Alabama 1958" },
      ],
    },
    en: {
      short: "Financial surveillance needs limits",
      title: "What is collected gets used for more.",
      text: "Under the directive, the data may also be used for customs, against money laundering and for EU sanctions. We are convinced that milder means would do, and we want to limit financial surveillance before it grows further.",
      proof: [
        "Germany shows how such uses grow: since 2005, tax offices and social benefit agencies may look up who holds which bank accounts. Bailiffs were added in 2013, and in 2023 they ran 844,427 lookups.",
        "DAC8 is one building block among several: the provider checks your ID when you open the account and records the sender and recipient of every transfer. By 2029, account registries will be connected across the EU and will then also cover crypto-asset accounts.",
        "Good intentions are no substitute for limits, because whoever controls the data today may not be in charge tomorrow. In 1976, a US Senate investigating committee found that the tax authority, the IRS, had opened files on more than 11,000 individuals and groups, started tax investigations on political rather than tax criteria, and passed tax information to the FBI and CIA without adequate safeguards.",
        "Surveillance has an effect even without a data leak. In an experiment with 827 internet users from German-speaking Switzerland, participants who had just read an article about data surveillance searched less often for sensitive topics and answered personal questions less often. As early as 1958, the US Supreme Court recognised that forcing an association to hand over its membership list can keep people from supporting it.",
      ],
      sources: [
        { href: accountLookups, label: "Bundestag paper 20/10841" },
        { href: accountRegistries, label: "Directive (EU) 2024/1640" },
        { href: taxMisuse, label: "US Senate 1976" },
        { href: chillingStudy, label: "Festic et al. 2026" },
        { href: membershipCase, label: "NAACP v. Alabama 1958" },
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
      text: "Darum geht es hier nicht, hier geht es um Daten. Auch für die Steuer darf der Staat nur so viele Daten verlangen und so lange speichern, wie er begründen kann.",
    },
    {
      title: "„Brauchen wir die Daten nicht gegen Kriminalität?“",
      text: "Ermittlungen brauchen Informationen. Daraus folgt nicht, dass jede zusätzliche Angabe, jeder weitere Zugriff und jede lange Speicherfrist nötig ist. Wer Daten über alle verlangt, muss ihren Nutzen belegen und zeigen, dass gezielte Ermittlungen bei konkretem Verdacht nicht genügen.",
    },
    {
      title: "„Die Daten sind doch verschlüsselt.“",
      text: "Verschlüsselung hilft gegen Fremde, nicht gegen jene, die die Daten ohnehin sehen dürfen. Bei Coinbase sammelten bestochene Support-Mitarbeiter Kundendaten aus internen Systemen, auf die sie Zugriff hatten, bis hin zu Ausweisbildern und Kontoständen. Darum zählt auch, wie viel gesammelt wird und wer darauf zugreifen darf.",
      source: { href: coinbaseIncident, label: "Coinbase (Form 8-K)" },
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
      text: "That is not what this is about; this is about data. Even for taxes, the state may only demand as much data, and keep it as long, as it can justify.",
    },
    {
      title: "“Don’t we need the data to fight crime?”",
      text: "Investigations need information. That does not make every extra detail, every further access and every long retention period necessary. Whoever demands data on everyone must prove its benefit and show that targeted investigations based on specific suspicion would not do.",
    },
    {
      title: "“But the data is encrypted.”",
      text: "Encryption helps against outsiders, not against those who are allowed to see the data anyway. At Coinbase, bribed support staff collected customer data from internal systems they had access to, down to ID images and balances. That is why it also matters how much is collected and who may access it.",
      source: { href: coinbaseIncident, label: "Coinbase (Form 8-K)" },
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
      text: "Sie lösen für sich genommen keine Steuer aus, verraten nach einem Datenleck aber, wer vermutlich Bitcoin selbst verwahrt und wie viel dorthin geflossen ist.",
      letter:
        "Übertragungen auf die eigene Wallet nicht melden. Sie lösen für sich genommen keine Steuer aus. Sie trotzdem zu melden ist, als würde die Bank dem Finanzamt sagen, wie viel Bargeld jemand nach Hause getragen hat. Nach einem Datenleck steht dann auf einer Liste, wer vermutlich Bitcoin selbst verwahrt und wie viel dorthin geflossen ist.",
    },
    {
      title: "Nur erheben, was die Steuer braucht.",
      text: "Der zusätzliche Nutzen von Stückzahlen und Transaktionszahlen muss belegt werden.",
    },
    {
      title: "Kürzer speichern.",
      text: "Für Meldungen über Bankkonten gelten fünf Jahre. Zehn Jahre muss der Staat begründen. Kopien, die niemand mehr braucht, müssen auch bei Dienstleistern nachweislich gelöscht werden.",
      letter:
        "Kürzer speichern. Für Meldungen über Bankkonten gelten fünf Jahre; zehn Jahre brauchen eine nachvollziehbare Begründung. Nicht mehr benötigte Kopien müssen auch bei Dienstleistern nachweislich gelöscht werden.",
    },
    {
      title: "Zugriff begrenzen, Rechte sichern.",
      text: "Für jeden Zweck eine klare Grenze, Zugriffe nachvollziehbar und unabhängig kontrolliert. Du musst Auskunft erhalten, Fehler berichtigen und unrechtmäßig gespeicherte Daten löschen lassen können, bei allen Empfängern. Entscheidungen, die auf diesen Daten beruhen, müssen sich überprüfen lassen. Nutzen und Risiken gehören regelmäßig und öffentlich auf den Prüfstand.",
      letter:
        "Zweck, Zugriff und Weitergabe eng begrenzen und unabhängig kontrollieren. Die Rechte der Betroffenen müssen praktisch funktionieren: Auskunft, Berichtigung von Fehlern und Löschung unrechtmäßig gespeicherter Daten bei allen Empfängern sowie die Überprüfung darauf gestützter Entscheidungen. Nutzen und Risiken regelmäßig und öffentlich überprüfen, damit unnötige Eingriffe beendet werden.",
    },
  ],
  en: [
    {
      title: "No stockpiling of data.",
      text: "Determine first whose data must be reported, instead of preparing it for all customers.",
    },
    {
      title: "Do not report transfers to your own wallet.",
      text: "They trigger no tax by themselves, yet after a breach they reveal who probably keeps bitcoin in self-custody and how much went there.",
      letter:
        "Do not report transfers to your own wallet. They trigger no tax by themselves. Reporting their total is like a bank telling the tax authority how much cash someone has carried home. After a breach, it becomes a list of who probably keeps bitcoin in self-custody and how much went there.",
    },
    {
      title: "Collect only what taxation needs.",
      text: "The additional value of units and transaction counts must be demonstrated.",
    },
    {
      title: "Keep data for less time.",
      text: "For reports on bank accounts, the period is five years. The state must justify ten. Copies nobody needs any more must be verifiably deleted, including at service providers.",
      letter:
        "Keep data for less time. For reports on bank accounts, the period is five years; ten years needs a clear justification. Copies no longer needed must be verifiably deleted, including at service providers.",
    },
    {
      title: "Limit access, secure rights.",
      text: "A clear limit for each purpose, with traceable access and independent oversight. You must be able to access your data, correct errors and have unlawfully stored data deleted, by every recipient. Decisions based on the data must be open to review. Benefits and risks need regular, public review.",
      letter:
        "Strictly limit purpose, access and onward disclosure, with independent oversight. The rights of those affected must work in practice: access, correction of errors and deletion of unlawfully stored data by every recipient, and review of decisions based on the data. Independently review benefits and risks, regularly and publicly, so unnecessary intrusions can be ended.",
    },
  ],
}

export const letterDemands = (language: Language) =>
  demands[language].map(
    (demand) => demand.letter ?? `${demand.title} ${demand.text}`,
  )
