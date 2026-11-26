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
// so the letter keeps one trend, one case and the dates its demands rest
// on, and links the page that carries the rest with sources. The trend is
// EU-wide, since EU law is the subject, and the case is one in which leaked
// tax data led attackers to a family.
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
// in the recast, history.ts), what payments reveal and how being watched
// changes behaviour (reason #alle), bitcoin as cash and the attack archive
// (the attacks page), Waltio (leaks.ts) and the Taverny case (the archive,
// after Le Parisien, 23 September 2026: targeted through the Waltio file,
// which showed 2024 balances, about 100 euros left; Journal du Coin retells
// it), forged passports (reason #anlasslos),
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

// EU counts from the attack archive, passed in by the page because the
// archive is too large for the browser script. The archive keeps every known
// attack, whatever made the victim known, so the letter never presents the
// counts as attacks after data leaks.
export type LetterFacts = {
  // The archive's latest year, still running, and its latest date.
  year: number
  through: string
  euThisYear: number
  euLastYear: number
  euYearBefore: number
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

const locale = (language: Language) => (language === "en" ? "en-GB" : "de-AT")

const count = (language: Language, value: number) =>
  value.toLocaleString(locale(language))

const month = (language: Language, date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString(locale(language), {
    month: "long",
    timeZone: "UTC",
  })

// The trend in EU attacks: the growth of the last full year over the one
// before, and, once the running year has passed the last, that too. Without
// growth, the last full year's count.
const trend = (language: Language, facts: LetterFacts) => {
  const en = language === "en"
  const last = facts.year - 1
  const growth = Math.round(
    (facts.euLastYear / Math.max(facts.euYearBefore, 1) - 1) * 100,
  )
  const ahead =
    facts.through && facts.euThisYear > facts.euLastYear
      ? en
        ? `, and by ${month(language, facts.through)} ${facts.year} there were already more than in the whole of ${last}`
        : `, und ${facts.year} waren es bis ${month(language, facts.through)} schon mehr als im ganzen Jahr ${last}`
      : ""
  if (growth > 0 && facts.euYearBefore > 0)
    return en
      ? `In the EU, ${growth} per cent more attacks on crypto holders became public in ${last} than in ${last - 1}${ahead}.`
      : `In der EU wurden ${last} um ${growth} Prozent mehr Angriffe auf Krypto-Besitzer öffentlich bekannt als ${last - 1}${ahead}.`
  return en
    ? `In ${last}, ${count(language, facts.euLastYear)} attacks on crypto holders became public in the EU${ahead}.`
    : `In der EU wurden ${last} ${count(language, facts.euLastYear)} Angriffe auf Krypto-Besitzer öffentlich bekannt${ahead}.`
}

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

// The facts every letter carries, after what the act requires: privacy
// itself, then the danger of the file, then that it misses its target.
const reasons: Text[] = [
  {
    de: "Das ist Massenüberwachung, Schritt für Schritt, bis eine Finanzakte über jeden besteht. Zahlungen verraten, wem jemand spendet, wen er unterstützt, wie es um seine Gesundheit steht und woran er glaubt, und wer weiß, dass all das erfasst wird, verhält sich anders. Darum gibt es das Briefgeheimnis, und darum soll der Staat auch beim Geld erst bei einem Verdacht hinsehen.",
    en: "This is mass surveillance, built step by step until there is a financial file on everyone. Payments reveal whom someone donates to, whom they support, how their health is and what they believe, and anyone who knows all of it is being recorded behaves differently. That is why letters are private, and why the state should need a suspicion before it looks at people’s money too.",
  },
  {
    de: (facts, link) =>
      `Solche Akten sind auch gefährlich. Bitcoin funktioniert wie Bargeld: Wer die Schlüssel hat, kann ihn übertragen, auch unter Zwang. In Frankreich gerieten Anfang 2026 Daten über Gewinne und Bestände der Kunden eines Krypto-Steuerdienstes in fremde Hände. Im Juli fesselten in Taverny drei maskierte Männer eine Mutter und ihr zehnjähriges Kind und quälten den Vater mit einem Elektroschocker. Ihr Hinweis stammte aus diesen Daten; die Familie besaß nur mehr rund 100 Euro in Kryptowerten. ${trend("de", facts)} Die Fälle mit Quellen: ${link}`,
    en: (facts, link) =>
      `Such files are dangerous too. Bitcoin works like cash: whoever holds the keys can move it, even under duress. In early 2026, data on the gains and holdings of a French crypto tax service’s customers fell into the wrong hands. In July, three masked men in Taverny tied up a mother and her ten-year-old child and tortured the father with a stun gun. Their tip came from that data; the family had only about 100 euros left in crypto-assets. ${trend("en", facts)} The cases, with sources: ${link}`,
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
      "was jemand besitzt und wofür er sein Geld ausgibt, geht den Staat ohne konkreten Verdacht nichts an. Das Krypto-Meldepflichtgesetz kehrt das um: Es behandelt jeden Kunden, als stünde er unter Verdacht, und legt Listen an, die Kriminellen zeigen, bei wem etwas zu holen ist. Ich bitte Sie, sich für die Forderungen unten einzusetzen.",
    law: "Seit Jänner 2026 erfassen Krypto-Anbieter nach diesem Gesetz (Krypto-MPfG), das die EU-Richtlinie DAC8 umsetzt, für jeden Kunden Name, Anschrift, Geburtsdatum und Steuernummer und wie viel er im Jahr kauft, verkauft und auf die eigene Wallet überträgt, ohne jeden Verdacht. Ab 2027 geht das jedes Jahr ans Finanzamt, als Jahressummen ohne Wallet-Adressen. Wer Bargeld abhebt oder bei der Bank Goldmünzen kauft und daheim verwahrt, steht in keiner solchen Meldung. Und das ist nur der jüngste Schritt: Nach der vorgeschlagenen Neufassung der Richtlinie sollen Steuerbehörden auch auf Geldwäsche-Register, etwa für Immobilien, und auf Pensionsregister zugreifen.",
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
      "What someone owns and what they spend their money on is none of the state’s business without specific suspicion. The Krypto-Meldepflichtgesetz turns this around: it treats every customer as a suspect, and builds lists that show criminals where there is something to take. I am writing to ask you to support the demands below.",
    law: "Since January 2026, under this act (Krypto-MPfG), which implements the EU directive DAC8, crypto-asset providers have been recording every customer’s name, home address, date of birth and tax number, and how much they buy, sell and transfer to their own wallet each year, without any suspicion. From 2027 this goes to the tax office every year, as annual totals without wallet addresses. Someone who withdraws cash, or buys gold coins at a bank and keeps them at home, appears in no such report. And this is only the latest step: under the proposed recast of the directive, tax authorities would gain access to anti-money-laundering registers, including for real estate, and to pension registers.",
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
