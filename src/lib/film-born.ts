// The history film's one question: the reader's year of birth. It answers
// in a sentence how many of the film's ID and reporting duties applied
// then and apply today, lets the rules chapter start in that year, and
// draws the two states of the panopticon side by side as a picture to
// keep or share. The year stays in the page; nothing is stored or sent.

type Rule = { way: string; from: number; until?: number }

export type Born = {
  // The chosen year, once the reader has moved the control.
  year: () => number | null
}

export const createBorn = (
  film: HTMLElement,
  rules: Rule[],
  today: number,
  onChange: () => void,
): Born => {
  const root = film.querySelector<HTMLElement>("[data-born]")
  const input = root?.querySelector<HTMLInputElement>("[data-born-year]")
  const out = root?.querySelector<HTMLElement>("[data-born-out]")
  const says = root?.querySelector<HTMLElement>("[data-born-says]")
  const share = root?.querySelector<HTMLButtonElement>("[data-born-share]")
  if (!root || !input || !says) return { year: () => null }
  const en = document.documentElement.lang.startsWith("en")
  const ways = new Set(rules.map((rule) => rule.way)).size
  let chosen: number | null = null

  const at = (year: number) => {
    const active = rules.filter(
      (rule) =>
        rule.from <= year && year <= (rule.until ?? Number.POSITIVE_INFINITY),
    )
    return {
      rules: active.length,
      ways: new Set(active.map((rule) => rule.way)),
    }
  }
  const now = at(today)

  const sentence = (year: number) => {
    const then = at(year)
    const n = then.rules
    const k = then.ways.size
    if (en) {
      const first =
        n === 0
          ? `In ${year} none of the ID and reporting duties this film shows applied in Austria.`
          : `In ${year}, ${n === 1 ? "one" : n} of the ID and reporting duties this film shows applied in Austria, on ${k === 1 ? "one" : k} of the ${ways} ways money can take.`
      return `${first} Today ${now.rules} apply, on ${now.ways.size} of ${ways}.`
    }
    const first =
      n === 0
        ? `${year} galt in Österreich keine der Ausweis- und Meldepflichten, die dieser Film zeigt.`
        : `${year} ${n === 1 ? "galt" : "galten"} in Österreich ${n === 1 ? "eine" : n} der Ausweis- und Meldepflichten, die dieser Film zeigt, auf ${k === 1 ? "einem" : k} von ${ways} Wegen, die Geld nehmen kann.`
    return `${first} Heute gelten ${now.rules}, auf ${now.ways.size} von ${ways} Wegen.`
  }

  const update = () => {
    chosen = Number(input.value)
    if (out) out.textContent = String(chosen)
    says.textContent = sentence(chosen)
    root.toggleAttribute("data-chosen", true)
    if (share) share.hidden = false
    onChange()
  }
  input.addEventListener("input", update)

  // ---------- The picture ----------------------------------------------
  // The panopticon as it stood in a year: the base picture, and over it,
  // screen-blended as on the page, the light of every way with a rule by
  // then and of every authority admitted to the register.
  const base = film.querySelector<HTMLImageElement>(".ways-base")
  const lights = [...film.querySelectorAll<HTMLImageElement>(".way-light")]
  const watch = [
    ...film.querySelectorAll<HTMLImageElement>(".watch-light:not(.proposed)"),
  ]
  const panopticon = (year: number, width: number) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = Math.round((width * 9) / 10)
    const context = canvas.getContext("2d")
    if (!context || !base) return canvas
    context.drawImage(base, 0, 0, canvas.width, canvas.height)
    context.globalCompositeOperation = "screen"
    const covered = at(year).ways
    for (const light of lights)
      if (covered.has(light.dataset.way ?? ""))
        context.drawImage(light, 0, 0, canvas.width, canvas.height)
    for (const light of watch)
      if (Number(light.dataset.from) <= year)
        context.drawImage(light, 0, 0, canvas.width, canvas.height)
    return canvas
  }

  const picture = async (year: number) => {
    await document.fonts.ready
    const size = 1080
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext("2d")
    if (!context) return null
    const font = getComputedStyle(document.body).fontFamily
    const then = at(year)
    context.fillStyle = "#0b111c"
    context.fillRect(0, 0, size, size)
    const margin = 60
    const text = (
      value: string,
      x: number,
      y: number,
      style: string,
      color: string,
    ) => {
      context.font = `${style} ${font}`
      context.fillStyle = color
      context.fillText(value, x, y)
    }
    text(
      en
        ? "ID AND REPORTING DUTIES IN AUSTRIA"
        : "AUSWEIS- UND MELDEPFLICHTEN IN ÖSTERREICH",
      margin,
      110,
      "600 26px",
      "#9aa3af",
    )
    const count = (rulesAt: number, waysAt: number) =>
      en
        ? rulesAt === 0
          ? "none"
          : `${rulesAt}, on ${waysAt} of ${ways} ways`
        : rulesAt === 0
          ? "keine"
          : `${rulesAt}, auf ${waysAt} von ${ways} Wegen`
    text(
      `${year}: ${count(then.rules, then.ways.size)}`,
      margin,
      205,
      "700 68px",
      "#f2f4f7",
    )
    text(
      `${en ? "Today" : "Heute"}: ${count(now.rules, now.ways.size)}`,
      margin,
      295,
      "700 68px",
      "#ff5a55",
    )
    const width = (size - margin * 2 - 30) / 2
    const top = 380
    const pair: [number, string][] = [
      [year, String(year)],
      [today, en ? "Today" : "Heute"],
    ]
    pair.forEach(([when, label], k) => {
      const x = margin + k * (width + 30)
      const image = panopticon(when, 930)
      context.drawImage(image, x, top, width, (width * 9) / 10)
      text(label, x + 18, top + 52, "700 40px", "#f2f4f7")
    })
    text(
      en
        ? "One cell per way money can take. Red: a duty applies."
        : "Eine Zelle je Weg, den Geld nehmen kann. Rot: Es gilt eine Pflicht.",
      margin,
      top + (width * 9) / 10 + 62,
      "500 28px",
      "#c5cad2",
    )
    text(
      en ? "dac8.org/en/history" : "dac8.org/geschichte",
      margin,
      size - 62,
      "700 34px",
      "#f2f4f7",
    )
    return new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    )
  }

  share?.addEventListener("click", async () => {
    if (chosen === null) return
    const blob = await picture(chosen)
    if (!blob) return
    const file = new File([blob], `dac8-${chosen}.png`, { type: "image/png" })
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] })
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = file.name
    link.click()
    setTimeout(() => URL.revokeObjectURL(link.href), 10_000)
  })

  root.hidden = false
  return { year: () => chosen }
}
