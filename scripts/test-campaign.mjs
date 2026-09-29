import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import vm from "node:vm"
import ts from "typescript"

// Run the actual TypeScript modules with an isolated module cache so fixtures
// cannot reach the public update data or change the generated site.
const cache = new Map()
function load(name) {
  const filename = resolve("src", `${name.replace(/^@\//, "")}.ts`)
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  vm.runInNewContext(
    compiled,
    { module, exports: module.exports, require: load, URL, Response, Date },
    { filename },
  )
  return module.exports
}
const { routes, languageFor, pageFor, pathFor } = load("@/lib/i18n")
for (const [page, languages] of Object.entries(routes)) {
  for (const [language, path] of Object.entries(languages)) {
    assert.equal(languageFor(path), language)
    assert.equal(pageFor(path), page)
    assert.equal(pageFor(path.replace(/\/$/, "")), page)
    assert.equal(pathFor(page, language), path)
  }
}
assert.equal(pageFor("/missing/"), undefined)
assert.equal(languageFor("/enough/"), "de")

const { updates, publishedUpdates } = load("@/data/updates")
const { campaignFeed } = load("@/lib/feed")
const site = new URL("https://dac8.org/")
const emptyFeed = campaignFeed("en", site)
assert.equal(
  emptyFeed.headers.get("Content-Type"),
  "application/rss+xml; charset=utf-8",
)
assert.ok(!(await emptyFeed.text()).includes("<item>"))
const make = (id, date) => ({
  id,
  publishedAt: date,
  translations: {
    de: { title: "Prüfung & <Stand>", text: 'Ein "Zitat" & ein <Zeichen>.' },
    en: { title: "Review & <status>", text: 'A "quote" & a <tag>.' },
  },
})
updates.push(
  make("older", "2020-01-01T10:00:00Z"),
  make("future", "2999-01-01T00:00:00Z"),
  make("newer", "2021-01-01T10:00:00Z"),
)
assert.equal(
  publishedUpdates(new Date("2022-01-01"))
    .map((entry) => entry.id)
    .join(","),
  "newer,older",
)
for (const language of ["de", "en"]) {
  const xml = await campaignFeed(language, site).text()
  const base =
    language === "en"
      ? "https://dac8.org/en/proceedings/"
      : "https://dac8.org/verfahren/"
  assert.equal((xml.match(/<item>/g) ?? []).length, 2)
  assert.ok(!xml.includes("#future"))
  assert.ok(xml.indexOf("#newer") < xml.indexOf("#older"))
  assert.ok(xml.includes(`<guid isPermaLink="true">${base}#newer</guid>`))
  assert.ok(
    xml.includes("&amp;") && xml.includes("&lt;") && xml.includes("&quot;"),
  )
  assert.ok(
    xml.includes(
      language === "en"
        ? "Review &amp; &lt;status&gt;"
        : "Prüfung &amp; &lt;Stand&gt;",
    ),
  )
}
console.log(
  "Passed: locale routing, unknown routes, empty feeds, language-specific URLs, publication dates, ordering, stable GUIDs and XML escaping.",
)
