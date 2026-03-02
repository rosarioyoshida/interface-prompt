"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchResultList } from "@/components/chat/SearchResultList"
import type { SearchMode, SearchResultItem } from "@/lib/history/search/types"
import { MAX_SEARCH_QUERY_LENGTH } from "@/lib/history/search/validators"

interface SearchChatsDialogProps {
  isOpen: boolean
  query: string
  mode: SearchMode
  results: SearchResultItem[]
  onClose: () => void
  onQueryChange: (value: string) => void
  onResultClick: (item: SearchResultItem) => void
}

export function SearchChatsDialog({
  isOpen,
  query,
  mode,
  results,
  onClose,
  onQueryChange,
  onResultClick,
}: SearchChatsDialogProps) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar em chats"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-lg border bg-background shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-base font-semibold">Buscar em chats</h2>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Fechar
          </Button>
        </div>

        <div className="px-4 py-3">
          <label htmlFor="search-chats-input" className="sr-only">
            Buscar em chats
          </label>
          <div className="flex items-center gap-2 rounded-md border px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              id="search-chats-input"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar em chats..."
              maxLength={MAX_SEARCH_QUERY_LENGTH}
              className="h-10 w-full border-none bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <hr className="border-border/70" />

        <div className="max-h-[60vh] overflow-y-auto px-4 py-3">
          <SearchResultList mode={mode} results={results} onSelect={onResultClick} />
        </div>
      </div>
    </div>
  )
}
