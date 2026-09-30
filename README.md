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

## Artwork lab

The private `artwork-lab/` submodule contains the Blender sources and reusable
web/social graphics. See `artwork-lab/knowledge/README.md` for the DAC8 collection
and exports. Access to the artwork repository is required to initialize it.

The site does not build from the submodule. Illustrations in use are copied
from the lab's transparent cutouts (`knowledge/dac8-*-cutout.png`) into
`src/assets/artwork/` as WebP masters; Astro generates the responsive AVIF and
WebP files at build time. `src/data/artwork.ts` holds the German and English
alt texts and captions, and `src/components/Artwork.astro` renders them; its
`caption` prop replaces the caption or hides it where the surrounding text
already says what the picture shows. Use motifs that explain themselves, with
readable labels such as Finanzakte, Datenleck or Zielliste, and place each
beside the headline that names it; purely decorative motifs stay in the lab.
Labels
in the renders cast no shadow (`visible_shadow=False` in the lab's
`build_site.py` `label()`); a soft shadow behind glass made small text look
blurred. Motifs
with text labels have a German and an English render (`*-en.webp`). The
cutouts have no background, so the same file works in light and dark mode.
People, addresses and amounts in the profiles are invented; captions must keep
the distinction between combined or leaked records and the annual DAC8 report.
Story scenes carry that distinction in their `note` ("Im Bild: …") under the
text instead of a caption under the image.

The share graphics on the support page come from the lab's share kit
(`knowledge/share-kit/`): square and story formats per scene and language,
exported as JPEG to `public/share/` and listed in `src/data/share.ts`. Their
headlines match the story scenes on the home page.

## Site structure

Four pages per language, with URLs that follow the navigation labels:

| Page | German | English |
| --- | --- | --- |
| Start: the case told as a story in scenes | `/` | `/en/` |
| Dossier: the complete reference, FAQ and sources | `/dossier/` | `/en/dossier/` |
| Verfahren: status, legal route and updates | `/verfahren/` | `/en/proceedings/` |
| Mitmachen: donating, share graphics, organisations | `/mitmachen/` | `/en/get-involved/` |

A top bar carries the navigation and a permanent donate button that leads to
`#spenden` on the participation page; on mobile a bottom bar keeps donating and
sharing within reach. `/spenden` and `/en/donate` are short redirects for print
and QR codes. The home page is a sequence of bands, each with one statement and
at most one illustration: the hero, a short DAC8 brief with three key figures,
two story chapters (`src/components/StoryScene.astro`), documented data
leaks and what followed them, what we do, what you can do, the guiding
statement and who we are. The full case list with sources is in the dossier
(`#faelle`). A case belongs there only if lost or misused data made the harm
possible, and it needs a public source. The dossier's "Am I affected?" check (`src/components/AffectedCheck.astro`)
restates the FAQ. The footer closes every page with the campaign statement,
two actions and the status on a dark band.

## Development

Astro 7 requires Node.js 22.13+ and pnpm 11.20:

```sh
git submodule update --init
pnpm install
pnpm dev
```

## Languages and campaign updates

The active campaign concerns **Austria**. English equivalents of the German
pages live under `/en/`. `src/lib/i18n.ts` maps equivalent pages,
navigation and feeds. Language selection does not change jurisdiction. Add a
region selector only when another country has an actual campaign with its own
content and procedural context. No browser-language redirects or preference
storage are used.

Keep both language versions in sync when changing public claims. Navigation,
the participation and proceedings pages share components; the home page and the
dossier remain explicit Astro documents per language. Source URLs are shared in `src/data/sources.ts`.

- Update `src/data/campaign.ts` when the procedural status changes.
- Add confirmed public milestones to `src/data/updates.ts`, with a stable ID,
  publication timestamp including timezone, both translations and an optional
  source URL. Future-dated entries stay hidden until a build after that date.
- `/verfahren/` and `/en/proceedings/` render the updates; `/feed.xml` and
  `/en/feed.xml` expose RSS 2.0 feeds from the same data. Empty feeds are valid;
  do not create placeholder milestones or imply a filing has happened.
- The newsletter link points to Bitcoin Austria's existing newsletter form.
- The letter to members of the National Council is on the participation page
  (`src/components/LetterGenerator.astro`, texts in `src/data/letter.ts`). It
  runs entirely in the browser; its demands restate the dossier's "Was wir
  fordern" list, so change both together.
- The earlier individual complaint generator is preserved in
  `src/components/ParticipationTools.astro`, but is not exposed as a public
  route while individual participation in the proceedings remains undefined.
  Review its content and translate its interface before bringing it back.

Run `pnpm test` for language routing and RSS regression checks, then
`pnpm format:check` and `pnpm build` before publication.

## Search and sharing previews

`src/data/seo.ts` holds the localized titles, descriptions and sharing headlines
for every page in `src/lib/i18n.ts`. Keep these aligned with the public copy and
the actual procedural status. `MetaPage.astro` generates canonical URLs,
reciprocal language links, Open Graph/Twitter metadata and JSON-LD from these
entries. URLs always use the production origin from `astro.config.ts`.

The build renders a 1200 × 630 PNG for each page and language under
`/og/{de|en}/{page}.png`. The renderer uses Sharp and the bundled IBM Plex Sans
font (SIL Open Font License), with no remote rendering service. The four main
pages show their lead illustration on the right, mapped in
`src/pages/og/[language]/[page].png.ts`; the legal pages stay text-only.
Headlines have up to three explicit lines; a build fails if a line exceeds the
available space, which is narrower beside an illustration.
Check edited cards at small preview sizes as well as full resolution.

After `pnpm build`, run `pnpm test:seo` to check the generated HTML, language
links, structured data, PNG files, sitemap and short redirects.
