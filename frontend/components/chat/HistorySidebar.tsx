"use client"

import { useMemo } from "react"
import { PanelLeft, PanelLeftClose } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useConversationHistory } from "@/hooks/useConversationHistory"
import { cn } from "@/lib/utils"

interface HistorySidebarProps {
  conversationId?: string
}

export function HistorySidebar({ conversationId }: HistorySidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    entries,
    activeConversationId,
    isCollapsed,
    activateConversation,
    toggleSidebar,
  } = useConversationHistory({ conversationId })

  const routeConversationId = useMemo(() => {
    const match = pathname.match(/^\/chat\/([^/]+)$/)
    return match?.[1]
  }, [pathname])

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r bg-muted/20 transition-all duration-200",
        isCollapsed ? "w-16" : "w-72",
      )}
      aria-label="Histórico de iterações"
    >
      <div className="flex items-center justify-between border-b px-3 py-3">
        {!isCollapsed && <h2 className="text-sm font-semibold">Histórico</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir histórico" : "Recolher histórico"}
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      {isCollapsed ? (
        <div className="flex flex-1 items-center justify-center px-2 text-center text-xs text-muted-foreground">
          <span>Hist.</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-2">
          {entries.length === 0 ? (
            <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
              Nenhum histórico disponível.
            </p>
          ) : (
            <ul className="space-y-1">
              {entries.map((entry) => {
                const isActive =
                  (routeConversationId || activeConversationId) ===
                  entry.conversationId
                return (
                  <li key={entry.conversationId}>
                    <button
                      type="button"
                      onClick={() => {
                        activateConversation(
                          entry.conversationId,
                          new Date().toISOString(),
                        )
                        router.push(`/chat/${entry.conversationId}`)
                      }}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 text-left text-sm transition",
                        "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isActive
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-transparent",
                      )}
                    >
                      <span
                        className="block truncate"
                        title={entry.firstPromptRaw || entry.title}
                      >
                        {entry.title}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </aside>
  )
}
