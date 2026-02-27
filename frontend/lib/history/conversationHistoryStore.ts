import type {
  ConversationHistoryState,
  HistorySidebarUIState,
  IterationHistoryEntry,
} from "@/lib/types/conversationHistory"

export const HISTORY_STORAGE_KEY = "prompt_ui.history.v1"
export const SIDEBAR_COLLAPSED_STORAGE_KEY =
  "prompt_ui.history.sidebar_collapsed.v1"
export const HISTORY_UPDATED_EVENT = "prompt_ui.history.updated"
export const SIDEBAR_UPDATED_EVENT = "prompt_ui.history.sidebar.updated"
export const HISTORY_VERSION = 1
export const HISTORY_MAX_ENTRIES = 20

const FALLBACK_TITLE = "Nova iteracao"
const memoryStore = new Map<string, string>()

interface StorageAdapter {
  getItem: (key: string) => string | null
  setItem: (key: string, value: string) => void
  removeItem: (key: string) => void
}

function getStorage(): StorageAdapter {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = "__history_probe__"
      window.localStorage.setItem(probe, "1")
      window.localStorage.removeItem(probe)
      return window.localStorage
    }
  } catch {
    // fall through to memory store
  }

  return {
    getItem: (key) => memoryStore.get(key) ?? null,
    setItem: (key, value) => {
      memoryStore.set(key, value)
    },
    removeItem: (key) => {
      memoryStore.delete(key)
    },
  }
}

function parseJson<T>(raw: string | null): T | undefined {
  if (!raw) return undefined
  try {
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function dispatchClientEvent(eventName: string): void {
  if (typeof window === "undefined") return
  window.dispatchEvent(new Event(eventName))
}

export function normalizePromptContext(input: string): string {
  return input.replace(/\s+/g, " ").trim()
}

export function truncateVisibleTitle(input: string, max = 60): string {
  if (input.length <= max) return input
  if (max <= 3) return input.slice(0, max)
  return `${input.slice(0, max - 3)}...`
}

export function sortByLastActivatedDesc(
  entries: IterationHistoryEntry[],
): IterationHistoryEntry[] {
  return [...entries].sort((a, b) => {
    const ta = new Date(a.lastActivatedAt).getTime()
    const tb = new Date(b.lastActivatedAt).getTime()
    return tb - ta
  })
}

export function capEntries(
  entries: IterationHistoryEntry[],
): IterationHistoryEntry[] {
  return sortByLastActivatedDesc(entries).slice(0, HISTORY_MAX_ENTRIES)
}

export function defaultHistoryState(): ConversationHistoryState {
  return {
    version: HISTORY_VERSION,
    entries: [],
  }
}

export function defaultSidebarState(): HistorySidebarUIState {
  return { isCollapsed: false }
}

export function readHistoryState(): ConversationHistoryState {
  const storage = getStorage()
  const parsed = parseJson<ConversationHistoryState>(
    storage.getItem(HISTORY_STORAGE_KEY),
  )
  if (!parsed || !Array.isArray(parsed.entries)) return defaultHistoryState()

  const normalized = {
    version: HISTORY_VERSION,
    activeConversationId: parsed.activeConversationId,
    entries: parsed.entries.map((entry) => ({
      ...entry,
      title: entry.title || FALLBACK_TITLE,
      messageCount: Number.isFinite(entry.messageCount)
        ? entry.messageCount
        : 0,
    })),
  }

  return {
    ...normalized,
    entries: capEntries(normalized.entries),
  }
}

export function writeHistoryState(state: ConversationHistoryState): void {
  const storage = getStorage()
  const normalized: ConversationHistoryState = {
    version: HISTORY_VERSION,
    activeConversationId: state.activeConversationId,
    entries: capEntries(state.entries),
  }
  storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(normalized))
  dispatchClientEvent(HISTORY_UPDATED_EVENT)
}

export function readSidebarState(): HistorySidebarUIState {
  const storage = getStorage()
  return (
    parseJson<HistorySidebarUIState>(
      storage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY),
    ) ?? defaultSidebarState()
  )
}

export function writeSidebarState(state: HistorySidebarUIState): void {
  const storage = getStorage()
  storage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, JSON.stringify(state))
  dispatchClientEvent(SIDEBAR_UPDATED_EVENT)
}

export function mergeHistoryStates(
  current: ConversationHistoryState,
  incoming: ConversationHistoryState,
): ConversationHistoryState {
  const byId = new Map<string, IterationHistoryEntry>()

  const apply = (entry: IterationHistoryEntry) => {
    const existing = byId.get(entry.conversationId)
    if (!existing) {
      byId.set(entry.conversationId, entry)
      return
    }

    const existingTs = new Date(existing.lastActivatedAt).getTime()
    const incomingTs = new Date(entry.lastActivatedAt).getTime()
    const primary = incomingTs >= existingTs ? entry : existing
    const secondary = incomingTs >= existingTs ? existing : entry

    byId.set(entry.conversationId, {
      ...secondary,
      ...primary,
      title: primary.title || secondary.title || FALLBACK_TITLE,
      firstPromptRaw: primary.firstPromptRaw ?? secondary.firstPromptRaw,
      firstPromptAt: primary.firstPromptAt ?? secondary.firstPromptAt,
      messageCount: Math.max(existing.messageCount, entry.messageCount),
    })
  }

  current.entries.forEach(apply)
  incoming.entries.forEach(apply)

  return {
    version: HISTORY_VERSION,
    activeConversationId:
      incoming.activeConversationId ?? current.activeConversationId,
    entries: capEntries(Array.from(byId.values())),
  }
}

export function upsertConversation(
  state: ConversationHistoryState,
  params: { conversationId: string; createdAt: string },
): ConversationHistoryState {
  const now = new Date().toISOString()
  const existing = state.entries.find(
    (e) => e.conversationId === params.conversationId,
  )

  const updated: IterationHistoryEntry = existing
    ? {
        ...existing,
        createdAt: existing.createdAt || params.createdAt,
        lastActivatedAt: now,
      }
    : {
        conversationId: params.conversationId,
        title: FALLBACK_TITLE,
        createdAt: params.createdAt,
        lastActivatedAt: now,
        messageCount: 0,
      }

  return {
    ...state,
    activeConversationId: params.conversationId,
    entries: capEntries([
      updated,
      ...state.entries.filter(
        (e) => e.conversationId !== params.conversationId,
      ),
    ]),
  }
}

export function registerFirstPromptContext(
  state: ConversationHistoryState,
  params: {
    conversationId: string
    firstPromptContent: string
    occurredAt: string
  },
): ConversationHistoryState {
  const normalizedTitle =
    truncateVisibleTitle(
      normalizePromptContext(params.firstPromptContent),
      60,
    ) || FALLBACK_TITLE

  return {
    ...state,
    entries: capEntries(
      state.entries.map((entry) => {
        if (entry.conversationId !== params.conversationId) return entry
        if (entry.firstPromptAt) return entry

        return {
          ...entry,
          title: normalizedTitle,
          firstPromptRaw: params.firstPromptContent,
          firstPromptAt: params.occurredAt,
          messageCount: Math.max(entry.messageCount, 2),
        }
      }),
    ),
  }
}

export function activateConversation(
  state: ConversationHistoryState,
  conversationId: string,
  occurredAt: string,
): ConversationHistoryState {
  return {
    ...state,
    activeConversationId: conversationId,
    entries: capEntries(
      state.entries.map((entry) =>
        entry.conversationId === conversationId
          ? { ...entry, lastActivatedAt: occurredAt }
          : entry,
      ),
    ),
  }
}

export function removeConversation(
  state: ConversationHistoryState,
  conversationId: string,
): ConversationHistoryState {
  const activeConversationId =
    state.activeConversationId === conversationId
      ? undefined
      : state.activeConversationId

  return {
    ...state,
    activeConversationId,
    entries: state.entries.filter(
      (entry) => entry.conversationId !== conversationId,
    ),
  }
}

export interface RemoveConversationPersistResult {
  ok: boolean
  state: ConversationHistoryState
  errorMessage?: string
}

export function removeConversationPersisted(
  state: ConversationHistoryState,
  conversationId: string,
): RemoveConversationPersistResult {
  const nextState = removeConversation(state, conversationId)
  try {
    writeHistoryState(nextState)
    return { ok: true, state: nextState }
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Não foi possível excluir o histórico."
    return { ok: false, state, errorMessage }
  }
}
