import type { Language } from "@/lib/i18n"

type Text = Record<Language, string>

// Ready-made social graphics in the artwork lab's share-kit layout
// (knowledge/share-kit/{de,en}/scene-*/{square,story}.png). They follow the
// home page story and the legal route. The squares are exported as JPEG to
// public/share/. The stories are exported to src/assets/share/ and get `text`
// (and an optional `note`) set into the free space at build time
// (src/pages/share/[language]/[scene]-story.jpg.ts), so a story works as a
// post on its own. Titles match the home page scenes; change both together.
// A story gets a few seconds of attention: the title carries the point, the
// text adds one concrete fact in one or two short sentences.
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
      de: "Seit 2026 hält deine Börse jedes Jahr fürs Finanzamt fest, wer du bist und wie viel du kaufst, verkaufst und tauschst.",
      en: "Since 2026, your exchange has recorded every year for the tax office who you are and how much you buy, sell and swap.",
    },
  },
  {
    id: "scene-02-processing",
    title: {
      de: "Alle erfasst. Ohne Verdacht.",
      en: "Everyone recorded. Without suspicion.",
    },
    text: {
      de: "Aufbereitet werden die Daten aller Kunden, auch wenn sie nie gemeldet werden. Österreich geht damit über die EU hinaus.",
      en: "Data on every customer is prepared, even if it is never reported. Austria goes further than the EU requires.",
    },
  },
  {
    id: "scene-03-report",
    title: {
      de: "Jeder Kauf. Jeder Tausch. Gezählt fürs Finanzamt.",
      en: "Every purchase. Every swap. Counted for the tax office.",
    },
    text: {
      de: "Name, Anschrift, Steuernummer und für jeden Kryptowert, wie viel du gekauft, verkauft, getauscht und übertragen hast.",
      en: "Name, address, tax number and, for each crypto-asset, how much you bought, sold, swapped and transferred.",
    },
  },
  {
    id: "scene-04-retention",
    title: {
      de: "Jedes Jahr mehr über dich.",
      en: "More about you. Every year.",
    },
    text: {
      de: "Jedes Jahr kommt eine Meldung dazu. Der Anbieter hebt jede zehn Jahre auf, neben deinem Ausweis und deinen Wallet-Adressen.",
      en: "Every year adds a report. Your provider keeps each one for ten years, next to your ID and your wallet addresses.",
    },
  },
  {
    id: "scene-05-leak",
    title: {
      de: "Gespeichert. Gehackt. Verkauft.",
      en: "Stored. Hacked. Sold.",
    },
    text: {
      de: "Ledger, Coinbase, Frankreichs Finanzverwaltung: Alle haben Kundendaten verloren, an Hacker oder an bestochene Mitarbeiter.",
      en: "Ledger, Coinbase, France’s tax administration: all have lost customer data, to hackers or to bribed staff.",
    },
  },
  {
    // Numbered after the first eight so existing share URLs stay the same.
    id: "scene-09-profile",
    title: {
      de: "Jedes Leck macht dein Profil genauer.",
      en: "Every leak sharpens your profile.",
    },
    text: {
      de: "Gesicht aus dem Netz, Wallet aus einem Leck, Bestände vom Steuerdienst. Zusammen: wer du bist, wo du wohnst, was du vermutlich hast.",
      en: "Your face from the web, your wallet from a leak, your holdings from a tax service. Together: who you are, where you live, what you probably own.",
    },
  },
  {
    id: "scene-06-risk",
    title: {
      de: "Wer viel bewegt, steht oben auf der Liste.",
      en: "The more you move, the higher you rank.",
    },
    text: {
      de: "Betrüger suchen in Österreich schon per gefälschter FinanzOnline-SMS nach Krypto-Besitzern. Ein Leck beim Anbieter wäre die fertige Liste.",
      en: "In Austria, fraudsters already hunt for crypto holders with fake tax-office texts. A breach at a provider would be the finished list.",
    },
  },
  {
    id: "scene-10-target",
    title: {
      de: "Dein Profil. Deine Adresse. Ein Angriffsziel.",
      en: "Your profile. Your address. A target.",
    },
    text: {
      de: "Eine US-Bande hackte Datenbanken, suchte vermeintlich reiche Krypto-Besitzer heraus und brach bei ihnen ein. Beute insgesamt: über 250 Millionen Dollar.",
      en: "A US gang hacked databases, picked out people believed to be rich in crypto and broke into their homes. Total haul: over 250 million dollars.",
    },
  },
  {
    // Restates the procedural status in src/data/campaign.ts; update it
    // together with that status.
    id: "scene-07-route",
    title: { de: "Datensammlung anfechten.", en: "Challenge data collection." },
    text: {
      de: "Wir bereiten ein Verfahren gegen die anlasslose Erfassung vor. Unser Ziel: die Frage bis vor den Europäischen Gerichtshof bringen.",
      en: "We are preparing proceedings against recording everyone without suspicion. Our aim: take the question all the way to the EU Court of Justice.",
    },
  },
  {
    id: "scene-08-support",
    title: {
      de: "Gemeinsam Privatsphäre verteidigen.",
      en: "Together, defend privacy.",
    },
    text: {
      de: "Spende für das Verfahren und schreib deinen Abgeordneten. Alles auf dac8.org/mitmachen",
      en: "Donate to the case and write to your MPs. Everything at dac8.org/en/get-involved",
    },
  },
]

export const shareFile = (
  language: Language,
  id: string,
  format: "square" | "story",
) => `/share/${language}/${id}-${format}.jpg`
