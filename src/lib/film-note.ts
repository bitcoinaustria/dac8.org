// The last step of the history film (src/components/RuleFilm.astro) drawn
// on a canvas: a 100-euro note, like the ones the film opens with, crumbles
// from the right into dust that blows away, slower and slower, until only
// the share that is confiscated remains at its left edge and turns red.
// The note's outline stays as a dashed line, like the earlier heights of
// the tower at the start.

type Grain = {
  // Centre of the grain's cell on the note, in CSS pixels.
  x: number
  y: number
  colour: number
  // Seconds after the start when it comes loose; kept grains never do.
  at: number
  vx: number
  vy: number
  life: number
  phase: number
}

// The note appears, then the edge of the crumbling runs from the right to
// the kept strip, then the strip turns red.
const appear = 0.45
const begin = 0.55
const run = 2.1
const red = begin + run + 0.35
const maxLife = 1.6
const end = red + maxLife

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const clamp = (t: number) => Math.min(1, Math.max(0, t))

// A seeded random number, so the dust blows the same way on every visit.
const random = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296
  return seed / 4294967296
}

export const createNote = (root: HTMLElement, keep: number) => {
  const canvas = root.querySelector("canvas")
  const context = canvas?.getContext("2d")
  if (!canvas || !context) return null
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  // The colours come from hidden swatches, so light and dark mode and the
  // theme switch apply without the canvas knowing the palette.
  const ink = { paper: "", edge: "", line: "", red: "" }
  const readInk = () => {
    for (const name of Object.keys(ink) as (keyof typeof ink)[]) {
      const swatch = root.querySelector<HTMLElement>(`[data-note-${name}]`)
      if (swatch) ink[name] = getComputedStyle(swatch).color
    }
  }
  const labels = [...root.querySelectorAll<HTMLElement>("[data-note-label]")]

  const paper = document.createElement("canvas")
  const intact = document.createElement("canvas")
  let size = { width: 0, height: 0, dpr: 1 }
  let note = { x: 0, y: 0, w: 0, h: 0, r: 0 }
  let cell = 3
  let strip = 0
  let grains: Grain[] = []
  let palette: string[] = []
  let on = false
  let animated = false
  let start = 0
  let frame = 0
  let loose = 0
  let alive = 0
  let swept = false

  // A plain note: frame, wavy lines, the ring of stars and the value.
  const paint = (c: CanvasRenderingContext2D) => {
    const { x, y, w, h, r } = note
    const family = getComputedStyle(root).fontFamily
    c.save()
    c.beginPath()
    c.roundRect(x, y, w, h, r)
    c.clip()
    c.fillStyle = ink.paper
    c.fillRect(x, y, w, h)
    const light = c.createLinearGradient(x, y, x + w, y + h)
    light.addColorStop(0, "rgb(255 255 255 / 0.28)")
    light.addColorStop(0.55, "rgb(255 255 255 / 0)")
    light.addColorStop(1, "rgb(0 0 0 / 0.14)")
    c.fillStyle = light
    c.fillRect(x, y, w, h)
    c.strokeStyle = ink.edge
    c.lineWidth = 1
    c.globalAlpha = 0.5
    for (let k = 0; k < 9; k++) {
      c.beginPath()
      for (let s = 0; s <= 80; s++) {
        const px = x + w * 0.3 + (w * 0.62 * s) / 80
        const py =
          y +
          h * (0.22 + k * 0.065) +
          Math.sin((s / 80) * Math.PI * 3 + k * 0.6) * h * 0.06
        if (s) c.lineTo(px, py)
        else c.moveTo(px, py)
      }
      c.stroke()
    }
    c.globalAlpha = 1
    c.lineWidth = Math.max(1, h * 0.012)
    c.beginPath()
    c.roundRect(x + h * 0.07, y + h * 0.07, w - h * 0.14, h - h * 0.14, r * 0.5)
    c.stroke()
    c.fillStyle = ink.edge
    c.textBaseline = "top"
    c.font = `800 ${h * 0.34}px ${family}`
    c.fillText("100", x + h * 0.14, y + h * 0.13)
    c.font = `700 ${h * 0.085}px ${family}`
    c.fillText("EURO", x + h * 0.16, y + h * 0.5)
    c.textAlign = "right"
    c.textBaseline = "alphabetic"
    c.font = `800 ${h * 0.17}px ${family}`
    c.fillText("100", x + w - h * 0.14, y + h - h * 0.14)
    const cx = x + w * 0.62
    const cy = y + h * 0.45
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2
      c.beginPath()
      c.arc(
        cx + Math.cos(a) * h * 0.17,
        cy + Math.sin(a) * h * 0.17,
        h * 0.02,
        0,
        Math.PI * 2,
      )
      c.fill()
    }
    c.restore()
  }

  const build = () => {
    const box = root.getBoundingClientRect()
    if (!box.width || !box.height) return false
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    size = { width: box.width, height: box.height, dpr }
    for (const c of [canvas, paper, intact]) {
      c.width = Math.round(box.width * dpr)
      c.height = Math.round(box.height * dpr)
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    // A euro note is about 1.9 times as wide as it is high.
    const w = Math.round(Math.min(box.width * 0.86, box.height * 1.05, 560))
    const h = Math.round(w / 1.9)
    // The note and the label beneath it stand in the middle together.
    note = {
      x: Math.round((box.width - w) / 2),
      y: Math.round((box.height - h - 64) / 2),
      w,
      h,
      r: Math.round(h * 0.05),
    }
    readInk()
    const pc = paper.getContext("2d")
    if (!pc) return false
    pc.setTransform(dpr, 0, 0, dpr, 0, 0)
    pc.clearRect(0, 0, box.width, box.height)
    paint(pc)

    // One grain per cell, coloured like the note beneath it; the cells of
    // the kept strip at the left edge never come loose.
    cell = Math.max(2, Math.round(w / 170))
    const keptCols = Math.max(1, Math.round((w * keep) / cell))
    strip = keptCols * cell
    const pixels = pc.getImageData(0, 0, paper.width, paper.height).data
    // The dust is a shade darker than the note, so it shows on the panel.
    pc.fillStyle = ink.edge
    pc.fillRect(0, 0, 1, 1)
    const edge = pc.getImageData(0, 0, 1, 1).data
    pc.clearRect(0, 0, 1, 1)
    const next = random(2025)
    const index = new Map<string, number>()
    palette = []
    grains = []
    const cols = Math.ceil(w / cell)
    const rows = Math.ceil(h / cell)
    const speed = w / 460
    for (let r = 0; r < rows; r++) {
      // The edge is ragged: each row a little ahead or behind.
      const wave = Math.sin(r * 0.23) * 0.6 + Math.sin(r * 0.071 + 1.3) * 0.4
      for (let c = 0; c < cols; c++) {
        const gx = note.x + (c + 0.5) * cell
        const gy = note.y + (r + 0.5) * cell
        // Cells along the bottom and right edges are cut off; they take
        // their colour from inside the note.
        const sx = Math.min(gx, note.x + w - 1)
        const sy = Math.min(gy, note.y + h - 1)
        const px = Math.min(paper.width - 1, Math.round(sx * dpr))
        const py = Math.min(paper.height - 1, Math.round(sy * dpr))
        const i = (py * paper.width + px) * 4
        if (pixels[i + 3] < 40) continue
        const key = [0, 1, 2]
          .map((k) => {
            const value = pixels[i + k] * 0.7 + edge[k] * 0.3
            return (Math.round(value) >> 4) * 16 + 8
          })
          .join()
        let colour = index.get(key)
        if (colour === undefined) {
          colour = palette.length
          index.set(key, colour)
          palette.push(`rgb(${key})`)
        }
        // The edge slows down as it nears the kept strip.
        const v = clamp((cols - 1 - c) / Math.max(1, cols - keptCols))
        const s = 1 - Math.sqrt(1 - v)
        grains.push({
          x: gx,
          y: gy,
          colour,
          at:
            c < keptCols
              ? Number.POSITIVE_INFINITY
              : begin + s * run + wave * 0.1 * (1 - s) + next() * 0.06,
          vx: (20 + next() * 70) * speed,
          vy: -(8 + next() * 46) * speed,
          life: 0.9 + next() * (maxLife - 0.9),
          phase: next() * Math.PI * 2,
        })
      }
    }
    grains.sort((a, b) => a.at - b.at)
    return true
  }

  const reset = () => {
    const ic = intact.getContext("2d")
    if (!ic) return
    ic.setTransform(1, 0, 0, 1, 0, 0)
    ic.clearRect(0, 0, intact.width, intact.height)
    ic.drawImage(paper, 0, 0)
    ic.setTransform(size.dpr, 0, 0, size.dpr, 0, 0)
    loose = 0
    alive = 0
    swept = false
  }

  const place = () => {
    for (const label of labels) {
      const kept = label.dataset.noteLabel === "kept"
      label.style.left = `${kept ? note.x : note.x + (note.w + strip) / 2}px`
      label.style.top = `${kept ? note.y + note.h + 12 : note.y + note.h / 2}px`
    }
  }

  const draw = () => {
    frame = 0
    const t = animated ? (performance.now() - start) / 1000 : end
    const { width, height } = size
    context.clearRect(0, 0, width, height)
    // Cells that came loose leave the intact note.
    const ic = intact.getContext("2d")
    while (ic && loose < grains.length && grains[loose].at <= t) {
      const g = grains[loose]
      ic.clearRect(
        g.x - cell / 2 - 0.5,
        g.y - cell / 2 - 0.5,
        cell + 1,
        cell + 1,
      )
      loose++
    }
    while (alive < loose && grains[alive].at + maxLife < t) alive++
    // Once the edge has run its course, nothing of the note is left
    // beside the strip, not even the antialiased rim of its corners.
    if (ic && t >= red && !swept) {
      ic.clearRect(note.x + strip, 0, size.width, size.height)
      swept = true
    }
    const shown = ease(clamp(t / appear))
    context.globalAlpha = shown
    context.drawImage(intact, 0, 0, width, height)

    // The dust, one path per colour and fade, so it draws in few calls.
    const paths = new Map<number, Path2D>()
    for (let k = alive; k < loose; k++) {
      const g = grains[k]
      const age = t - g.at
      if (age >= g.life) continue
      const f = age / g.life
      const x =
        g.x +
        g.vx * age +
        40 * age * age +
        Math.sin(g.phase + age * 4) * 5 * age
      const y =
        g.y +
        g.vy * age -
        14 * age * age +
        Math.cos(g.phase + age * 3) * 4 * age
      const s = cell * (1 - f * 0.65)
      const fade = Math.min(3, Math.floor(f * 4))
      const key = g.colour * 4 + fade
      let path = paths.get(key)
      if (!path) {
        path = new Path2D()
        paths.set(key, path)
      }
      path.rect(x - s / 2, y - s / 2, s, s)
    }
    for (const [key, path] of paths) {
      context.globalAlpha = [0.95, 0.7, 0.45, 0.2][key % 4]
      context.fillStyle = palette[Math.floor(key / 4)]
      context.fill(path)
    }

    // What is left: the dashed outline of the note and the red strip.
    const done = ease(clamp((t - red) / 0.5))
    if (done > 0) {
      const { x, y, w, h, r } = note
      context.globalAlpha = done
      context.setLineDash([6, 5])
      context.lineWidth = 1.5
      context.strokeStyle = ink.line
      context.beginPath()
      context.roundRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5, r)
      context.stroke()
      context.setLineDash([])
      context.shadowColor = ink.red
      context.shadowBlur = 16 * done
      context.fillStyle = ink.red
      context.beginPath()
      context.roundRect(x, y, strip, h, [r, 0, 0, r])
      context.fill()
      context.shadowBlur = 0
    }
    context.globalAlpha = 1
    root.toggleAttribute("data-done", done > 0)
    if (on && animated && t < end) frame = requestAnimationFrame(draw)
  }

  const go = (animate: boolean) => {
    if (!build()) return
    on = true
    animated = animate && !motion.matches
    start = performance.now()
    reset()
    place()
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(draw)
  }

  // A new size or colour scheme: drawn again from the note, at the same
  // moment of the crumbling.
  const redraw = () => {
    if (!on || !build()) return
    reset()
    place()
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(draw)
  }

  let seen = ""
  new ResizeObserver(() => {
    const box = root.getBoundingClientRect()
    const key = `${Math.round(box.width)}x${Math.round(box.height)}`
    if (key === seen) return
    seen = key
    redraw()
  }).observe(root)
  new MutationObserver(redraw).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  })
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", redraw)
  document.fonts?.ready.then(redraw)

  return {
    go,
    // The scene fades out with the last picture still on it.
    hide: () => {
      on = false
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
