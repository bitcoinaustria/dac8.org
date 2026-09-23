// Update these public statements when the filing is confirmed. Do not publish
// tentative filing dates or describe preparation as an already filed case.
export const campaignStatus = {
  de: {
    label: "Verfahren in Vorbereitung",
    text: "Bitcoin Austria bereitet ein Verfahren bei der österreichischen Datenschutzbehörde vor. Unser Ziel ist eine Klärung der grundrechtlichen Fragen bis vor den Europäischen Gerichtshof.",
  },
  en: {
    label: "Preparing the case",
    text: "Bitcoin Austria is preparing proceedings before the Austrian Data Protection Authority. Our aim is to pursue the fundamental-rights questions all the way to the Court of Justice of the European Union.",
  },
} as const

// The route the case can take. `currentStage` marks where the campaign stands
// today; move it only once the next step has actually happened. The last
// station stays conditional: referrals are decided by the courts.
export const currentStage = 0

export const legalRoute = {
  de: [
    {
      title: "Anbieter",
      text: "wir dokumentieren, wie ein Anbieter Daten für DAC8 verarbeitet",
    },
    {
      title: "Datenschutzbehörde",
      text: "prüft die Beschwerde gegen den Anbieter",
    },
    {
      title: "Bundesverwaltungsgericht",
      text: "kann die Entscheidung der Datenschutzbehörde überprüfen",
    },
    {
      title: "VfGH / EuGH",
      text: "können das österreichische Gesetz bzw. die EU-Richtlinie prüfen",
    },
  ],
  en: [
    {
      title: "Provider",
      text: "we document how a provider processes data for DAC8",
    },
    {
      title: "Data Protection Authority",
      text: "examines the complaint against the provider",
    },
    {
      title: "Federal Administrative Court",
      text: "can review the Data Protection Authority’s decision",
    },
    {
      title: "Constitutional Court / CJEU",
      text: "can review national law or the EU directive, respectively",
    },
  ],
} as const
