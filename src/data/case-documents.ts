import type { Language } from "@/lib/i18n"

// The documents of the proceedings, published as they arise so that lawyers
// and organisations in other countries can reuse them. Every filing, opinion
// and decision gets one entry here and its PDF in public/verfahren/, named
// <kind>-<date>.pdf; the page lists them in date order. Before a PDF goes in,
// remove (do not cover) personal data, the firm's file references, links
// and metadata, and leave out enclosures with ID, bank, tax or register data
// and anything showing a wallet address.
//
// Status words must match the actual procedural state: say "eingebracht"
// for a filing until a decision exists, and add the decision as its own
// entry.
export type CaseDocument = {
  // ISO date of the document, used for order and display
  date: string
  title: Record<Language, string>
  text: Record<Language, string>
  // Path under public/
  href: string
  pages: number
  // A passage others can take over almost word for word, shown in full
  // below the entry: the German original and, if there is one, our working
  // translation.
  excerpt?: {
    title: Record<Language, string>
    de: string[]
    en?: string[]
  }
}

export const caseDocuments: CaseDocument[] = [
  {
    date: "2026-09-24",
    title: { de: "Löschungsbegehren", en: "Request for erasure" },
    text: {
      de: "Nach einem Bitcoin-Kauf direkt in die eigene Wallet verlangt Oliver Völkel die Löschung nach Art. 17 DSGVO, gezielt nur für das, was allein wegen des Krypto-Meldepflichtgesetzes verarbeitet wird: Steuernummer, Steuerwohnsitz und die aufbereiteten Transaktionsdaten. Name, Anschrift und Geburtsdatum, die der Anbieter auch aus anderen Gründen braucht, sind ausgenommen.",
      en: "After buying bitcoin straight into his own wallet, Oliver Völkel asks for erasure under Article 17 GDPR, aimed only at what is processed solely because of the reporting act: tax number, tax residence and the compiled transaction data. Name, postal address and date of birth, which the provider also needs for other reasons, are left out.",
    },
    href: "/verfahren/loeschungsbegehren-2026-09-24.pdf",
    pages: 6,
    excerpt: {
      title: {
        de: "Die Löschungsgründe zum Übernehmen",
        en: "The reasons for erasure, to reuse",
      },
      // Beilage 2 of the request, verbatim.
      de: [
        "Das Löschungsbegehren richtet sich gezielt gegen jene Daten, die ausschließlich aufgrund des Krypto-MPfG erhoben, gespeichert und verarbeitet werden und für die keine andere vertragliche oder gesetzliche Verarbeitungspflicht besteht, und deren Verarbeitung nicht zur Wahrung der berechtigten Interessen erfolgt.",
        "Von der Löschung umfasst sind insbesondere die gemäß § 20 Abs 1 Krypto-MPfG zusätzlich erhobenen Informationen, namentlich: (i) meine Steueridentifikationsnummer, (ii) den oder die Staaten meiner steuerlichen Ansässigkeit, (iii) sämtliche systematisch aufbereiteten transaktionsbezogenen Daten, insbesondere die aggregierten Daten zu Erwerben, Veräußerungen, Tauschgeschäften und Übertragungen von Kryptowerten (einschließlich der jeweiligen Beträge, Einheiten, Anzahl und beizulegenden Marktwerte); (iv) alle weiteren personenbezogenen Daten, die ausschließlich auf Grundlage des Krypto-MPfG und nicht aufgrund anderer gesetzlicher oder vertraglicher Verpflichtungen oder zur Wahrung der berechtigten Interessen verarbeitet werden.",
        "Zur Klarstellung: Daten, die zugleich auf Grundlage des Vertrags (Art 6 Abs 1 lit b DSGVO), des FM-GwG oder sonstiger gesetzlicher Verpflichtungen (Art 6 Abs 1 lit c DSGVO) verarbeitet werden, wie etwa Vor- und Nachname, Anschrift oder Geburtsdatum, sind vom gegenständlichen Löschungsbegehren nicht erfasst, soweit hierfür eine eigenständige Rechtsgrundlage besteht.",
        "Rechtsgrundlage des Löschungsbegehrens ist Art 17 Abs 1 lit d DSGVO: Die personenbezogenen Daten wurden unrechtmäßig verarbeitet, da die gesetzliche Grundlage in § 20 Abs 1 Krypto-MPfG gegen das verfassungsgesetzlich gewährleistete Grundrecht auf Datenschutz gemäß § 1 DSG sowie Art 8 GRC verstößt.",
      ],
      en: [
        "The request for erasure is aimed specifically at the data that is collected, stored and processed solely because of the Krypto-MPfG, for which there is no other contractual or legal obligation to process it, and whose processing does not serve legitimate interests.",
        "It covers in particular the information additionally collected under § 20(1) Krypto-MPfG, namely: (i) my tax identification number, (ii) the state or states of my tax residence, (iii) all systematically compiled transaction data, in particular the aggregated data on acquisitions, disposals, exchanges and transfers of crypto-assets (including the respective amounts, units, number and fair market values); (iv) all other personal data processed solely on the basis of the Krypto-MPfG and not on the basis of other legal or contractual obligations or to safeguard legitimate interests.",
        "For clarity: data that is also processed on the basis of the contract (Article 6(1)(b) GDPR), the FM-GwG (Austria’s anti-money-laundering act for the financial market) or other legal obligations (Article 6(1)(c) GDPR), such as first name and surname, postal address or date of birth, is not covered by this request, insofar as there is an independent legal basis for it.",
        "The legal basis for the request is Article 17(1)(d) GDPR: the personal data has been processed unlawfully, because its legal basis in § 20(1) Krypto-MPfG violates the constitutionally guaranteed fundamental right to data protection under § 1 of the Data Protection Act (DSG) and Article 8 of the Charter of Fundamental Rights.",
      ],
    },
  },
  {
    date: "2026-09-28",
    title: { de: "Ablehnung", en: "Refusal" },
    text: {
      de: "Der Anbieter lehnt ab: Das Gesetz schreibt die Verarbeitung vor (Art. 17 Abs. 3 lit. b DSGVO), und ob es verfassungsmäßig ist, könne nur der Verfassungsgerichtshof beurteilen. Diese Ablehnung öffnet den Weg zur Datenschutzbehörde.",
      en: "The provider refuses: the law requires the processing (Article 17(3)(b) GDPR), and only the Constitutional Court can rule on whether that law is constitutional. This refusal opens the route to the Data Protection Authority.",
    },
    href: "/verfahren/ablehnung-2026-09-28.pdf",
    pages: 2,
  },
  {
    date: "2026-10-23",
    title: {
      de: "Beschwerde bei der Datenschutzbehörde",
      en: "Complaint to the Data Protection Authority",
    },
    text: {
      de: "Was gemeldet wird, warum das für Menschen mit eigener Wallet ein Risiko ist und warum die Verarbeitung gegen das Grundrecht auf Datenschutz verstößt. Eingebracht, noch nicht entschieden.",
      en: "What is reported, why that is a risk for people with their own wallet, and why the processing violates the fundamental right to data protection. Filed, not yet decided.",
    },
    href: "/verfahren/beschwerde-2026-10-23.pdf",
    pages: 19,
  },
]

export const caseDocumentsFor = () =>
  [...caseDocuments].sort((a, b) => a.date.localeCompare(b.date))
