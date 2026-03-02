import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { PromptInput } from "@/components/chat/PromptInput"

describe("PromptInput", () => {
  it("shows validation error for empty prompt", async () => {
    const onSend = jest.fn().mockResolvedValue(undefined)
    render(<PromptInput onSend={onSend} isLoading={false} />)

    fireEvent.click(screen.getByLabelText("Enviar prompt"))

    expect(
      await screen.findByText("O prompt não pode estar vazio."),
    ).toBeInTheDocument()
    expect(onSend).not.toHaveBeenCalled()
  })

  it("sends trimmed prompt and clears textarea", async () => {
    const onSend = jest.fn().mockResolvedValue(undefined)
    render(<PromptInput onSend={onSend} isLoading={false} />)

    const textarea = screen.getByLabelText("Campo de prompt")
    fireEvent.change(textarea, { target: { value: "   Olá mundo   " } })
    fireEvent.click(screen.getByLabelText("Enviar prompt"))

    await waitFor(() => expect(onSend).toHaveBeenCalledWith("Olá mundo"))
    expect((textarea as HTMLTextAreaElement).value).toBe("")
  })

  it("submits on Ctrl+Enter", async () => {
    const onSend = jest.fn().mockResolvedValue(undefined)
    render(<PromptInput onSend={onSend} isLoading={false} />)

    const textarea = screen.getByLabelText("Campo de prompt")
    fireEvent.change(textarea, { target: { value: "Teste Ctrl+Enter" } })
    fireEvent.keyDown(textarea, { key: "Enter", ctrlKey: true })

    await waitFor(() => expect(onSend).toHaveBeenCalledWith("Teste Ctrl+Enter"))
  })

  it("blocks send when content exceeds max length", async () => {
    const onSend = jest.fn().mockResolvedValue(undefined)
    render(<PromptInput onSend={onSend} isLoading={false} />)

    const textarea = screen.getByLabelText("Campo de prompt")
    fireEvent.change(textarea, { target: { value: "a".repeat(4097) } })
    const button = screen.getByLabelText("Enviar prompt")

    expect(button).toBeDisabled()
    expect(onSend).not.toHaveBeenCalled()
  })
})
