import { defineConfig, envField } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://dac8.org",
  compressHTML: true,
  server: { port: Number(process.env.PORT) || 4321 },
  prefetch: { prefetchAll: true },
  env: {
    schema: {
      // "webgl" draws artworks that have a model live in the browser, with
      // the render as fallback; "render" shows only the Blender renders.
      ARTWORK_MODE: envField.enum({
        context: "server",
        access: "public",
        values: ["webgl", "render"],
        default: "render",
      }),
    },
  },
  integrations: [
    sitemap({
      filter: (page) =>
        !new URL(page).pathname.startsWith("/og/") && !page.endsWith("/404/"),
    }),
  ],
})
