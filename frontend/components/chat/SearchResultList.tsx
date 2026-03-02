"use client"

import type { SearchMode, SearchResultItem } from "@/lib/history/search/types"

interface SearchResultListProps {
  mode: SearchMode
  results: SearchResultItem[]
  onSelect: (item: SearchResultItem) => void
}

const DATE_FORMATTER = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
})

export function SearchResultList({
  mode,
  results,
  onSelect,
}: SearchResultListProps) {
  if (results.length === 0) {
    const emptyMessage =
      mode === "recent"
        ? "Nenhum histórico encontrado nos últimos 7 dias."
        : "Nenhum resultado encontrado para o termo informado."
    return (
      <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {results.map((result) => (
        <li key={`${result.conversationId}-${result.messageDate}`}>
          <button
            type="button"
            className="w-full rounded-md border px-3 py-2 text-left transition hover:bg-muted"
            onClick={() => onSelect(result)}
          >
            <p className="text-sm font-medium">{result.snippet}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {DATE_FORMATTER.format(new Date(result.messageDate))} •{" "}
              {result.origin === "usuario" ? "Mensagem enviada" : "Mensagem recebida"}
            </p>
          </button>
        </li>
      ))}
    </ul>
  )
}
