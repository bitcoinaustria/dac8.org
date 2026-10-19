import type { Language, Page } from "@/lib/i18n"

type PageMetadata = {
  title: string
  description: string
  imageLines: string[]
}

// Keep search snippets and sharing cards together, in both languages.
export const seo: Record<Page, Record<Language, PageMetadata>> = {
  home: {
    de: {
      title: "Gegen DAC8. Für finanzielle Privatsphäre",
      description:
        "DAC8 legt über jeden Krypto-Kunden eine Akte an, ohne Verdacht und in der ganzen EU. Prüf, ob du betroffen bist, und sieh, wie Bitcoin Austria dagegen vorgeht.",
      imageLines: ["Eine Akte über jeden", "Krypto-Kunden.", "Wir wehren uns."],
    },
    en: {
      title: "Against DAC8. For financial privacy",
      description:
        "DAC8 opens a file on every crypto customer, without suspicion and across the EU. Check whether you are affected and see how Bitcoin Austria is challenging it.",
      imageLines: [
        "A file on every",
        "crypto customer.",
        "We are fighting back.",
      ],
    },
  },
  dossier: {
    de: {
      title: "DAC8 erklärt: Meldepflichten, Risiken und Rechtsweg",
      description:
        "Was DAC8 in Österreich verlangt, welche Krypto-Daten Jahr für Jahr gemeldet werden, was sich beim Anbieter ansammelt und was mit solchen Daten passiert ist. Mit Primärquellen.",
      imageLines: ["Was DAC8 verlangt.", "Und was daraus wird."],
    },
    en: {
      title: "DAC8 explained: reporting, risks and legal challenge",
      description:
        "What DAC8 requires in Austria, which crypto-asset data is reported every year, what builds up at your provider and what has already happened to such data. With primary sources.",
      imageLines: ["What DAC8 requires.", "And where it leads."],
    },
  },
  arguments: {
    de: {
      title: "Sieben Gründe gegen DAC8 und was wir fordern",
      description:
        "Warum wir die anlasslose Erfassung aller Krypto-Kunden ablehnen: sieben Gründe vom Bargeld bis zur Zielliste, Antworten auf Einwände und fünf Forderungen.",
      imageLines: ["Sieben Gründe", "gegen DAC8."],
    },
    en: {
      title: "Seven reasons against DAC8, and what we demand",
      description:
        "Why we oppose collecting data on every crypto customer without suspicion: seven reasons from cash to target lists, answers to objections and five demands.",
      imageLines: ["Seven reasons", "against DAC8."],
    },
  },
  history: {
    de: {
      title: "Wie es zu DAC8 kam: die EU-Steueramtshilfe seit 1977",
      description:
        "Von der Amtshilfe 1977 bis zu jährlichen Meldepflichten für Banken, Plattformen und Krypto-Anbieter: DAC1 bis DAC9, die Neufassung und Österreich. Mit Primärquellen.",
      imageLines: ["Wie es zu DAC8 kam.", "Und was noch kommt."],
    },
    en: {
      title: "How we got to DAC8: EU tax cooperation since 1977",
      description:
        "From exchange on request in 1977 to annual reporting duties for banks, platforms and crypto-asset providers: DAC1 to DAC9, the recast and Austria. With primary sources.",
      imageLines: ["How we got to DAC8.", "And what comes next."],
    },
  },
  participate: {
    de: {
      title: "Die Kampagne gegen DAC8 unterstützen",
      description:
        "Hilf mit, finanzielle Privatsphäre zu verteidigen: Spende für das Verfahren, schreib deinen Abgeordneten, teile die Kampagne oder unterstütze als Organisation.",
      imageLines: ["Hilf mit,", "Privatsphäre zu", "verteidigen."],
    },
    en: {
      title: "Support the campaign against DAC8",
      description:
        "Help defend financial privacy: donate to the legal challenge, write to your MPs, share the campaign or support it as an organisation.",
      imageLines: ["Help defend", "financial privacy."],
    },
  },
  attacks: {
    de: {
      title: "Angriffsarchiv: Angriffe auf Krypto-Besitzer weltweit",
      description:
        "Bekannte körperliche Angriffe auf Menschen, die Kryptowerte besitzen oder besitzen sollen, weltweit und jeweils mit dem ursprünglichen Bericht. Bei Weitem nicht vollständig.",
      imageLines: ["Angriffe auf", "Krypto-Besitzer,", "weltweit."],
    },
    en: {
      title: "Attack archive: attacks on crypto holders worldwide",
      description:
        "Known physical attacks on people who hold crypto-assets, or are believed to, worldwide and each with the original report. Far from complete.",
      imageLines: ["Attacks on", "crypto holders,", "worldwide."],
    },
  },
  leaks: {
    de: {
      title: "Datenlecks: wenn Daten über Krypto-Besitz verloren gehen",
      description:
        "Belegte Datenlecks bei Krypto-Anbietern, Steuertools, Behörden und ihren Dienstleistern, von Ledger bis zum Kontenaustausch der Steuerbehörden. Mit Primärquellen.",
      imageLines: ["Wenn Daten über", "Vermögen verloren", "gehen."],
    },
    en: {
      title: "Data leaks: when data on crypto holdings gets lost",
      description:
        "Documented data leaks at crypto providers, tax tools, authorities and their service providers, from Ledger to the tax authorities’ account exchange. With primary sources.",
      imageLines: ["When data", "on holdings", "gets lost."],
    },
  },
  proceedings: {
    de: {
      title: "DAC8-Verfahren: Beschwerde, Rechtsweg und Presse",
      description:
        "Bitcoin Austria lässt DAC8 prüfen: die Beschwerde bei der Datenschutzbehörde, der mögliche Weg bis zum EuGH, Pressekontakte und Neuigkeiten per RSS.",
      imageLines: ["Unsere Beschwerde", "gegen DAC8", "ist eingebracht."],
    },
    en: {
      title: "DAC8 legal challenge: complaint, route and press",
      description:
        "Bitcoin Austria is challenging DAC8: the complaint to Austria’s Data Protection Authority, the possible route to the CJEU, press contacts and updates via RSS.",
      imageLines: ["Our complaint", "against DAC8", "has been filed."],
    },
  },
  legal: {
    de: {
      title: "Impressum",
      description:
        "Impressum und Offenlegung nach ECG und MedienG. dac8.org ist eine Initiative des gemeinnützigen Vereins Bitcoin Austria.",
      imageLines: ["Impressum."],
    },
    en: {
      title: "Legal notice",
      description:
        "Legal notice and disclosures under Austrian law. dac8.org is an initiative by the nonprofit association Bitcoin Austria.",
      imageLines: ["Legal notice."],
    },
  },
  privacy: {
    de: {
      title: "Datenschutzerklärung",
      description:
        "Keine Cookies, keine Nutzerprofile, keine Unterstützerliste. Was dac8.org verarbeitet und was nicht, nach DSGVO.",
      imageLines: ["Deine Daten", "auf dac8.org."],
    },
    en: {
      title: "Privacy notice",
      description:
        "No cookies, no user profiles and no supporter list. What dac8.org processes and what it does not, under the GDPR.",
      imageLines: ["Your data", "on dac8.org."],
    },
  },
}

export const ogImagePath = (page: Page, language: Language) =>
  `/og/${language}/${page}.png`
