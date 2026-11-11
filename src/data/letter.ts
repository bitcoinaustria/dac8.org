import { type Language, pathFor } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// Every letter carries the same facts and the campaign's demands, so that
// readers need not judge which to send. The opening says financial
// surveillance protects no one, then what the act has providers record; the
// close says that whoever keeps the collection running accepts where such
// data ends up. Readers add only what is their own: their words, sentences
// about themselves and views the campaign does not state for them.
//
// By default the letter never makes the sender reveal whether they hold
// bitcoin: a letter for privacy must not cost the sender theirs. The
// sentences that do reveal it are off until chosen. The holding-period
// demand is tax policy, on which the campaign takes no side (VISION.md); it
// is the sender's own view, labelled as such and off by default. The close
// blames no one for a crime and addresses whoever keeps the collection
// running rather than the MP in person, who may have voted against the act.
//
// The facts restate sourced text on the site: report contents (glossary),
// cash, gold and the own-wallet sum (reason #bargeld), bitcoin as cash and
// the attack archive (the attacks page), Waltio, the French account register
// and the Austrian tax official (leaks.ts), forged passports (reason
// #anlasslos), § 20, Germany and the Netherlands, five years for
// bank-account reports, the demands (#forderungen, src/data/arguments.ts)
// and the recast, which needs every member state (history.ts). Gold kept at
// home rests on the absence of any reporting duty: the ID check is an
// anti-money-laundering record, no report to the tax office, so never widen
// it to "anonymous". Two facts are sourced here only. Less than 0.1 percent
// of criminal finances: Pol, Anti-money laundering: The world's least
// effective policy experiment?, Policy Design and Practice 3(1), 2020,
// https://doi.org/10.1080/25741292.2020.1725366. The holding period:
// BGBl. I Nr. 10/2022 taxes crypto-assets bought after February 2021
// whatever the holding time (§ 27b EStG), while gold coins stay tax-free
// after a year (§ 31 EStG), as crypto-assets do in Germany (§ 23 dEStG).

// Counts from the attack archive, passed in by the page because the archive
// is too large for the browser script. The archive keeps every known attack,
// whatever made the victim known, so the letter never presents its figures
// as attacks after data leaks.
export type LetterFacts = {
  attacks: number
  year: number
  inYear: number
  inYearEu: number
}

export type LetterFields = {
  recipient: string
  sender: string
  location: string
  personal: string
  // Ids of the chosen options, from letterOptions below.
  chosen: string[]
}

export const letterSubject: Record<Language, string> = {
  de: "Krypto-Meldepflichtgesetz: Finanzielle Überwachung schützt niemanden",
  en: "Krypto-Meldepflichtgesetz: financial surveillance protects no one",
}

const count = (language: Language, value: number) =>
  value.toLocaleString(language === "en" ? "en-GB" : "de-AT")

type Text = Record<
  Language,
  string | ((facts: LetterFacts, link: string) => string)
>

// What the reader can add. The label is shown beside the checkbox in the
// language of the page, the text goes into the letter in its own language.
type Option = {
  id: string
  label: Record<Language, string>
  // One line under the label, where the label alone does not say it.
  hint?: Record<Language, string>
  text: Text
}

// The facts every letter carries, after the opening.
const reasons: Text[] = [
  {
    de: "Wer Bargeld abhebt oder bei der Bank Goldmünzen kauft und daheim verwahrt, steht in keiner Meldung ans Finanzamt. Wer Bitcoin beim Anbieter kauft und in die eigene Wallet überträgt, schon, obwohl das für sich genommen keine Steuer auslöst.",
    en: "Someone who withdraws cash, or buys gold coins at a bank and keeps them at home, appears in no report to the tax office. Someone who buys bitcoin from a provider and transfers it to their own wallet does, even though the transfer by itself triggers no tax.",
  },
  {
    de: "Wohin solche Daten gelangen, zeigt Frankreich. Beim Krypto-Steuerdienst Waltio gerieten 2026 Gewinne und Bestände der Kunden in fremde Hände; laut Polizei wählen Täter damit Opfer für Gewalttaten aus. Aus dem nationalen Kontenregister zogen Angreifer mit gestohlenen Zugangsdaten von Beamten 1,2 Millionen Datensätze. In Österreich fragte ein Finanzbeamter sechs Jahre lang ohne dienstlichen Grund tausende Male Steuerdaten ab.",
    en: "France shows where such data ends up. At the crypto tax service Waltio, customers’ gains and holdings fell into the wrong hands in 2026; according to the police, criminals use them to select victims of violent crime. From the national bank-account register, attackers using officials’ stolen credentials extracted 1.2 million records. In Austria, a tax official accessed tax records thousands of times over six years without any official reason.",
  },
  {
    de: (facts, link) =>
      `Bitcoin funktioniert wie Bargeld: Wer die Schlüssel hat, kann ihn übertragen, auch unter Zwang. Eine Liste, wer vermutlich wie viel davon daheim hat, ist darum gefährlich. Weltweit sind ${count("de", facts.attacks)} körperliche Angriffe auf Menschen öffentlich bekannt, die Kryptowerte besitzen oder besitzen sollen, ${facts.year} bisher ${count("de", facts.inYear)}, davon ${count("de", facts.inYearEu)} in der EU: ${link}`,
    en: (facts, link) =>
      `Bitcoin works like cash: whoever holds the keys can move it, under duress too. A list of who probably keeps how much of it at home is therefore dangerous. Worldwide, ${count("en", facts.attacks)} physical attacks on people who hold crypto-assets, or are believed to, are publicly known, ${count("en", facts.inYear)} so far in ${facts.year}, ${count("en", facts.inYearEu)} of them in the EU: ${link}`,
  },
  {
    de: "Gegen Kriminalität hilft die Sammlung kaum. Laut Geldwäschemeldestelle eröffnen Kriminelle Konten mit gefälschten österreichischen Pässen, auf die Namen echter, unbeteiligter Menschen. Der Geldwäscheforscher Ronald Pol schätzt, dass die weltweiten Regeln gegen Geldwäsche weniger als 0,1 Prozent der kriminellen Gelder treffen.",
    en: "Against crime, the collection does little. According to Austria’s financial intelligence unit, criminals open accounts with forged Austrian passports in the names of real, uninvolved people. The money-laundering researcher Ronald Pol estimates that the worldwide rules against money laundering touch less than 0.1 percent of criminal finances.",
  },
]

// The campaign's demands, in every letter.
const demands: Text[] = [
  {
    de: "Keine Finanzakte ohne Verdacht. Ermittelt wird bei konkretem Verdacht, statt Daten über alle zu sammeln.",
    en: "No financial file without suspicion. Investigate on specific suspicion instead of collecting data on everyone.",
  },
  {
    de: "Keine Daten auf Vorrat. Österreich geht über die Richtlinie hinaus: Nach § 20 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden. Deutschland und die Niederlande verlangen das nur für gemeldete Kunden.",
    en: "No stockpiling of data. Austria goes beyond the directive: under Section 20 Krypto-MPfG, providers must prepare the reporting data for all customers, including those who are never reported. Germany and the Netherlands require it only for reported customers.",
  },
  {
    de: "Kürzer speichern. § 20 Krypto-MPfG verlangt zehn Jahre, „aus Vereinfachungsgründen“; für Meldungen über Bankkonten reichen fünf.",
    en: "Keep data for less time. Section 20 Krypto-MPfG demands ten years, “for reasons of simplicity”; five are enough for reports on bank accounts.",
  },
  {
    de: "Übertragungen auf die eigene Wallet nicht melden. Die Meldung schreibt die EU vor. Der Neufassung der Richtlinie müssen alle Mitgliedstaaten zustimmen; Österreich soll das nur tun, wenn diese Meldung gestrichen wird.",
    en: "Do not report transfers to one’s own wallet. EU law requires this report. The recast of the directive needs the agreement of every member state; Austria should give it only if this report is removed.",
  },
]

// Sentences about the sender, joined into one paragraph with their own
// words. The last two reveal holdings, which their labels make plain.
const about: Option[] = [
  {
    id: "voter",
    label: {
      de: "Ich bin in Österreich wahlberechtigt",
      en: "I am entitled to vote in Austria",
    },
    text: {
      de: "Ich bin in Österreich wahlberechtigt, und dieses Thema entscheidet mit, wen ich wähle.",
      en: "I am entitled to vote in Austria, and this issue helps decide whom I vote for.",
    },
  },
  {
    id: "savings",
    label: {
      de: "Ich spare in Bitcoin",
      en: "I save in bitcoin",
    },
    text: {
      de: "Ich spare selbst in Bitcoin, so wie andere in Gold oder auf dem Sparbuch.",
      en: "I save in bitcoin myself, as others do in gold or a savings account.",
    },
  },
  {
    id: "pension",
    label: {
      de: "Bitcoin ist Teil meiner Pensionsvorsorge",
      en: "Bitcoin is part of my retirement savings",
    },
    text: {
      de: "Bitcoin ist Teil meiner Vorsorge für die Pension.",
      en: "Bitcoin is part of my savings for retirement.",
    },
  },
]

// A view of the sender's own, after the facts.
const view: Option[] = [
  {
    id: "privacy",
    label: {
      de: "Mein Geld geht niemanden etwas an",
      en: "My money is nobody else’s business",
    },
    text: {
      de: "Was ich mit meinem Geld mache, geht niemanden etwas an. Rechtfertigen muss sich nicht, wer spart, sondern ein Gesetz, das ohne jeden Verdacht Daten über alle Kunden sammeln lässt.",
      en: "What I do with my money is nobody else’s business. It is not savers who owe a justification, but a law that has data on every customer collected without any suspicion.",
    },
  },
]

// A demand of the sender's own, after the campaign's.
const ownDemands: Option[] = [
  {
    id: "holding",
    label: {
      de: "Haltefrist wieder einführen",
      en: "Bring back the holding period",
    },
    hint: {
      de: "Deine eigene Forderung, nicht die der Kampagne.",
      en: "Your own demand, not the campaign’s.",
    },
    text: {
      de: "Die Haltefrist für Bitcoin wieder einführen. Bis zur Steuerreform 2022 waren Gewinne nach einem Jahr steuerfrei, wie bis heute bei Goldmünzen und in Deutschland auch bei Bitcoin. Sie abzuschaffen war ein Fehler: Es trifft, wer langfristig spart.",
      en: "Bring back the holding period for bitcoin. Until the 2022 tax reform, gains were tax-free after one year, as they still are for gold coins and, in Germany, for bitcoin too. Abolishing it was a mistake: it hits those who save for the long term.",
    },
  },
]

// In the order the generator lists them.
export const letterOptions = [...about, ...view, ...ownDemands]

const text = {
  de: {
    salutation: "Guten Tag",
    generic: "Sehr geehrte Damen und Herren,",
    senderPlaceholder: "[Dein Name]",
    thesis:
      "finanzielle Überwachung schützt niemanden. Sie zeigt Kriminellen, bei wem etwas zu holen ist.",
    law: "Seit Jänner 2026 müssen Krypto-Anbieter nach dem Krypto-Meldepflichtgesetz (Krypto-MPfG), das die EU-Richtlinie DAC8 umsetzt, zu Name, Anschrift und Steuernummer ihrer Kunden festhalten, wie viel diese im Jahr kaufen, verkaufen und auf die eigene Wallet übertragen. Ab 2027 melden sie das jedes Jahr dem Finanzamt, als Jahressummen ohne Wallet-Adressen.",
    accept:
      "Die Datenlecks und die Überfälle sind bekannt. Wer diese Daten trotzdem weiter sammeln lässt, nimmt in Kauf, dass sie bei Kriminellen landen.",
    ask: "Ich fordere Sie auf, sich für Folgendes einzusetzen:",
    question:
      "Welche dieser Forderungen unterstützen Sie, und was werden Sie dafür tun? Ich bitte um Ihre Antwort.",
    closing: "Mit freundlichen Grüßen",
  },
  en: {
    salutation: "Dear",
    generic: "Dear Sir or Madam,",
    senderPlaceholder: "[Your name]",
    thesis:
      "Financial surveillance protects no one. It shows criminals where there is something to take.",
    law: "Since January 2026, the Krypto-Meldepflichtgesetz (Krypto-MPfG), which implements the EU directive DAC8, has required crypto-asset providers to record, next to their customers’ name, home address and tax number, how much they buy, sell and transfer to their own wallet in a year. From 2027 they report this to the tax office every year, as annual totals without wallet addresses.",
    accept:
      "The data breaches and the attacks are known. Whoever keeps this data being collected regardless accepts that it ends up with criminals.",
    ask: "I call on you to work for the following:",
    question:
      "Which of these demands do you support, and what will you do for them? I ask for your reply.",
    closing: "Kind regards",
  },
}

export const buildLetter = (
  language: Language,
  fields: LetterFields,
  facts: LetterFacts,
) => {
  const t = text[language]
  const link = `https://dac8.org${pathFor("attacks", language)}`
  const write = (part: Text) => {
    const value = part[language]
    return typeof value === "string" ? value : value(facts, link)
  }
  const chosen = (options: Option[]) =>
    options
      .filter((option) => fields.chosen.includes(option.id))
      .map((option) => write(option.text))
  const salutation = fields.recipient
    ? `${t.salutation} ${fields.recipient},`
    : t.generic
  const signature = [fields.sender || t.senderPlaceholder, fields.location]
    .filter(Boolean)
    .join("\n")
  const personal = [...chosen(about), fields.personal].filter(Boolean).join(" ")
  return [
    salutation,
    t.thesis,
    t.law,
    ...(personal ? [personal] : []),
    ...reasons.map(write),
    ...chosen(view),
    `${t.accept} ${t.ask}`,
    [...demands.map(write), ...chosen(ownDemands)]
      .map((demand) => `- ${demand}`)
      .join("\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ].join("\n\n")
}
