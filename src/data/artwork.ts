import type { ImageMetadata } from "astro"
import type { Language } from "@/lib/i18n"

import accountToRecord from "@/assets/artwork/account-to-record.webp"
import accountToRecordEn from "@/assets/artwork/account-to-record-en.webp"
import collectionReview from "@/assets/artwork/collection-review.webp"
import collectionReviewEn from "@/assets/artwork/collection-review-en.webp"
import dataHack from "@/assets/artwork/data-hack.webp"
import dataHackEn from "@/assets/artwork/data-hack-en.webp"
import financeTheCase from "@/assets/artwork/finance-the-case.webp"
import financeTheCaseEn from "@/assets/artwork/finance-the-case-en.webp"
import linkedIdentity from "@/assets/artwork/linked-identity.webp"
import linkedIdentityEn from "@/assets/artwork/linked-identity-en.webp"
import massCapture from "@/assets/artwork/mass-capture.webp"
import massCaptureEn from "@/assets/artwork/mass-capture-en.webp"
import personalizedFraud from "@/assets/artwork/personalized-fraud.webp"
import personalizedFraudEn from "@/assets/artwork/personalized-fraud-en.webp"
import profileFourSources from "@/assets/artwork/profile-four-sources.webp"
import profileFourSourcesEn from "@/assets/artwork/profile-four-sources-en.webp"
import rankedPortrait from "@/assets/artwork/ranked-portrait.webp"
import rankedPortraitEn from "@/assets/artwork/ranked-portrait-en.webp"
import reportAssets from "@/assets/artwork/report-assets.webp"
import reportAssetsEn from "@/assets/artwork/report-assets-en.webp"
import targetAtHome from "@/assets/artwork/target-at-home.webp"
import targetAtHomeEn from "@/assets/artwork/target-at-home-en.webp"
import walletHistoryRevealed from "@/assets/artwork/wallet-history-revealed.webp"
import walletHistoryRevealedEn from "@/assets/artwork/wallet-history-revealed-en.webp"
import yearsOnFile from "@/assets/artwork/years-on-file.webp"
import yearsOnFileEn from "@/assets/artwork/years-on-file-en.webp"

type ArtworkText = {
  alt: string
  title?: string
  caption?: string
}

// A compressed glTF of the same Blender scene (public/models/), drawn live
// with WebGL over the render, which stays as poster and fallback. The camera
// is the lab's view direction in Blender coordinates (z up).
export type ArtworkModel = {
  file: Record<Language, string>
  camera: [number, number, number]
}

export type Artwork = {
  // One render per language where the object carries text labels.
  image: ImageMetadata | Record<Language, ImageMetadata>
  model?: ArtworkModel
} & Record<Language, ArtworkText>

export const imageFor = (entry: Artwork, language: Language) =>
  "src" in entry.image ? entry.image : entry.image[language]

const model = (name: string, camera: ArtworkModel["camera"]) => ({
  file: { de: `/models/${name}.glb`, en: `/models/${name}-en.glb` },
  camera,
})

// Transparent renders from the artwork lab (knowledge/dac8-*-cutout.png, the
// -en files from its English editions). They carry no background, so the page
// colour shows through in both themes. People, addresses and amounts are
// invented. The headline next to each picture says what it shows; captions
// stay short and only add what the picture cannot say by itself.
export const artwork = {
  accountToRecord: {
    image: { de: accountToRecord, en: accountToRecordEn },
    model: model("account-to-record", [1.1, -5.7, 16]),
    de: {
      alt: "Illustration: Ein Smartphone mit Börsen-App und ein Ausweis von Max Mustermann sind mit einer Finanzakte des Anbieters verbunden. Darin stehen Jahreswerte: Käufe 0,35 BTC, Transfers 0,18 BTC.",
    },
    en: {
      alt: "Illustration: a phone with an exchange app and Max Mustermann’s ID card are connected to the provider’s financial record, which lists annual totals: purchases 0.35 BTC, transfers 0.18 BTC.",
    },
  },
  massCapture: {
    image: { de: massCapture, en: massCaptureEn },
    model: model("mass-capture", [5.5, -10, 12]),
    de: {
      alt: "Illustration: Ein dichtes Feld gleicher Personenkarten läuft unter einer gemeinsamen Scannerleiste hindurch.",
    },
    en: {
      alt: "Illustration: a dense field of identical personal record cards passes under one shared scanner bar.",
    },
  },
  reportAssets: {
    image: { de: reportAssets, en: reportAssetsEn },
    model: model("report-assets", [0, -1.6, 19]),
    de: {
      alt: "Illustration: Musterblatt einer Jahresmeldung 2026 für Max Mustermann mit Name, Anschrift, Steuerwohnsitz, maskierter Steuernummer, Geburtsdatum und Angaben zum meldenden Anbieter. Daneben je ein Blatt für Bitcoin, Ether und Litecoin mit Gesamtwert, Stückzahl und meist der Anzahl je Vorgangsart.",
    },
    en: {
      alt: "Illustration: specimen of a 2026 annual report on Max Mustermann with name, address, tax residence, masked tax identification number, date of birth and the reporting provider’s details. Beside it, one sheet each for Bitcoin, Ether and Litecoin with total value, units and, for most categories, the count per transaction category.",
    },
  },
  yearsOnFile: {
    image: { de: yearsOnFile, en: yearsOnFileEn },
    model: model("years-on-file", [4, -10, 12]),
    de: {
      alt: "Illustration: Drei Stapel mit Jahresakten von Max Mustermann, beschriftet 2026 (1. Jahr), 2030 (5. Jahr) und 2035 (10. Jahr), werden von links nach rechts höher.",
    },
    en: {
      alt: "Illustration: three stacks of annual files on Max Mustermann, labelled 2026 (year 1), 2030 (year 5) and 2035 (year 10), grow taller from left to right.",
    },
  },
  dataHack: {
    image: { de: dataHack, en: dataHackEn },
    model: model("data-hack", [1.2, -5, 15]),
    de: {
      alt: "Illustration: Aus einem gesprungenen Glasarchiv mit der Aufschrift Personendaten führt ein roter Pfeil zu einem Blatt „Datenleck, offengelegt“ mit Name, Wiener Anschrift, 7,2 BTC und Familienstand von Max Mustermann.",
    },
    en: {
      alt: "Illustration: a red arrow leads from a cracked glass archive labelled personal data to a sheet marked data leak, exposed, with Max Mustermann’s name, Vienna address, 7.2 BTC and family status.",
    },
  },
  profileFourSources: {
    image: { de: profileFourSources, en: profileFourSourcesEn },
    model: model("profile-four-sources", [0, -3.35, 18]),
    de: {
      alt: "Illustration: Vier kleine Karten, ein öffentliches Profil, eine Wallet-Zuordnung, ein Steuertool-Import und die Meldedaten 2026, sind mit einer großen Akte „Verknüpfte Daten“ verbunden. Darin stehen Foto, Name und Wiener Anschrift von Max Mustermann, Familienstand, eine zugeordnete Wallet mit rund 7,2 BTC, Rang 07, 1.284 importierte Vorgänge und die Jahreswerte aus der Meldung.",
    },
    en: {
      alt: "Illustration: four small cards, a public profile, a wallet link, a tax tool import and the 2026 report data, are connected to a large file labelled linked data. It shows Max Mustermann’s photo, name and Vienna address, family status, an attributed wallet with about 7.2 BTC, rank 07, 1,284 imported records and the annual totals from the report.",
    },
  },
  rankedPortrait: {
    image: { de: rankedPortrait, en: rankedPortraitEn },
    model: model("ranked-portrait", [0, -2.8, 17]),
    de: {
      alt: "Illustration: Ein Schraubenschlüssel neben einer Zielliste für Wien mit verknüpften Vermögensdaten. Rot markiert ist Platz 07, Max Mustermann mit 7,2 BTC; darunter Anschrift, Familienstand und ein Porträtfoto.",
    },
    en: {
      alt: "Illustration: a wrench beside a target list for Vienna with linked wealth data. Number 07, Max Mustermann with 7.2 BTC, is highlighted in red, with his address, family status and a portrait photo below.",
    },
  },
  targetAtHome: {
    image: { de: targetAtHome, en: targetAtHomeEn },
    model: model("target-at-home", [0, -3.15, 18]),
    de: {
      alt: "Illustration: Ein Schraubenschlüssel neben einem verknüpften Profil von Max Mustermann mit Foto, Familienstand und einer zugeordneten Wallet mit rund 7,2 BTC. Eine rote Karte führt ihn als Nummer 07 einer Zielliste für Wien. Darunter ein Türschild Musterstraße 7 mit Standortmarke.",
    },
    en: {
      alt: "Illustration: a wrench beside a linked profile of Max Mustermann with photo, family status and an attributed wallet with about 7.2 BTC. A red card lists him as number 07 on a target list for Vienna. Below, a door sign reading Musterstraße 7 with a location marker.",
    },
  },
  walletHistoryRevealed: {
    image: { de: walletHistoryRevealed, en: walletHistoryRevealedEn },
    model: model("wallet-history-revealed", [0, -3.35, 18]),
    de: {
      alt: "Illustration: Eine Karte von Max Mustermann ist mit seiner zugeordneten Wallet bc1q…9f3a verbunden. Unter derselben Adresse stehen öffentliche Zahlungen von 0,003, 0,008 und 0,002 BTC, die zu drei Empfängern führen: Praxis 240 Euro, Familie 600 Euro, Spende 120 Euro.",
    },
    en: {
      alt: "Illustration: a card for Max Mustermann is connected to his attributed wallet bc1q…9f3a. Under the same address, public payments of 0.003, 0.008 and 0.002 BTC lead to three recipients: doctor 240 euros, family 600 euros, donation 120 euros.",
    },
  },
  personalizedFraud: {
    image: { de: personalizedFraud, en: personalizedFraudEn },
    model: model("personalized-fraud", [2.2, -12, 16]),
    de: {
      alt: "Illustration: Von einem Datenleck mit Name, Anschrift und Wallet-Adresse von Max Mustermann führt ein Pfeil zu einem Smartphone. Darauf eine als Betrug markierte Nachricht eines angeblichen Börsen-Service, die ihn mit denselben Angaben anspricht und auffordert, sein Konto zu prüfen.",
    },
    en: {
      alt: "Illustration: an arrow leads from a data leak with Max Mustermann’s name, address and wallet address to a phone. On it, a message marked as fraud from a supposed exchange service addresses him with the same details and asks him to check his account.",
    },
  },
  linkedIdentity: {
    image: { de: linkedIdentity, en: linkedIdentityEn },
    model: model("linked-identity", [2, -8, 13]),
    de: {
      alt: "Illustration: Eine Identitätskarte von Max Mustermann ist mit roten Leitungen verbunden mit einem Bankkonto über 12.400 Euro, einer Wallet A mit 4,1 BTC und einer Hardware-Wallet B mit 3,1 BTC.",
    },
    en: {
      alt: "Illustration: an identity card for Max Mustermann is connected by red lines to a bank account holding 12,400 euros, wallet A with 4.1 BTC and hardware wallet B with 3.1 BTC.",
    },
  },
  collectionReview: {
    image: { de: collectionReview, en: collectionReviewEn },
    model: model("collection-review", [3, -12, 13]),
    de: {
      alt: "Illustration: Eine Lupe über einer Kartei mit der Aufschrift Datensammlung voller Personenkarten. Davor eine Beschwerde von Max Mustermann gegen die anlasslose Erfassung der Jahreswerte.",
      caption:
        "Unsere geplante Beschwerde richtet sich gegen die anlasslose Erfassung aller Kunden.",
    },
    en: {
      alt: "Illustration: a magnifying glass over a card index labelled data collection, full of personal record cards. In front, a complaint by Max Mustermann against the blanket collection of annual totals.",
      caption:
        "Our planned complaint targets the blanket collection of all customers’ data.",
    },
  },
  financeTheCase: {
    image: { de: financeTheCase, en: financeTheCaseEn },
    model: model("finance-the-case", [3, -12, 14]),
    de: {
      alt: "Illustration: Drei Spendenkarten über 25, 50 und 100 Euro führen in eine Mappe mit Rechtsvertretung und Verfahrenskosten. Daneben eine Beschwerde gegen die DAC8-Datensammlung.",
    },
    en: {
      alt: "Illustration: three donation cards for 25, 50 and 100 euros lead into a folder for legal counsel and legal costs. Beside it, a complaint against DAC8 data collection.",
    },
  },
} satisfies Record<string, Artwork>

export type ArtworkId = keyof typeof artwork
