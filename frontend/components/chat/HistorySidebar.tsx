"use client"

import { useMemo, useState } from "react"
import { MoreHorizontal, PanelLeft, PanelLeftClose } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DeleteHistoryDialog } from "@/components/chat/DeleteHistoryDialog"
import { SearchChatsDialog } from "@/components/chat/SearchChatsDialog"
import { useChatHistorySearch } from "@/hooks/useChatHistorySearch"
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
    requestDeleteConversation,
    cancelDeleteConversation,
    confirmDeleteConversation,
    deleteConfirmation,
    toggleSidebar,
  } = useConversationHistory({ conversationId })

  const routeConversationId = useMemo(() => {
    const match = pathname.match(/^\/chat\/([^/]+)$/)
    return match?.[1]
  }, [pathname])

  const currentActiveId = routeConversationId || activeConversationId
  const [actionsMenuFor, setActionsMenuFor] = useState<string | null>(null)
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)

  const {
    query,
    mode,
    results,
    setQuery,
    clearQuery,
    openConversationFromResult,
  } = useChatHistorySearch({
    entries,
    onOpenConversation: (targetConversationId) => {
      activateConversation(targetConversationId, new Date().toISOString())
      router.push(`/chat/${targetConversationId}`)
      setIsSearchDialogOpen(false)
      clearQuery()
    },
  })

  return (
    <>
      <aside
        className={cn(
          "flex h-screen flex-col border-r bg-muted/20 transition-all duration-200",
          isCollapsed ? "w-16" : "w-72",
        )}
        aria-label="Histórico de iterações"
      >
        <div className="flex items-center justify-between border-b px-3 py-3">
          {!isCollapsed && (
            <div className="flex min-w-0 flex-1 flex-col gap-2 pr-2">
              <Button
                type="button"
                variant="secondary"
                className="justify-start"
                onClick={() => setIsSearchDialogOpen(true)}
              >
                Buscar em chats
              </Button>
              <h2 className="text-sm font-semibold">Histórico</h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label={
              isCollapsed ? "Expandir histórico" : "Recolher histórico"
            }
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
                  const isActive = currentActiveId === entry.conversationId
                  return (
                    <li
                      key={entry.conversationId}
                      className="group relative"
                      onMouseLeave={() => {
                        if (actionsMenuFor === entry.conversationId) {
                          setActionsMenuFor(null)
                        }
                      }}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1 rounded-md border pr-1 transition",
                          "hover:bg-muted focus-within:ring-2 focus-within:ring-ring",
                          isActive
                            ? "border-primary/70 bg-primary/20 text-foreground"
                            : "border-border/40 text-foreground/95",
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            activateConversation(
                              entry.conversationId,
                              new Date().toISOString(),
                            )
                            router.push(`/chat/${entry.conversationId}`)
                          }}
                          className="min-w-0 flex-1 px-3 py-2 text-left text-sm text-foreground focus-visible:outline-none"
                        >
                          <span
                            className="block truncate font-medium text-foreground"
                            title={entry.firstPromptRaw || entry.title}
                          >
                            {entry.title}
                          </span>
                        </button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Ações para ${entry.title}`}
                          onClick={() =>
                            setActionsMenuFor((prev) =>
                              prev === entry.conversationId
                                ? null
                                : entry.conversationId,
                            )
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {actionsMenuFor === entry.conversationId ? (
                        <div
                          className="absolute right-1 top-10 z-20 min-w-44 rounded-md border bg-background p-1 shadow-md"
                          role="menu"
                          aria-label="Menu de ações do histórico"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            className="block w-full rounded px-3 py-2 text-left text-sm text-destructive hover:bg-muted"
                            onClick={() => {
                              setActionsMenuFor(null)
                              requestDeleteConversation(entry.conversationId)
                            }}
                          >
                            Excluir histórico
                          </button>
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        )}
      </aside>

      <DeleteHistoryDialog
        isOpen={deleteConfirmation.isOpen}
        isSubmitting={deleteConfirmation.isSubmitting}
        errorMessage={deleteConfirmation.errorMessage}
        onCancel={cancelDeleteConversation}
        onConfirm={() => {
          const targetConversationId = deleteConfirmation.conversationId
          const didSucceed = confirmDeleteConversation()
          if (didSucceed && targetConversationId && targetConversationId === currentActiveId) {
            router.push("/chat")
          }
        }}
      />

      <SearchChatsDialog
        isOpen={isSearchDialogOpen}
        query={query}
        mode={mode}
        results={results}
        onClose={() => {
          setIsSearchDialogOpen(false)
          clearQuery()
        }}
        onQueryChange={setQuery}
        onResultClick={openConversationFromResult}
      />
    </>
  )
}
