export const SITE = {
  title: "dac8.org",
  description:
    "Klare Grenzen für DAC8 und staatliche Finanzdaten – eine Initiative von Bitcoin Austria.",
  locale: "de-AT",
  dir: "ltr",
  defaultPageImage: "/static/opengraph-image.png",
} as const

/** Seiten der Hauptnavigation. Abschnitte einer Seite reicht jede Seite
 *  selbst über die `sections`-Prop des Layouts an die Seitenleiste durch. */
export const NAVIGATION = [
  { href: "/", label: "Start" },
  { href: "/hintergrund/", label: "Hintergrund" },
  { href: "/handeln/", label: "Handeln" },
  { href: "/spenden/", label: "Spenden" },
] as const

export type PageSection = { id: string; label: string }
