import { resolve } from "node:path"
import sharp, { type OverlayOptions } from "sharp"

const headlineFont = resolve("src/assets/fonts/og/IBMPlexSans-SemiBold.ttf")
const wordmarkFont = resolve("src/assets/fonts/og/IBMPlexSans-Regular.ttf")
const escapeXml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")

// With an illustration the headline takes the left half and the transparent
// render stands on the right, as in the artwork lab's share kit.
const layouts = {
  text: { size: 80, lineHeight: 100, maxWidth: 1024, top: 150 },
  artwork: { size: 54, lineHeight: 70, maxWidth: 548, top: 170 },
}

// Rasterize the bundled font at build time. No remote fonts or browser required.
export async function createOgImage(
  lines: string[],
  accentLastLine = false,
  artworkFile?: string,
) {
  if (lines.length < 1 || lines.length > 3) {
    throw new Error("Sharing cards require one to three headline lines")
  }
  const layout = artworkFile ? layouts.artwork : layouts.text
  const layers: OverlayOptions[] = []
  for (const [index, line] of lines.entries()) {
    const color =
      accentLastLine && index === lines.length - 1 ? "#e3000f" : "#202020"
    const rendered = await sharp({
      text: {
        text: `<span foreground="${color}" weight="semibold">${escapeXml(line)}</span>`,
        font: `IBM Plex Sans SemiBold ${layout.size}`,
        fontfile: headlineFont,
        rgba: true,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true })
    // Fail visibly when edited copy no longer fits, instead of clipping it.
    if (
      rendered.info.width > layout.maxWidth ||
      rendered.info.height > layout.lineHeight - 2
    ) {
      throw new Error(`Sharing headline does not fit: ${line}`)
    }
    layers.push({
      input: rendered.data,
      left: 88,
      top: layout.top + index * layout.lineHeight,
    })
  }
  if (artworkFile) {
    const art = await sharp(resolve(artworkFile))
      .resize({ width: 440, height: 460, fit: "inside" })
      .png()
      .toBuffer({ resolveWithObject: true })
    layers.push({
      input: art.data,
      left: 1200 - 64 - art.info.width,
      top: Math.round((630 - art.info.height) / 2),
    })
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
