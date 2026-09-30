export type Language = "de" | "en"

// Language and jurisdiction are separate: both languages describe Austria.
export const campaign = {
  region: "AT",
  newsletter: "https://bitcoin-austria.at/#newsletter",
} as const

// URLs follow the navigation labels. Donating is a section of the
// participation page, reachable everywhere through donateFor().
export const routes = {
  home: { de: "/", en: "/en/" },
  dossier: { de: "/dossier/", en: "/en/dossier/" },
  proceedings: { de: "/verfahren/", en: "/en/proceedings/" },
  participate: { de: "/mitmachen/", en: "/en/get-involved/" },
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
export const donateFor = (language: Language) =>
  `${pathFor("participate", language)}#spenden`
export const shareKitFor = (language: Language) =>
  `${pathFor("participate", language)}#teilen`
export const feedFor = (language: Language) =>
  language === "en" ? "/en/feed.xml" : "/feed.xml"
// Main navigation. Donating is a separate, always visible action.
export const navigationFor = (language: Language) => [
  {
    href: pathFor("home", language),
    label: language === "en" ? "Home" : "Start",
  },
  { href: pathFor("dossier", language), label: "Dossier" },
  {
    href: pathFor("proceedings", language),
    label: language === "en" ? "Proceedings" : "Verfahren",
  },
  {
    href: pathFor("participate", language),
    label: language === "en" ? "Get involved" : "Mitmachen",
  },
]
