import {
  accountsSources,
  reportsByYearSources,
  unexplained,
  reportingBenefit,
  reportingCostSources,
  type Source,
} from "@/data/history-evidence"
import {
  admissions as gapAdmissions,
  apparatus,
  corrected,
  estimates,
  germanConvictionsSources,
  germanReportsSources,
  recovery,
} from "@/data/history-gap"
import { pairSources } from "@/data/history-promises"
import { leaks } from "@/data/leaks"
import { steps } from "@/data/overregulation"
import { type Language, pathFor } from "@/lib/i18n"

// The history page cites its sources by number, [3], and lists every
// source once at the end of the page. The numbers follow the order in
// which a reader meets the sources: the film, what it means for you, the
// bill and the pairs of promise and record. A source cited again keeps its number. Where the
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
// Three or more numbers in a row shrink to a range, [29–41].
export const refsHtml = (sources: HistorySource[], language: Language) => {
  const word = language === "en" ? "Source" : "Quelle"
  const link = (source: HistorySource) =>
    `<a href="#quelle-${source.n}" title="${escape(source.label)}" aria-label="${escape(`${word} ${source.n}: ${source.label}`)}">${source.n}</a>`
  const runs: HistorySource[][] = []
  for (const source of sources) {
    const run = runs.at(-1)
    if (run && run[run.length - 1].n === source.n - 1) run.push(source)
    else runs.push([source])
  }
  const parts = runs.flatMap((run) =>
    run.length >= 3
      ? [`${link(run[0])}–${link(run[run.length - 1])}`]
      : run.map(link),
  )
  return `[${parts.join(", ")}]`
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
  const cited = balanceSources(language)
  // In the order of the page: what it means for you, the bill, and the
  // pairs of promise and record.
  for (const source of [
    ...cited.captured,
    ...cited.cases,
    ...cited.bulgaria,
    ...cited.unexplained,
    ...cited.withheld,
    ...reportsByYearSources,
    ...germanReportsSources,
    ...germanConvictionsSources,
    ...recovery.sources,
    ...cited.costs,
    ...estimates.map((tile) => tile.source),
    ...(corrected.find((fix) => fix.id === "dac8")?.sources ?? []),
    ...cited.benefit,
    ...apparatus.flatMap((row) => row.sources),
    gapAdmissions.staff.source,
    ...pairSources(),
  ])
    add(source)
  // The numbers for a passage, each once, in order.
  const cite = (sources: Source[]) =>
    [...new Set(sources.map((source) => numbers.get(source.href)))]
      .filter((n): n is number => n !== undefined)
      .sort((a, b) => a - b)
      .map((n) => list[n - 1])
  return { list, cite }
}
