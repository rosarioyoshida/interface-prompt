# Research - Exclusão de Histórico

## Decisão 1: Componente de ação por item
- Decision: Usar botão de ações (`...`) por item da sidebar com `DropdownMenu`.
- Rationale: Escala para outras ações futuras mantendo exclusão contextual e descoberta clara.
- Alternatives considered:
  - Botão de excluir sempre visível: descartado por poluição visual.
  - Ação apenas por atalho: descartado por baixa descobribilidade.

## Decisão 2: Ordem do menu
- Decision: Exibir “Excluir histórico” como primeira opção do menu contextual.
- Rationale: Atende requisito funcional explícito e mantém consistência em todos os itens.
- Alternatives considered:
  - Ordem alfabética: descartado por não atender requisito.
  - Submenu de ações destrutivas: descartado por aumentar fricção.

## Decisão 3: Confirmação de ação destrutiva
- Decision: Exibir `AlertDialog` obrigatório com aviso de irreversibilidade.
- Rationale: Mitiga exclusão acidental e cobre FR-003/FR-004/FR-005.
- Alternatives considered:
  - Exclusão imediata com undo: descartado por não aderir ao requisito de irreversibilidade.
  - Confirmação inline sem diálogo: descartado por menor destaque de risco.

## Decisão 4: Momento da remoção em UI
- Decision: Remover item da UI apenas após confirmação de sucesso da exclusão.
- Rationale: Evita percepção falsa de sucesso em caso de falha de persistência.
- Alternatives considered:
  - Remoção otimista com rollback: descartado por maior complexidade e risco de flicker.
  - Remoção imediata sem rollback: descartado por inconsistência de estado.

## Decisão 5: Falha durante exclusão
- Decision: Em falha, manter diálogo aberto, mostrar erro claro e permitir nova tentativa.
- Rationale: Dá feedback imediato e reduz perda de contexto do usuário.
- Alternatives considered:
  - Fechar diálogo em falha: descartado por exigir reabertura e aumentar atrito.
  - Retry silencioso automático: descartado por baixa transparência.

## Decisão 6: Exclusão do item ativo
- Decision: Ao excluir item ativo, limpar `activeConversationId` e navegar para estado neutro (`/chat`).
- Rationale: Comportamento previsível, sem seleção implícita de outro item.
- Alternatives considered:
  - Selecionar item vizinho automaticamente: descartado por comportamento implícito inesperado.

## Decisão 7: Prevenção de envio duplicado
- Decision: Desabilitar botão de confirmação enquanto operação está em andamento.
- Rationale: Evita exclusões duplicadas e corridas de estado.
- Alternatives considered:
  - Manter botão ativo com debounce: descartado por menor robustez comportamental.

## Decisão 8: Teclado no diálogo
- Decision: Não confirmar exclusão por atalho Enter; confirmar apenas por clique explícito em “Excluir”.
- Rationale: Aumenta segurança para operação irreversível.
- Alternatives considered:
  - Permitir Enter como confirmação: descartado por maior risco de ação acidental.

## Resultado
Todas as clarificações críticas foram resolvidas e não há itens `NEEDS CLARIFICATION`.
