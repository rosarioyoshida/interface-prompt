import { fireEvent, render, screen } from "@testing-library/react"
import { ConversationHeader } from "@/components/chat/ConversationHeader"

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AlertDialogCancel: ({ children }: { children: React.ReactNode }) => (
    <button type="button">{children}</button>
  ),
  AlertDialogAction: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

describe("ConversationHeader", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove("dark")
  })

  it("calls onNewConversation directly when no messages", () => {
    const onNewConversation = jest.fn()
    render(
      <ConversationHeader
        messages={[]}
        onNewConversation={onNewConversation}
        isLoading={false}
        isNewConversationLoading={false}
      />,
    )

    fireEvent.click(screen.getByLabelText("Nova conversa"))
    expect(onNewConversation).toHaveBeenCalled()
  })

  it("shows confirm action when there are messages and confirms new conversation", () => {
    const onNewConversation = jest.fn()
    render(
      <ConversationHeader
        messages={[
          {
            id: "m1",
            role: "USER" as never,
            content: "Oi",
            timestamp: "2026-03-02T10:00:00.000Z",
          },
        ]}
        onNewConversation={onNewConversation}
        isLoading={false}
        isNewConversationLoading={false}
      />,
    )

    fireEvent.click(screen.getByText("Confirmar"))
    expect(onNewConversation).toHaveBeenCalled()
  })

  it("toggles theme and persists it", () => {
    render(
      <ConversationHeader
        messages={[]}
        onNewConversation={jest.fn()}
        isLoading={false}
        isNewConversationLoading={false}
      />,
    )

    fireEvent.click(screen.getByLabelText("Ativar tema escuro"))
    expect(localStorage.getItem("theme")).toBe("dark")
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  })
})
