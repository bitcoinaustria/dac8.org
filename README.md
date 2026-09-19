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

## Languages and campaign updates

The active campaign concerns **Austria**. German pages keep their existing URLs;
English equivalents live under `/en/`. `src/lib/i18n.ts` maps equivalent pages,
navigation and feeds. Language selection does not change jurisdiction. Add a
region selector only when another country has an actual campaign with its own
content and procedural context. No browser-language redirects or preference
storage are used.

Keep both language versions in sync when changing public claims. Navigation,
support and updates pages share components; long editorial pages remain explicit
Astro documents. Source URLs are shared in `src/data/sources.ts`.

- Update `src/data/campaign.ts` when the procedural status changes.
- Add confirmed public milestones to `src/data/updates.ts`, with a stable ID,
  publication timestamp including timezone, both translations and an optional
  source URL. Future-dated entries stay hidden until a build after that date.
- `/aktuelles/` and `/en/updates/` render the updates; `/feed.xml` and
  `/en/feed.xml` expose RSS 2.0 feeds from the same data. Empty feeds are valid;
  do not create placeholder milestones or imply a filing has happened.
- The newsletter link points to Bitcoin Austria's existing newsletter form.
- The previous individual complaint/letter generators are preserved in
  `src/components/ParticipationTools.astro`, but are not exposed as a public
  route while individual participation remains undefined. Review their content
  and translate their interface before bringing them back into the campaign.

Run `pnpm test` for language routing and RSS regression checks, then
`pnpm format:check` and `pnpm build` before publication.
