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
        "Finanzielle Privatsphäre ist ein Grundrecht. Bitcoin Austria bereitet ein Verfahren gegen die anlasslose Erfassung von Krypto-Finanzdaten unter DAC8 vor.",
      imageLines: [
        "Finanzielle Privatsphäre",
        "ist ein Grundrecht.",
        "Verteidigen wir sie.",
      ],
    },
    en: {
      title: "Against DAC8. For financial privacy",
      description:
        "Financial privacy is a fundamental right. Bitcoin Austria is preparing a legal challenge to indiscriminate financial data collection under DAC8.",
      imageLines: [
        "Financial privacy",
        "is a fundamental right.",
        "Let’s defend it.",
      ],
    },
  },
  background: {
    de: {
      title: "DAC8 erklärt: Meldepflichten, Risiken und Rechtsweg",
      description:
        "Was DAC8 in Österreich verlangt, welche Krypto-Daten gemeldet und gespeichert werden und warum wir dagegen vorgehen. Mit Primärquellen.",
      imageLines: ["Was DAC8 verlangt.", "Und was nicht."],
    },
    en: {
      title: "DAC8 explained: reporting, risks and legal challenge",
      description:
        "What DAC8 requires in Austria, which crypto-asset data is reported and retained, and why we are challenging it. With primary sources.",
      imageLines: ["What DAC8 requires.", "And what it doesn’t."],
    },
  },
  support: {
    de: {
      title: "Die Kampagne gegen DAC8 unterstützen",
      description:
        "Hilf mit, finanzielle Privatsphäre zu verteidigen: Spende, teile die Kampagne oder unterstütze als Organisation. Verfolge die nächsten Schritte im Verfahren.",
      imageLines: ["Finanzielle Privatsphäre", "braucht Unterstützung."],
    },
    en: {
      title: "Support the campaign against DAC8",
      description:
        "Help defend financial privacy: donate, share the campaign or support it as an organisation. Follow the next steps in Bitcoin Austria’s legal challenge.",
      imageLines: ["Help defend", "financial privacy."],
    },
  },
  donate: {
    de: {
      title: "Spenden für das Verfahren gegen DAC8",
      description:
        "Unterstütze das Verfahren gegen DAC8 mit Bitcoin oder Euro. Deine Spende an Bitcoin Austria hilft vor allem, die Kosten des Verfahrens zu tragen.",
      imageLines: ["Gegen DAC8 vorgehen.", "Den Prozess mittragen."],
    },
    en: {
      title: "Donate to the legal challenge against DAC8",
      description:
        "Support the legal challenge against DAC8 with bitcoin or euros. Your donation to Bitcoin Austria primarily helps cover the costs of the proceedings.",
      imageLines: ["Challenge DAC8.", "Help fund the case."],
    },
  },
  updates: {
    de: {
      title: "DAC8-Verfahren: Aktuelles und nächste Schritte",
      description:
        "Der aktuelle Stand des von Bitcoin Austria vorbereiteten DAC8-Verfahrens in Österreich. Neuigkeiten und nächste Schritte, auch per RSS.",
      imageLines: ["Das Verfahren", "gegen DAC8.", "Aktuelles und Ausblick."],
    },
    en: {
      title: "DAC8 legal challenge: updates and next steps",
      description:
        "Follow Bitcoin Austria’s legal challenge to DAC8 in Austria: the current status, campaign updates and next steps. Also available via RSS.",
      imageLines: ["The case against DAC8.", "Updates and next steps."],
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
