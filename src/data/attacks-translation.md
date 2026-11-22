# Translating the attack descriptions

`attacks.json` is overwritten by the weekly sync from Jameson Lopp's list, so
translations live beside it in `attacks.<language>.json`: an object that maps
each English description, exactly as it appears in `attacks.json`, to its
translation. When Lopp edits a description, the old translation no longer
matches and the page falls back to the English text until it is translated
again. `pnpm sync:attacks` lists descriptions that still lack a translation.

The sync tidies the English before it writes `attacks.json`, so the keys are
the tidied text: it fixes a few known slips in Lopp's wording (listed in
`scripts/sync-attacks.mjs`), and where a description opens with an amount
joined by a dash ("KRW 30,000,000 — Four teenagers…"), it moves the amount to
the end as "Amount: KRW 30,000,000." and drops a bare "Unknown". Translate
that closing sentence as Betrag: 30.000.000 KRW.

These are real crimes against real people. A translation must say exactly what
the English says: no more, no less, no sharper, no softer.

## Rules

- Translate the description, not the case. Do not add facts from the linked
  reports, and do not drop any detail, number, qualifier or clause.
- Keep every degree of certainty: _attempted_ stays an attempt, _suspects_ stay
  Verdächtige, _possibly_, _allegedly_, _reportedly_ and _believed to_ stay
  hedged (möglicherweise, mutmaßlich, laut Berichten, vermutlich). Never turn a
  suspicion into a fact or a fact into a suspicion.
- Keep _bitcoin_ and _crypto_ apart: Bitcoin stays Bitcoin, crypto and
  cryptocurrency become Kryptowährung(en) or a Krypto- compound
  (Krypto-Händler, Krypto-Unternehmer), as on the rest of the site.
- Keep who did what to whom. Do not merge or split victims or attackers, and
  keep their number and, where the English states it, their gender.
- Leave victims' names out, the one deliberate departure from the English: the
  site keeps victims anonymous, while Lopp's descriptions sometimes name them.
  Replace a victim's name with what the English says about them (_Mr. Guo,
  31_ becomes ein 31-jähriger Mann, _trader Jan Sher Khan_ der Händler) or,
  if it says nothing, with das Opfer; drop honorifics with the name. This
  covers relatives and companions harmed alongside the victim. Names of
  suspects, convicts, police officers and public figures stay as written.
- Keep the tense of the English: headline-style present stays present, past
  stays past.
- Numbers use German notation: 12.000, 0,5 BTC, 1,5 Millionen. Write out
  Million(en) and Milliarde(n); _$50k_ becomes 50.000 Dollar.
- Indian number words become German numbers: _lakh_ is 100.000 and _crore_
  10 Millionen, so _25 lakh INR_ becomes 2,5 Millionen INR and _3 crore_
  30 Millionen.
- Currencies stay as given, never converted: _$_ becomes Dollar, _USD_ or _US$_
  becomes US-Dollar, _HK$_ Hongkong-Dollar, _NT$_ TWD, _€_, _EUR_ or _euros_
  Euro; no $ sign stays in the German. Token tickers (BTC, ETH, USDT) stay as
  they are; _$9,375 USDT_ means 9.375 USDT, while _$18,000 in USDT_ stays
  18.000 Dollar in USDT.
- Ages: _74-year-old man_ becomes 74-jähriger Mann.
- Dates in the text: _Dec 22_ becomes 22. Dezember. Write Austrian month
  names: Jänner, never Januar, as in the date above each case.
- No dashes as punctuation: Lopp's em dashes and spaced en dashes become a
  colon, commas or parentheses, whichever the sentence needs. Ranges use bis
  (35.000 bis 40.000 USDT), not a dash.
- Place names and nationalities as in German usage; do not add places.
- Use German typographic quotes („…“) and apostrophes (’).
- If the English is garbled or ambiguous, do not guess silently. Keep the
  ambiguity in German where possible; otherwise check the linked report and
  record the decision in the pull request. Lopp's list is the source of truth:
  even where a report shows the English is wrong, translate the English as
  written, so the German never says something the collection does not.

## Glossary

| English                              | German                                       |
| ------------------------------------ | -------------------------------------------- |
| kidnap, abduct                       | entführen                                    |
| hold hostage                         | als Geisel nehmen, als Geisel festhalten     |
| hold captive                         | gefangen halten                              |
| sequester (French séquestration)     | festhalten, einsperren                       |
| home invasion, invade a home         | Überfall zu Hause, in ein Zuhause eindringen |
| home / house / apartment             | Zuhause / Haus / Wohnung                     |
| rob, robbery, robber                 | ausrauben, Raub, Räuber                      |
| steal, theft, thief                  | stehlen, Diebstahl, Dieb                     |
| at gunpoint                          | mit vorgehaltener Schusswaffe                |
| at knifepoint                        | mit vorgehaltenem Messer                     |
| armed                                | bewaffnet (no weapon added)                  |
| tie up, bind                         | fesseln                                      |
| beat, assault                        | schlagen, angreifen                          |
| torture                              | foltern                                      |
| drug (a person)                      | betäuben                                     |
| lure                                 | locken                                       |
| pose as police, fake police          | sich als Polizisten ausgeben, falsche Polizisten |
| extort, ransom                       | erpressen, Lösegeld                          |
| kill, murder                         | töten, ermorden (keep the distinction)       |
| arrest, charge, convict              | festnehmen, anklagen, verurteilen            |
| suspect, accused, alleged            | Verdächtiger, Beschuldigter, mutmaßlich      |
| victim                               | Opfer                                        |
| trader, OTC trader                   | Händler, OTC-Händler                         |
| investor, entrepreneur, businessman  | Investor, Unternehmer, Geschäftsmann         |
| exchange                             | Börse, Kryptobörse                           |
| miner, mining                        | Miner, Mining                                |
| bitcoin ATM, BTM                     | Bitcoin-Automat                              |
| wallet, hardware wallet, seed phrase | Wallet, Hardware-Wallet, Wiederherstellungsphrase |
| crypto assets, cryptoassets          | Kryptowerte                                  |
| SWATting                             | Swatting                                     |
| wrench attack                        | sogenannter Wrench-Angriff                   |
