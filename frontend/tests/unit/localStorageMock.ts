export function resetMockStorage() {
  try {
    window.localStorage.clear()
  } catch {
    // ignore for environments without localStorage
  }
}
