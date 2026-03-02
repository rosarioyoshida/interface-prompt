import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("query match", () => {
  const now = new Date("2026-03-10T12:00:00.000Z")
  const entries: IterationHistoryEntry[] = [
    {
      conversationId: "conv-1",
      title: "Conversa",
      firstPromptRaw: "Erro no Menu lateral",
      createdAt: "2026-02-01T10:00:00.000Z",
      firstPromptAt: "2026-02-01T10:00:00.000Z",
      lastActivatedAt: "2026-02-01T10:10:00.000Z",
      messageCount: 2,
    },
  ]

  it("matches using trim and case-insensitive logic", () => {
    const results = buildChatHistoryResults({ entries, query: "  menu  ", now })
    expect(results).toHaveLength(1)
    expect(results[0].conversationId).toBe("conv-1")
  })
})
