"use client"

import { useEffect, useState } from "react"
import { Moon, Plus, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ConversationStatus,
  type MessageResponse,
} from "@/lib/types/conversation"

interface ConversationHeaderProps {
  messages: MessageResponse[]
  onNewConversation: () => void
  isLoading: boolean
  isNewConversationLoading: boolean
}

export function ConversationHeader({
  messages,
  onNewConversation,
  isLoading,
  isNewConversationLoading,
}: ConversationHeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme")
      if (stored === "dark" || stored === "light") {
        setTheme(stored)
        document.documentElement.classList.toggle("dark", stored === "dark")
      }
    } catch {
      // Ignore storage access errors
    }
  }, [])

  const isDisabled = isLoading || isNewConversationLoading
  const hasMessages = messages.length > 0

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    setTheme(nextTheme)
    try {
      localStorage.setItem("theme", nextTheme)
    } catch {
      // Ignore storage access errors
    }
    document.documentElement.classList.toggle("dark", nextTheme === "dark")
  }

  const newButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={isDisabled}
      onClick={hasMessages ? undefined : onNewConversation}
      aria-label="Nova conversa"
    >
      <Plus className="h-4 w-4" />
      Nova Conversa
    </Button>
  )

  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3">
      <h1 className="text-lg font-semibold">Chat com IA</h1>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
          }
        >
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
        {hasMessages ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>{newButton}</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Iniciar nova conversa?</AlertDialogTitle>
                <AlertDialogDescription>
                  O histórico atual será apagado permanentemente. Esta ação não
                  pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={onNewConversation}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          newButton
        )}
      </div>
    </header>
  )
}
