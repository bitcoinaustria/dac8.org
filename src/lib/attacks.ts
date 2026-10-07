import de from "@/data/attacks.de.json"
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

// Translations are keyed by the English description, so one that Lopp has
// since edited stops matching and the case shows the current English text.
const translations: Partial<Record<Language, Record<string, string>>> = { de }

export const headlineOf = (attack: Attack, language: Language) => {
  const english = attack.headline ?? ""
  const translated = translations[language]?.[english]
  return translated
    ? { text: translated, lang: language }
    : { text: english, lang: "en" }
}

// The publisher's domain, shown as the link text so readers see where a
// report comes from.
export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
