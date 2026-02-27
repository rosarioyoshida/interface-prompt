export interface IterationHistoryEntry {
  conversationId: string
  title: string
  firstPromptRaw?: string
  createdAt: string
  firstPromptAt?: string
  lastActivatedAt: string
  messageCount: number
}

export interface ConversationHistoryState {
  version: number
  entries: IterationHistoryEntry[]
  activeConversationId?: string
}

export interface HistorySidebarUIState {
  isCollapsed: boolean
}
