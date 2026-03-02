# Implementation Plan: Ajustes Visuais da Barra Lateral

**Branch**: `001-sidebar-search-accordion` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-sidebar-search-accordion/spec.md`

## Summary

Aplicar ajustes visuais na barra lateral mantendo o comportamento funcional existente: transformar "Buscar em chats" em acionador textual sem estilo de botao destacado, reposicionar esse acionador abaixo do controle de recolher, renomear a secao para "Seus chats" e introduzir comportamento de accordion para ocultar/exibir a lista de historico sem regressao das interacoes por item.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.2.1, React 19  
**Primary Dependencies**: Next.js App Router, React hooks, Tailwind CSS, Shadcn/UI (`DropdownMenu`, `Accordion` quando aplicavel, `Dialog`), `lucide-react`  
**Storage**: `localStorage` (`prompt_ui.history.v1`) com fallback em memoria na sessao  
**Testing**: Jest (unitario de componentes e interacoes da sidebar) e Playwright (fluxo E2E da barra lateral)  
**Target Platform**: Web (desktop/mobile), navegadores modernos  
**Project Type**: Web application (frontend Next.js com backend REST ja existente)  
**Performance Goals**: manter abertura da busca em ate 200ms no percentil 95 e toggling do accordion sem degradacao perceptivel da UI  
**Constraints**: sem novos endpoints; sem alterar contrato funcional do dialog de busca; sem introduzir novas dependencias externas desnecessarias; manter acessibilidade de elementos clicaveis e de accordion  
**Scale/Scope**: ajuste restrito a componentes da barra lateral e testes associados, com historico local de ate 20 conversas

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio / Regra | Status | Observacao |
|---|---|---|
| Clean Architecture | PASS | Alteracoes concentradas em camada de interface (frontend/components + hooks) |
| KISS | PASS | Mudanca visual localizada sem reestrutura de dominio |
| DRY | PASS | Reaproveitamento de estados e handlers ja existentes da sidebar |
| YAGNI | PASS | Sem features adicionais fora do ajuste solicitado |
| UI/UX + Acessibilidade | PASS | Acionador textual com semantica clicavel e accordion com estado claro |
| Testes e qualidade | PASS | Cobertura de cenarios unitarios e regressao de fluxo principal |
| Seguranca/privacidade | PASS | Sem novos dados sensiveis, sem mudancas de API |

**Resultado pre-Phase 0**: Gates aprovados; sem violacoes que demandem excecao.

## Project Structure

### Documentation (this feature)

```text
specs/001-sidebar-search-accordion/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-sidebar-visual-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
frontend/
├── components/
│   └── chat/
│       ├── HistorySidebar.tsx
│       ├── SearchChatsDialog.tsx
│       └── SearchResultList.tsx
├── hooks/
│   ├── useConversationHistory.ts
│   └── useChatHistorySearch.ts
└── tests/
    ├── unit/
    │   └── history-sidebar-*.test.tsx
    └── e2e/
        └── history-sidebar-*.spec.ts

backend/
└── sem alteracoes previstas para esta feature
```

**Structure Decision**: feature focada em UI/UX na sidebar do frontend; sem mudancas em dominio/persistencia/backend.

## Phase 0 - Research Summary

Consolidado em [research.md](./research.md):
- Padrao de acionador textual acessivel sem usar estilo de botao destacado.
- Estrategia de espacamento/alinhamento para posicao abaixo do controle de recolher.
- Aplicacao de accordion na secao de historico preservando interacoes por item.
- Diretrizes de regressao para garantir comportamento existente de busca e menu de acoes.

## Phase 1 - Design & Contracts

Artefatos:
- Modelo de dados de estado de UI: [data-model.md](./data-model.md)
- Contrato de interface da sidebar: [contracts/ui-sidebar-visual-contract.md](./contracts/ui-sidebar-visual-contract.md)
- Guia de validacao: [quickstart.md](./quickstart.md)

## Post-Design Constitution Re-check

Revalidacao apos design: **PASS** em todos os gates; sem excecoes.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma | N/A | N/A |
