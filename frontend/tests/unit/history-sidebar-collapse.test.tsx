import { render, screen, fireEvent } from "@testing-library/react"

const toggleSidebar = jest.fn()

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
    requestDeleteConversation: jest.fn(),
    cancelDeleteConversation: jest.fn(),
    confirmDeleteConversation: jest.fn(),
    deleteConfirmation: {
      isOpen: false,
      isSubmitting: false,
      conversationId: undefined,
      errorMessage: undefined,
    },
    toggleSidebar,
    upsertConversation: jest.fn(),
    registerFirstPromptContext: jest.fn(),
    removeConversation: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar collapse", () => {
  it("toggles sidebar", () => {
    render(<HistorySidebar conversationId="c1" />)
    fireEvent.click(screen.getByRole("button", { name: /recolher histórico/i }))
    expect(toggleSidebar).toHaveBeenCalled()
  })
})
