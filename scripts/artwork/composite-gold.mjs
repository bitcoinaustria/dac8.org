// Lays the gold coins over the film's note pictures. The note textures of
// render-cash.py are not kept, so the notes are not rendered again: the
// gold renders carry the notes as an invisible shadow catcher, from the
// same camera, and go over the existing pictures at the place those were
// cropped from. Nothing is resized but the render itself, from full to
// half size, so the shared scale of 54.54545 px per cm holds.
//
// Usage: node scripts/artwork/composite-gold.mjs <gold.png> <notes.webp> <x> <y> <out.webp>
//   gold.png   blender -b -P scripts/artwork/render-cash.py -- gold-brick gold.png
//   x, y       where the notes picture sits in the half-size frame:
//              brick 112 69, bundle 126 199
import sharp from "sharp"

const [goldPath, notesPath, x, y, out] = process.argv.slice(2)
if (!out) {
  console.error(
    "Usage: composite-gold.mjs <gold.png> <notes.webp> <x> <y> <out.webp>",
  )
  process.exit(1)
}

// The gold renders reach further down than the notes' frame, for the
// shadows; their top-left corner is the frame's.
const { width: fullWidth, height: fullHeight } =
  await sharp(goldPath).metadata()
const WIDTH = fullWidth / 2
const HEIGHT = fullHeight / 2
// In the gold layer, alpha below NOISE is shadow-catcher noise and fades
// out, down to nothing at FLOOR. The picture keeps every pixel that is
// still visible, from EDGE up.
const NOISE = 40
const FLOOR = 16
const EDGE = 6
const MARGIN = 24

const gold = await sharp(goldPath)
  .resize(WIDTH, HEIGHT, { kernel: "lanczos3" })
  .ensureAlpha()
  .raw()
  .toBuffer()
// Soft shadows run out into noise and a faint dimming of the whole floor.
// Fading them out between FLOOR and NOISE, instead of cutting at one value,
// lets them end softly rather than in an edge.
for (let i = 3; i < gold.length; i += 4) {
  const fade = Math.min(1, Math.max(0, (gold[i] - FLOOR) / (NOISE - FLOOR)))
  gold[i] = Math.round(gold[i] * fade * fade)
}

const { data, info } = await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    { input: notesPath, left: Number(x), top: Number(y) },
    {
      input: gold,
      raw: { width: WIDTH, height: HEIGHT, channels: 4 },
      left: 0,
      top: 0,
    },
  ])
  .raw()
  .toBuffer({ resolveWithObject: true })

// The picture's extent: rows and columns with a few visible pixels, so a
// stray pixel in a corner does not widen it.
const rows = new Array(HEIGHT).fill(0)
const cols = new Array(WIDTH).fill(0)
for (let py = 0; py < info.height; py++) {
  for (let px = 0; px < info.width; px++) {
    if (data[(py * info.width + px) * 4 + 3] < EDGE) continue
    rows[py]++
    cols[px]++
  }
}
const solid = (count) => count >= 3
const x0 = cols.findIndex(solid)
const x1 = cols.findLastIndex(solid)
const y0 = rows.findIndex(solid)
const y1 = rows.findLastIndex(solid)
const left = Math.max(0, x0 - MARGIN)
const top = Math.max(0, y0 - MARGIN)
const right = Math.min(WIDTH, x1 + 1 + MARGIN)
const bottom = Math.min(HEIGHT, y1 + 1 + MARGIN)

await sharp(data, { raw: { width: WIDTH, height: HEIGHT, channels: 4 } })
  .extract({ left, top, width: right - left, height: bottom - top })
  .webp({ quality: 82, alphaQuality: 100 })
  .toFile(out)
console.log(
  `${out}: ${right - left}x${bottom - top}, crop ${left} ${top} of the frame`,
)
