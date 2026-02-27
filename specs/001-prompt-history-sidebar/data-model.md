# Data Model - Prompt History Sidebar

## Entidade: IterationHistoryEntry

Representa uma conversa disponível para retomada na sidebar.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `conversationId` | string (UUID) | Sim | Deve corresponder a uma conversa existente na API |
| `title` | string | Sim | Derivado do primeiro prompt enviado com sucesso; não vazio após primeira mensagem |
| `firstPromptRaw` | string | Não | Texto original completo do primeiro prompt (quando disponível) |
| `createdAt` | string (ISO-8601) | Sim | Timestamp de criação da conversa |
| `firstPromptAt` | string (ISO-8601) | Não | Preenchido apenas após primeiro envio bem-sucedido |
| `lastActivatedAt` | string (ISO-8601) | Sim | Atualizado a cada seleção/ativação da conversa |
| `messageCount` | number | Sim | Inteiro >= 0 para apoio de UI |

## Entidade: ConversationHistoryState

Estado persistido do histórico no browser.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `version` | number | Sim | Inicialmente `1` para migração futura |
| `entries` | IterationHistoryEntry[] | Sim | Ordenadas por `lastActivatedAt` desc |
| `activeConversationId` | string | Não | Referência visual do item ativo atual |

## Entidade: HistorySidebarUIState

Preferência visual da sidebar.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `isCollapsed` | boolean | Sim | `true` = minimizada, `false` = expandida |

## Relacionamentos

- `ConversationHistoryState.entries[n].conversationId` referencia `Conversation.id` (modelo existente em `conversation.ts`).
- `activeConversationId` deve corresponder a um item existente em `entries` quando definido.

## Regras de Validação

- Não inserir entradas duplicadas por `conversationId`.
- Ao receber primeiro prompt bem-sucedido, atualizar `title` se ainda estiver placeholder.
- `title` para exibição deve usar fallback "Nova iteração" se ainda não houver primeiro prompt.
- Em 404 ao carregar conversa, remover entrada e limpar `activeConversationId` se necessário.

## Transições de Estado

1. `CREATED` (sem primeiro prompt)
- Evento: criação de conversa
- Resultado: entrada com título placeholder

2. `NAMED`
- Evento: primeiro prompt enviado com sucesso
- Resultado: `title` definido pelo contexto do primeiro prompt

3. `ACTIVE`
- Evento: clique na entrada histórica
- Resultado: `activeConversationId` atualizado, `lastActivatedAt` atualizado

4. `STALE_REMOVED`
- Evento: tentativa de carregar conversa inexistente (404)
- Resultado: entrada removida do histórico
