import {
  accountsSources,
  reportsByYearSources,
  unexplained,
  reportingBenefit,
  reportingCostSources,
  type Source,
} from "@/data/history-evidence"
import {
  corrected,
  estimates,
  germanConvictionsSources,
  germanReportsSources,
  recovery,
} from "@/data/history-gap"
import { chats, nextSteps, rulings } from "@/data/history-next"
import { pairSources, pairs } from "@/data/history-promises"
import { leaks } from "@/data/leaks"
import { steps } from "@/data/overregulation"
import { type Language, pathFor } from "@/lib/i18n"

// The history page cites its sources by number, [3], and lists every
// source once at the end of the page. The numbers follow the order in
// which a reader meets the sources: the film, what comes next, what it
// means for you, the bill, the pairs of promise and record, and the
// rulings in the conclusion. A source cited again keeps its number. Where the
// story needs the name, such as a quotation, the text names it as well.
// The charts to check, folded away below, keep their own source lists.
// Any source of the page's data files; some link a document per language.
type Citable = {
  label: Record<Language, string>
  href: string | Record<Language, string>
}
export const hrefIn = (source: Citable, language: Language) =>
  typeof source.href === "string" ? source.href : source.href[language]

export type HistorySource = {
  n: number
  label: string
  href: string
  // The site a link leads to, so readers see what kind of source it is.
  host?: string
}

const bulgaria = leaks.find((leak) => leak.id === "bulgaria")
// The answer to parliament that the report charts quote (ReportLandscape).
const reportOutcome = pairs.find((pair) => pair.id === "a-fiu-at")?.record[1]

// What each field of the balance cites, in its order.
export const balanceSources = (language: Language) => ({
  costs: reportingCostSources,
  benefit: reportingBenefit.sources.slice(0, 1),
  captured: accountsSources,
  // DAC8 reports every customer of a crypto-asset provider, residents of
  // the provider's own country included.
  dac8: [
    {
      label: {
        de: "Richtlinie (EU) 2023/2226",
        en: "Directive (EU) 2023/2226",
      },
      href: "https://eur-lex.europa.eu/eli/dir/2023/2226/oj",
    },
  ] satisfies Source[],
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
  const add = (source: Citable) => {
    const href = hrefIn(source, language)
    if (numbers.has(href)) return
    const n = list.length + 1
    numbers.set(href, n)
    const external = /^https?:/.test(href)
    list.push({
      n,
      label: source.label[language],
      href,
      host: external ? new URL(href).hostname.replace(/^www\./, "") : undefined,
    })
  }
  for (const step of steps) step.sources.forEach(add)
  const cited = balanceSources(language)
  // In the order of the page: what comes next, what it means for you, the
  // bill, the pairs of promise and record, and the rulings.
  for (const source of [
    ...nextSteps.flatMap((step) => step.sources),
    ...chats.sources,
    ...cited.captured,
    ...cited.dac8,
    ...cited.cases,
    ...cited.bulgaria,
    ...cited.unexplained,
    ...cited.withheld,
    // The report charts: Germany first, then Austria, then the answer to
    // parliament below them, which the pairs cite again.
    ...germanReportsSources,
    ...germanConvictionsSources,
    ...reportsByYearSources,
    ...(reportOutcome ? [reportOutcome.source] : []),
    // Only Europol’s 2025 estimate is cited on the page.
    ...recovery.sources.slice(1),
    ...cited.costs,
    ...estimates.map((tile) => tile.source),
    ...(corrected.find((fix) => fix.id === "dac8")?.sources ?? []),
    ...cited.benefit,
    ...pairSources(),
    ...rulings.flatMap((ruling) => ruling.sources),
  ])
    add(source)
  // The numbers for a passage, each once, in order.
  const cite = (sources: Citable[]) =>
    [...new Set(sources.map((source) => numbers.get(hrefIn(source, language))))]
      .filter((n): n is number => n !== undefined)
      .sort((a, b) => a - b)
      .map((n) => list[n - 1])
  return { list, cite }
}
