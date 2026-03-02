# Data Model - Busca em Historico de Chats

## Entidade: ChatHistoryRecord

Representa uma conversa registrada no historico local e elegivel para busca.

| Campo | Tipo | Obrigatorio | Regras |
|------|------|-------------|--------|
| `conversationId` | string | Sim | Identificador unico da conversa |
| `title` | string | Sim | Titulo de referencia exibido no historico |
| `lastActivatedAt` | string (ISO-8601) | Sim | Data/hora da ultima ativacao da conversa |
| `messages` | ChatMessageRecord[] | Sim | Colecao de mensagens indexaveis para busca |

## Entidade: ChatMessageRecord

Representa uma mensagem individual dentro de um historico de conversa.

| Campo | Tipo | Obrigatorio | Regras |
|------|------|-------------|--------|
| `messageId` | string | Sim | Identificador unico da mensagem no escopo da conversa |
| `conversationId` | string | Sim | Deve corresponder a `ChatHistoryRecord.conversationId` |
| `content` | string | Sim | Conteudo textual pesquisavel |
| `origin` | enum (`user`, `assistant`) | Sim | Origem da mensagem exibida no resultado |
| `occurredAt` | string (ISO-8601) | Sim | Data/hora para exibicao no resultado |

## Entidade: SearchQueryState

Estado da consulta no dialog de busca.

| Campo | Tipo | Obrigatorio | Regras |
|------|------|-------------|--------|
| `query` | string | Sim | `trim`; vazio aciona modo padrao de ultimos 7 dias |
| `openedAt` | string (ISO-8601) | Sim | Referencia temporal para corte da janela inicial |
| `mode` | enum (`recent`, `search`) | Sim | `recent` quando `query` vazio; `search` quando possui termo |

## Entidade: SearchResultItem

Item exibido na lista de resultados do dialog.

| Campo | Tipo | Obrigatorio | Regras |
|------|------|-------------|--------|
| `conversationId` | string | Sim | Chave para abrir chat correspondente |
| `messageId` | string | Sim | Referencia da mensagem encontrada |
| `snippet` | string | Sim | Trecho contextual contendo o termo (quando modo `search`) |
| `messageDate` | string (ISO-8601) | Sim | Data/hora da mensagem a ser formatada na UI |
| `origin` | enum (`user`, `assistant`) | Sim | Indica se mensagem foi enviada ou recebida |
| `matchType` | enum (`query-match`, `recent-default`) | Sim | Diferencia resultado por busca de resultado inicial |

## Relacionamentos

- `ChatHistoryRecord` 1:N `ChatMessageRecord`.
- `SearchResultItem` referencia exatamente um `ChatMessageRecord`.
- `SearchQueryState.mode` determina o criterio de geracao de `SearchResultItem`.

## Regras de Validacao

- Entrada contendo apenas espacos deve ser tratada como `query` vazio.
- Busca textual deve ignorar diferenca de maiusculas/minusculas.
- Resultado em modo `search` deve sempre conter `snippet` nao vazio e `messageDate` valido.
- Resultado em modo `recent` deve incluir apenas mensagens dentro da janela de 7 dias corridos a partir de `openedAt`.
- Ao clicar em resultado cuja conversa nao exista mais, o item deve ser invalidado sem carregar chat inexistente.

## Transicoes de Estado

1. `DIALOG_CLOSED` -> `DIALOG_OPEN_RECENT`
- Evento: clique em "Buscar em chats"
- Resultado: dialog aberto com `query` vazio e lista de ultimos 7 dias

2. `DIALOG_OPEN_RECENT` -> `DIALOG_OPEN_SEARCH`
- Evento: digitacao de qualquer caractere valido
- Resultado: `mode` muda para `search` e lista passa a refletir correspondencias

3. `DIALOG_OPEN_SEARCH` -> `DIALOG_OPEN_RECENT`
- Evento: limpar conteudo do campo
- Resultado: retorno ao conjunto inicial de ultimos 7 dias

4. `DIALOG_OPEN_*` -> `CHAT_LOADED`
- Evento: clique em um resultado valido
- Resultado: conversa relacionada vira chat atual

5. `DIALOG_OPEN_*` -> `DIALOG_OPEN_*` (erro controlado)
- Evento: clique em resultado para conversa removida
- Resultado: feedback de indisponibilidade e permanencia no dialog
