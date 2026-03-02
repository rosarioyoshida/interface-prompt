import { buildChatHistoryResults } from "@/lib/history/search/searchHistory"
import type { IterationHistoryEntry } from "@/lib/types/conversationHistory"

describe("buildChatHistoryResults", () => {
  const now = new Date("2026-03-02T12:00:00.000Z")
  const entries: IterationHistoryEntry[] = [
    {
      conversationId: "c-recent",
      title: "Bug no sidebar",
      firstPromptRaw: "Como corrigir bug no menu lateral?",
      createdAt: "2026-03-01T09:00:00.000Z",
      firstPromptAt: "2026-03-01T09:00:00.000Z",
      lastActivatedAt: "2026-03-01T09:30:00.000Z",
      messageCount: 2,
    },
    {
      conversationId: "c-old",
      title: "Conversa antiga",
      firstPromptRaw: "Assunto sem relacao",
      createdAt: "2026-02-20T09:00:00.000Z",
      firstPromptAt: "2026-02-20T09:00:00.000Z",
      lastActivatedAt: "2026-02-20T09:30:00.000Z",
      messageCount: 2,
    },
  ]

  it("returns only recent entries when query is empty", () => {
    const results = buildChatHistoryResults({
      entries,
      query: "",
      now,
    })

    expect(results).toHaveLength(1)
    expect(results[0].conversationId).toBe("c-recent")
  })

  it("returns matches outside recent window when query is informed", () => {
    const results = buildChatHistoryResults({
      entries,
      query: "assunto",
      now,
    })

    expect(results).toHaveLength(1)
    expect(results[0].conversationId).toBe("c-old")
    expect(results[0].snippet.toLocaleLowerCase()).toContain("assunto")
  })
})
