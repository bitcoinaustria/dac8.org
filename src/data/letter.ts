import { limitsInGold } from "@/data/overregulation"
import { type Language, pathFor } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// It never makes the sender reveal whether or how much bitcoin they hold: a
// letter for privacy must not cost the sender theirs, so it speaks of
// bitcoin as savings in general. It measures the report against cash and
// gold, the other savings people keep themselves: nobody reports them when
// they are taken home, and ID is needed only above a limit, where crypto
// carries a name from the first cent (the film on the history page).
// It asks for three of the demands on the arguments page (#forderungen,
// src/data/arguments.ts): the two the National Council can change in § 20
// Krypto-MPfG first, then the one only the EU can meet. It closes with a
// question the MP has to answer, about the comparison rather than about
// suspicion: the report follows the route, so it accuses nobody. It asks
// for no tax change, since the campaign takes no side on tax policy. Keep it
// short; the reader's own sentences should carry the most weight.
//
// The facts restate sourced text on the site: report contents (glossary),
// domestic bank accounts outside the annual exchange and the own-wallet sum
// (reason #bargeld), the ID limits in gold and the transfer regulation
// (src/data/overregulation.ts), leaks at exchanges and tax authorities, the
// French attacks (leaks.ts), bitcoin as cash and the attack archive (the
// attacks page), § 20, Germany and the Netherlands, five years for
// bank-account reports and the unanimous recast (history.ts). Gold kept at home rests on
// the absence of any reporting duty: the ID check is an anti-money-laundering
// record, no report to the tax office, so never widen it to "anonymous".

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
  salutation: "female" | "male" | "neutral"
  recipient: string
  sender: string
  location: string
  personal: string
}

export const letterSubject: Record<Language, string> = {
  de: "Krypto-Meldepflichtgesetz: Bitcoin-Ersparnisse wie Bargeld und Gold schützen",
  en: "Krypto-Meldepflichtgesetz: protect bitcoin savings like cash and gold",
}

// The ID limit for a single transaction without an account, in ounces of
// gold: 1991 and from July 2027.
const gold = { de: limitsInGold("de"), en: limitsInGold("en") }

const count = (language: Language, value: number) =>
  value.toLocaleString(language === "en" ? "en-GB" : "de-AT")

const text = {
  de: {
    salutation: {
      female: "Sehr geehrte Frau Abgeordnete",
      male: "Sehr geehrter Herr Abgeordneter",
      neutral: "Guten Tag",
    },
    generic: "Sehr geehrte Damen und Herren,",
    senderPlaceholder: "[Dein Name]",
    intro:
      "seit Jänner 2026 setzt Österreich mit dem Krypto-Meldepflichtgesetz (Krypto-MPfG) die EU-Richtlinie DAC8 um. Krypto-Anbieter müssen dem Finanzamt nun jedes Jahr Name, Anschrift und Steuernummer ihrer Kunden melden, dazu Jahressummen ihrer Käufe, Verkäufe und Übertragungen.",
    comparison: `Bitcoin ist für viele Menschen Erspartes, wie Gold oder Bargeld daheim. Wer Geld abhebt oder bei der Bank Goldmünzen kauft und daheim verwahrt, steht in keiner Meldung ans Finanzamt. Wer Bitcoin beim Anbieter kauft und in die eigene Wallet überträgt, schon: Die Jahressumme steht in der Meldung, ohne Wallet-Adresse, obwohl das für sich genommen keine Steuer auslöst. Ausweisen muss man sich bei einem Geschäft ohne Konto erst ab einer Grenze; in Gold gemessen sinkt sie von ${gold.de[0]} Unzen im Jahr 1991 auf ${gold.de[1]} Unzen ab Juli 2027. Bei Krypto trägt jede Übertragung über einen Anbieter den Namen des Kunden, ab dem ersten Cent.`,
    danger: (facts: LetterFacts, link: string) =>
      `Gelangt so eine Meldung in falsche Hände, zeigt sie, wer vermutlich wie viel Bitcoin daheim hat. Bitcoin funktioniert wie Bargeld: Wer die Schlüssel hat, kann ihn übertragen, auch unter Zwang. Datenlecks gibt es bei Krypto-Börsen ebenso wie bei Steuerbehörden; in Frankreich wählen Täter laut Polizei mit offenbar gehackten Daten Opfer für Überfälle in der eigenen Wohnung aus. Weltweit sind ${count("de", facts.attacks)} körperliche Angriffe auf Menschen öffentlich bekannt, die Kryptowerte besitzen oder besitzen sollen, ${facts.year} bisher ${count("de", facts.inYear)}, davon ${count("de", facts.inYearEu)} in der EU: ${link}`,
    austria:
      "Österreich geht sogar über die Richtlinie hinaus. Nach § 20 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden, und jede Meldung zehn Jahre aufbewahren.",
    ask: "Ich ersuche Sie, sich für drei Änderungen einzusetzen:",
    demands: [
      "Daten nur für gemeldete Kunden. Anbieter sollen Meldedaten nur für jene aufbereiten, deren Daten tatsächlich ans Finanzamt gehen, wie in Deutschland und den Niederlanden.",
      "Kürzer speichern. Für Meldungen über Bankkonten reichen fünf Jahre; „Vereinfachungsgründe“ rechtfertigen keine zehn.",
      "Übertragungen auf die eigene Wallet nicht melden. Das schreibt die EU vor; Österreich soll sich in Brüssel für die Streichung einsetzen, auch bei der Neufassung der Richtlinie, die alle Mitgliedstaaten einstimmig beschließen müssen.",
    ],
    question:
      "Was ich mit meinem Geld mache, geht niemanden etwas an. Rechtfertigen muss sich nicht, wer spart, sondern ein Gesetz, das ohne jeden Verdacht Daten über alle Kunden sammeln lässt. Darum frage ich Sie direkt: Warum wird gemeldet, wer Bitcoin beim Anbieter kauft und selbst verwahrt, aber nicht, wer Gold bei der Bank kauft und daheim verwahrt? Und welche der drei Änderungen werden Sie unterstützen? Über Ihre Antwort würde ich mich freuen.",
    closing: "Mit freundlichen Grüßen",
  },
  en: {
    salutation: {
      female: "Dear Ms",
      male: "Dear Mr",
      neutral: "Dear",
    },
    generic: "Dear Sir or Madam,",
    senderPlaceholder: "[Your name]",
    intro:
      "Since January 2026, Austria has implemented the EU directive DAC8 through the Krypto-Meldepflichtgesetz (Krypto-MPfG). Crypto-asset providers must now report their customers’ name, home address and tax number to the tax office every year, together with annual totals of their purchases, sales and transfers.",
    comparison: `For many people, bitcoin is savings, like gold or cash at home. Someone who withdraws cash, or buys gold coins at a bank and keeps them at home, appears in no report to the tax office. Someone who buys bitcoin from a provider and transfers it to their own wallet does: the annual total is in the report, without the wallet address, even though the transfer by itself triggers no tax. ID is needed for a transaction without an account only above a limit; measured in gold, it falls from ${gold.en[0]} ounces in 1991 to ${gold.en[1]} ounces from July 2027. With crypto, every transfer through a provider carries the customer’s name, from the first cent.`,
    danger: (facts: LetterFacts, link: string) =>
      `If such a report falls into the wrong hands, it shows who probably keeps how much bitcoin at home. Bitcoin works like cash: whoever holds the keys can move it, under duress too. Data breaches happen at crypto exchanges as well as at tax authorities; in France, according to the police, criminals use apparently hacked data to pick victims for attacks in their own homes. Worldwide, ${count("en", facts.attacks)} physical attacks on people who hold crypto-assets, or are believed to, are publicly known, ${count("en", facts.inYear)} so far in ${facts.year}, ${count("en", facts.inYearEu)} of them in the EU: ${link}`,
    austria:
      "Austria even goes beyond the directive. Under Section 20 Krypto-MPfG, providers must prepare the reporting data for all customers, including those who are never reported, and keep every report for ten years.",
    ask: "I ask you to support three changes:",
    demands: [
      "Data only for reported customers. Providers should prepare reporting data only for those whose data actually goes to the tax office, as in Germany and the Netherlands.",
      "Keep data for less time. Five years are enough for reports on bank accounts; “reasons of simplicity” do not justify ten.",
      "Do not report transfers to one’s own wallet. EU law requires this report; Austria should push in Brussels for its removal, including in the recast of the directive, which all member states must adopt unanimously.",
    ],
    question:
      "What I do with my money is nobody else’s business. It is not savers who owe a justification, but a law that has data on every customer collected without any suspicion. So I ask you directly: why does buying bitcoin from a provider and keeping it yourself get reported, while buying gold at a bank and keeping it at home does not? And which of the three changes will you support? I look forward to your reply.",
    closing: "Kind regards",
  },
}

export const buildLetter = (
  language: Language,
  fields: LetterFields,
  facts: LetterFacts,
) => {
  const t = text[language]
  const salutation = fields.recipient
    ? `${t.salutation[fields.salutation]} ${fields.recipient},`
    : t.generic
  const signature = [fields.sender || t.senderPlaceholder, fields.location]
    .filter(Boolean)
    .join("\n")
  return [
    salutation,
    t.intro,
    ...(fields.personal ? [fields.personal] : []),
    t.comparison,
    t.danger(facts, `https://dac8.org${pathFor("attacks", language)}`),
    t.austria,
    t.ask,
    t.demands.map((demand) => `- ${demand}`).join("\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ].join("\n\n")
}
