import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("buildChatHistoryResults", () => {
  const now = new Date("2026-03-02T12:00:00.000Z")
  const entries: IterationHistoryEntry[] = [
    {
      conversationId: "conv-1",
      title: "Sidebar",
      firstPromptRaw: "Como abrir menu lateral?",
      createdAt: "2026-03-01T10:00:00.000Z",
      firstPromptAt: "2026-03-01T10:00:00.000Z",
      lastActivatedAt: "2026-03-01T10:05:00.000Z",
      messageCount: 2,
    },
  ]

  it("returns recent results on empty query", () => {
    const results = buildChatHistoryResults({ entries, query: "", now })
    expect(results).toHaveLength(1)
    expect(results[0].conversationId).toBe("conv-1")
  })
})
