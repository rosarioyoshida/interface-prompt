# Tasks: Delete History Item

**Input**: Design documents from `/specs/001-delete-history-item/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar base técnica da feature na stack já adotada

- [X] T001 Atualizar tipos de histórico para estado de exclusão em frontend/lib/types/conversationHistory.ts
- [X] T002 [P] Criar componente base de confirmação de exclusão em frontend/components/chat/DeleteHistoryDialog.tsx
- [X] T003 [P] Preparar API do hook para abrir/fechar confirmação em frontend/hooks/useConversationHistory.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura mínima que bloqueia implementação das user stories

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase

- [X] T004 Implementar remoção persistida com retorno de sucesso/erro em frontend/lib/history/conversationHistoryStore.ts
- [X] T005 Implementar estado `deleteConfirmation` (`isOpen`, `isSubmitting`, `errorMessage`) em frontend/hooks/useConversationHistory.ts
- [X] T006 Conectar renderização global do diálogo de exclusão na sidebar em frontend/components/chat/HistorySidebar.tsx
- [X] T007 Garantir mensagem padrão de irreversibilidade para exclusão em frontend/components/chat/DeleteHistoryDialog.tsx

**Checkpoint**: Base pronta para desenvolvimento independente das histórias

---

## Phase 3: User Story 1 - Excluir item do histórico (Priority: P1) 🎯 MVP

**Goal**: Permitir exclusão de um item específico via menu contextual com confirmação explícita

**Independent Test**: Abrir menu `...` de um item, escolher `Excluir histórico`, confirmar e validar remoção apenas após sucesso

### Implementation for User Story 1

- [X] T008 [US1] Adicionar botão de ações (`...`) por item no histórico em frontend/components/chat/HistorySidebar.tsx
- [X] T009 [US1] Garantir `Excluir histórico` como primeira opção do menu em frontend/components/chat/HistorySidebar.tsx
- [X] T010 [US1] Implementar seleção do item alvo para exclusão em frontend/hooks/useConversationHistory.ts
- [X] T011 [US1] Ligar ação do menu à abertura do diálogo de confirmação em frontend/components/chat/HistorySidebar.tsx
- [X] T012 [US1] Implementar confirmação por clique explícito no botão `Excluir` em frontend/components/chat/DeleteHistoryDialog.tsx
- [X] T013 [US1] Executar fluxo de exclusão confirmada no hook somente após sucesso da store em frontend/hooks/useConversationHistory.ts
- [X] T014 [US1] Atualizar lista visível após sucesso e remover item excluído da UI em frontend/components/chat/HistorySidebar.tsx

**Checkpoint**: US1 funcional e validável isoladamente

---

## Phase 4: User Story 2 - Cancelar exclusão com segurança (Priority: P2)

**Goal**: Evitar exclusões acidentais com cancelamento seguro e tratamento robusto de falhas

**Independent Test**: Abrir confirmação, cancelar e validar que nada foi removido; em falha, validar diálogo aberto com erro e retry

### Implementation for User Story 2

- [X] T015 [US2] Implementar ação `Cancelar` sem alterar `entries` em frontend/hooks/useConversationHistory.ts
- [X] T016 [US2] Impedir confirmação automática por tecla Enter em frontend/components/chat/DeleteHistoryDialog.tsx
- [X] T017 [US2] Desabilitar botão `Excluir` durante submissão para evitar duplo envio em frontend/components/chat/DeleteHistoryDialog.tsx
- [X] T018 [US2] Manter diálogo aberto e registrar erro no estado em caso de falha em frontend/hooks/useConversationHistory.ts
- [X] T019 [US2] Exibir mensagem de erro e ação de nova tentativa no diálogo em frontend/components/chat/DeleteHistoryDialog.tsx

**Checkpoint**: US1 e US2 funcionais de forma independente

---

## Phase 5: User Story 3 - Comportamento do item ativo excluído (Priority: P3)

**Goal**: Manter navegação consistente ao excluir o histórico ativo

**Independent Test**: Com item ativo selecionado, excluir e validar estado neutro sem item selecionado

### Implementation for User Story 3

- [X] T020 [US3] Limpar `activeConversationId` ao excluir item ativo em frontend/hooks/useConversationHistory.ts
- [X] T021 [US3] Navegar para estado neutro (`/chat`) após exclusão do item ativo em frontend/hooks/useConversation.ts
- [X] T022 [US3] Remover destaque visual do item ativo excluído em frontend/components/chat/HistorySidebar.tsx

**Checkpoint**: Todas as histórias implementadas e independentes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalização, documentação e validação cruzada

- [X] T023 [P] Atualizar roteiro de validação manual da feature em specs/001-delete-history-item/quickstart.md
- [X] T024 [P] Consolidar contrato final da interação de exclusão em specs/001-delete-history-item/contracts/ui-delete-history-contract.md
- [X] T025 Validar critérios de qualidade da spec e registrar status em specs/001-delete-history-item/checklists/requirements.md
- [X] T026 Revisar conformidade de copy/mensagens de erro entre componentes em frontend/components/chat/DeleteHistoryDialog.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: inicia imediatamente
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as user stories
- **Phase 3 (US1)**: depende da conclusão da Phase 2
- **Phase 4 (US2)**: depende da conclusão da Phase 2 (pode avançar após US1 para reduzir conflito em arquivo compartilhado)
- **Phase 5 (US3)**: depende da conclusão da Phase 2 e integra com fluxo de US1
- **Phase 6 (Polish)**: depende da conclusão das histórias implementadas

### User Story Dependencies

- **US1 (P1)**: sem dependência de outras histórias (MVP)
- **US2 (P2)**: depende da infraestrutura de confirmação entregue em US1
- **US3 (P3)**: depende da exclusão funcional de US1

### Parallel Opportunities

- **Setup**: T002 e T003 podem rodar em paralelo
- **Polish**: T023 e T024 podem rodar em paralelo
- **Execução por histórias**: após Phase 2, tarefas em arquivos distintos podem ser paralelizadas com coordenação

---

## Parallel Example: User Story 1

```bash
# Paralelo seguro em arquivos distintos
Task: "Implementar seleção do item alvo para exclusão em frontend/hooks/useConversationHistory.ts" (T010)
Task: "Adicionar botão de ações (`...`) por item no histórico em frontend/components/chat/HistorySidebar.tsx" (T008)
```

## Parallel Example: User Story 2

```bash
# Paralelo seguro entre estado e UI
Task: "Manter diálogo aberto e registrar erro no estado em caso de falha em frontend/hooks/useConversationHistory.ts" (T018)
Task: "Impedir confirmação automática por tecla Enter em frontend/components/chat/DeleteHistoryDialog.tsx" (T016)
```

## Parallel Example: User Story 3

```bash
# Paralelo com baixo acoplamento
Task: "Navegar para estado neutro (`/chat`) após exclusão do item ativo em frontend/hooks/useConversation.ts" (T021)
Task: "Remover destaque visual do item ativo excluído em frontend/components/chat/HistorySidebar.tsx" (T022)
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1
2. Concluir Phase 2
3. Concluir Phase 3 (US1)
4. Validar independent test da US1 antes de avançar

### Incremental Delivery

1. Entregar US1 (MVP)
2. Entregar US2 sem regressão da US1
3. Entregar US3 mantendo consistência de navegação
4. Executar Polish e validação final

### Observação sobre testes

A especificação não exige explicitamente TDD nem criação obrigatória de novos testes automatizados nesta etapa; por isso o plano foca implementação e validação independente por cenário.
