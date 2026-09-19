import { publishedUpdates } from "@/data/updates"
import { feedFor, pathFor, type Language } from "@/lib/i18n"

const escapeXml = (text: string) =>
  text.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  )

export const campaignFeed = (language: Language, site: URL) => {
  const entries = publishedUpdates()
  const title =
    language === "en"
      ? "dac8.org — Austria: campaign updates"
      : "dac8.org — Österreich: Neuigkeiten zum Verfahren"
  const description =
    language === "en"
      ? "Updates on Bitcoin Austria’s challenge to indiscriminate financial data collection."
      : "Neuigkeiten zum Vorgehen von Bitcoin Austria gegen die anlasslose Erfassung von Finanzdaten."
  const link = new URL(pathFor("updates", language), site).href
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>${escapeXml(title)}</title><link>${escapeXml(link)}</link><description>${escapeXml(description)}</description><language>${language}</language>
<atom:link href="${escapeXml(new URL(feedFor(language), site).href)}" rel="self" type="application/rss+xml" />
${entries.length ? `<lastBuildDate>${new Date(entries[0].publishedAt).toUTCString()}</lastBuildDate>` : ""}
${entries
  .map((entry) => {
    const content = entry.translations[language]
    const url = `${link}#${entry.id}`
    return `<item><title>${escapeXml(content.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate><description>${escapeXml(content.text)}</description></item>`
  })
  .join("\n")}
</channel></rss>`
  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  })
}
