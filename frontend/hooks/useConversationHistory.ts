"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  ConversationHistoryState,
  IterationHistoryEntry,
} from "@/lib/types/conversationHistory"
import {
  HISTORY_STORAGE_KEY,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  activateConversation as activateConversationState,
  defaultHistoryState,
  mergeHistoryStates,
  readHistoryState,
  readSidebarState,
  registerFirstPromptContext as registerFirstPromptContextState,
  removeConversation as removeConversationState,
  upsertConversation as upsertConversationState,
  writeHistoryState,
  writeSidebarState,
} from "@/lib/history/conversationHistoryStore"

interface UseConversationHistoryInput {
  conversationId?: string
}

interface UseConversationHistoryOutput {
  entries: IterationHistoryEntry[]
  activeConversationId?: string
  isCollapsed: boolean
  upsertConversation: (params: {
    conversationId: string
    createdAt: string
  }) => void
  registerFirstPromptContext: (params: {
    conversationId: string
    firstPromptContent: string
    occurredAt: string
  }) => void
  activateConversation: (conversationId: string, occurredAt: string) => void
  removeConversation: (conversationId: string) => void
  toggleSidebar: () => void
}

export function useConversationHistory({
  conversationId,
}: UseConversationHistoryInput): UseConversationHistoryOutput {
  const [historyState, setHistoryState] = useState<ConversationHistoryState>(
    () => readHistoryState(),
  )
  const [isCollapsed, setIsCollapsed] = useState<boolean>(
    () => readSidebarState().isCollapsed,
  )

  useEffect(() => {
    if (!conversationId) return

    setHistoryState((prev) => {
      const next = activateConversationState(
        prev,
        conversationId,
        new Date().toISOString(),
      )
      writeHistoryState(next)
      return next
    })
  }, [conversationId])

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === HISTORY_STORAGE_KEY) {
        const incoming = readHistoryState()
        setHistoryState((prev) => mergeHistoryStates(prev, incoming))
      }

      if (event.key === SIDEBAR_COLLAPSED_STORAGE_KEY) {
        setIsCollapsed(readSidebarState().isCollapsed)
      }
    }

    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const upsertConversation = useCallback(
    (params: { conversationId: string; createdAt: string }) => {
      setHistoryState((prev) => {
        const next = upsertConversationState(prev, params)
        writeHistoryState(next)
        return next
      })
    },
    [],
  )

  const registerFirstPromptContext = useCallback(
    (params: {
      conversationId: string
      firstPromptContent: string
      occurredAt: string
    }) => {
      setHistoryState((prev) => {
        const next = registerFirstPromptContextState(prev, params)
        writeHistoryState(next)
        return next
      })
    },
    [],
  )

  const activateConversation = useCallback((id: string, occurredAt: string) => {
    setHistoryState((prev) => {
      const next = activateConversationState(prev, id, occurredAt)
      writeHistoryState(next)
      return next
    })
  }, [])

  const removeConversation = useCallback((id: string) => {
    setHistoryState((prev) => {
      const next = removeConversationState(prev, id)
      writeHistoryState(next)
      return next
    })
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      writeSidebarState({ isCollapsed: next })
      return next
    })
  }, [])

  const entries = useMemo(() => historyState.entries, [historyState.entries])

  return {
    entries,
    activeConversationId: historyState.activeConversationId,
    isCollapsed,
    upsertConversation,
    registerFirstPromptContext,
    activateConversation,
    removeConversation,
    toggleSidebar,
  }
}

export function resetConversationHistoryStateForTests(): void {
  writeHistoryState(defaultHistoryState())
  writeSidebarState({ isCollapsed: false })
}
