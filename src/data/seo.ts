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
        "DAC8 erfasst die Finanzdaten aller Krypto-Kunden, Jahr für Jahr und ohne Verdacht. Bitcoin Austria bereitet ein Verfahren gegen diese finanzielle Massenüberwachung vor.",
      imageLines: ["DAC8 erfasst jeden", "Krypto-Kunden.", "Wir wehren uns."],
    },
    en: {
      title: "Against DAC8. For financial privacy",
      description:
        "DAC8 records the financial data of every crypto customer, every year and without suspicion. Bitcoin Austria is preparing a legal challenge to this mass surveillance.",
      imageLines: ["DAC8 records every", "crypto customer.", "We fight back."],
    },
  },
  dossier: {
    de: {
      title: "DAC8 erklärt: Meldepflichten, Risiken und Rechtsweg",
      description:
        "Was DAC8 in Österreich verlangt, welche Krypto-Daten Jahr für Jahr gemeldet werden, was sich beim Anbieter ansammelt und warum wir dagegen vorgehen. Mit Primärquellen.",
      imageLines: ["Was DAC8 verlangt.", "Und was daraus wird."],
    },
    en: {
      title: "DAC8 explained: reporting, risks and legal challenge",
      description:
        "What DAC8 requires in Austria, which crypto-asset data is reported every year, what builds up at your provider and why we are challenging it. With primary sources.",
      imageLines: ["What DAC8 requires.", "And where it leads."],
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
  file: {
    de: {
      title: "Deine DAC8-Akte: was dein Anbieter über dich meldet",
      description:
        "Sieh in einer Minute, was dein Krypto-Anbieter ab 2026 jedes Jahr über dich ans Finanzamt meldet und was er zehn Jahre lang aufbewahrt. Alles bleibt in deinem Browser.",
      imageLines: ["Deine DAC8-Akte.", "Jahr für Jahr."],
    },
    en: {
      title: "Your DAC8 file: what your provider reports about you",
      description:
        "See in a minute what your crypto provider reports about you to the tax authority every year from 2026, and what it keeps for ten years. Nothing leaves your browser.",
      imageLines: ["Your DAC8 file.", "Year after year."],
    },
  },
  access: {
    de: {
      title: "Auskunft verlangen: Was weiß dein Krypto-Anbieter?",
      description:
        "Erstelle eine Auskunftsanfrage nach Art. 15 DSGVO an deinen Krypto-Anbieter: welche Daten er für DAC8 über dich verarbeitet, wie lange und an wen. Du schickst sie selbst.",
      imageLines: ["Was weiß", "dein Anbieter", "über dich?"],
    },
    en: {
      title: "Request access: what does your crypto provider hold?",
      description:
        "Create a GDPR Article 15 access request to your crypto provider: what data it processes about you for DAC8, for how long and for whom. You send it yourself.",
      imageLines: ["What does", "your provider", "know about you?"],
    },
  },
  attacks: {
    de: {
      title: "Angriffsarchiv: Gewalt gegen Krypto-Besitzer weltweit",
      description:
        "Überfälle, Entführungen und Folter von Menschen, die Kryptowerte besitzen oder besitzen sollen, weltweit, jeweils mit dem ursprünglichen Bericht. Bei Weitem nicht vollständig.",
      imageLines: ["Überfallen,", "entführt,", "gefangen gehalten."],
    },
    en: {
      title: "Attack archive: violence against crypto holders worldwide",
      description:
        "Robberies, kidnappings and torture of people who hold crypto-assets, or are believed to, worldwide, each with the original report. Far from complete.",
      imageLines: ["Robbed,", "kidnapped,", "held captive."],
    },
  },
  proceedings: {
    de: {
      title: "DAC8-Verfahren: Aktuelles und nächste Schritte",
      description:
        "Der aktuelle Stand des von Bitcoin Austria vorbereiteten DAC8-Verfahrens in Österreich. Neuigkeiten und nächste Schritte, auch per RSS.",
      imageLines: ["Das Verfahren", "gegen DAC8.", "In Vorbereitung."],
    },
    en: {
      title: "DAC8 legal challenge: updates and next steps",
      description:
        "Follow Bitcoin Austria’s legal challenge to DAC8 in Austria: the current status, campaign updates and next steps. Also available via RSS.",
      imageLines: ["The case", "against DAC8.", "In preparation."],
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
