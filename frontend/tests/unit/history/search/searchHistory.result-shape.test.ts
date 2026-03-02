import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("result shape", () => {
  it("returns snippet, messageDate and origin", () => {
    const now = new Date("2026-03-10T12:00:00.000Z")
    const entries: IterationHistoryEntry[] = [
      {
        conversationId: "conv-1",
        title: "Conversa",
        firstPromptRaw: "buscar termo no historico",
        createdAt: "2026-03-09T10:00:00.000Z",
        firstPromptAt: "2026-03-09T10:00:00.000Z",
        lastActivatedAt: "2026-03-09T10:10:00.000Z",
        messageCount: 2,
      },
    ]

    const [result] = buildChatHistoryResults({ entries, query: "termo", now })

    expect(result).toEqual(
      expect.objectContaining({
        conversationId: "conv-1",
        snippet: expect.any(String),
        messageDate: expect.any(String),
        origin: "usuario",
      }),
    )
  })
})
