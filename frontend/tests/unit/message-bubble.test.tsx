import { render, screen } from "@testing-library/react"
import { MessageBubble } from "@/components/chat/MessageBubble"
import { MessageRole } from "@/lib/types/conversation"

describe("MessageBubble", () => {
  it("renders user message with user label", () => {
    render(
      <MessageBubble
        message={{
          id: "m1",
          role: MessageRole.USER,
          content: "Olá",
          timestamp: "2026-03-02T10:00:00.000Z",
        }}
      />,
    )

    expect(screen.getByText("Você")).toBeInTheDocument()
    expect(screen.getByText("Olá")).toBeInTheDocument()
  })

  it("renders assistant message with IA label", () => {
    render(
      <MessageBubble
        message={{
          id: "m2",
          role: MessageRole.ASSISTANT,
          content: "Oi! Em que posso ajudar?",
          timestamp: "2026-03-02T10:00:01.000Z",
        }}
      />,
    )

    expect(screen.getByText("IA")).toBeInTheDocument()
    expect(screen.getByText("Oi! Em que posso ajudar?")).toBeInTheDocument()
  })
})
