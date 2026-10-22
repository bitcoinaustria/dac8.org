// Germany in the history film (src/components/RuleFilm.astro): suspicion
// reports and convictions for money laundering as a race from the same
// start. Both columns stand at ×1 in the first year with both counts;
// then the years run and each grows as its count did. The scale pulls
// back as the reports outgrow it, so the convictions, which grow too, sink
// beside them. The two counts are compared as growth only: convictions
// cannot be traced to particular reports.

type Race = {
  years: number[]
  // Each count per year as a multiple of the first year; null where a
  // year has no count yet.
  reports: (number | null)[]
  convictions: (number | null)[]
  values: { reports: (number | null)[]; convictions: (number | null)[] }
  locale: string
}

const run = 3.6
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)
const clamp = (t: number) => Math.min(1, Math.max(0, t))

export const createRace = (root: HTMLElement) => {
  const race: Race = JSON.parse(root.dataset.race ?? "{}")
  if (!race.years?.length) return null
  const motion = matchMedia("(prefers-reduced-motion: reduce)")
  const format = new Intl.NumberFormat(race.locale)
  const yearEl = root.querySelector<HTMLElement>("[data-race-year]")
  const base = root.querySelector<HTMLElement>("[data-race-base]")
  const cols = {
    reports: root.querySelector<HTMLElement>('[data-race-col="reports"]'),
    convictions: root.querySelector<HTMLElement>(
      '[data-race-col="convictions"]',
    ),
  }
  const first = race.years[0]
  const last = race.years[race.years.length - 1]
  let start = 0
  let frame = 0

  // A count at a fractional year: between two years it moves on in a
  // straight line; after its last year it holds.
  const at = (series: (number | null)[], year: number) => {
    const k = Math.min(series.length - 1, Math.floor(year - first))
    let lastKnown = k
    while (lastKnown > 0 && series[lastKnown] === null) lastKnown--
    const now = series[lastKnown] ?? 1
    const next = series[k + 1]
    if (lastKnown !== k || next == null) return { value: now, index: lastKnown }
    const f = year - first - k
    return { value: now + (next - now) * f, index: k }
  }
  const times = (k: number) =>
    `×${format.format(k >= 10 ? Math.round(k) : Math.round(k * 10) / 10)}`

  const draw = () => {
    frame = 0
    const t = motion.matches ? run : (performance.now() - start) / 1000
    const year = first + (last - first) * ease(clamp((t - 0.5) / run))
    const r = at(race.reports, year)
    const c = at(race.convictions, year)
    // The scale: room for the taller column, and never less than ×3, so
    // the start reads as two equal columns.
    const top = Math.max(3, r.value * 1.06, c.value * 1.06)
    for (const [name, now] of [
      ["reports", r],
      ["convictions", c],
    ] as const) {
      const col = cols[name]
      if (!col) continue
      col.style.setProperty("--h", `${((now.value / top) * 100).toFixed(2)}%`)
      const label = col.querySelector<HTMLElement>("[data-race-times]")
      if (label) label.textContent = times(now.value)
      const value = col.querySelector<HTMLElement>("[data-race-value]")
      const count = race.values[name][now.index]
      if (value && count != null) value.textContent = format.format(count)
      const when = col.querySelector<HTMLElement>("[data-race-when]")
      if (when) when.textContent = String(race.years[now.index])
    }
    base?.style.setProperty("--h", `${((1 / top) * 100).toFixed(2)}%`)
    if (yearEl) yearEl.textContent = String(Math.floor(year + 1e-6))
    root.toggleAttribute("data-done", t >= run + 0.5)
    if (t < run + 0.6) frame = requestAnimationFrame(draw)
  }

  return {
    go: () => {
      cancelAnimationFrame(frame)
      start = performance.now()
      frame = requestAnimationFrame(draw)
    },
    hide: () => {
      cancelAnimationFrame(frame)
      frame = 0
    },
  }
}
