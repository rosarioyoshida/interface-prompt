# UI Contract - Prompt History Sidebar

## Escopo

Contrato de interação entre componentes de UI (`HistorySidebar`, página de chat e hook de histórico) e a camada de persistência local.

## 1. Contrato de armazenamento local

### Chaves
- `prompt_ui.history.v1`
- `prompt_ui.history.sidebar_collapsed.v1`

### Schema `prompt_ui.history.v1`

```json
{
  "version": 1,
  "activeConversationId": "uuid-opcional",
  "entries": [
    {
      "conversationId": "uuid",
      "title": "contexto do primeiro prompt",
      "firstPromptRaw": "texto completo opcional",
      "createdAt": "2026-02-27T12:00:00Z",
      "firstPromptAt": "2026-02-27T12:01:10Z",
      "lastActivatedAt": "2026-02-27T12:05:00Z",
      "messageCount": 2
    }
  ]
}
```

### Schema `prompt_ui.history.sidebar_collapsed.v1`

```json
{
  "isCollapsed": false
}
```

## 2. Contrato funcional do hook `useConversationHistory`

### Entrada

```ts
interface UseConversationHistoryInput {
  conversationId: string
}
```

### Saída

```ts
interface UseConversationHistoryOutput {
  entries: IterationHistoryEntry[]
  activeConversationId?: string
  isCollapsed: boolean
  upsertConversation: (params: {
    conversationId: string
    createdAt: string
  }) => void
  registerFirstPromptContext: (params: {
    conversationId: string
    firstPromptContent: string
    occurredAt: string
  }) => void
  activateConversation: (conversationId: string, occurredAt: string) => void
  removeConversation: (conversationId: string) => void
  toggleSidebar: () => void
}
```

## 3. Regras de interação UI

- Clique em item da sidebar deve navegar para `/chat/{conversationId}`.
- Entrada ativa deve ter estilo semântico diferenciado (texto + ícone + cor).
- Se lista vazia, renderizar estado vazio claro e acessível.
- Sidebar deve alternar entre expandida/colapsada sem bloquear campo de prompt.

## 4. Integração com API existente

Sem novos endpoints nesta feature. Uso esperado:
- `GET /api/v1/conversations/{id}` para carregar conversa ao abrir item histórico.
- `POST /api/v1/conversations/{id}/prompts` para detectar primeiro envio bem-sucedido e registrar título.

## 5. Tratamento de falhas

- Em erro 404 ao abrir item histórico: remover item local e exibir feedback amigável.
- Em erro de `localStorage` indisponível: fallback para estado em memória sem quebrar UI.
