import type { Language } from "@/lib/i18n"

export type CampaignUpdate = {
  id: string
  publishedAt: string // ISO 8601 with timezone; keep stable after publication.
  translations: Record<Language, { title: string; text: string }>
  source?: string
}

// Add verified, publishable milestones here in both languages. No placeholder
// news: the feed stays empty until the first actual campaign update is ready.
export const updates: CampaignUpdate[] = []

export const publishedUpdates = (now = new Date()) =>
  updates
    .filter((update) => Date.parse(update.publishedAt) <= now.getTime())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
