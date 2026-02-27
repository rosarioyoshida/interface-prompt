import {
  normalizePromptContext,
  truncateVisibleTitle,
} from "@/lib/history/conversationHistoryStore"

describe("first prompt title", () => {
  it("normalizes whitespace before title generation", () => {
    expect(normalizePromptContext("  Ola   mundo  ")).toBe("Ola mundo")
  })

  it("truncates long title to 60 chars", () => {
    const long = "x".repeat(90)
    const title = truncateVisibleTitle(long, 60)
    expect(title).toHaveLength(60)
  })
})
