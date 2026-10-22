import type { Language } from "@/lib/i18n"

// The paper chapter of the history film reads the law aloud when the
// reader presses the loudspeaker: in 1991 one voice reads the first
// directive's duty to show ID; today nine passages of the
// anti-money-laundering regulation of 2024 start one after another until
// they talk over each other, chosen for what they reach into (cash, the
// data on every customer, continuous monitoring, family members) and for
// how they read aloud. The words are verbatim from the Official Journal
// (via the Publications Office), in the page's language; the voices are
// generated with Qwen3-TTS (scripts/artwork/speak-law.py) and checked with
// Whisper. The audio lives in public/audio/law/<id>-<lang>.mp3.

type Text = Record<Language, string>
export type LawVoice = { id: string; ref: Text; text: Text }

export const firstVoice = "1991"

export const lawVoices: LawVoice[] = [
  {
    id: "1991",
    ref: {
      de: "Richtlinie 91/308/EWG, Art. 3 Abs. 1",
      en: "Directive 91/308/EEC, Art. 3(1)",
    },
    text: {
      de: "Die Mitgliedstaaten sorgen dafür, daß die Kredit- und Finanzinstitute von ihren Kunden die Bekanntgabe ihrer Identität durch ein beweiskräftiges Dokument verlangen, wenn diese mit ihnen Geschäftsbeziehungen anknüpfen, insbesondere, wenn sie ein Sparkonto oder ein anderes Konto eröffnen oder Vermögensverwahrungsleistungen anbieten.",
      en: "Member States shall ensure that credit and financial institutions require identification of their customers by means of supporting evidence when entering into business relations, particularly when opening an account or savings accounts, or when offering safe custody facilities.",
    },
  },
  {
    id: "art80",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 80 Abs. 1",
      en: "Regulation (EU) 2024/1624, Art. 80(1)",
    },
    text: {
      de: "Personen, die mit Gütern handeln oder Dienstleistungen erbringen, dürfen Barzahlungen nur in Höhe von maximal 10 000 EUR oder dem entsprechenden Gegenwert in der nationalen oder einer Fremdwährung entgegennehmen oder vornehmen, unabhängig davon, ob die Transaktion in einem einzigen Vorgang oder in mehreren Vorgängen, zwischen denen eine Verbindung zu bestehen scheint, getätigt wird.",
      en: "Persons trading in goods or providing services may accept or make a payment in cash only up to an amount of EUR 10 000 or the equivalent in national or foreign currency, whether the transaction is carried out in a single operation or in several operations which appear to be linked.",
    },
  },
  {
    id: "art22",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 22 Abs. 1 Buchst. a",
      en: "Regulation (EU) 2024/1624, Art. 22(1)(a)",
    },
    text: {
      de: "Bei natürlichen Personen: alle Vor- und Nachnamen; Geburtsort und vollständiges Geburtsdatum; Staatsangehörigkeiten oder ob es sich bei der betreffenden Person gegebenenfalls um einen Staatenlosen, einen Flüchtling oder eine Person mit subsidiärem Schutzstatus handelt, sowie gegebenenfalls die nationale Identifikationsnummer; gewöhnlicher Aufenthaltsort oder für den Fall, dass die Person nicht über eine feste Meldeadresse und einen rechtmäßigen Aufenthaltstitel in der Union verfügt, die Postanschrift, unter der sie erreichbar ist, sowie — falls verfügbar — die Steueridentifikationsnummer.",
      en: "for a natural person: all names and surnames; place and full date of birth; nationalities, or statelessness and refugee or subsidiary protection status where applicable, and the national identification number, where applicable; the usual place of residence or, if there is no fixed residential address with legitimate residence in the Union, the postal address at which the natural person can be reached and, where available the tax identification number.",
    },
  },
  {
    id: "art26",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 26 Abs. 1",
      en: "Regulation (EU) 2024/1624, Art. 26(1)",
    },
    text: {
      de: "Die Verpflichteten überwachen die Geschäftsbeziehung einschließlich der vom Kunden im Laufe einer Geschäftsbeziehung durchgeführten Transaktionen kontinuierlich, um sicherzugehen, dass diese Transaktionen mit ihrem Wissen über den Kunden, dessen Geschäftstätigkeit und Risikoprofil sowie erforderlichenfalls mit ihren Informationen über die Herkunft und die Bestimmung der Gelder übereinstimmen, und um diejenigen Transaktionen aufzudecken, die einer eingehenderen Bewertung nach Artikel 69 Absatz 2 zu unterziehen sind.",
      en: "Obliged entities shall conduct ongoing monitoring of business relationships, including transactions undertaken by the customer throughout the course of a business relationship, to ensure that those transactions are consistent with the obliged entity’s knowledge of the customer, the customer’s business activity and risk profile, and where necessary, with the information about the origin and destination of the funds and to detect those transactions that shall be made subject to a more thorough assessment pursuant to Article 69(2).",
    },
  },
  {
    id: "def35",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 2 Nr. 35",
      en: "Regulation (EU) 2024/1624, Art. 2(35)",
    },
    text: {
      de: "„Familienangehöriger“ a) einen Ehegatten oder einen Partner im Rahmen einer eingetragenen Partnerschaft, einer eingetragenen Lebenspartnerschaft oder einer ähnlichen Vereinbarung; b) ein Kind und einen Ehegatten oder Partner im Rahmen einer eingetragenen Partnerschaft, einer eingetragenen Lebenspartnerschaft oder einer ähnlichen Vereinbarung; c) ein Elternteil; d) für die unter Nummer 34 Buchstabe a Ziffer i genannten Ämter und gleichwertige Funktionen auf Unionsebene oder in einem Drittland ein Geschwisterteil.",
      en: "‘family member’ means: (a) a spouse, or a person in a registered partnership or civil union or in a similar arrangement; (b) a child and a spouse of, or a person in a registered partnership or civil union or in a similar arrangement with, that child; (c) a parent; (d) for the functions referred to in point (34)(a)(i) and equivalent functions at Union level or in a third country, a sibling.",
    },
  },
  {
    id: "art2",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 2",
      en: "Regulation (EU) 2024/1624, Art. 2",
    },
    text: {
      de: "„Krypto-Dienstleistungen“ Krypto-Dienstleistungen im Sinne von Artikel 3 Absatz 1 Nummer 16 der Verordnung (EU) 2023/1114 mit Ausnahme der Beratung zu Kryptowerten gemäß Artikel 3 Absatz 1 Nummer 16 Buchstabe h jener Verordnung.",
      en: "‘crypto-asset services’ means crypto-asset services as defined in Article 3(1), point (16), of Regulation (EU) 2023/1114, with the exception of providing advice on crypto-assets as referred to in Article 3(1), point (16)(h), of that Regulation.",
    },
  },
  {
    id: "def53",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 2 Nr. 53",
      en: "Regulation (EU) 2024/1624, Art. 2(53)",
    },
    text: {
      de: "„Profifußballverein“ jede juristische Person, die ein Fußballverein oder Eigentümer oder Verwalter eines Fußballvereins ist, dem eine Lizenz erteilt wurde, der an der nationalen Fußballliga oder den nationalen Fußballligen eines Mitgliedstaats in der Union teilnimmt und dessen Spieler und Personal vertraglich eingestellt und im Gegenzug für ihre Dienstleistungen vergütet werden.",
      en: "‘professional football club’ means any legal person that is, owns or manages a football club that has been granted a licence and participates in the national football leagues in a Member State and whose players and staff are contractually engaged and are remunerated in exchange for their services.",
    },
  },
  {
    id: "art31",
    ref: {
      de: "Verordnung (EU) 2024/1624, Art. 31",
      en: "Regulation (EU) 2024/1624, Art. 31",
    },
    text: {
      de: "Der in Unterabsatz 1 des vorliegenden Absatzes genannte Durchführungsrechtsakt wird gemäß dem in Artikel 86 Absatz 2 genannten Prüfverfahren erlassen.",
      en: "The implementing act referred to in the first subparagraph of this paragraph shall be adopted in accordance with the examination procedure referred to in Article 86(2).",
    },
  },
  {
    id: "rec108",
    ref: {
      de: "Verordnung (EU) 2024/1624, Erwägungsgrund 108",
      en: "Regulation (EU) 2024/1624, recital 108",
    },
    text: {
      de: "Im Fall einer indirekten Beteiligung sollten die wirtschaftlichen Eigentümer durch Multiplikation der Anteile in der Eigentumskette ermittelt werden.",
      en: "In the case of indirect shareholding, the beneficial owners should be identified by multiplying the shares in the ownership chain.",
    },
  },
  {
    id: "rec110",
    ref: {
      de: "Verordnung (EU) 2024/1624, Erwägungsgrund 110",
      en: "Regulation (EU) 2024/1624, recital 110",
    },
    text: {
      de: "Kontrolle sollte als die tatsächliche Fähigkeit verstanden werden, der Entscheidungsfindung der Gesellschaft in wesentlichen Fragen den eigenen Willen aufzuzwingen.",
      en: "Control should be understood as the effective ability to impose one’s will on the corporate entity’s decision-making on substantive issues.",
    },
  },
]
