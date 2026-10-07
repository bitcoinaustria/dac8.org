import type { Language } from "@/lib/i18n"

type Text = Record<Language, string>

// Ready-made social graphics in the artwork lab's share-kit layout
// (knowledge/share-kit/{de,en}/scene-*/{square,story}.png). They follow the
// home page story and the legal route, kept to the scenes that work on their
// own. The squares are exported as JPEG to public/share/. The stories are
// exported to src/assets/share/ and get `text` (and an optional `note`) set
// into the free space at build time
// (src/pages/share/[language]/[scene]-story.jpg.ts), so a story works as a
// post on its own. Titles of story scenes match the home page; change both
// together.
// A story gets a few seconds of attention: the title carries the point, the
// text adds one concrete fact in one or two short sentences.
// The kit stays small on purpose: in October 2026 reviewers asked to cut it
// down to four scenes. Each scene needs its own picture; scene-10 uses the
// lab's dac8-leaked-target motif instead of the home page's target-at-home,
// which repeated the linked profile from scene-09.
export const shareScenes: {
  id: string
  title: Text
  text: Text
  note?: Text
}[] = [
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
    title: {
      de: "Finanzielle Massenüberwachung anfechten.",
      en: "Challenge financial mass surveillance.",
    },
    text: {
      de: "Wir bereiten ein Verfahren gegen die anlasslose Erfassung vor. Unser Ziel: die Frage bis vor den Europäischen Gerichtshof bringen.",
      en: "We are preparing proceedings against recording everyone without suspicion. Our aim: take the question all the way to the EU Court of Justice.",
    },
  },
]

export const shareFile = (
  language: Language,
  id: string,
  format: "square" | "story",
) => `/share/${language}/${id}-${format}.jpg`
