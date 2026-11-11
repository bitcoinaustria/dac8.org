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
arguments page, each leading there; how automatic reporting grew
(`src/components/HistoryStack.astro`), leading to the history page; and the
complaint with the legal route and the first three pieces of media coverage
(`src/components/MediaCard.astro`), leading to the proceedings page. The full case
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
  ratchet: each step small, none taken back, the next already decided. It
  is one scroll film (`src/components/RuleFilm.astro`, steps and figures in
  `src/data/overregulation.ts`), built like the home page's data story:
  nine chapters and 23 steps, each a headline of a few words over one
  picture. The whole film plays in one world rendered in Blender
  (`scripts/artwork/render-panopticon.py`): a panopticon at night, a ring
  of eight cells, one per way money can take, around a watchtower. Every
  step shows a still (`src/assets/history/world-*.webp`) on a stage that is
  dark in both colour schemes; where a step has a clip
  (`public/film/<name>.mp4`, rendered with motion blur), the camera's way
  to its still plays once when the reader scrolls forward into the step,
  and things happen on the way. Clips load a few steps ahead; readers who
  prefer reduced motion or save data, and anyone scrolling back, see the
  stills fade into each other. The story: at a table in the crypto cell
  lie, at true scale, the amounts from which a single cash transaction
  without an account needs ID: 339 hundred-euro notes for 1991 (in today's
  money) beside a banded bundle of 100 from 2027 (fictional notes generated
  with Codex, `scripts/artwork/note100.webp`), then the same limits in gold
  coins, then a single cent for crypto, because every transfer through a
  provider carries the name. The camera rises over the dark ring, and the
  panopticon heats up like the water around the frog: over two steps the
  year runs with the scroll from 1977 to today, a light pass of a cell's
  searchlight is screen-blended over the base picture once a rule on that
  way applies, and from 2016 one window of the watchtower lights up per
  kind of authority allowed into the Austrian account register (3 in 2016,
  8 in 2021, 9 in 2026); cash stays dark until its 2027 rule. Back in the
  cell, six red sheets hang on the wall, the first directive of 1991, and
  then one sheet per Official Journal page adopted since flies on to the
  walls until all 488 hang there; on request the film reads the law aloud:
  verbatim passages of the 1991 directive and the 2024 regulation
  (`src/data/law-voices.ts`), spoken with Qwen3-TTS
  (`scripts/artwork/speak-law.py`) and overlapping until they drown each
  other out, each with its caption and reference. Over the yard, one slip
  per suspicion report in Austria rains down, 13,989 of them; the 9,665 the
  unit kept on file without passing them on go pale, and the 139
  convictions lie as a red patch of the same slips. On the table, a
  100-euro note loses a red strip of two per cent, what the state
  confiscates. And it goes on (wording and status from
  `src/data/history-next.ts`): the year runs past today, cash lights up in
  2027, a proposed access shows as windows that only glimmer, then the
  camera pulls back to 27 panopticons, the EU's account registers, joined
  by red lines in 2029 and carrying tags of personal data on payments from
  2030. For you: the camera flies into the crypto cell and looks at the
  tower through the bars (reported without suspicion), up over a breach in
  the tower from which one sheet per documented data leak flies, red at
  authorities (`src/data/leaks.ts`), and down to a notice on the cell's
  table whose reason is blacked out (accounts refused or closed without a
  reason). The bill: pallets of 100-euro notes drop into the yard at true
  scale, one per 100 million euros: what three tax reporting duties cost a
  year, then beside them the benefit of all exchanged tax data, measured
  in red and modelled as empty frames; the picture labels the costs as
  those of three duties, so the piles cannot be read as "it pays".
  Promised: the loudspeakers on the tower, and beside them a few words of
  what was announced and of what the announcer's own institutions have on
  record, for DAC8 in the EU, Austria and Germany (the `film` wording of
  the first three pairs in `src/data/history-promises.ts`). The film
  checks every count baked into the pictures (notes, ounces, pages,
  reports, leaks, pallets) against the data and fails the build when they
  drift; the render script's header says how to render and export stills
  and clips. Without JavaScript the headlines stand as text.
  The page frames DAC8 as the latest piece of a wider apparatus of
  anti-money-laundering and tax-reporting rules. After the film the
  conclusion turns it into
  the legal point (the state must justify an intrusion; who does not
  measure cannot) and names where courts drew limits so far, without a
  forecast for DAC8, then the one step to take. Below it, folded away, the
  film's later chapters in detail, each a component of its own:
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
  and the convictions per 100 reports in the first and last year, which is
  what the heading states; without
  JavaScript the first year stands against the last. Counting changes are
  named in the notes. A separate illustration names the missing link
  between reports and outcomes in Austria, without plotting it as zero.
  Then what three tax reporting
  duties cost a year, and how much of the claimed benefit is measured and
  how much modelled, said in words so the two cards cannot be read as "it
  pays"); and promised, measured (`src/components/RulePromises.astro`, data
  in `src/data/history-promises.ts`), every pair of what politicians
  announced and what their own institutions know, led by DAC8 in the EU,
  Austria and Germany. At the very end, also folded away,
  everything to check: both lines of rules in one chart on one axis, the
  series and texts described next, and the length of the texts
  (`src/components/LawGrowth.astro`); links into the folded parts open them.
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
  it or what is new; each figure says what it measures and no more. The
  arguments page's reason on growing surveillance cites the same figures. The AML and
  evidence claims are verified in the wiki references
  `aml-kyc-history-austria` and `rule-growth-and-effect-evidence`. Update
  `historyAsOf` in `history.ts` with every content change on the page; it
  shows as the research status and places the "today" line.
- Add confirmed public milestones to `src/data/updates.ts`, with a stable ID,
  publication timestamp including timezone, both translations and an optional
  source URL. Future-dated entries stay hidden until a build after that date.
- `/verfahren/` and `/en/proceedings/` render the updates in their own
  section once there are any (until then the status line links the feed); `/feed.xml` and
  `/en/feed.xml` expose RSS 2.0 feeds from the same data. Empty feeds are valid;
  do not create placeholder milestones or imply a filing has happened.
- The proceedings pages show the European front at `#europa`
  (`src/components/EuropeanFront.astro`, linked from the footer): a wide
  map of the member states in the style of the attack map, with the
  countries that have a case lifted off it in red, drawn at build time in
  the EU's own equal-area projection, so the north does not swell
  (`src/lib/svg-map.ts`, shared with the home page's attack map, which stays
  in Web Mercator), over a grid of tiles, one per pending case, ending in an
  open tile that invites the next country. It is built to grow: each country
  gets a pulsing pin and its name on the map (`side` moves the name where
  pins crowd), pointing at a country or its tile lights up both, a click on
  the map jumps to the tile, and the subtitle counts the countries once
  there are more than three. Add a country to `src/data/front.ts` only once
  a case has been filed and is publicly sourced, and keep the list in step with
  Bull Bitcoin's map at dac8.com.
- The proceedings pages also list media coverage at `#medien`: articles,
  podcasts, videos and broadcasts, by the campaign or by other outlets, each
  linking to the original. The chapter bar, the footer and the home page's
  selection lead there (`mediaFor()` in `src/lib/i18n.ts`). `pnpm add:media <url>` reads title, outlet, date and language
  from the page (oEmbed for YouTube, Vimeo and Spotify) and writes the entry
  to `src/data/media.json`; flags such as `--kind podcast`, `--date`,
  `--guest` fill in or override what the page does not say. It also stores
  the preview picture (`og:image`, or the YouTube thumbnail) in
  `src/assets/media/` and the length of videos and podcasts, so the cards show
  at a glance whether a piece is read, watched or heard, and the page loads
  nothing from the outlet or YouTube. Posts on X without a picture show the
  X logo instead. Check the result against the page
  before committing. Entries can also be added by hand;
  `src/data/media.ts` defines the fields and fails the build on a malformed
  entry. Titles stay in the language of the piece. Pieces with a `pin`
  (`--pin 1`, 2, …) come first in that order, the rest follow newest first;
  the first three also appear on the home page. Remove the pins once those
  pieces are no longer the most important. Six are
  shown, the rest behind "Alle anzeigen"; the kind filter works without
  JavaScript.
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
