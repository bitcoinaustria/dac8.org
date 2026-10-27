import type { APIRoute, GetStaticPaths } from "astro"
import { seo } from "@/data/seo"
import type { Language, Page } from "@/lib/i18n"
import { createOgImage } from "@/lib/og-image"

// The page's lead illustration; English renders where the object has labels.
// Pages without one in their hero (home, arguments, participation, legal
// pages) stay text-only, so no picture appears on two pages' cards.
const artwork: Partial<Record<Page, Record<Language, string>>> = {
  dossier: { de: "report-assets.webp", en: "report-assets-en.webp" },
  attacks: { de: "target-at-home.webp", en: "target-at-home-en.webp" },
  proceedings: {
    de: "collection-review.webp",
    en: "collection-review-en.webp",
  },
}

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(seo).flatMap(([page, translations]) =>
    Object.entries(translations).map(([language, metadata]) => {
      const file = artwork[page as Page]?.[language as Language]
      return {
        params: { language, page },
        props: {
          lines: metadata.imageLines,
          accent: page === "home" || page === "history" || file !== undefined,
          artwork: file && `src/assets/artwork/${file}`,
        },
      }
    }),
  )

export const GET: APIRoute = async ({ props }) => {
  const image = await createOgImage(props.lines, props.accent, props.artwork)
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  })
}
