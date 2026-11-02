import { limitsInGold } from "@/data/overregulation"
import type { Language } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// It measures the report against cash and gold: nobody reports them when
// they are taken home, and ID is needed only above a limit, where crypto
// carries a name from the first cent (the film on the history page). It asks
// for three of the demands on the arguments page (#forderungen,
// src/data/arguments.ts): the two the National Council can change in § 20
// Krypto-MPfG first, then the one only the EU can meet. It closes with a
// question the MP has to answer, about the comparison rather than about
// suspicion: the report follows the route, so it accuses nobody. Keep it
// short; the reader's own sentences should carry the most weight.
//
// The facts restate sourced text on the site: report contents (glossary),
// domestic bank accounts outside the annual exchange and the own-wallet sum
// (reason #bargeld), the ID limits in gold and the transfer regulation
// (src/data/overregulation.ts), leaks at exchanges and tax authorities, the
// French attacks (leaks.ts), § 20, withholding since 2024 (objection on tax
// fairness), Germany and the Netherlands, five years for bank-account
// reports and the unanimous recast (history.ts). Gold kept at home rests on
// the absence of any reporting duty: the ID check is an anti-money-laundering
// record, no report to the tax office, so never widen it to "anonymous".

export type LetterFields = {
  salutation: "female" | "male" | "neutral"
  recipient: string
  sender: string
  location: string
  personal: string
}

export const letterSubject: Record<Language, string> = {
  de: "Krypto-Meldepflichtgesetz: drei Änderungen zum Schutz meiner Daten",
  en: "Krypto-Meldepflichtgesetz: three changes to protect my data",
}

// The ID limit for a single transaction without an account, in ounces of
// gold: 1991 and from July 2027.
const gold = { de: limitsInGold("de"), en: limitsInGold("en") }

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
    comparison: `Bei Bargeld und Gold wäre das undenkbar. Hebe ich Geld vom Konto ab oder kaufe ich Goldmünzen und verwahre sie daheim, meldet das niemand dem Finanzamt. Ausweisen muss ich mich bei einem Geschäft ohne Konto erst ab einer Grenze; in Gold gemessen sinkt sie von ${gold.de[0]} Unzen im Jahr 1991 auf ${gold.de[1]} Unzen ab Juli 2027. Bei Krypto trägt jede Übertragung über einen Anbieter meinen Namen, ab dem ersten Cent. Übertrage ich Bitcoin in meine eigene Wallet, steht zusätzlich die Jahressumme in der Meldung ans Finanzamt, ohne Wallet-Adresse, obwohl das für sich genommen keine Steuer auslöst.`,
    danger:
      "Gelangt so eine Meldung in falsche Hände, zeigt sie, wer vermutlich wie viel Bitcoin daheim hat. Datenlecks gibt es bei Krypto-Börsen ebenso wie bei Steuerbehörden, und in Frankreich wählen Täter laut Polizei mit offenbar gehackten Daten Opfer für Überfälle in der eigenen Wohnung aus.",
    austria:
      "Österreich geht sogar über die Richtlinie hinaus. Nach § 20 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden, und jede Meldung zehn Jahre aufbewahren. Dabei ziehen österreichische Anbieter die Steuer auf Kursgewinne seit 2024 ohnehin selbst ab.",
    ask: "Ich ersuche Sie, sich für drei Änderungen einzusetzen:",
    demands: [
      "Daten nur für gemeldete Kunden. Anbieter sollen Meldedaten nur für jene aufbereiten, deren Daten tatsächlich ans Finanzamt gehen, wie in Deutschland und den Niederlanden.",
      "Kürzer speichern. Für Meldungen über Bankkonten reichen fünf Jahre; „Vereinfachungsgründe“ rechtfertigen keine zehn.",
      "Übertragungen auf die eigene Wallet nicht melden. Das schreibt die EU vor; Österreich soll sich in Brüssel für die Streichung einsetzen, auch bei der Neufassung der Richtlinie, die alle Mitgliedstaaten einstimmig beschließen müssen.",
    ],
    question:
      "Privatsphäre braucht keine Rechtfertigung, eine Erfassung ohne jeden Verdacht schon. Darum frage ich Sie direkt: Warum soll für Bitcoin in meiner eigenen Wallet nicht gelten, was für Bargeld und Gold daheim selbstverständlich ist? Und welche der drei Änderungen werden Sie unterstützen? Über Ihre Antwort würde ich mich freuen.",
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
    comparison: `With cash or gold, this would be unthinkable. If I withdraw money from my account, or buy gold coins and keep them at home, nobody reports it to the tax office. I only have to show ID for a transaction without an account above a limit; measured in gold, it falls from ${gold.en[0]} ounces in 1991 to ${gold.en[1]} ounces from July 2027. With crypto, every transfer through a provider carries my name, from the first cent. If I transfer bitcoin to my own wallet, the annual total also appears in the report to the tax office, without the wallet address, even though the transfer by itself triggers no tax.`,
    danger:
      "If such a report falls into the wrong hands, it shows who probably keeps how much bitcoin at home. Data breaches happen at crypto exchanges as well as at tax authorities, and in France, according to the police, criminals use apparently hacked data to pick victims for attacks in their own homes.",
    austria:
      "Austria even goes beyond the directive. Under Section 20 Krypto-MPfG, providers must prepare the reporting data for all customers, including those who are never reported, and keep every report for ten years. Yet Austrian providers have already been withholding the tax on capital gains themselves since 2024.",
    ask: "I ask you to support three changes:",
    demands: [
      "Data only for reported customers. Providers should prepare reporting data only for those whose data actually goes to the tax office, as in Germany and the Netherlands.",
      "Keep data for less time. Five years are enough for reports on bank accounts; “reasons of simplicity” do not justify ten.",
      "Do not report transfers to one’s own wallet. EU law requires this report; Austria should push in Brussels for its removal, including in the recast of the directive, which all member states must adopt unanimously.",
    ],
    question:
      "Privacy needs no justification; collecting data without any suspicion does. So I ask you directly: why should bitcoin in my own wallet not be treated as cash and gold at home are, as a matter of course? And which of the three changes will you support? I look forward to your reply.",
    closing: "Kind regards",
  },
}

export const buildLetter = (language: Language, fields: LetterFields) => {
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
    t.danger,
    t.austria,
    t.ask,
    t.demands.map((demand) => `- ${demand}`).join("\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ].join("\n\n")
}
