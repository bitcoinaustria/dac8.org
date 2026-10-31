// The last step of the history film (src/components/RuleFilm.astro) drawn
// on a canvas: a 100-euro note with a criminal on it, like the ones the
// film opens with. The camera moves in on its left edge, where a red
// dashed line marks the share the state confiscates; the note tears along
// it from the top, and as the camera pulls back the strip falls away and
// turns red, while the rest, everything but two euros, stays with the
// criminal.

// In seconds: the note appears, the camera moves in, the line is drawn,
// the tear runs down it, the two pieces part as the camera pulls back.
const appear = 0.5
const push = { at: 0.45, span: 0.8 }
const mark = { at: 1.05, span: 0.5 }
const tear = { at: 1.6, span: 0.75 }
const part = { at: 2.4, span: 0.9 }
const pull = { at: 2.35, span: 1 }
const end = Math.max(part.at + part.span, pull.at + pull.span)

const clamp = (t: number) => Math.min(1, Math.max(0, t))
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const easeOut = (t: number) => 1 - (1 - t) ** 3
const overshoot = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2

// A seeded random number, so the note tears the same way on every visit.
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
  const ink = { paper: "", edge: "", red: "", shadow: "" }
  const readInk = () => {
    for (const name of Object.keys(ink) as (keyof typeof ink)[]) {
      const swatch = root.querySelector<HTMLElement>(`[data-note-${name}]`)
      if (swatch) ink[name] = getComputedStyle(swatch).color
    }
  }
  const labels = [...root.querySelectorAll<HTMLElement>("[data-note-label]")]

  // The note whole, its two pieces with their torn edges, the strip in
  // red, and the shadows the pieces cast, each drawn once per size.
  const canvases = () => document.createElement("canvas")
  const whole = canvases()
  const strip = canvases()
  const rest = canvases()
  const stripRed = canvases()
  const restShadow = canvases()
  const stripShadow = canvases()
  let size = { width: 0, height: 0, dpr: 1 }
  // How far the camera moves in, and the pixels per CSS pixel the pieces
  // are drawn with, so they stay sharp close up.
  let close = 1
  let res = 1
  let note = { x: 0, y: 0, w: 0, h: 0, r: 0 }
  // Where the tear runs, per row of `row` pixels, and the widths of the
  // strip as cut and as drawn with its ragged edge.
  const row = 2
  let edge: number[] = []
  let cut = 0
  let stripWidth = 0
  let pad = 0
  let on = false
  let animated = false
  let start = 0
  let frame = 0

  // The note: a picture of one (data-note-image) once it has loaded, a
  // plain drawn one until then.
  const picture = new Image()
  let ready = false
  const paint = (c: CanvasRenderingContext2D) => {
    const { w, h, r } = note
    const family = getComputedStyle(root).fontFamily
    c.save()
    c.beginPath()
    c.roundRect(0, 0, w, h, r)
    c.clip()
    if (ready) {
      c.drawImage(picture, 0, 0, w, h)
      c.restore()
      return
    }
    c.fillStyle = ink.paper
    c.fillRect(0, 0, w, h)
    const light = c.createLinearGradient(0, 0, w, h)
    light.addColorStop(0, "rgb(255 255 255 / 0.28)")
    light.addColorStop(0.55, "rgb(255 255 255 / 0)")
    light.addColorStop(1, "rgb(0 0 0 / 0.14)")
    c.fillStyle = light
    c.fillRect(0, 0, w, h)
    c.strokeStyle = ink.edge
    c.lineWidth = Math.max(1, h * 0.012)
    c.beginPath()
    c.roundRect(h * 0.07, h * 0.07, w - h * 0.14, h - h * 0.14, r * 0.5)
    c.stroke()
    c.fillStyle = ink.edge
    c.textBaseline = "top"
    c.font = `800 ${h * 0.34}px ${family}`
    c.fillText("100", h * 0.14, h * 0.13)
    c.font = `700 ${h * 0.085}px ${family}`
    c.fillText("EURO", h * 0.16, h * 0.5)
    c.textAlign = "right"
    c.textBaseline = "alphabetic"
    c.font = `800 ${h * 0.17}px ${family}`
    c.fillText("100", w - h * 0.14, h - h * 0.14)
    c.restore()
  }

  // The outlines of the two pieces, in the note's own coordinates.
  const stripPath = (c: CanvasRenderingContext2D) => {
    c.beginPath()
    c.moveTo(0, 0)
    edge.forEach((x, k) => c.lineTo(x, Math.min(note.h, k * row)))
    c.lineTo(0, note.h)
    c.closePath()
  }
  const restPath = (c: CanvasRenderingContext2D) => {
    c.beginPath()
    c.moveTo(note.w, 0)
    c.lineTo(note.w, note.h)
    for (let k = edge.length - 1; k >= 0; k--)
      c.lineTo(edge[k], Math.min(note.h, k * row))
    c.closePath()
  }
  // Torn paper shows its pale core along the edge, with a few fibres.
  const fringe = (c: CanvasRenderingContext2D, side: number) => {
    const next = random(side > 0 ? 7 : 11)
    c.strokeStyle = "rgb(250 248 236 / 0.92)"
    c.lineWidth = 1.3
    c.beginPath()
    edge.forEach((x, k) => {
      const y = Math.min(note.h, k * row)
      if (k) c.lineTo(x + side * 0.5, y)
      else c.moveTo(x + side * 0.5, y)
    })
    c.stroke()
    c.lineWidth = 0.7
    c.beginPath()
    edge.forEach((x, k) => {
      if (next() > 0.35) return
      const y = Math.min(note.h, k * row)
      c.moveTo(x, y)
      c.lineTo(x - side * (0.6 + next() * 1.6), y + (next() - 0.5) * 2)
    })
    c.stroke()
  }
  const sized = (target: HTMLCanvasElement, w: number, h: number) => {
    target.width = Math.ceil(w * res)
    target.height = Math.ceil(h * res)
    const c = target.getContext("2d")
    c?.setTransform(res, 0, 0, res, 0, 0)
    return c
  }
  // A soft shadow alone: the shape is drawn far off the canvas and only
  // its shadow falls on it.
  const shade = (
    target: HTMLCanvasElement,
    width: number,
    path: (c: CanvasRenderingContext2D) => void,
  ) => {
    const c = sized(target, width + pad * 2, note.h + pad * 2)
    if (!c) return
    const far = (width + pad * 2) * 2
    c.translate(pad - far, pad)
    c.shadowColor = ink.shadow
    c.shadowBlur = note.h * 0.06 * res
    c.shadowOffsetX = far * res
    c.fillStyle = "#000"
    path(c)
    c.fill()
  }

  const build = () => {
    const box = root.getBoundingClientRect()
    if (!box.width || !box.height) return false
    readInk()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    size = { width: box.width, height: box.height, dpr }
    canvas.width = Math.round(box.width * dpr)
    canvas.height = Math.round(box.height * dpr)
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    // A euro note is about 1.9 times as wide as it is high; a picture
    // keeps its own proportions. Room is left for the pieces to part.
    const ratio = ready ? picture.naturalWidth / picture.naturalHeight : 1.9
    const w = Math.round(Math.min(box.width * 0.82, box.height * 1.05, 560))
    const h = Math.round(w / ratio)
    // The note and the labels beneath it stand in the middle together.
    note = {
      x: Math.round((box.width - w) / 2),
      y: Math.round((box.height - h - 64) / 2),
      w,
      h,
      r: Math.round(h * 0.025),
    }
    pad = Math.ceil(h * 0.15)
    // Close up, the note nearly fills the height.
    close = Math.max(1, Math.min(1.9, (box.height * 0.92) / h))
    res = dpr * close

    // The tear: ragged, a little to either side of the cut.
    cut = Math.max(2, w * keep)
    const amp = Math.max(0.7, cut * 0.16)
    const next = random(2025)
    // Paper tears in irregular swings with a fine fray on top: a random
    // value every few rows, eased from one to the next, plus a little
    // noise per row.
    const knots = Array.from(
      { length: Math.ceil(h / row / 4) + 2 },
      () => next() * 2 - 1,
    )
    edge = []
    for (let k = 0; k * row < h + row; k++) {
      const i = Math.floor(k / 4)
      const f = (1 - Math.cos(((k % 4) / 4) * Math.PI)) / 2
      const swing = knots[i] + (knots[i + 1] - knots[i]) * f
      edge.push(cut + amp * (swing * 0.75 + (next() * 2 - 1) * 0.25))
    }
    stripWidth = Math.ceil(cut + amp + 2)

    const wc = sized(whole, w, h)
    if (!wc) return false
    paint(wc)
    const piece = (
      target: HTMLCanvasElement,
      width: number,
      path: (c: CanvasRenderingContext2D) => void,
      side: number,
    ) => {
      const c = sized(target, width, h)
      if (!c) return
      c.save()
      path(c)
      c.clip()
      c.drawImage(whole, 0, 0, w, h)
      fringe(c, side)
      c.restore()
    }
    piece(strip, stripWidth, stripPath, -1)
    piece(rest, w, restPath, 1)
    const rc = sized(stripRed, stripWidth, h)
    if (rc) {
      rc.fillStyle = ink.red
      stripPath(rc)
      rc.fill()
    }
    shade(restShadow, w, restPath)
    shade(stripShadow, stripWidth, stripPath)
    return true
  }

  // Where the pieces end up: the strip down and to the left, tilted, the
  // rest a little to the right.
  const finalStrip = () => ({
    x: -note.w * 0.035,
    y: note.h * 0.06,
    angle: -0.12,
  })
  const finalRest = () => note.w * 0.03

  const place = () => {
    for (const label of labels) {
      const kept = label.dataset.noteLabel === "kept"
      label.style.left = `${kept ? note.x + finalStrip().x : note.x + note.w + finalRest()}px`
      label.style.top = `${note.y + note.h + note.h * 0.06 + 14}px`
    }
  }

  const draw = () => {
    frame = 0
    const t = animated ? (performance.now() - start) / 1000 : end
    const { width, height } = size
    const { x, w, h } = note
    const { dpr } = size
    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    context.clearRect(0, 0, width, height)
    // Close up, the cut stands a fifth into the picture and the note in
    // the middle of its height. The camera zooms about the one point that
    // keeps its place on screen between the two shots.
    const zoom =
      1 +
      (close - 1) *
        (ease(clamp((t - push.at) / push.span)) -
          ease(clamp((t - pull.at) / pull.span)))
    const fixed = (now: number, then: number) =>
      close > 1 ? (then - now * close) / (1 - close) : 0
    const focus = {
      x: fixed(x + cut, width * 0.2),
      y: fixed(note.y + h / 2, height / 2),
    }
    context.setTransform(
      dpr * zoom,
      0,
      0,
      dpr * zoom,
      dpr * focus.x * (1 - zoom),
      dpr * focus.y * (1 - zoom),
    )
    const shown = ease(clamp(t / appear))
    const y = note.y + (1 - shown) * 10
    const torn = clamp((t - tear.at) / tear.span)
    const tip = h * ease(torn)
    const parted = clamp((t - part.at) / part.span)
    const peel = 0.08
    context.globalAlpha = shown

    // The rest: still while the tear runs, then a little to the right.
    const restX = x + finalRest() * overshoot(parted)
    context.drawImage(
      restShadow,
      restX - pad,
      y - pad + h * 0.03,
      w + pad * 2,
      h + pad * 2,
    )
    if (torn <= 0) {
      context.drawImage(whole, x, y, w, h)
    } else if (parted <= 0) {
      // Above the tip of the tear the pieces are apart, below it whole.
      context.save()
      context.beginPath()
      context.rect(x, y + tip, w, h - tip + 1)
      context.clip()
      context.drawImage(whole, x, y, w, h)
      context.restore()
      context.save()
      context.beginPath()
      context.rect(x, y, w, tip)
      context.clip()
      context.drawImage(rest, x, y, w, h)
      context.restore()
      // The strip peels away from the tip, row by row.
      for (let top = 0; top < tip; top += row) {
        const rows = Math.min(row, tip - top)
        context.drawImage(
          strip,
          0,
          top * res,
          strip.width,
          rows * res,
          x - peel * (tip - top),
          y + top,
          stripWidth,
          rows,
        )
      }
      // A red glow where the paper gives.
      const at = edge[Math.min(edge.length - 1, Math.round(tip / row))] ?? cut
      const glow = context.createRadialGradient(
        x + at,
        y + tip,
        0,
        x + at,
        y + tip,
        cut * 0.6 + 6,
      )
      glow.addColorStop(0, ink.red)
      glow.addColorStop(1, "transparent")
      context.globalAlpha = shown * Math.sin(Math.PI * torn)
      context.fillStyle = glow
      context.fillRect(
        x + at - cut - 8,
        y + tip - cut - 8,
        cut * 2 + 16,
        cut * 2 + 16,
      )
      context.globalAlpha = shown
    } else {
      context.drawImage(rest, restX, y, w, h)
    }

    // The red dashed line along the cut: drawn down before the tear, gone
    // where the paper has torn.
    const drawn = ease(clamp((t - mark.at) / mark.span))
    if (drawn > 0 && parted <= 0) {
      context.save()
      // Red dashes on a pale line, so they show on any part of the note.
      context.beginPath()
      context.moveTo(x + cut, y + tip)
      context.lineTo(x + cut, y + Math.max(tip, h * drawn))
      context.lineWidth = 3.2
      context.strokeStyle = "rgb(255 255 255 / 0.8)"
      context.stroke()
      context.setLineDash([5, 4])
      context.lineWidth = 1.8
      context.strokeStyle = ink.red
      context.stroke()
      context.restore()
    }

    // The strip, once free: it falls away, tilts, straightens out of its
    // peel and turns red.
    if (parted > 0) {
      const k = easeOut(parted)
      const goal = finalStrip()
      const shear = peel * (1 - k)
      const pivot = { x: x + stripWidth / 2, y: y + h }
      const turn = goal.angle * k
      const dx = goal.x * k
      const dy = goal.y * overshoot(parted)
      const red = clamp((t - part.at) / 0.5)
      const set = () => {
        context.translate(pivot.x + dx, pivot.y + dy)
        context.rotate(turn)
        // Leaning from the bottom: above the pivot, y is negative, so the
        // top moves left by the shear times its height.
        context.transform(1, 0, shear, 1, 0, 0)
        context.translate(-stripWidth / 2, -h)
      }
      context.save()
      set()
      context.globalAlpha = shown * k
      context.drawImage(
        stripShadow,
        -pad,
        -pad + h * 0.03,
        stripWidth + pad * 2,
        h + pad * 2,
      )
      context.globalAlpha = shown
      context.drawImage(strip, 0, 0, stripWidth, h)
      context.globalAlpha = shown * ease(red) * 0.85
      context.shadowColor = ink.red
      context.shadowBlur = 14 * ease(red)
      context.drawImage(stripRed, 0, 0, stripWidth, h)
      context.restore()
    }
    context.globalAlpha = 1
    root.toggleAttribute("data-done", t >= end - 0.3)
    if (on && animated && t < end) frame = requestAnimationFrame(draw)
  }

  const go = (animate: boolean) => {
    if (!build()) return
    on = true
    animated = animate && !motion.matches
    start = performance.now()
    place()
    cancelAnimationFrame(frame)
    frame = requestAnimationFrame(draw)
  }

  // A new size or colour scheme: drawn again from the note, at the same
  // moment of the tear.
  const redraw = () => {
    if (!on || !build()) return
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
  const source = root.dataset.noteImage
  if (source) {
    picture.src = source
    picture
      .decode()
      .then(() => {
        ready = true
        redraw()
      })
      .catch(() => {})
  }

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
