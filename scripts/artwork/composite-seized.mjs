// Cuts the pictures of the film's last scene and writes where everything
// lies, so the film can lay out the hundred coins and move two of them
// (RuleFilm.astro). The pictures come from one camera (render-seized.py,
// at full size) and keep that shared frame, scaled down alike: five lone
// coins with their shadows and the two that rise without, each in the
// same box around the point where it touches the table, and the tray,
// empty and with the two, cut to what it shows.
//
// Usage: node scripts/artwork/composite-seized.mjs <dir> '<json>' <out dir>
//   dir   seized-coins.png, seized-lift.png, seized-tray.png and
//         seized-landed.png, e.g.
//         blender -b -P scripts/artwork/render-seized.py -- coins seized-coins.png
//   json  what render-seized.py prints after SEIZED
import { writeFileSync } from "node:fs"
import sharp from "sharp"

const [dir, json, outDir] = process.argv.slice(2)
if (!outDir) {
  console.error("Usage: composite-seized.mjs <dir> '<json>' <out dir>")
  process.exit(1)
}
const at = JSON.parse(json)

// The full frame is 2400 pixels wide; the pictures keep two thirds.
const SCALE = 2 / 3
// Shadow-catcher noise below NOISE fades out, down to nothing at FLOOR;
// a picture reaches as far as pixels from EDGE up, plus MARGIN.
const NOISE = 40
const FLOOR = 16
const EDGE = 6
const MARGIN = 12

const scaled = (v) => Math.round(v * SCALE * 10) / 10

async function load(name) {
  const file = `${dir}/seized-${name}.png`
  const { width } = await sharp(file).metadata()
  const { data, info } = await sharp(file)
    .resize(Math.round(width * SCALE), null, { kernel: "lanczos3" })
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

async function save(name, { data, info }, rect) {
  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .extract({ left: rect.x, top: rect.y, width: rect.w, height: rect.h })
    .webp({ quality: 82, alphaQuality: 100 })
    .toFile(`${outDir}/seized-${name}.webp`)
  console.log(name, rect)
  return rect
}

// Every coin in the same box around the point where it touches the
// table, so one place in the grid fits any of them: wide enough for the
// shadows, which reach right and forward. The two that rise come without
// shadow and need only the coin's own reach.
function around(layer, x, y, reach) {
  const { data, info } = layer
  let left = x
  let top = y
  let right = x
  let bottom = y
  for (
    let v = Math.max(0, y - reach);
    v < Math.min(info.height, y + reach);
    v++
  )
    for (
      let u = Math.max(0, x - reach);
      u < Math.min(info.width, x + reach);
      u++
    )
      if (data[(v * info.width + u) * 4 + 3] >= EDGE) {
        left = Math.min(left, u)
        top = Math.min(top, v)
        right = Math.max(right, u + 1)
        bottom = Math.max(bottom, v + 1)
      }
  return { left: x - left, top: y - top, right: right - x, bottom: bottom - y }
}

async function sprites(name, file, points) {
  const layer = await load(file)
  const spots = points.map((p) => p.map((v) => Math.round(scaled(v))))
  // Half the distance between two coins alone.
  const reach = Math.floor((spots[1][0] - spots[0][0]) / 2)
  const sides = spots.map(([x, y]) => around(layer, x, y, reach))
  const most = (side) => Math.max(...sides.map((s) => s[side])) + MARGIN
  const box = { x: most("left"), y: most("top") }
  box.w = box.x + most("right")
  box.h = box.y + most("bottom")
  for (const [k, [x, y]] of spots.entries())
    await save(`${name}-${k}`, layer, {
      x: x - box.x,
      y: y - box.y,
      w: box.w,
      h: box.h,
    })
  return box
}

const coin = await sprites("coin", "coins", at.alone)
const lift = await sprites("lift", "lift", at.alone.slice(0, at.holes.length))

const rects = {}
for (const name of ["tray", "landed"]) {
  const layer = await load(name)
  rects[name] = await save(name, layer, bounds(layer))
}

const point = (p) => p.map(scaled)
writeFileSync(
  `${outDir}/seized.json`,
  `${JSON.stringify(
    {
      coin,
      lift,
      tray: rects.tray,
      landed: rects.landed,
      origin: point(at.origin),
      column: point(at.column),
      row: point(at.row),
      kinds: at.kinds.map((row) => row.join("")),
      holes: at.holes,
      up: point(at.up),
      over: point(at.over),
      down: point(at.landed),
      shadow: point(at.shadow),
    },
    null,
    2,
  )}\n`,
)
