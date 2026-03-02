import { readHistoryState, writeHistoryState } from "@/lib/history/conversationHistoryStore"

describe("conversationHistoryStore search readiness", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("keeps searchable firstPromptRaw and firstPromptAt on read", () => {
    writeHistoryState({
      version: 1,
      entries: [
        {
          conversationId: "conv-1",
          title: "Conversa",
          firstPromptRaw: "buscar historico",
          firstPromptAt: "2026-03-02T10:00:00.000Z",
          createdAt: "2026-03-02T10:00:00.000Z",
          lastActivatedAt: "2026-03-02T10:01:00.000Z",
          messageCount: 2,
        },
      ],
    })

    const state = readHistoryState()
    expect(state.entries[0].firstPromptRaw).toBe("buscar historico")
    expect(state.entries[0].firstPromptAt).toBe("2026-03-02T10:00:00.000Z")
  })
})
