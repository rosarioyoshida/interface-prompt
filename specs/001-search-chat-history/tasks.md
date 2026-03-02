# Tasks: Busca em Historico de Chats

**Input**: Design documents from `/specs/001-search-chat-history/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/ui-search-history-contract.md

**Tests**: Incluidos (Jest unitario + Playwright E2E), conforme spec/plan/quickstart.

**Organization**: Tasks agrupadas por user story para implementacao e validacao independente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode executar em paralelo (arquivos diferentes, sem dependencia direta)
- **[Story]**: Mapeamento da tarefa para user story (`[US1]`, `[US2]`, `[US3]`)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estrutura de testes e contrato da feature sem alterar comportamento funcional.

- [X] T001 Criar esqueleto de pastas de busca em `frontend/lib/history/search/.gitkeep` (Impacto: `frontend/lib/history/search/`; Contrato: referencia inicial a `SearchResultItem` em `specs/001-search-chat-history/contracts/ui-search-history-contract.md`; DDL: N/A; Testes: N/A)
- [X] T002 [P] Criar esqueleto de componentes em `frontend/components/chat/SearchChatsDialog.tsx` (Impacto: `frontend/components/chat/SearchChatsDialog.tsx`, `frontend/components/chat/SearchResultList.tsx`; Contrato: secao "Contrato funcional do dialog"; DDL: N/A; Testes: `frontend/tests/unit/search-chats-dialog.test.tsx`)
- [X] T003 [P] Criar esqueleto de hook em `frontend/hooks/useChatHistorySearch.ts` (Impacto: `frontend/hooks/useChatHistorySearch.ts`; Contrato: `UseChatHistorySearchInput` e `UseChatHistorySearchOutput`; DDL: N/A; Testes: `frontend/tests/unit/use-chat-history-search.test.ts`)
- [X] T004 [P] Criar baseline de testes E2E em `frontend/tests/e2e/chat-history-search.spec.ts` (Impacto: `frontend/tests/e2e/chat-history-search.spec.ts`; Contrato: fluxos do `quickstart.md`; DDL: N/A; Testes: o proprio arquivo E2E)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Base comum obrigatoria de dominio, aplicacao, infra, API, persistencia e erros.

**⚠️ CRITICAL**: Nenhuma user story comeca antes desta fase.

- [X] T005 Definir tipos de dominio de busca em `frontend/lib/history/search/types.ts` (Impacto: `SearchQueryState`, `SearchResultItem`, `ChatMessageRecord`; Contrato: alinhar com `specs/001-search-chat-history/data-model.md`; DDL: N/A; Testes: `frontend/tests/unit/history/search/types.test.ts`)
- [X] T006 [P] Implementar validacao de entrada/saida de busca em `frontend/lib/history/search/validators.ts` (Impacto: validacao de `query`, `messageDate`, `origin`; Contrato: entrada trim/case-insensitive e saida valida; DDL: N/A; Testes: `frontend/tests/unit/history/search/validators.test.ts`)
- [X] T007 [P] Implementar construtor de snippet de dominio em `frontend/lib/history/search/snippetBuilder.ts` (Impacto: regra de trecho contextual; Contrato: `SearchResultItem.snippet`; DDL: N/A; Testes: `frontend/tests/unit/history/search/snippetBuilder.test.ts`)
- [X] T008 Implementar servico de aplicacao de busca em `frontend/lib/history/search/searchHistory.ts` (Impacto: orquestracao modo `recent`/`search`; Contrato: entrada `UseChatHistorySearchInput` e saida `SearchResultItem[]`; DDL: N/A; Testes: `frontend/tests/unit/history/search/searchHistory.test.ts`)
- [X] T009 [P] Implementar adapter de persistencia local em `frontend/lib/history/conversationHistoryStore.ts` para leitura segura de mensagens pesquisaveis (Impacto: store e fallback em memoria; Contrato: schema `prompt_ui.history.v1`; DDL: N/A; Testes: `frontend/tests/unit/history/conversationHistoryStore.search.test.ts`)
- [X] T010 [P] Implementar mapper de erro HTTP Problem Details em `frontend/lib/api/problemDetails.ts` (Impacto: parse de erros RFC 9457 ao carregar conversa; Contrato: campos `type`, `title`, `status`, `detail`, `instance`, `traceId`; DDL: N/A; Testes: `frontend/tests/unit/api/problemDetails.test.ts`)
- [X] T011 Registrar decisao de API sem novos endpoints em `specs/001-search-chat-history/contracts/ui-search-history-contract.md` (Impacto: secao de integracao HTTP; Contrato: explicitar reutilizacao de endpoint existente e tratamento RFC 9457; DDL: N/A; Testes: validacao documental em review)
- [X] T012 Registrar ausencia de mensageria nesta feature em `specs/001-search-chat-history/research.md` (Impacto: camada Mensageria marcada como N/A; Contrato: sem eventos novos; DDL: N/A; Testes: validacao documental em review)

**Checkpoint**: Base pronta para iniciar historias de usuario de forma independente.

---

## Phase 3: User Story 1 - Abrir busca no menu lateral (Priority: P1) 🎯 MVP

**Goal**: Exibir botao global "Buscar em chats" no topo do menu lateral (acima de "Historico") e abrir dialog com campo/placeholder/divisor.

**Independent Test**: Abrir menu lateral, validar botao global "Buscar em chats" acima de "Historico", confirmar ausencia dessa acao no menu de item de historico, clicar no botao global e validar dialog com placeholder e divisor horizontal.

### Tests for User Story 1

- [X] T013 [P] [US1] Criar teste de componente para abertura do dialog via botao global no topo em `frontend/tests/unit/history-sidebar-no-delete-controls.test.tsx` (Impacto: menu lateral e acionamento; Contrato: botao global acima de "Historico" e fora do menu por item; DDL: N/A; Testes: render + click + assert)
- [X] T014 [P] [US1] Criar teste de componente para placeholder/divisor em `frontend/tests/unit/search-chats-dialog.test.tsx` (Impacto: estrutura visual do dialog; Contrato: placeholder "Buscar em chats..." e separador horizontal; DDL: N/A; Testes: render + queries de UI)
- [X] T015 [US1] Criar teste E2E de abertura do dialog pelo botao global no topo em `frontend/tests/e2e/chat-history-search-open-dialog.spec.ts` (Impacto: fluxo real de UI; Contrato: cenarios US1 com botao acima de "Historico"; DDL: N/A; Testes: Playwright)

### Implementation for User Story 1

- [X] T016 [P] [US1] Implementar botao global de busca no topo do sidebar em `frontend/components/chat/HistorySidebar.tsx` (Impacto: botao "Buscar em chats" acima de "Historico"; Contrato: evento de abertura do dialog fora do menu por item; DDL: N/A; Testes: T013)
- [X] T017 [P] [US1] Implementar estrutura do dialog em `frontend/components/chat/SearchChatsDialog.tsx` (Impacto: input, placeholder e divisor horizontal; Contrato: secao "Contrato funcional do dialog"; DDL: N/A; Testes: T014)
- [X] T018 [US1] Integrar dialog ao container de chat em `frontend/components/chat/HistorySidebar.tsx` (Impacto: estado de aberto/fechado e acessibilidade basica; Contrato: interacao botao global topo->dialog e remocao da acao no menu por item; DDL: N/A; Testes: T013, T015)

**Checkpoint**: US1 funcional e testavel de forma independente.

---

## Phase 4: User Story 2 - Ver resultados padrao dos ultimos 7 dias (Priority: P1)

**Goal**: Exibir, ao abrir dialog sem busca, resultados recentes dos ultimos 7 dias com estado vazio especifico.

**Independent Test**: Abrir dialog com campo vazio e verificar listagem recente ou estado vazio de recentes.

### Tests for User Story 2

- [X] T019 [P] [US2] Criar teste unitario do filtro temporal em `frontend/tests/unit/history/search/searchHistory.recent-window.test.ts` (Impacto: regra de 7 dias; Contrato: modo `recent`; DDL: N/A; Testes: datas limite e expiradas)
- [X] T020 [P] [US2] Criar teste de hook para modo inicial em `frontend/tests/unit/use-chat-history-search.recent-mode.test.ts` (Impacto: estado inicial do dialog; Contrato: `mode = recent` com query vazia; DDL: N/A; Testes: hook state assertions)
- [X] T021 [US2] Criar teste E2E de resultados recentes em `frontend/tests/e2e/chat-history-search-recent.spec.ts` (Impacto: fluxo de abertura sem digitacao; Contrato: FR-006 e FR-012; DDL: N/A; Testes: Playwright)

### Implementation for User Story 2

- [X] T022 [P] [US2] Implementar criterio de elegibilidade de 7 dias em `frontend/lib/history/search/searchHistory.ts` (Impacto: filtro temporal em modo `recent`; Contrato: `SearchQueryState.mode`; DDL: N/A; Testes: T019)
- [X] T023 [P] [US2] Implementar estado vazio de recentes em `frontend/components/chat/SearchResultList.tsx` (Impacto: mensagem sem historicos recentes; Contrato: estado vazio especifico; DDL: N/A; Testes: `frontend/tests/unit/search-result-list.test.tsx`)
- [X] T024 [US2] Integrar modo recente no hook em `frontend/hooks/useChatHistorySearch.ts` (Impacto: query vazia => resultados recentes; Contrato: `UseChatHistorySearchOutput.results`; DDL: N/A; Testes: T020, T021)

**Checkpoint**: US2 funcional e testavel de forma independente.

---

## Phase 5: User Story 3 - Buscar termo e continuar no chat encontrado (Priority: P2)

**Goal**: Buscar por termo, mostrar trecho/data/origem e abrir o chat correspondente ao clicar no resultado.

**Independent Test**: Digitar termo, validar resultados com contexto e clicar para carregar chat atual.

### Tests for User Story 3

- [X] T025 [P] [US3] Criar teste unitario de matching textual em `frontend/tests/unit/history/search/searchHistory.query-match.test.ts` (Impacto: busca case-insensitive e trim; Contrato: modo `search`; DDL: N/A; Testes: termo existente/inexistente/espacos)
- [X] T026 [P] [US3] Criar teste unitario de snippet+metadata em `frontend/tests/unit/history/search/searchHistory.result-shape.test.ts` (Impacto: `snippet`, `messageDate`, `origin`; Contrato: `SearchResultItem`; DDL: N/A; Testes: asserts de formato)
- [X] T027 [P] [US3] Criar teste de integracao do clique em resultado em `frontend/tests/unit/hooks/useChatHistorySearch.open-conversation.test.ts` (Impacto: transicao para chat atual; Contrato: `openConversationFromResult`; DDL: N/A; Testes: sucesso + conversa indisponivel)
- [X] T028 [US3] Criar teste E2E de busca e continuidade de conversa em `frontend/tests/e2e/chat-history-search-query-and-open.spec.ts` (Impacto: fluxo completo de busca; Contrato: FR-007 a FR-011; DDL: N/A; Testes: Playwright)

### Implementation for User Story 3

- [X] T029 [P] [US3] Implementar busca por termo no servico de dominio em `frontend/lib/history/search/searchHistory.ts` (Impacto: filtro por conteudo de mensagem; Contrato: entrada/saida validadas por `validators.ts`; DDL: N/A; Testes: T025)
- [X] T030 [P] [US3] Implementar montagem de resultado no dominio em `frontend/lib/history/search/snippetBuilder.ts` (Impacto: trecho contextual + metadados; Contrato: `SearchResultItem`; DDL: N/A; Testes: T026)
- [X] T031 [P] [US3] Implementar interacao do campo de pesquisa em `frontend/components/chat/SearchChatsDialog.tsx` (Impacto: onChange, esconder placeholder nativo ao digitar; Contrato: `setQuery`/`clearQuery`; DDL: N/A; Testes: `frontend/tests/unit/search-chats-dialog.test.tsx`)
- [X] T032 [US3] Implementar lista clicavel de resultados em `frontend/components/chat/SearchResultList.tsx` (Impacto: render de trecho+data+origem e clique; Contrato: `SearchResultItem`; DDL: N/A; Testes: `frontend/tests/unit/search-result-list.test.tsx`)
- [X] T033 [US3] Implementar carregamento de conversa a partir do resultado em `frontend/hooks/useChatHistorySearch.ts` (Impacto: carregar chat atual e lidar com erro de indisponibilidade; Contrato: `openConversationFromResult`; DDL: N/A; Testes: T027, T028)
- [X] T034 [US3] Integrar mapeamento RFC 9457 no erro de abertura em `frontend/lib/api/conversationApi.ts` (Impacto: uso de `problemDetails.ts` para feedback consistente; Contrato: Problem Details quando HTTP falhar; DDL: N/A; Testes: `frontend/tests/unit/api/conversationApi.problem-details.test.ts`)
- [X] T038 [US3] Implementar estado vazio de busca filtrada em `frontend/components/chat/SearchResultList.tsx` (Impacto: mensagem clara quando query nao retorna itens; Contrato: FR-011; DDL: N/A; Testes: `frontend/tests/unit/search-result-list.test.tsx` e `frontend/tests/e2e/chat-history-search-query-empty.spec.ts`)

**Checkpoint**: US3 funcional e testavel de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar qualidade, arquitetura limpa e validacao final.

- [X] T035 [P] Revisar fronteiras Clean Architecture em `specs/001-search-chat-history/plan.md` (Impacto: confirmar separacao dominio/aplicacao/infra sem vazamento; Contrato: atualizacao da secao de re-check se necessario; DDL: N/A; Testes: checklist arquitetural em PR)
- [X] T036 [P] Atualizar documentacao de backlog tecnico em `specs/001-search-chat-history/tasks.md` (Impacto: rastreabilidade task->US->contrato; Contrato: manter consistencia com `spec.md` e `ui-search-history-contract.md`; DDL: N/A; Testes: validacao manual de completude)
- [X] T037 Executar regressao da feature conforme quickstart em `specs/001-search-chat-history/quickstart.md` (Impacto: confirmacao de aceite fim-a-fim; Contrato: cenarios SC-001..SC-004; DDL: N/A; Testes: `npm run test` e `npm run test:e2e`)
- [X] T039 [P] Instrumentar medicao de SC-001 e SC-002 em `frontend/tests/e2e/chat-history-search-open-dialog.spec.ts` e `frontend/tests/e2e/chat-history-search-recent.spec.ts` (Impacto: tempos e taxa de sucesso capturados; Contrato: SC-001, SC-002, NFR-001; DDL: N/A; Testes: Playwright com assertions de SLA)
- [X] T040 [P] Instrumentar medicao de SC-003 e SC-004 em `frontend/tests/e2e/chat-history-search-query-and-open.spec.ts` (Impacto: acuracia de busca e carregamento correto; Contrato: SC-003, SC-004, NFR-002; DDL: N/A; Testes: Playwright com dataset controlado)
- [X] T042 [P] Medir responsividade do input de busca (NFR-003) em `frontend/tests/e2e/chat-history-search-input-latency.spec.ts` (Impacto: tempo tecla->render monitorado em p95; Contrato: NFR-003; DDL: N/A; Testes: Playwright com assertions de latencia do input)
- [X] T043 [P] [US3] Validar formatacao de data exibida no resultado em `frontend/tests/unit/search-result-list.date-format.test.tsx` (Impacto: consistencia da data com padrao da aplicacao; Contrato: Assumption de formato de data; DDL: N/A; Testes: unitario de renderizacao de data)
- [X] T041 [P] Validar propagacao de `traceId` em erros HTTP com teste de integracao backend em `backend/src/test/java/.../ProblemDetailsContractTest.java` (Impacto: observabilidade RFC 9457; Contrato: `traceId` em response+log; DDL: N/A; Testes: integracao)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: sem dependencias.
- **Phase 2 (Foundational)**: depende da Phase 1 e bloqueia todas as historias.
- **Phase 3 (US1)**: depende da Phase 2.
- **Phase 4 (US2)**: depende da Phase 2; independente de US1 para regras de recentes.
- **Phase 5 (US3)**: depende da Phase 2; pode reutilizar componentes de US1/US2 sem bloquear desenvolvimento paralelo.
- **Phase 6 (Polish)**: depende da conclusao das historias desejadas.

### User Story Dependencies

- **US1 (P1)**: inicia apos fase fundacional, sem dependencia funcional de outras historias.
- **US2 (P1)**: inicia apos fase fundacional, sem dependencia funcional de US1.
- **US3 (P2)**: inicia apos fase fundacional; depende conceitualmente do dialog pronto, mas pode ser desenvolvido em paralelo com mocks.

### Dependency Graph

`Setup -> Foundational -> (US1 || US2 || US3) -> Polish`

---

## Layer Coverage (Clean Architecture)

- **Dominio**: T005, T006, T007, T022, T029, T030
- **Aplicacao**: T008, T024, T033
- **Infra**: T016, T017, T018, T023, T031, T032, T035
- **API (se houver)**: T010, T011, T034 (sem novos endpoints; apenas consumo e tratamento de erro)
- **Persistencia**: T009, T022, T024
- **Mensageria (se houver)**: T012 (N/A para esta feature, sem eventos novos)

---

## Parallel Execution Examples

### User Story 1

```bash
T013 + T014 em paralelo
T016 + T017 em paralelo
```

### User Story 2

```bash
T019 + T020 em paralelo
T022 + T023 em paralelo
```

### User Story 3

```bash
T025 + T026 + T027 em paralelo
T029 + T030 + T031 em paralelo
```

---

## Implementation Strategy

### MVP First (US1)

1. Concluir Phase 1 e Phase 2.
2. Entregar Phase 3 (US1).
3. Validar independentemente via T013-T015.

### Incremental Delivery

1. Adicionar Phase 4 (US2), validar fluxo inicial de 7 dias.
2. Adicionar Phase 5 (US3), validar busca e continuidade de chat.
3. Fechar com Phase 6 para regressao e consolidacao.

### Parallel Team Strategy

1. Time completo em Setup + Foundational.
2. Depois:
   - Dev A: US1 (UI de abertura/dialog)
   - Dev B: US2 (modo recentes)
   - Dev C: US3 (busca textual + abertura por resultado)

---

## Notes

- Nao ha migracoes/DDL nem mensageria nesta feature (registrado explicitamente).
- Nao ha novos endpoints HTTP; quando houver falha HTTP de endpoint existente, mapear para Problem Details RFC 9457 no adapter de API.
- Nao introduzir dependencias externas novas sem necessidade.

