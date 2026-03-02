# Tasks: Ajustes Visuais da Barra Lateral

**Input**: Design documents from `/specs/001-sidebar-search-accordion/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-sidebar-visual-contract.md, quickstart.md

**Tests**: Incluídos (Jest unitário + Playwright E2E), conforme especificação.

**Organization**: Tasks agrupadas por user story para implementação e validação independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependência direta)
- **[Story]**: Mapeamento da task para user story (`[US1]`, `[US2]`, `[US3]`)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base de testes e documentação da feature sem alterar comportamento de negócio.

- [X] T001 Criar baseline de testes unitários da feature em `frontend/tests/unit/history-sidebar-search-trigger.test.tsx`
- [X] T002 [P] Criar baseline de testes unitários de accordion em `frontend/tests/unit/history-sidebar-accordion.test.tsx`
- [X] T003 [P] Criar baseline E2E da feature em `frontend/tests/e2e/history-sidebar-visual-adjustments.spec.ts`
- [X] T004 Registrar escopo de validação visual em `specs/001-sidebar-search-accordion/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base de estado de UI e contratos internos para suportar acionador textual + accordion.

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase.

- [X] T005 Estender modelo de estado da sidebar com accordion em `frontend/lib/types/conversationHistory.ts`
- [X] T006 [P] Persistir estado de expansão da seção de chats em `frontend/lib/history/conversationHistoryStore.ts`
- [X] T007 [P] Expor controle de accordion no hook de histórico em `frontend/hooks/useConversationHistory.ts`
- [X] T008 [P] Validar persistência de estado da sidebar em `frontend/tests/unit/conversation-history-store.test.ts`
- [X] T009 Validar transições do hook de histórico em `frontend/tests/unit/use-conversation-history.test.ts`
- [X] T010 Consolidar contrato visual da sidebar em `specs/001-sidebar-search-accordion/contracts/ui-sidebar-visual-contract.md`

**Checkpoint**: Estado de UI preparado para implementação das histórias com isolamento.

---

## Phase 3: User Story 1 - Ajustar Acionador de Busca (Priority: P1) 🎯 MVP

**Goal**: Exibir "Buscar em chats" como acionador textual neutro, abaixo do controle de recolher, mantendo abertura do dialog.

**Independent Test**: Abrir sidebar expandida, validar posição e estilo textual do acionador, clicar e abrir dialog de busca.

### Tests for User Story 1

- [X] T011 [P] [US1] Validar posição do acionador abaixo do controle de recolher em `frontend/tests/unit/history-sidebar-search-trigger.test.tsx`
- [X] T012 [P] [US1] Validar estilo neutro e acessibilidade do acionador em `frontend/tests/unit/history-sidebar-search-trigger.test.tsx`
- [X] T013 [US1] Validar abertura do dialog via acionador textual em `frontend/tests/e2e/history-sidebar-visual-adjustments.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Substituir uso de componente botão pelo acionador textual em `frontend/components/chat/HistorySidebar.tsx`
- [X] T015 [US1] Reposicionar acionador abaixo do controle de recolher em `frontend/components/chat/HistorySidebar.tsx`
- [X] T016 [US1] Garantir ativação por teclado e foco visível no acionador em `frontend/components/chat/HistorySidebar.tsx`

**Checkpoint**: US1 funcional e testável de forma independente.

---

## Phase 4: User Story 2 - Renomear e Colapsar Seção de Histórico (Priority: P1)

**Goal**: Renomear a seção para "Seus chats" e implementar accordion para ocultar/exibir a lista.

**Independent Test**: Validar título "Seus chats", recolher e expandir accordion, confirmar ocultação/exibição da lista.

### Tests for User Story 2

- [X] T017 [P] [US2] Validar renderização do título "Seus chats" em `frontend/tests/unit/history-sidebar-accordion.test.tsx`
- [X] T018 [P] [US2] Validar toggle expandir/recolher da seção em `frontend/tests/unit/history-sidebar-accordion.test.tsx`
- [X] T019 [US2] Validar fluxo de accordion em navegador real em `frontend/tests/e2e/history-sidebar-visual-adjustments.spec.ts`

### Implementation for User Story 2

- [X] T020 [P] [US2] Renomear cabeçalho da seção para "Seus chats" em `frontend/components/chat/HistorySidebar.tsx`
- [X] T021 [P] [US2] Implementar estrutura de accordion para a lista em `frontend/components/chat/HistorySidebar.tsx`
- [X] T022 [US2] Conectar estado do accordion ao hook de histórico em `frontend/components/chat/HistorySidebar.tsx`
- [X] T023 [US2] Garantir estado vazio correto com seção expandida em `frontend/components/chat/HistorySidebar.tsx`

**Checkpoint**: US2 funcional e testável de forma independente.

---

## Phase 5: User Story 3 - Manter Interações Atuais com Nova Estrutura (Priority: P2)

**Goal**: Preservar seleção de conversa e menu de ações por item após ajustes visuais.

**Independent Test**: Com seção expandida, selecionar item e abrir menu de ações; recolher/expandir e repetir sem regressão.

### Tests for User Story 3

- [X] T024 [P] [US3] Validar seleção de conversa com accordion expandido em `frontend/tests/unit/history-sidebar-list.test.tsx`
- [X] T025 [P] [US3] Validar menu de ações por item após mudanças visuais em `frontend/tests/unit/history-sidebar-no-delete-controls.test.tsx`
- [X] T026 [P] [US3] Validar regressão de busca no topo e ausência no menu por item em `frontend/tests/unit/history-sidebar-no-delete-controls.test.tsx`
- [X] T027 [US3] Validar regressão ponta a ponta de seleção e ações por item em `frontend/tests/e2e/history-sidebar-visual-adjustments.spec.ts`

### Implementation for User Story 3

- [X] T028 [P] [US3] Ajustar renderização condicional da lista sem afetar clique por item em `frontend/components/chat/HistorySidebar.tsx`
- [X] T029 [US3] Preservar comportamento do menu de ações por item em `frontend/components/chat/HistorySidebar.tsx`
- [X] T030 [US3] Revisar integração com dialog de busca para evitar regressão em `frontend/components/chat/HistorySidebar.tsx`

**Checkpoint**: Todas as histórias funcionais e testáveis independentemente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar qualidade, acessibilidade e validação de regressão.

- [X] T031 [P] Revisar copy e consistência visual da sidebar em `frontend/components/chat/HistorySidebar.tsx`
- [X] T032 [P] Revisar acessibilidade de accordion e acionador textual em `frontend/components/chat/HistorySidebar.tsx`
- [X] T033 Executar suíte unitária da sidebar em `frontend/tests/unit/`
- [X] T034 Executar suíte E2E da sidebar em `frontend/tests/e2e/history-sidebar-visual-adjustments.spec.ts`
- [X] T035 Atualizar rastreabilidade final da feature em `specs/001-sidebar-search-accordion/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sem dependências.
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as histórias.
- **Phase 3 (US1)**: depende da Phase 2.
- **Phase 4 (US2)**: depende da Phase 2.
- **Phase 5 (US3)**: depende da Phase 2; valida integração com mudanças de US1/US2.
- **Phase 6 (Polish)**: depende da conclusão das histórias.

### User Story Dependencies

- **US1 (P1)**: independente após fundação.
- **US2 (P1)**: independente após fundação.
- **US3 (P2)**: depende conceitualmente de US1 + US2 para validar não-regressão completa.

### Dependency Graph

`Setup -> Foundational -> (US1 || US2) -> US3 -> Polish`

---

## Parallel Execution Examples

### User Story 1

```bash
T011 + T012 em paralelo
T014 + T015 em paralelo
```

### User Story 2

```bash
T017 + T018 em paralelo
T020 + T021 em paralelo
```

### User Story 3

```bash
T024 + T025 + T026 em paralelo
T028 + T029 em paralelo
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2.
2. Entregar US1 (acionador textual + posicionamento).
3. Validar abertura do dialog sem regressão.

### Incremental Delivery

1. Adicionar US2 (renomeação + accordion).
2. Validar estado de seção e estado vazio.
3. Adicionar US3 para fechar regressão funcional completa.

### Parallel Team Strategy

1. Time completo em Setup + Foundational.
2. Depois:
   - Dev A: US1 (acionador textual)
   - Dev B: US2 (accordion e seção)
   - Dev C: US3 (regressão e integração)

---

## Notes

- Sem alterações previstas em backend, API ou persistência de domínio.
- A feature é focada em UI/UX e acessibilidade da barra lateral.
- Não introduzir dependências externas novas sem necessidade.

