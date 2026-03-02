import { renderHook, act } from "@testing-library/react"
import { useConversationHistory } from "@/hooks/useConversationHistory"

describe("useConversationHistory", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("toggles sidebar and persists state", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: "abc" }),
    )

    expect(result.current.isCollapsed).toBe(false)

    act(() => result.current.toggleSidebar())

    expect(result.current.isCollapsed).toBe(true)
    expect(
      localStorage.getItem("prompt_ui.history.sidebar_collapsed.v1"),
    ).toContain("true")
  })

  it("toggles chats section accordion and persists state", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: "abc" }),
    )

    expect(result.current.isChatsSectionExpanded).toBe(true)

    act(() => result.current.toggleChatsSectionExpanded())

    expect(result.current.isChatsSectionExpanded).toBe(false)
    expect(
      localStorage.getItem("prompt_ui.history.sidebar_collapsed.v1"),
    ).toContain("isChatsSectionExpanded")
  })

  it("upserts and activates conversation", () => {
    const { result } = renderHook(() =>
      useConversationHistory({ conversationId: "abc" }),
    )

    act(() => {
      result.current.upsertConversation({
        conversationId: "abc",
        createdAt: "2026-01-01T00:00:00.000Z",
      })
    })

    expect(result.current.entries).toHaveLength(1)
    expect(result.current.activeConversationId).toBe("abc")
  })
})
