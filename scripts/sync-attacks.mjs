// Fetches Jameson Lopp's public-domain list of known physical attacks on
// crypto-asset holders and keeps the fields the site shows. Victim names stay
// out. .github/workflows/sync-attacks.yml runs this every week and opens a
// pull request when the list has changed.
import { writeFile } from "node:fs/promises"

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

const attacks = upstream.map((entry, index) => {
  const link =
    entry.links?.find((candidate) => !candidate.label.startsWith("(")) ??
    entry.links?.[0]
  const attack = {
    date: isoDate(entry.date?.raw?.trim() ?? ""),
    year: entry.date?.year,
    city: entry.city?.trim() || null,
    country: entry.country?.trim() || null,
    countryCode: entry.country_code?.trim() || null,
    lat: Math.round(entry.lat * 100) / 100,
    lng: Math.round(entry.lng * 100) / 100,
    headline: link?.label.trim() ?? null,
    url: link?.url ?? null,
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
