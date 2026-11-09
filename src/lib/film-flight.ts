// The camera's way from one still of the history film to the next: frames
// rendered in Blender (scripts/artwork/render-panopticon.py, flight1..6),
// drawn on a canvas by how far the reader has scrolled through the step.
// A flight's frames load when the film comes near it; until all are there
// the film shows the still at its end instead, as it does for readers who
// prefer reduced motion.

export type Flights = {
  load: (flight: number) => void
  ready: (flight: number) => boolean
  // Draws the flight at p, 0 to 1; false while its frames are loading.
  draw: (flight: number, p: number) => boolean
}

export const createFlights = (
  canvas: HTMLCanvasElement,
  counts: Record<string, number>,
  onReady: () => void,
): Flights => {
  const context = canvas.getContext("2d")
  const sets = new Map<number, { frames: HTMLImageElement[]; ready: boolean }>()
  let shown = ""

  const load = (flight: number) => {
    const count = counts[flight]
    if (!count || sets.has(flight)) return
    const set = { frames: [] as HTMLImageElement[], ready: false }
    sets.set(flight, set)
    let loaded = 0
    for (let k = 0; k < count; k++) {
      const frame = new Image()
      frame.decoding = "async"
      frame.onload = () => {
        loaded++
        if (loaded === count) {
          set.ready = true
          onReady()
        }
      }
      frame.src = `/film/flight${flight}/${String(k).padStart(2, "0")}.webp`
      set.frames.push(frame)
    }
  }

  const ready = (flight: number) => sets.get(flight)?.ready ?? false

  const draw = (flight: number, p: number) => {
    const set = sets.get(flight)
    if (!set?.ready || !context) return false
    // The frame nearest to p; fading between two would show both at once.
    const k = Math.round(Math.min(1, Math.max(0, p)) * (set.frames.length - 1))
    const key = `${flight}:${k}`
    if (key === shown) return true
    shown = key
    context.drawImage(set.frames[k], 0, 0, canvas.width, canvas.height)
    return true
  }

  return { load, ready, draw }
}
