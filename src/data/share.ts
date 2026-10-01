import type { Language } from "@/lib/i18n"

type Text = Record<Language, string>

// Ready-made social graphics from the artwork lab's share kit
// (knowledge/share-kit/{de,en}/scene-*/{square,story}.png). They follow the
// home page story and the legal route. The squares are exported as JPEG to
// public/share/. The stories are exported to src/assets/share/ and get `text`
// (and an optional `note`) set into the free space at build time
// (src/pages/share/[language]/[scene]-story.jpg.ts), so a story works as a
// post on its own. The text restates the home page scenes; change both
// together.
export const shareScenes: {
  id: string
  title: Text
  text: Text
  note?: Text
}[] = [
  {
    id: "scene-01-customer",
    title: {
      de: "Dein Konto wird zur Akte.",
      en: "Your account becomes a file.",
    },
    text: {
      de: "Du kaufst Kryptowerte bei einer Börse oder einem Broker in Österreich. Seit 2026 bereitet der Anbieter daraus jedes Jahr deine Identität und Jahreswerte für das Finanzamt auf.",
      en: "You buy crypto-assets from an exchange or broker in Austria. Since 2026, the provider has been preparing your identity and annual aggregates for the tax authority every year.",
    },
  },
  {
    id: "scene-02-processing",
    title: {
      de: "Alle erfasst. Ohne Verdacht.",
      en: "Everyone recorded. Without suspicion.",
    },
    text: {
      de: "Der Anbieter muss die Meldedaten für alle Kunden aufbereiten, auch für jene, die am Ende gar nicht gemeldet werden. Das verlangt das österreichische Gesetz, über die EU-Richtlinie hinaus.",
      en: "Providers must prepare reporting data for all customers, including those who will not ultimately be reported. Austrian law requires this, going beyond the EU directive.",
    },
  },
  {
    id: "scene-03-report",
    title: { de: "Was wird gemeldet?", en: "What gets reported?" },
    text: {
      de: "Name, Anschrift, Steuerwohnsitz, Steuernummer und Geburtsdatum. Dazu je Kryptowert der Wert in Euro und die Stückzahl: wie viel du im Jahr kaufst, verkaufst, tauschst und auf eigene Wallets überträgst.",
      en: "Name, address, tax residence, tax number and date of birth. Plus the value in euros and the units for each crypto-asset: how much you buy, sell, exchange and transfer to your own wallets in a year.",
    },
  },
  {
    id: "scene-04-retention",
    title: {
      de: "Jedes Jahr mehr über dich.",
      en: "More about you. Every year.",
    },
    text: {
      de: "Jedes Jahr kommt eine Meldung dazu, und der Anbieter hebt jede zehn Jahre auf. Bei ihm liegen außerdem dein Ausweis, deine Wallet-Adressen und jede einzelne Transaktion.",
      en: "Every year adds another report, and the provider keeps each one for ten years. It also holds your ID, your wallet addresses and every single transaction.",
    },
  },
  {
    id: "scene-05-leak",
    title: {
      de: "Ein Datenleck. Persönliche Folgen.",
      en: "A data leak. Personal consequences.",
    },
    text: {
      de: "Je mehr an einer Stelle liegt und je länger es dort bleibt, desto lohnender ist der Einbruch. Börsen, Identifizierungsdienste und Finanzverwaltungen haben solche Daten schon verloren.",
      en: "The more data sits in one place, and the longer it stays there, the more a break-in pays. Exchanges, identity verification services and tax administrations have already lost such data.",
    },
  },
  {
    // Numbered after the first eight so existing share URLs stay the same.
    id: "scene-09-profile",
    title: {
      de: "Vier Datenquellen. Ein Personenprofil.",
      en: "Four data sources. One personal profile.",
    },
    text: {
      de: "Ein öffentliches Profil zeigt dein Gesicht, ein Leck deine Wallet-Adresse, ein gehackter Steuerdienst deine Bestände. Zusammengeführt ergibt das, wer du bist, wo du wohnst und was du vermutlich besitzt.",
      en: "A public profile shows your face, a leak your wallet address, a hacked tax service your holdings. Put together, they reveal who you are, where you live and what you probably own.",
    },
  },
  {
    id: "scene-06-risk",
    title: {
      de: "Sortierbar nach Vermögen. Gefährlich in falschen Händen.",
      en: "Sortable by wealth. Dangerous in the wrong hands.",
    },
    text: {
      de: "In Österreich verschicken Betrüger massenhaft gefälschte FinanzOnline-Nachrichten, um herauszufinden, wer Kryptowerte besitzt. Ein Leck beim Anbieter würde ihnen diese Liste fertig liefern.",
      en: "In Austria, fraudsters send fake tax-office messages in bulk to find out who holds crypto. A breach at a provider would hand them that list ready-made.",
    },
  },
  {
    id: "scene-10-target",
    title: {
      de: "Dein Profil. Deine Adresse. Ein Angriffsziel.",
      en: "Your profile. Your address. A target.",
    },
    text: {
      de: "Dahinter steht organisierte Kriminalität. In den USA hackte eine Bande Datenbanken, suchte Menschen mit vermuteten Kryptobeständen heraus und brach bei ihnen ein.",
      en: "This is organised crime. In the United States, a gang hacked databases, picked out people believed to hold crypto and broke into their homes.",
    },
  },
  {
    // Restates the procedural status in src/data/campaign.ts; update it
    // together with that status.
    id: "scene-07-route",
    title: { de: "Datensammlung anfechten.", en: "Challenge data collection." },
    text: {
      de: "Wir sind überzeugt, dass die anlasslose Erfassung aller Kunden gegen Grundrechte verstößt. Bitcoin Austria bereitet ein Verfahren bei der Datenschutzbehörde vor, mit dem Ziel einer Klärung bis vor den Europäischen Gerichtshof.",
      en: "We are convinced that recording every customer without suspicion violates fundamental rights. Bitcoin Austria is preparing proceedings before the Data Protection Authority, aiming for a ruling all the way up to the EU Court of Justice.",
    },
  },
  {
    id: "scene-08-support",
    title: {
      de: "Gemeinsam Privatsphäre verteidigen.",
      en: "Together, defend privacy.",
    },
    text: {
      de: "Mit deiner Spende bezahlen wir das Verfahren. Und schreib deinen Abgeordneten: Der Nationalrat kann das Gesetz ändern. Alles dazu auf dac8.org/mitmachen",
      en: "Your donation funds the case. And write to your MPs: the Austrian parliament can change the law. Find out how at dac8.org/en/get-involved",
    },
  },
]

export const shareFile = (
  language: Language,
  id: string,
  format: "square" | "story",
) => `/share/${language}/${id}-${format}.jpg`
