import type { Language } from "@/lib/i18n"

// Why financial privacy matters, and what we demand of DAC8: reasons,
// objections with our answers, demands. The reasons run from the principle
// to the case: privacy as choosing who learns what, and what payments
// reveal; bitcoin as cash and what DAC8 reports of it; what collected data
// does in the wrong hands; and why collection without suspicion is wrong
// and keeps growing. Terms such as wallet or blockchain are explained in
// the visible text of the first reason that uses them, since the evidence
// starts closed. DAC8 is the newest layer of a stack
// that already holds the ID check, every transfer and the account
// registers, so a reason may rest on any layer as long as it names the one
// it means. The lists will change, so no page names how many there are.
// The press material must say the same, so change a reason there too. The
// arguments page shows each reason as a headline and one sentence; the
// evidence sits behind a disclosure with its sources. The letter to members
// of the National Council takes its demands from here.
//
// This page owns the why. What is reported, what stays with the provider and
// for how long is set out in the dossier; restate a fact here only where a
// reason rests on it, and only with a primary source. Examples come from
// Austria, Germany and Switzerland first; from elsewhere only the cases
// readers may already know. The research wiki (dac8-wiki) records how far
// each source carries: no leak of DAC8 data exists yet, annual totals show
// money moved rather than holdings, and payments suggest rather than prove
// what someone believes. The wording restates vetted texts, including the
// campaign lawyer's notes on what the anti-money-laundering rules already
// require, so change claims in both languages together. Never word it so
// that wallet addresses seem reported, and keep the danger on the data,
// never on bitcoin or self-custody.

export type Source = { href: string; label: string }

type ReasonText = {
  // The reason's name: a claim a reader can repeat. It stands above the
  // headline and, with the same number, in the overview in the hero.
  short: string
  title: string
  // One sentence, two at most: the reason in plain words.
  text: string
  // The evidence behind the disclosure, one paragraph per entry.
  proof: string[]
  sources: Source[]
}

export type Reason = {
  // Stable anchor for press links, such as /argumente/#zielliste.
  id: string
  // Anchors of the page before October 2026 that other pages and shared
  // links still use: `alias` sits on the headline, `proofId` on the
  // evidence, which opens when the address points to it.
  alias?: string
  proofId?: string
  // Two reasons link out, each to the page that shows its proof: the map
  // of documented attacks and the history of the directive's growth.
  attacks?: true
  history?: true
} & Record<Language, ReasonText>

const manifesto = "https://www.activism.net/cypherpunk/manifesto.html"
// Both quotations: paragraph 146 (BVerfGE 65, 1, 43).
const censusRuling =
  "https://www.bundesverfassungsgericht.de/SharedDocs/Entscheidungen/DE/1983/12/rs19831215_1bvr020983.html"
const dataProtectionAct =
  "https://ris.bka.gv.at/eli/bgbl/i/1999/165/A1P1/NOR40139563"
const whitepaper = "https://bitcoin.org/bitcoin.pdf"
const dac8 = "https://eur-lex.europa.eu/eli/dir/2023/2226/oj"
// The bank-account exchange (CRS) leaves out Austrian residents' accounts.
const bankReporting =
  "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009250"
const section20 =
  "https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR40273819/NOR40273819.pdf"
// Explanatory notes to the government bill, p. 14: ten years chosen "Aus
// Vereinfachungsgründen" by analogy to Section 209(3) BAO.
const billNotes =
  "https://www.parlament.gv.at/dokument/XXVIII/I/306/fname_1723216.pdf"
// Germany and the Netherlands build the transaction record only for users
// found reportable; Ireland keeps provider records six years.
const germanAct = "https://www.gesetze-im-internet.de/ksttg/BJNR1600B0025.html"
const dutchDecision = "https://zoek.officielebekendmakingen.nl/stb-2026-93.html"
const irishRegulations =
  "https://www.revenue.ie/en/tax-professionals/legislation/statutory-instruments/2025/si-584-2025.pdf"
const amlRetention =
  "https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20009769"
const fractal =
  "http://web.archive.org/web/20240726003733/https://web.fractal.id/fractal-id-data-breach-post-mortem/"
const paymentStudy = "https://petsymposium.org/popets/2018/popets-2018-0038.php"
// Address clustering rests on heuristics; one wrong guess about change
// can merge unrelated clusters.
const clusteringStudy = "https://arxiv.org/abs/2107.05749"
const waltio =
  "https://help.waltio.com/en/articles/13482134-questions-answers-security-incident"
// Gendinfo, 13 September 2026: the leak is one reason ("notamment") for
// the rise; Col. Pegeot says criminals use it to pick targets and sometimes
// misjudge holdings. Keep it that narrow.
const gendarmerie =
  "https://www.gendarmerie.interieur.gouv.fr/gendinfo/terrain/immersion/2026/la-strategie-de-la-gendarmerie-face-aux-cryptorapts-partie-2-2"
const ledger = "https://www.ledger.com/message-ledgers-ceo-data-leak"
// Orders from 2019 to 2021 leaked although the shipping provider had
// confirmed their deletion in writing several times.
const trezorShipping =
  "https://trezor.io/blog/news/recent-customer-data-exposed-in-shipping-provider-incident"
// Consumer platform, not an authority. The first campaign cites the crypto
// tax rules; the second asks about gold, jewellery and cash and goes out
// at random.
const phishing =
  "https://www.watchlist-internet.at/news/phishing-falle-finanzonline-krypto/"
const phishingSms =
  "https://www.watchlist-internet.at/news/finanzonline-phishing-krypto-unternehmensdaten/"
const transferRegulation = "https://eur-lex.europa.eu/eli/reg/2023/1113/oj"
// Section 5.1: donations and medical bills as payments that reveal
// sensitive data. It concerns detailed payment data, which the provider
// holds and the annual report does not carry.
const paymentGuidelines =
  "https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202006_psd2_afterpublicconsultation_en.pdf"
// No processor was under court order to block payments (pp. 1524-1525).
const wikileaks =
  "https://www.floridalawreview.com/api/v1/articles/80812-internet-payment-blockades.pdf"
// About 280 accounts, cards and credit lines frozen (joint committee
// report, pp. 62-64). The courts found the information sharing breached
// section 8 of the Charter: 2024 FC 42, affirmed by 2026 FCA 6, which held
// that freezing alone was no seizure (para. 416); leave to the Supreme
// Court was pending in October 2026.
const convoyReport =
  "https://www.parl.ca/Content/Committee/441/DEDC/Reports/RP13414575/dedcrp03/dedcrp03-e.pdf"
const convoyRuling =
  "https://www.fct-cf.gc.ca/Content/assets/pdf/base/2024.01.23-306-22-T-316-22-T-347-22-T-382-22.pdf"
const convoyAppeal =
  "https://decisions.fca-caf.gc.ca/fca-caf/decisions/en/item/521758/index.do"
// Austrian financial intelligence unit, report 2024, pp. 25-36: reports
// kept without initial suspicion, and accounts opened with forged
// Austrian passports bearing real people's data.
const fiuReport =
  "https://www.bundeskriminalamt.at/308/files/409_2025_Geldwaeschebericht_2024_A4_V20251020_Web.pdf"
// Impact assessment: no data on gains already taxed (p. 12), estimate from
// bitcoin gains scaled up to all crypto-assets (Annex 4, pp. 66-68).
const impactAssessment =
  "https://data.consilium.europa.eu/doc/document/ST-15829-2022-ADD-2/en/pdf"
// Federal government's answer on account lookups, with figures per authority
// since 2005. It warns that 2005 and 2023 totals are not comparable because
// the counting changed, so compare users, not totals.
const accountLookups = "https://dserver.bundestag.de/btd/20/108/2010841.pdf"
const registerLaw2015 =
  "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2015_I_116/BGBLA_2015_I_116.html"
const registerLaw2026 =
  "https://www.ris.bka.gv.at/Dokumente/BgblAuth/BGBLA_2026_I_46/BGBLA_2026_I_46.html"
const accountRegistries = "https://eur-lex.europa.eu/eli/dir/2024/1640/oj"
// Bribed support staff took data from systems they were allowed to use.
const coinbaseIncident =
  "https://www.sec.gov/Archives/edgar/data/1679788/000167978825000094/coin-20250514.htm"
// Disciplinary decision: thousands of queries without official reason,
// more than 1,000 of them on people from his home town.
const taxOfficial =
  "https://www.ris.bka.gv.at/Dokumente/Dok/DKT_BMF_20160930_01069_7_DK_14_01072_7_DK_15_00/DKT_BMF_20160930_01069_7_DK_14_01072_7_DK_15_00.html"
// Withholding by domestic providers, mandatory for income after 2023;
// residents only, since non-residents owe no Austrian tax on crypto.
const capitalGainsWithholding =
  "https://www.bmf.gv.at/themen/steuern/sparen-veranlagen/steuerliche-behandlung-von-kryptowaehrungen.html"
// Constitutional Court on the exchange of bank-account data (CRS): balance
// and interest do not touch the core of private life.
// Constitutional Court 2014, para. 183: data retention hits almost only
// people who gave no cause. It concerned telecoms data, not DAC8.
const retentionRuling =
  "https://www.ris.bka.gv.at/Dokumente/Vfgh/JFT_20140627_12G00047_00/JFT_20140627_12G00047_00.pdf"
const bulgaria =
  "https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62021CJ0340"
// Exchanged account data (CRS/DAC) was among the leaked records.
const bulgariaOecd =
  "https://web.archive.org/web/20240123063026/https://www.oecd.org/tax/transparency/documents/statement-on-the-data-breach-in-the-national-revenue-agency-of-bulgaria.htm"
const accountDataRuling =
  "https://www.ris.bka.gv.at/Dokumente/Vfgh/JFT_20230309_21E02097_00/JFT_20230309_21E02097_00.pdf"

export const reasons: Reason[] = [
  {
    id: "privat",
    de: {
      short: "Privatsphäre heißt, selbst zu entscheiden",
      title: "Privatsphäre heißt nicht, etwas zu verbergen.",
      text: "Sie heißt, selbst zu entscheiden, wer was über dich weiß. Beim Bargeld ist das selbstverständlich: An der Kassa fragt niemand nach deinem Namen.",
      proof: [
        "„Privatsphäre ist nicht Geheimhaltung“, schrieb Eric Hughes 1993 im Manifest der Cypherpunks, einer Bewegung von Programmierern, in deren Tradition Bitcoin steht. Privat ist, was man nicht der ganzen Welt mitteilen will, geheim, was niemand wissen soll. Privatsphäre ist die Macht, selbst zu entscheiden, was man von sich zeigt.",
        "Das deutsche Bundesverfassungsgericht sah es 1983 ebenso: Eine Rechtsordnung, „in der Bürger nicht mehr wissen können, wer was wann und bei welcher Gelegenheit über sie weiß“, wäre mit dem Recht auf informationelle Selbstbestimmung nicht vereinbar.",
        "In Österreich ist der Datenschutz ein Grundrecht im Verfassungsrang. Der Staat darf nur eingreifen, wo es nötig ist, und auch dann nur „in der gelindesten, zum Ziel führenden Art“.",
      ],
      sources: [
        { href: manifesto, label: "Hughes 1993" },
        { href: censusRuling, label: "BVerfGE 65, 1" },
        { href: dataProtectionAct, label: "§ 1 DSG" },
      ],
    },
    en: {
      short: "Privacy means deciding for yourself",
      title: "Privacy does not mean hiding something.",
      text: "It means deciding for yourself who knows what about you. With cash, that goes without saying: nobody at the till asks for your name.",
      proof: [
        "“Privacy is not secrecy,” Eric Hughes wrote in 1993 in the Cypherpunk’s Manifesto, the movement of programmers in whose tradition bitcoin stands. “A private matter is something one doesn’t want the whole world to know, but a secret matter is something one doesn’t want anybody to know. Privacy is the power to selectively reveal oneself to the world.”",
        "Germany’s Federal Constitutional Court saw it the same way in 1983: a legal order in which citizens can no longer know who knows what about them, when and on what occasion, would be incompatible with the right to informational self-determination.",
        "In Austria, data protection is a fundamental right with constitutional rank. The state may interfere only where necessary, and even then only in the least intrusive way that achieves its aim.",
      ],
      sources: [
        { href: manifesto, label: "Hughes 1993" },
        { href: censusRuling, label: "BVerfGE 65, 1" },
        { href: dataProtectionAct, label: "Section 1 DSG" },
      ],
    },
  },
  {
    id: "alle",
    de: {
      short: "Privatsphäre betrifft alle",
      title:
        "Niemand muss reich sein, um finanzielle Privatsphäre zu brauchen.",
      text: "Überträgst du Bitcoin über eine Börse, einen Broker oder eine App, wird dort gespeichert, wer an wen zahlt. Daraus kann hervorgehen, wem du spendest, wen du unterstützt und wo du Mitglied bist.",
      proof: [
        "Das verlangt die EU-Geldtransferverordnung: Namen und Wallet-Adressen von Absender und Empfänger, auch wenn das Ziel deine eigene Wallet ist. Aufbewahrt wird das bei allen Kunden, ohne Verdacht und über Jahre.",
        "Die europäischen Datenschutzbehörden warnen, dass schon einzelne Zahlungen viel verraten: Spenden etwa politische oder religiöse Überzeugungen, Arztrechnungen die Gesundheit. In der Jahresmeldung stehen davon nur Jahressummen, beim Anbieter liegt jede einzelne Zahlung.",
        "Wie schnell Zahlungswege und Finanzdaten gegen politische Anliegen gewendet werden, zeigen zwei bekannte Fälle. Im Dezember 2010 blockierten Visa, Mastercard und PayPal Spenden an WikiLeaks, ohne dazu gerichtlich verpflichtet zu sein. 2022 ließ Kanada während der Trucker-Proteste rund 280 Konten, Karten und Kreditlinien einfrieren, und Banken mussten Angaben über betroffene Kunden an die Polizei weitergeben. Kanadische Gerichte urteilten 2024 und 2026, noch nicht rechtskräftig, dass diese Weitergabe gegen den Schutz vor unangemessener Durchsuchung verstieß.",
        "Überwachung wirkt auch ohne Datenleck. Das Bundesverfassungsgericht schrieb 1983: „Wer unsicher ist, ob abweichende Verhaltensweisen jederzeit notiert und als Information dauerhaft gespeichert, verwendet oder weitergegeben werden, wird versuchen, nicht durch solche Verhaltensweisen aufzufallen.“",
      ],
      sources: [
        { href: transferRegulation, label: "Verordnung (EU) 2023/1113" },
        { href: amlRetention, label: "§ 21 FM-GwG" },
        { href: paymentGuidelines, label: "EDSA-Leitlinien 06/2020" },
        { href: wikileaks, label: "Bridy 2015" },
        { href: convoyReport, label: "Parlament Kanada" },
        { href: convoyRuling, label: "2024 FC 42" },
        { href: convoyAppeal, label: "2026 FCA 6" },
        { href: censusRuling, label: "BVerfGE 65, 1" },
      ],
    },
    en: {
      short: "Privacy concerns everyone",
      title: "Nobody has to be rich to need financial privacy.",
      text: "Move bitcoin through an exchange, broker or app, and it stores who pays whom. That can show whom you donate to, whom you support and where you are a member.",
      proof: [
        "The EU transfer of funds regulation requires it: the names and wallet addresses of sender and recipient, even when the destination is your own wallet. It is kept for every customer, without suspicion, for years.",
        "Europe’s data protection authorities warn that even single payments reveal a lot: donations can show political or religious beliefs, medical bills someone’s health. Of these, the annual report carries only yearly totals; the provider holds every single payment.",
        "Two well-known cases show how quickly payment routes and financial data can be turned against political causes. In December 2010, Visa, Mastercard and PayPal blocked donations to WikiLeaks without any court order requiring them to. In 2022, during the trucker protests, Canada had around 280 accounts, cards and credit lines frozen, and banks had to pass information about the customers concerned to the police. Canadian courts ruled in 2024 and 2026, not yet finally, that this sharing breached the protection against unreasonable search.",
        "Surveillance has an effect even without a data leak. Germany’s Federal Constitutional Court wrote in 1983 that anyone unsure whether deviant behaviour is recorded at any time and permanently stored, used or passed on as information will try not to attract attention through such behaviour.",
      ],
      sources: [
        { href: transferRegulation, label: "Regulation (EU) 2023/1113" },
        { href: amlRetention, label: "Section 21 FM-GwG" },
        { href: paymentGuidelines, label: "EDPB Guidelines 06/2020" },
        { href: wikileaks, label: "Bridy 2015" },
        { href: convoyReport, label: "Parliament of Canada" },
        { href: convoyRuling, label: "2024 FC 42" },
        { href: convoyAppeal, label: "2026 FCA 6" },
        { href: censusRuling, label: "BVerfGE 65, 1" },
      ],
    },
  },
  {
    id: "selbstverwahrung",
    de: {
      short: "Bitcoin ist digitales Bargeld",
      title: "Bitcoin in der eigenen Wallet ist wie Bargeld daheim.",
      text: "Bei der Selbstverwahrung hältst du die Schlüssel zu deinen Bitcoin selbst, in einer Wallet, also einer App oder einem Gerät. Wie beim Bargeld wird es vor allem dann gefährlich, wenn andere erfahren, wer vermutlich wie viel hat.",
      proof: [
        "Bitcoin wurde 2008 als elektronisches Bargeld entworfen, das ohne Bank von Person zu Person geht. Wer die Schlüssel hat, kann seine Bitcoin übertragen, ohne dass jemand zustimmen muss.",
        "Das macht dich unabhängig, zieht aber wie Bargeld Kriminelle an, aus der Ferne ebenso wie vor Ort. Darum solltest du selbst entscheiden, wem du zeigst, wie viel du besitzt. Gefährlich sind Datenbestände, die Menschen identifizieren, nicht die eigene Wallet.",
      ],
      sources: [{ href: whitepaper, label: "Nakamoto 2008" }],
    },
    en: {
      short: "Bitcoin is digital cash",
      title: "Bitcoin in your own wallet is like cash at home.",
      text: "In self-custody, you hold the keys to your bitcoin yourself, in a wallet, that is an app or a device. As with cash, the danger comes mainly when others learn who probably holds how much.",
      proof: [
        "Bitcoin was designed in 2008 as electronic cash that passes from person to person without a bank. Whoever has the keys can move their bitcoin without anyone’s approval.",
        "That makes you independent, but like cash it draws criminals, from far away as well as in person. That is why you should decide for yourself whom you show how much you hold. The danger lies in data stores that identify people, not in your own wallet.",
      ],
      sources: [{ href: whitepaper, label: "Nakamoto 2008" }],
    },
  },
  {
    id: "bargeld",
    alias: "verdacht",
    de: {
      short: "Gemeldet wird auch, was keine Steuer auslöst",
      title:
        "Stell dir vor, deine Bank meldet dem Finanzamt jedes Jahr, wie viel Bargeld du abgehoben hast.",
      text: "Bei Bitcoin verlangt DAC8 genau das: Hebst du Bitcoin von der Börse ab, um sie selbst zu verwahren, steht die Jahressumme in der Regel in der Meldung, obwohl das für sich genommen keine Steuer auslöst.",
      proof: [
        "Für dein Bankkonto im Inland gibt es keine solche Jahresmeldung: Den automatischen Austausch über Bankkonten gibt es nur für Kunden, die im Ausland steuerlich ansässig sind. Bei Krypto-Anbietern erfasst DAC8 auch Kunden im Inland.",
        "Die Wallet-Adresse, gleichsam die Kontonummer deiner Wallet, steht nicht in der Meldung, nur die Summe. Gelangt so eine Meldung in falsche Hände, zeigt sie trotzdem, wer vermutlich Erspartes selbst verwahrt.",
      ],
      sources: [
        { href: dac8, label: "Richtlinie (EU) 2023/2226" },
        { href: bankReporting, label: "GMSG" },
      ],
    },
    en: {
      short: "Reported even when no tax is due",
      title:
        "Imagine your bank telling the tax authority every year how much cash you withdrew.",
      text: "For bitcoin, DAC8 requires exactly that: withdraw bitcoin from an exchange to keep it yourself, and the annual total usually appears in the report, although the transfer triggers no tax by itself.",
      proof: [
        "Your bank account at home has no such annual report: the automatic exchange of bank-account data covers only customers who are tax resident abroad. At crypto-asset providers, DAC8 also covers customers at home.",
        "The wallet address, in effect your wallet’s account number, is not in the report, only the total. In the wrong hands, such a report still shows who probably keeps savings in self-custody.",
      ],
      sources: [
        { href: dac8, label: "Directive (EU) 2023/2226" },
        { href: bankReporting, label: "GMSG" },
      ],
    },
  },
  {
    id: "pseudonym",
    proofId: "zahlungsprofile",
    de: {
      short: "Pseudonym ist nicht anonym",
      title: "Die Blockchain zeigt Zahlungen, aber keine Namen.",
      text: "Die Blockchain, das öffentliche Verzeichnis aller Bitcoin-Zahlungen, führt sie unter Wallet-Adressen, einer Art Kontonummer. Verrät ein Datenleck, welche davon dir gehören, lassen sich dir ihre Zahlungen zuordnen, frühere wie künftige.",
      proof: [
        "Schon das Bitcoin-Whitepaper warnt: Wird bekannt, wem ein Schlüssel gehört, können durch Verknüpfungen weitere Transaktionen derselben Person erkennbar werden. Und die Blockchain vergisst nichts. Beim Berliner Identifizierungsdienst Fractal ID lagen Ausweis, Wohnadresse und Wallet-Adresse in einem Datensatz, bis Angreifer ihn kopierten.",
        "Ist eine Wallet-Adresse einmal einem Namen zugeordnet, lassen ihre Zahlungen mit Angaben über die Empfänger Rückschlüsse auf Einkäufe, Spenden und Beziehungen zu.",
        "Ein Profil ist kein Beweis. Welche Wallet-Adressen zusammengehören, leiten Analysefirmen aus Annahmen ab, und schon eine falsche kann die Zahlungen verschiedener Menschen zusammenwerfen. Wer nach einem solchen Profil beurteilt wird, muss Fehler finden und berichtigen können.",
      ],
      sources: [
        { href: whitepaper, label: "Nakamoto 2008" },
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
        { href: clusteringStudy, label: "Möser und Narayanan 2022" },
      ],
    },
    en: {
      short: "Pseudonymous is not anonymous",
      title: "The blockchain shows payments, but no names.",
      text: "The blockchain, the public record of all bitcoin payments, lists them under wallet addresses, a kind of account number. If a data breach reveals which ones are yours, their payments can be traced to you, past and future.",
      proof: [
        "The bitcoin whitepaper already warns: if the owner of a key is revealed, linking could reveal other transactions that belonged to the same owner. And the blockchain forgets nothing. At the Berlin identity verification service Fractal ID, ID documents, home addresses and wallet addresses sat in one record until attackers copied it.",
        "Once a wallet address is tied to a name, its payments, together with information about the recipients, allow inferences about purchases, donations and relationships.",
        "A profile is not proof. Analytics firms infer which wallet addresses belong together from assumptions, and a single wrong one can lump different people’s payments together. Anyone judged by such a profile must be able to find and correct errors.",
      ],
      sources: [
        { href: whitepaper, label: "Nakamoto 2008" },
        { href: fractal, label: "Fractal ID" },
        { href: paymentStudy, label: "Goldfeder et al. 2018" },
        { href: clusteringStudy, label: "Möser and Narayanan 2022" },
      ],
    },
  },
  {
    id: "zielliste",
    alias: "sicherheit",
    attacks: true,
    de: {
      short: "Daten verraten, bei wem etwas zu holen sein könnte",
      title: "Aus Datenlecks werden Ziellisten.",
      text: "Schon der Verdacht auf Krypto-Vermögen kann Überfälle und Entführungen auslösen, ob der vermutete Bestand stimmt oder nicht. Daten bei Anbietern, Dienstleistern und Behörden können Tätern dafür Ansatzpunkte liefern.",
      proof: [
        "Aus Summe und Anzahl der Käufe und Übertragungen lässt sich grob schätzen, wie viel jemand bewegt. Die Schätzung kann weit danebenliegen, weil dasselbe Geld mehrfach zählen kann. Wer die Daten erbeutet, filtert trotzdem Menschen heraus, die vermögend wirken.",
        "Beim französischen Krypto-Steuerdienst Waltio gelangten E-Mail-Adressen, Gewinne und Verluste sowie Jahresendbestände der Kunden in fremde Hände. Laut französischer Polizei ist das Datenleck ein Grund für die Zunahme solcher Gewalttaten: Täter wählen damit Opfer aus und irren sich dabei teils über deren tatsächliche Bestände.",
        "Beim Hardware-Wallet-Hersteller Ledger gelangten 2020 Namen, Anschriften und Telefonnummern von rund 272.000 Käufern ins Netz, eine Liste von Menschen, die Bitcoin vermutlich selbst verwahren.",
        "In Österreich nutzen Betrüger die neuen Krypto-Steuerregeln schon als Vorwand: Gefälschte FinanzOnline-Nachrichten fragen nach Krypto-Beständen, eine wahllos verschickte SMS-Masche auch nach Gold und Bargeld.",
      ],
      sources: [
        { href: waltio, label: "Waltio" },
        { href: gendarmerie, label: "Gendarmerie nationale" },
        { href: ledger, label: "Ledger" },
        { href: phishing, label: "Watchlist Internet" },
        { href: phishingSms, label: "Watchlist Internet (SMS)" },
      ],
    },
    en: {
      short: "Data shows where there might be something to take",
      title: "Data breaches turn into target lists.",
      text: "Suspected crypto wealth alone can lead to robberies and kidnappings, whether the presumed holdings are real or not. Data held by providers, service providers and authorities can give offenders a starting point.",
      proof: [
        "Totals and counts of purchases and transfers give a rough estimate of how much someone moves. The estimate can be far off, because the same money can count more than once. Anyone who gets hold of the data still singles out people who appear wealthy.",
        "At the French crypto tax service Waltio, customers’ email addresses, gains and losses and year-end balances fell into the wrong hands. According to the French police, the leak is one reason for the rise in such violent crime: criminals use the data to select victims, sometimes misjudging what they actually hold.",
        "In 2020, the names, postal addresses and phone numbers of around 272,000 customers of the hardware wallet maker Ledger were leaked online: a list of people who probably keep bitcoin in self-custody.",
        "In Austria, fraudsters already use the new crypto tax rules as a pretext: fake FinanzOnline messages ask about crypto holdings, and an SMS scam sent out at random also asks about gold and cash.",
      ],
      sources: [
        { href: waltio, label: "Waltio" },
        { href: gendarmerie, label: "Gendarmerie nationale" },
        { href: ledger, label: "Ledger" },
        { href: phishing, label: "Watchlist Internet" },
        { href: phishingSms, label: "Watchlist Internet (SMS)" },
      ],
    },
  },
  {
    id: "akte",
    alias: "speicherdauer",
    proofId: "verknuepfung",
    de: {
      short: "Jede Jahresmeldung bleibt zehn Jahre",
      title: "Mit jedem Jahr wird die Akte dicker.",
      text: "Bleibst du Kunde, liegen ab 2036 laufend zehn Jahresmeldungen beim Anbieter. Je mehr Jahre darin liegen, desto mehr verrät ein einziger Einbruch.",
      proof: [
        "Die Akte entsteht für alle: Der Anbieter muss die Meldedaten für jeden Kunden aufbereiten, auch für jene, die nie gemeldet werden. Damit geht Österreich über die EU-Richtlinie hinaus. Deutschland und die Niederlande verlangen das nur für Kunden, die tatsächlich gemeldet werden.",
        "Der Anbieter löscht jede Jahresmeldung erst zehn Jahre nach ihrem Meldejahr, laut Gesetzesbegründung „aus Vereinfachungsgründen“. Für Meldungen über Bankkonten gelten fünf Jahre, Irland sieht bei Krypto-Anbietern grundsätzlich sechs vor.",
        "Und ob nach Ablauf der Frist wirklich gelöscht wird, musst du glauben. Beim Versanddienstleister des Wallet-Herstellers Trezor tauchten 2026 Bestellungen aus 2019 bis 2021 in einem Datenleck auf, obwohl er mehrfach schriftlich bestätigt hatte, sie gelöscht zu haben.",
        "Daneben bewahrt der Anbieter nach den Geldwäschevorschriften Ausweis, Wallet-Adressen und einzelne Transaktionen auf, derzeit bis zehn Jahre nach Ende der Kundenbeziehung. Für DAC8 kommen Steuernummer und Steuerwohnsitz dazu. Beim Finanzamt laufen die Jahresmeldungen aller Anbieter zusammen, bei denen du Kunde bist; lebst du in Deutschland, beim deutschen.",
        "Auch Steuerbehörden verlieren Daten: Aus der bulgarischen Steuerbehörde gelangten 2019 Daten von mehr als sechs Millionen Menschen ins Netz. Laut OECD waren auch Kontodaten aus dem automatischen Austausch darunter, über den künftig die DAC8-Meldungen laufen.",
        "Entscheidend ist das Gesamtbild: Meldungen über mehrere Anbieter und Jahre, das Datenleck eines Steuertools und zuordenbare Blockchain-Daten können zusammen ein Profil von Aktivität und vermutetem Vermögen ergeben.",
      ],
      sources: [
        { href: section20, label: "§ 20 Krypto-MPfG" },
        { href: billNotes, label: "Regierungsvorlage 306 d.B." },
        { href: germanAct, label: "KStTG" },
        { href: dutchDecision, label: "Stb. 2026, 93" },
        { href: irishRegulations, label: "S.I. 584/2025" },
        { href: trezorShipping, label: "Trezor" },
        { href: amlRetention, label: "§ 21 FM-GwG" },
        { href: bulgaria, label: "EuGH C-340/21" },
        { href: bulgariaOecd, label: "OECD 2019" },
      ],
    },
    en: {
      short: "Each annual report is kept ten years",
      title: "Every year, the file grows thicker.",
      text: "If you remain a customer, from 2036 ten annual reports will always be on file. The more years it holds, the more a single breach gives away.",
      proof: [
        "The file is built for everyone: the provider must prepare reporting data for every customer, including those who are never reported. Here Austria goes beyond the EU directive. Germany and the Netherlands require it only for customers who are actually reported.",
        "The provider deletes each annual report only ten years after its reporting year, according to the bill’s explanatory notes “for reasons of simplicity”. For reports on bank accounts, the period is five years, and Ireland generally sets six for crypto-asset providers.",
        "And whether the data is really deleted when the period ends, you have to take on trust. In 2026, orders from 2019 to 2021 turned up in a breach at the wallet maker Trezor’s shipping provider, although it had repeatedly confirmed in writing that it had deleted them.",
        "Under anti-money-laundering rules, the provider also keeps your ID, wallet addresses and individual transactions, currently until ten years after the relationship ends. For DAC8, it adds your tax identification number and tax residence. At the tax authority, the annual reports from every provider you use come together; if you live in Germany, at the German one.",
        "Tax authorities lose data too: in 2019, data on more than six million people leaked from the Bulgarian tax authority. According to the OECD, it included account data from the automatic exchange that DAC8 reports will travel through.",
        "What matters is the overall picture: reports across several providers and years, a breach at a tax tool and attributable blockchain data can together add up to a profile of activity and presumed wealth.",
      ],
      sources: [
        { href: section20, label: "Section 20 Krypto-MPfG" },
        { href: billNotes, label: "Government bill 306" },
        { href: germanAct, label: "KStTG" },
        { href: dutchDecision, label: "Stb. 2026, 93" },
        { href: irishRegulations, label: "S.I. 584/2025" },
        { href: trezorShipping, label: "Trezor" },
        { href: amlRetention, label: "Section 21 FM-GwG" },
        { href: bulgaria, label: "CJEU C-340/21" },
        { href: bulgariaOecd, label: "OECD 2019" },
      ],
    },
  },
  {
    id: "anlasslos",
    de: {
      short: "Erfasst werden Unverdächtige",
      title:
        "In die Akte kommt, wer einen Anbieter nutzt, nicht wer verdächtig ist.",
      text: "Gemeldet wird, wer über eine Börse, einen Broker oder eine App kauft, ohne jeden Verdacht. Wer Bitcoin direkt von Mensch zu Mensch kauft oder sich Waren und Arbeit in Bitcoin bezahlen lässt, steht nicht darin, und verdächtig ist keiner von beiden.",
      proof: [
        "Der Verfassungsgerichtshof hob 2014 die Vorratsdatenspeicherung von Telefon- und Internetdaten auf. Sie erfasse „fast ausschließlich Personen, die keinerlei Anlass […] für die Datenspeicherung gegeben haben“.",
        "Auch was ins Leere läuft, bleibt gespeichert: 2024 gingen bei der österreichischen Geldwäschemeldestelle 11.111 Verdachtsmeldungen ein, 1.228 davon von Krypto-Anbietern. 8.138 führten vorerst nicht weiter, mangels Anfangsverdachts, also eines Anhaltspunkts für eine Straftat, oder weiterer Ansätze. Sie bleiben für spätere Auswertungen bis zu fünf Jahre gespeichert.",
        "Die Ausweisprüfung zeigt, wessen Ausweis vorgelegt wurde, nicht wer das Konto nutzt. Laut Geldwäschemeldestelle eröffnen Kriminelle Konten mit gefälschten österreichischen Pässen, die Daten echter, unbeteiligter Menschen tragen.",
        "Die zusätzlichen Steuereinnahmen durch DAC8 schätzte die Kommission auf bis zu 2,4 Milliarden Euro im Jahr. Gerechnet hat sie mit der Steuer auf alle Gewinne aus Bitcoin, hochgerechnet auf alle Kryptowerte, obwohl sie nach eigenen Angaben nicht wusste, wie viel davon bereits versteuert war.",
      ],
      sources: [
        { href: retentionRuling, label: "VfGH G 47/2012" },
        { href: fiuReport, label: "Geldwäsche-Lagebericht 2024" },
        { href: impactAssessment, label: "SWD(2022) 401" },
      ],
    },
    en: {
      short: "It records people under no suspicion",
      title:
        "The file holds whoever uses a provider, not whoever is suspected.",
      text: "Anyone who buys through an exchange, broker or app is reported, without any suspicion. Anyone who buys bitcoin directly from another person or is paid in bitcoin for goods and work is not in it, and neither of them is suspect.",
      proof: [
        "In 2014, Austria’s Constitutional Court struck down the retention of phone and internet data. It found that the retention captured almost exclusively people who had given no cause for it.",
        "Even what leads nowhere stays on file: in 2024, Austria’s financial intelligence unit received 11,111 suspicious transaction reports, 1,228 of them from crypto-asset providers. 8,138 led nowhere for now, for lack of an initial suspicion of a crime or of further leads. They are kept for later analysis for up to five years.",
        "The ID check shows whose ID was presented, not who uses the account. According to the financial intelligence unit, criminals open accounts with forged Austrian passports bearing the data of real, uninvolved people.",
        "The Commission estimated the extra tax revenue from DAC8 at up to 2.4 billion euros a year. It counted the tax on all bitcoin gains, scaled up to all crypto-assets, although by its own account it did not know how much of that had already been taxed.",
      ],
      sources: [
        { href: retentionRuling, label: "VfGH G 47/2012" },
        { href: fiuReport, label: "Money laundering report 2024" },
        { href: impactAssessment, label: "SWD(2022) 401" },
      ],
    },
  },
  {
    id: "zweck",
    alias: "ausbau",
    history: true,
    de: {
      short: "Finanzielle Überwachung braucht Grenzen",
      title: "Was gesammelt ist, wird für mehr genutzt.",
      text: "Seit DAC8 erlaubt die Richtlinie, alle Steuerdaten, die Staaten nach ihr austauschen, auch über Bankkonten, gegen Geldwäsche und für EU-Sanktionen zu nutzen. Wir wollen finanzielle Überwachung begrenzen, bevor sie weiter wächst.",
      proof: [
        "Wie so etwas wächst, zeigt Österreich: Das Kontenregister entstand 2015 im selben Gesetz, das das Bankgeheimnis lockerte. Seit Juli 2026 nutzt es auch das Amt für Betrugsbekämpfung, etwa gegen Sozialbetrug und Scheinfirmen. In Deutschland fragten Gerichtsvollzieher 2013 erst 61.760 Mal ab, wer welche Konten hat, 2023 schon 844.427 Mal.",
        "DAC8 ist ein Baustein unter mehreren: Den Ausweis prüft der Anbieter schon bei der Kontoeröffnung, Absender und Empfänger erfasst er bei jeder Übertragung. Bis 2029 werden die Kontenregister EU-weit vernetzt; sie erfassen dann auch Konten bei Krypto-Anbietern, ohne Kontostände.",
      ],
      sources: [
        { href: dac8, label: "Richtlinie (EU) 2023/2226" },
        { href: registerLaw2015, label: "BGBl. I 116/2015" },
        { href: registerLaw2026, label: "BGBl. I 46/2026" },
        { href: accountLookups, label: "BT-Drucksache 20/10841" },
        { href: accountRegistries, label: "Richtlinie (EU) 2024/1640" },
      ],
    },
    en: {
      short: "Financial surveillance needs limits",
      title: "What is collected gets used for more.",
      text: "Since DAC8, the directive allows all tax data that states exchange under it, bank-account data included, to be used against money laundering and for EU sanctions. We want to limit financial surveillance before it grows further.",
      proof: [
        "Austria shows how such uses grow: its account register was created in 2015 by the same act that loosened banking secrecy. Since July 2026, the anti-fraud office uses it too, for example against benefit fraud and shell companies. In Germany, bailiffs looked up who holds which accounts 61,760 times in 2013 and 844,427 times in 2023.",
        "DAC8 is one building block among several: the provider checks your ID when you open the account and records the sender and recipient of every transfer. By 2029, account registries will be connected across the EU and will then also cover accounts at crypto-asset providers, without balances.",
      ],
      sources: [
        { href: dac8, label: "Directive (EU) 2023/2226" },
        { href: registerLaw2015, label: "BGBl. I 116/2015" },
        { href: registerLaw2026, label: "BGBl. I 46/2026" },
        { href: accountLookups, label: "Bundestag paper 20/10841" },
        { href: accountRegistries, label: "Directive (EU) 2024/1640" },
      ],
    },
  },
]

export type Point = {
  title: string
  text: string
  sources?: Source[]
}

// What we hear most often, in quotation marks, with our answer. Only claims
// the site already makes elsewhere; a tax fact specific to one country
// names the country and its source.
export const objections: Record<Language, Point[]> = {
  de: [
    {
      title: "„Ich habe nichts zu verbergen.“",
      text: "Privatsphäre braucht keine Rechtfertigung, staatliche Eingriffe schon. Und auch wer nichts verbirgt, hat etwas zu schützen: seine Wohnadresse, sein Erspartes, seine Familie.",
    },
    {
      title: "„Es geht doch um Steuergerechtigkeit.“",
      text: "Auch für die Steuer darf der Staat nur so viele Daten verlangen, wie er braucht. Wer in Österreich steuerlich ansässig ist, dem ziehen österreichische Anbieter die Steuer auf Kursgewinne seit 2024 ohnehin selbst ab; für Kunden in Deutschland gilt das nicht. Wo die Steuer schon abgezogen wird, muss der Staat begründen, wozu er zusätzlich jedes Jahr die Summen braucht, auch für Übertragungen, die keine Steuer auslösen.",
      sources: [{ href: capitalGainsWithholding, label: "BMF" }],
    },
    {
      title: "„Brauchen wir die Daten nicht gegen Kriminalität?“",
      text: "Ermittlungen brauchen Informationen. Daraus folgt nicht, dass jede zusätzliche Angabe, jeder weitere Zugriff und jede lange Speicherfrist nötig ist. Wer Daten über alle verlangt, muss ihren Nutzen belegen und zeigen, dass gezielte Ermittlungen bei konkretem Verdacht nicht genügen.",
    },
    {
      title: "„Die Daten sind doch verschlüsselt.“",
      text: "Verschlüsselung hilft gegen Fremde, nicht gegen jene, die die Daten ohnehin sehen dürfen. In Österreich fragte ein Finanzbeamter jahrelang ohne dienstlichen Grund tausende Steuerdaten ab, darunter von über 1.000 Menschen aus seinem Heimatort. Bei Coinbase sammelten bestochene Support-Mitarbeiter Kundendaten bis hin zu Ausweisbildern und Kontoständen.",
      sources: [
        { href: taxOfficial, label: "Disziplinarkommission beim BMF" },
        { href: coinbaseIncident, label: "Coinbase (Form 8-K)" },
      ],
    },
    {
      title:
        "„Der Verfassungsgerichtshof hat den Austausch von Kontodaten doch erlaubt.“",
      text: "Für Kontostand und Zinsen, ja: Diese berührten laut Gericht nicht den Kernbereich des Privatlebens. DAC8 meldet mehr, nämlich Beträge, Stückzahlen und die Zahl der Transaktionen je Kryptowert, auch über Kunden im Inland, und Österreich lässt die Anbieter die Meldung zehn statt fünf Jahre aufbewahren. Ob das verhältnismäßig ist, hat der Verfassungsgerichtshof bisher nicht entschieden.",
      sources: [{ href: accountDataRuling, label: "VfGH E 2097/2021" }],
    },
    {
      title: "„Ich nutze nur meine eigene Wallet.“",
      text: "Solange du nie einen Anbieter nutzt, meldet DAC8 dich nicht. Hast du dort gekauft und auf deine Wallet übertragen, steht die Jahressumme in der Regel in der Meldung, ohne Wallet-Adresse. Die Wallet-Adresse bleibt beim Anbieter gespeichert.",
    },
    {
      title: "„Dann kauf halt nicht über eine Börse.“",
      text: "Für die meisten ist eine Börse, ein Broker oder eine App der einfachste Weg zu Bitcoin. Privatsphäre darf nicht davon abhängen, auf diesen Weg zu verzichten. Der Schutz muss im Gesetz stehen.",
    },
  ],
  en: [
    {
      title: "“I have nothing to hide.”",
      text: "Privacy needs no justification; state interference does. And even if you hide nothing, you have something to protect: your home address, your savings, your family.",
    },
    {
      title: "“It’s about tax fairness.”",
      text: "Even for taxes, the state may only demand as much data as it needs. For anyone tax resident in Austria, Austrian providers have withheld the tax on gains themselves since 2024; this does not apply to customers in Germany. Where the tax is already withheld, the state must justify why it also needs the yearly totals, including transfers that trigger no tax.",
      sources: [{ href: capitalGainsWithholding, label: "Finance Ministry" }],
    },
    {
      title: "“Don’t we need the data to fight crime?”",
      text: "Investigations need information. That does not make every extra detail, every further access and every long retention period necessary. Whoever demands data on everyone must prove its benefit and show that targeted investigations based on specific suspicion would not do.",
    },
    {
      title: "“But the data is encrypted.”",
      text: "Encryption helps against outsiders, not against those who are allowed to see the data anyway. In Austria, a tax official looked up thousands of tax records for years without official reason, more than 1,000 of them on people from his home town. At Coinbase, bribed support staff collected customer data down to ID images and balances.",
      sources: [
        { href: taxOfficial, label: "Disciplinary board, Finance Ministry" },
        { href: coinbaseIncident, label: "Coinbase (Form 8-K)" },
      ],
    },
    {
      title:
        "“The Constitutional Court has already allowed the exchange of account data.”",
      text: "For balances and interest, yes: according to the court, they did not touch the core of private life. DAC8 reports more, namely amounts, units and the number of transactions per crypto-asset, also on customers at home, and Austria has providers keep the report ten years instead of five. Whether that is proportionate, the Constitutional Court has not yet decided.",
      sources: [{ href: accountDataRuling, label: "VfGH E 2097/2021" }],
    },
    {
      title: "“I only use my own wallet.”",
      text: "As long as you never use a provider, DAC8 does not report you. If you bought there and transferred to your wallet, the annual total usually appears in the report, without the wallet address. The wallet address stays on file with the provider.",
    },
    {
      title: "“Then don’t buy through an exchange.”",
      text: "For most people, an exchange, broker or app is the easiest way to buy bitcoin. Privacy must not depend on avoiding that route. The protection has to be in the law.",
    },
  ],
}

// The page shows title and text; the letter uses `letter` where the page
// wording addresses the reader or leans on the page around it, and title and
// text joined otherwise. The letter goes to Austrian MPs, so a demand that
// only EU law can meet says what Austria can do about it.
export type Demand = { title: string; text: string; letter?: string }

export const demands: Record<Language, Demand[]> = {
  de: [
    {
      title: "Keine Daten auf Vorrat.",
      text: "Erst klären, wessen Daten gemeldet werden müssen, statt sie für alle Kunden aufzubereiten. Deutschland und die Niederlande verlangen das nur für Kunden, die tatsächlich gemeldet werden.",
    },
    {
      title: "Übertragungen auf die eigene Wallet nicht melden.",
      text: "Sie lösen für sich genommen keine Steuer aus, verraten nach einem Datenleck aber, wer vermutlich wie viel Bitcoin daheim hat. Die Meldung schreibt die EU vor; Österreich soll sich für ihre Streichung einsetzen.",
      letter:
        "Übertragungen auf die eigene Wallet nicht melden. Sie lösen für sich genommen keine Steuer aus. Sie trotzdem zu melden ist, als würde die Bank dem Finanzamt sagen, wie viel Bargeld jemand nach Hause getragen hat. Nach einem Datenleck steht dann auf einer Liste, wer vermutlich wie viel Bitcoin daheim hat. Da die EU diese Meldung vorschreibt, soll sich Österreich in Brüssel für ihre Streichung einsetzen, auch bei der geplanten Neufassung der Richtlinie, die nur einstimmig beschlossen werden kann.",
    },
    {
      title: "Nur erheben, was die Steuer braucht.",
      text: "Wozu das Finanzamt neben den Beträgen auch Stückzahlen und die Zahl der Transaktionen braucht, muss belegt werden.",
    },
    {
      title: "Kürzer speichern.",
      text: "Für Meldungen über Bankkonten gelten fünf Jahre, Irland sieht bei Krypto-Anbietern grundsätzlich sechs vor. Zehn Jahre „aus Vereinfachungsgründen“ sind keine Begründung. Kopien, die niemand mehr braucht, müssen auch bei Dienstleistern nachweislich gelöscht werden.",
      letter:
        "Kürzer speichern. Für Meldungen über Bankkonten gelten fünf Jahre, Irland sieht bei Krypto-Anbietern grundsätzlich sechs vor; zehn Jahre „aus Vereinfachungsgründen“ sind keine Begründung. Nicht mehr benötigte Kopien müssen auch bei Dienstleistern nachweislich gelöscht werden.",
    },
    {
      title: "Zugriff begrenzen, Rechte sichern.",
      text: "Für jeden Zweck eine klare Grenze, neue Zwecke und Empfänger nur durch ein eigenes Gesetz, Zugriffe nachvollziehbar und unabhängig kontrolliert. Du musst deine Daten vor der Meldung sehen, Fehler berichtigen und unrechtmäßig gespeicherte Daten löschen lassen können, bei allen Empfängern. Entscheidungen, die auf diesen Daten beruhen, müssen sich überprüfen lassen. Nutzen und Risiken gehören regelmäßig und öffentlich auf den Prüfstand.",
      letter:
        "Zweck, Zugriff und Weitergabe eng begrenzen und unabhängig kontrollieren; neue Zwecke und Empfänger nur durch ein eigenes Gesetz. Die Rechte der Betroffenen müssen praktisch funktionieren: Einsicht in die eigenen Daten vor der Meldung, Berichtigung von Fehlern und Löschung unrechtmäßig gespeicherter Daten bei allen Empfängern sowie die Überprüfung darauf gestützter Entscheidungen. Nutzen und Risiken regelmäßig und öffentlich überprüfen, damit unnötige Eingriffe beendet werden.",
    },
  ],
  en: [
    {
      title: "No stockpiling of data.",
      text: "Determine first whose data must be reported, instead of preparing it for all customers. Germany and the Netherlands require it only for customers who are actually reported.",
    },
    {
      title: "Do not report transfers to your own wallet.",
      text: "They trigger no tax by themselves, yet after a breach they reveal who probably keeps how much bitcoin at home. EU law requires this report; Austria should push for its removal.",
      letter:
        "Do not report transfers to your own wallet. They trigger no tax by themselves. Reporting their total is like a bank telling the tax authority how much cash someone has carried home. After a breach, it becomes a list of who probably keeps how much bitcoin at home. Since EU law requires this report, Austria should push in Brussels for its removal, including in the planned recast of the directive, which needs unanimity.",
    },
    {
      title: "Collect only what taxation needs.",
      text: "Why the tax authority needs units and the number of transactions as well as amounts must be demonstrated.",
    },
    {
      title: "Keep data for less time.",
      text: "For reports on bank accounts, the period is five years, and Ireland generally sets six for crypto-asset providers. Ten years “for reasons of simplicity” is no justification. Copies nobody needs any more must be verifiably deleted, including at service providers.",
      letter:
        "Keep data for less time. For reports on bank accounts, the period is five years, and Ireland generally sets six for crypto-asset providers; ten years “for reasons of simplicity” is no justification. Copies no longer needed must be verifiably deleted, including at service providers.",
    },
    {
      title: "Limit access, secure rights.",
      text: "A clear limit for each purpose, new purposes and recipients only by a law of their own, with traceable access and independent oversight. You must be able to see your data before it is reported, correct errors and have unlawfully stored data deleted, by every recipient. Decisions based on the data must be open to review. Benefits and risks need regular, public review.",
      letter:
        "Strictly limit purpose, access and onward disclosure, with independent oversight; new purposes and recipients only by a law of their own. The rights of those affected must work in practice: seeing one’s own data before it is reported, correction of errors and deletion of unlawfully stored data by every recipient, and review of decisions based on the data. Independently review benefits and risks, regularly and publicly, so unnecessary intrusions can be ended.",
    },
  ],
}

export const letterDemands = (language: Language) =>
  demands[language].map(
    (demand) => demand.letter ?? `${demand.title} ${demand.text}`,
  )
