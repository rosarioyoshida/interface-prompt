# Feature Specification: Prompt History Sidebar

**Feature Branch**: `001-prompt-history-sidebar`  
**Created**: 2026-02-27  
**Status**: Draft  
**Input**: User description: "na interface de prompt precisamos de uma lista contendo os históricos de iteração do usuário. Quando o usuário clicar sobre o nome do historico ele deve ser carregado como iteração atual. Essa lista deve ficar disponível em um menu lateral que pode ser recolhido para minimizar a quantidade de informações na tela. O hostorico deve ser gravado com o nome do contexto do primeiro prompt enviado."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access Iteration History (Priority: P1)

As a user, I want to see a list of my past prompt iterations so I can quickly resume a previous context.

**Why this priority**: Resuming prior work is the core value of having history.

**Independent Test**: Can be fully tested by creating multiple iterations and verifying they appear in the history list.

**Acceptance Scenarios**:

1. **Given** the user has at least two previous iterations, **When** they open the interface, **Then** a history list is visible showing those iterations in a consistent order.
2. **Given** the history list is visible, **When** the user selects a history item, **Then** that iteration becomes the current active iteration.

---

### User Story 2 - Collapse the History Menu (Priority: P2)

As a user, I want to collapse the history menu to reduce visual clutter and focus on the prompt area.

**Why this priority**: Helps users who prefer a minimal workspace without losing access to history.

**Independent Test**: Can be fully tested by toggling the menu state and observing layout changes.

**Acceptance Scenarios**:

1. **Given** the history menu is expanded, **When** the user chooses to collapse it, **Then** the menu is hidden or minimized and the main prompt area remains usable.
2. **Given** the history menu is collapsed, **When** the user chooses to expand it, **Then** the list of history items is visible again.

---

### User Story 3 - Name History by First Prompt (Priority: P3)

As a user, I want each history entry to be named after the context of the first prompt so I can recognize it later.

**Why this priority**: Clear naming makes the history list meaningful and easier to scan.

**Independent Test**: Can be fully tested by sending a first prompt and verifying the history entry name.

**Acceptance Scenarios**:

1. **Given** a new iteration with no history name, **When** the user sends the first prompt, **Then** the history entry is labeled using the first prompt context.

---

### Edge Cases

- What happens when there is no history yet? The menu should show an empty state without errors.
- How does the system handle very long first prompts? The history list should remain readable and not break layout.
- What happens if the first prompt fails to send? The history entry should not be named until a first prompt is successfully sent.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a history list of the user's prompt iterations.
- **FR-002**: The history list MUST be accessible from a side menu that can be expanded and collapsed.
- **FR-003**: Users MUST be able to select a history entry to load it as the current active iteration.
- **FR-004**: The system MUST name each history entry based on the context of the first prompt sent in that iteration.
- **FR-005**: The system MUST persist the history list so it remains available after page reloads in the same browser.
- **FR-006**: The system MUST clearly indicate which history entry is currently active.
- **FR-007**: The system MUST show a clear empty state when no history entries exist.
- **FR-008**: The history list MUST remain readable when entry names are long.

### Key Entities *(include if feature involves data)*

- **Iteration History Entry**: Represents a past prompt iteration with a name derived from the first prompt context and a reference to its messages.
- **Iteration**: Represents a single prompt conversation state that can be activated from the history list.

### Assumptions

- History is scoped to the current user in the current browser and is not shared across devices.
- The "context of the first prompt" refers to the textual content of the first prompt sent in that iteration.
- The history list is ordered consistently, with the most recent iteration first.

### Dependencies

- Existing capability to create and load prompt iterations.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can switch to a previous iteration from the history list in two interactions or fewer.
- **SC-002**: 100% of new iterations receive a history name immediately after the first prompt is successfully sent.
- **SC-003**: The history menu can be expanded or collapsed without blocking prompt input.
- **SC-004**: At least 90% of users can return to a prior iteration on their first attempt in usability testing.
- **SC-005**: Users can refresh the page and still see their history list without needing to re-create iterations.
