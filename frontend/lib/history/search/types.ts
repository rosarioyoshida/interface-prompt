import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

export type SearchMode = "recent" | "search"
export type SearchResultOrigin = "usuario"

export interface SearchResultItem {
  conversationId: string
  snippet: string
  messageDate: string
  origin: SearchResultOrigin
}

export interface BuildSearchParams {
  entries: IterationHistoryEntry[]
  query: string
  now: Date
  recentWindowDays?: number
}
