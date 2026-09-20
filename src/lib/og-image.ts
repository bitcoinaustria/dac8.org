import { resolve } from "node:path"
import sharp, { type OverlayOptions } from "sharp"

const headlineFont = resolve("src/assets/fonts/og/IBMPlexSans-SemiBold.ttf")
const wordmarkFont = resolve("src/assets/fonts/og/IBMPlexSans-Regular.ttf")
const escapeXml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

// Rasterize the bundled font at build time. No remote fonts or browser required.
export async function createOgImage(lines: string[], accentLastLine = false) {
  if (lines.length < 1 || lines.length > 3) {
    throw new Error("Sharing cards require one to three headline lines")
  }
  const layers: OverlayOptions[] = []
  for (const [index, line] of lines.entries()) {
    const color =
      accentLastLine && index === lines.length - 1 ? "#e3000f" : "#202020"
    const rendered = await sharp({
      text: {
        text: `<span foreground="${color}" weight="semibold">${escapeXml(line)}</span>`,
        font: "IBM Plex Sans SemiBold 80",
        fontfile: headlineFont,
        rgba: true,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true })
    // Fail visibly when edited copy no longer fits, instead of clipping it.
    if (rendered.info.width > 1024 || rendered.info.height > 98) {
      throw new Error(`Sharing headline does not fit: ${line}`)
    }
    layers.push({ input: rendered.data, left: 88, top: 150 + index * 100 })
  }
  const wordmark = await sharp({
    text: {
      text: '<span foreground="#202020">dac8<span foreground="#e3000f">.org</span></span>',
      font: "IBM Plex Sans 42",
      fontfile: wordmarkFont,
      rgba: true,
    },
  })
    .png()
    .toBuffer()
  layers.push({ input: wordmark, left: 88, top: 510 })

  return sharp({
    create: { width: 1200, height: 630, channels: 3, background: "#fcfcfc" },
  })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toBuffer()
}
