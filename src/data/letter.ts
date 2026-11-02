import type { Language } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The letter is drafted
// in the browser and sent by the reader; nothing is transmitted to dac8.org.
//
// It measures the report against cash and gold, which nobody reports when
// they are taken home, and asks for three of the demands on the arguments
// page (#forderungen, src/data/arguments.ts): the two the National Council
// can change in § 20 Krypto-MPfG first, then the one only the EU can meet.
// Keep it short; the reader's own sentences should carry the most weight.
// The facts restate sourced text on the site: report contents (glossary),
// domestic bank accounts outside the annual exchange and the own-wallet sum
// (reason #bargeld), leaks at exchanges and tax authorities, the French
// attacks (leaks.ts), § 20, withholding since 2024 (objection on tax
// fairness), Germany and the Netherlands, five years for bank-account
// reports and the unanimous recast (history.ts). Gold rests on the absence
// of any reporting duty: dealers check ID for cash from 10,000 euros under
// the anti-money-laundering rules, which is no report to the tax office, so
// never widen it to "anonymous".

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
    comparison:
      "Bei Bargeld und Gold wäre das undenkbar. Hebe ich Geld vom Konto ab oder kaufe ich Goldmünzen und verwahre sie daheim, meldet das niemand dem Finanzamt. Übertrage ich dagegen Bitcoin vom Anbieter in meine eigene Wallet, verwahre sie also selbst wie Bargeld daheim, steht die Jahressumme in der Meldung, ohne Wallet-Adresse, obwohl das für sich genommen keine Steuer auslöst.",
    danger:
      "Gerade weil Bitcoin wie Bargeld und Gold ein Wert ist, den man selbst in der Hand hat, ist eine solche Liste gefährlich: Sie zeigt, wer vermutlich wie viel davon daheim hat. Solche Daten gelangen immer wieder in falsche Hände, bei Krypto-Börsen ebenso wie bei Steuerbehörden. In Frankreich suchen sich Täter laut Polizei mit offenbar gehackten Daten Opfer aus, die sie in ihrer Wohnung überfallen.",
    austria:
      "Österreich geht dabei über die Richtlinie hinaus. Nach § 20 Krypto-MPfG müssen Anbieter diese Daten für alle Kunden aufbereiten, auch für jene, die nie gemeldet werden, und jede Meldung zehn Jahre aufbewahren. Dabei ziehen österreichische Anbieter die Steuer auf Kursgewinne seit 2024 ohnehin selbst ab.",
    ask: "Ich ersuche Sie, sich für drei Änderungen einzusetzen:",
    demands: [
      "Daten nur für gemeldete Kunden. Anbieter sollen Meldedaten nur für Kunden aufbereiten, deren Daten tatsächlich ans Finanzamt gehen, so wie in Deutschland und den Niederlanden.",
      "Kürzer speichern. Für Meldungen über Bankkonten gelten fünf Jahre. Zehn Jahre „aus Vereinfachungsgründen“ sind keine Begründung.",
      "Übertragungen auf die eigene Wallet nicht melden. Diese Meldung schreibt die EU vor. Österreich soll sich in Brüssel für ihre Streichung einsetzen, auch bei der geplanten Neufassung der Richtlinie, die alle Mitgliedstaaten einstimmig beschließen müssen.",
    ],
    question:
      "Privatsphäre braucht keine Rechtfertigung, eine Erfassung ohne jeden Verdacht schon. Wie stehen Sie zu diesen drei Punkten? Über eine kurze Antwort würde ich mich freuen.",
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
    comparison:
      "With cash or gold, this would be unthinkable. If I withdraw money from my account, or buy gold coins and keep them at home, nobody reports it to the tax office. But if I transfer bitcoin from a provider to my own wallet, keeping it myself like cash at home, the annual total appears in the report, without the wallet address, even though the transfer by itself triggers no tax.",
    danger:
      "Precisely because bitcoin, like cash and gold, is something you hold yourself, such a list is dangerous: it shows who probably keeps how much of it at home. Data like this keeps falling into the wrong hands, at crypto exchanges as well as at tax authorities. In France, according to the police, criminals use apparently hacked data to pick victims whom they then attack in their homes.",
    austria:
      "Austria goes beyond the directive here. Under Section 20 Krypto-MPfG, providers must prepare this data for all customers, including those who are never reported, and keep every report for ten years. Yet Austrian providers have already been withholding the tax on capital gains themselves since 2024.",
    ask: "I ask you to support three changes:",
    demands: [
      "Data only for reported customers. Providers should prepare reporting data only for customers whose data actually goes to the tax office, as in Germany and the Netherlands.",
      "Keep data for less time. Reports on bank accounts are kept for five years. Ten years “for reasons of simplicity” is no justification.",
      "Do not report transfers to one’s own wallet. EU law requires this report. Austria should push in Brussels for its removal, including in the planned recast of the directive, which all member states must adopt unanimously.",
    ],
    question:
      "Privacy needs no justification; collecting data without any suspicion does. Where do you stand on these three points? I would be grateful for a short reply.",
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
