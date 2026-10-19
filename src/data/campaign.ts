// The complaint was filed with the Data Protection Authority when the press
// briefing of October 2026 went out with this site. Update these statements
// only once the next step has actually happened, and never publish tentative
// dates for decisions.
export const campaignStatus = {
  de: {
    label: "Beschwerde eingebracht",
    text: "Auf Initiative von Bitcoin Austria ist eine Beschwerde bei der österreichischen Datenschutzbehörde eingebracht. Unser Ziel ist eine Klärung der grundrechtlichen Fragen bis vor den Europäischen Gerichtshof.",
  },
  en: {
    label: "Complaint filed",
    text: "At Bitcoin Austria’s initiative, a complaint has been filed with the Austrian Data Protection Authority. Our aim is to pursue the fundamental-rights questions all the way to the Court of Justice of the European Union.",
  },
} as const

// The route the case can take. `currentStage` marks where the campaign stands
// today; move it only once the next step has actually happened. The last
// station stays conditional: referrals are decided by the courts.
export const currentStage = 1

export const legalRoute = {
  de: [
    {
      title: "Anbieter",
      text: "ein Kunde beanstandet, wie sein Anbieter Daten für DAC8 verarbeitet",
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
      text: "a customer objects to how their provider processes data for DAC8",
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
