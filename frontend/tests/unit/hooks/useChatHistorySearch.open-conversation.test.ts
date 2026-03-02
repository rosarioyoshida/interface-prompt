import { act, renderHook } from "@testing-library/react"
import { useChatHistorySearch } from "@/hooks/useChatHistorySearch"
import type { SearchResultItem } from "@/lib/history/search/types"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("useChatHistorySearch openConversationFromResult", () => {
  it("calls onOpenConversation with selected conversationId", () => {
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
    const onOpenConversation = jest.fn()
    const { result } = renderHook(() =>
      useChatHistorySearch({ entries, onOpenConversation }),
    )

    const item: SearchResultItem = {
      conversationId: "conv-1",
      snippet: "mensagem",
      messageDate: "2026-03-01T10:00:00.000Z",
      origin: "usuario",
    }

    act(() => {
      result.current.openConversationFromResult(item)
    })

    expect(onOpenConversation).toHaveBeenCalledWith("conv-1")
  })
})
