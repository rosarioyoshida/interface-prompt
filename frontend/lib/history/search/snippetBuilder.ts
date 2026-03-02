import { normalizeSearchSource } from "@/lib/history/search/validators"

const DEFAULT_SNIPPET_SIZE = 64

export function buildSnippet(source: string, query: string): string {
  const normalizedSource = normalizeSearchSource(source)
  if (!normalizedSource) return "Sem conteúdo indexado."

  const normalizedQuery = normalizeSearchSource(query).toLocaleLowerCase()
  if (!normalizedQuery) {
    return truncateSnippet(normalizedSource)
  }

  const lowerSource = normalizedSource.toLocaleLowerCase()
  const matchIndex = lowerSource.indexOf(normalizedQuery)
  if (matchIndex < 0) {
    return truncateSnippet(normalizedSource)
  }

  const context = Math.floor((DEFAULT_SNIPPET_SIZE - normalizedQuery.length) / 2)
  const start = Math.max(0, matchIndex - context)
  const end = Math.min(
    normalizedSource.length,
    matchIndex + normalizedQuery.length + context,
  )
  const prefix = start > 0 ? "..." : ""
  const suffix = end < normalizedSource.length ? "..." : ""
  return `${prefix}${normalizedSource.slice(start, end)}${suffix}`
}

function truncateSnippet(source: string): string {
  if (source.length <= DEFAULT_SNIPPET_SIZE) return source
  return `${source.slice(0, DEFAULT_SNIPPET_SIZE - 3)}...`
}
