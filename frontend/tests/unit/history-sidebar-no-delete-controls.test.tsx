import { fireEvent, render, screen } from "@testing-library/react"

const pushMock = jest.fn()
const activateConversationMock = jest.fn()
const requestDeleteMock = jest.fn()
const clearQueryMock = jest.fn()

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
    activeConversationId: undefined,
    isCollapsed: false,
    activateConversation: activateConversationMock,
    requestDeleteConversation: requestDeleteMock,
    cancelDeleteConversation: jest.fn(),
    confirmDeleteConversation: jest.fn(),
    deleteConfirmation: {
      isOpen: false,
      isSubmitting: false,
      conversationId: undefined,
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
    results: [
      {
        conversationId: "c1",
        snippet: "Conversa alvo",
        messageDate: "2026-01-01T00:00:00.000Z",
        origin: "usuario",
      },
    ],
    setQuery: jest.fn(),
    clearQuery: clearQueryMock,
    openConversationFromResult: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar delete controls", () => {
  beforeEach(() => {
    pushMock.mockReset()
    activateConversationMock.mockReset()
    requestDeleteMock.mockReset()
    clearQueryMock.mockReset()
  })

  it("renders deletion action in menu", () => {
    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByRole("button", { name: /ações para/i }))

    expect(
      screen.getByRole("menuitem", { name: /excluir histórico/i }),
    ).toBeInTheDocument()
  })

  it("navigates and activates conversation when clicking history item", () => {
    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByText("Conversa alvo"))

    expect(activateConversationMock).toHaveBeenCalledWith(
      "c1",
      expect.any(String),
    )
    expect(pushMock).toHaveBeenCalledWith("/chat/c1")
  })

  it("requests deletion when selecting delete action", () => {
    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByRole("button", { name: /ações para/i }))
    fireEvent.click(screen.getByRole("menuitem", { name: /excluir histórico/i }))

    expect(requestDeleteMock).toHaveBeenCalledWith("c1")
  })

  it("opens search dialog from root sidebar button above history label", () => {
    render(<HistorySidebar conversationId="c1" />)

    const searchButton = screen.getByRole("button", { name: /^buscar em chats$/i })
    const historyLabel = screen.getByText("Histórico")
    expect(
      searchButton.compareDocumentPosition(historyLabel) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy()

    fireEvent.click(searchButton)

    expect(screen.getByRole("dialog", { name: /buscar em chats/i })).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Buscar em chats...")).toBeInTheDocument()
  })

  it("does not show search action inside per-item actions menu", () => {
    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByRole("button", { name: /ações para/i }))

    expect(
      screen.queryByRole("menuitem", { name: /buscar em chats/i }),
    ).not.toBeInTheDocument()
  })
})
