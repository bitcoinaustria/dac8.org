// The result chapter of the history film (src/components/RuleFilm.astro)
// drawn on a canvas: one grain per suspicion report. First the reports of
// the first year fill the picture; then the camera pulls back until all
// of the latest year stand in a square; then the reports the unit kept
// without passing them on fade to a pale block that stays on file; then
// the square falls into a dune
// and, beside it on the same scale, a pinch of red grains settles, one per
// conviction. The two heaps stand apart on purpose: convictions are not
// linked to particular reports.

export type SandState = "first" | "all" | "kept" | "heap"

type Layout = {
  // Size of the canvas in CSS pixels.
  width: number
  height: number
  // Grid of the field and the camera's corner for the first year.
  cols: number
  block: number
  pitch: number
  left: number
  base: number
  // Dune and pinch, each a centre, a half width and a height.
  grain: number
  dune: { x: number; r: number; h: number }
  pinch: { x: number; r: number; h: number }
}

type Particle = {
  // Grid cell and heap slot in world coordinates.
  gx: number
  gy: number
  hx: number
  hy: number
  // Where the tween started, where it ends, and when.
  fx: number
  fy: number
  fs: number
  fa: number
  tx: number
  ty: number
  ts: number
  ta: number
  delay: number
  ring: number
  slot: number
  red: boolean
  // Kept on file without being passed on: the upper rows of the square.
  kept: boolean
}

const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
// Falling: slow start, hard landing.
const fall = (t: number) => t * t
const glide = (t: number) => 1 - (1 - t) ** 3

// A seeded random number, so the dune looks the same on every visit.
const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

// A heap stands like a heap of sand: a triangle whose height is a little
// less than its half width. Slots run bottom row first, enough for count
// grains of the given pitch; the heap is widened until they fit.
const slope = 0.85
const pile = (count: number, grain: number, x: number, base: number) => {
  let r = Math.sqrt((count * grain * grain) / slope)
  for (let tries = 0; tries < 60; tries++) {
    const h = r * slope
    const slots: [number, number][] = []
    for (let y = 0; y < h && slots.length < count; y += grain) {
      const w = r * (1 - y / h)
      for (let dx = -w + grain / 2; dx <= w; dx += grain) {
        slots.push([x + dx, base - y - grain / 2])
        if (slots.length === count) break
      }
    }
    if (slots.length >= count) return { slots, r, h }
    r *= 1.02
  }
  return { slots: [] as [number, number][], r, h: r * slope }
}

// The settled heap as a clean shape with a softly rounded top.
const outline = (
  context: CanvasRenderingContext2D,
  x: number,
  base: number,
  r: number,
  h: number,
) => {
  const round = r * 0.14
  const shoulder = base - h + round * slope
  context.beginPath()
  context.moveTo(x - r, base)
  context.lineTo(x - round, shoulder)
  context.quadraticCurveTo(x, base - h, x + round, shoulder)
  context.lineTo(x + r, base)
  context.closePath()
}

export const createSand = (
  root: HTMLElement,
  counts: { first: number; latest: number; kept: number; convictions: number },
) => {
  const canvas = root.querySelector("canvas")
  const context = canvas?.getContext("2d")
  if (!canvas || !context) return null
  const labels = {
    reports: root.querySelector<HTMLElement>('[data-sand-label="reports"]'),
    convictions: root.querySelector<HTMLElement>(
      '[data-sand-label="convictions"]',
    ),
    kept: root.querySelector<HTMLElement>('[data-sand-label="kept"]'),
    passed: root.querySelector<HTMLElement>('[data-sand-label="passed"]'),
  }
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const ink = { grey: "#3b4147", red: "#e3000f" }
  // The colours come from two hidden swatches, so light and dark mode and
  // the theme switch apply without the canvas knowing the palette.
  const readInk = () => {
    const grey = root.querySelector<HTMLElement>("[data-sand-grey]")
    const red = root.querySelector<HTMLElement>("[data-sand-red]")
    if (grey) ink.grey = getComputedStyle(grey).color
    if (red) ink.red = getComputedStyle(red).color
  }

  let layout: Layout | null = null
  let particles: Particle[] = []
  let state: SandState | null = null
  let zoomFrom = 1
  let zoomTo = 1
  let start = 0
  let span = 0
  let frame = 0

  const build = () => {
    const box = root.getBoundingClientRect()
    if (!box.width || !box.height) return false
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(box.width * dpr)
    canvas.height = Math.round(box.height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)

    const { first, latest, convictions } = counts
    const side = Math.min(box.width, box.height) * 0.92
    const cols = Math.ceil(Math.sqrt(latest))
    const block = Math.ceil(Math.sqrt(first))
    const left = (box.width - side) / 2
    const base = (box.height + side) / 2
    const pitch = side / cols
    // Grains pack tighter than the dots of the field, so the heap of all
    // reports spans most of the field's width, with room beside it for
    // the red pinch.
    const duneR = side * 0.42
    const grain = Math.sqrt((slope * duneR * duneR) / latest)
    const duneX = left + side * 0.43
    const pinchX = left + side * 0.945
    const dune = pile(latest, grain, duneX, base)
    const pinch = pile(convictions, grain, pinchX, base)
    layout = {
      width: box.width,
      height: box.height,
      cols,
      block,
      pitch,
      left,
      base,
      grain,
      dune: { x: duneX, r: dune.r, h: dune.h },
      pinch: { x: pinchX, r: pinch.r, h: pinch.h },
    }

    // Cells: the first year's reports fill a square in the corner, row by
    // row; the later ones fill the field from the bottom, so only the top
    // row stays open. They appear ring by ring around the corner.
    const next = random(1991)
    const cells: { c: number; r: number; ring: number }[] = []
    for (let r = 0; r < block; r++)
      for (let c = 0; c < block; c++)
        if (cells.length < first) cells.push({ c, r, ring: 0 })
    const taken = new Set(cells.map(({ c, r }) => r * cols + c))
    for (let r = 0; r < cols && cells.length < latest; r++)
      for (let c = 0; c < cols && cells.length < latest; c++)
        if (!taken.has(r * cols + c))
          cells.push({ c, r, ring: Math.max(c, r) + next() * 3 })

    // Each grey grain gets a slot in the dune at random; the dune builds
    // from the bottom because lower slots are filled first.
    const order = cells.map((_, k) => k)
    for (let k = order.length - 1; k > 0; k--) {
      const j = Math.floor(next() * (k + 1))
      ;[order[k], order[j]] = [order[j], order[k]]
    }
    const grey: Particle[] = cells.map((cell, k) => {
      const slot = order[k]
      const [hx, hy] = dune.slots[slot] ?? [layout?.dune.x ?? 0, base]
      return {
        gx: left + (cell.c + 0.5) * pitch,
        gy: base - (cell.r + 0.5) * pitch,
        hx,
        hy,
        fx: 0,
        fy: 0,
        fs: 0,
        fa: 0,
        tx: 0,
        ty: 0,
        ts: 0,
        ta: 0,
        delay: 0,
        ring: cell.ring,
        slot,
        red: false,
        kept: k >= cells.length - counts.kept,
      }
    })
    // The red grains come from above the picture.
    const red: Particle[] = pinch.slots.map(([hx, hy], slot) => ({
      gx: hx + (next() - 0.5) * grain * 6,
      gy: base - side - next() * side * 0.3,
      hx,
      hy,
      fx: 0,
      fy: 0,
      fs: 0,
      fa: 0,
      tx: 0,
      ty: 0,
      ts: 0,
      ta: 0,
      delay: 0,
      ring: 0,
      slot,
      red: true,
      kept: false,
    }))
    particles = [...grey, ...red]
    return true
  }

  // Where each grain belongs in a state, in world coordinates.
  const target = (p: Particle, to: SandState) => {
    if (!layout) return { x: 0, y: 0, s: 0, a: 0 }
    const dot = layout.pitch * 0.62
    const grain = layout.grain * 0.85
    if (to === "heap") return { x: p.hx, y: p.hy, s: grain, a: 1 }
    if (p.red) return { x: p.gx, y: p.gy, s: grain, a: 0 }
    if (to === "kept") return { x: p.gx, y: p.gy, s: dot, a: p.kept ? 0.2 : 1 }
    const visible = to === "all" || p.ring === 0
    return { x: p.gx, y: p.gy, s: dot, a: visible ? 1 : 0 }
  }

  const zoomOf = (to: SandState) =>
    to === "first" && layout ? layout.cols / layout.block : 1

  // Delays: the field fills ring by ring; the dune from the bottom up, the
  // red grains after it; going back, everything at once.
  const delayOf = (p: Particle, from: SandState | null, to: SandState) => {
    if (!layout) return 0
    if (to === "all" && from === "first")
      return 0.25 + (p.ring / layout.cols) * 0.9
    // The kept rows fade from the top down.
    if (to === "kept" || from === "kept")
      return p.kept ? (p.gy / layout.base) * 0.8 : 0
    if (to === "heap") {
      if (p.red) return 1.7 + (p.slot / Math.max(1, counts.convictions)) * 0.6
      return (p.slot / counts.latest) * 1.3
    }
    return 0
  }

  const now = () => performance.now() / 1000

  const draw = () => {
    if (!layout) return
    const t = now() - start
    const zoomT = Math.min(1, span ? t / 1.4 : 1)
    const zoom = zoomFrom + (zoomTo - zoomFrom) * easeInOut(zoomT)
    context.clearRect(0, 0, layout.width, layout.height)
    let busy = zoomT < 1
    // Once the grains have landed they merge into a clean heap: grey after
    // the dune is complete, red after the pinch.
    const settle = (from: number) =>
      state !== "heap"
        ? 0
        : span
          ? easeInOut(Math.min(1, Math.max(0, (t - from) / 0.6)))
          : 1
    const greySettled = settle(2.1)
    const redSettled = settle(3.1)
    if (state === "heap") {
      if (redSettled < 1) busy = true
      const { left, base, dune, pinch } = layout
      const side = layout.cols * layout.pitch
      context.globalAlpha = 0.35 * greySettled
      context.fillStyle = ink.grey
      context.fillRect(left, base, side, 1)
      context.globalAlpha = greySettled
      outline(context, dune.x, base, dune.r, dune.h)
      context.fill()
      context.globalAlpha = redSettled
      context.fillStyle = ink.red
      outline(context, pinch.x, base, pinch.r, pinch.h)
      context.fill()
    }
    for (const p of particles) {
      const local = Math.min(1, Math.max(0, (t - p.delay) / 0.9))
      if (local < 1) busy = true
      const heading = state === "heap"
      const ky = heading ? fall(local) : easeInOut(local)
      const kx = heading ? glide(local) : easeInOut(local)
      const x = p.fx + (p.tx - p.fx) * kx
      const y = p.fy + (p.ty - p.fy) * ky
      const s = p.fs + (p.ts - p.fs) * easeInOut(local)
      const merged = p.red ? redSettled : greySettled
      const a = (p.fa + (p.ta - p.fa) * easeInOut(local)) * (1 - merged)
      if (a <= 0.01) continue
      const sx = layout.left + (x - layout.left) * zoom
      const sy = layout.base + (y - layout.base) * zoom
      const size = Math.max(0.8, s * zoom)
      if (sx < -size || sy < -size || sx > layout.width + size) continue
      context.globalAlpha = a
      context.fillStyle = p.red ? ink.red : ink.grey
      // Close up the grains are round; small, squares draw faster.
      if (size > 5) {
        context.beginPath()
        context.arc(sx, sy, size / 2, 0, Math.PI * 2)
        context.fill()
      } else context.fillRect(sx - size / 2, sy - size / 2, size, size)
    }
    context.globalAlpha = 1
    if (busy && !motion.matches) frame = requestAnimationFrame(draw)
    else frame = 0
  }

  // Labels stand over the two heaps once they have settled; in the kept
  // state one stands in the pale block and one in the dark rows below it.
  const place = () => {
    if (!layout) return
    const { dune, pinch, base, left, pitch, cols } = layout
    const side = cols * pitch
    const passedShare = 1 - counts.kept / counts.latest
    if (labels.kept) {
      labels.kept.style.left = `${left + side / 2}px`
      labels.kept.style.top = `${base - side * (passedShare + (1 - passedShare) / 2)}px`
    }
    if (labels.passed) {
      labels.passed.style.left = `${left + side / 2}px`
      labels.passed.style.top = `${base - (side * passedShare) / 2}px`
    }
    if (labels.reports) {
      labels.reports.style.left = `${dune.x}px`
      labels.reports.style.top = `${base - dune.h - 14}px`
    }
    if (labels.convictions) {
      // Under the ground line where there is room, so a narrow picture
      // does not put the label on the slope of the dune.
      const below = layout.height - base > 56
      labels.convictions.classList.toggle("below", below)
      labels.convictions.style.left = `${pinch.x + pinch.r}px`
      labels.convictions.style.top = below
        ? `${base + 10}px`
        : `${base - pinch.h - 14}px`
    }
  }

  const go = (to: SandState, animate: boolean) => {
    if (!layout && !build()) return
    readInk()
    const from = state
    const t = now() - start
    const zoomT = Math.min(1, span ? t / 1.4 : 1)
    const zoomNow = zoomFrom + (zoomTo - zoomFrom) * easeInOut(zoomT)
    const smooth = animate && !motion.matches && from !== null
    for (const p of particles) {
      // Start from wherever the grain is now, mid-flight included.
      const local = Math.min(1, Math.max(0, (t - p.delay) / 0.9))
      const k = easeInOut(local)
      const current = smooth
        ? {
            x: p.fx + (p.tx - p.fx) * k,
            y: p.fy + (p.ty - p.fy) * k,
            s: p.fs + (p.ts - p.fs) * k,
            a: p.fa + (p.ta - p.fa) * k,
          }
        : target(p, to)
      const next = target(p, to)
      p.fx = current.x
      p.fy = current.y
      p.fs = current.s
      p.fa = current.a
      p.tx = next.x
      p.ty = next.y
      p.ts = next.s
      p.ta = next.a
      p.delay = smooth ? delayOf(p, from, to) : 0
    }
    zoomFrom = smooth ? zoomNow : zoomOf(to)
    zoomTo = zoomOf(to)
    state = to
    start = now()
    span = smooth ? 1 : 0
    place()
    root.dataset.state = to
    if (!frame) frame = requestAnimationFrame(draw)
  }

  const resize = () => {
    if (!build()) return
    const keep = state
    state = null
    if (keep) go(keep, false)
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

  return {
    go,
    hide: () => {
      state = null
    },
  }
}
