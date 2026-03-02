import {
  ApiProblemError,
  isProblemDetails,
  normalizeProblemDetails,
  type ProblemDetails,
} from "@/lib/api/problemDetails"

describe("problemDetails helpers", () => {
  it("validates a well-formed Problem Details payload", () => {
    const payload: ProblemDetails = {
      type: "https://api.promptui.local/problems/not-found",
      title: "Recurso não encontrado",
      status: 404,
      detail: "Conversa não foi encontrada",
      traceId: "trace-123",
    }

    expect(isProblemDetails(payload)).toBe(true)
  })

  it("rejects malformed Problem Details payload", () => {
    expect(
      isProblemDetails({
        type: "https://api.promptui.local/problems/not-found",
        title: "Recurso não encontrado",
        status: "404",
        detail: "Conversa não foi encontrada",
      }),
    ).toBe(false)
  })

  it("accepts payload without detail and normalizes with title", () => {
    const normalized = normalizeProblemDetails({
      type: "https://api.promptui.local/problems/internal-error",
      title: "Erro Interno",
      status: 500,
    })

    expect(normalized).toEqual({
      type: "https://api.promptui.local/problems/internal-error",
      title: "Erro Interno",
      status: 500,
      detail: "Erro Interno",
      instance: undefined,
      traceId: undefined,
      errors: undefined,
    })
  })

  it("stores the original payload in ApiProblemError", () => {
    const payload: ProblemDetails = {
      type: "https://api.promptui.local/problems/validation-error",
      title: "Erro de Validação",
      status: 422,
      detail: "Um ou mais campos possuem valores inválidos.",
      traceId: "trace-422",
      errors: [
        { name: "content", reason: "Não pode ser vazio", location: "body" },
      ],
    }

    const error = new ApiProblemError(payload)

    expect(error.name).toBe("ApiProblemError")
    expect(error.message).toBe(payload.detail)
    expect(error.problem).toEqual(payload)
  })
})
