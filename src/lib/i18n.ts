export type Language = "de" | "en"

// Language and jurisdiction are separate: both languages describe Austria.
export const campaign = {
  region: "AT",
  newsletter: "https://bitcoin-austria.at/#newsletter",
} as const

export const routes = {
  home: { de: "/", en: "/en/" },
  background: { de: "/hintergrund/", en: "/en/background/" },
  support: { de: "/handeln/", en: "/en/support/" },
  donate: { de: "/spenden/", en: "/en/donate/" },
  updates: { de: "/aktuelles/", en: "/en/updates/" },
  legal: { de: "/impressum/", en: "/en/legal/" },
  privacy: { de: "/datenschutz/", en: "/en/privacy/" },
} as const
export type Page = keyof typeof routes
export const languageFor = (pathname: string): Language =>
  pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de"
export const pathFor = (page: Page, language: Language) =>
  routes[page][language]
export const pageFor = (pathname: string): Page | undefined => {
  const normalized = pathname.replace(/\/$/, "") || "/"
  return (Object.keys(routes) as Page[]).find((page) =>
    Object.values(routes[page]).some(
      (path) => (path.replace(/\/$/, "") || "/") === normalized,
    ),
  )
}
export const feedFor = (language: Language) =>
  language === "en" ? "/en/feed.xml" : "/feed.xml"
// Main navigation. Donating is a separate, always visible action.
export const navigationFor = (language: Language) => [
  {
    href: pathFor("home", language),
    label: language === "en" ? "Home" : "Start",
  },
  { href: pathFor("background", language), label: "Dossier" },
  {
    href: pathFor("updates", language),
    label: language === "en" ? "Proceedings" : "Verfahren",
  },
  {
    href: pathFor("support", language),
    label: language === "en" ? "Get involved" : "Mitmachen",
  },
]
