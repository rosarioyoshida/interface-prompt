import { cn } from "@/lib/utils"
import { MessageRole, type MessageResponse } from "@/lib/types/conversation"

interface MessageBubbleProps {
  message: MessageResponse
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === MessageRole.USER

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        <span className="text-xs text-muted-foreground">
          {isUser ? "Você" : "IA"}
        </span>
        <div
          className={cn(
            "rounded-2xl px-4 py-2 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground rounded-tr-sm"
              : "bg-muted text-foreground rounded-tl-sm",
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    </div>
  )
}
