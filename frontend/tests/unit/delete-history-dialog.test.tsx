import { fireEvent, render, screen } from "@testing-library/react"
import { DeleteHistoryDialog } from "@/components/chat/DeleteHistoryDialog"

describe("DeleteHistoryDialog", () => {
  it("renders error message when provided", () => {
    render(
      <DeleteHistoryDialog
        isOpen
        isSubmitting={false}
        errorMessage="Falha ao excluir"
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    )

    expect(screen.getByRole("alert")).toHaveTextContent("Falha ao excluir")
  })

  it("calls confirm and cancel handlers", () => {
    const onCancel = jest.fn()
    const onConfirm = jest.fn()
    render(
      <DeleteHistoryDialog
        isOpen
        isSubmitting={false}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    )

    fireEvent.click(screen.getByRole("button", { name: "Excluir" }))
    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(onConfirm).toHaveBeenCalled()
    expect(onCancel).toHaveBeenCalled()
  })

  it("disables actions while submitting", () => {
    render(
      <DeleteHistoryDialog
        isOpen
        isSubmitting
        onCancel={jest.fn()}
        onConfirm={jest.fn()}
      />,
    )

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Excluindo..." })).toBeDisabled()
  })
})
