import { fireEvent, render, screen } from "@testing-library/react"
import { SearchChatsDialog } from "@/components/chat/SearchChatsDialog"

describe("SearchChatsDialog", () => {
  const result = {
    conversationId: "c1",
    snippet: "Trecho encontrado",
    messageDate: "2026-03-02T10:00:00.000Z",
    origin: "usuario" as const,
  }

  it("does not render when closed", () => {
    render(
      <SearchChatsDialog
        isOpen={false}
        query=""
        mode="recent"
        results={[]}
        onClose={jest.fn()}
        onQueryChange={jest.fn()}
        onResultClick={jest.fn()}
      />,
    )

    expect(screen.queryByRole("dialog", { name: /buscar em chats/i })).not.toBeInTheDocument()
  })

  it("calls query change and result click handlers", () => {
    const onQueryChange = jest.fn()
    const onResultClick = jest.fn()
    render(
      <SearchChatsDialog
        isOpen
        query=""
        mode="search"
        results={[result]}
        onClose={jest.fn()}
        onQueryChange={onQueryChange}
        onResultClick={onResultClick}
      />,
    )

    fireEvent.change(screen.getByPlaceholderText("Buscar em chats..."), {
      target: { value: "sidebar" },
    })
    fireEvent.click(screen.getByText("Trecho encontrado"))

    expect(onQueryChange).toHaveBeenCalledWith("sidebar")
    expect(onResultClick).toHaveBeenCalledWith(result)
  })

  it("closes on backdrop click and keeps open when clicking content", () => {
    const onClose = jest.fn()
    render(
      <SearchChatsDialog
        isOpen
        query=""
        mode="recent"
        results={[]}
        onClose={onClose}
        onQueryChange={jest.fn()}
        onResultClick={jest.fn()}
      />,
    )

    fireEvent.click(screen.getByRole("heading", { name: "Buscar em chats" }))
    expect(onClose).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole("dialog", { name: /buscar em chats/i }))
    expect(onClose).toHaveBeenCalled()
  })
})
