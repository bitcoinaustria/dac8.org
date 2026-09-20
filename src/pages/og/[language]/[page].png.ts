import type { APIRoute, GetStaticPaths } from "astro"
import { seo } from "@/data/seo"
import { createOgImage } from "@/lib/og-image"

export const getStaticPaths: GetStaticPaths = () =>
  Object.entries(seo).flatMap(([page, translations]) =>
    Object.entries(translations).map(([language, metadata]) => ({
      params: { language, page },
      props: { lines: metadata.imageLines, accent: page === "home" },
    })),
  )

export const GET: APIRoute = async ({ props }) => {
  const image = await createOgImage(props.lines, props.accent)
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/png" },
  })
}
