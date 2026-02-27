"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import type {
  ConversationHistoryState,
  DeleteConfirmationState,
  IterationHistoryEntry,
} from "@/lib/types/conversationHistory"
import {
  HISTORY_STORAGE_KEY,
  HISTORY_UPDATED_EVENT,
  SIDEBAR_COLLAPSED_STORAGE_KEY,
  SIDEBAR_UPDATED_EVENT,
  activateConversation as activateConversationState,
  defaultHistoryState,
  mergeHistoryStates,
  readHistoryState,
  readSidebarState,
  registerFirstPromptContext as registerFirstPromptContextState,
  removeConversation as removeConversationState,
  removeConversationPersisted,
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
  requestDeleteConversation: (conversationId: string) => void
  cancelDeleteConversation: () => void
  confirmDeleteConversation: () => boolean
  deleteConfirmation: DeleteConfirmationState
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
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      isOpen: false,
      isSubmitting: false,
    })

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
    const onHistoryUpdated = () => {
      setHistoryState(readHistoryState())
    }
    const onSidebarUpdated = () => {
      setIsCollapsed(readSidebarState().isCollapsed)
    }

    window.addEventListener("storage", onStorage)
    window.addEventListener(HISTORY_UPDATED_EVENT, onHistoryUpdated)
    window.addEventListener(SIDEBAR_UPDATED_EVENT, onSidebarUpdated)
    return () => {
      window.removeEventListener("storage", onStorage)
      window.removeEventListener(HISTORY_UPDATED_EVENT, onHistoryUpdated)
      window.removeEventListener(SIDEBAR_UPDATED_EVENT, onSidebarUpdated)
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

  const requestDeleteConversation = useCallback((id: string) => {
    setDeleteConfirmation({
      conversationId: id,
      isOpen: true,
      isSubmitting: false,
      errorMessage: undefined,
    })
  }, [])

  const cancelDeleteConversation = useCallback(() => {
    setDeleteConfirmation({
      isOpen: false,
      isSubmitting: false,
      errorMessage: undefined,
      conversationId: undefined,
    })
  }, [])

  const confirmDeleteConversation = useCallback((): boolean => {
    const targetConversationId = deleteConfirmation.conversationId
    if (!targetConversationId) return false

    setDeleteConfirmation((prev) => ({
      ...prev,
      isSubmitting: true,
        errorMessage: undefined,
    }))

    const result = removeConversationPersisted(historyState, targetConversationId)
    if (result.ok) {
      setHistoryState(result.state)
      setDeleteConfirmation({
        isOpen: false,
        isSubmitting: false,
        conversationId: undefined,
        errorMessage: undefined,
      })
      return true
    }

    setDeleteConfirmation((current) => ({
      ...current,
      isSubmitting: false,
      errorMessage: result.errorMessage ?? "Não foi possível excluir o histórico.",
    }))
    return false
  }, [deleteConfirmation.conversationId, historyState])

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
    requestDeleteConversation,
    cancelDeleteConversation,
    confirmDeleteConversation,
    deleteConfirmation,
    toggleSidebar,
  }
}

export function resetConversationHistoryStateForTests(): void {
  writeHistoryState(defaultHistoryState())
  writeSidebarState({ isCollapsed: false })
}
