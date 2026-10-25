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
People, addresses and amounts in the profiles are invented. The headline and
text beside a picture say whether it shows the annual report or leaked and
combined records, so the pictures need no disclaimers; keep captions short and
only where they add something the text does not say.

The share graphics on the support page come from the lab's share kit
(`knowledge/share-kit/`): square and story formats per scene and language,
listed in `src/data/share.ts`. Their headlines match the story scenes on the
home page. Squares are exported as JPEG to `public/share/`. Story exports go
to `src/assets/share/`; the build sets each scene's `text` (a short version of
the home page scene) and an optional `note` into the free space
(`src/lib/share-story.ts`, Liberation Sans, SIL Open Font License) and serves
them under the same `/share/` URLs. It fails if the text leaves too little
room for the picture. `src/components/ShareKit.astro` shows both formats per
scene at full size, so "Copy image" in the context menu copies the real file;
a click opens a full-screen lightbox that pages through all scenes (arrows,
arrow keys, swipe), switches format and offers download, copy and, where the
browser can share files, sharing as icon buttons.

## Site structure

Six pages in the navigation per language, plus the history page, with URLs
that follow the navigation labels:

| Page | German | English |
| --- | --- | --- |
| Start: from the problem to what we do about it | `/` | `/en/` |
| Dossier: the checkable reference: what is reported, what the provider keeps and for how long, FAQ, terms and sources | `/dossier/` | `/en/dossier/` |
| Argumente: our position by topic, with answers to objections and our demands | `/argumente/` | `/en/arguments/` |
| Angriffe: archive of known physical attacks, map and list | `/angriffe/` | `/en/attacks/` |
| Verfahren: status, legal route and updates | `/verfahren/` | `/en/proceedings/` |
| Mitmachen: donating, share graphics, organisations | `/mitmachen/` | `/en/get-involved/` |
| Geschichte: how tax reporting and anti-money-laundering rules grew step by step, what is already decided next, and what audits found about their effect; linked from dossier and footer | `/geschichte/` | `/en/history/` |

A top bar carries the navigation and a permanent donate button that leads to
`#spenden` on the participation page; on mobile a bottom bar keeps donating and
sharing within reach (`src/components/ActionBar.astro`). `/spenden` and
`/en/donate` are short redirects for print and QR codes. The home page
(`src/components/pages/HomePage.astro`) leads from the problem to what we do
about it: the headline with the campaign status and, beside it, the "Am I
affected?" check (`src/components/AffectedCheck.astro`), which restates the
dossier's FAQ; where the data goes, as a full-screen scroll film
(`src/components/DataWeb.astro`); the danger once it is known who holds how
much, with the leak and attack figures and a still of the attack map
(`src/components/AttackMapPreview.astro`); three of the reasons from the
arguments page, each leading there; how automatic reporting grew and how
few convictions it brings (`src/components/HistoryStack.astro`,
`src/components/EffectTeaser.astro`), leading to the history page; and the
complaint with the legal route, leading to the proceedings page. The full case
list with sources is on the leak page (`/datenlecks/`, `/en/data-leaks/`, data in `src/data/leaks.ts`),
after the cases in which such data led criminals to someone's door
(`#angriffe`). A case belongs there only if lost or misused data made the harm
possible, and it needs a public source. The footer closes every page with the
campaign statement and two equal actions, donating and sharing, on a dark band.
Share buttons confirm a copied link on the button itself.

## Map of known physical attacks

`/angriffe/` and `/en/attacks/` (`src/components/pages/AttacksPage.astro`) are
an archive of Jameson Lopp's public-domain list of
[known physical attacks](https://github.com/jlopp/physical-bitcoin-attacks).
The page shows what was done to people rather than case counts: it says up
front that the archive is far from complete, and every case links to the
original report and, where available, an archive copy. A full-screen map shows
numbered hotspots that split up as you zoom. A filter bar along the top of the
map holds the world, Europe and Austria views, a two-handle year range over a
histogram of the cases in view, and the legend; zoom sits in the map's
bottom-right corner. The list shows the cases in view, newest first; pointing
at a case rings its place on the map. Without JavaScript the page shows the
full list. The leak page's `#angriffe`
block (`src/components/AttackSummary.astro`) gives the key figures and links
to the archive.

The map uses Leaflet with Natural Earth country outlines from `world-atlas`,
both bundled and served from our own origin, so visitors load no map tiles
from third parties. The site keeps a trimmed copy of the list in
`src/data/attacks.json` without victim names; `pnpm sync:attacks` refreshes it.
`.github/workflows/sync-attacks.yml` runs the sync every Monday, builds the
site and opens a pull request on `bot/sync-attacks` when the list changed.
Pull requests opened with the workflow token do not trigger CI, and the
repository must allow GitHub Actions to create pull requests. The data file is
excluded from Biome formatting because the script writes it.

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
the participation, proceedings and arguments pages share components; the home page and the
dossier remain explicit Astro documents per language. Source URLs are shared in `src/data/sources.ts`.

- Update `src/data/campaign.ts` when the procedural status changes.
- The history page (`/geschichte/`, `/en/history/`) tells the rules as a
  ratchet: each step small, none taken back, the next already decided. A
  scroll film (`src/components/RuleFilm.astro`, steps and figures in
  `src/data/overregulation.ts`), built like the home page's data story,
  leads in five chapters and ten steps from the reader to the result, each
  step a headline of a few words over one picture as a contrast: from which
  amount a single cash transaction without an account needs ID, rendered at true scale
  in Blender (`scripts/artwork/render-cash.py`, fictional notes generated
  with Codex): a brick of 339 hundred-euro notes in 1991 (in today's
  money), a banded bundle of 100 from 2027, and for crypto a single cent,
  because every transfer through a provider carries the name; a panopticon
  at night rendered in Blender (`scripts/artwork/render-panopticon.py`), a
  ring of eight cells, one per way money can take, around a watchtower,
  heating up like the water around the frog: over two steps the year runs
  with the scroll from 1977 to today, a light pass of a cell's searchlight
  is screen-blended over the base picture once a rule on that way applies,
  and from 2016 one window of the watchtower lights up per kind of
  authority allowed into the Austrian account register (3 in 2016, 8 in
  2021, 9 in 2026); cash stays dark until its 2027 rule, which the next
  section names; a wall of one tile per
  Official Journal page, six red ones from 1991 among the 488 adopted
  since, which on request reads the law aloud: verbatim passages of the
  1991 directive and the 2024 regulation (`src/data/law-voices.ts`), spoken
  with Qwen3-TTS (`scripts/artwork/speak-law.py`) and overlapping until
  they drown each other out, each with its caption and reference; a sea of
  suspicion reports in Austria in which the 9,665 the unit kept on file
  without passing them on fade to a pale block, beside 139 convictions
  (`src/lib/film-sand.ts`); then a fictional 100-euro note with a masked
  robber that crumbles to dust until the red sliver confiscated remains
  (`src/lib/film-note.ts`). Without JavaScript the headlines stand as text.
  The page frames DAC8 as the latest piece of a wider apparatus of
  anti-money-laundering and tax-reporting rules and builds on the film:
  and it goes on (`src/components/RuleNext.astro`, data in
  `src/data/history-next.ts`: the steps decided or proposed, each with its
  procedural status, and the same pattern in private messages, the chat
  control proposal, worded as a proposal); what it means for you
  (`src/components/RuleBalance.astro`: accounts reported without
  suspicion and, with DAC8, every crypto customer, data leaks from
  `src/data/leaks.ts`, accounts refused or closed without a reason); the
  bill (`src/components/RuleBill.astro`, data in `src/data/history-gap.ts`:
  report landscapes in `src/components/ReportLandscape.astro` and
  `ReportCompare.astro`, which set suspicion reports against convictions
  for money laundering in Germany and Austria from a year the reader picks,
  both as a multiple of that year, with the two growth factors set large
  and the convictions per 100 reports in the first and last year; without
  JavaScript the first year stands against the last. Counting changes are
  named in the notes. A separate illustration names the missing link
  between reports and outcomes in Austria, without plotting it as zero.
  Then, Europol's assessment of confiscation, what three tax reporting
  duties cost a year, and how much of the claimed benefit is measured and
  how much modelled, said in words so the two cards cannot be read as "it
  pays"); and promised, measured (`src/components/RulePromises.astro`, data
  in `src/data/history-promises.ts`), pairs of what politicians announced
  and what their own institutions know, led by DAC8 in the EU, Austria and
  Germany. Costs and benefit stay on separate scales, because the benefit
  covers more duties than the costs shown. The conclusion turns this into
  the legal point (the state must justify an intrusion; who does not
  measure cannot) and names where courts drew limits so far, without a
  forecast for DAC8, then the one step to take. At the end, folded away,
  everything to check: both lines of rules in one chart on one axis, the
  series and texts described next, and the length of the texts
  (`src/components/LawGrowth.astro`); links into the folded part open it.
  The film and the balance cite their sources as numbers in brackets
  (`src/components/SourceRefs.astro`); `src/data/history-sources.ts`
  numbers them in the order a reader meets them, and the page lists them
  once at its end. Name a source in the text only where the story needs
  it, such as a quotation. `src/data/history.ts` holds the tax
  chronicle from Directive 77/799/EEC to the pending DAC recast, verified in
  the wiki reference `dac-history-timeline`; `src/data/aml-history.ts` holds
  the anti-money-laundering duties in Austria from the first ID duty in 1994
  to the 2027 cash cap; `ruleChronicle` there joins both, each under its
  own head, so one count adds up what has piled up. They feed the same chart
  (`src/components/HistoryStack.astro`, one row per duty from the year it
  applies, each row opening with its facts and sources), which also has a
  compact mode with only the tax rows about individuals for the home page.
  `src/data/history-evidence.ts` holds the figures on volumes and effect
  (the report and conviction series, accounts exchanged, single figures and
  the institutions' own words), drawn by `YearColumns` and `StatTiles`. In
  the film and the charts grey is what is collected and red what comes of
  it or what is new; each figure says what it measures and no more. The home page repeats the reports against
  convictions as two bars (`src/components/EffectTeaser.astro`), and the
  arguments page's reason on growing surveillance cites the same figures. The AML and
  evidence claims are verified in the wiki references
  `aml-kyc-history-austria` and `rule-growth-and-effect-evidence`. Update
  `historyAsOf` in `history.ts` with every content change on the page; it
  shows as the research status and places the "today" line.
- Add confirmed public milestones to `src/data/updates.ts`, with a stable ID,
  publication timestamp including timezone, both translations and an optional
  source URL. Future-dated entries stay hidden until a build after that date.
- `/verfahren/` and `/en/proceedings/` render the updates; `/feed.xml` and
  `/en/feed.xml` expose RSS 2.0 feeds from the same data. Empty feeds are valid;
  do not create placeholder milestones or imply a filing has happened.
- The proceedings pages also list media coverage: articles, podcasts, videos
  and broadcasts, by the campaign or by other outlets, each linking to the
  original. `pnpm add:media <url>` reads title, outlet, date and language
  from the page (oEmbed for YouTube, Vimeo and Spotify) and writes the entry
  to `src/data/media.json`; flags such as `--kind podcast`, `--date`,
  `--guest` fill in or override what the page does not say. Check the result
  against the page before committing. Entries can also be added by hand;
  `src/data/media.ts` defines the fields and fails the build on a malformed
  entry. Titles stay in the language of the piece. The newest six are shown,
  the rest behind "Alle anzeigen"; the kind filter works without JavaScript.
- The newsletter link points to Bitcoin Austria's existing newsletter form.
- The letter to members of the National Council is on the participation page
  (`src/components/LetterGenerator.astro`, texts in `src/data/letter.ts`). It
  runs entirely in the browser; its demands come from `src/data/arguments.ts`, the
  same list the arguments page shows under "Was wir fordern".
- There is no separate "Deine Akte" page. It was removed in October 2026
  once the home page told what happens to the data; what gets reported is in
  the dossier (`#gemeldet`). `/deine-akte/` and
  `/en/your-file/` redirect there.
- There is no GDPR access-request tool. It was removed in October 2026: it
  did little for the campaign and put a heavy load on the providers who
  received it. `/auskunft/` and `/en/access-request/` redirect to the
  participation page.
- The earlier individual complaint generator was removed in October 2026,
  as it was never public and still asked readers to send access requests to
  providers. If individual participation in the proceedings is defined,
  start from `src/components/ParticipationTools.astro` in commit `788416c`
  and review its content first.

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
font (SIL Open Font License), with no remote rendering service. Pages with a
lead illustration show it on the right, mapped in
`src/pages/og/[language]/[page].png.ts`; the legal pages stay text-only.
Headlines have up to three explicit lines; a build fails if a line exceeds the
available space, which is narrower beside an illustration.
Check edited cards at small preview sizes as well as full resolution.

After `pnpm build`, run `pnpm test:seo` to check the generated HTML, language
links, structured data, PNG files, sitemap and short redirects.
