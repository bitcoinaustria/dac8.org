import entries from "@/data/media.json"

// Articles, podcasts, videos and broadcasts about the campaign, by us or by
// others. `pnpm add:media <url>` reads the title, outlet and date from the
// page and writes the entry to media.json; entries can also be added there by
// hand. Titles stay in the language of the piece; `language` marks it.
export const mediaKinds = ["article", "podcast", "video", "broadcast"] as const
export type MediaKind = (typeof mediaKinds)[number]

export type MediaItem = {
  date: string // YYYY-MM-DD, the day the piece was published or aired.
  kind: MediaKind
  outlet: string
  title: string
  url: string
  language: string // BCP 47 tag of the piece, e.g. "de" or "en".
  guest?: string // Who spoke for the campaign, for appearances.
}

// A malformed entry fails the build instead of rendering a broken link.
export const checkMedia = (raw: unknown[]): MediaItem[] =>
  raw.map((entry, index) => {
    const item = entry as MediaItem
    const problem = (field: string) =>
      new Error(`media.json entry ${index}: invalid ${field}`)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(item.date ?? "")) throw problem("date")
    if (Number.isNaN(Date.parse(item.date))) throw problem("date")
    if (!mediaKinds.includes(item.kind)) throw problem("kind")
    if (!item.outlet?.trim()) throw problem("outlet")
    if (!item.title?.trim()) throw problem("title")
    if (!/^https?:\/\//.test(item.url ?? "")) throw problem("url")
    if (!/^[a-z]{2,3}(-[A-Za-z0-9]+)*$/.test(item.language ?? ""))
      throw problem("language")
    return item
  })

export const media: MediaItem[] = checkMedia(entries)

export const publishedMedia = (now = new Date()) =>
  media
    .filter((item) => Date.parse(item.date) <= now.getTime())
    .sort((a, b) => b.date.localeCompare(a.date))
