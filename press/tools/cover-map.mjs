// Cover for the bitcoin-austria.at post: only dac8.org's attack map, full
// bleed at 16:9. Same projection, scale, colours, circle sizes and hotspot
// grouping as AttackMapPreview.astro; the frame is widened east and west
// so the map fills the picture, and every attack inside it is drawn.
// Usage: node cover-map.mjs <de|en> <out.jpg> [plain]
// ATTACKS=<attacks.json> uses another copy of the list, e.g. from main.
import { chromium } from "playwright-core"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"

const repo = "/home/tg/.t3/worktrees/dac8.org/t3-a8b2b73b"
const require = createRequire(`${repo}/package.json`)
const { feature, mesh } = require("topojson-client")
const topology = require("world-atlas/countries-50m.json")
const attacks = JSON.parse(
  readFileSync(process.env.ATTACKS ?? `${repo}/src/data/attacks.json`, "utf8"),
)
const font = readFileSync(
  `${repo}/src/assets/fonts/IBMPlexSans-VariableFont_wdth,wght.woff2`,
).toString("base64")

const [language, out, mode] = process.argv.slice(2)
// "plain" leaves the numbers out of the circles; the size still shows them.
const plain = mode === "plain"
const en = language === "en"

// The site's frame and scale; one unit is what the site draws at 600 wide.
const site = { west: -11, east: 32, south: 35, north: 62 }
const radians = (degrees) => (degrees * Math.PI) / 180
const mercator = (latitude) =>
  Math.log(Math.tan(Math.PI / 4 + radians(latitude) / 2))
const scale = 600 / radians(site.east - site.west)
const siteHeight = Math.round(
  scale * (mercator(site.north) - mercator(site.south)),
)
const project = ([longitude, latitude]) => [
  scale * radians(longitude - site.west),
  scale *
    (mercator(site.north) - mercator(Math.max(-80, Math.min(80, latitude)))),
]

// The cover: the site's full height, widened to 16:9 around its centre.
const W = 1920
const H = 1080
const view = { height: siteHeight, width: (siteHeight * W) / H }
view.left = 300 - view.width / 2
view.top = 0

const margin = 6
const frame = {
  left: view.left - margin,
  top: view.top - margin,
  right: view.left + view.width + margin,
  bottom: view.top + view.height + margin,
}
const inside = ([x, y]) =>
  x >= frame.left && x <= frame.right && y >= frame.top && y <= frame.bottom
const clip = (ring) => {
  const sides = [
    [
      ([x]) => x >= frame.left,
      (a, b) => [
        frame.left,
        a[1] + ((frame.left - a[0]) / (b[0] - a[0])) * (b[1] - a[1]),
      ],
    ],
    [
      ([x]) => x <= frame.right,
      (a, b) => [
        frame.right,
        a[1] + ((frame.right - a[0]) / (b[0] - a[0])) * (b[1] - a[1]),
      ],
    ],
    [
      ([, y]) => y >= frame.top,
      (a, b) => [
        a[0] + ((frame.top - a[1]) / (b[1] - a[1])) * (b[0] - a[0]),
        frame.top,
      ],
    ],
    [
      ([, y]) => y <= frame.bottom,
      (a, b) => [
        a[0] + ((frame.bottom - a[1]) / (b[1] - a[1])) * (b[0] - a[0]),
        frame.bottom,
      ],
    ],
  ]
  let points = ring
  for (const [keep, cut] of sides) {
    const input = points
    points = []
    input.forEach((current, index) => {
      const previous = input.at(index - 1) ?? current
      if (keep(current)) {
        if (!keep(previous)) points.push(cut(previous, current))
        points.push(current)
      } else if (keep(previous)) points.push(cut(previous, current))
    })
    if (points.length === 0) break
  }
  return points
}
// Finer than the site's 1.5-unit steps: the cover is drawn larger.
const step = 0.75
const path = (points, closed) => {
  let d = ""
  let last
  for (const point of points) {
    const rounded = [Math.round(point[0] * 2) / 2, Math.round(point[1] * 2) / 2]
    if (last && Math.hypot(rounded[0] - last[0], rounded[1] - last[1]) < step)
      continue
    d += last ? `L${rounded[0]} ${rounded[1]}` : `M${rounded[0]} ${rounded[1]}`
    last = rounded
  }
  return closed && d.includes("L") ? `${d}Z` : closed ? "" : d
}
const land = feature(topology, topology.objects.land)
const landGeometries = (land.features ?? []).map((item) => item.geometry)
if (land.geometry) landGeometries.push(land.geometry)
const landPath = landGeometries
  .flatMap((g) =>
    g.type === "Polygon"
      ? [g.coordinates]
      : g.type === "MultiPolygon"
        ? g.coordinates
        : [],
  )
  .flat()
  .map((ring) => path(clip(ring.map(project)), true))
  .join("")
const borderPath = mesh(topology, topology.objects.countries, (a, b) => a !== b)
  .coordinates.map((line) => line.map(project))
  .filter((line) => line.some(inside))
  .map((line) => path(line, false))
  .join("")

const points = attacks
  .filter((a) => a.lat !== null && a.lng !== null)
  .map((a) => {
    const [x, y] = project([a.lng, a.lat])
    return { x, y, count: 1 }
  })
  .filter(
    (p) =>
      p.x >= view.left &&
      p.x <= view.left + view.width &&
      p.y >= view.top &&
      p.y <= view.top + view.height,
  )

// Hotspots exactly as on the site.
const reach = 30
const radius = (count) => (count === 1 ? 5 : 11 + Math.log2(count) * 4)
const groups = points.map((p) => ({ ...p }))
for (;;) {
  let best
  for (let i = 0; i < groups.length; i++) {
    for (let j = i + 1; j < groups.length; j++) {
      const a = groups[i]
      const b = groups[j]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const limit = Math.max(reach, radius(a.count) + radius(b.count) + 4)
      if (distance < limit && (!best || distance - limit < best[2]))
        best = [i, j, distance - limit]
    }
  }
  if (!best) break
  const [i, j] = best
  const a = groups[i]
  const b = groups[j]
  const count = a.count + b.count
  groups[i] = {
    x: (a.x * a.count + b.x * b.count) / count,
    y: (a.y * a.count + b.y * b.count) / count,
    count,
  }
  groups.splice(j, 1)
}
const keepInside = (value, r, low, size) =>
  Math.min(Math.max(value, low + r + 6), low + size - r - 6)
const hotspots = groups
  .map((g) => {
    const r = Math.round(radius(g.count) * 2) / 2
    return {
      x: Math.round(keepInside(g.x, r, view.left, view.width) * 2) / 2,
      y: Math.round(keepInside(g.y, r, view.top, view.height) * 2) / 2,
      count: g.count,
      r,
    }
  })
  .sort((a, b) => a.count - b.count)
const spots = hotspots
  .map((s) =>
    s.count === 1
      ? `<circle class="dot" cx="${s.x}" cy="${s.y}" r="${s.r}"/>`
      : `<g><circle class="halo" cx="${s.x}" cy="${s.y}" r="${s.r + 5}"/><circle cx="${s.x}" cy="${s.y}" r="${s.r}"/>${plain ? "" : `<text x="${s.x}" y="${s.y}">${s.count}</text>`}</g>`,
  )
  .join("")
const credit = en ? "Data: Jameson Lopp" : "Daten: Jameson Lopp"
// The credit sits inside the 3:2 crop of the post list.
const creditX = view.left + view.width * (1 - 170 / W)
const creditY = view.top + view.height - 16

const html = `<!doctype html><style>
@font-face { font-family: Plex; src: url(data:font/woff2;base64,${font}) format("woff2"); font-weight: 100 700; }
* { margin: 0; }
body { width: ${W}px; height: ${H}px; background: #f3f3f2; overflow: hidden; }
svg { display: block; }
.land { fill: #e0e0e0; }
.borders { fill: none; stroke: #fcfcfc; stroke-width: 1; stroke-linejoin: round; }
circle { fill: #e3000f; }
.dot { stroke: #fcfcfc; stroke-width: 1.5; }
.halo { fill: color-mix(in oklab, #e3000f 28%, transparent); }
text { fill: #fff; font-family: Plex; font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; text-anchor: middle; dominant-baseline: central; }
.credit { fill: #646464; font-size: 10.5px; font-weight: 400; text-anchor: end; dominant-baseline: auto; }
</style><svg width="${W}" height="${H}" viewBox="${view.left} ${view.top} ${view.width} ${view.height}"><path class="land" d="${landPath}"/><path class="borders" d="${borderPath}"/><g>${spots}</g><text class="credit" x="${creditX}" y="${creditY}">${credit}</text></svg>`

const browser = await chromium.launch({ executablePath: "/usr/bin/chromium" })
const tab = await browser.newPage({ viewport: { width: W, height: H } })
await tab.setContent(html)
await tab.evaluate(() => document.fonts.ready)
await tab.screenshot({ path: out, type: "jpeg", quality: 90 })
await browser.close()
const west = site.west + (view.left / scale) * (180 / Math.PI)
const east = site.west + ((view.left + view.width) / scale) * (180 / Math.PI)
console.log(
  "wrote",
  out,
  "attacks",
  points.length,
  "hotspots",
  hotspots.length,
  "lon",
  west.toFixed(1),
  east.toFixed(1),
)
