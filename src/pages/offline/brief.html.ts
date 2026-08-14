import formHtml from "@/generators/brief-form.html?raw"
import briefJs from "@/generators/brief.js?raw"
import { offlinePage } from "@/generators/offline"
import type { APIRoute } from "astro"

export const GET: APIRoute = () =>
  new Response(
    offlinePage({
      title: "Brief an deine Abgeordneten im EU-Parlament",
      intro:
        "Erzeugt eine E-Mail an Mitglieder des Petitionsausschusses des Europäischen Parlaments mit der Bitte, die Petition gegen die anlasslose Krypto-Datenerfassung (DAC8) aufzugreifen.",
      formHtml,
      js: briefJs,
      canonical: "https://dac8.org/brief/",
    }),
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  )
