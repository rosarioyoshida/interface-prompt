import { capEntries } from "@/lib/history/conversationHistoryStore"

describe("history limit", () => {
  it("drops older entries over 20", () => {
    const entries = Array.from({ length: 21 }).map((_, idx) => ({
      conversationId: `id-${idx}`,
      title: `title-${idx}`,
      createdAt: "2026-01-01T00:00:00.000Z",
      lastActivatedAt: new Date(2026, 0, 1, 0, idx, 0).toISOString(),
      messageCount: 0,
    }))

    const result = capEntries(entries)
    expect(result).toHaveLength(20)
    expect(result.some((x) => x.conversationId === "id-0")).toBe(false)
  })
})
