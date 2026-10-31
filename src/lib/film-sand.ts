// The result chapter of the history film (src/components/RuleFilm.astro)
// drawn on a canvas: one dot per suspicion report. The first year's
// reports stand alone for a moment as a small block with their year, then
// the latest year's grow around them, ring by ring, into a square; then
// the reports the unit kept without passing them on fade to a pale block
// that stays on file. For the convictions the camera moves in on the empty
// floor beside or under the square, where one red dot per conviction
// arrives, counted as it lands, and pulls back until both stand side by
// side on the same scale: the count shrinks with the dots. The two stand
// apart on purpose: convictions are not linked to particular reports.

export type SandState = "all" | "kept" | "convictions"

// Where the camera looks: the world point at the centre of the canvas and
// how many pixels a cell takes. The world counts in cells, x to the right
// and y up from the floor.
type Camera = { x: number; y: number; scale: number }
type Shot = "field" | "close" | "both"

// A number that eases from one value to another, starting `at` seconds
// after the step began.
type Tween = { from: number; to: number; at: number; span: number }

type Dot = {
  x: number
  y: number
  ring: number
  // Kept on file without being passed on: the upper rows of the square.
  kept: boolean
  alpha: Tween
}

type Layout = Record<Shot, Camera> & {
  width: number
  height: number
  // The convictions beside the square on wide pictures, under it on
  // narrow ones, where they appear in place rather than fall through it.
  wide: boolean
  red: { x: number; y: number }
  // The count of convictions: the start of its last line's baseline in
  // the world, right of the red block.
  count: { x: number; y: number }
  // Type in cells, so that it has its own size at the end of the step.
  big: number
  small: number
}

// The convictions step, in seconds: in, the drops, back out.
const pushIn = { at: 0.1, span: 1.2 }
const drop = { at: 0.9, spread: 1.3, span: 0.5 }
const pullBack = { at: 2.8, span: 1.5 }
// The square's first appearance: the first year's block, then the rest.
const growth = { at: 0.9, span: 1.1 }

const clamp = (t: number) => Math.min(1, Math.max(0, t))
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
const overshoot = (t: number) => 1 + 2.7 * (t - 1) ** 3 + 1.7 * (t - 1) ** 2
const value = (tween: Tween, t: number) =>
  tween.from +
  (tween.to - tween.from) *
    easeInOut(tween.span ? clamp((t - tween.at) / tween.span) : 1)
const still = (to: number): Tween => ({ from: to, to, at: 0, span: 0 })
const ends = (tween: Tween) => tween.at + tween.span

// A seeded random number, so the field fills the same way on every visit.
const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

export const createSand = (
  root: HTMLElement,
  counts: {
    firstYear: number
    first: number
    latest: number
    kept: number
    convictions: number
  },
) => {
  const canvas = root.querySelector("canvas")
  const context = canvas?.getContext("2d")
  if (!canvas || !context) return null
  const labels = {
    kept: root.querySelector<HTMLElement>('[data-sand-label="kept"]'),
    passed: root.querySelector<HTMLElement>('[data-sand-label="passed"]'),
  }
  const words: { reports?: string; convictions?: string } = JSON.parse(
    root.dataset.sandWords ?? "{}",
  )
  const format = new Intl.NumberFormat(root.dataset.sandLocale)
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  // Colours and type come from hidden swatches, so light and dark mode and
  // the theme switch apply without the canvas knowing the palette.
  const ink = {
    grey: "#3b4147",
    red: "#e3000f",
    text: "#111",
    muted: "#555",
    panel: "#f3f3f2",
  }
  const type = { family: "sans-serif", weight: "700", big: 24, small: 14 }
  const readInk = () => {
    for (const name of Object.keys(ink) as (keyof typeof ink)[]) {
      const swatch = root.querySelector<HTMLElement>(`[data-sand-${name}]`)
      if (swatch) ink[name] = getComputedStyle(swatch).color
    }
    const big = root.querySelector<HTMLElement>("[data-sand-text]")
    const small = root.querySelector<HTMLElement>("[data-sand-muted]")
    if (!big || !small) return
    const style = getComputedStyle(big)
    type.family = style.fontFamily
    type.weight = style.fontWeight
    type.big = Number.parseFloat(style.fontSize)
    type.small = Number.parseFloat(getComputedStyle(small).fontSize)
  }
  const font = (weight: string, px: number) => {
    context.font = `${weight} ${px}px ${type.family}`
  }

  // The world: the square of reports, filled row by row from the bottom
  // so that only the top row stays open, and the red block beside it.
  const { first, latest, kept, convictions } = counts
  const cols = Math.ceil(Math.sqrt(latest))
  const rows = Math.ceil(latest / cols)
  const redCols = Math.ceil(Math.sqrt(convictions))
  const redRows = Math.ceil(convictions / redCols)
  const gap = 6
  // The first year's reports fill a square in the corner; from there the
  // field fills ring by ring when it first appears.
  const next = random(1991)
  const block = Math.ceil(Math.sqrt(first))
  const cells: { c: number; r: number; ring: number }[] = []
  for (let r = 0; r < block; r++)
    for (let c = 0; c < block; c++)
      if (cells.length < first) cells.push({ c, r, ring: 0 })
  const taken = new Set(cells.map(({ c, r }) => r * cols + c))
  for (let r = 0; r < rows && cells.length < latest; r++)
    for (let c = 0; c < cols && cells.length < latest; c++)
      if (!taken.has(r * cols + c))
        cells.push({ c, r, ring: Math.max(c, r) + next() * 3 })
  const dots: Dot[] = cells.map((cell, k) => ({
    x: cell.c + 0.5,
    y: cell.r + 0.5,
    ring: cell.ring,
    kept: k >= cells.length - kept,
    alpha: still(1),
  }))

  let layout: Layout | null = null
  let state: SandState | null = null
  let start = 0
  let until = 0
  let frame = 0
  // The camera's path through the step: a shot or a camera, at given
  // seconds. Shots are looked up when drawn, so a new size keeps the path.
  let keys: { at: number; to: Shot | Camera }[] = []
  // When the red dots begin to arrive, or null once they lie still; how
  // strongly they and the labels show.
  let drops: number | null = null
  let red = still(0)
  let countLabel = still(0)
  let countWord = still(0)
  let reportsLabel = still(0)
  // When the square first fills, the first year's block stands alone for a
  // moment with its year, then the rest grows around it.
  let firstLabel = still(0)

  const measure = () => {
    const box = root.getBoundingClientRect()
    if (!box.width || !box.height) return false
    readInk()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(box.width * dpr)
    canvas.height = Math.round(box.height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    const { width: w, height: h } = box

    // The count's width decides how far the picture must reach.
    font("500", type.small)
    const wordWidth = context.measureText(words.convictions ?? "").width
    font(type.weight, type.big)
    const numberWidth = context.measureText(format.format(convictions)).width
    const labelWidth = Math.max(wordWidth, numberWidth)

    // Side by side or one under the other, whichever shows the dots
    // larger; the count stands to the right of the red block.
    const besideScale = Math.min(
      (w * 0.92 - labelWidth) / (cols + gap + redCols + 1.5),
      (h * 0.86) / rows,
    )
    const underScale = Math.min(
      (w * 0.92) / cols,
      (h * 0.9) / (rows + gap + redRows),
    )
    const wide = besideScale >= underScale
    const scale = wide ? besideScale : underScale
    const big = type.big / scale
    const small = type.small / scale
    // Number over word, centred on the block's height.
    const labelHeight = small * 1.6 + big * 0.75
    const red = wide ? { x: cols + gap, y: 0 } : { x: 0, y: -(gap + redRows) }
    const count = {
      x: red.x + redCols + 1.5,
      y: red.y + (redRows - labelHeight) / 2 + small * 0.3,
    }
    // Close up: the red dots, the count's number, a strip of the square
    // for scale and room above to fall from, standing on the floor.
    const close = {
      left: wide ? cols - 5 : -2,
      right: count.x + numberWidth / scale + 2,
      bottom: red.y - 1.5,
      top: wide ? redRows + 6 : 3,
    }
    const closeScale = Math.min(
      (w * 0.94) / (close.right - close.left),
      (h * 0.9) / (close.top - close.bottom),
    )
    layout = {
      width: w,
      height: h,
      wide,
      red,
      count,
      big,
      small,
      field: {
        x: cols / 2,
        y: rows / 2,
        scale: (Math.min(w, h) * 0.92) / Math.max(cols, rows),
      },
      close: {
        x: (close.left + close.right) / 2,
        y: close.bottom + (h * 0.44) / closeScale,
        scale: closeScale,
      },
      both: wide
        ? { x: (count.x + labelWidth / scale) / 2, y: rows / 2, scale }
        : { x: cols / 2, y: (rows + red.y) / 2, scale },
    }
    return true
  }

  const cameraAt = (t: number): Camera => {
    if (!layout) return { x: 0, y: 0, scale: 1 }
    const view = layout
    const resolve = (to: Shot | Camera) =>
      typeof to === "string" ? view[to] : to
    let a = keys[0]
    if (!a) return view.field
    for (const b of keys.slice(1)) {
      if (t <= b.at) {
        const from = resolve(a.to)
        const to = resolve(b.to)
        const k = easeInOut(clamp((t - a.at) / Math.max(0.001, b.at - a.at)))
        if (Math.abs(to.scale / from.scale - 1) < 0.02)
          return {
            x: from.x + (to.x - from.x) * k,
            y: from.y + (to.y - from.y) * k,
            scale: from.scale + (to.scale - from.scale) * k,
          }
        // A zoom about the one point that stands at the same place on
        // screen in both shots, with the scale easing in proportion: what
        // is in both shots stays in the picture all the way.
        const scale = from.scale * (to.scale / from.scale) ** k
        const fixed = (p: number, q: number) =>
          (p * from.scale - q * to.scale) / (from.scale - to.scale)
        const fx = fixed(from.x, to.x)
        const fy = fixed(from.y, to.y)
        return {
          x: fx - ((fx - from.x) * from.scale) / scale,
          y: fy - ((fy - from.y) * from.scale) / scale,
          scale,
        }
      }
      a = b
    }
    return resolve(a.to)
  }

  const toScreen = (camera: Camera, x: number, y: number) => ({
    x: (layout?.width ?? 0) / 2 + (x - camera.x) * camera.scale,
    y: (layout?.height ?? 0) / 2 - (y - camera.y) * camera.scale,
  })

  // Red dot k: its place in the block and when it arrives there, the
  // lower rows first, each row scattered, like rain filling a box.
  const slot = (k: number) => ({
    x: (layout?.red.x ?? 0) + (k % redCols) + 0.5,
    y: (layout?.red.y ?? 0) + Math.floor(k / redCols) + 0.5,
  })
  const turns = Array.from(
    { length: convictions },
    (_, k) => (Math.floor(k / redCols) / redRows) * 0.75 + next() * 0.25,
  )
  const heights = turns.map(() => next() * 6)
  const arrives = (k: number) => (drops ?? 0) + turns[k] * drop.spread
  const landed = (t: number) => {
    if (drops === null) return convictions
    let n = 0
    for (let k = 0; k < convictions; k++) if (t >= arrives(k) + drop.span) n++
    return n
  }

  const now = () => performance.now() / 1000

  const draw = () => {
    frame = 0
    if (!layout) return
    const t = now() - start
    const camera = cameraAt(t)
    const { width, height } = layout
    context.clearRect(0, 0, width, height)
    const size = Math.max(0.8, camera.scale * 0.62)
    // Close up the dots are round; small, squares draw faster. Dots of
    // one strength share a path.
    const round = size > 4.5
    let alpha = -1
    const flush = () => {
      if (alpha > 0) context.fill()
      context.beginPath()
    }
    const dot = (x: number, y: number, a: number, grow = 1) => {
      const p = toScreen(camera, x, y)
      const s = size * grow
      if (p.x < -s || p.y < -s || p.x > width + s || p.y > height + s) return
      const q = Math.round(a * 20) / 20
      if (q !== alpha) {
        flush()
        alpha = q
        context.globalAlpha = q
      }
      if (q <= 0) return
      if (round) {
        context.moveTo(p.x + s / 2, p.y)
        context.arc(p.x, p.y, s / 2, 0, Math.PI * 2)
      } else context.rect(p.x - s / 2, p.y - s / 2, s, s)
    }
    context.fillStyle = ink.grey
    context.beginPath()
    for (const d of dots) dot(d.x, d.y, value(d.alpha, t))
    flush()

    // Beside the square the red dots fall in from above, ever faster, with
    // a small bounce; under it they appear in place.
    const redAlpha = value(red, t)
    if (redAlpha > 0.01) {
      context.fillStyle = ink.red
      alpha = -1
      context.beginPath()
      const top = layout.close.y + height / 2 / layout.close.scale + 1
      for (let k = 0; k < convictions; k++) {
        const { x, y } = slot(k)
        if (drops === null) {
          dot(x, y, redAlpha)
          continue
        }
        const p = (t - arrives(k)) / drop.span
        if (p < 0) continue
        if (!layout.wide) {
          dot(x, y, redAlpha, overshoot(clamp(p * 1.4)))
          continue
        }
        const bounce = (t - arrives(k) - drop.span) / 0.22
        const lift =
          p < 1
            ? (top + heights[k] - y) * (1 - p * p)
            : bounce < 1
              ? 0.7 * Math.sin(Math.PI * bounce) * (1 - bounce)
              : 0
        dot(x, y + lift, redAlpha)
      }
      flush()
    }

    // The count and the label of the reports stand in the world, so they
    // grow and shrink with the camera.
    const big = layout.big * camera.scale
    const small = layout.small * camera.scale
    const countAlpha = value(countLabel, t)
    if (countAlpha > 0.01) {
      const at = toScreen(camera, layout.count.x, layout.count.y)
      context.globalAlpha = countAlpha
      context.fillStyle = ink.red
      context.textAlign = "left"
      context.textBaseline = "alphabetic"
      font(type.weight, big)
      context.fillText(format.format(landed(t)), at.x, at.y - small * 1.3)
      const wordAlpha = value(countWord, t)
      if (wordAlpha > 0.01) {
        context.globalAlpha = countAlpha * wordAlpha
        font("500", small)
        context.fillText(words.convictions ?? "", at.x, at.y)
      }
    }
    const reportsAlpha = value(reportsLabel, t)
    if (reportsAlpha > 0.01) {
      // In the square, on a plate like the kept state's labels.
      const at = toScreen(camera, cols / 2, rows / 2)
      const number = format.format(latest)
      font(type.weight, big)
      const numberWidth = context.measureText(number).width
      font("500", small)
      const wordWidth = context.measureText(words.reports ?? "").width
      const plate = {
        width: Math.max(numberWidth, wordWidth) + small * 1.4,
        height: big * 0.75 + small * 1.3 + small * 1.2,
      }
      context.globalAlpha = reportsAlpha
      context.fillStyle = ink.panel
      context.beginPath()
      context.roundRect(
        at.x - plate.width / 2,
        at.y - plate.height / 2,
        plate.width,
        plate.height,
        small * 0.4,
      )
      context.fill()
      context.textAlign = "center"
      context.textBaseline = "alphabetic"
      const baseline = at.y + plate.height / 2 - small * 0.6
      context.fillStyle = ink.muted
      context.fillText(words.reports ?? "", at.x, baseline)
      context.fillStyle = ink.text
      font(type.weight, big)
      context.fillText(number, at.x, baseline - small * 1.3)
    }
    const firstAlpha = value(firstLabel, t) * (1 - clamp((t - growth.at) / 0.3))
    if (firstAlpha > 0.01) {
      const at = toScreen(camera, block + 1.5, block / 2)
      context.globalAlpha = firstAlpha
      context.fillStyle = ink.text
      context.textAlign = "left"
      context.textBaseline = "middle"
      font(type.weight, type.small * 1.1)
      context.fillText(
        `${counts.firstYear}: ${format.format(first)}`,
        at.x,
        at.y,
      )
    }
    context.globalAlpha = 1
    if (t < until && !motion.matches) frame = requestAnimationFrame(draw)
  }

  // The kept state's labels: one in the pale block, one in the dark rows.
  const place = () => {
    if (!layout) return
    const passedShare = 1 - kept / latest
    const keptAt = toScreen(
      layout.field,
      cols / 2,
      (rows * (1 + passedShare)) / 2,
    )
    const passedAt = toScreen(layout.field, cols / 2, (rows * passedShare) / 2)
    if (labels.kept) {
      labels.kept.style.left = `${keptAt.x}px`
      labels.kept.style.top = `${keptAt.y}px`
    }
    if (labels.passed) {
      labels.passed.style.left = `${passedAt.x}px`
      labels.passed.style.top = `${passedAt.y}px`
    }
  }

  // Each change starts from wherever things are now, mid-flight included.
  // `animate` is false for a jump, true for a step forward or back; from
  // nothing, the square fills ring by ring.
  const go = (to: SandState, animate: boolean) => {
    if (!layout && !measure()) return
    if (!layout) return
    readInk()
    const from = state
    const t = now() - start
    const smooth = animate && !motion.matches
    const camera = from ? cameraAt(t) : layout.field
    const target = (d: Dot) => (to === "kept" && d.kept ? 0.18 : 1)
    for (const d of dots) {
      const current = from ? value(d.alpha, t) : 0
      // Kept rows fade from the top down.
      const delay = !from
        ? d.ring
          ? growth.at + (d.ring / cols) * growth.span
          : 0.15
        : d.kept
          ? (1 - d.y / rows) * (to === "convictions" ? 0.3 : 0.8)
          : 0
      d.alpha = smooth
        ? { from: current, to: target(d), at: delay, span: from ? 0.5 : 0.4 }
        : still(target(d))
    }
    const fade = (tween: Tween, to: number, at = 0, span = 0.3): Tween =>
      smooth ? { from: value(tween, t), to, at, span } : still(to)
    if (to === "convictions") {
      keys = smooth
        ? [
            { at: 0, to: camera },
            { at: pushIn.at + pushIn.span, to: "close" },
            { at: pullBack.at, to: "close" },
            { at: pullBack.at + pullBack.span, to: "both" },
          ]
        : [{ at: 0, to: "both" }]
      drops = smooth ? drop.at : null
      red = still(1)
      countLabel = smooth
        ? { from: 0, to: 1, at: drop.at + drop.span, span: 0.2 }
        : still(1)
      countWord = fade(still(0), 1, pullBack.at + 0.5, 0.5)
      reportsLabel = fade(still(0), 1, pullBack.at + pullBack.span * 0.6, 0.5)
    } else {
      keys = smooth
        ? [
            { at: 0, to: camera },
            { at: from === "convictions" ? 1.1 : 0.6, to: "field" },
          ]
        : [{ at: 0, to: "field" }]
      drops = null
      red = fade(red, 0)
      countLabel = fade(countLabel, 0)
      countWord = fade(countWord, 0)
      reportsLabel = fade(reportsLabel, 0)
      firstLabel =
        smooth && !from ? { from: 0, to: 1, at: 0.35, span: 0.25 } : still(0)
    }
    until = Math.max(
      ...keys.map((key) => key.at),
      ...dots.map((d) => ends(d.alpha)),
      ...[red, countLabel, countWord, reportsLabel, firstLabel].map(ends),
      firstLabel.to ? growth.at + 0.3 : 0,
      drops === null ? 0 : drops + drop.spread + drop.span + 0.3,
    )
    state = to
    start = now()
    place()
    root.dataset.state = to
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(draw)
  }

  // A new size keeps the step where it is and only reframes it.
  const resize = () => {
    if (!measure()) return
    place()
    if (!frame) frame = requestAnimationFrame(draw)
  }
  new ResizeObserver(resize).observe(root)
  const redraw = () => {
    readInk()
    if (!frame) frame = requestAnimationFrame(draw)
  }
  new MutationObserver(redraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw)
  document.fonts?.ready.then(resize)

  return {
    go,
    hide: () => {
      state = null
    },
  }
}
