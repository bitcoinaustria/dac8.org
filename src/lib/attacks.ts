import attacks from "@/data/attacks.json"
import type { Language } from "@/lib/i18n"

export type Attack = (typeof attacks)[number]

export { attacks }

// The collection runs into the current year, so its last year is incomplete.
export const latestYear = Math.max(...attacks.map((attack) => attack.year))

export const countIn = (year: number, countryCodes?: readonly string[]) =>
  attacks.filter(
    (attack) =>
      attack.year === year &&
      (!countryCodes ||
        (attack.countryCode !== null &&
          countryCodes.includes(attack.countryCode))),
  ).length

export const euCountries = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
] as const

export const latestDate = attacks
  .map((attack) => attack.date)
  .filter((date): date is string => date !== null)
  .sort()
  .at(-1)

export const formatDate = (date: string, language: Language, withYear = true) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString(
    language === "en" ? "en-GB" : "de-AT",
    {
      day: "numeric",
      month: "long",
      ...(withYear && { year: "numeric" }),
      timeZone: "UTC",
    },
  )

export const placeOf = (attack: Attack, language: Language) => {
  const regions = new Intl.DisplayNames([language], { type: "region" })
  const country =
    (attack.countryCode && regions.of(attack.countryCode)) ?? attack.country
  return attack.city && attack.city !== country
    ? `${attack.city}, ${country}`
    : (country ?? "")
}

// Equal Earth projection (Šavrič, Patterson and Jenny 2018): continents keep
// their true relative size, so clusters are not exaggerated towards the poles.
const A1 = 1.340264
const A2 = -0.081106
const A3 = 0.000893
const A4 = 0.003796
const M = Math.sqrt(3) / 2
const scale = 180

export const project = (lng: number, lat: number): [number, number] => {
  const lambda = (lng * Math.PI) / 180
  const theta = Math.asin(M * Math.sin((lat * Math.PI) / 180))
  const t2 = theta * theta
  const t6 = t2 * t2 * t2
  const x =
    (2 * Math.sqrt(3) * lambda * Math.cos(theta)) /
    (3 * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)))
  const y = theta * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))
  return [x * scale, -y * scale]
}
