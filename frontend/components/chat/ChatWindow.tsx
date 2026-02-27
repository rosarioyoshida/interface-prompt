"use client"

import { MessageBubble } from "@/components/chat/MessageBubble"
import { Skeleton } from "@/components/ui/skeleton"
import { useAutoScroll } from "@/hooks/useAutoScroll"
import type { MessageResponse } from "@/lib/types/conversation"

interface ChatWindowProps {
  messages: MessageResponse[]
  isLoading: boolean
}

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  const { containerRef } = useAutoScroll({ dependency: messages })

  const showSkeletons = isLoading && messages.length === 0

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-4"
      aria-label="Área de conversa"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {showSkeletons && (
          <>
            <div className="flex justify-end">
              <Skeleton className="h-12 w-48 rounded-2xl rounded-tr-sm" />
            </div>
            <div className="flex justify-start">
              <Skeleton className="h-16 w-64 rounded-2xl rounded-tl-sm" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-36 rounded-2xl rounded-tr-sm" />
            </div>
          </>
        )}

        {!showSkeletons && messages.length === 0 && (
          <div className="flex h-full items-center justify-center py-20">
            <p className="text-center text-muted-foreground">
              Comece digitando um prompt abaixo.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  )
}
