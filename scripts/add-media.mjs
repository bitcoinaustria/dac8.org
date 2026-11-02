// Adds an article, podcast, video or broadcast to src/data/media.json.
// Reads title, outlet, date and language from the page's metadata; flags fill
// in or override what the page does not say:
//
//   pnpm add:media <url> [--kind article|podcast|video|broadcast]
//     [--date YYYY-MM-DD] [--title "…"] [--outlet "…"] [--language de]
//     [--guest "Name"] [--pin 1] [--minutes 27] [--image <url> | --no-image] [--dry-run]
//
// The preview picture (og:image, or the video's thumbnail) is downloaded once
// into src/assets/media/, so readers' browsers never contact the outlet or
// YouTube to show the card.
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { parseArgs } from "node:util"
import sharp from "sharp"

const target = new URL("../src/data/media.json", import.meta.url)
const imageDirectory = new URL("../src/assets/media/", import.meta.url)
const kinds = ["article", "podcast", "video", "broadcast"]

const { values: flags, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    kind: { type: "string" },
    date: { type: "string" },
    title: { type: "string" },
    outlet: { type: "string" },
    language: { type: "string" },
    guest: { type: "string" },
    minutes: { type: "string" },
    pin: { type: "string" },
    image: { type: "string" },
    "no-image": { type: "boolean" },
    "dry-run": { type: "boolean" },
  },
})
const [url] = positionals
if (!url || !/^https?:\/\//.test(url)) {
  console.error("Usage: pnpm add:media <url> [--kind …] [--date YYYY-MM-DD]")
  process.exit(1)
}

const decode = (text) =>
  text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(
      /&(amp|lt|gt|quot|apos|nbsp);/g,
      (_, name) =>
        ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[name],
    )
    .replace(/\s+/g, " ")
    .trim()

let html = ""
try {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (dac8.org media list)" },
    redirect: "follow",
  })
  if (response.ok) html = await response.text()
  else console.warn(`${url}: HTTP ${response.status}, using flags only`)
} catch (error) {
  console.warn(`${url}: ${error.message}, using flags only`)
}

// <meta property="og:title" content="…"> in either attribute order.
const meta = (...names) => {
  for (const name of names) {
    for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
      const key = tag.match(/\b(?:property|name|itemprop)\s*=\s*["']([^"']+)/i)
      const content = tag.match(/\bcontent\s*=\s*(["'])([\s\S]*?)\1/i)
      if (key?.[1].toLowerCase() === name && content?.[2].trim())
        return decode(content[2])
    }
  }
}
const jsonLd = (field) => {
  const blocks = html.matchAll(
    /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const [, block] of blocks) {
    const match = block.match(new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`))
    if (match) return match[1]
  }
}

const host = new URL(url).hostname.replace(/^www\./, "")

// Video and audio platforms block or script their pages but answer oEmbed
// with the title and the channel or show name.
const oEmbedEndpoints = {
  "youtube.com": "https://www.youtube.com/oembed",
  "youtu.be": "https://www.youtube.com/oembed",
  "vimeo.com": "https://vimeo.com/api/oembed.json",
  "open.spotify.com": "https://open.spotify.com/oembed",
}
let oEmbed = {}
const endpoint = Object.entries(oEmbedEndpoints).find(
  ([domain]) => host === domain || host.endsWith(`.${domain}`),
)?.[1]
if (endpoint) {
  try {
    const response = await fetch(
      `${endpoint}?format=json&url=${encodeURIComponent(url)}`,
    )
    if (response.ok) oEmbed = await response.json()
  } catch {}
}
const guessKind = () => {
  if (/(^|\.)(youtube\.com|youtu\.be|vimeo\.com)$/.test(host)) return "video"
  if (
    /(^|\.)(podcasts\.apple\.com|spotify\.com|podbean\.com|fountain\.fm)$/.test(
      host,
    ) ||
    /podcast/i.test(meta("og:type") ?? "")
  )
    return "podcast"
  if (/^(tvthek|sound|on)\.orf\.at$/.test(host)) return "broadcast"
  if (/video/i.test(meta("og:type") ?? "")) return "video"
  return "article"
}
const isoDay = (raw) => {
  const time = Date.parse(raw ?? "")
  return Number.isNaN(time)
    ? undefined
    : new Date(time).toISOString().slice(0, 10)
}

const item = {
  date:
    flags.date ??
    isoDay(
      meta(
        "article:published_time",
        "datepublished",
        "uploaddate",
        "date",
        "dc.date",
        "music:release_date",
      ) ??
        jsonLd("datePublished") ??
        jsonLd("uploadDate") ??
        html.match(/<time\b[^>]*\bdatetime\s*=\s*["']([^"']+)/i)?.[1],
    ),
  kind: flags.kind ?? guessKind(),
  outlet:
    flags.outlet ??
    oEmbed.author_name ??
    meta("og:site_name", "application-name") ??
    host,
  title:
    flags.title ??
    oEmbed.title ??
    meta("og:title", "twitter:title") ??
    (decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "") ||
      undefined),
  url,
  language: (
    flags.language ??
    html.match(/<html\b[^>]*\blang\s*=\s*["']?([A-Za-z-]+)/i)?.[1] ??
    meta("og:locale")?.replace("_", "-") ??
    ""
  )
    .split("-")[0]
    .toLowerCase(),
}
if (flags.guest) item.guest = flags.guest
if (flags.pin) item.pin = Number(flags.pin)

// Length of a video, podcast or broadcast, rounded to whole minutes.
const isoSeconds = (raw) => {
  const match = raw?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/)
  if (match)
    return (
      Number(match[1] ?? 0) * 3600 +
      Number(match[2] ?? 0) * 60 +
      Number(match[3] ?? 0)
    )
  return /^\d+$/.test(raw ?? "") ? Number(raw) : undefined
}
if (item.kind !== "article") {
  const seconds = isoSeconds(
    html.match(/"lengthSeconds"\s*:\s*"(\d+)"/)?.[1] ??
      meta("duration", "video:duration", "music:duration") ??
      jsonLd("duration"),
  )
  const minutes = flags.minutes
    ? Number(flags.minutes)
    : seconds && Math.max(1, Math.round(seconds / 60))
  if (minutes) item.minutes = minutes
}
// Page titles often end in the outlet's name ("… | Trending Topics"); the card
// shows the outlet separately.
if (!flags.title && item.title && item.outlet) {
  const suffix = new RegExp(
    `\\s+[|–—·-]\\s+${item.outlet.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
    "i",
  )
  item.title = item.title.replace(suffix, "")
}

const missing = []
if (!item.date || !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) missing.push("--date")
if (!kinds.includes(item.kind)) missing.push("--kind")
if (!item.title) missing.push("--title")
if (!item.language) missing.push("--language")
if (missing.length) {
  console.error(
    `Could not read ${missing.join(", ")} from the page; pass them as flags.`,
  )
  console.error(item)
  process.exit(1)
}

const normalise = (link) => link.replace(/#.*$/, "").replace(/\/$/, "")
const entries = JSON.parse(await readFile(target, "utf8"))
if (entries.some((entry) => normalise(entry.url) === normalise(url))) {
  console.error(`${url} is already in media.json.`)
  process.exit(1)
}

const youTubeId = /(^|\.)youtube\.com$/.test(host)
  ? new URL(url).searchParams.get("v")
  : host === "youtu.be"
    ? new URL(url).pathname.slice(1)
    : undefined
const imageSources = flags["no-image"]
  ? []
  : [
      flags.image,
      youTubeId && `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg`,
      oEmbed.thumbnail_url,
      meta("og:image", "og:image:url", "twitter:image"),
    ].filter(Boolean)
let picture
for (const source of imageSources) {
  try {
    const response = await fetch(new URL(source, url), {
      headers: { "User-Agent": "Mozilla/5.0 (dac8.org media list)" },
    })
    if (!response.ok) continue
    picture = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer()
    break
  } catch {}
}
if (picture) {
  const slug = `${item.date}-${host}-${youTubeId ?? new URL(url).pathname}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90)
    .replace(/-$/, "")
  item.image = `${slug}.webp`
} else if (!flags["no-image"]) {
  console.warn("No preview picture found; pass --image <url> to add one.")
}

console.log(item)
if (flags["dry-run"]) process.exit(0)
if (picture) {
  await mkdir(imageDirectory, { recursive: true })
  await writeFile(new URL(item.image, imageDirectory), picture)
}
entries.push(item)
entries.sort((a, b) => b.date.localeCompare(a.date))
await writeFile(target, `${JSON.stringify(entries, null, 2)}\n`)
console.log(
  "Added to src/data/media.json. Check title, outlet, date and picture against the page before committing.",
)
