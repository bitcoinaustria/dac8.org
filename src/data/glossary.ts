import type { Language } from "@/lib/i18n"

// Terms readers meet on the site, explained in one or two everyday sentences.
// Copy elsewhere may use them, but explains a term in the same sentence the
// first time it appears on a page. The wording restates the dossier's vetted
// claims (what is reported, what the provider keeps, retention "derzeit"), so
// change both together. For wallets the site says "Selbstverwahrung"
// (self-custody), never "Self-Hosting".
//
// Each term opens on its own at /dossier/#begriff-<id>. The id is the same in
// both languages, ASCII, taken from the German term, and stays when the
// wording changes, because other pages may link to it. The dossier lists the
// terms A to Z, so the order here does not matter.
export type Term = { id: string; term: string; text: string }

export const termAnchor = (id: string) => `begriff-${id}`

export const glossary: Record<Language, Term[]> = {
  de: [
    {
      id: "anbieter",
      term: "Anbieter",
      text: "Im Gesetz Anbieter von Krypto-Dienstleistungen: Börsen, Broker und Apps, bei denen du Kryptowerte kaufst, verkaufst oder verwahren lässt, auch Banken mit Krypto-Angebot. Sie melden für DAC8.",
    },
    {
      id: "kyc",
      term: "KYC",
      text: "Know Your Customer: die Identitätsprüfung, wenn du bei einem Anbieter ein Konto eröffnest, etwa mit Ausweis und Selfie. Die Regeln gegen Geldwäsche verlangen sie, und der Anbieter bewahrt die Unterlagen derzeit bis zehn Jahre nach Ende der Kundenbeziehung auf.",
    },
    {
      id: "wallet",
      term: "Wallet",
      text: "Ein Programm oder Gerät, das die Schlüssel zu deinen Kryptowerten verwaltet. Lässt du sie bei einem Anbieter, hält er die Schlüssel für dich.",
    },
    {
      id: "wallet-adresse",
      term: "Wallet-Adresse",
      text: "Eine Zeichenfolge wie bc1q…, an die man Bitcoin schicken kann, ähnlich einer Kontonummer. Zahlungen an eine Adresse sind auf der Blockchain öffentlich. Nicht zu verwechseln mit deiner Wohnadresse.",
    },
    {
      id: "selbstverwahrung",
      term: "Selbstverwahrung",
      text: "Englisch Self-Custody: Du hältst die Schlüssel zu deinen Bitcoin selbst, etwa auf einer Hardware-Wallet, statt sie bei einem Anbieter liegen zu lassen. Wie bei Bargeld daheim muss niemand eine Übertragung freigeben.",
    },
    {
      id: "wiederherstellungsphrase",
      term: "Wiederherstellungsphrase",
      text: "Meist 12 oder 24 Wörter, mit denen sich eine Wallet wiederherstellen lässt. Wer sie kennt, kann die Bitcoin übertragen. Gib deine Wiederherstellungsphrase niemals weiter.",
    },
    {
      id: "jahresmeldung",
      term: "Jahresmeldung",
      text: "Was der Anbieter für DAC8 jedes Jahr ans Finanzamt schickt: Name, Anschrift, Steuerwohnsitz, Steuernummer, Geburtsdatum und Jahressummen je Kryptowert. Wallet-Adressen und einzelne Transaktionen stehen nicht darin.",
    },
    {
      id: "dac8",
      term: "DAC8",
      text: "Eine 2023 beschlossene Änderung der EU-Richtlinie über die Zusammenarbeit der Steuerbehörden (2011/16/EU). Sie weitet den automatischen Austausch von Steuerdaten auf Kryptowerte aus.",
    },
    {
      id: "krypto-mpfg",
      term: "Krypto-MPfG",
      text: "Das Krypto-Meldepflichtgesetz, mit dem Österreich DAC8 umsetzt, in Kraft seit 1. Jänner 2026. Es verlangt zusätzlich, die Meldedaten für alle Kunden aufzubereiten.",
    },
    {
      id: "fm-gwg",
      term: "FM-GwG",
      text: "Das Finanzmarkt-Geldwäschegesetz. Es verlangt die Identitätsprüfung und die Aufbewahrung von Ausweis- und Transaktionsunterlagen, derzeit bis zehn Jahre nach Ende der Kundenbeziehung.",
    },
    {
      id: "travel-rule",
      term: "Travel Rule",
      text: "Die EU-Geldtransferverordnung: Bei jeder Krypto-Übertragung erfasst der Anbieter Angaben zu Absender und Empfänger, auch wenn du auf deine eigene Wallet überträgst.",
    },
    {
      id: "honeypot",
      term: "Honeypot",
      text: "Ein Datenbestand, der so viel Wertvolles an einer Stelle sammelt, dass er Angreifer anzieht.",
    },
  ],
  en: [
    {
      id: "anbieter",
      term: "Provider",
      text: "In law, a crypto-asset service provider: exchanges, brokers and apps where you buy, sell or keep crypto-assets, including banks that offer crypto. They report under DAC8.",
    },
    {
      id: "kyc",
      term: "KYC",
      text: "Know Your Customer: the identity check when you open an account with a provider, for example with your ID and a selfie. Anti-money-laundering rules require it, and the provider currently keeps the records until ten years after the relationship ends.",
    },
    {
      id: "wallet",
      term: "Wallet",
      text: "An app or device that manages the keys to your crypto-assets. If you leave them with a provider, it holds the keys for you.",
    },
    {
      id: "wallet-adresse",
      term: "Wallet address",
      text: "A string such as bc1q… that bitcoin can be sent to, much like an account number. Payments to an address are public on the blockchain. Not to be confused with your home address.",
    },
    {
      id: "selbstverwahrung",
      term: "Self-custody",
      text: "You hold the keys to your bitcoin yourself, for example on a hardware wallet, instead of leaving them with a provider. As with cash at home, nobody has to approve a transfer.",
    },
    {
      id: "wiederherstellungsphrase",
      term: "Recovery phrase",
      text: "Usually 12 or 24 words that restore a wallet. Whoever knows them can move the bitcoin. Never share your recovery phrase.",
    },
    {
      id: "jahresmeldung",
      term: "Annual report",
      text: "What the provider sends the tax authority every year under DAC8: name, postal address, tax residence, tax identification number, date of birth and annual totals per crypto-asset. Wallet addresses and individual transactions are not in it.",
    },
    {
      id: "dac8",
      term: "DAC8",
      text: "A 2023 amendment to the EU directive on administrative cooperation in taxation (2011/16/EU). It extends the automatic exchange of tax data to crypto-assets.",
    },
    {
      id: "krypto-mpfg",
      term: "Krypto-MPfG",
      text: "The Crypto-Asset Reporting Obligations Act, Austria’s implementation of DAC8, in force since 1 January 2026. It also requires providers to prepare reporting data for all customers.",
    },
    {
      id: "fm-gwg",
      term: "FM-GwG",
      text: "Austria’s Financial Markets Anti-Money Laundering Act. It requires the identity check and the retention of identification and transaction records, currently until ten years after the relationship ends.",
    },
    {
      id: "travel-rule",
      term: "Travel rule",
      text: "The EU transfer of funds regulation: for every crypto transfer, the provider records details of the sender and recipient, including when you transfer to your own wallet.",
    },
    {
      id: "honeypot",
      term: "Honeypot",
      text: "A data store that gathers so much of value in one place that it attracts attackers.",
    },
  ],
}
