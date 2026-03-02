# UI Contract - Busca em Historico de Chats

## Escopo

Contrato de interacao entre menu lateral, dialog de busca e camada de historico local para localizar e abrir conversas por termo.

## 1. Contrato funcional do dialog de busca

### Abertura
- Trigger: clique no botao `Buscar em chats` no menu lateral.
- Resultado: dialog aberto com campo de texto vazio e placeholder `Buscar em chats...`.

### Campo de pesquisa
- Entrada: texto livre.
- Regra: `trim` aplicado para determinar se a consulta esta vazia.
- Comportamento:
  - vazio => modo `recent` (ultimos 7 dias);
  - nao vazio => modo `search` (filtrado por termo).

### Lista de resultados
- Deve exibir itens com:
  - trecho contextual (`snippet`);
  - data da mensagem (`messageDate`);
  - origem da mensagem (`user`/`assistant`).
- Deve exibir estado vazio especifico para:
  - sem historicos recentes;
  - sem correspondencias para o termo digitado.

## 2. Contrato de dados do resultado

```ts
interface SearchResultItem {
  conversationId: string
  messageId: string
  snippet: string
  messageDate: string // ISO-8601
  origin: "user" | "assistant"
  matchType: "query-match" | "recent-default"
}
```

## 3. Contrato do hook de busca

```ts
interface UseChatHistorySearchInput {
  openedAt: string
}

interface UseChatHistorySearchOutput {
  query: string
  mode: "recent" | "search"
  results: SearchResultItem[]
  setQuery: (next: string) => void
  clearQuery: () => void
  openConversationFromResult: (result: SearchResultItem) => Promise<void>
}
```

## 4. Regras de navegacao e selecao

- Clique em resultado valido deve carregar `/chat/{conversationId}` como chat atual.
- O dialog pode ser fechado apos carregamento bem-sucedido da conversa.
- Em indisponibilidade da conversa (ex.: removida), deve exibir feedback nao bloqueante e manter contexto de busca.

## 5. Integracao com backend existente

Sem novos endpoints nesta feature. Abertura de conversa reaproveita contrato existente de carregamento de chat por `conversationId`.

## 6. Tratamento de falhas

- Falha de leitura do historico local: usar fallback em memoria sem travar o dialog.
- Resultado invalido/inconsistente: descartar item e manter lista funcional.
