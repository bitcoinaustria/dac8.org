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

// Lopp's geocoder writes places in the local script or in English. Readers
// get a Latin name, and the German name where German usage differs; a plain
// string serves both languages. Only places that occur in the data are
// listed.
const cityNames: Record<string, string | Record<Language, string>> = {
  // English names with a German exonym
  Abkhazia: { de: "Abchasien", en: "Abkhazia" },
  Brussels: { de: "Brüssel", en: "Brussels" },
  București: { de: "Bukarest", en: "Bucharest" },
  "Ho Chi Minh City": { de: "Ho-Chi-Minh-Stadt", en: "Ho Chi Minh City" },
  Ivanovo: { de: "Iwanowo", en: "Ivanovo" },
  Kharkiv: { de: "Charkiw", en: "Kharkiv" },
  Kraków: { de: "Krakau", en: "Kraków" },
  Krasnoyarsk: { de: "Krasnojarsk", en: "Krasnoyarsk" },
  Kyiv: { de: "Kiew", en: "Kyiv" },
  "Leningrad Oblast": { de: "Oblast Leningrad", en: "Leningrad Oblast" },
  Milan: { de: "Mailand", en: "Milan" },
  Moscow: { de: "Moskau", en: "Moscow" },
  Munich: { de: "München", en: "Munich" },
  Nice: { de: "Nizza", en: "Nice" },
  Nicosia: { de: "Nikosia", en: "Nicosia" },
  Normandy: { de: "Normandie", en: "Normandy" },
  Novosibirsk: { de: "Nowosibirsk", en: "Novosibirsk" },
  Roma: { de: "Rom", en: "Rome" },
  "Saint Petersburg": { de: "Sankt Petersburg", en: "Saint Petersburg" },
  Sukhumi: { de: "Suchumi", en: "Sukhumi" },
  Tbilisi: { de: "Tiflis", en: "Tbilisi" },
  Torino: { de: "Turin", en: "Turin" },
  València: "Valencia",
  Vienna: { de: "Wien", en: "Vienna" },
  Zaporizhzhia: { de: "Saporischschja", en: "Zaporizhzhia" },
  "Gyeonggi Province": { de: "Provinz Gyeonggi", en: "Gyeonggi Province" },
  // Administrative names where the place name is enough
  "Andijon shahri": "Andijon",
  "Bogotá ciudad": "Bogotá",
  "Falköpings kommun": "Falköping",
  "Grad Zagreb": "Zagreb",
  "Majlis Perbandaran Kajang": "Kajang",
  "Municipio de Resistencia": "Resistencia",
  "Perímetro Urbano Barranquilla": "Barranquilla",
  // Local scripts
  "Casablanca ⵜⴰⴷⴷⴰⵔⵜ ⵜⵓⵎⵍⵉⵍⵜ الدار البيضاء": "Casablanca",
  الرياض: { de: "Riad", en: "Riyadh" },
  دبي: "Dubai",
  "استان کرمان": { de: "Provinz Kerman", en: "Kerman Province" },
  "دهستان لاریجان سفلی": "Larijan-e Sofla",
  "شهر تهران": { de: "Teheran", en: "Tehran" },
  "شهر مشهد": { de: "Maschhad", en: "Mashhad" },
  חולון: "Holon",
  חיפה: "Haifa",
  "קרית ביאליק": "Kiryat Bialik",
  "ראשון לציון": "Rishon LeZion",
  "תל מונד": "Tel Mond",
  "Δημοτική Ενότητα Αναβύσσου": "Anavyssos",
  Երևան: { de: "Eriwan", en: "Yerevan" },
  Анапа: "Anapa",
  Банкя: "Bankya",
  Београд: { de: "Belgrad", en: "Belgrade" },
  Богданлия: "Bogdanliya",
  Борова: "Borova",
  Волгоград: { de: "Wolgograd", en: "Volgograd" },
  "Дубоссарский городской совет": "Dubăsari",
  Запоріжжя: { de: "Saporischschja", en: "Zaporizhzhia" },
  Казань: { de: "Kasan", en: "Kazan" },
  Калининград: "Kaliningrad",
  Магистральный: "Magistralny",
  "Московская область": { de: "Oblast Moskau", en: "Moscow Oblast" },
  Мытищи: { de: "Mytischtschi", en: "Mytishchi" },
  Мінск: "Minsk",
  Никольское: { de: "Nikolskoje", en: "Nikolskoye" },
  Одеса: "Odessa",
  "Општина Горњи Милановац": "Gornji Milanovac",
  "Советул орэшенеск Бендер / Бендерский городской совет / Бендерська міська рада":
    "Bender",
  Удомля: { de: "Udomlja", en: "Udomlya" },
  "Усолье-Сибирское": { de: "Ussolje-Sibirskoje", en: "Usolye-Sibirskoye" },
  Уссурийск: { de: "Ussurijsk", en: "Ussuriysk" },
  "Хабаровский край": { de: "Region Chabarowsk", en: "Khabarovsk Krai" },
  "Челябинский городской округ": { de: "Tscheljabinsk", en: "Chelyabinsk" },
  Шекшема: { de: "Schekschema", en: "Shekshema" },
  Шымкент: { de: "Schymkent", en: "Shymkent" },
  Южноуральск: { de: "Juschnouralsk", en: "Yuzhnouralsk" },
  "городской округ Ижевск": { de: "Ischewsk", en: "Izhevsk" },
  ગાંધીધામ: "Gandhidham",
  ตำบลฉลอง: "Chalong",
  หนองปรือ: "Nong Prue",
  องค์การบริหารส่วนตำบลบางพลีใหญ่: "Bang Phli Yai",
  乐山市: "Leshan",
  名古屋市: "Nagoya",
  嘉義市: "Chiayi",
  嘉義縣: { de: "Landkreis Chiayi", en: "Chiayi County" },
  宁德市: "Ningde",
  宜春市: "Yichun",
  新北市: { de: "Neu-Taipeh", en: "New Taipei" },
  新竹市: "Hsinchu",
  東京都: { de: "Tokio", en: "Tokyo" },
  桃園市: "Taoyuan",
  武汉市: "Wuhan",
  河北省: "Hebei",
  温州市: "Wenzhou",
  漳州市: "Zhangzhou",
  福州市: "Fuzhou",
  竹南鎮: "Zhunan",
  臺中市: "Taichung",
  臺北市: { de: "Taipeh", en: "Taipei" },
  臺南市: "Tainan",
  苗栗市: "Miaoli",
  苗栗縣: { de: "Landkreis Miaoli", en: "Miaoli County" },
  贺州市: "Hezhou",
  高雄市: "Kaohsiung",
  경기도: { de: "Provinz Gyeonggi", en: "Gyeonggi Province" },
  고양시: "Goyang",
  안양시: "Anyang",
  용인시: "Yongin",
  인천광역시: "Incheon",
}

const cityOf = (city: string, language: Language) => {
  const name = cityNames[city] ?? city
  return typeof name === "string" ? name : name[language]
}

// The map labels hundreds of cases, so each language builds its country
// names once.
const regionNames = new Map<Language, Intl.DisplayNames>()
const regionsIn = (language: Language) => {
  const known = regionNames.get(language)
  if (known) return known
  const regions = new Intl.DisplayNames([language], { type: "region" })
  regionNames.set(language, regions)
  return regions
}

export const placeOf = (attack: Attack, language: Language) => {
  const country =
    (attack.countryCode && regionsIn(language).of(attack.countryCode)) ??
    attack.country
  // Some entries give only the country, written as the city.
  const city =
    attack.city && attack.city !== attack.country
      ? cityOf(attack.city, language)
      : null
  return city && city !== country ? `${city}, ${country}` : (country ?? "")
}

// Translations are keyed by the English description, so one that Lopp has
// since edited stops matching and the case shows the current English text.
const translations: Partial<Record<Language, Record<string, string>>> = { de }

// One upstream case has no description at all; it keeps its report link.
const noDescription: Record<Language, string> = {
  de: "Keine Beschreibung in der Quelle; siehe verlinkten Bericht.",
  en: "No description in the source; see the linked report.",
}

export const headlineOf = (attack: Attack, language: Language) => {
  const english = attack.headline
  if (!english) return { text: noDescription[language], lang: language }
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
