"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  createConversation,
  getConversation,
  sendPrompt as apiSendPrompt,
  deleteConversation,
} from "@/lib/api/conversationApi"
import { useConversationHistory } from "@/hooks/useConversationHistory"
import { ApiProblemError } from "@/lib/api/problemDetails"
import type { MessageResponse } from "@/lib/types/conversation"

interface UseConversationOptions {
  conversationId: string
}

interface UseConversationReturn {
  messages: MessageResponse[]
  isLoading: boolean
  isNewConversationLoading: boolean
  error: string | null
  sendPrompt: (content: string) => Promise<void>
  newConversation: () => Promise<void>
  clearError: () => void
}

const MAX_PROMPT_LENGTH = 4096

function buildErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiProblemError) {
    const detail = error.problem.detail || error.problem.title || fallback
    if (error.problem.traceId) {
      return `${detail} (traceId: ${error.problem.traceId})`
    }
    return detail
  }
  if (error instanceof Error) return error.message
  return fallback
}

export function useConversation({
  conversationId,
}: UseConversationOptions): UseConversationReturn {
  const router = useRouter()
  const {
    entries,
    upsertConversation,
    registerFirstPromptContext,
    activateConversation,
    removeConversation,
  } = useConversationHistory({ conversationId })
  const hadConversationInHistoryRef = useRef(false)
  const [messages, setMessages] = useState<MessageResponse[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isNewConversationLoading, setIsNewConversationLoading] =
    useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load existing conversation on mount
  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      try {
        const conversation = await getConversation(conversationId)
        if (!cancelled) {
          setMessages(conversation.messages)
          upsertConversation({
            conversationId,
            createdAt: conversation.createdAt,
          })
          activateConversation(conversationId, new Date().toISOString())
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiProblemError && err.problem.status === 404) {
            removeConversation(conversationId)
            router.push("/chat")
            return
          }

          const msg = buildErrorMessage(err, "Erro ao carregar conversa")
          if (
            msg.includes("404") ||
            msg.toLowerCase().includes("não foi encontrada")
          ) {
            removeConversation(conversationId)
            router.push("/chat")
          } else {
            setError(msg)
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [
    activateConversation,
    conversationId,
    removeConversation,
    router,
    upsertConversation,
  ])

  useEffect(() => {
    const hasConversationInHistory = entries.some(
      (entry) => entry.conversationId === conversationId,
    )
    if (hasConversationInHistory) {
      hadConversationInHistoryRef.current = true
      return
    }

    if (hadConversationInHistoryRef.current && !isLoading) {
      router.push("/chat")
    }
  }, [conversationId, entries, isLoading, router])

  const sendPrompt = useCallback(
    async (content: string) => {
      if (isLoading) return
      const normalizedContent = content.trim()
      if (!normalizedContent) {
        setError("O prompt não pode estar vazio.")
        return
      }
      if (normalizedContent.length > MAX_PROMPT_LENGTH) {
        setError(`O prompt não pode exceder ${MAX_PROMPT_LENGTH} caracteres.`)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await apiSendPrompt(conversationId, normalizedContent)
        setMessages((prev) => {
          const isFirstSuccessfulPrompt = prev.length === 0
          if (isFirstSuccessfulPrompt) {
            registerFirstPromptContext({
              conversationId,
              firstPromptContent: normalizedContent,
              occurredAt: result.userMessage.timestamp,
            })
          }
          return [...prev, result.userMessage, result.assistantMessage]
        })
        activateConversation(conversationId, result.userMessage.timestamp)
      } catch (err) {
        const msg = buildErrorMessage(err, "Erro ao enviar prompt")
        setError(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [
      activateConversation,
      conversationId,
      isLoading,
      registerFirstPromptContext,
    ],
  )

  const newConversation = useCallback(async () => {
    if (isLoading || isNewConversationLoading) return

    setIsNewConversationLoading(true)
    try {
      await deleteConversation(conversationId)
    } catch {
      // Ignore delete errors — conversation may have expired
    }

    try {
      const created = await createConversation()
      router.push(`/chat/${created.id}`)
    } catch (err) {
      const msg = buildErrorMessage(err, "Erro ao criar nova conversa")
      setError(msg)
      setIsNewConversationLoading(false)
    }
  }, [conversationId, isLoading, isNewConversationLoading, router])

  const clearError = useCallback(() => setError(null), [])

  return {
    messages,
    isLoading,
    isNewConversationLoading,
    error,
    sendPrompt,
    newConversation,
    clearError,
  }
}
