import type { Language } from "@/lib/i18n"

// Letter to members of the Austrian National Council. The demands restate the
// vetted list in the dossier ("Was wir fordern"); keep both in sync. The
// letter is drafted in the browser and sent by the reader; nothing is
// transmitted to dac8.org.

export type LetterFields = {
  salutation: "female" | "male" | "neutral"
  recipient: string
  sender: string
  location: string
  personal: string
}

export const letterSubject: Record<Language, string> = {
  de: "DAC8 und Krypto-MPfG: keine Finanzüberwachung auf Vorrat",
  en: "DAC8 and the Krypto-MPfG: no precautionary financial surveillance",
}

const text = {
  de: {
    salutation: {
      female: "Sehr geehrte Frau",
      male: "Sehr geehrter Herr",
      neutral: "Guten Tag",
    },
    generic: "Sehr geehrte Damen und Herren,",
    senderPlaceholder: "[Dein Name]",
    intro:
      "seit 1. Jänner 2026 gilt in Österreich das Krypto-Meldepflichtgesetz, das die EU-Richtlinie DAC8 umsetzt. Krypto-Anbieter melden einmal im Jahr Identität und Jahreswerte an das Finanzamt: je Kryptowert und Vorgangsart Wert, Stückzahl und meist die Anzahl der Vorgänge. Das österreichische Gesetz geht dabei über die Richtlinie hinaus. Nach § 20 Abs. 1 Krypto-MPfG müssen Anbieter die Meldedaten für alle Kunden aufbereiten, auch für jene, die am Ende gar nicht gemeldet werden.",
    stance:
      "Ich lehne diese anlasslose Erfassung ab. Wer Informationen über mein Geld hat, kann Rückschlüsse auf mein Leben ziehen. Gespeicherte Verbindungen zwischen Identität und Finanzdaten sind ein lohnendes Ziel für Angreifer und können für Betrug, Erpressung oder die Auswahl von Opfern genutzt werden.",
    ask: "Ich ersuche Sie, sich im Nationalrat für folgende Punkte einzusetzen:",
    demands: [
      "Erst klären, wessen Daten gemeldet werden müssen. Keine vorsorgliche Aufbereitung für alle Kunden.",
      "Nur notwendige Daten erfassen. Der zusätzliche Nutzen von Stückzahlen und Transaktionszahlen muss belegt werden.",
      "Die eigene Wallet ist keine Zahlung an Dritte. Übertragungen auf selbst verwahrte Adressen sollen erkennbar getrennt behandelt werden.",
      "Daten nicht länger als nötig speichern. Zehn Jahre statt fünf brauchen eine nachvollziehbare Begründung.",
      "Zweck, Zugriff und Weitergabe eng begrenzen. Zugriffe müssen nachvollziehbar sein und unabhängig kontrolliert werden.",
      "Die Rechte der Betroffenen müssen praktisch funktionieren: Auskunft, Korrektur und Löschung unrechtmäßig gespeicherter Daten bei allen Empfängern.",
      "Nutzen und Risiken unabhängig überprüfen, regelmäßig und öffentlich, damit unnötige Eingriffe beendet werden.",
    ],
    question:
      "Wie beurteilen Sie diese Fragen, und welche Schritte werden Sie unterstützen?",
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
      "Since 1 January 2026, Austria’s Crypto-Asset Reporting Obligations Act (Krypto-MPfG), which implements the EU directive DAC8, has been in force. Once a year, crypto-asset providers report identities and annual aggregates to the tax authority: for each crypto-asset and transaction type, the value, units and, for most categories, the number of transactions. Austrian law goes beyond the directive. Under Section 20(1) Krypto-MPfG, providers must prepare reporting data for all customers, including those who will not ultimately be reported.",
    stance:
      "I oppose this collection without any specific suspicion. Information about my money can reveal details about my life. Stored links between identities and financial data are a valuable target for attackers and can be used for fraud, extortion or selecting victims.",
    ask: "I ask you to support the following points in the National Council:",
    demands: [
      "Determine whose data must be reported first. No precautionary preparation of data for all customers.",
      "Collect only necessary data. The additional value of units and transaction counts must be demonstrated.",
      "Your own wallet is not a payment to someone else. Transfers to self-custodied addresses should be treated distinctly.",
      "Keep data no longer than necessary. Ten years instead of five needs a clear justification.",
      "Strictly limit purpose, access and onward disclosure. Access must be traceable and subject to independent oversight.",
      "The rights of those affected must work in practice: access, correction and deletion of unlawfully stored data by every recipient.",
      "Independently review benefits and risks, regularly and publicly, so unnecessary intrusions can be ended.",
    ],
    question:
      "How do you assess these questions, and which steps will you support?",
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
    t.stance,
    t.ask,
    t.demands.map((demand) => `- ${demand}`).join("\n"),
    t.question,
    `${t.closing}\n${signature}`,
  ].join("\n\n")
}
