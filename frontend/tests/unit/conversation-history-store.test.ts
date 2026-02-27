import {
  activateConversation,
  capEntries,
  defaultHistoryState,
  readHistoryState,
  registerFirstPromptContext,
  truncateVisibleTitle,
  upsertConversation,
  writeHistoryState,
} from "@/lib/history/conversationHistoryStore"

describe("conversationHistoryStore", () => {
  beforeEach(() => {
    localStorage.clear()
    writeHistoryState(defaultHistoryState())
  })

  it("upsert conversation and mark as active", () => {
    const state = upsertConversation(defaultHistoryState(), {
      conversationId: "c1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    expect(state.entries).toHaveLength(1)
    expect(state.activeConversationId).toBe("c1")
  })

  it("registers first prompt only once", () => {
    const base = upsertConversation(defaultHistoryState(), {
      conversationId: "c1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    const first = registerFirstPromptContext(base, {
      conversationId: "c1",
      firstPromptContent: "Primeiro prompt",
      occurredAt: "2026-01-01T00:00:10.000Z",
    })

    const second = registerFirstPromptContext(first, {
      conversationId: "c1",
      firstPromptContent: "Outro titulo",
      occurredAt: "2026-01-01T00:00:12.000Z",
    })

    expect(first.entries[0].title).toBe("Primeiro prompt")
    expect(second.entries[0].title).toBe("Primeiro prompt")
  })

  it("keeps only 20 most recent entries", () => {
    const entries = Array.from({ length: 25 }).map((_, idx) => ({
      conversationId: `c-${idx}`,
      title: `t-${idx}`,
      createdAt: "2026-01-01T00:00:00.000Z",
      lastActivatedAt: new Date(2026, 0, 1, 0, idx, 0).toISOString(),
      messageCount: 0,
    }))

    const capped = capEntries(entries)
    expect(capped).toHaveLength(20)
    expect(capped[0].conversationId).toBe("c-24")
    expect(capped[19].conversationId).toBe("c-5")
  })

  it("activates conversation updating timestamp", () => {
    const base = upsertConversation(defaultHistoryState(), {
      conversationId: "c1",
      createdAt: "2026-01-01T00:00:00.000Z",
    })

    const activated = activateConversation(
      base,
      "c1",
      "2026-01-01T00:10:00.000Z",
    )
    expect(activated.entries[0].lastActivatedAt).toBe(
      "2026-01-01T00:10:00.000Z",
    )
  })

  it("truncates title to 60 chars", () => {
    const long = "a".repeat(80)
    const title = truncateVisibleTitle(long, 60)
    expect(title).toHaveLength(60)
    expect(title.endsWith("...")).toBe(true)
  })

  it("reads persisted state", () => {
    const state = upsertConversation(defaultHistoryState(), {
      conversationId: "c2",
      createdAt: "2026-01-01T00:00:00.000Z",
    })
    writeHistoryState(state)

    const loaded = readHistoryState()
    expect(loaded.entries[0].conversationId).toBe("c2")
  })
})
