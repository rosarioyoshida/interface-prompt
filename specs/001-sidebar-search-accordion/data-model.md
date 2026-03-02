# Data Model - Ajustes Visuais da Barra Lateral

## SidebarVisualState
- **Description**: estado de interface da barra lateral relacionado ao cabeçalho e visibilidade da seção de chats.
- **Fields**:
  - `isSidebarCollapsed` (boolean): indica se a barra lateral inteira está recolhida.
  - `isChatsSectionExpanded` (boolean): indica se a seção "Seus chats" está expandida.
  - `isSearchDialogOpen` (boolean): indica se o dialog de busca está aberto.

## SearchTriggerView
- **Description**: representação do acionador "Buscar em chats" no topo da sidebar.
- **Fields**:
  - `label` (string): valor fixo "Buscar em chats".
  - `placement` (enum): `below-sidebar-toggle`.
  - `visualStyle` (enum): `neutral-text-action`.
  - `isInteractive` (boolean): deve ser verdadeiro para foco e clique.

## ChatsSectionView
- **Description**: representação visual da seção de histórico como accordion.
- **Fields**:
  - `title` (string): valor fixo "Seus chats".
  - `isAccordion` (boolean): deve ser verdadeiro.
  - `isExpanded` (boolean): controla visibilidade da lista.
  - `emptyStateVisible` (boolean): visível quando não há entradas e seção expandida.

## Relationships
- `SidebarVisualState.isChatsSectionExpanded` controla `ChatsSectionView.isExpanded`.
- `SearchTriggerView` existe apenas quando `SidebarVisualState.isSidebarCollapsed = false`.
- `ChatsSectionView` compartilha a mesma origem de dados de histórico existente (sem novo armazenamento).

## Validation Rules
- `SearchTriggerView.label` MUST ser "Buscar em chats".
- `ChatsSectionView.title` MUST ser "Seus chats".
- Se `isChatsSectionExpanded = false`, a lista de histórico não deve ser renderizada.
- Se `isChatsSectionExpanded = true` e não houver dados, o estado vazio deve ser renderizado.

## State Transitions
1. `isChatsSectionExpanded: true -> false` ao acionar recolhimento do accordion.
2. `isChatsSectionExpanded: false -> true` ao acionar expansão do accordion.
3. `isSearchDialogOpen: false -> true` ao ativar "Buscar em chats".
4. `isSearchDialogOpen: true -> false` ao fechar o dialog.
