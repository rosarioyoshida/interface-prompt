import { renderHook, waitFor } from "@testing-library/react"
import { ConversationStatus, MessageRole } from "@/lib/types/conversation"
import { useConversation } from "@/hooks/useConversation"

const pushMock = jest.fn()

const historyMock = {
  entries: [
    {
      conversationId: "conv-1",
      title: "Contexto",
      createdAt: "2026-03-02T10:00:00.000Z",
      lastActivatedAt: "2026-03-02T10:00:00.000Z",
      messageCount: 0,
    },
  ],
  upsertConversation: jest.fn(),
  registerFirstPromptContext: jest.fn(),
  activateConversation: jest.fn(),
  removeConversation: jest.fn(),
}

const apiMock = {
  createConversation: jest.fn(),
  getConversation: jest.fn(),
  sendPrompt: jest.fn(),
  deleteConversation: jest.fn(),
}

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}))

jest.mock("@/hooks/useConversationHistory", () => ({
  useConversationHistory: () => historyMock,
}))

jest.mock("@/lib/api/conversationApi", () => ({
  createConversation: (...args: unknown[]) => apiMock.createConversation(...args),
  getConversation: (...args: unknown[]) => apiMock.getConversation(...args),
  sendPrompt: (...args: unknown[]) => apiMock.sendPrompt(...args),
  deleteConversation: (...args: unknown[]) => apiMock.deleteConversation(...args),
}))

describe("useConversation", () => {
  beforeEach(() => {
    pushMock.mockReset()
    historyMock.upsertConversation.mockReset()
    historyMock.registerFirstPromptContext.mockReset()
    historyMock.activateConversation.mockReset()
    historyMock.removeConversation.mockReset()
    apiMock.createConversation.mockReset()
    apiMock.getConversation.mockReset()
    apiMock.sendPrompt.mockReset()
    apiMock.deleteConversation.mockReset()
  })

  it("loads conversation and updates history on mount", async () => {
    apiMock.getConversation.mockResolvedValue({
      id: "conv-1",
      status: ConversationStatus.ACTIVE,
      messages: [
        {
          id: "m1",
          role: MessageRole.USER,
          content: "Oi",
          timestamp: "2026-03-02T10:00:00.000Z",
        },
      ],
      createdAt: "2026-03-02T10:00:00.000Z",
      _links: {},
    })

    const { result } = renderHook(() =>
      useConversation({ conversationId: "conv-1" }),
    )

    await waitFor(() => expect(apiMock.getConversation).toHaveBeenCalled())
    await waitFor(() => expect(result.current.messages).toHaveLength(1))
    expect(historyMock.upsertConversation).toHaveBeenCalledWith({
      conversationId: "conv-1",
      createdAt: "2026-03-02T10:00:00.000Z",
    })
    expect(historyMock.activateConversation).toHaveBeenCalled()
  })

  it("redirects to /chat on 404 load error and removes stale history entry", async () => {
    apiMock.getConversation.mockRejectedValue(new Error("HTTP 404"))

    renderHook(() => useConversation({ conversationId: "conv-1" }))

    await waitFor(() =>
      expect(historyMock.removeConversation).toHaveBeenCalledWith("conv-1"),
    )
    expect(pushMock).toHaveBeenCalledWith("/chat")
  })
})
