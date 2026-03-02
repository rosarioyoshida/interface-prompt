import { renderHook } from "@testing-library/react"
import { useChatHistorySearch } from "@/hooks/useChatHistorySearch"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("useChatHistorySearch recent mode", () => {
  it("starts in recent mode when query is empty", () => {
    const entries: IterationHistoryEntry[] = [
      {
        conversationId: "conv-1",
        title: "Conversa",
        firstPromptRaw: "mensagem",
        createdAt: "2026-03-01T10:00:00.000Z",
        firstPromptAt: "2026-03-01T10:00:00.000Z",
        lastActivatedAt: "2026-03-01T10:05:00.000Z",
        messageCount: 2,
      },
    ]

    const { result } = renderHook(() =>
      useChatHistorySearch({ entries, onOpenConversation: jest.fn() }),
    )

    expect(result.current.query).toBe("")
    expect(result.current.mode).toBe("recent")
    expect(result.current.results.length).toBeGreaterThanOrEqual(0)
  })
})
