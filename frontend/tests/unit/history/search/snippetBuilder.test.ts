import { buildSnippet } from "@/lib/history/search/snippetBuilder"

describe("buildSnippet", () => {
  it("returns contextual snippet when query exists", () => {
    const snippet = buildSnippet("mensagem com termo menu lateral", "menu")
    expect(snippet.toLowerCase()).toContain("menu")
  })

  it("returns trimmed source when query is empty", () => {
    expect(buildSnippet("  texto base  ", "")).toBe("texto base")
  })
})
