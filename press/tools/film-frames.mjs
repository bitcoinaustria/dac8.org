// Renders the home page's data film frame by frame instead of recording it
// live: the page clock is frozen and advanced by exactly one frame before
// each screenshot, and CSS transitions and animations are paused and set to
// the same clock, so every frame is evenly spaced and nothing stutters.
// Needs the built site served on 127.0.0.1:4329 (dist/).
// Usage: node film-frames.mjs <config.json> [stills]
// With "stills" it only writes one picture per timeline stop.
import { chromium } from "playwright-core"
import { mkdirSync, readFileSync, rmSync } from "node:fs"
import { dirname, resolve } from "node:path"

const configPath = resolve(process.argv[2])
const config = JSON.parse(readFileSync(configPath, "utf8"))
const stills = process.argv[3] === "stills"
const { view, scale, fps } = config
const work = `${config.out}.frames`
rmSync(work, { recursive: true, force: true })
mkdirSync(work, { recursive: true })

const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
})
const page = await browser.newPage({
  viewport: { width: view, height: view },
  deviceScaleFactor: scale,
  colorScheme: "light",
  reducedMotion: "no-preference",
})
await page.clock.install({ time: new Date("2026-11-02T09:00:00Z") })
await page.goto(`http://127.0.0.1:4329${config.path}`, { waitUntil: "load" })
await page.clock.runFor(2000)
await page.addStyleTag({
  content: readFileSync(resolve(dirname(configPath), config.css), "utf8"),
})
await page.evaluate((mark) => {
  const el = document.createElement("div")
  el.className = "film-watermark"
  el.innerHTML = mark
  document.body.append(el)
  const caption = document.createElement("div")
  caption.className = "film-caption"
  document.body.append(caption)
}, config.watermark)
await page.evaluate(() => document.fonts.ready)

const positions = await page.evaluate(
  ({ spacer, line }) =>
    [...document.querySelectorAll(spacer)].map((el) => {
      const box = el.getBoundingClientRect()
      return { top: box.top + scrollY - innerHeight * line, height: box.height }
    }),
  { spacer: config.spacer, line: config.line },
)
const yFor = ([i, f]) => positions[i].top + positions[i].height * f
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// The scroll position at each frame: holds and eased moves.
const [first, ...moves] = config.timeline
const track = []
let y = yFor(first.to)
const frames = (ms) => Math.round((ms / 1000) * fps)
for (let n = 0; n < frames(first.hold); n++) track.push(y)
for (const move of moves) {
  const to = yFor(move.to)
  const count = frames(move.dur)
  for (let n = 1; n <= count; n++) track.push(y + (to - y) * ease(n / count))
  y = to
  for (let n = 0; n < frames(move.hold); n++) track.push(y)
}

// The page itself scrolls once, to where the stage stands. After that only
// the invisible spacer track moves, on which the film measures its
// progress: scrolling the window goes by whole pixels and makes the sticky
// stage shimmer by half a pixel at each one. The film learns of the change
// through a scroll event in the same frame.
const base = await page.evaluate(
  (selector) =>
    Math.ceil(
      document.querySelector(selector).getBoundingClientRect().top + scrollY,
    ) + 1,
  config.stuck,
)
await page.evaluate(
  (y) => window.scrollTo({ top: y, behavior: "instant" }),
  base,
)
const scrollTo = (y) =>
  page.evaluate(
    ({ y, trackSelector }) => {
      document.querySelector(trackSelector).style.translate =
        `0 ${scrollY - y}px`
      window.dispatchEvent(new Event("scroll"))
    },
    { y, trackSelector: config.track },
  )

// Progress p of the film at scroll position y: scene index plus fraction.
const progressAt = (y) => {
  let p = 0
  positions.forEach((box, index) => {
    if (y >= box.top) p = index + Math.min(1, (y - box.top) / box.height)
  })
  return p
}
// The captions tell the story in big type; each starts at a progress p or,
// in a hold, at a time t in milliseconds. A new one fades in after the old
// one has faded out.
const captions = config.captions ?? []
const captionAt = (p, t) => {
  let index = -1
  captions.forEach((caption, k) => {
    if (caption.p !== undefined ? p >= caption.p : t >= caption.t) index = k
  })
  return index
}
let shownCaption = -1
let captionSince = 0
const fadeOut = 140
const fadeIn = 280
const captionState = (index, t) => {
  if (index !== shownCaption) {
    // The first line stands from the start; later ones replace the old.
    captionSince = shownCaption === -1 ? t - fadeOut - fadeIn : t
    shownCaption = index
  }
  const since = t - captionSince
  if (since < fadeOut)
    return {
      html: null,
      opacity: 1 - since / fadeOut,
      lift: -(since / fadeOut) * 6,
    }
  const k = Math.min(1, (since - fadeOut) / fadeIn)
  const eased = 1 - (1 - k) ** 3
  return {
    html: captions[index]?.html ?? "",
    opacity: eased,
    lift: (1 - eased) * 12,
  }
}
const setCaption = ({ html, opacity, lift }) =>
  page.evaluate(
    ({ html, opacity, lift }) => {
      const el = document.querySelector(".film-caption")
      if (html !== null && el.dataset.html !== html) {
        el.innerHTML = html
        el.dataset.html = html
      }
      el.style.opacity = String(opacity)
      el.style.translate = `0 ${lift}px`
    },
    { html, opacity, lift },
  )

const step = 1000 / fps
let clock = 0
const sync = () =>
  page.evaluate((now) => {
    for (const animation of document.getAnimations()) {
      // Scroll-driven animations follow the scroll by themselves.
      if (animation.timeline !== document.timeline) continue
      if (animation.filmStart === undefined) {
        animation.pause()
        animation.filmStart = now
      }
      animation.currentTime = now - animation.filmStart
    }
  }, clock)
const advance = async () => {
  clock += step
  await page.clock.runFor(step)
  await sync()
}

// Arrive at the first stop from a little above, and let it settle.
await scrollTo(yFor(first.to) - 300)
for (let n = 0; n < 30; n++) await advance()
for (let n = 0; n < 40; n++) {
  await scrollTo(yFor(first.to) - 300 + (300 * (n + 1)) / 40)
  await advance()
}
for (let n = 0; n < fps * (first.settle / 1000); n++) await advance()

if (stills) {
  const stops = [yFor(first.to), ...moves.map((move) => yFor(move.to))]
  for (const [k, stop] of stops.entries()) {
    await scrollTo(stop)
    const index = captionAt(progressAt(stop), 0)
    await setCaption({ html: captions[index]?.html ?? "", opacity: 1, lift: 0 })
    for (let n = 0; n < fps * 2; n++) await advance()
    await page.screenshot({
      path: `${work}/s${k}.jpg`,
      type: "jpeg",
      quality: 90,
    })
  }
} else {
  for (const [n, y] of track.entries()) {
    const t = n * step
    await scrollTo(y)
    await setCaption(captionState(captionAt(progressAt(y), t), t))
    await advance()
    await page.screenshot({
      path: `${work}/f${String(n).padStart(5, "0")}.jpg`,
      type: "jpeg",
      quality: 92,
    })
  }
}
await browser.close()
console.log(
  stills
    ? "stills"
    : `${track.length} frames, ${(track.length / fps).toFixed(1)} s`,
  work,
)
