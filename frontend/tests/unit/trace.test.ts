import { createTraceId } from "@/lib/observability/trace"

describe("createTraceId", () => {
  it("returns a non-empty id", () => {
    const traceId = createTraceId()

    expect(typeof traceId).toBe("string")
    expect(traceId.length).toBeGreaterThan(10)
  })
})
