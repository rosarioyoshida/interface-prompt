import {
  clampSearchQuery,
  MAX_SEARCH_QUERY_LENGTH,
  normalizeSearchQuery,
} from "@/lib/history/search/validators"

describe("search validators", () => {
  it("normalizes case and trims spaces", () => {
    expect(normalizeSearchQuery("  MeNu  ")).toBe("menu")
  })

  it("clamps query length", () => {
    const query = "a".repeat(MAX_SEARCH_QUERY_LENGTH + 5)
    expect(clampSearchQuery(query)).toHaveLength(MAX_SEARCH_QUERY_LENGTH)
  })
})
