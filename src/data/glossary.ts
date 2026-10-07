import type { Language } from "@/lib/i18n"

// Terms readers meet on the site, explained in one or two everyday sentences.
// Copy elsewhere may use them, but explains a term in the same sentence the
// first time it appears on a page. The wording restates the dossier's vetted
// claims (what is reported, what the provider keeps, retention "derzeit"), so
// change both together. For wallets the site says "Selbstverwahrung"
// (self-custody), never "Self-Hosting".
export type Term = { term: string; text: string }

export const glossary: Record<Language, Term[]> = {
  de: [
    {
      term: "Anbieter",
      text: "Im Gesetz Anbieter von Krypto-Dienstleistungen: Börsen, Broker und Apps, bei denen du Kryptowerte kaufst, verkaufst oder verwahren lässt, auch Banken mit Krypto-Angebot. Sie melden für DAC8.",
    },
    {
      term: "KYC",
      text: "Know Your Customer: die Identitätsprüfung, wenn du bei einem Anbieter ein Konto eröffnest, etwa mit Ausweis und Selfie. Die Regeln gegen Geldwäsche verlangen sie, und der Anbieter bewahrt die Unterlagen derzeit bis zehn Jahre nach Ende der Kundenbeziehung auf.",
    },
    {
      term: "Wallet",
      text: "Ein Programm oder Gerät, das die Schlüssel zu deinen Kryptowerten verwaltet. Lässt du sie bei einem Anbieter, hält er die Schlüssel für dich.",
    },
    {
      term: "Wallet-Adresse",
      text: "Eine Zeichenfolge wie bc1q…, an die man Bitcoin schicken kann, ähnlich einer Kontonummer. Zahlungen an eine Adresse sind auf der Blockchain öffentlich. Nicht zu verwechseln mit deiner Wohnadresse.",
    },
    {
      term: "Selbstverwahrung",
      text: "Englisch Self-Custody: Du hältst die Schlüssel zu deinen Bitcoin selbst, etwa auf einer Hardware-Wallet, statt sie bei einem Anbieter liegen zu lassen. Wie bei Bargeld daheim muss niemand eine Übertragung freigeben.",
    },
    {
      term: "Wiederherstellungsphrase",
      text: "Meist 12 oder 24 Wörter, mit denen sich eine Wallet wiederherstellen lässt. Wer sie kennt, kann die Bitcoin übertragen. Seriöse Stellen fragen nie danach.",
    },
    {
      term: "Jahresmeldung",
      text: "Was der Anbieter für DAC8 jedes Jahr ans Finanzamt schickt: Name, Anschrift, Steuerwohnsitz, Steuernummer, Geburtsdatum und Jahressummen je Kryptowert. Wallet-Adressen und einzelne Transaktionen stehen nicht darin.",
    },
    {
      term: "DAC8",
      text: "Die achte Stufe der EU-Richtlinie über die Zusammenarbeit der Steuerbehörden (2011/16/EU). Sie weitet den automatischen Austausch von Steuerdaten auf Kryptowerte aus.",
    },
    {
      term: "Krypto-MPfG",
      text: "Das Krypto-Meldepflichtgesetz, mit dem Österreich DAC8 umsetzt, in Kraft seit 1. Jänner 2026. Es verlangt zusätzlich, die Meldedaten für alle Kunden aufzubereiten.",
    },
    {
      term: "FM-GwG",
      text: "Das Finanzmarkt-Geldwäschegesetz. Es verlangt die Identitätsprüfung und die Aufbewahrung von Ausweis- und Transaktionsunterlagen, derzeit bis zehn Jahre nach Ende der Kundenbeziehung.",
    },
    {
      term: "Travel Rule",
      text: "Die EU-Geldtransferverordnung: Bei jeder Krypto-Übertragung erfasst der Anbieter Angaben zu Absender und Empfänger, auch wenn du auf deine eigene Wallet überträgst.",
    },
    {
      term: "Honeypot",
      text: "Ein Datenbestand, der so viel Wertvolles an einer Stelle sammelt, dass er Angreifer anzieht.",
    },
  ],
  en: [
    {
      term: "Provider",
      text: "In law, a crypto-asset service provider: exchanges, brokers and apps where you buy, sell or keep crypto-assets, including banks that offer crypto. They report under DAC8.",
    },
    {
      term: "KYC",
      text: "Know Your Customer: the identity check when you open an account with a provider, for example with your ID and a selfie. Anti-money-laundering rules require it, and the provider currently keeps the records until ten years after the relationship ends.",
    },
    {
      term: "Wallet",
      text: "An app or device that manages the keys to your crypto-assets. If you leave them with a provider, it holds the keys for you.",
    },
    {
      term: "Wallet address",
      text: "A string such as bc1q… that bitcoin can be sent to, much like an account number. Payments to an address are public on the blockchain. Not to be confused with your home address.",
    },
    {
      term: "Self-custody",
      text: "You hold the keys to your bitcoin yourself, for example on a hardware wallet, instead of leaving them with a provider. As with cash at home, nobody has to approve a transfer.",
    },
    {
      term: "Recovery phrase",
      text: "Usually 12 or 24 words that restore a wallet. Whoever knows them can move the bitcoin. No legitimate service ever asks for them.",
    },
    {
      term: "Annual report",
      text: "What the provider sends the tax authority every year under DAC8: name, postal address, tax residence, tax identification number, date of birth and annual totals per crypto-asset. Wallet addresses and individual transactions are not in it.",
    },
    {
      term: "DAC8",
      text: "The eighth stage of the EU directive on administrative cooperation in taxation (2011/16/EU). It extends the automatic exchange of tax data to crypto-assets.",
    },
    {
      term: "Krypto-MPfG",
      text: "The Crypto-Asset Reporting Obligations Act, Austria’s implementation of DAC8, in force since 1 January 2026. It also requires providers to prepare reporting data for all customers.",
    },
    {
      term: "FM-GwG",
      text: "Austria’s Financial Markets Anti-Money Laundering Act. It requires the identity check and the retention of identification and transaction records, currently until ten years after the relationship ends.",
    },
    {
      term: "Travel rule",
      text: "The EU transfer of funds regulation: for every crypto transfer, the provider records details of the sender and recipient, including when you transfer to your own wallet.",
    },
    {
      term: "Honeypot",
      text: "A data store that gathers so much of value in one place that it attracts attackers.",
    },
  ],
}
