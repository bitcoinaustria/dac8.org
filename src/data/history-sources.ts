import {
  accountsSources,
  unexplained,
  reportingBenefit,
  reportingCostSources,
  type Source,
} from "@/data/history-evidence"
import {
  admissions as gapAdmissions,
  apparatus,
  bankPackage,
  corrected,
  estimates,
  reportSources,
} from "@/data/history-gap"
import { leaks } from "@/data/leaks"
import { steps } from "@/data/overregulation"
import { type Language, pathFor } from "@/lib/i18n"

// The history page cites the film and the balance by number, [3], and
// lists every source once at the end of the page. The numbers follow the
// order in which a reader meets the sources: the film's steps, then the
// balance's four fields. A source cited again keeps its number. Where the
// story needs the name, such as a quotation, the text names it as well.
// The charts to check, folded away below, keep their own source lists.
export type HistorySource = {
  n: number
  label: string
  href: string
  // The site a link leads to, so readers see what kind of source it is.
  host?: string
}

const bulgaria = leaks.find((leak) => leak.id === "bulgaria")

// What each field of the balance cites, in its order.
export const balanceSources = (language: Language) => ({
  costs: reportingCostSources,
  benefit: reportingBenefit.sources.slice(0, 1),
  admission: reportingBenefit.sources.slice(1),
  captured: accountsSources,
  cases: [
    {
      label: {
        de: "Alle belegten Fälle von Datenlecks mit Primärquellen",
        en: "Every documented data leak with its primary sources",
      },
      href: pathFor("leaks", language),
    },
  ] satisfies Source[],
  // The case's first source, named so that the list says what it is.
  bulgaria: (bulgaria?.sources.slice(0, 1) ?? []).map((source) => ({
    ...source,
    label: {
      de: "OECD Global Forum, Erklärung zum Datenleck bei Bulgariens Steuerbehörde, 2019",
      en: "OECD Global Forum, statement on the data breach at Bulgaria’s tax authority, 2019",
    },
  })) satisfies Source[],
  unexplained: [unexplained.sources.germany, unexplained.sources.austria],
  withheld: unexplained.sources.law,
})

// The bracket as one string, so that formatting the markup cannot put
// spaces inside it.
const escape = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;")
export const refsHtml = (sources: HistorySource[], language: Language) => {
  const word = language === "en" ? "Source" : "Quelle"
  const links = sources.map(
    (source) =>
      `<a href="#quelle-${source.n}" title="${escape(source.label)}" aria-label="${escape(`${word} ${source.n}: ${source.label}`)}">${source.n}</a>`,
  )
  return `[${links.join(", ")}]`
}

export const historySources = (language: Language) => {
  const list: HistorySource[] = []
  const numbers = new Map<string, number>()
  const add = (source: Source) => {
    if (numbers.has(source.href)) return
    const n = list.length + 1
    numbers.set(source.href, n)
    const external = /^https?:/.test(source.href)
    list.push({
      n,
      label: source.label[language],
      href: source.href,
      host: external
        ? new URL(source.href).hostname.replace(/^www\./, "")
        : undefined,
    })
  }
  for (const step of steps) step.sources.forEach(add)
  // The gap, in the order of its blocks and quotations.
  for (const source of [
    ...apparatus.flatMap((row) => row.sources),
    gapAdmissions.staff.source,
    ...estimates.map((tile) => tile.source),
    ...corrected.flatMap((fix) => fix.sources),
    gapAdmissions.costs.source,
    ...reportSources,
    gapAdmissions.outcomes.source,
    bankPackage.sources.bill,
    gapAdmissions.revenue.source,
    bankPackage.sources.answer,
    bankPackage.sources.evaluation,
    gapAdmissions.austria.source,
    gapAdmissions.last.source,
  ])
    add(source)
  for (const sources of Object.values(balanceSources(language)))
    sources.forEach(add)
  // The numbers for a passage, each once, in order.
  const cite = (sources: Source[]) =>
    [...new Set(sources.map((source) => numbers.get(source.href)))]
      .filter((n): n is number => n !== undefined)
      .sort((a, b) => a - b)
      .map((n) => list[n - 1])
  return { list, cite }
}
