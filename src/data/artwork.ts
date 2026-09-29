import type { ImageMetadata } from "astro"
import type { Language } from "@/lib/i18n"

import leakedTarget from "@/assets/artwork/leaked-target.webp"
import linkedIdentity from "@/assets/artwork/linked-identity.webp"
import privacyExposed from "@/assets/artwork/privacy-exposed.webp"
import retentionArchive from "@/assets/artwork/retention-archive.webp"
import spendingProfile from "@/assets/artwork/spending-profile.webp"
import wealthProfile from "@/assets/artwork/wealth-profile.webp"
import wrenchAttack from "@/assets/artwork/wrench-attack.webp"

type ArtworkText = {
  alt: string
  title?: string
  caption?: string
}

export type Artwork = { image: ImageMetadata } & Record<Language, ArtworkText>

// Transparent renders from the artwork lab (knowledge/dac8-*-cutout.png).
// They carry no background, so they work on the page and in the dark display
// case in both themes.
// The people, addresses and amounts are invented. The profiles show what
// combined or leaked records can reveal, not the fields of the DAC8 report;
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
  leakedTarget: {
    image: leakedTarget,
    de: {
      alt: "Illustration: Gläserne Karteikarten zeigen den Namen Max Mustermann, eine Wiener Anschrift und Bestände von 7,2 BTC, Gold und Euro. Ein rotes Fadenkreuz liegt über dem Personensymbol, daneben eine Standortmarkierung.",
      title: "Person im Visier",
      caption:
        "Gestohlene Kundendaten, ergänzt um andere Quellen, können zur Zielliste werden: Name, Anschrift, vermutetes Vermögen.",
    },
    en: {
      alt: "Illustration: glass record cards show the name Max Mustermann, a Vienna address and holdings of 7.2 BTC, gold and euros. A red crosshair sits over the person icon, next to a location marker.",
      title: "In the crosshairs",
      caption:
        "Stolen customer data, combined with other sources, can become a target list: name, address, presumed wealth.",
    },
  },
  retentionArchive: {
    image: retentionArchive,
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
  linkedIdentity: {
    image: linkedIdentity,
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
  wealthProfile: {
    image: wealthProfile,
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
    image: spendingProfile,
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
    image: wrenchAttack,
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
