import type { Language } from "@/lib/i18n"

// Ready-made social graphics from the artwork lab's share kit
// (knowledge/share-kit/{de,en}/scene-*/{square,story}.png), exported as JPEG to
// public/share/. They follow the home page story and the legal route. The
// ranking scene is left out until its baked headline is re-exported as
// "Sortierbar nach Vermögen. Gefährlich in falschen Händen."
export const shareScenes: {
  id: string
  title: Record<Language, string>
}[] = [
  {
    id: "scene-01-customer",
    title: {
      de: "Dein Konto wird zur Akte.",
      en: "Your account becomes a file.",
    },
  },
  {
    id: "scene-02-processing",
    title: {
      de: "Alle erfasst. Ohne Verdacht.",
      en: "Everyone recorded. Without suspicion.",
    },
  },
  {
    id: "scene-03-report",
    title: { de: "Was wird gemeldet?", en: "What gets reported?" },
  },
  {
    id: "scene-04-retention",
    title: {
      de: "Jedes Jahr mehr über dich.",
      en: "More about you. Every year.",
    },
  },
  {
    id: "scene-05-leak",
    title: {
      de: "Ein Datenleck. Persönliche Folgen.",
      en: "A data leak. Personal consequences.",
    },
  },
  {
    id: "scene-07-route",
    title: { de: "Datensammlung anfechten.", en: "Challenge data collection." },
  },
  {
    id: "scene-08-support",
    title: {
      de: "Gemeinsam Privatsphäre verteidigen.",
      en: "Together, defend privacy.",
    },
  },
]

export const shareFile = (
  language: Language,
  id: string,
  format: "square" | "story" | "thumb",
) => `/share/${language}/${id}-${format}.${format === "thumb" ? "webp" : "jpg"}`
