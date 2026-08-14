import formHtml from "@/generators/beschwerde-form.html?raw"
import beschwerdeJs from "@/generators/beschwerde.js?raw"
import { offlinePage } from "@/generators/offline"
import type { APIRoute } from "astro"

export const GET: APIRoute = () =>
  new Response(
    offlinePage({
      title: "DSGVO-Beschwerde gegen die Krypto-Meldepflicht",
      intro:
        "Erzeugt eine Beschwerde nach Art. 77 DSGVO iVm § 24 DSG gegen die anlasslose Massenerfassung von Krypto-Daten (DAC8 / Krypto-MPfG), gerichtet an die österreichische Datenschutzbehörde.",
      formHtml,
      js: beschwerdeJs,
      canonical: "https://dac8.org/beschwerde/",
    }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  )
