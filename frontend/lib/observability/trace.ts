export function createTraceId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }

  const randomPart = Math.random().toString(16).slice(2, 14)
  const timePart = Date.now().toString(16)
  return `trace-${timePart}-${randomPart}`
}
