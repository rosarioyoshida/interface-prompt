import type { SearchMode, SearchResultItem } from "@/lib/history/search/types"

describe("search types", () => {
  it("accepts recent and search modes", () => {
    const modes: SearchMode[] = ["recent", "search"]
    expect(modes).toHaveLength(2)
  })

  it("keeps result shape stable", () => {
    const result: SearchResultItem = {
      conversationId: "conv-1",
      snippet: "trecho",
      messageDate: "2026-03-02T10:00:00.000Z",
      origin: "usuario",
    }

    expect(result.conversationId).toBe("conv-1")
    expect(result.origin).toBe("usuario")
  })
})
