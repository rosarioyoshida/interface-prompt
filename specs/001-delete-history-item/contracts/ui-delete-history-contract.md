# UI Contract - Exclusão de Histórico

## Escopo

Contrato de comportamento para ação de exclusão por item no histórico da sidebar.

## 1. Contrato de interação por item

### Ação contextual

- Cada item da lista deve expor um botão de ações (`...`).
- Ao abrir o menu contextual, a primeira opção deve ser `Excluir histórico` (posição 1).

### Confirmação

- Selecionar `Excluir histórico` abre `AlertDialog` de confirmação.
- O alerta informa explicitamente que a exclusão não pode ser desfeita.
- Botões esperados: `Cancelar` e `Excluir`.
- A confirmação ocorre apenas por clique explícito em `Excluir`.
- Pressionar Enter não confirma exclusão automaticamente.

## 2. Contrato de estado esperado

### Confirmar exclusão (sucesso)

1. Entrar em estado de submissão e desabilitar `Excluir`.
2. Remover item de `entries` somente após sucesso.
3. Persistir estado atualizado em `prompt_ui.history.v1`.
4. Se item era ativo, limpar `activeConversationId`.
5. Navegar para estado neutro (`/chat`) quando o item ativo for removido.

### Cancelar exclusão

1. Fechar alerta.
2. Não alterar `entries` nem `activeConversationId`.

## 3. Contrato de erro

- Em falha de exclusão, item deve permanecer na lista.
- O diálogo permanece aberto.
- Deve ser exibida mensagem clara de erro.
- Usuário pode tentar novamente sem reabrir o menu.

## 4. Critérios verificáveis

- “Excluir histórico” é a primeira opção para todos os itens.
- Nenhum item é removido sem confirmação explícita por clique.
- Botão de confirmar fica desabilitado durante processamento.
- Item excluído não reaparece após reload no mesmo navegador.
