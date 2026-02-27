# Tasks: Prompt History Sidebar

**Input**: Design documents from `/specs/001-prompt-history-sidebar/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Incluídos, pois a especificação define cenários de teste por história e o plano técnico prevê Jest + Playwright.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estrutura de testes e arquivos base para a feature no frontend.

- [X] T001 Criar estrutura de testes em `frontend/tests/unit/` e `frontend/tests/e2e/`.
- [X] T002 Configurar Jest para unit tests de utilitários/hooks em `frontend/jest.config.ts`.
- [X] T003 [P] Configurar Playwright para fluxos da sidebar em `frontend/playwright.config.ts`.
- [X] T004 [P] Criar arquivo base de utilitários de mock de storage em `frontend/tests/unit/localStorageMock.ts`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implementar fundações compartilhadas de modelo, persistência e contrato do histórico.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Definir tipos de histórico em `frontend/lib/types/conversationHistory.ts`.
- [X] T006 Implementar store versionado de histórico em `frontend/lib/history/conversationHistoryStore.ts`.
- [X] T007 [P] Implementar serialização e migração de schema v1 em `frontend/lib/history/conversationHistoryStore.ts`.
- [X] T008 [P] Implementar fallback em memória para indisponibilidade de `localStorage` em `frontend/lib/history/conversationHistoryStore.ts`.
- [X] T009 Criar hook base `useConversationHistory` com API do contrato em `frontend/hooks/useConversationHistory.ts`.
- [X] T010 [P] Adicionar testes unitários do store (upsert, remove, active, ordenação) em `frontend/tests/unit/conversation-history-store.test.ts`.
- [X] T011 [P] Adicionar testes unitários do hook (toggle e persistência de estado) em `frontend/tests/unit/use-conversation-history.test.ts`.

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Access Iteration History (Priority: P1) 🎯 MVP

**Goal**: Exibir lista de iterações e permitir seleção para carregar iteração ativa.

**Independent Test**: Criar ao menos duas conversas, abrir a interface e validar lista consistente; clicar em item e validar carregamento da conversa ativa.

### Tests for User Story 1

- [X] T012 [P] [US1] Criar teste unitário da renderização de lista e estado vazio em `frontend/tests/unit/history-sidebar-list.test.tsx`.
- [X] T013 [P] [US1] Criar teste E2E de seleção e ativação de item histórico em `frontend/tests/e2e/history-sidebar-select.spec.ts`.
- [X] T042 [P] [US1] Criar teste E2E de persistência do histórico após reload em `frontend/tests/e2e/history-sidebar-persistence-refresh.spec.ts`.
- [X] T036 [P] [US1] Criar teste unitário de merge multi-aba por `conversationId` e `lastActivatedAt` em `frontend/tests/unit/use-conversation-history-multitab.test.ts`.
- [X] T038 [P] [US1] Criar teste unitário de limite e descarte das entradas antigas em `frontend/tests/unit/conversation-history-limit.test.ts`.
- [X] T039 [P] [US1] Criar teste de UI garantindo ausência de controles de exclusão em `frontend/tests/unit/history-sidebar-no-delete-controls.test.tsx`.

### Implementation for User Story 1

- [X] T014 [P] [US1] Implementar componente de sidebar com lista e estado vazio em `frontend/components/chat/HistorySidebar.tsx`.
- [X] T015 [US1] Integrar `HistorySidebar` ao layout do chat em `frontend/app/chat/layout.tsx`.
- [X] T016 [US1] Integrar navegação por clique (`/chat/{id}`) e marcação de item ativo em `frontend/components/chat/HistorySidebar.tsx`.
- [X] T017 [US1] Sincronizar ativação de conversa no carregamento da rota em `frontend/app/chat/[id]/page.tsx`.
- [X] T018 [US1] Atualizar `useConversation` para registrar/ativar conversa no histórico em `frontend/hooks/useConversation.ts`.
- [X] T019 [US1] Tratar 404 ao reabrir histórico removendo item obsoleto em `frontend/hooks/useConversation.ts`.
- [X] T035 [US1] Implementar sincronização entre abas via evento `storage` em `frontend/hooks/useConversationHistory.ts`.
- [X] T037 [US1] Implementar política de eviction para manter máximo 20 entradas em `frontend/lib/history/conversationHistoryStore.ts`.

**Checkpoint**: User Story 1 fully functional and independently testable.

---

## Phase 4: User Story 2 - Collapse the History Menu (Priority: P2)

**Goal**: Permitir expandir/recolher sidebar sem bloquear o input de prompts.

**Independent Test**: Alternar estado expandido/recolhido e validar que área principal continua utilizável; recarregar e confirmar persistência da preferência.

### Tests for User Story 2

- [X] T020 [P] [US2] Criar teste unitário de toggle e persistência de colapso em `frontend/tests/unit/history-sidebar-collapse.test.tsx`.
- [X] T021 [P] [US2] Criar teste E2E de expandir/recolher sem bloquear envio de prompt em `frontend/tests/e2e/history-sidebar-collapse.spec.ts`.

### Implementation for User Story 2

- [X] T022 [US2] Implementar botão de toggle colapsar/expandir com acessibilidade em `frontend/components/chat/HistorySidebar.tsx`.
- [X] T023 [US2] Persistir `isCollapsed` usando chave `prompt_ui.history.sidebar_collapsed.v1` em `frontend/lib/history/conversationHistoryStore.ts`.
- [X] T024 [US2] Ajustar layout responsivo da área de chat com sidebar colapsada em `frontend/app/chat/layout.tsx`.

**Checkpoint**: User Stories 1 and 2 independently testable.

---

## Phase 5: User Story 3 - Name History by First Prompt (Priority: P3)

**Goal**: Nomear cada entrada do histórico com base no primeiro prompt enviado com sucesso.

**Independent Test**: Criar nova conversa, enviar primeiro prompt e validar nome da entrada; simular falha no primeiro envio e validar que não nomeia até sucesso.

### Tests for User Story 3

- [X] T025 [P] [US3] Criar teste unitário da regra de nomeação por primeiro prompt em `frontend/tests/unit/history-first-prompt-title.test.ts`.
- [X] T026 [P] [US3] Criar teste E2E de nomeação após primeiro envio bem-sucedido em `frontend/tests/e2e/history-first-prompt-title.spec.ts`.

### Implementation for User Story 3

- [X] T027 [US3] Implementar função de normalização e truncamento de título em `frontend/lib/history/conversationHistoryStore.ts`.
- [X] T028 [US3] Registrar contexto do primeiro prompt somente após sucesso de `sendPrompt` em `frontend/hooks/useConversation.ts`.
- [X] T029 [US3] Atualizar renderização para legibilidade de títulos longos em `frontend/components/chat/HistorySidebar.tsx`.

**Checkpoint**: All user stories independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes transversais, documentação e validação final.

- [X] T030 [P] Atualizar documentação de uso da sidebar e persistência em `specs/001-prompt-history-sidebar/quickstart.md`.
- [X] T031 Revisar mensagens de erro e feedback visual/acessibilidade na sidebar em `frontend/components/chat/HistorySidebar.tsx`.
- [X] T032 [P] Executar e ajustar suíte final (`npm run test` e `npm run test:e2e`) em `frontend/package.json`.
- [X] T033 [P] Configurar formatter do frontend (Prettier) e script de verificação em `frontend/package.json`.
- [X] T034 [P] Executar lint e formatter check no frontend em `frontend/package.json`.
- [X] T040 Definir protocolo SC-004 com `n>=10`, tarefa de retomada e limite de 2 interações em `specs/001-prompt-history-sidebar/quickstart.md`.
- [ ] T041 Executar sessão piloto de usabilidade e registrar percentual + status `PASS/FAIL` de SC-004 em `specs/001-prompt-history-sidebar/quickstart.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all stories.
- **Phase 3 (US1)**: Depends on Phase 2; MVP.
- **Phase 4 (US2)**: Depends on Phase 2; can run after/alongside US1 when staffed.
- **Phase 5 (US3)**: Depends on Phase 2 and integrates naturally with US1 send flow.
- **Phase 6 (Polish)**: Depends on selected stories complete.
  - T040 deve ocorrer antes de T041.

### User Story Dependencies

- **US1 (P1)**: Start after Foundational; no dependency on other stories.
- **US2 (P2)**: Start after Foundational; independent of US1 logic, shared UI files only.
- **US3 (P3)**: Start after Foundational; depends on send-prompt flow integration from US1 in same hook.
- **US1 (P1)**: T036 e T038 seguem abordagem TDD (devem falhar antes de T035 e T037).

### Dependency Graph

- Setup -> Foundational -> US1 -> Polish
- Setup -> Foundational -> US2 -> Polish
- Setup -> Foundational -> US3 -> Polish

---

## Parallel Opportunities

- **Setup**: T003 and T004 parallel to T002.
- **Foundational**: T007, T008, T010, T011 parallel after T005/T006 baseline.
- **US1**: T012 and T013 parallel; T014 parallel to test creation.
- **US1**: T036, T038 e T039 podem executar em paralelo com T012 e T013 após implementação base.
- **US2**: T020 and T021 parallel.
- **US3**: T025 and T026 parallel.
- **Polish**: T030, T032, T033 e T034 paralelos; T041 depende de T040.

## Parallel Example: User Story 1

```bash
# Tests in parallel
Task: "T012 [US1] frontend/tests/unit/history-sidebar-list.test.tsx"
Task: "T013 [US1] frontend/tests/e2e/history-sidebar-select.spec.ts"

# UI + integration split (after foundational)
Task: "T014 [US1] frontend/components/chat/HistorySidebar.tsx"
Task: "T017 [US1] frontend/app/chat/[id]/page.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] frontend/tests/unit/history-sidebar-collapse.test.tsx"
Task: "T021 [US2] frontend/tests/e2e/history-sidebar-collapse.spec.ts"
```

## Parallel Example: User Story 3

```bash
Task: "T025 [US3] frontend/tests/unit/history-first-prompt-title.test.ts"
Task: "T026 [US3] frontend/tests/e2e/history-first-prompt-title.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent test for US1.
4. Demo/deploy MVP.

### Incremental Delivery

1. Deliver US1 (history list + activate iteration).
2. Deliver US2 (collapsible sidebar).
3. Deliver US3 (first-prompt naming).
4. Run Polish phase and full regression.

### Parallel Team Strategy

1. Shared work: Setup + Foundational.
2. Then split by story:
   - Dev A: US1
   - Dev B: US2
   - Dev C: US3
3. Final convergence on Phase 6.

---

## Notes

- Todos os itens seguem formato checklist obrigatório com ID, marcadores e path.
- Tarefas com `[P]` não compartilham dependência de arquivo inacabado no mesmo momento.
- Cada user story possui critério de teste independente e executável.

