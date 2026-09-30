import type { APIRoute, GetStaticPaths } from "astro"
import { shareScenes } from "@/data/share"
import type { Language } from "@/lib/i18n"
import { createShareStory } from "@/lib/share-story"

const languages: Language[] = ["de", "en"]

// The lab's story exports with the scene's text set in at build time.
export const getStaticPaths: GetStaticPaths = () =>
  languages.flatMap((language) =>
    shareScenes.map((scene) => ({
      params: { language, scene: scene.id },
      props: {
        base: `src/assets/share/${language}/${scene.id}-story.jpg`,
        text: scene.text[language],
        note: scene.note?.[language],
      },
    })),
  )

export const GET: APIRoute = async ({ props }) => {
  const image = await createShareStory(props.base, props.text, props.note)
  return new Response(new Uint8Array(image), {
    headers: { "Content-Type": "image/jpeg" },
  })
}
