// Fetches Jameson Lopp's public-domain list of known physical attacks on
// crypto-asset holders and keeps the fields the site shows. Victim names stay
// out. .github/workflows/sync-attacks.yml runs this every week and opens a
// pull request when the list has changed.
import { readdir, readFile, writeFile } from "node:fs/promises"

const source =
  "https://raw.githubusercontent.com/jlopp/physical-bitcoin-attacks/master/attacks.json"
const target = new URL("../src/data/attacks.json", import.meta.url)

const response = await fetch(source)
if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`)
const upstream = await response.json()

const isoDate = (raw) => {
  const time = Date.parse(`${raw} 12:00 UTC`)
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10)
}

const archiveHosts = [
  "archive.is",
  "archive.ph",
  "archive.today",
  "archive.org",
]
const isArchive = (url) => {
  try {
    const host = new URL(url).hostname
    return archiveHosts.some(
      (archive) => host === archive || host.endsWith(`.${archive}`),
    )
  } catch {
    return false
  }
}

// Upstream lists each report as a headline link (usually an archive copy)
// followed by "(original link)" to the publisher. Keep both, so every case
// leads straight to the original report.
const reportsOf = (links = []) => {
  const reports = []
  for (const { label = "", url = "" } of links) {
    const href = url.trim()
    const startsReport = !label.trim().startsWith("(") || reports.length === 0
    if (startsReport) reports.push({ url: null, archive: null })
    const report = reports.at(-1)
    if (!href) continue
    if (isArchive(href)) report.archive ??= href
    else report.url ??= href
  }
  return reports.filter((report) => report.url || report.archive)
}

const attacks = upstream.map((entry, index) => {
  const headline = entry.links?.find(
    (link) => link.label && !link.label.trim().startsWith("("),
  )?.label
  const attack = {
    date: isoDate(entry.date?.raw?.trim() ?? ""),
    year: entry.date?.year,
    city: entry.city?.trim() || null,
    country: entry.country?.trim() || null,
    countryCode: entry.country_code?.trim() || null,
    lat: Math.round(entry.lat * 100) / 100,
    lng: Math.round(entry.lng * 100) / 100,
    headline: headline?.trim() || null,
    reports: reportsOf(entry.links),
  }
  if (
    !Number.isInteger(attack.year) ||
    !Number.isFinite(attack.lat) ||
    !Number.isFinite(attack.lng)
  )
    throw new Error(`Entry ${index} lacks a year or coordinates`)
  return attack
})

// A sudden drop points to a broken upstream file, not to fewer attacks.
if (attacks.length < 300)
  throw new Error(`Only ${attacks.length} entries; refusing to overwrite`)

await writeFile(target, `${JSON.stringify(attacks, null, 2)}\n`)
console.log(`Wrote ${attacks.length} attacks to src/data/attacks.json`)

// Translations are keyed by the English description (see
// src/data/attacks-translation.md). New or edited descriptions show in English
// until someone translates them, so list them for the pull request.
const dataDirectory = new URL("../src/data/", import.meta.url)
for (const file of await readdir(dataDirectory)) {
  if (!/^attacks\.[a-z]{2}\.json$/.test(file)) continue
  const translations = JSON.parse(
    await readFile(new URL(file, dataDirectory), "utf8"),
  )
  const missing = attacks.filter(
    (attack) => attack.headline && !translations[attack.headline],
  )
  if (missing.length === 0) continue
  console.log(`\n${missing.length} descriptions lack a translation in ${file}:`)
  for (const attack of missing)
    console.log(`- ${attack.date ?? attack.year}: ${attack.headline}`)
}
