// Crops the layers of the film's last picture and writes where each sits,
// so the film can stack them and move the pair (RuleFilm.astro). The
// layers come from one camera (render-cash.py, seized-stack, -band, -pair,
// -landed and -tag, at full size); they keep that shared frame, scaled
// down alike, and each is cut to what it shows.
//
// Usage: node scripts/artwork/composite-seized.mjs <dir> '<path>' <out dir>
//   dir   seized-stack.png, seized-band.png, seized-pair.png,
//         seized-landed.png and seized-tag.png, e.g. for each layer:
//         TURN=-46 SIZE=30 ELEV=22 blender -b -P scripts/artwork/render-cash.py \
//           -- seized-stack seized-stack.png tex-100.png tex-50.png
//   path  the line render-cash.py prints after SEIZED, as JSON:
//         '{"start": [940.8, 617.4], "slid": [1459.2, 1098.1], "landed": [1459.2, 1176.6]}'
import { writeFileSync } from "node:fs"
import sharp from "sharp"

const [dir, pathJson, outDir] = process.argv.slice(2)
if (!outDir) {
  console.error("Usage: composite-seized.mjs <dir> '<path>' <out dir>")
  process.exit(1)
}
const path = JSON.parse(pathJson)

// The full frame is 2400 pixels wide; the pictures keep two thirds.
const SCALE = 2 / 3
// Shadow-catcher noise below NOISE fades out, down to nothing at FLOOR;
// a layer reaches as far as pixels from EDGE up, plus MARGIN.
const NOISE = 40
const FLOOR = 16
const EDGE = 6
const MARGIN = 12

const layers = {}
for (const name of ["stack", "band", "pair", "landed", "tag"]) {
  const file = `${dir}/seized-${name}.png`
  const { width } = await sharp(file).metadata()
  const size = Math.round(width * SCALE)
  const { data, info } = await sharp(file)
    .resize(size, null, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) {
    const fade = Math.min(1, Math.max(0, (data[i] - FLOOR) / (NOISE - FLOOR)))
    data[i] = Math.round(data[i] * fade * fade)
  }
  const rows = new Array(info.height).fill(0)
  const cols = new Array(info.width).fill(0)
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] >= EDGE) {
        rows[y]++
        cols[x]++
      }
  const solid = (count) => count >= 3
  const left = Math.max(0, cols.findIndex(solid) - MARGIN)
  const top = Math.max(0, rows.findIndex(solid) - MARGIN)
  const right = Math.min(info.width, cols.findLastIndex(solid) + 1 + MARGIN)
  const bottom = Math.min(info.height, rows.findLastIndex(solid) + 1 + MARGIN)
  const rect = { x: left, y: top, w: right - left, h: bottom - top }
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left, top, width: rect.w, height: rect.h })
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(`${outDir}/seized-${name}.webp`)
  layers[name] = rect
  console.log(name, rect)
}

const scaled = (point) => point.map((v) => Math.round(v * SCALE * 10) / 10)
writeFileSync(
  `${outDir}/seized.json`,
  `${JSON.stringify(
    {
      layers,
      path: {
        start: scaled(path.start),
        slid: scaled(path.slid),
        landed: scaled(path.landed),
      },
    },
    null,
    2,
  )}\n`,
)
