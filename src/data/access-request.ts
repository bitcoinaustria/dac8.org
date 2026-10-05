import type { Language } from "@/lib/i18n"
import { calendarFile } from "@/lib/calendar"

// Access request under Art. 15 GDPR to a crypto-asset provider about the data
// it processes for DAC8. The reader drafts it in the browser and sends it
// from their own mailbox; nothing reaches dac8.org. Point 1 restates § 20 Abs.
// 1 Krypto-MPfG, which requires providers to prepare reporting data for all
// customers. The template assumes a provider that reports in Austria; the
// page says so beside the form.

export type RequestFields = {
  provider: string
  name: string
  email: string
  customer: string
}

export const requestSubject: Record<Language, string> = {
  de: "Auskunftsersuchen nach Art. 15 DSGVO (DAC8, Krypto-MPfG)",
  en: "Access request under Article 15 GDPR (DAC8)",
}

const text = {
  de: {
    to: "An:",
    placeholder: {
      provider: "[Anbieter]",
      name: "[Name]",
      email: "[E-Mail-Adresse des Kontos]",
    },
    salutation: "Sehr geehrte Damen und Herren,",
    intro:
      "ich ersuche gemäß Art. 15 DSGVO um Auskunft darüber, ob und welche personenbezogenen Daten Sie über mich verarbeiten, insbesondere im Zusammenhang mit dem Krypto-Meldepflichtgesetz (Krypto-MPfG), mit dem Österreich die EU-Richtlinie DAC8 umsetzt.",
    ask: "Bitte teilen Sie mir mit:",
    questions: [
      "welche Daten Sie für Meldungen nach dem Krypto-MPfG über mich aufbereitet haben oder aufbereiten, einschließlich der Daten, die Sie nach § 20 Abs. 1 Krypto-MPfG unabhängig davon aufbereiten, ob ich am Ende gemeldet werde;",
      "ob Sie Daten über mich an das Finanzamt oder eine andere Stelle übermittelt haben oder übermitteln werden, und an welche;",
      "zu welchen Zwecken und auf welcher Rechtsgrundlage Sie diese Daten verarbeiten;",
      "an welche Empfänger oder Kategorien von Empfängern Sie meine Daten weitergeben, einschließlich Auftragsverarbeitern wie Identifizierungs- oder Analysediensten, und ob Daten in Drittländer übermittelt werden;",
      "wie lange Sie die Meldedaten sowie meine Identifizierungs- und Transaktionsunterlagen speichern, oder nach welchen Kriterien sich die Dauer bemisst;",
      "aus welchen Quellen Sie Daten über mich erhalten haben, soweit Sie sie nicht bei mir erhoben haben, etwa von Analysediensten für Blockchain-Transaktionen;",
      "ob eine automatisierte Entscheidungsfindung einschließlich Profiling stattfindet und, wenn ja, nach welcher Logik.",
    ],
    copy: "Bitte stellen Sie mir außerdem nach Art. 15 Abs. 3 DSGVO eine Kopie der personenbezogenen Daten zur Verfügung, die Gegenstand der Verarbeitung sind, einschließlich der für mich aufbereiteten Meldedaten.",
    deadline:
      "Bitte antworten Sie innerhalb eines Monats nach Eingang dieses Schreibens (Art. 12 Abs. 3 DSGVO). Die Auskunft ist unentgeltlich (Art. 12 Abs. 5 DSGVO).",
    account: "Zur Zuordnung meines Kontos:",
    customer: "Kunden- bzw. Kontonummer",
    closing: "Mit freundlichen Grüßen",
  },
  en: {
    to: "To:",
    placeholder: {
      provider: "[Provider]",
      name: "[Name]",
      email: "[Email address of the account]",
    },
    salutation: "Dear Sir or Madam,",
    intro:
      "Under Article 15 GDPR, I request confirmation as to whether you process personal data about me and, if so, access to that data, in particular in connection with Council Directive (EU) 2023/2226 (DAC8) and the national law implementing it, in Austria the Krypto-MPfG.",
    ask: "Please tell me:",
    questions: [
      "which data about me you have prepared or are preparing for DAC8 reporting, including data you prepare for all customers regardless of whether they are ultimately reported, as Section 20(1) Krypto-MPfG requires in Austria;",
      "whether you have transmitted or will transmit data about me to the tax authority or any other body, and to which;",
      "for what purposes and on what legal basis you process this data;",
      "to which recipients or categories of recipients you disclose my data, including processors such as identity verification or analytics services, and whether any data is transferred to third countries;",
      "how long you store the reporting data and my identification and transaction records, or the criteria used to determine that period;",
      "from which sources you obtained data about me, insofar as you did not collect it from me, for example from blockchain analytics services;",
      "whether automated decision-making, including profiling, takes place and, if so, what logic is involved.",
    ],
    copy: "Under Article 15(3) GDPR, please also provide me with a copy of the personal data undergoing processing, including the reporting data prepared about me.",
    deadline:
      "Please reply within one month of receiving this request (Article 12(3) GDPR). The information is free of charge (Article 12(5) GDPR).",
    account: "To identify my account:",
    customer: "customer or account number",
    closing: "Kind regards",
  },
}

// Empty fields keep their placeholder; the optional customer number only
// appears when given.
export const buildRequest = (language: Language, fields: RequestFields) => {
  const t = text[language]
  const name = fields.name || t.placeholder.name
  const account = [
    name,
    fields.email || t.placeholder.email,
    fields.customer && `${t.customer} ${fields.customer}`,
  ]
    .filter(Boolean)
    .join(", ")
  return [
    `${t.to} ${fields.provider || t.placeholder.provider}`,
    t.salutation,
    t.intro,
    [
      t.ask,
      ...t.questions.map((question, index) => `${index + 1}. ${question}`),
    ].join("\n"),
    t.copy,
    t.deadline,
    `${t.account} ${account}.`,
    `${t.closing}\n${name}`,
  ].join("\n\n")
}

// The provider has one month from receipt to reply (Art. 12 Abs. 3 DSGVO).
// The reminder comes 30 days after the request is drafted, at 9:00 local time.
export const reminderDays = 30
export const reminderDate = (today: Date) =>
  new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + reminderDays,
    9,
  )

const reminder = {
  de: {
    title: (provider: string) =>
      provider
        ? `Antwort auf Auskunftsersuchen an ${provider} prüfen`
        : "Antwort auf Auskunftsersuchen prüfen",
    description: (url: string) =>
      `Dein Anbieter muss innerhalb eines Monats nach Eingang antworten (Art. 12 Abs. 3 DSGVO). Was du danach tun kannst: ${url}`,
    filename: "auskunft-erinnerung.ics",
  },
  en: {
    title: (provider: string) =>
      provider
        ? `Check the reply from ${provider} to your access request`
        : "Check the reply to your access request",
    description: (url: string) =>
      `Your provider must reply within one month of receipt (Article 12(3) GDPR). What you can do next: ${url}`,
    filename: "access-request-reminder.ics",
  },
}

export const reminderFile = (options: {
  language: Language
  provider: string
  url: string
  now: Date
  uid: string
}) => {
  const t = reminder[options.language]
  return {
    filename: t.filename,
    file: calendarFile({
      uid: options.uid,
      stamp: options.now,
      start: reminderDate(options.now),
      minutes: 15,
      title: t.title(options.provider),
      description: t.description(options.url),
      url: options.url,
    }),
  }
}
