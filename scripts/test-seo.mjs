import assert from "node:assert/strict"
import { readFileSync, readdirSync, existsSync } from "node:fs"
import { join } from "node:path"
import sharp from "sharp"

// Inspect the shipped output, not the metadata configuration.
const origin = "https://dac8.org"
const read = (path) => readFileSync(join("dist", path), "utf8")
const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))].map(([tag]) =>
    Object.fromEntries(
      [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [
        key,
        value,
      ]),
    ),
  )
const pages = new Map()
function collect(directory = "") {
  for (const entry of readdirSync(join("dist", directory), {
    withFileTypes: true,
  })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) collect(path)
    else if (entry.name === "index.html") {
      pages.set(`/${directory}${directory ? "/" : ""}`, read(path))
    }
  }
}
collect()
assert.equal(pages.size, 16, "Expected eight pages in both languages")
const titles = new Set()
const descriptions = new Set()
const imagePaths = new Set()
for (const [path, html] of pages) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
  const meta = tags(head, "meta")
  const content = (name) => {
    const matches = meta.filter(
      (tag) => tag.name === name || tag.property === name,
    )
    assert.equal(matches.length, 1, `${path}: exactly one ${name}`)
    return matches[0].content
  }
  const links = tags(head, "link")
  const canonicals = links.filter((tag) => tag.rel === "canonical")
  assert.equal(canonicals.length, 1)
  const canonical = `${origin}${path}`
  assert.equal(canonicals[0].href, canonical)
  assert.equal(content("og:url"), canonical)
  const titleTags = [...head.matchAll(/<title>(.*?)<\/title>/g)]
  assert.equal(titleTags.length, 1)
  const title = titleTags[0][1]
  assert.ok(title.length > 15 && title.endsWith(" | dac8.org"), path)
  assert.ok(!titles.has(title), `${path}: duplicate title`)
  titles.add(title)
  const description = content("description")
  assert.ok(description.length > 50 && description.length < 180, path)
  assert.ok(!descriptions.has(description), `${path}: duplicate description`)
  descriptions.add(description)
  assert.equal(content("og:description"), description)
  assert.equal(content("twitter:description"), description)
  assert.equal(content("twitter:title"), content("og:title"))
  assert.equal(content("twitter:card"), "summary_large_image")
  assert.equal(content("twitter:site"), "@bitcoin_at")
  assert.ok(!content("robots").includes("noindex"))
  const language = path.startsWith("/en/") ? "en" : "de"
  assert.equal(tags(html, "html")[0].lang, language === "en" ? "en" : "de-AT")
  assert.equal(content("og:locale"), language === "en" ? "en_GB" : "de_AT")
  assert.equal(
    content("og:locale:alternate"),
    language === "en" ? "de_AT" : "en_GB",
  )
  const alternates = links.filter((tag) => tag.hreflang)
  assert.equal(alternates.length, 3)
  for (const lang of ["de", "en", "x-default"]) {
    const alternate = alternates.find((tag) => tag.hreflang === lang)
    assert.ok(alternate?.href.startsWith(origin))
    const target = new URL(alternate.href).pathname
    assert.ok(pages.has(target), `${path}: missing translation ${target}`)
    const reciprocal = tags(pages.get(target), "link").find(
      (tag) => tag.hreflang === language,
    )
    assert.equal(reciprocal.href, canonical, `${path}: non-reciprocal hreflang`)
  }
  assert.equal(
    alternates.find((tag) => tag.hreflang === "x-default").href,
    alternates.find((tag) => tag.hreflang === "de").href,
  )

  const imageUrl = new URL(content("og:image"))
  assert.equal(imageUrl.origin, origin)
  assert.ok(imageUrl.pathname.startsWith(`/og/${language}/`))
  assert.equal(content("twitter:image"), imageUrl.href)
  assert.ok(content("og:image:alt").length > 10)
  assert.equal(content("og:image:alt"), content("twitter:image:alt"))
  imagePaths.add(imageUrl.pathname)
  const image = sharp(join("dist", imageUrl.pathname))
  const info = await image.metadata()
  assert.equal(info.format, "png")
  assert.equal(info.width, Number(content("og:image:width")))
  assert.equal(info.height, Number(content("og:image:height")))
  assert.equal(info.width, 1200)
  assert.equal(info.height, 630)
  const stats = await image.stats()
  assert.ok(
    stats.channels
      .slice(0, 3)
      .every((channel) => channel.min < 50 && channel.max > 240),
    `${path}: image must contain visible text on a light background`,
  )

  const json = [
    ...head.matchAll(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g,
    ),
  ]
  assert.equal(json.length, 1)
  const graph = JSON.parse(json[0][1])["@graph"]
  const page = graph.find((entry) => entry["@type"] === "WebPage")
  assert.equal(page.url, canonical)
  assert.equal(page.primaryImageOfPage.url, imageUrl.href)
  assert.equal(page.publisher.name, "Bitcoin Austria")
  if (path === "/" || path === "/en/") {
    const site = graph.find((entry) => entry["@type"] === "WebSite")
    assert.equal(site.url, `${origin}/`)
    assert.equal(site["@id"], page.isPartOf["@id"])
  }
}
assert.equal(imagePaths.size, 16, "Every page has a localized sharing image")
const sitemap = read("sitemap-0.xml")
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(
  ([, url]) => url,
)
assert.deepEqual(
  locations.sort(),
  [...pages.keys()].map((path) => `${origin}${path}`).sort(),
)
assert.ok(read("robots.txt").includes(`Sitemap: ${origin}/sitemap-index.xml`))
assert.ok(read("404.html").includes('content="noindex, nofollow"'))
assert.ok(!existsSync("dist/static/opengraph-source.html"))
for (const line of read("_redirects").split("\n")) {
  if (!line.trim() || line.startsWith("#")) continue
  const [source, target, status] = line.trim().split(/\s+/)
  assert.equal(status, "301")
  const url = new URL(target, origin)
  if (imagePaths.has(url.pathname)) continue
  assert.ok(pages.has(url.pathname), `${source}: redirect target missing`)
  if (url.hash)
    assert.ok(
      pages.get(url.pathname).includes(`id="${url.hash.slice(1)}"`),
      `${source}: anchor missing`,
    )
}
console.log(
  "Passed: 16 pages and sharing images, unique metadata, canonical URLs, reciprocal hreflang, JSON-LD, sitemap, robots and short redirects.",
)
