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
        "DAC8 erfasst die Finanzdaten aller Krypto-Kunden, Jahr für Jahr und ohne Verdacht. Bitcoin Austria geht rechtlich gegen diese finanzielle Massenüberwachung vor.",
      imageLines: ["DAC8 erfasst jeden", "Krypto-Kunden.", "Wir wehren uns."],
    },
    en: {
      title: "Against DAC8. For financial privacy",
      description:
        "DAC8 records the financial data of every crypto customer, every year and without suspicion. Bitcoin Austria is challenging this mass surveillance in the courts.",
      imageLines: ["DAC8 records every", "crypto customer.", "We fight back."],
    },
  },
  dossier: {
    de: {
      title: "DAC8 erklärt: was gemeldet wird und was beim Anbieter bleibt",
      description:
        "Wer betroffen ist, was jedes Jahr ans Finanzamt geht, was beim Anbieter bleibt und wer die Daten wie lange speichert. Die Krypto-Meldepflicht in Österreich, mit Primärquellen.",
      imageLines: ["Was DAC8 verlangt.", "Belegt mit Quellen."],
    },
    en: {
      title: "DAC8 explained: what is reported and what the provider keeps",
      description:
        "Who is affected, what goes to the tax office each year, what stays with the provider and who keeps the data for how long. Crypto-asset reporting in Austria, with primary sources.",
      imageLines: ["What DAC8 requires.", "Backed by sources."],
    },
  },
  arguments: {
    de: {
      title: "Argumente gegen DAC8: was wir ablehnen und fordern",
      description:
        "Warum wir die anlasslose Erfassung aller Krypto-Kunden ablehnen: Sicherheit, Speicherdauer und Zweckausweitung, Antworten auf häufige Einwände und unsere Forderungen.",
      imageLines: ["Was wir ablehnen.", "Und was wir fordern."],
    },
    en: {
      title: "Arguments against DAC8: what we oppose and demand",
      description:
        "Why we oppose collecting data on every crypto customer without suspicion: security, retention and expanding purposes, answers to common objections and our demands.",
      imageLines: ["What we oppose.", "What we demand."],
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
        "Belegte Datenlecks bei Krypto-Anbietern, Steuertools, Behörden und Dienstleistern, und Fälle, in denen solche Daten Täter bis zur Wohnungstür führten. Mit Primärquellen.",
      imageLines: ["Wenn Daten über", "Vermögen verloren", "gehen."],
    },
    en: {
      title: "Data leaks: when data on crypto holdings gets lost",
      description:
        "Documented data leaks at crypto providers, tax tools, authorities and service providers, and cases in which such data led criminals to the front door. With primary sources.",
      imageLines: ["When data", "on holdings", "gets lost."],
    },
  },
  proceedings: {
    de: {
      title: "DAC8-Verfahren: Aktuelles und nächste Schritte",
      description:
        "Der aktuelle Stand des DAC8-Verfahrens von Bitcoin Austria in Österreich. Neuigkeiten und nächste Schritte, auch per RSS.",
      imageLines: ["Unsere Beschwerde", "gegen DAC8", "ist eingebracht."],
    },
    en: {
      title: "DAC8 legal challenge: updates and next steps",
      description:
        "Follow Bitcoin Austria’s legal challenge to DAC8 in Austria: the current status, campaign updates and next steps. Also available via RSS.",
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
