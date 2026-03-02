import { isProblemDetails, normalizeProblemDetails } from "@/lib/api/problemDetails"

describe("problemDetails api contract", () => {
  it("normalizes valid payload and keeps traceId", () => {
    const normalized = normalizeProblemDetails(
      {
        type: "https://api.promptui.local/problems/not-found",
        title: "Nao encontrado",
        status: 404,
        detail: "Item nao encontrado",
      },
      { status: 404, traceId: "trace-1" },
    )

    expect(normalized?.traceId).toBe("trace-1")
    expect(isProblemDetails(normalized)).toBe(true)
  })
})
