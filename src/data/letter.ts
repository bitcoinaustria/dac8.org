import { type Language, pathFor } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// Every letter carries the same facts and the campaign's demands, so that
// readers need not judge which to send. It argues for financial privacy,
// with DAC8 as the case at hand and the newest step of a wider build-up.
// Offices skim, so the principle and the ask come first, the reader's own
// words right after, and the letter ends on a question that puts the goal
// first and what the National Council can change itself as the least it
// can do. Readers add only what is their own: their words, sentences about
// themselves and views the campaign does not state for them.
//
// An email is no study: every figure is one more thing an office can check,
// so the letter keeps one count, one case and the dates its demands rest
// on, and links the page that carries the rest with sources.
//
// By default the letter never makes the sender reveal whether they hold
// bitcoin: a letter for privacy must not cost the sender theirs. The
// sentences that do reveal it are off until chosen. The campaign takes no
// side on taxes (VISION.md), in either direction; the holding-period demand
// is the sender's own view, labelled as such and off by default. The letter
// blames no one for a crime.
//
// The facts restate sourced text on the site: report contents with birth
// date (glossary), cash, gold and the own-wallet sum (reason #bargeld), the
// build-up (reason on growing surveillance in arguments.ts; register access
// in the recast, history.ts), bitcoin as cash and the attack archive (the
// attacks page), Waltio (leaks.ts), forged passports (reason #anlasslos),
// § 20, Germany and the Netherlands, the demands (#forderungen,
// src/data/arguments.ts) and the recast, which needs every member state
// (history.ts). Gold kept at home rests on the absence of any reporting
// duty: the ID check is an anti-money-laundering record, no report to the
// tax office, so never widen it to "anonymous". Sourced here, after the
// complaint of 23 October 2026: data for 2026 deleted on 31 December 2036
// (ErläutRV 306 BlgNR XXVIII. GP, zu § 20 Abs 4); five years for
// transmitted bank-account data (§ 5 Abs 3 GMSG). The holding period:
// BGBl. I Nr. 10/2022 taxes crypto-assets bought after February 2021
// whatever the holding time (§ 27b EStG), while gold coins stay tax-free
// after a year (§ 31 EStG), as crypto-assets do in Germany (§ 23 dEStG).

// The count from the attack archive, passed in by the page because the
// archive is too large for the browser script. The archive keeps every known
// attack, whatever made the victim known, so the letter never presents the
// count as attacks after data leaks.
export type LetterFacts = {
  attacks: number
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
  de: "Krypto-Meldepflichtgesetz: Keine Finanzakte ohne Verdacht",
  en: "Krypto-Meldepflichtgesetz: no financial file without suspicion",
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

// The facts every letter carries, after what the act requires.
const reasons: Text[] = [
  {
    de: (facts, link) =>
      `Bitcoin funktioniert wie Bargeld: Wer die Schlüssel hat, kann ihn übertragen, auch unter Zwang. Eine Liste, wer vermutlich wie viel davon daheim hat, ist darum gefährlich, und solche Listen bleiben nicht sicher. In Frankreich gerieten 2026 Daten über die Bestände der Kunden eines Krypto-Steuerdienstes in fremde Hände; laut Polizei wählen Täter damit Opfer für Gewalttaten aus. Öffentlich bekannt sind weltweit ${count("de", facts.attacks)} körperliche Angriffe auf Menschen, die Kryptowerte besitzen oder bei denen man das vermutet: ${link}`,
    en: (facts, link) =>
      `Bitcoin works like cash: whoever holds the keys can move it, even under duress. A list of who probably keeps bitcoin at home, and how much, is therefore dangerous, and such lists do not stay safe. In 2026, data on the holdings of a French crypto tax service’s customers fell into the wrong hands; according to the police, criminals use it to pick victims of violent crime. Worldwide, there are ${count("en", facts.attacks)} publicly known physical attacks on people who hold crypto-assets, or are believed to: ${link}`,
  },
  {
    de: "Kriminelle kommen trotzdem durch: Laut Geldwäschemeldestelle eröffnen sie Konten mit gefälschten österreichischen Pässen, auf die Namen echter, unbeteiligter Menschen. Erfasst werden alle anderen.",
    en: "Criminals still get through: according to Austria’s financial intelligence unit, they open accounts with forged Austrian passports in the names of real, uninvolved people. It is everyone else who is recorded.",
  },
]

// The campaign's demands, in every letter: the goal first, then what the
// National Council can do alone while DAC8 applies, which the close names.
const demands: Text[] = [
  {
    de: "Keine Finanzakte ohne Verdacht. Österreich soll sich in der EU dafür einsetzen, dass die anlasslose Meldung endet. Der Neufassung, die einstimmig beschlossen werden muss, soll es nur zustimmen, wenn die neuen Registerzugriffe und die Meldung von Übertragungen auf die eigene Wallet gestrichen werden.",
    en: "No financial file without suspicion. Austria should push in the EU to end blanket reporting. Since the recast needs the consent of every member state, Austria should agree to it only if the new register access and the reporting of transfers to a customer’s own wallet are dropped.",
  },
  {
    de: "Solange DAC8 gilt: keine Daten auf Vorrat. Nach § 20 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden. Deutschland und die Niederlande verlangen das nur für gemeldete Kunden.",
    en: "While DAC8 applies: no stockpiling of data. Under Section 20 Krypto-MPfG, providers must prepare the reporting data for all customers, including those who are never reported. Germany and the Netherlands require it only for reported customers.",
  },
  {
    de: "Solange DAC8 gilt: fünf statt zehn Jahre. Was im Jänner 2026 für die Meldung erfasst wird, liegt bis Ende 2036 beim Anbieter, laut Gesetzesbegründung „aus Vereinfachungsgründen“. Für Meldungen über Bankkonten gelten fünf Jahre.",
    en: "While DAC8 applies: five years instead of ten. What is recorded for the report in January 2026 stays with the provider until the end of 2036, “for reasons of simplicity”, as the bill’s explanatory notes put it. Reports on bank accounts are kept for five years.",
  },
]

// Sentences about the sender, one paragraph before their own words. The
// last two reveal holdings, which their labels make plain.
const about: Option[] = [
  {
    id: "voter",
    label: {
      de: "Ich bin in Österreich wahlberechtigt",
      en: "I am eligible to vote in Austria",
    },
    text: {
      de: "Ich bin in Österreich wahlberechtigt, und dieses Thema entscheidet mit, wen ich wähle.",
      en: "I am eligible to vote in Austria, and this issue will influence how I vote.",
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
      en: "I save in bitcoin, as others do in gold or a savings account.",
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
      en: "Bitcoin is part of my pension planning.",
    },
  },
]

// A view of the sender's own, after the facts and before the demands.
const view: Option[] = [
  {
    id: "privacy",
    label: {
      de: "Mein Geld geht niemanden etwas an",
      en: "My money is nobody else’s business",
    },
    text: {
      de: "Was ich mit meinem Geld mache, geht niemanden etwas an. Rechtfertigen muss sich nicht, wer spart, sondern ein Gesetz, das ohne jeden Verdacht Daten über alle Kunden sammeln lässt.",
      en: "What I do with my money is nobody else’s business. Savers owe no one a justification; a law that collects data on every customer without any suspicion does.",
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
      de: "Die Haltefrist für Bitcoin wieder einführen. Bis zur Steuerreform 2022 waren Gewinne nach einem Jahr steuerfrei, wie bis heute bei Goldmünzen und in Deutschland auch bei Bitcoin. Die Haltefrist abzuschaffen war ein Fehler: Das trifft jene, die langfristig sparen.",
      en: "Bring back the holding period for bitcoin. Until the 2022 tax reform, gains were tax-free after one year, as they still are for gold coins and, in Germany, for bitcoin too. Abolishing the holding period was a mistake that hits those who save for the long term.",
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
      "anlasslose finanzielle Überwachung schützt niemanden. Sie zeigt Kriminellen, bei wem etwas zu holen ist. Ohne konkreten Verdacht soll der Staat nicht erfahren, was jemand besitzt und wofür er sein Geld ausgibt. Ich bitte Sie, sich für die Forderungen unten einzusetzen.",
    law: "Seit Jänner 2026 erfassen Krypto-Anbieter nach dem Krypto-Meldepflichtgesetz (Krypto-MPfG), das die EU-Richtlinie DAC8 umsetzt, für jeden Kunden Name, Anschrift, Geburtsdatum und Steuernummer und wie viel er im Jahr kauft, verkauft und auf die eigene Wallet überträgt, ohne jeden Verdacht. Ab 2027 geht das jedes Jahr ans Finanzamt, als Jahressummen ohne Wallet-Adressen. Wer Bargeld abhebt oder bei der Bank Goldmünzen kauft und daheim verwahrt, steht in keiner solchen Meldung. Und das ist nur der jüngste Schritt: Nach der vorgeschlagenen Neufassung der Richtlinie sollen Steuerbehörden auch auf Geldwäsche-Register, etwa für Immobilien, und auf Pensionsregister zugreifen.",
    ask: "Meine Forderungen:",
    question:
      "Die Punkte 2 und 3 kann der Nationalrat selbst beschließen. Lehnen Sie die anlasslose Meldung ab, und werden Sie, solange sie gilt, für diese beiden Änderungen eintreten? Ich bitte um Ihre Antwort.",
    closing: "Mit freundlichen Grüßen",
  },
  en: {
    salutation: "Dear",
    generic: "Dear Sir or Madam,",
    senderPlaceholder: "[Your name]",
    thesis:
      "Blanket financial surveillance protects no one. It shows criminals where there is something to take. Without specific suspicion, the state should not be told what someone owns or what they spend their money on. I am writing to ask you to support the demands below.",
    law: "Since January 2026, under the Krypto-Meldepflichtgesetz (Krypto-MPfG), which implements the EU directive DAC8, crypto-asset providers have been recording every customer’s name, home address, date of birth and tax number, and how much they buy, sell and transfer to their own wallet each year, without any suspicion. From 2027 this goes to the tax office every year, as annual totals without wallet addresses. Someone who withdraws cash, or buys gold coins at a bank and keeps them at home, appears in no such report. And this is only the latest step: under the proposed recast of the directive, tax authorities would gain access to anti-money-laundering registers, including for real estate, and to pension registers.",
    ask: "My demands:",
    question:
      "The National Council can enact points 2 and 3 itself. Do you oppose blanket reporting, and while it applies, will you back these two changes? I look forward to your reply.",
    closing: "Kind regards,",
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
  const aboutSender = chosen(about).join(" ")
  return [
    salutation,
    t.thesis,
    aboutSender,
    fields.personal,
    t.law,
    ...reasons.map(write),
    ...chosen(view),
    t.ask,
    [...demands.map(write), ...chosen(ownDemands)]
      .map((demand, index) => `${index + 1}. ${demand}`)
      .join("\n\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ]
    .filter(Boolean)
    .join("\n\n")
}
