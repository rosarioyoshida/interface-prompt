import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("recent window", () => {
  const now = new Date("2026-03-10T12:00:00.000Z")

  it("filters out items older than 7 days in recent mode", () => {
    const entries: IterationHistoryEntry[] = [
      {
        conversationId: "recent",
        title: "Recente",
        firstPromptRaw: "assunto recente",
        createdAt: "2026-03-09T10:00:00.000Z",
        firstPromptAt: "2026-03-09T10:00:00.000Z",
        lastActivatedAt: "2026-03-09T10:10:00.000Z",
        messageCount: 2,
      },
      {
        conversationId: "old",
        title: "Antiga",
        firstPromptRaw: "assunto antigo",
        createdAt: "2026-02-20T10:00:00.000Z",
        firstPromptAt: "2026-02-20T10:00:00.000Z",
        lastActivatedAt: "2026-02-20T10:10:00.000Z",
        messageCount: 2,
      },
    ]

    const results = buildChatHistoryResults({ entries, query: "", now })
    expect(results.map((item) => item.conversationId)).toEqual(["recent"])
  })
})
