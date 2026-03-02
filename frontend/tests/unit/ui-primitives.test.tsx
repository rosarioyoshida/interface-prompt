import { render, screen } from "@testing-library/react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"

describe("UI primitives", () => {
  it("renders Badge with content", () => {
    render(<Badge>Ativo</Badge>)
    expect(screen.getByText("Ativo")).toBeInTheDocument()
  })

  it("renders ScrollArea content", () => {
    render(
      <ScrollArea className="h-10 w-10">
        <div>Conteúdo rolável</div>
      </ScrollArea>,
    )
    expect(screen.getByText("Conteúdo rolável")).toBeInTheDocument()
  })

  it("renders Separator", () => {
    const { container } = render(<Separator orientation="horizontal" />)
    expect(container.firstChild).toBeInTheDocument()
  })

  it("renders Skeleton with custom class", () => {
    const { container } = render(<Skeleton className="h-4 w-4" />)
    expect(container.firstChild).toHaveClass("animate-pulse")
  })

  it("renders Textarea and accepts placeholder", () => {
    render(<Textarea placeholder="Digite aqui" aria-label="texto" />)
    expect(screen.getByPlaceholderText("Digite aqui")).toBeInTheDocument()
  })
})
