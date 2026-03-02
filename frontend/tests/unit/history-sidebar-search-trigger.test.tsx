import { fireEvent, render, screen } from "@testing-library/react"

const pushMock = jest.fn()

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
    toggleChatsSectionExpanded: jest.fn(),
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

describe("HistorySidebar search trigger", () => {
  it("renders search trigger below collapse control", () => {
    render(<HistorySidebar conversationId="c1" />)

    const collapseButton = screen.getByRole("button", { name: /recolher histórico/i })
    const searchTrigger = screen.getByRole("button", { name: /^buscar em chats$/i })
    expect(
      collapseButton.compareDocumentPosition(searchTrigger) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()
  })

  it("opens search dialog from neutral textual trigger", () => {
    render(<HistorySidebar conversationId="c1" />)

    const searchTrigger = screen.getByRole("button", { name: /^buscar em chats$/i })
    expect(searchTrigger.className).toContain("px-0")

    fireEvent.click(searchTrigger)

    expect(screen.getByRole("dialog", { name: /buscar em chats/i })).toBeInTheDocument()
  })
})
