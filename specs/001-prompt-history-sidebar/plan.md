# Implementation Plan: Prompt History Sidebar

**Branch**: `001-prompt-history-sidebar` | **Date**: 2026-02-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-prompt-history-sidebar/spec.md`

## Summary

Implementar sidebar de histórico de iterações no frontend de chat, com seleção de iteração ativa, menu colapsável, nomeação pelo primeiro prompt bem-sucedido e persistência local no browser. O escopo mantém no máximo 20 entradas recentes, faz merge entre abas por `conversationId`/`lastActivatedAt`, usa fallback em memória quando `localStorage` falhar e não inclui remoção manual de histórico.

## Technical Context

**Language/Version**: TypeScript 5.x, Next.js 15.2.1, React 19  
**Primary Dependencies**: Next.js App Router, React hooks, Tailwind CSS, Shadcn/UI, `lucide-react`  
**Storage**: `localStorage` (`prompt_ui.history.v1` e `prompt_ui.history.sidebar_collapsed.v1`) + fallback em memória na sessão  
**Testing**: Jest (unitário de store/hook/componentes) e Playwright (E2E dos fluxos de sidebar)  
**Target Platform**: Web (desktop/mobile), navegadores modernos  
**Project Type**: Web application (frontend Next.js consumindo API REST existente)  
**Performance Goals**: troca de iteração em <=2 interações; renderização estável com 20 itens; toggle da sidebar sem bloquear input  
**Constraints**: sem novos endpoints backend; sem remoção manual de histórico; truncamento visual de nome em 60 caracteres; merge multi-aba obrigatório  
**Scale/Scope**: histórico local por browser/usuário atual, limitado a 20 iterações recentes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio / Regra | Status | Observação |
|---|---|---|
| Clean Architecture | PASS | Mudanças isoladas em `frontend/components`, `frontend/hooks`, `frontend/lib` |
| KISS | PASS | Persistência local simples, sem novos serviços backend |
| DRY | PASS | Regras de serialização/merge/truncamento centralizadas no store |
| YAGNI | PASS | Sem funcionalidades extras (remoção manual fora de escopo) |
| UI/UX + Acessibilidade | PASS | Sidebar colapsável, estado ativo explícito, legibilidade de títulos longos |
| Testes e qualidade | PASS | Estratégia unit + E2E definida por história |
| Segurança/privacidade | PASS | Persistência de metadados mínimos; sem credenciais/tokens |

**Resultado pré-Phase 0**: Gates aprovados; nenhuma violação sem justificativa.

## Project Structure

### Documentation (this feature)

```text
specs/001-prompt-history-sidebar/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── ui-history-contract.md
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
│       ├── ChatWindow.tsx
│       ├── ConversationHeader.tsx
│       └── PromptInput.tsx
├── hooks/
│   ├── useConversation.ts
│   └── useConversationHistory.ts
├── lib/
│   ├── api/conversationApi.ts
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
- Persistência local versionada.
- Nomeação por primeiro prompt com sucesso.
- Ordenação por `lastActivatedAt`.
- Persistência do estado colapsado.
- Tratamento de item inválido (404) removendo entrada obsoleta.

## Phase 1 - Design & Contracts

Artefatos:
- Modelo de dados: [data-model.md](./data-model.md)
- Contrato de UI/persistência: [contracts/ui-history-contract.md](./contracts/ui-history-contract.md)
- Guia de validação: [quickstart.md](./quickstart.md)

## Post-Design Constitution Re-check

Revalidação após design: **PASS** para todos os gates acima; sem desvios adicionais.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| Nenhuma | N/A | N/A |
