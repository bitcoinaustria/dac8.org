import { type Language, pathFor } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// Every letter carries the same facts and the campaign's demands, so that
// readers need not judge which to send. Offices skim, so the ask comes in
// the first paragraph, the reader's own words right after it, and the
// letter ends on a yes-or-no question about what the National Council can
// change itself. Readers add only what is their own: their words, sentences
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
// The facts restate sourced text on the site: report contents with birth
// date (glossary), cash, gold and the own-wallet sum (reason #bargeld), the
// wallet address staying with the provider (arguments.ts), bitcoin as cash
// and the attack archive (the attacks page), Waltio, the French account
// register and the Austrian tax official (leaks.ts), forged passports
// (reason #anlasslos), § 20, Germany and the Netherlands, the demands
// (#forderungen, src/data/arguments.ts), the recast, which needs every
// member state (history.ts), and the complaint (proceedings page). Gold kept
// at home rests on the absence of any reporting duty: the ID check is an
// anti-money-laundering record, no report to the tax office, so never widen
// it to "anonymous". Sourced here, after the complaint of 23 October 2026:
// no minimum amount outside bulk payments (§ 18 Abs 1 Z 3 Krypto-MPfG);
// data for 2026 deleted on 31 December 2036 (ErläutRV 306 BlgNR XXVIII. GP,
// zu § 20 Abs 4); five years for transmitted bank-account data (§ 5 Abs 3
// GMSG). The holding period: BGBl. I Nr. 10/2022 taxes crypto-assets bought
// after February 2021 whatever the holding time (§ 27b EStG), while gold
// coins stay tax-free after a year (§ 31 EStG), as crypto-assets do in
// Germany (§ 23 dEStG).

// Counts from the attack archive, passed in by the page because the archive
// is too large for the browser script. The archive keeps every known attack,
// whatever made the victim known, so the letter never presents its figures
// as attacks after data leaks.
export type LetterFacts = {
  attacks: number
  year: number
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
  de: "Krypto-Meldepflichtgesetz ändern: Finanzielle Überwachung schützt niemanden",
  en: "Amend the Krypto-Meldepflichtgesetz: financial surveillance protects no one",
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
      `Bitcoin funktioniert wie Bargeld: Wer die Schlüssel hat, kann ihn übertragen, auch unter Zwang. Eine Liste, wer vermutlich wie viel davon daheim hat, ist darum gefährlich, und solche Listen gehen verloren. In Frankreich gerieten 2026 die Bestände der Kunden eines Krypto-Steuerdienstes in fremde Hände; laut Polizei wählen Täter damit Opfer für Gewalttaten aus. Aus dem französischen Kontenregister zogen Angreifer mit gestohlenen Zugangsdaten 1,2 Millionen Datensätze. In Österreich fragte ein Finanzbeamter sechs Jahre lang ohne dienstlichen Grund tausende Male Steuerdaten ab. Weltweit sind ${count("de", facts.attacks)} körperliche Angriffe auf Menschen öffentlich bekannt, die Kryptowerte besitzen oder besitzen sollen, ${facts.year} bisher ${count("de", facts.inYearEu)} in der EU: ${link}`,
    en: (facts, link) =>
      `Bitcoin works like cash: whoever holds the keys can move it, under duress too. A list of who probably keeps how much of it at home is therefore dangerous, and such lists get lost. In France, the holdings of a crypto tax service’s customers fell into the wrong hands in 2026; according to the police, criminals use them to select victims of violent crime. From the French bank-account register, attackers using stolen credentials extracted 1.2 million records. In Austria, a tax official accessed tax records thousands of times over six years without any official reason. Worldwide, ${count("en", facts.attacks)} physical attacks on people who hold crypto-assets, or are believed to, are publicly known, ${count("en", facts.inYearEu)} in the EU so far in ${facts.year}: ${link}`,
  },
]

// After the facts and the reader's own view: who gets past the collection,
// and what it means to keep it running.
const accept: Text = {
  de: "Kriminelle kommen trotzdem durch: Laut Geldwäschemeldestelle eröffnen sie Konten mit gefälschten österreichischen Pässen, auf die Namen echter, unbeteiligter Menschen. Erfasst werden alle anderen. Die Datenlecks und die Überfälle sind bekannt. Wer trotzdem weiter sammeln lässt, nimmt in Kauf, dass diese Daten bei Kriminellen landen.",
  en: "Criminals get through regardless: according to Austria’s financial intelligence unit, they open accounts with forged Austrian passports in the names of real, uninvolved people. Everyone else is recorded. The data breaches and the attacks are known. Whoever keeps the collection running regardless accepts that this data ends up with criminals.",
}

// The campaign's demands, in every letter. The second and third are
// Austrian law alone, which the close relies on.
const demands: Text[] = [
  {
    de: "Keine Finanzakte ohne Verdacht. Ermittelt wird bei konkretem Verdacht, statt Daten über alle zu sammeln.",
    en: "No financial file without suspicion. Investigate on specific suspicion instead of collecting data on everyone.",
  },
  {
    de: "Keine Daten auf Vorrat. Nach § 20 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden. Deutschland und die Niederlande verlangen das nur für gemeldete Kunden.",
    en: "No stockpiling of data. Under Section 20 Krypto-MPfG, providers must prepare the reporting data for all customers, including those who are never reported. Germany and the Netherlands require it only for reported customers.",
  },
  {
    de: "Fünf statt zehn Jahre. Was im Jänner 2026 erfasst wird, bleibt bis Ende 2036 gespeichert, „aus Vereinfachungsgründen“. Für Meldungen über Bankkonten gelten fünf Jahre; länger nur, wenn eine konkrete Prüfung läuft.",
    en: "Five years instead of ten. What is recorded in January 2026 stays stored until the end of 2036, “for reasons of simplicity”. Reports on bank accounts are kept five years; longer only while a specific audit is under way.",
  },
  {
    de: "Übertragungen auf die eigene Wallet nicht melden. Sie lösen keine Steuer aus. Der Neufassung der Richtlinie müssen alle Mitgliedstaaten zustimmen; Österreich soll das nur tun, wenn diese Meldung gestrichen wird.",
    en: "Do not report transfers to one’s own wallet. They trigger no tax. The recast of the directive needs the agreement of every member state; Austria should give it only if this report is removed.",
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
      "finanzielle Überwachung schützt niemanden. Sie zeigt Kriminellen, bei wem etwas zu holen ist. Ich fordere Sie auf, sich für die Änderungen unten einzusetzen; zwei davon kann der Nationalrat selbst beschließen.",
    law: "Seit Jänner 2026 erfassen Krypto-Anbieter nach dem Krypto-Meldepflichtgesetz (Krypto-MPfG), das die EU-Richtlinie DAC8 umsetzt, für jeden Kunden Name, Anschrift, Geburtsdatum und Steuernummer und wie viel er im Jahr kauft, verkauft und auf die eigene Wallet überträgt, ab dem ersten Euro und ohne jeden Verdacht. Ab 2027 geht das jedes Jahr ans Finanzamt, als Jahressummen ohne Wallet-Adressen; die Wallet-Adressen bleiben beim Anbieter. Wer Bargeld abhebt oder bei der Bank Goldmünzen kauft und daheim verwahrt, steht in keiner solchen Meldung.",
    ask: "Meine Forderungen:",
    question:
      "Die Punkte 2 und 3 betreffen nur österreichisches Recht. Gegen diese Regeln läuft bereits eine Datenschutzbeschwerde, doch der Nationalrat muss keine Entscheidung abwarten. Darum konkret: Werden Sie eine solche Änderung des Krypto-MPfG unterstützen? Ich bitte um Ihre Antwort.",
    closing: "Mit freundlichen Grüßen",
  },
  en: {
    salutation: "Dear",
    generic: "Dear Sir or Madam,",
    senderPlaceholder: "[Your name]",
    thesis:
      "Financial surveillance protects no one. It shows criminals where there is something to take. I call on you to work for the changes below; the National Council can make two of them itself.",
    law: "Since January 2026, under the Krypto-Meldepflichtgesetz (Krypto-MPfG), which implements the EU directive DAC8, crypto-asset providers have recorded for every customer their name, home address, date of birth and tax number and how much they buy, sell and transfer to their own wallet in a year, from the first euro and without any suspicion. From 2027 this goes to the tax office every year, as annual totals without wallet addresses; the wallet addresses stay with the provider. Someone who withdraws cash, or buys gold coins at a bank and keeps them at home, appears in no such report.",
    ask: "My demands:",
    question:
      "Points 2 and 3 concern Austrian law alone. A data protection complaint against these rules is already under way, but the National Council need not wait for a decision. So, specifically: will you support such an amendment to the Krypto-MPfG? I ask for your reply.",
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
    ...(personal ? [personal] : []),
    t.law,
    ...reasons.map(write),
    ...chosen(view),
    write(accept),
    t.ask,
    [...demands.map(write), ...chosen(ownDemands)]
      .map((demand, index) => `${index + 1}. ${demand}`)
      .join("\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ].join("\n\n")
}
