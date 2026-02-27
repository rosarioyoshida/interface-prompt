"use client"

import { use, useEffect } from "react"
import { toast } from "sonner"
import { ChatWindow } from "@/components/chat/ChatWindow"
import { ConversationHeader } from "@/components/chat/ConversationHeader"
import { PromptInput } from "@/components/chat/PromptInput"
import { useConversation } from "@/hooks/useConversation"

interface ChatPageProps {
  params: Promise<{ id: string }>
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id } = use(params)
  const { messages, isLoading, isNewConversationLoading, error, sendPrompt, newConversation, clearError } =
    useConversation({ conversationId: id })

  useEffect(() => {
    if (error) {
      toast.error(error, {
        description: "Tente novamente.",
        duration: 5000,
        onDismiss: clearError,
      })
    }
  }, [error, clearError])

  return (
    <>
      <ConversationHeader
        messages={messages}
        onNewConversation={newConversation}
        isLoading={isLoading}
        isNewConversationLoading={isNewConversationLoading}
      />
      <ChatWindow messages={messages} isLoading={isLoading} />
      <PromptInput onSend={sendPrompt} isLoading={isLoading} />
    </>
  )
}
