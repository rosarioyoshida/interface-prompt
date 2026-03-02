# Implementation Plan: Busca em Historico de Chats

**Branch**: `001-search-chat-history` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-search-chat-history/spec.md`

## Summary

Adicionar no menu lateral de historicos um fluxo de busca em dialog para localizar trechos de mensagens em conversas recentes e antigas, com estado inicial dos ultimos 7 dias e capacidade de abrir diretamente o chat relacionado ao resultado. A implementacao seguira a mesma stack definida em `001-prompt-history-sidebar`, com foco em frontend, reaproveitamento da fonte de historico existente e com ajuste minimo de observabilidade no backend (propagacao e validacao de `traceId` em erros HTTP).

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.2.1, React 19  
**Primary Dependencies**: Next.js App Router, React hooks, Tailwind CSS, Shadcn/UI (`AlertDialog`, `DropdownMenu`, `Dialog`, `Input`), `lucide-react`  
**Storage**: `localStorage` (`prompt_ui.history.v1`) com fallback em memoria na sessao  
**Testing**: Jest (unitario de filtros/normalizacao e componentes) e Playwright (fluxo E2E do dialog de busca)  
**Target Platform**: Web (desktop/mobile), navegadores modernos  
**Project Type**: Web application (frontend Next.js consumindo API REST existente)  
**Performance Goals**: abertura do dialog em ate 200ms apos clique; atualizacao da lista de resultados em ate 300ms para ate 20 historicos locais  
**Constraints**: sem novos endpoints backend; manter comportamento atual de historico; mostrar trecho + data + origem da mensagem em cada resultado; janela inicial limitada aos ultimos 7 dias quando busca vazia; backend limitado a ajustes de observabilidade/erro sem alterar contratos de recurso  
**Scale/Scope**: historico local por navegador/usuario atual, com no maximo 20 conversas no store local

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regra | Status | Observacao |
|---|---|---|
| Clean Architecture | PASS | Mudancas concentradas em componentes/hooks/lib do frontend |
| KISS | PASS | Busca local sobre historico existente sem nova infraestrutura |
| DRY | PASS | Regras de normalizacao e extracao de trecho centralizadas |
| YAGNI | PASS | Escopo limitado a dialog de busca e abertura de chat |
| UI/UX + Acessibilidade | PASS | Campo com placeholder claro, estados vazio/resultado e interacao por clique/teclado |
| Testes e qualidade | PASS | Cobertura unit + E2E para fluxos P1/P2 |
| Seguranca/privacidade | PASS | Sem persistencia de novos dados sensiveis; sem novos contratos externos |

**Resultado pre-Phase 0**: Gates aprovados; nenhuma violacao sem justificativa.

## Project Structure

### Documentation (this feature)

```text
specs/001-search-chat-history/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-search-history-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── app/
│   └── chat/
│       ├── [id]/page.tsx
│       ├── layout.tsx
│       └── page.tsx
├── components/
│   └── chat/
│       ├── HistorySidebar.tsx
│       ├── SearchChatsDialog.tsx
│       └── SearchResultList.tsx
├── hooks/
│   ├── useConversationHistory.ts
│   └── useChatHistorySearch.ts
├── lib/
│   ├── history/conversationHistoryStore.ts
│   └── history/search/
│       ├── searchHistory.ts
│       └── snippetBuilder.ts
└── tests/
    ├── unit/
    └── e2e/

backend/
└── ajustes minimos de observabilidade (`traceId`) em erros HTTP, sem novos endpoints
```

**Structure Decision**: aplicacao web com implementacao predominantemente no frontend, reaproveitando os dados ja disponiveis no historico local. O menu de acoes permanece no `HistorySidebar.tsx` (sem extracao obrigatoria de `HistoryActionsMenu.tsx`). No backend, apenas ajuste minimo de observabilidade para `traceId` em erros HTTP.

## Phase 0 - Research Summary

Consolidado em [research.md](./research.md):
- Estrategia de indexacao e busca local case-insensitive.
- Regra de janela inicial de 7 dias com fallback de estado vazio.
- Formato de trecho contextual e metadados exibidos.
- Comportamento resiliente para historico indisponivel/removido.
- Estrategia de testes unitarios e E2E para o dialog.

## Phase 1 - Design & Contracts

Artefatos:
- Modelo de dados: [data-model.md](./data-model.md)
- Contrato de UI e busca: [contracts/ui-search-history-contract.md](./contracts/ui-search-history-contract.md)
- Guia de validacao: [quickstart.md](./quickstart.md)

## Post-Design Constitution Re-check

Revalidacao apos design: **PASS** para todos os gates; nenhuma excecao ou desvio adicional.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma | N/A | N/A |
