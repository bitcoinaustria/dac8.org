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
      title: "DAC8 erklärt: was gemeldet wird und was beim Anbieter bleibt",
      description:
        "Wer betroffen ist, was jedes Jahr ans Finanzamt geht, was beim Anbieter bleibt und wer die Daten wie lange speichert. Die Krypto-Meldepflicht in Österreich, mit Primärquellen.",
      imageLines: ["Was DAC8 verlangt.", "Und was das heißt."],
    },
    en: {
      title: "DAC8 explained: what is reported and what the provider keeps",
      description:
        "Who is affected, what goes to the tax office each year, what stays with the provider and who keeps the data for how long. Crypto-asset reporting in Austria, with primary sources.",
      imageLines: ["What DAC8 requires.", "And what it means."],
    },
  },
  arguments: {
    de: {
      title: "Warum finanzielle Privatsphäre zählt und was wir fordern",
      description:
        "Warum finanzielle Privatsphäre zählt und wir die anlasslose Erfassung aller Krypto-Kunden ablehnen: unsere Gründe vom Bargeld bis zur Zielliste, Antworten auf Einwände und unsere Forderungen.",
      imageLines: ["Warum finanzielle", "Privatsphäre zählt."],
    },
    en: {
      title: "Why financial privacy matters, and what we demand",
      description:
        "Why financial privacy matters and we oppose collecting data on every crypto customer without suspicion: our reasons from cash to target lists, answers to objections and our demands.",
      imageLines: ["Why financial", "privacy matters."],
    },
  },
  history: {
    de: {
      title:
        "Steuern und Geldwäsche: immer mehr Regeln, kaum gemessene Wirkung",
      description:
        "Von der Amtshilfe 1977 und dem Ausweis bei der Bank bis zu DAC8 und der Bargeldgrenze: wie die Regeln gewachsen sind und was Prüfer über ihre Wirkung fanden, mit Primärquellen.",
      imageLines: [
        "Immer mehr Regeln.",
        "Wie viel sie bringen,",
        "misst kaum jemand.",
      ],
    },
    en: {
      title:
        "Tax and money laundering: more and more rules, little measured effect",
      description:
        "From mutual assistance in 1977 and ID at the bank to DAC8 and the cash cap: how the rules have grown and what auditors found about their effect, with primary sources.",
      imageLines: [
        "More and more rules.",
        "Hardly anyone measures",
        "what they achieve.",
      ],
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
      imageLines: ["Wenn bekannt ist,", "wer Krypto hat."],
    },
    en: {
      title: "Attack archive: attacks on crypto holders worldwide",
      description:
        "Known physical attacks on people who hold crypto-assets, or are believed to, worldwide and each with the original report. Far from complete.",
      imageLines: ["When people know", "who holds crypto."],
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
      title: "DAC8-Verfahren: Beschwerde, Rechtsweg und Presse",
      description:
        "Bitcoin Austria bringt DAC8 vor Gericht: die Beschwerde bei der Datenschutzbehörde, der mögliche Weg bis zum EuGH, Pressekontakte und Neuigkeiten per RSS.",
      imageLines: ["Unsere Beschwerde", "gegen DAC8", "ist eingebracht."],
    },
    en: {
      title: "DAC8 legal challenge: complaint, route and press",
      description:
        "Bitcoin Austria is taking DAC8 to court: the complaint to Austria’s Data Protection Authority, the possible route to the CJEU, press contacts and updates via RSS.",
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
