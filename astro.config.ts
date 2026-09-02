import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://dac8.org",
  compressHTML: true,
  server: { port: Number(process.env.PORT) || 4321 },
  prefetch: { prefetchAll: true },
  integrations: [sitemap()],
})
