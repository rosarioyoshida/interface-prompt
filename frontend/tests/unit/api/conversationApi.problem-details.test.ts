import { getConversation } from "@/lib/api/conversationApi"
import { ApiProblemError } from "@/lib/api/problemDetails"

describe("conversationApi Problem Details mapping", () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it("maps HTTP error payload to ApiProblemError", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      url: "/api/v1/conversations/conv-missing",
      headers: { get: () => "trace-404" },
      json: async () => ({
        type: "https://api.promptui.local/problems/not-found",
        title: "Nao encontrado",
        status: 404,
        detail: "Conversa nao existe",
      }),
    })

    await expect(getConversation("conv-missing")).rejects.toMatchObject({
      name: ApiProblemError.name,
      problem: expect.objectContaining({
        status: 404,
        traceId: "trace-404",
      }),
    })
  })
})
