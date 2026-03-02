import type { SearchResultItem, BuildSearchParams } from "@/lib/history/search/types"
import { buildSnippet } from "@/lib/history/search/snippetBuilder"
import {
  isValidMessageDate,
  normalizeSearchQuery,
  normalizeSearchSource,
} from "@/lib/history/search/validators"

const DAY_MS = 24 * 60 * 60 * 1000

export function buildChatHistoryResults({
  entries,
  query,
  now,
  recentWindowDays = 7,
}: BuildSearchParams): SearchResultItem[] {
  const normalizedQuery = normalizeSearchQuery(query)
  const minRecentTime = now.getTime() - recentWindowDays * DAY_MS

  return entries
    .map((entry) => {
      const searchableText = normalizeSearchSource(
        entry.firstPromptRaw || entry.title,
      )
      if (!searchableText) return null

      const candidateDate = entry.firstPromptAt || entry.createdAt
      if (!isValidMessageDate(candidateDate)) return null
      const candidateTime = new Date(candidateDate).getTime()

      if (!normalizedQuery && candidateTime < minRecentTime) return null
      if (normalizedQuery) {
        const hasMatch = searchableText
          .toLocaleLowerCase()
          .includes(normalizedQuery)
        if (!hasMatch) return null
      }

      return {
        conversationId: entry.conversationId,
        snippet: buildSnippet(searchableText, normalizedQuery),
        messageDate: candidateDate,
        origin: "usuario",
      } satisfies SearchResultItem
    })
    .filter((result): result is SearchResultItem => result !== null)
    .sort(
      (a, b) => new Date(b.messageDate).getTime() - new Date(a.messageDate).getTime(),
    )
}
