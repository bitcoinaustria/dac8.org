export const SITE = {
  title: "dac8.org",
  description:
    "Gegen die anlasslose Erfassung von Krypto-Finanzdaten – eine Initiative von Bitcoin Austria.",
  locale: "de-AT",
  dir: "ltr",
  defaultPageImage: "/static/opengraph-image.png",
} as const

export type PageSection = { id: string; label: string }
