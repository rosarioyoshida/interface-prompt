import {
  mergeHistoryStates,
  upsertConversation,
  defaultHistoryState,
} from "@/lib/history/conversationHistoryStore"

describe("multitab merge", () => {
  it("keeps newest lastActivatedAt by conversationId", () => {
    const base = upsertConversation(defaultHistoryState(), {
      conversationId: "c1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    const incoming = {
      ...base,
      entries: [
        {
          ...base.entries[0],
          title: "Novo titulo",
          lastActivatedAt: "2099-01-01T10:00:00.000Z",
        },
      ],
    }

    const merged = mergeHistoryStates(base, incoming)
    expect(merged.entries[0].title).toBe("Novo titulo")
  })
})
