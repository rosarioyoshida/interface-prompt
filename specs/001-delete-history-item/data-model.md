# Data Model - Exclusão de Histórico

## Entidade: IterationHistoryEntry

Representa uma conversa listada na sidebar e elegível para exclusão.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `conversationId` | string (UUID) | Sim | Identificador único da conversa |
| `title` | string | Sim | Nome exibido do histórico |
| `createdAt` | string (ISO-8601) | Sim | Data de criação da conversa |
| `lastActivatedAt` | string (ISO-8601) | Sim | Última ativação para ordenação |
| `firstPromptRaw` | string | Não | Texto original do primeiro prompt |
| `firstPromptAt` | string (ISO-8601) | Não | Timestamp da nomeação inicial |
| `messageCount` | number | Sim | Inteiro >= 0 |

## Entidade: ConversationHistoryState

Estado persistido no navegador.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `version` | number | Sim | Versão do schema atual |
| `entries` | IterationHistoryEntry[] | Sim | Lista ordenada por `lastActivatedAt` desc |
| `activeConversationId` | string | Não | Item ativo atual; `null` em estado neutro |

## Entidade: HistoryItemAction

Ação contextual disponível para cada item de histórico.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `kind` | enum (`DELETE`) | Sim | Nesta feature, somente exclusão |
| `label` | string | Sim | “Excluir histórico” |
| `position` | number | Sim | Deve ser primeira opção (`1`) |

## Entidade: DeleteConfirmation

Estado de confirmação antes de remover item.

| Campo | Tipo | Obrigatório | Regras |
|------|------|-------------|--------|
| `conversationId` | string | Sim | Item alvo da exclusão |
| `isOpen` | boolean | Sim | Controle de visibilidade do alerta |
| `isSubmitting` | boolean | Sim | Indica operação em andamento e desabilita confirmar |
| `errorMessage` | string | Não | Mensagem exibida quando exclusão falha |
| `decision` | enum (`CONFIRM`,`CANCEL`) | Não | Preenchido ao concluir interação |

## Relacionamentos

- `ConversationHistoryState.entries[*].conversationId` identifica o item que pode receber `HistoryItemAction`.
- `DeleteConfirmation.conversationId` referencia item existente em `entries` enquanto o alerta estiver aberto.

## Regras de Validação

- A exclusão só ocorre com confirmação explícita por clique no botão “Excluir”.
- Pressionar Enter no diálogo não deve confirmar a exclusão automaticamente.
- Durante `isSubmitting = true`, a ação de confirmar permanece desabilitada.
- Em falha, `entries` não sofre alteração e `errorMessage` é apresentado.
- Ao excluir `activeConversationId`, o valor ativo deve ser limpo (`null`).
- Item excluído não deve reaparecer após reload no mesmo navegador.

## Transições de Estado

1. `IDLE`
- Sem diálogo aberto.

2. `PENDING_CONFIRMATION`
- Evento: usuário escolhe “Excluir histórico”.
- Resultado: alerta aberto para item alvo.

3. `SUBMITTING_DELETE`
- Evento: usuário clica em “Excluir”.
- Resultado: confirmação desabilitada até retorno da operação.

4. `DELETED`
- Evento: operação concluída com sucesso.
- Resultado: item removido de `entries`, persistência atualizada, estado ativo limpo se necessário.

5. `CANCELLED`
- Evento: usuário clica em “Cancelar”.
- Resultado: lista permanece inalterada.

6. `DELETE_FAILED`
- Evento: erro durante persistência/atualização.
- Resultado: item permanece, diálogo aberto com erro e opção de nova tentativa.
