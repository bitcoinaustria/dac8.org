import type { Language } from "@/lib/i18n"

// What comes next, after the film's rules that already apply: steps the EU
// or the FATF have decided or proposed, each with its procedural status,
// and the same pattern in private messages. Then where courts have drawn
// limits so far. Dates and status are verified in
// dac8-wiki/.wiki/wiki/references/aml-kyc-history-austria.md (AMLR,
// interconnected registers, FATF R.16), the tax chronicle in history.ts
// (the recast) and, for the chat proposal, the Parliament's procedure file
// 2022/0155(COD) as of October 2026. Never word a proposal as law.

type Text = Record<Language, string>
export type Source = { label: Text; href: string }
export type Status = "decided" | "proposed" | "standard"

export type NextStep = {
  id: string
  when: Text
  status: Status
  title: Text
  text: Text
  sources: Source[]
}

const eurlex = (path: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://eur-lex.europa.eu/eli/${path}/oj`,
})
const celex = (id: string, de: string, en: string): Source => ({
  label: { de, en },
  href: `https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX:${id}`,
})

export const statusLabel: Record<Status, Text> = {
  decided: { de: "Beschlossen", en: "Adopted" },
  proposed: { de: "Vorgeschlagen", en: "Proposed" },
  standard: { de: "FATF-Standard", en: "FATF standard" },
}

export const nextSteps: NextStep[] = [
  {
    id: "amlr",
    when: { de: "Juli 2027", en: "July 2027" },
    status: "decided",
    title: {
      de: "Bargeld bis 10.000 €, keine anonymen Krypto-Konten.",
      en: "Cash up to 10,000 euros, no anonymous crypto accounts.",
    },
    text: {
      de: "Händler und Dienstleister dürfen höchstens 10.000 € bar annehmen; Banken und andere Verpflichtete prüfen den Ausweis bei einzelnen Bargeschäften ab 3.000 €. Anbieter dürfen keine Konten über Kryptowerte führen, die Übertragungen unkenntlich machen. Die eigene Wallet betrifft das nicht.",
      en: "Traders and service providers may accept at most 10,000 euros in cash; banks and other obliged entities check ID for single cash transactions from 3,000 euros. Providers may not keep accounts in crypto-assets that hide transfers. Your own wallet is not affected.",
    },
    sources: [
      eurlex(
        "reg/2024/1624",
        "Verordnung (EU) 2024/1624, Art. 19, 79 und 80",
        "Regulation (EU) 2024/1624, Articles 19, 79 and 80",
      ),
    ],
  },
  {
    id: "dac10",
    when: { de: "ab 2028", en: "from 2028" },
    status: "proposed",
    title: {
      de: "Das Finanzamt soll in die Geldwäsche-Register schauen.",
      en: "The tax office is to look into anti-money-laundering registers.",
    },
    text: {
      de: "Die Kommission will Steuerbehörden Zugang zu diesen Registern geben, auch für Immobilien, und zu Pensionsregistern. Der Datenschutzbeauftragte der EU verlangt engere Grenzen; zustimmen müssen alle EU-Staaten.",
      en: "The Commission wants tax authorities to access these registers, including for real estate, and pension registers. The EU’s data protection supervisor calls for tighter limits; every EU country must agree.",
    },
    sources: [
      celex(
        "52026PC0308",
        "Kommissionsvorschlag COM(2026) 308",
        "Commission proposal COM(2026) 308",
      ),
      {
        label: {
          de: "EDSB-Stellungnahme 20/2026 (Englisch)",
          en: "EDPS Opinion 20/2026",
        },
        href: "https://data.consilium.europa.eu/doc/document/ST-12521-2026-INIT/en/pdf",
      },
    ],
  },
  {
    id: "register-eu",
    when: { de: "Juli 2029", en: "July 2029" },
    status: "decided",
    title: {
      de: "Die Kontenregister der EU werden verbunden.",
      en: "The EU’s account registers are connected.",
    },
    text: {
      de: "Über eine gemeinsame Schnittstelle, dann auch mit den Konten bei Krypto-Anbietern.",
      en: "Through one common interface, and then including accounts at crypto-asset providers.",
    },
    sources: [
      eurlex(
        "dir/2024/1640",
        "Richtlinie (EU) 2024/1640, Art. 16",
        "Directive (EU) 2024/1640, Article 16",
      ),
    ],
  },
  {
    id: "r16",
    when: { de: "Ende 2030", en: "end of 2030" },
    status: "standard",
    title: {
      de: "Name, Anschrift und Geburtsdatum bei Zahlungen ins Ausland.",
      en: "Name, postal address and date of birth on payments abroad.",
    },
    text: {
      de: "Ab 1.000 € sollen sie Zahlungen zwischen Personen über die Grenze begleiten. So hat es die FATF beschlossen, die internationale Arbeitsgruppe gegen Geldwäsche; die Staaten setzen es in Gesetze um.",
      en: "From 1,000 euros they are to travel with payments between people across borders. The FATF, the international anti-money-laundering task force, decided so; countries turn it into law.",
    },
    sources: [
      {
        label: {
          de: "FATF, Empfehlung 16, Juni 2025 (Englisch)",
          en: "FATF, Recommendation 16, June 2025",
        },
        href: "https://www.fatf-gafi.org/en/publications/Fatfrecommendations/update-Recommendation-16-payment-transparency-june-2025.html",
      },
    ],
  },
]

// The same pattern outside money: what was allowed as voluntary is to
// become an order. Still a proposal, so it is worded as one.
export const chats: NextStep = {
  id: "chats",
  when: { de: "seit 2022", en: "since 2022" },
  status: "proposed",
  title: {
    de: "Dasselbe Muster bei privaten Nachrichten.",
    en: "The same pattern in private messages.",
  },
  text: {
    de: "2021 erlaubte die EU Anbietern, Chats freiwillig nach Darstellungen von Kindesmissbrauch zu durchsuchen. 2022 schlug die Kommission vor, sie dazu verpflichten zu können, die sogenannte Chatkontrolle. Beschlossen ist das nicht; verhandelt wird bis heute.",
    en: "In 2021 the EU allowed providers to scan chats voluntarily for child sexual abuse material. In 2022 the Commission proposed that they could be ordered to, known as chat control. It has not been adopted; negotiations continue.",
  },
  sources: [
    eurlex(
      "reg/2021/1232",
      "Verordnung (EU) 2021/1232",
      "Regulation (EU) 2021/1232",
    ),
    celex(
      "52022PC0209",
      "Kommissionsvorschlag COM(2022) 209",
      "Commission proposal COM(2022) 209",
    ),
    {
      label: {
        de: "Europäisches Parlament, Verfahren 2022/0155(COD)",
        en: "European Parliament, procedure 2022/0155(COD)",
      },
      href: "https://oeil.europarl.europa.eu/oeil/en/procedure-file?reference=2022/0155(COD)",
    },
  ],
}

// Where courts drew limits: facts about other measures, not a forecast for
// DAC8. The page says that only courts can settle DAC8's limits.
export type Ruling = { id: string; year: number; text: Text; sources: Source[] }

export const rulings: Ruling[] = [
  {
    id: "vorratsdaten",
    year: 2014,
    text: {
      de: "Der Gerichtshof der EU kippt die Vorratsdatenspeicherung von Telefon- und Internetdaten, angestoßen auch aus Österreich; der Verfassungsgerichtshof hebt sie hier auf.",
      en: "The EU Court of Justice strikes down the retention of phone and internet data, on a referral that also came from Austria; Austria’s Constitutional Court overturns it.",
    },
    sources: [
      {
        label: {
          de: "EuGH C-293/12 und C-594/12",
          en: "CJEU C-293/12 and C-594/12",
        },
        href: "https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX:62012CJ0293",
      },
      {
        label: {
          de: "VfGH G 47/2012 ua",
          en: "Constitutional Court G 47/2012",
        },
        href: "https://www.ris.bka.gv.at/Dokumente/Vfgh/JFT_20140627_12G00047_00/JFT_20140627_12G00047_00.pdf",
      },
    ],
  },
  {
    id: "ubo",
    year: 2022,
    text: {
      de: "Der Gerichtshof kippt den öffentlichen Zugang zum Register, wem Firmen letztlich gehören, eine Regel gegen Geldwäsche: Der Eingriff in das Privatleben gehe weiter als nötig.",
      en: "The court strikes down public access to the register of who ultimately owns companies, an anti-money-laundering rule: the interference with private life goes beyond what is necessary.",
    },
    sources: [
      {
        label: {
          de: "EuGH C-37/20 und C-601/20",
          en: "CJEU C-37/20 and C-601/20",
        },
        href: "https://eur-lex.europa.eu/legal-content/DE/ALL/?uri=CELEX:62020CJ0037",
      },
    ],
  },
]
