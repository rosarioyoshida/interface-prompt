"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createConversation } from "@/lib/api/conversationApi"

export default function ChatIndexPage() {
  const router = useRouter()

  useEffect(() => {
    createConversation()
      .then((c) => router.replace(`/chat/${c.id}`))
      .catch(() => {
        // Retry after a short delay if the API isn't ready yet
        setTimeout(() => {
          createConversation()
            .then((c) => router.replace(`/chat/${c.id}`))
            .catch(console.error)
        }, 2000)
      })
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-muted-foreground">Iniciando conversa...</p>
    </div>
  )
}
