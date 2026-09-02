# dac8.org

dac8.org is a Bitcoin Austria campaign against indiscriminate crypto-asset data
collection under DAC8 and Austria's Crypto-Asset Reporting Obligations Act. It
prepares concrete Austrian cases along the data-protection route (provider →
Datenschutzbehörde → Bundesverwaltungsgericht) and supports a broader,
multilingual European effort pursuing every available legal avenue.

[Bull Bitcoin](https://www.bullbitcoin.com/blog/bull-bitcoin-petitions-frances-conseil-detat-to-strike-down-dac8-the-mass-surveillance-of-crypto-assets)
started the European resistance with [Dac8.com](https://dac8.com/en/) and its case in France.

## Research wiki

The `dac8-wiki/` submodule contains the primary sources and legal research used
to verify public claims. It stays separate from the Astro site so both can be
reviewed and updated independently. The corpus is maintained with
[LLM Wiki](https://llm-wiki.net/); setup and workflow are documented inside the
submodule.

## Development

Astro 7 requires Node.js 22.13+ and pnpm 11.20:

```sh
git submodule update --init
pnpm install
pnpm dev
```
