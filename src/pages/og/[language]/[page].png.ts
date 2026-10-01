import type { APIRoute, GetStaticPaths } from "astro"
import { seo } from "@/data/seo"
import type { Language, Page } from "@/lib/i18n"
import { createOgImage } from "@/lib/og-image"

// The page's lead illustration; English renders where the object has labels.
// Legal pages stay text-only.
const artwork: Partial<Record<Page, Record<Language, string>>> = {
  home: {
    de: "collection-review.webp",
    en: "collection-review-en.webp",
  },
  dossier: { de: "report-assets.webp", en: "report-assets-en.webp" },
  attacks: { de: "target-at-home.webp", en: "target-at-home-en.webp" },
  proceedings: {
    de: "collection-review.webp",
    en: "collection-review-en.webp",
  },
  participate: {
    de: "finance-the-case.webp",
    en: "finance-the-case-en.webp",
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
