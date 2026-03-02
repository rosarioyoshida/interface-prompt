import { act, renderHook } from "@testing-library/react"
import { useAutoScroll } from "@/hooks/useAutoScroll"

function createScrollableElement() {
  const el = document.createElement("div")
  Object.defineProperty(el, "scrollHeight", { value: 1000, configurable: true })
  Object.defineProperty(el, "clientHeight", { value: 100, configurable: true })
  Object.defineProperty(el, "scrollTop", {
    value: 0,
    writable: true,
    configurable: true,
  })
  return el
}

describe("useAutoScroll", () => {
  it("scrolls to bottom when scrollToBottom is called", () => {
    const { result } = renderHook(({ dep }) => useAutoScroll({ dependency: dep }), {
      initialProps: { dep: 1 },
    })

    const el = createScrollableElement()
    result.current.containerRef.current = el

    act(() => {
      result.current.scrollToBottom()
    })

    expect(el.scrollTop).toBe(1000)
  })

  it("returns stable API with containerRef and function", () => {
    const { result } = renderHook(() => useAutoScroll({ dependency: "x" }))
    expect(result.current.containerRef).toBeDefined()
    expect(typeof result.current.scrollToBottom).toBe("function")
  })
})
