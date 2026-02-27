# Quickstart - Exclusão de Histórico

## Pré-requisitos

- Frontend e backend em execução via `docker compose up` ou execução local equivalente.
- Histórico com pelo menos 2 itens disponíveis.

## Execução local

```bash
cd frontend
npm install
npm run dev
```

## Fluxo de validação manual

1. Abrir `/chat/{id}` com histórico populado.
2. No item alvo, clicar no botão de ações (`...`).
3. Validar que o menu contextual é exibido e `Excluir histórico` aparece como primeira opção.
4. Clicar em `Excluir histórico` e validar alerta de irreversibilidade.
5. Pressionar Enter no diálogo e validar que a exclusão não é confirmada automaticamente.
6. Clicar em `Cancelar` e validar que o item permanece.
7. Repetir ação e confirmar `Excluir`; validar que o botão é desabilitado durante processamento.
8. Validar que o item só é removido após sucesso da operação.
9. Simular falha de exclusão e validar: item mantido, diálogo aberto e mensagem de erro com retry.
10. Excluir item ativo e validar estado neutro em `/chat` sem item selecionado.
11. Recarregar a página e validar que item excluído com sucesso não reaparece.

## Testes automatizados sugeridos

```bash
cd frontend
npm run test
npm run test:e2e
```

## Checklist rápido de aceite

- [ ] Botão de ações (`...`) visível por item
- [ ] “Excluir histórico” como primeira opção
- [ ] Alerta de confirmação obrigatório antes de excluir
- [ ] Enter não confirma exclusão automaticamente
- [ ] Cancelamento não remove item
- [ ] Botão `Excluir` desabilitado durante processamento
- [ ] Em falha, item permanece e diálogo permite nova tentativa
- [ ] Confirmação remove item e persiste após reload
- [ ] Exclusão do item ativo leva ao estado neutro
