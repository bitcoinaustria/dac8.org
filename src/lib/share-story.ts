import { resolve } from "node:path"
import sharp, { type OverlayOptions } from "sharp"

// Liberation Sans shares Helvetica's metrics, like the lab's headline type.
const bodyFont = resolve("src/assets/fonts/share/LiberationSans-Regular.ttf")
const escapeXml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

// Measured on the lab's 1080 × 1920 story export: flat #fcfcfc background,
// 72 px margins, footer rule at y = 1700.
const width = 1080
const height = 1920
const margin = 72
const background = { r: 252, g: 252, b: 252 }
const footerTop = 1700
const headlinePitch = 80
const capHeight = 50
const gap = 56

// Horizontal bands of the export that contain anything darker than the
// background: wordmark, headline lines, illustration (with its soft shadow),
// footer rule and footer line.
const findBands = (pixels: Buffer, threshold: number, minGap: number) => {
  const bands: { top: number; bottom: number }[] = []
  for (let y = 0; y < height; y++) {
    let ink = false
    for (let x = 0; x < width; x++) {
      if (pixels[y * width + x] < threshold) {
        ink = true
        break
      }
    }
    if (!ink) continue
    const last = bands.at(-1)
    if (last && y - last.bottom <= minGap) last.bottom = y
    else bands.push({ top: y, bottom: y })
  }
  return bands
}

const renderText = async (
  text: string,
  size: number,
  color: string,
  spacing: number,
) =>
  sharp({
    text: {
      // A word joiner after each slash keeps URLs such as dac8.org/mitmachen
      // on one line.
      text: `<span foreground="${color}">${escapeXml(text).replaceAll("/", "/\u2060")}</span>`,
      font: `Liberation Sans ${size}`,
      fontfile: bodyFont,
      width: width - 2 * margin,
      spacing,
      wrap: "word",
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true })

// Sets a paragraph under the headline and an optional "Im Bild" note under the
// illustration, moving the illustration down and shrinking it if it has to.
export async function createShareStory(
  baseFile: string,
  text: string,
  note?: string,
) {
  const base = sharp(resolve(baseFile))
  const { data: gray, info } = await base
    .clone()
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  if (info.width !== width || info.height !== height) {
    throw new Error(`Story export must be ${width} × ${height}: ${baseFile}`)
  }

  // The headline is everything between the wordmark and the illustration,
  // the first band taller than three lines of type. The paragraph keeps the
  // same distance from the last baseline, with or without descenders.
  const bands = findBands(gray, 246, 40).filter((b) => b.bottom < footerTop)
  const artIndex = bands.findIndex((b) => b.bottom - b.top > 300)
  if (artIndex < 2) throw new Error(`No headline or artwork in ${baseFile}`)
  const headline = bands[artIndex - 1]
  const headlineLines = Math.round(
    (headline.bottom - headline.top + 30) / headlinePitch,
  )
  const headlineBottom = headline.bottom
  const baseline =
    headline.top + (headlineLines - 1) * headlinePitch + capHeight
  const art = {
    top: bands[artIndex].top - 8,
    bottom: bands.at(-1)!.bottom + 8,
  }

  const paragraph = await renderText(text, 40, "#2b2b2b", 16)
  const paragraphTop = baseline + gap
  const artMin = paragraphTop + paragraph.info.height + gap

  const layers: OverlayOptions[] = [
    { input: paragraph.data, left: margin, top: paragraphTop },
  ]
  let artMax = footerTop - gap
  if (note) {
    const caption = await renderText(note, 26, "#6e6e6e", 6)
    const captionTop = footerTop - 40 - caption.info.height
    layers.push({ input: caption.data, left: margin, top: captionTop })
    artMax = captionTop - 40
  }

  const artHeight = art.bottom - art.top
  const scale = Math.min(1, (artMax - artMin) / artHeight)
  // Fail visibly when edited copy leaves too little room for the picture.
  if (scale < 0.72) {
    throw new Error(`Story text is too long for ${baseFile}`)
  }
  const band = await base
    .clone()
    .extract({ left: 0, top: art.top, width, height: artHeight })
    .resize({ width: Math.round(width * scale) })
    .png()
    .toBuffer({ resolveWithObject: true })
  layers.push({
    input: band.data,
    left: Math.round((width - band.info.width) / 2),
    top: Math.round(artMin + (artMax - artMin - band.info.height) / 2),
  })

  // Clear the old illustration first; the rest of the export stays as it is.
  const cleared = await sharp({
    create: {
      width,
      height: art.bottom - headlineBottom - 1,
      channels: 3,
      background,
    },
  })
    .png()
    .toBuffer()
  return base
    .composite([
      { input: cleared, left: 0, top: headlineBottom + 1 },
      ...layers,
    ])
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer()
}
