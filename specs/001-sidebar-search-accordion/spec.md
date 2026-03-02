# Feature Specification: Ajustes Visuais da Barra Lateral

**Feature Branch**: `001-sidebar-search-accordion`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "Precisamos ajustar alguns pontos visuais. A opção Buscar em chats não deve usar o componente botão. Utilize um componente que faça o mesmo mas sem o aspecto visual do componente botão. O botão deve estar alinhado mais para baixo do botão de recolher o menu. A sessão Históricodeve deve ter o nome alterado para Seus chats e ele deve ser um accordion que permite esconder o historico de chats."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ajustar Acionador de Busca (Priority: P1)

Como usuario, quero ver a opcao "Buscar em chats" com estilo textual e posicionamento correto no topo da barra lateral para localizar conversas sem ruído visual de botao destacado.

**Why this priority**: Esse ajuste afeta a descoberta e a consistencia visual da entrada principal da busca.

**Independent Test**: Abrir a barra lateral e validar que "Buscar em chats" aparece abaixo do controle de recolher, sem estilo visual de botao, e abre o dialog normalmente ao clicar.

**Acceptance Scenarios**:

1. **Given** que a barra lateral esta expandida, **When** o usuario visualiza o topo da barra, **Then** a opcao "Buscar em chats" deve aparecer abaixo do controle de recolher.
2. **Given** que "Buscar em chats" esta visivel, **When** o usuario observa o elemento, **Then** ele deve ter apresentacao textual/neutra e nao aparentar um botao destacado.
3. **Given** que o usuario aciona "Buscar em chats", **When** o clique ocorre, **Then** o dialog de busca deve abrir com o mesmo comportamento funcional existente.

---

### User Story 2 - Renomear e Colapsar Secao de Historico (Priority: P1)

Como usuario, quero que a secao de historico se chame "Seus chats" e possa ser recolhida/expandida para organizar melhor a barra lateral.

**Why this priority**: A secao de historico e um bloco central da navegacao e o comportamento de accordion melhora leitura e foco.

**Independent Test**: Com a barra lateral expandida, validar o titulo "Seus chats", acionar o accordion para esconder a lista e reabrir, confirmando alternancia sem perda de itens.

**Acceptance Scenarios**:

1. **Given** que a barra lateral esta expandida, **When** a secao de historico e exibida, **Then** o rotulo deve ser "Seus chats".
2. **Given** que a secao "Seus chats" esta expandida, **When** o usuario recolhe o accordion, **Then** a lista de historico deve ficar oculta.
3. **Given** que a secao "Seus chats" esta recolhida, **When** o usuario expande o accordion, **Then** a lista deve voltar a ser exibida com os mesmos itens disponiveis.

---

### User Story 3 - Manter Interacoes Atuais com Nova Estrutura (Priority: P2)

Como usuario, quero continuar selecionando e gerenciando itens do historico apos os ajustes visuais, sem regressao nas acoes existentes.

**Why this priority**: A mudanca de layout nao deve quebrar navegacao nem acoes de historico ja utilizadas.

**Independent Test**: Com a secao "Seus chats" expandida, selecionar um item e abrir menu de acoes do item; confirmar que acoes existentes continuam disponiveis.

**Acceptance Scenarios**:

1. **Given** que a secao "Seus chats" esta expandida, **When** o usuario clica em um item de historico, **Then** a conversa correspondente deve ser carregada.
2. **Given** que um item de historico esta visivel, **When** o usuario abre o menu de acoes do item, **Then** as acoes atuais do item devem continuar acessiveis.
3. **Given** que a secao "Seus chats" esta recolhida, **When** o usuario a expande novamente, **Then** as interacoes por item devem permanecer funcionais.

### Edge Cases

- Quando nao houver historico, o accordion "Seus chats" deve manter comportamento consistente de expandir/recolher e exibir estado vazio adequado.
- Quando a barra lateral estiver recolhida, o estado do accordion deve ser preservado para quando a barra for expandida novamente.
- Quando o usuario alternar rapidamente entre expandir/recolher o accordion, nao deve ocorrer sobreposicao visual nem travamento da lista.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve exibir a opcao "Buscar em chats" como acionador independente com apresentacao visual neutra (sem estilo de botao destacado).
- **FR-002**: O acionador "Buscar em chats" deve ficar posicionado abaixo do controle de recolher/expandir da barra lateral.
- **FR-003**: O acionador "Buscar em chats" deve continuar abrindo o dialog de busca existente sem alterar seu comportamento funcional.
- **FR-004**: O sistema deve renomear a secao principal de historico para "Seus chats".
- **FR-005**: A secao "Seus chats" deve funcionar como accordion, permitindo recolher e expandir a lista de historico.
- **FR-006**: O estado visual da lista deve refletir corretamente o estado do accordion (lista visivel quando expandido, oculta quando recolhido).
- **FR-007**: As interacoes existentes dos itens de historico devem permanecer disponiveis quando a secao estiver expandida.
- **FR-008**: O estado vazio da lista de historico deve continuar acessivel dentro da secao "Seus chats" quando nao houver itens.

### Key Entities *(include if feature involves data)*

- **Secao Seus chats**: Bloco de navegacao na barra lateral que agrupa o historico de conversas e possui estado de expansao/recolhimento.
- **Acionador Buscar em chats**: Elemento de interface textual no topo da barra lateral que dispara a abertura do dialog de busca.
- **Estado do Accordion**: Estado de interface que define se a lista de historico esta visivel ou oculta.

## Assumptions

- O comportamento funcional atual do dialog de busca nao sera alterado, apenas seu ponto de acionamento/estilo visual.
- O termo "sem aspecto de botao" sera tratado como apresentacao textual neutra, mantendo acessibilidade de elemento clicavel.
- O accordion e aplicado apenas a secao de historico da barra lateral expandida.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em validacao de interface, 100% das renderizacoes da barra lateral exibem "Buscar em chats" abaixo do controle de recolher.
- **SC-002**: Em validacao de interface, 100% das renderizacoes da barra lateral exibem o titulo "Seus chats" no lugar de "Historico".
- **SC-003**: Em testes de interacao, o accordion da secao "Seus chats" alterna entre expandido/recolhido com sucesso em pelo menos 95% das tentativas sem regressao funcional.
- **SC-004**: Em testes de regressao da barra lateral, 100% dos fluxos criticos existentes (abrir busca, selecionar historico, abrir acoes por item) permanecem funcionais.
