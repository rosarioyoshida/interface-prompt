import { render, screen } from "@testing-library/react"

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/chat/c1",
}))

jest.mock("@/hooks/useConversationHistory", () => ({
  useConversationHistory: () => ({
    entries: [
      {
        conversationId: "c1",
        title: "Primeiro contexto",
        createdAt: "2026-01-01T00:00:00.000Z",
        lastActivatedAt: "2026-01-01T00:00:00.000Z",
        messageCount: 2,
      },
    ],
    activeConversationId: "c1",
    isCollapsed: false,
    activateConversation: jest.fn(),
    toggleSidebar: jest.fn(),
    upsertConversation: jest.fn(),
    registerFirstPromptContext: jest.fn(),
    removeConversation: jest.fn(),
  }),
}))

import { HistorySidebar } from "@/components/chat/HistorySidebar"

describe("HistorySidebar list", () => {
  it("renders entries and active state", () => {
    render(<HistorySidebar conversationId="c1" />)

    expect(screen.getByText("Histórico")).toBeInTheDocument()
    expect(screen.getByText("Primeiro contexto")).toBeInTheDocument()
  })

  it("renders empty state", () => {
    const mockHook = require("@/hooks/useConversationHistory")
    mockHook.useConversationHistory = () => ({
      entries: [],
      activeConversationId: undefined,
      isCollapsed: false,
      activateConversation: jest.fn(),
      toggleSidebar: jest.fn(),
      upsertConversation: jest.fn(),
      registerFirstPromptContext: jest.fn(),
      removeConversation: jest.fn(),
    })

    render(<HistorySidebar conversationId="c1" />)
    expect(screen.getByText("Nenhum histórico disponível.")).toBeInTheDocument()
  })
})
