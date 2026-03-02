"use client"

import { useMemo, useState } from "react"
import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { SearchMode, SearchResultItem } from "@/lib/history/search/types"
import { clampSearchQuery } from "@/lib/history/search/validators"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

interface UseChatHistorySearchInput {
  entries: IterationHistoryEntry[]
  onOpenConversation: (conversationId: string) => void
}

interface UseChatHistorySearchOutput {
  query: string
  mode: SearchMode
  results: SearchResultItem[]
  setQuery: (value: string) => void
  clearQuery: () => void
  openConversationFromResult: (result: SearchResultItem) => void
}

export function useChatHistorySearch({
  entries,
  onOpenConversation,
}: UseChatHistorySearchInput): UseChatHistorySearchOutput {
  const [query, setQuery] = useState("")

  const mode: SearchMode = query.trim() ? "search" : "recent"

  const results = useMemo(
    () =>
      buildChatHistoryResults({
        entries,
        query,
        now: new Date(),
      }),
    [entries, query],
  )

  return {
    query,
    mode,
    results,
    setQuery: (value) => setQuery(clampSearchQuery(value)),
    clearQuery: () => setQuery(""),
    openConversationFromResult: (result) => {
      const normalizedConversationId = result.conversationId.trim()
      if (!normalizedConversationId) return
      onOpenConversation(normalizedConversationId)
    },
  }
}
