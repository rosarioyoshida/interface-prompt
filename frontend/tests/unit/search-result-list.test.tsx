import { fireEvent, render, screen } from "@testing-library/react"
import { SearchResultList } from "@/components/chat/SearchResultList"

describe("SearchResultList", () => {
  it("shows empty message for recent mode", () => {
    render(<SearchResultList mode="recent" results={[]} onSelect={jest.fn()} />)

    expect(
      screen.getByText("Nenhum histórico encontrado nos últimos 7 dias."),
    ).toBeInTheDocument()
  })

  it("shows empty message for search mode", () => {
    render(<SearchResultList mode="search" results={[]} onSelect={jest.fn()} />)

    expect(
      screen.getByText("Nenhum resultado encontrado para o termo informado."),
    ).toBeInTheDocument()
  })

  it("emits selected result on click", () => {
    const onSelect = jest.fn()
    const result = {
      conversationId: "c1",
      snippet: "Trecho de busca",
      messageDate: "2026-03-02T12:00:00.000Z",
      origin: "usuario" as const,
    }

    render(<SearchResultList mode="search" results={[result]} onSelect={onSelect} />)

    fireEvent.click(screen.getByText("Trecho de busca"))

    expect(onSelect).toHaveBeenCalledWith(result)
  })
})
