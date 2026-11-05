// The European front: member states where a case against DAC8 is pending,
// for the map and the cards on the proceedings page. Add a country only once
// a case has actually been filed and is publicly sourced, ideally by the
// court or authority itself, and state its status as the record shows it.
// Never imply an outcome, a referral or a timeline. Keep the list in step
// with Bull Bitcoin's map at dac8.com/en/european-front/, so the two
// campaigns never disagree about where things stand.

// The 27 member states by ISO 3166 numeric code, as world-atlas names them.
export const memberStates = [
  "040", // Austria
  "056", // Belgium
  "100", // Bulgaria
  "191", // Croatia
  "196", // Cyprus
  "203", // Czechia
  "208", // Denmark
  "233", // Estonia
  "246", // Finland
  "250", // France
  "276", // Germany
  "300", // Greece
  "348", // Hungary
  "372", // Ireland
  "380", // Italy
  "428", // Latvia
  "440", // Lithuania
  "442", // Luxembourg
  "470", // Malta
  "528", // Netherlands
  "616", // Poland
  "620", // Portugal
  "642", // Romania
  "703", // Slovakia
  "705", // Slovenia
  "724", // Spain
  "752", // Sweden
] as const

type Segment = string | { text: string; href: string; hreflang?: string }

interface Case {
  country: string
  date: string
  forum: string
  text: Segment[]
  link?: { text: string; href: string }
}

export interface Challenge {
  id: (typeof memberStates)[number]
  // ISO 3166 two-letter code, beside the case in the list.
  code: string
  // Month the case was filed, for the order of the cards.
  filed: string
  // Where the country's pin sits on the map, as longitude and latitude.
  label: [number, number]
  // Which side of the pin its name goes, where the other side is crowded.
  side?: "left" | "right"
  de: Case
  en: Case
}

export const challenges: Challenge[] = [
  {
    id: "250",
    code: "FR",
    filed: "2026-02",
    label: [2.4, 46.6],
    side: "left",
    de: {
      country: "Frankreich",
      date: "Februar 2026",
      forum: "Conseil d’État",
      text: [
        "Bull Bitcoin will das Dekret aufheben lassen, mit dem Frankreich DAC8 umsetzt. Eine ",
        {
          text: "Aussetzung im Eilverfahren",
          href: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-09-14/519158",
          hreflang: "fr",
        },
        " lehnte das Gericht ab, über die Aufhebung ist nicht entschieden.",
      ],
      link: {
        text: "Zur Klage auf dac8.com",
        href: "https://dac8.com/de/resources/legal-action-conseil-etat/",
      },
    },
    en: {
      country: "France",
      date: "February 2026",
      forum: "Conseil d’État",
      text: [
        "Bull Bitcoin seeks to annul the decree that implements DAC8 in France. The court ",
        {
          text: "refused an emergency suspension",
          href: "https://www.conseil-etat.fr/fr/arianeweb/CE/decision/2026-09-14/519158",
          hreflang: "fr",
        },
        "; the annulment is still pending.",
      ],
      link: {
        text: "The case on dac8.com",
        href: "https://dac8.com/en/resources/legal-action-conseil-etat/",
      },
    },
  },
  {
    id: "040",
    code: "AT",
    filed: "2026-10",
    label: [14.4, 47.6],
    de: {
      country: "Österreich",
      date: "Oktober 2026",
      forum: "Datenschutzbehörde",
      text: [
        "Beschwerde von Rechtsanwalt Dr. Oliver Völkel, auf Initiative von Bitcoin Austria. Unser Ziel ist der Europäische Gerichtshof.",
      ],
    },
    en: {
      country: "Austria",
      date: "October 2026",
      forum: "Data Protection Authority",
      text: [
        "A complaint by attorney Dr Oliver Völkel, at Bitcoin Austria’s initiative. Our aim is the Court of Justice of the EU.",
      ],
    },
  },
]
