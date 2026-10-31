// Cuts the pictures of the film's last scene and writes where everything
// lies, so the film can stack the coins and move the top one
// (RuleFilm.astro). The pictures come from one camera (render-seized.py)
// and keep that shared frame, scaled alike: the coin alone, in a box around
// the point where it sits; the stack's shadow; and the tray, empty and with
// the coin, in one box.
//
// Usage: node scripts/artwork/composite-seized.mjs <dir> '<json>' <out dir>
//   dir   seized-coin.png, seized-shadow.png, seized-tray.png and
//         seized-landed.png, e.g.
//         blender -b -P scripts/artwork/render-seized.py -- coin seized-coin.png
//   json  what render-seized.py prints after SEIZED
import { writeFileSync } from "node:fs"
import sharp from "sharp"

const [dir, json, outDir] = process.argv.slice(2)
if (!outDir) {
  console.error("Usage: composite-seized.mjs <dir> '<json>' <out dir>")
  process.exit(1)
}
const at = JSON.parse(json)

// The pictures are 1600 pixels wide in the full frame.
const WIDTH = 1600
const SCALE = WIDTH / at.width
// Shadow-catcher noise below NOISE fades out, down to nothing at FLOOR;
// a picture reaches as far as pixels from EDGE up, plus MARGIN.
const NOISE = 40
const FLOOR = 16
const EDGE = 6
const MARGIN = 12

const scaled = (v) => Math.round(v * SCALE * 10) / 10
const point = (p) => p.map(scaled)

async function load(name) {
  const { data, info } = await sharp(`${dir}/seized-${name}.png`)
    .resize(WIDTH, null, { kernel: "lanczos3" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  for (let i = 3; i < data.length; i += 4) {
    const fade = Math.min(1, Math.max(0, (data[i] - FLOOR) / (NOISE - FLOOR)))
    data[i] = Math.round(data[i] * fade * fade)
  }
  return { data, info }
}

function bounds({ data, info }) {
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
  return { x: left, y: top, w: right - left, h: bottom - top }
}

function union(a, b) {
  const x = Math.min(a.x, b.x)
  const y = Math.min(a.y, b.y)
  return {
    x,
    y,
    w: Math.max(a.x + a.w, b.x + b.w) - x,
    h: Math.max(a.y + a.h, b.y + b.h) - y,
  }
}

// A picture with nothing sharp in it may keep fewer pixels; the film
// stretches it back over its place.
async function save(name, { data, info }, rect, keep = 1) {
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left: rect.x, top: rect.y, width: rect.w, height: rect.h })
    .resize(Math.round(rect.w * keep), null, { kernel: "lanczos3" })
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(`${outDir}/seized-${name}.webp`)
  console.log(name, rect)
}

// The film places the coin by where it sits.
const [x, y] = point(at.coin).map(Math.round)
const coin = await load("coin")
const box = bounds(coin)
await save("coin", coin, box)

const shadow = await load("shadow")
const shadowRect = bounds(shadow)
await save("shadow", shadow, shadowRect, 0.4)

const trays = await Promise.all(["tray", "landed"].map(load))
const trayRect = trays.map(bounds).reduce(union)
for (const [k, name] of ["tray", "landed"].entries())
  await save(name, trays[k], trayRect)

writeFileSync(
  `${outDir}/seized.json`,
  `${JSON.stringify(
    {
      coin: { x: x - box.x, y: y - box.y, w: box.w, h: box.h },
      shadow: shadowRect,
      tray: trayRect,
      foot: point(at.foot),
      step: point(at.step),
      drift: at.drift.map(point),
      value: at.value,
      taken: at.taken,
      way: at.way.map(point),
      shadows: at.shadows.map(point),
    },
    null,
    2,
  )}\n`,
)
