import { fireEvent, render, screen } from "@testing-library/react"

const pushMock = jest.fn()
const confirmDeleteConversationMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/chat/c1",
}))

jest.mock("@/hooks/useConversationHistory", () => ({
  useConversationHistory: () => ({
    entries: [
      {
        conversationId: "c1",
        title: "Conversa alvo",
        createdAt: "2026-01-01T00:00:00.000Z",
        lastActivatedAt: "2026-01-01T00:00:00.000Z",
        messageCount: 2,
      },
    ],
    activeConversationId: "c1",
    isCollapsed: false,
    activateConversation: jest.fn(),
    requestDeleteConversation: jest.fn(),
    cancelDeleteConversation: jest.fn(),
    confirmDeleteConversation: confirmDeleteConversationMock,
    deleteConfirmation: {
      isOpen: true,
      isSubmitting: false,
      conversationId: "c1",
      errorMessage: undefined,
    },
    toggleSidebar: jest.fn(),
    upsertConversation: jest.fn(),
    registerFirstPromptContext: jest.fn(),
    removeConversation: jest.fn(),
  }),
}))

jest.mock("@/hooks/useChatHistorySearch", () => ({
  useChatHistorySearch: () => ({
    query: "",
    mode: "recent",
    results: [],
    setQuery: jest.fn(),
    clearQuery: jest.fn(),
    openConversationFromResult: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar delete confirmation", () => {
  beforeEach(() => {
    pushMock.mockReset()
    confirmDeleteConversationMock.mockReset()
  })

  it("navigates to /chat after successful deletion of active conversation", () => {
    confirmDeleteConversationMock.mockReturnValue(true)

    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }))

    expect(confirmDeleteConversationMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith("/chat")
  })
})
