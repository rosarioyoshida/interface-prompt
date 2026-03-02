import { renderHook, act } from "@testing-library/react"
import { useChatHistorySearch } from "@/hooks/useChatHistorySearch"
import { MAX_SEARCH_QUERY_LENGTH } from "@/lib/history/search/validators"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("useChatHistorySearch", () => {
  const entries: IterationHistoryEntry[] = [
    {
      conversationId: "conv-1",
      title: "Primeira conversa",
      firstPromptRaw: "ajuda com menu lateral",
      createdAt: "2026-03-01T10:00:00.000Z",
      firstPromptAt: "2026-03-01T10:00:00.000Z",
      lastActivatedAt: "2026-03-01T10:10:00.000Z",
      messageCount: 2,
    },
  ]

  it("clamps query to max allowed length", () => {
    const onOpenConversation = jest.fn()
    const { result } = renderHook(() =>
      useChatHistorySearch({ entries, onOpenConversation }),
    )

    act(() => {
      result.current.setQuery("a".repeat(MAX_SEARCH_QUERY_LENGTH + 10))
    })

    expect(result.current.query).toHaveLength(MAX_SEARCH_QUERY_LENGTH)
  })

  it("does not open conversation for empty id", () => {
    const onOpenConversation = jest.fn()
    const { result } = renderHook(() =>
      useChatHistorySearch({ entries, onOpenConversation }),
    )

    act(() => {
      result.current.openConversationFromResult({
        conversationId: "   ",
        snippet: "texto",
        messageDate: "2026-03-01T10:00:00.000Z",
        origin: "usuario",
      })
    })

    expect(onOpenConversation).not.toHaveBeenCalled()
  })
})
