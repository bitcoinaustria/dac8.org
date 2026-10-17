import type { Language } from "@/lib/i18n"

// Our position, sorted by topic. The arguments page renders all of it, the
// home page shows two of the objections, and the letter to members of the
// National Council takes its demands from here. The dossier states what the
// law requires; keep the facts there. Points carry their source where they
// have one, but no "read more" links: the feedback round of October 2026
// found that these cross-references bloated every page. The wording restates
// vetted texts, including the campaign lawyer's notes on what the
// anti-money-laundering rules already require, so change claims in both
// languages together.

export type Point = {
  title: string
  text: string
  source?: { href: string; label: string }
}

export type PointId =
  | "allCustomers"
  | "nothingToHide"
  | "power"
  | "noExit"
  | "taxFairness"
  | "honeypot"
  | "sortable"
  | "noEndDate"
  | "justTaxData"
  | "ownWallet"
  | "purpose"
  | "keptAndUsed"
  | "errors"

// Which points each section of the arguments page shows, in order.
export const topics = {
  verdacht: ["allCustomers", "nothingToHide", "power", "noExit", "taxFairness"],
  speicherdauer: ["justTaxData", "noEndDate", "ownWallet"],
  sicherheit: ["honeypot", "sortable"],
  ausbau: ["purpose", "keptAndUsed", "errors"],
} as const satisfies Record<string, readonly PointId[]>

// The home page keeps two objections: the cash comparison and the reply on
// what the provider holds besides the report.
export const homeObjections = [
  "nothingToHide",
  "justTaxData",
] as const satisfies readonly PointId[]

const section20 =
  "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273819/NOR40273819.pdf"
// Federal government's answer on account lookups, with figures per authority
// since 2005. It warns that 2005 and 2023 totals are not comparable because
// the counting changed, so compare users, not totals.
const accountLookups = "https://dserver.bundestag.de/btd/20/108/2010841.pdf"
const dutchFine =
  "https://www.autoriteitpersoonsgegevens.nl/actueel/boete-belastingdienst-voor-discriminerende-en-onrechtmatige-werkwijze"

export const points: Record<Language, Record<PointId, Point>> = {
  de: {
    allCustomers: {
      title: "Alle Kunden, ohne Verdacht.",
      text: "Der Anbieter muss die Meldedaten für alle Kunden aufbereiten, bevor feststeht, wer überhaupt gemeldet wird. Diese Datensammlung auf Vorrat lehnen wir ab.",
      source: { href: section20, label: "§ 20 Abs. 1 Krypto-MPfG" },
    },
    nothingToHide: {
      title: "„Ich habe nichts zu verbergen.“",
      text: "Bitcoin in der eigenen Wallet ist wie Bargeld daheim. Stell dir vor, deine Bank würde dem Finanzamt jedes Jahr melden, wie viel Bargeld du abgehoben hast, ab dem ersten Euro und ohne Verdacht. Bei Bitcoin verlangt DAC8 das: Überträgst du von einer Börse auf die eigene Wallet, steht die Jahressumme in der Regel in der Meldung. Gelangt so eine Meldung in falsche Hände, zeigt sie, wer vermutlich Erspartes selbst verwahrt.",
    },
    power: {
      title: "Wer viel über dich weiß, hat Macht über dich.",
      text: "Wer weiß, was du besitzt und bewegst, kann dich erpressen, betrügen oder zu Unrecht verdächtigen. Das gilt für Kriminelle nach einem Datenleck ebenso wie für Stellen, die Daten später anders nutzen als gedacht. Darum muss jede Sammlung begründet und begrenzt sein.",
    },
    noExit: {
      title: "„Dann kauf halt nicht über eine Börse.“",
      text: "Für die meisten ist eine Börse, ein Broker oder eine App der einfachste Weg zu Bitcoin. Privatsphäre, die man nur behält, wenn man auf diesen Weg verzichtet, schützt niemanden. Der Schutz muss im Gesetz stehen.",
    },
    taxFairness: {
      title: "„Es geht doch um Steuergerechtigkeit.“",
      text: "Steuern zahlen soll jeder, das bestreiten wir nicht. Aber auch dafür darf der Staat nur so viele Daten verlangen und so lange speichern, wie er begründen kann.",
    },
    honeypot: {
      title: "Der Anbieter wird zum Honeypot.",
      text: "Je mehr an einer Stelle liegt und je länger es dort bleibt, desto lohnender ist ein Angriff. Beim Anbieter liegen Ausweis, Wallet-Adressen und Transaktionen, mit DAC8 auch Steuernummer und Jahreswerte. Ein Leck verbindet deinen Namen mit deinen Wallet-Adressen. Wer diese Zuordnung einmal hat, behält sie und kann damit weitere Zahlungen verfolgen.",
    },
    sortable: {
      title: "Sortierbar nach Vermögen.",
      text: "Aus Summe und Anzahl der Käufe lässt sich grob schätzen, wie viel Geld jemand in Krypto bewegt. Wer die Daten in die Hände bekommt, kann so Menschen herausfiltern, die vermögend wirken, auch wenn die Schätzung falsch ist.",
    },
    noEndDate: {
      title: "Eine Akte ohne Enddatum.",
      text: "Jedes Jahr kommt eine Meldung dazu, und der Anbieter löscht jede erst zehn Jahre nach ihrem Meldejahr. Für Meldungen über Bankkonten gelten fünf Jahre. Bleibst du Kunde, liegen dort ab 2036 laufend zehn Jahresmeldungen.",
      source: { href: section20, label: "§ 20 Abs. 4 Krypto-MPfG" },
    },
    justTaxData: {
      title: "„Das sind doch nur Steuerdaten.“",
      text: "Gemeldet werden Identität und Jahreswerte. Beim Anbieter liegen aber auch Ausweis, Wallet-Adressen und einzelne Transaktionen. Die Geldwäschevorschriften verlangen, sie bei allen Kunden aufzubewahren, ohne Verdacht und derzeit bis zehn Jahre nach Ende der Kundenbeziehung. Für DAC8 kommen Steuernummer und Steuerwohnsitz dazu, im selben Kundenkonto.",
    },
    ownWallet: {
      title: "„Ich nutze nur meine eigene Wallet.“",
      text: "Solange du nie über einen Anbieter kaufst oder verkaufst, meldet DAC8 dich nicht. Kaufst du bei einem Anbieter und überträgst auf deine Wallet, stehen Wert und Stückzahl dieser Übertragungen in der Regel in seiner Jahresmeldung. Die Wallet-Adresse wird nicht gemeldet, bleibt nach den Geldwäschevorschriften aber beim Anbieter gespeichert.",
    },
    purpose: {
      title: "Der Zweck wächst mit.",
      text: "Laut Richtlinie dürfen die Daten auch für Zoll, gegen Geldwäsche und für EU-Sanktionen verwendet werden. Wie so etwas wächst, zeigt Deutschland: Seit 2005 dürfen Finanzämter und Sozialbehörden abfragen, wer welche Konten hat. 2013 kamen Gerichtsvollzieher dazu, 2023 fragten sie 844.427 Mal ab. Wir fordern für jeden Zweck eine eigene, klare Grenze.",
      source: { href: accountLookups, label: "BT-Drucksache 20/10841" },
    },
    keptAndUsed: {
      title: "Was liegen bleibt, wird benutzt.",
      text: "Die niederländische Steuerverwaltung hätte gespeicherte Angaben über doppelte Staatsbürgerschaften 2014 löschen müssen. 2018 lagen sie noch für 1,4 Millionen Menschen vor. Außerdem markierte sie Anträge auf Zuschuss zur Kinderbetreuung auch nach der Staatsangehörigkeit als riskant. Die Datenschutzbehörde nannte das diskriminierend und verhängte 2,75 Millionen Euro Strafe.",
      source: {
        href: dutchFine,
        label: "Autoriteit Persoonsgegevens, 7. Dezember 2021",
      },
    },
    errors: {
      title: "Fehler reisen mit.",
      text: "Ein falscher Steuerwohnsitz, eine falsche Bewertung oder ein missverstandener Transfer kann an andere Staaten gehen. Je mehr Stellen beteiligt sind, desto schwerer die Korrektur.",
    },
  },
  en: {
    allCustomers: {
      title: "All customers, no suspicion.",
      text: "Providers must prepare reporting data for all customers before it is clear who will be reported at all. We reject this stockpiling of data.",
      source: { href: section20, label: "Section 20(1) Krypto-MPfG" },
    },
    nothingToHide: {
      title: "“I have nothing to hide.”",
      text: "Bitcoin in your own wallet is like cash at home. Imagine your bank telling the tax authority every year how much cash you withdrew, from the first euro and without suspicion. For bitcoin, DAC8 requires just that: if you move coins from an exchange to your own wallet, the annual total usually appears in the report. In the wrong hands, such a report shows who probably keeps savings in self-custody.",
    },
    power: {
      title: "Whoever knows a lot about you has power over you.",
      text: "Whoever knows what you own and move can blackmail you, defraud you or wrongly suspect you. That goes for criminals after a data breach as much as for bodies that later use the data in ways no one intended. That is why every collection needs a justification and a limit.",
    },
    noExit: {
      title: "“Then don’t buy through an exchange.”",
      text: "For most people, an exchange, broker or app is the easiest way to buy bitcoin. Privacy you only keep by avoiding that route protects nobody. The protection has to be in the law.",
    },
    taxFairness: {
      title: "“It’s about tax fairness.”",
      text: "Everyone should pay their taxes; we do not dispute that. But even for that, the state may only demand as much data, and keep it as long, as it can justify.",
    },
    honeypot: {
      title: "The provider becomes a honeypot.",
      text: "The more data sits in one place, and the longer it stays there, the more an attack pays off. The provider holds your ID, wallet addresses and transactions, and with DAC8 also your tax identification number and annual totals. A breach ties your name to your wallet addresses. Whoever has that link keeps it and can use it to trace further payments.",
    },
    sortable: {
      title: "Sortable by wealth.",
      text: "Total value and number of purchases give a rough estimate of how much money someone moves in crypto. Anyone who gets hold of the data can use it to single out people who appear wealthy, even when the estimate is wrong.",
    },
    noEndDate: {
      title: "A file with no end date.",
      text: "Every year adds another report, and the provider deletes each one only ten years after its reporting year. For reports on bank accounts, the period is five years. If you remain a customer, from 2036 ten annual reports will always be on file.",
      source: { href: section20, label: "Section 20(4) Krypto-MPfG" },
    },
    justTaxData: {
      title: "“It’s just tax data.”",
      text: "The report contains identity and annual totals. But the provider also holds your ID, wallet addresses and individual transactions. Anti-money-laundering rules require it to keep them for every customer, without suspicion, currently for up to ten years after the relationship ends. For DAC8, your tax identification number and tax residence are added to the same customer account.",
    },
    ownWallet: {
      title: "“I only use my own wallet.”",
      text: "As long as you never buy or sell through a provider, DAC8 does not report you. If you buy from a provider and transfer to your wallet, the value and units of those transfers usually appear in its annual report. The wallet address is not reported, but it stays stored with the provider under anti-money-laundering rules.",
    },
    purpose: {
      title: "The purpose keeps expanding.",
      text: "Under the directive, the data may also be used for customs, against money laundering and for EU sanctions. Germany shows how such uses grow: since 2005, tax offices and social benefit agencies may look up who holds which bank accounts. Bailiffs were added in 2013, and in 2023 they ran 844,427 lookups. We call for a clear limit on each purpose.",
      source: { href: accountLookups, label: "Bundestag paper 20/10841" },
    },
    keptAndUsed: {
      title: "What stays on file gets used.",
      text: "The Dutch tax administration should have deleted its records of dual citizenship in 2014. In 2018 it still held them for 1.4 million people. It also used nationality to flag applications for childcare benefit as risky. The data protection authority called this discriminatory and imposed a fine of 2.75 million euros.",
      source: {
        href: dutchFine,
        label: "Autoriteit Persoonsgegevens, 7 December 2021",
      },
    },
    errors: {
      title: "Errors travel too.",
      text: "An incorrect tax residence, valuation or reading of a transfer can be passed to other countries. The more bodies involved, the harder the correction.",
    },
  },
}

// The page shows title and text; the letter uses `letter` where a demand
// addresses the reader directly, and title and text joined otherwise.
export type Demand = { title: string; text: string; letter?: string }

export const demands: Record<Language, Demand[]> = {
  de: [
    {
      title: "Erst klären, wessen Daten gemeldet werden müssen.",
      text: "Keine vorsorgliche Aufbereitung für alle Kunden.",
    },
    {
      title: "Nur notwendige Daten erfassen.",
      text: "Der zusätzliche Nutzen von Stückzahlen und Transaktionszahlen muss belegt werden.",
    },
    {
      title: "Übertragungen auf die eigene Wallet nicht melden.",
      text: "Sie lösen für sich genommen keine Steuer aus. Sie trotzdem zu melden ist, als würde die Bank dem Finanzamt sagen, wie viel Bargeld jemand nach Hause getragen hat. Nach einem Leck steht dann auf einer Liste, wer vermutlich wie viel Bitcoin daheim hat.",
    },
    {
      title: "Daten nicht länger als nötig speichern.",
      text: "Zehn Jahre statt fünf brauchen eine nachvollziehbare Begründung.",
    },
    {
      title: "Zweck, Zugriff und Weitergabe eng begrenzen.",
      text: "Zugriffe müssen nachvollziehbar sein und unabhängig kontrolliert werden.",
    },
    {
      title: "Deine Rechte müssen praktisch funktionieren.",
      text: "Du musst Auskunft erhalten, Fehler korrigieren und unrechtmäßig gespeicherte Daten bei allen Empfängern löschen lassen können.",
      letter:
        "Die Rechte der Betroffenen müssen praktisch funktionieren: Auskunft, Korrektur und Löschung unrechtmäßig gespeicherter Daten bei allen Empfängern.",
    },
    {
      title: "Nutzen und Risiken unabhängig überprüfen.",
      text: "Regelmäßig und öffentlich, damit unnötige Eingriffe beendet werden.",
      letter:
        "Nutzen und Risiken unabhängig überprüfen, regelmäßig und öffentlich, damit unnötige Eingriffe beendet werden.",
    },
  ],
  en: [
    {
      title: "Determine whose data must be reported first.",
      text: "No precautionary preparation of data for all customers.",
    },
    {
      title: "Collect only necessary data.",
      text: "The additional value of units and transaction counts must be demonstrated.",
    },
    {
      title: "Do not report transfers to your own wallet.",
      text: "They trigger no tax by themselves. Reporting their total is like a bank telling the tax authority how much cash someone has carried home. After a breach, it becomes a list of who probably keeps how much bitcoin at home.",
    },
    {
      title: "Keep data no longer than necessary.",
      text: "Ten years instead of five needs a clear justification.",
    },
    {
      title: "Strictly limit purpose, access and onward disclosure.",
      text: "Access must be traceable and subject to independent oversight.",
    },
    {
      title: "Your rights must work in practice.",
      text: "You must be able to access your data, correct errors and have unlawfully stored data deleted by every recipient.",
      letter:
        "The rights of those affected must work in practice: access, correction and deletion of unlawfully stored data by every recipient.",
    },
    {
      title: "Independently review benefits and risks.",
      text: "Regularly and publicly, so unnecessary intrusions can be ended.",
      letter:
        "Independently review benefits and risks, regularly and publicly, so unnecessary intrusions can be ended.",
    },
  ],
}

export const letterDemands = (language: Language) =>
  demands[language].map(
    (demand) => demand.letter ?? `${demand.title} ${demand.text}`,
  )
