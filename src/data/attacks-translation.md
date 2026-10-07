# Translating the attack descriptions

`attacks.json` is overwritten by the weekly sync from Jameson Lopp's list, so
translations live beside it in `attacks.<language>.json`: an object that maps
each English description, exactly as it appears in `attacks.json`, to its
translation. When Lopp edits a description, the old translation no longer
matches and the page falls back to the English text until it is translated
again. `pnpm sync:attacks` lists descriptions that still lack a translation.

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
- Keep the tense of the English: headline-style present stays present, past
  stays past.
- Numbers use German notation: 12.000, 0,5 BTC, 1,5 Millionen. Write out
  Million(en) and Milliarde(n); _$50k_ becomes 50.000 Dollar.
- Currencies stay as given, never converted: _$_ becomes Dollar, _USD_ or _US$_
  becomes US-Dollar, _HK$_ Hongkong-Dollar, _€_, _EUR_ or _euros_ Euro. Token
  tickers (BTC, ETH, USDT) stay as they are; _$9,375 USDT_ means 9.375 USDT,
  while _$18,000 in USDT_ stays 18.000 Dollar in USDT.
- Ages: _74-year-old man_ becomes 74-jähriger Mann.
- Dates in the text: _Dec 22_ becomes 22. Dezember.
- Place names and nationalities as in German usage; do not add places.
- Use German typographic quotes („…“) and apostrophes (’).
- If the English is garbled or ambiguous, do not guess silently. Keep the
  ambiguity in German where possible; otherwise check the linked report and
  record the decision in the pull request. If the report shows the English
  itself is wrong, still translate the English, and report the error upstream
  so both languages are corrected together.

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
| wallet, hardware wallet, seed phrase | Wallet, Hardware-Wallet, Seed-Phrase         |
| SWATting                             | Swatting                                     |
| wrench attack                        | sogenannter Wrench-Angriff                   |
