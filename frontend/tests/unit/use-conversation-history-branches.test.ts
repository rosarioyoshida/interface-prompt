import { act, renderHook } from "@testing-library/react"
import { useConversationHistory } from "@/hooks/useConversationHistory"

describe("useConversationHistory branches", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("activates, removes and confirms delete flow", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: "c1" }),
    )

    act(() => {
      result.current.upsertConversation({
        conversationId: "c1",
        createdAt: "2026-03-02T10:00:00.000Z",
      })
    })
    expect(result.current.entries).toHaveLength(1)

    act(() => {
      result.current.requestDeleteConversation("c1")
    })
    expect(result.current.deleteConfirmation.isOpen).toBe(true)

    let didSucceed = false
    act(() => {
      didSucceed = result.current.confirmDeleteConversation()
    })
    expect(didSucceed).toBe(true)
    expect(result.current.entries).toHaveLength(0)

    act(() => {
      result.current.cancelDeleteConversation()
    })
    expect(result.current.deleteConfirmation.isOpen).toBe(false)
  })

  it("returns false when confirming delete without target", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: undefined }),
    )

    let didSucceed = true
    act(() => {
      didSucceed = result.current.confirmDeleteConversation()
    })
    expect(didSucceed).toBe(false)
  })

  it("handles storage events for history/sidebar synchronization", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: undefined }),
    )

    act(() => {
      localStorage.setItem(
        "prompt_ui.history.v1",
        JSON.stringify({
          version: 1,
          activeConversationId: "c2",
          entries: [
            {
              conversationId: "c2",
              title: "Outra conversa",
              createdAt: "2026-03-02T10:00:00.000Z",
              lastActivatedAt: "2026-03-02T10:00:00.000Z",
              messageCount: 2,
            },
          ],
        }),
      )
      window.dispatchEvent(
        new StorageEvent("storage", { key: "prompt_ui.history.v1" }),
      )
    })
    expect(result.current.entries[0]?.conversationId).toBe("c2")

    act(() => {
      localStorage.setItem(
        "prompt_ui.history.sidebar_collapsed.v1",
        JSON.stringify({ isCollapsed: true }),
      )
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "prompt_ui.history.sidebar_collapsed.v1",
        }),
      )
    })
    expect(result.current.isCollapsed).toBe(true)
  })
})
