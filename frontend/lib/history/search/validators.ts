const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}T/
export const MAX_SEARCH_QUERY_LENGTH = 200

export function normalizeSearchQuery(query: string): string {
  return clampSearchQuery(query).trim().toLocaleLowerCase()
}

export function normalizeSearchSource(input: string | undefined): string {
  return (input ?? "").replace(/\s+/g, " ").trim()
}

export function clampSearchQuery(query: string): string {
  if (query.length <= MAX_SEARCH_QUERY_LENGTH) return query
  return query.slice(0, MAX_SEARCH_QUERY_LENGTH)
}

export function isValidMessageDate(input: string): boolean {
  if (!ISO_DATE_RE.test(input)) return false
  return Number.isFinite(new Date(input).getTime())
}
