import { fireEvent, render, screen } from "@testing-library/react"

const toggleChatsSectionExpandedMock = jest.fn()

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
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
    isChatsSectionExpanded: true,
    activateConversation: jest.fn(),
    requestDeleteConversation: jest.fn(),
    cancelDeleteConversation: jest.fn(),
    confirmDeleteConversation: jest.fn(),
    deleteConfirmation: {
      isOpen: false,
      isSubmitting: false,
      conversationId: undefined,
      errorMessage: undefined,
    },
    toggleSidebar: jest.fn(),
    toggleChatsSectionExpanded: toggleChatsSectionExpandedMock,
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

describe("HistorySidebar accordion", () => {
  beforeEach(() => {
    toggleChatsSectionExpandedMock.mockReset()
  })

  it("renders section title as 'Seus chats'", () => {
    render(<HistorySidebar conversationId="c1" />)
    expect(screen.getByRole("button", { name: /seus chats/i })).toBeInTheDocument()
  })

  it("toggles chats section when clicking accordion trigger", () => {
    render(<HistorySidebar conversationId="c1" />)
    fireEvent.click(screen.getByRole("button", { name: /seus chats/i }))
    expect(toggleChatsSectionExpandedMock).toHaveBeenCalled()
  })
})
