import {
  createConversation,
  deleteConversation,
  getConversation,
  sendPrompt,
} from "@/lib/api/conversationApi"
import { ApiProblemError } from "@/lib/api/problemDetails"
import { ConversationStatus, MessageRole } from "@/lib/types/conversation"

describe("conversationApi", () => {
  const fetchMock = jest.fn()

  beforeEach(() => {
    fetchMock.mockReset()
    global.fetch = fetchMock as unknown as typeof fetch
  })

  it("creates a conversation on success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: "conv-1",
        status: ConversationStatus.EMPTY,
        messages: [],
        createdAt: "2026-03-02T10:00:00.000Z",
        _links: {},
      }),
    })

    const result = await createConversation()

    expect(result.id).toBe("conv-1")
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/conversations",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Trace-Id": expect.any(String),
        }),
        body: "{}",
      }),
    )
  })

  it("throws ApiProblemError when backend returns Problem Details", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      url: "/api/v1/conversations/missing-id",
      headers: { get: () => "trace-404" },
      json: async () => ({
        type: "https://api.promptui.local/problems/not-found",
        title: "Recurso não encontrado",
        status: 404,
        detail: "Conversa não foi encontrada",
      }),
    })

    await expect(getConversation("missing-id")).rejects.toMatchObject({
      name: ApiProblemError.name,
      problem: {
        status: 404,
        traceId: "trace-404",
      },
    })
  })

  it("normalizes problem detail using title and header trace id fallback", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      url: "/api/v1/conversations/conv-1/prompts",
      headers: { get: () => "trace-500" },
      json: async () => ({
        type: "https://api.promptui.local/problems/internal-error",
        title: "Erro Interno",
        status: 500,
      }),
    })

    await expect(sendPrompt("conv-1", "oi")).rejects.toMatchObject({
      name: ApiProblemError.name,
      message: "Erro Interno",
      problem: {
        status: 500,
        detail: "Erro Interno",
        traceId: "trace-500",
      },
    })
  })

  it("falls back to generic HTTP error when error payload is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error("invalid json")
      },
    })

    await expect(sendPrompt("conv-1", "oi")).rejects.toThrow("HTTP 503")
  })

  it("returns undefined for 204 responses", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => {
        throw new Error("should not be called")
      },
    })

    const result = await deleteConversation("conv-1")

    expect(result).toBeUndefined()
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/conversations/conv-1",
      expect.objectContaining({
        method: "DELETE",
        headers: expect.objectContaining({
          "X-Trace-Id": expect.any(String),
        }),
      }),
    )
  })

  it("sends prompt payload to expected endpoint", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        conversationId: "conv-1",
        userMessage: {
          id: "m-user",
          role: MessageRole.USER,
          content: "Olá",
          timestamp: "2026-03-02T10:00:00.000Z",
        },
        assistantMessage: {
          id: "m-assistant",
          role: MessageRole.ASSISTANT,
          content: "Oi!",
          timestamp: "2026-03-02T10:00:01.000Z",
        },
        _links: {},
      }),
    })

    await sendPrompt("conv-1", "Olá")

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/conversations/conv-1/prompts",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          "X-Trace-Id": expect.any(String),
        }),
        body: JSON.stringify({ content: "Olá" }),
      }),
    )
  })
})
