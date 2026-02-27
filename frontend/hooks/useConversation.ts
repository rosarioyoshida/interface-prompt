"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  createConversation,
  getConversation,
  sendPrompt as apiSendPrompt,
  deleteConversation,
} from "@/lib/api/conversationApi"
import { useConversationHistory } from "@/hooks/useConversationHistory"
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

export function useConversation({
  conversationId,
}: UseConversationOptions): UseConversationReturn {
  const router = useRouter()
  const {
    upsertConversation,
    registerFirstPromptContext,
    activateConversation,
    removeConversation,
  } = useConversationHistory({ conversationId })
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
          const msg =
            err instanceof Error ? err.message : "Erro ao carregar conversa"
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

  const sendPrompt = useCallback(
    async (content: string) => {
      if (isLoading) return

      setIsLoading(true)
      setError(null)

      try {
        const result = await apiSendPrompt(conversationId, content)
        setMessages((prev) => {
          const isFirstSuccessfulPrompt = prev.length === 0
          if (isFirstSuccessfulPrompt) {
            registerFirstPromptContext({
              conversationId,
              firstPromptContent: content,
              occurredAt: result.userMessage.timestamp,
            })
          }
          return [...prev, result.userMessage, result.assistantMessage]
        })
        activateConversation(conversationId, result.userMessage.timestamp)
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro ao enviar prompt"
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
      const msg =
        err instanceof Error ? err.message : "Erro ao criar nova conversa"
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
