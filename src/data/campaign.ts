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
// station stays conditional: referrals are decided by the courts. `text`
// names each station's role; `detail` adds what we expect there and appears
// only on the proceedings page.
export const currentStage = 1

export const legalRoute = {
  de: [
    {
      title: "Anbieter",
      text: "ein Kunde beanstandet, wie sein Anbieter Daten für DAC8 verarbeitet",
      detail:
        "Ein Kunde beanstandet, wie sein Anbieter seine Daten für DAC8 verarbeitet, und bringt im Oktober 2026 Beschwerde ein.",
    },
    {
      title: "Datenschutzbehörde",
      text: "prüft die Beschwerde gegen den Anbieter",
      detail:
        "Sie ist an die Gesetze gebunden, wir rechnen deshalb mit einer Abweisung. Sie kann aber ermitteln, ob unsere Befürchtungen begründet sind.",
    },
    {
      title: "Bundesverwaltungsgericht",
      text: "kann die Entscheidung der Datenschutzbehörde überprüfen",
      detail:
        "Gegen die Entscheidung der Behörde folgt eine Beschwerde an dieses Gericht. Es überprüft sie.",
    },
    {
      title: "VfGH / EuGH",
      text: "können das österreichische Gesetz bzw. die EU-Richtlinie prüfen",
      detail:
        "Danach folgt der Verfassungsgerichtshof. Er kann das Gesetz prüfen und die EU-Richtlinie dem Europäischen Gerichtshof vorlegen. Ob er das tut, entscheidet er.",
    },
  ],
  en: [
    {
      title: "Provider",
      text: "a customer objects to how their provider processes data for DAC8",
      detail:
        "A customer objects to how their provider processes their data for DAC8 and files a complaint in October 2026.",
    },
    {
      title: "Data Protection Authority",
      text: "examines the complaint against the provider",
      detail:
        "It is bound by the law, so we expect it to dismiss the complaint. It can, however, investigate whether our concerns are justified.",
    },
    {
      title: "Federal Administrative Court",
      text: "can review the Data Protection Authority’s decision",
      detail:
        "An appeal against the authority’s decision comes next. The court reviews it.",
    },
    {
      title: "Constitutional Court / CJEU",
      text: "can review national law or the EU directive, respectively",
      detail:
        "Then comes the Constitutional Court. It can review the law and refer the EU directive to the Court of Justice of the EU. Whether it does so is for the court to decide.",
    },
  ],
} as const
