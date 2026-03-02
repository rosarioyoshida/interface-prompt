# Quickstart - Busca em Historico de Chats

## Pre-requisitos

- Node.js 20+
- Frontend em execucao em `http://localhost:3000`
- Historico local contendo pelo menos uma conversa com mensagens

## Execucao local

```bash
cd frontend
npm install
npm run dev
```

## Fluxo de validacao manual

1. Abrir `/chat` e confirmar presenca do menu lateral de historicos.
2. Clicar no botao `Buscar em chats`.
3. Validar abertura do dialog com campo vazio e placeholder `Buscar em chats...`.
4. Sem digitar nada, validar exibicao dos historicos dos ultimos 7 dias.
5. Digitar um termo existente e validar:
   - substituicao dos resultados iniciais por resultados filtrados;
   - exibicao de trecho contextual;
   - exibicao da data e origem da mensagem.
6. Clicar em um resultado e confirmar carregamento do chat correspondente como atual.
7. Digitar um termo inexistente e validar estado vazio mantendo o termo no campo.

## Testes automatizados sugeridos

```bash
cd frontend
npm run test
npm run test:e2e
```

## Protocolo de medicao dos criterios de sucesso

- SC-001: medir tempo entre abertura do menu e exibicao do dialog (`n>=20` tentativas).
- SC-003: validar acuracia de resultados para conjunto de termos conhecidos (`n>=30` buscas).
- SC-004: validar taxa de carregamento correto apos clique em resultado (`n>=30` cliques).

## Checklist rapido de aceite

- [ ] Botao `Buscar em chats` visivel no menu lateral
- [ ] Dialog abre sem navegacao de pagina
- [ ] Placeholder desaparece ao digitar
- [ ] Divisor horizontal separa pesquisa e resultados
- [ ] Modo inicial mostra ultimos 7 dias
- [ ] Busca por termo mostra trecho + data + origem
- [ ] Clique em resultado carrega chat correto
- [ ] Estados vazios (sem recentes e sem match) estao claros
