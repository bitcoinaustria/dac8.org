import type { ImageMetadata } from "astro"
import type { Language } from "@/lib/i18n"

import accountToRecord from "@/assets/artwork/account-to-record.webp"
import accountToRecordEn from "@/assets/artwork/account-to-record-en.webp"
import collectionChallenge from "@/assets/artwork/collection-challenge.webp"
import collectionChallengeEn from "@/assets/artwork/collection-challenge-en.webp"
import collectiveDefense from "@/assets/artwork/collective-defense.webp"
import collectiveDefenseEn from "@/assets/artwork/collective-defense-en.webp"
import dataHack from "@/assets/artwork/data-hack.webp"
import dataHackEn from "@/assets/artwork/data-hack-en.webp"
import linkedIdentity from "@/assets/artwork/linked-identity.webp"
import linkedIdentityEn from "@/assets/artwork/linked-identity-en.webp"
import massCapture from "@/assets/artwork/mass-capture.webp"
import massCaptureEn from "@/assets/artwork/mass-capture-en.webp"
import privacyExposed from "@/assets/artwork/privacy-exposed.webp"
import rankedPortrait from "@/assets/artwork/ranked-portrait.webp"
import rankedPortraitEn from "@/assets/artwork/ranked-portrait-en.webp"
import reportAssets from "@/assets/artwork/report-assets.webp"
import reportAssetsEn from "@/assets/artwork/report-assets-en.webp"
import retentionArchive from "@/assets/artwork/retention-archive.webp"
import retentionArchiveEn from "@/assets/artwork/retention-archive-en.webp"
import spendingProfile from "@/assets/artwork/spending-profile.webp"
import spendingProfileEn from "@/assets/artwork/spending-profile-en.webp"
import wealthProfile from "@/assets/artwork/wealth-profile.webp"
import wealthProfileEn from "@/assets/artwork/wealth-profile-en.webp"
import wrenchAttack from "@/assets/artwork/wrench-attack.webp"
import wrenchAttackEn from "@/assets/artwork/wrench-attack-en.webp"
import yearsOnFile from "@/assets/artwork/years-on-file.webp"
import yearsOnFileEn from "@/assets/artwork/years-on-file-en.webp"

type ArtworkText = {
  alt: string
  title?: string
  caption?: string
}

export type Artwork = {
  // One render per language where the object carries text labels.
  image: ImageMetadata | Record<Language, ImageMetadata>
} & Record<Language, ArtworkText>

export const imageFor = (entry: Artwork, language: Language) =>
  "src" in entry.image ? entry.image : entry.image[language]

// Transparent renders from the artwork lab (knowledge/dac8-*-cutout.png, the
// -en files from its English editions). They carry no background, so the page
// colour shows through in both themes. People, addresses and amounts are
// invented. Only the report specimen shows fields of the annual DAC8 report;
// profiles, rankings and holdings stand for combined or leaked records, and
// captions keep that distinction beside the image.
export const artwork = {
  privacyExposed: {
    image: privacyExposed,
    de: {
      alt: "Illustration: Eine gläserne Box mit angehobenem Deckel gibt den Blick auf ein Personensymbol und ein Bitcoin-Zeichen frei.",
    },
    en: {
      alt: "Illustration: a glass case with its lid lifted reveals a person icon and a Bitcoin symbol.",
    },
  },
  accountToRecord: {
    image: { de: accountToRecord, en: accountToRecordEn },
    de: {
      alt: "Illustration: Ein Smartphone mit Börsen-App und ein Ausweis von Max Mustermann sind mit einer Finanzakte des Anbieters verbunden. Darin stehen Jahreswerte: Käufe 0,35 BTC, Transfers 0,18 BTC.",
    },
    en: {
      alt: "Illustration: a phone with an exchange app and Max Mustermann’s ID card are connected to the provider’s financial record, which lists annual totals: purchases 0.35 BTC, transfers 0.18 BTC.",
    },
  },
  massCapture: {
    image: { de: massCapture, en: massCaptureEn },
    de: {
      alt: "Illustration: Ein dichtes Feld gleicher Personenkarten läuft unter einer gemeinsamen Scannerleiste hindurch.",
      caption:
        "Aufbereitet werden die Daten aller Kunden. Übermittelt werden nur die Daten meldepflichtiger Personen.",
    },
    en: {
      alt: "Illustration: a dense field of identical personal record cards passes under one shared scanner bar.",
      caption:
        "Providers prepare data on all customers. Only data on reportable persons is transmitted.",
    },
  },
  reportAssets: {
    image: { de: reportAssets, en: reportAssetsEn },
    de: {
      alt: "Illustration: Musterblatt einer Jahresmeldung 2026 für Max Mustermann mit Name, Anschrift, Steuerwohnsitz, maskierter Steuernummer, Geburtsdatum und Angaben zum meldenden Anbieter. Daneben je ein Blatt für Bitcoin, Ether und Litecoin mit Gesamtwert, Stückzahl und Anzahl je Vorgangsart.",
      title: "Musterblatt der Jahresmeldung",
      caption:
        "Für eine natürliche Person, kein amtliches Formular. Ohne Wallet-Adressen, einzelne Transaktionen oder Kontostand.",
    },
    en: {
      alt: "Illustration: specimen of a 2026 annual report on Max Mustermann with name, address, residence, masked tax number, date of birth and the reporting provider’s details. Beside it, one sheet each for Bitcoin, Ether and Litecoin with total value, units and count per transaction category.",
      title: "Specimen of the annual report",
      caption:
        "For a natural person, not an official form. No wallet addresses, individual transactions or balance.",
    },
  },
  yearsOnFile: {
    image: { de: yearsOnFile, en: yearsOnFileEn },
    de: {
      alt: "Illustration: Drei Stapel mit Jahresakten von Max Mustermann, beschriftet 2026 (1. Jahr), 2030 (5. Jahr) und 2035 (10. Jahr), werden von links nach rechts höher.",
      caption:
        "Illustration wachsender Jahresmeldungen, kein zentrales Register.",
    },
    en: {
      alt: "Illustration: three stacks of annual files on Max Mustermann, labelled 2026 (year 1), 2030 (year 5) and 2035 (year 10), grow taller from left to right.",
      caption: "Accumulating annual reports, not a central register.",
    },
  },
  dataHack: {
    image: { de: dataHack, en: dataHackEn },
    de: {
      alt: "Illustration: Aus einem gesprungenen Glasarchiv mit der Aufschrift Personendaten führt ein roter Pfeil zu einem Blatt „Datenleck, offengelegt“ mit Name, Wiener Anschrift, 7,2 BTC und Familienstand von Max Mustermann.",
    },
    en: {
      alt: "Illustration: a red arrow leads from a cracked glass archive labelled personal data to a sheet marked data leak, exposed, with Max Mustermann’s name, Vienna address, 7.2 BTC and family status.",
    },
  },
  rankedPortrait: {
    image: { de: rankedPortrait, en: rankedPortraitEn },
    de: {
      alt: "Illustration: Ein Schraubenschlüssel neben einer Zielliste für Wien mit verknüpften Vermögensdaten. Rot markiert ist Platz 07, Max Mustermann mit 7,2 BTC; darunter Anschrift, Familienstand und ein Porträtfoto.",
      caption: "Verknüpfte und geleakte Daten, keine Felder der DAC8-Meldung.",
    },
    en: {
      alt: "Illustration: a wrench beside a target list for Vienna with linked wealth data. Number 07, Max Mustermann with 7.2 BTC, is highlighted in red, with his address, family status and a portrait photo below.",
      caption: "Linked and leaked data, not fields of the DAC8 report.",
    },
  },
  collectionChallenge: {
    image: { de: collectionChallenge, en: collectionChallengeEn },
    de: {
      alt: "Illustration: Eine Lupe liegt auf der Akte von Max Mustermann in einer Kartei mit der Aufschrift Datensammlung. Daneben ein unterschriebenes Blatt „Beschwerde“ gegen die anlasslose Erfassung der Jahreswerte.",
      caption:
        "Die Beschwerde richtet sich gegen die anlasslose Erfassung. Über das Ergebnis entscheiden Behörde und Gerichte.",
    },
    en: {
      alt: "Illustration: a magnifying glass rests on Max Mustermann’s file in a card index labelled data collection. Beside it, a signed complaint against the blanket collection of annual totals.",
      caption:
        "The complaint targets the blanket collection. The authority and the courts decide the outcome.",
    },
  },
  collectiveDefense: {
    image: { de: collectiveDefense, en: collectiveDefenseEn },
    de: {
      alt: "Illustration: Ein Koffer mit der Aufschrift Privat schützt die Akte von Max Mustermann und eine Beschwerde. Sechs Personensymbole halten ihn von außen zusammen.",
    },
    en: {
      alt: "Illustration: a case marked private protects Max Mustermann’s file and a complaint. Six person icons hold it together from the outside.",
    },
  },
  linkedIdentity: {
    image: { de: linkedIdentity, en: linkedIdentityEn },
    de: {
      alt: "Illustration: Eine Identitätskarte von Max Mustermann ist mit roten Leitungen verbunden mit einem Bankkonto über 12.400 Euro, einer Wallet A mit 4,1 BTC und einer Hardware-Wallet B mit 3,1 BTC.",
      title: "Verknüpfte Identität",
      caption:
        "Nicht Teil der Jahresmeldung, beim Anbieter aber möglich: Name, Bankkonto und Wallets bleiben miteinander verknüpft.",
    },
    en: {
      alt: "Illustration: an identity card for Max Mustermann is connected by red lines to a bank account holding 12,400 euros, wallet A with 4.1 BTC and hardware wallet B with 3.1 BTC.",
      title: "Linked identity",
      caption:
        "Not part of the annual report, but possible at the provider: your name, bank account and wallets remain linked.",
    },
  },
  retentionArchive: {
    image: { de: retentionArchive, en: retentionArchiveEn },
    de: {
      alt: "Illustration: Eine weit herausgezogene Archivschublade voller Akten mit Jahresreitern, vorne die Akte von Max Mustermann.",
      title: "Auf Vorrat gespeichert",
      caption:
        "Vorsorglich gesammelte Daten bleiben über Jahre gespeichert, auch wenn nie ein Verdacht bestand.",
    },
    en: {
      alt: "Illustration: an archive drawer pulled far out, full of files with year tabs, Max Mustermann’s file at the front.",
      title: "Kept on file",
      caption:
        "Data collected as a precaution stays on file for years, even when there was never any suspicion.",
    },
  },
  wealthProfile: {
    image: { de: wealthProfile, en: wealthProfileEn },
    de: {
      alt: "Illustration: Ein Vermögensprofil von Max Mustermann, Musterstraße 7, 1010 Wien, mit zugerechneten Beständen von 7,2 BTC, 18 Unzen Gold und 64.000 Euro. Eine rote Karte führt ihn als Rang 07 einer Zielliste für Wien. Daneben ein offener Tresor mit Standortmarkierung.",
      title: "Das Vermögensprofil",
      caption:
        "DAC8 ist kein Vermögensregister. Zusammen mit Kontenregister, Anbieteraufzeichnungen und Blockchain-Analyse kann aber ein Profil entstehen, nach dem sich Menschen sortieren lassen.",
    },
    en: {
      alt: "Illustration: a wealth profile for Max Mustermann, Musterstraße 7, 1010 Vienna, with attributed holdings of 7.2 BTC, 18 ounces of gold and 64,000 euros. A red card lists him as number 07 on a target list for Vienna. Beside it, an open safe with a location marker.",
      title: "The wealth profile",
      caption:
        "DAC8 is not a wealth register. Combined with account registries, provider records and blockchain analysis, however, it can produce a profile by which people can be ranked.",
    },
  },
  spendingProfile: {
    image: { de: spendingProfile, en: spendingProfileEn },
    de: {
      alt: "Illustration: Ein Zahlungsprofil von Max Mustermann für einen Monat: 240 Euro für Gesundheit, 600 Euro für Familie und 120 Euro für Spenden, zusammen 960 Euro.",
      title: "Das Zahlungsprofil",
      caption:
        "Nicht aus der Jahresmeldung, sondern aus verknüpften Zahlungen: Wer Adressen und Empfänger kennt, kann Ausgaben nach Lebensbereichen ordnen.",
    },
    en: {
      alt: "Illustration: a one-month spending profile for Max Mustermann: 240 euros on health, 600 euros on family and 120 euros on donations, 960 euros in total.",
      title: "The spending profile",
      caption:
        "Not from the annual report, but from linked payments: anyone who knows the addresses and recipients can sort spending by area of life.",
    },
  },
  wrenchAttack: {
    image: { de: wrenchAttack, en: wrenchAttackEn },
    de: {
      alt: "Illustration: Ein schwerer Schraubenschlüssel neben einem Datenblatt mit Name, Anschrift, Familienstand und 7,2 BTC von Max Mustermann und einer Hardware-Wallet.",
      title: "Physische Bedrohung",
      caption:
        "Ein Datensatz mit Name, Anschrift und vermuteten Beständen kann Menschen und ihre Familien zum Ziel von Gewalt machen.",
    },
    en: {
      alt: "Illustration: a heavy wrench beside a record sheet with Max Mustermann’s name, address, family status and 7.2 BTC, and a hardware wallet.",
      title: "Physical threat",
      caption:
        "A record with a name, address and presumed holdings can make people and their families targets of violence.",
    },
  },
} satisfies Record<string, Artwork>

export type ArtworkId = keyof typeof artwork
