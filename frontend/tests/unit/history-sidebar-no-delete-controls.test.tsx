import { fireEvent, render, screen } from "@testing-library/react"

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
    activeConversationId: undefined,
    isCollapsed: false,
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
    upsertConversation: jest.fn(),
    registerFirstPromptContext: jest.fn(),
    removeConversation: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar delete controls", () => {
  it("renders deletion action in menu", () => {
    render(<HistorySidebar conversationId="c1" />)

    fireEvent.click(screen.getByRole("button", { name: /ações para/i }))

    expect(
      screen.getByRole("menuitem", { name: /excluir histórico/i }),
    ).toBeInTheDocument()
  })
})
