"use client"

import { useState, useRef, useCallback } from "react"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const MAX_LENGTH = 4096

interface PromptInputProps {
  onSend: (content: string) => Promise<void>
  isLoading: boolean
}

export function PromptInput({ onSend, isLoading }: PromptInputProps) {
  const [content, setContent] = useState("")
  const [validationError, setValidationError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const remaining = MAX_LENGTH - content.length
  const isOverLimit = remaining < 0

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim()
    if (!trimmed) {
      setValidationError("O prompt não pode estar vazio.")
      return
    }
    if (trimmed.length > MAX_LENGTH) {
      setValidationError(`O prompt não pode exceder ${MAX_LENGTH} caracteres.`)
      return
    }
    if (isLoading) return

    setValidationError(null)
    await onSend(trimmed)
    setContent("")
    textareaRef.current?.focus()
  }, [content, isLoading, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && e.ctrlKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit],
  )

  return (
    <div className="border-t bg-background p-4">
      <div className="flex flex-col gap-2">
        {validationError && (
          <p className="text-sm text-destructive" role="alert">
            {validationError}
          </p>
        )}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (validationError) setValidationError(null)
              }}
              onKeyDown={handleKeyDown}
              placeholder="Digite seu prompt... (Ctrl+Enter para enviar)"
              className={cn(
                "min-h-[80px] resize-none",
                isOverLimit &&
                  "border-destructive focus-visible:ring-destructive",
              )}
              disabled={isLoading}
              maxLength={MAX_LENGTH + 100}
              aria-label="Campo de prompt"
            />
            <div
              className={cn(
                "mt-1 text-right text-xs",
                remaining < 100 ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {remaining} caracteres restantes
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || isOverLimit}
            size="icon"
            className="mb-6 h-10 w-10 shrink-0"
            aria-label="Enviar prompt"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
