# Implementation Plan: Delete History Item

**Branch**: `001-delete-history-item` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-delete-history-item/spec.md`

## Summary

Implementar exclusão de item individual do histórico na sidebar do chat, usando menu contextual por item (`...`) com "Excluir histórico" como primeira opção, confirmação obrigatória e persistência local. A implementação seguirá a mesma stack já adotada nas especificações anteriores (TypeScript + Next.js + React + Tailwind + Shadcn/UI + `localStorage`), incluindo tratamento de falha sem remoção prematura em UI, estado neutro ao excluir item ativo e confirmação apenas por clique explícito.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.2.1, React 19  
**Primary Dependencies**: Next.js App Router, React hooks, Tailwind CSS, Shadcn/UI (`AlertDialog`, `DropdownMenu`), `lucide-react`  
**Storage**: `localStorage` (`prompt_ui.history.v1`) com fallback em memória na sessão  
**Testing**: Jest (unitário) e Playwright (E2E)  
**Target Platform**: Web (desktop/mobile), navegadores modernos  
**Project Type**: Web application (frontend Next.js consumindo API existente)  
**Performance Goals**: concluir exclusão em até 3 interações; atualização visual em até 200ms após sucesso local; manter fluidez com lista limitada a 20 itens  
**Constraints**: sem novos endpoints backend; exclusão irreversível; Enter não confirma exclusão; durante processamento o botão de confirmar fica desabilitado  
**Scale/Scope**: histórico local por navegador para o usuário atual, até 20 entradas recentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / Regra | Status | Observação |
|---|---|---|
| Clean Architecture | PASS | Mudanças isoladas em `frontend/components`, `frontend/hooks`, `frontend/lib` |
| KISS | PASS | Fluxo direto em UI + store local sem nova infraestrutura |
| DRY | PASS | Regras de exclusão, persistência e erro centralizadas no store/hook |
| YAGNI | PASS | Escopo restrito à exclusão de item individual |
| UI/UX + Acessibilidade | PASS | Confirmação explícita, mensagem clara de irreversibilidade e erro |
| Testes e qualidade | PASS | Cenários P1/P2/P3 cobertos por unitários e E2E |
| Segurança/privacidade | PASS | Persistência só de metadados de histórico, sem credenciais |

**Resultado pré-Phase 0**: Gates aprovados; nenhuma violação sem justificativa.

## Project Structure

### Documentation (this feature)

```text
specs/001-delete-history-item/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-delete-history-contract.md
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
│       ├── DeleteHistoryDialog.tsx
│       ├── ChatWindow.tsx
│       └── ConversationHeader.tsx
├── hooks/
│   └── useConversationHistory.ts
├── lib/
│   ├── history/conversationHistoryStore.ts
│   └── types/conversationHistory.ts
└── tests/
    ├── unit/
    └── e2e/

backend/
└── (sem alterações de contrato para esta feature)
```

**Structure Decision**: aplicação web com implementação concentrada no frontend; backend reaproveitado sem mudanças de API.

## Phase 0 - Research Summary

Consolidado em [research.md](./research.md):
- Menu contextual por item com exclusão como primeira ação.
- Confirmação destrutiva obrigatória.
- Remoção em UI somente após sucesso da operação.
- Diálogo permanece aberto em falha com retry.
- Exclusão de item ativo leva ao estado neutro (`/chat`).

## Phase 1 - Design & Contracts

Artefatos:
- Modelo de dados: [data-model.md](./data-model.md)
- Contrato de UI/persistência: [contracts/ui-delete-history-contract.md](./contracts/ui-delete-history-contract.md)
- Guia de validação: [quickstart.md](./quickstart.md)

## Post-Design Constitution Re-check

Revalidação após design: **PASS** para todos os gates acima; sem desvios adicionais.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma | N/A | N/A |
