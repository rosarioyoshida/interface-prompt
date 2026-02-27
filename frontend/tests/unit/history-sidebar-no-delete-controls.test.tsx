import { render, screen } from "@testing-library/react"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/chat/c1",
}))

jest.mock("@/hooks/useConversationHistory", () => ({
  useConversationHistory: () => ({
    entries: [],
    activeConversationId: undefined,
    isCollapsed: false,
    activateConversation: jest.fn(),
    toggleSidebar: jest.fn(),
    upsertConversation: jest.fn(),
    registerFirstPromptContext: jest.fn(),
    removeConversation: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar no-delete controls", () => {
  it("does not render deletion actions", () => {
    render(<HistorySidebar conversationId="c1" />)

    expect(screen.queryByText(/excluir/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/limpar/i)).not.toBeInTheDocument()
  })
})
