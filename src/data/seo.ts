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
