import { render, screen } from "@testing-library/react"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { MessageRole } from "@/lib/types/conversation"

const useAutoScrollMock = jest.fn()

jest.mock("@/hooks/useAutoScroll", () => ({
  useAutoScroll: (args: unknown) => useAutoScrollMock(args),
}))

describe("ChatWindow", () => {
  beforeEach(() => {
    useAutoScrollMock.mockReturnValue({ containerRef: { current: null } })
    useAutoScrollMock.mockClear()
  })

  it("shows loading skeletons when loading with no messages", () => {
    const { container } = render(<ChatWindow messages={[]} isLoading />)

    expect(
      container.querySelectorAll(".animate-pulse").length,
    ).toBeGreaterThan(0)
  })

  it("shows empty state when not loading and no messages", () => {
    render(<ChatWindow messages={[]} isLoading={false} />)
    expect(
      screen.getByText("Comece digitando um prompt abaixo."),
    ).toBeInTheDocument()
  })

  it("renders message list", () => {
    render(
      <ChatWindow
        isLoading={false}
        messages={[
          {
            id: "m1",
            role: MessageRole.USER,
            content: "Mensagem 1",
            timestamp: "2026-03-02T10:00:00.000Z",
          },
          {
            id: "m2",
            role: MessageRole.ASSISTANT,
            content: "Mensagem 2",
            timestamp: "2026-03-02T10:00:01.000Z",
          },
        ]}
      />,
    )

    expect(screen.getByText("Mensagem 1")).toBeInTheDocument()
    expect(screen.getByText("Mensagem 2")).toBeInTheDocument()
    expect(useAutoScrollMock).toHaveBeenCalled()
  })
})
