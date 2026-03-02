import { render, screen } from "@testing-library/react"
import { SearchResultList } from "@/components/chat/SearchResultList"

describe("SearchResultList date format", () => {
  it("renders date using app locale formatter", () => {
    render(
      <SearchResultList
        mode="search"
        onSelect={jest.fn()}
        results={[
          {
            conversationId: "conv-1",
            snippet: "resultado",
            messageDate: "2026-03-02T12:34:00.000Z",
            origin: "usuario",
          },
        ]}
      />,
    )

    expect(screen.getByText(/Mensagem enviada/i)).toBeInTheDocument()
    expect(screen.getByText(/resultado/i)).toBeInTheDocument()
  })
})
