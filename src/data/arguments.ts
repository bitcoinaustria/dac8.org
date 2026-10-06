import { type Language, pathFor } from "@/lib/i18n"

// Our position, sorted by topic. The arguments page renders all of it, the
// home page shows two of the objections, and the letter to members of the
// National Council takes its demands from here. The dossier states what the
// law requires; keep the facts there and link to them. The wording restates
// vetted texts, including the campaign lawyer's notes on what the
// anti-money-laundering rules already require, so change claims in both
// languages together.

export type Point = {
  title: string
  text: string
  link?: { href: string; label: string }
  source?: { href: string; label: string }
}

export type PointId =
  | "allCustomers"
  | "nothingToHide"
  | "taxFairness"
  | "honeypot"
  | "sortable"
  | "noEndDate"
  | "justTaxData"
  | "ownWallet"
  | "purpose"
  | "errors"

// Which points each section of the arguments page shows, in order.
export const topics = {
  verdacht: ["allCustomers", "nothingToHide", "taxFairness"],
  speicherdauer: ["justTaxData", "noEndDate", "ownWallet"],
  sicherheit: ["honeypot", "sortable"],
  ausbau: ["purpose", "errors"],
} as const satisfies Record<string, readonly PointId[]>

// The home page keeps two objections: the cash comparison and the reply on
// what the provider holds besides the report.
export const homeObjections = [
  "nothingToHide",
  "justTaxData",
] as const satisfies readonly PointId[]

const section20 =
  "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273819/NOR40273819.pdf"

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
      link: {
        href: `${pathFor("dossier", "de")}#faelle`,
        label: "Was schon passiert ist",
      },
    },
    taxFairness: {
      title: "„Es geht doch um Steuergerechtigkeit.“",
      text: "Auch dafür darf der Staat nur Daten verlangen, deren Umfang und Speicherdauer gerechtfertigt sind. Er muss erklären können, weshalb er welche Finanzdaten wie lange braucht.",
      link: {
        href: `${pathFor("arguments", "de")}#forderungen`,
        label: "Was wir fordern",
      },
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
      text: "Gemeldet werden Identität und Jahreswerte. Beim Anbieter liegen aber auch Ausweis, Wallet-Adressen und einzelne Transaktionen. Die Geldwäschevorschriften verlangen, sie bei allen Kunden aufzubewahren, ohne Verdacht und derzeit bis zehn Jahre nach Ende der Kundenbeziehung. DAC8 verknüpft diese Unterlagen mit deinen Steuerdaten.",
      link: {
        href: `${pathFor("dossier", "de")}#gemeldet`,
        label: "Was gemeldet wird",
      },
    },
    ownWallet: {
      title: "„Ich nutze nur meine eigene Wallet.“",
      text: "Solange du nie über einen Anbieter kaufst oder verkaufst, meldet DAC8 dich nicht. Kaufst du bei einem Anbieter und überträgst auf deine Wallet, stehen Wert und Stückzahl dieser Übertragungen in der Regel in seiner Jahresmeldung. Die Adresse wird nicht gemeldet, bleibt nach den Geldwäschevorschriften aber beim Anbieter gespeichert.",
      link: { href: pathFor("file", "de"), label: "Deine DAC8-Akte" },
    },
    purpose: {
      title: "Der Zweck wächst mit.",
      text: "Laut Richtlinie dürfen die Daten auch für Zoll, gegen Geldwäsche und für EU-Sanktionen verwendet werden. Was einmal gesammelt ist, findet neue Zwecke. Wir fordern für jeden eine eigene, klare Grenze.",
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
      link: {
        href: `${pathFor("dossier", "en")}#faelle`,
        label: "What has already happened",
      },
    },
    taxFairness: {
      title: "“It’s about tax fairness.”",
      text: "Even then, the state may only demand data whose scope and retention are justified. It must be able to explain why it needs which financial data, and for how long.",
      link: {
        href: `${pathFor("arguments", "en")}#forderungen`,
        label: "Our demands",
      },
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
      text: "The report contains identity and annual totals. But the provider also holds your ID, wallet addresses and individual transactions. Anti-money-laundering rules require it to keep them for every customer, without suspicion, currently for up to ten years after the relationship ends. DAC8 links these records with your tax data.",
      link: {
        href: `${pathFor("dossier", "en")}#gemeldet`,
        label: "What gets reported",
      },
    },
    ownWallet: {
      title: "“I only use my own wallet.”",
      text: "As long as you never buy or sell through a provider, DAC8 does not report you. If you buy from a provider and transfer to your wallet, the value and units of those transfers usually appear in its annual report. The address is not reported, but it stays stored with the provider under anti-money-laundering rules.",
      link: { href: pathFor("file", "en"), label: "Your DAC8 file" },
    },
    purpose: {
      title: "The purpose keeps expanding.",
      text: "Under the directive, the data may also be used for customs, against money laundering and for EU sanctions. Once collected, data finds new purposes. We call for a clear limit on each one.",
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
