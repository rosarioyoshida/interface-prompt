# Quickstart - Prompt History Sidebar

## Pré-requisitos

- Node.js 20+
- Backend API em execução em `http://localhost:8080`
- Frontend Next.js em `http://localhost:3000`

## Execução local

```bash
cd frontend
npm install
npm run dev
```

## Fluxo de validação manual

1. Abrir `/chat` para iniciar uma nova conversa.
2. Enviar primeiro prompt com conteúdo identificável (ex.: "Planejamento release Q2").
3. Confirmar que uma nova entrada aparece na sidebar com nome derivado desse primeiro prompt.
4. Criar outra conversa e repetir envio; validar ordem mais recente no topo.
5. Clicar em um item anterior; validar que vira iteração ativa e conversa é carregada.
6. Colapsar a sidebar; recarregar página; validar persistência do estado colapsado.
7. Recarregar novamente; validar persistência das entradas históricas no mesmo browser.

## Testes automatizados sugeridos

```bash
cd frontend
npm run test
npm run test:e2e
```

## Protocolo de usabilidade (SC-004)

- Amostra mínima: `n>=10` usuários.
- Tarefa: retomar uma conversa anterior usando a sidebar sem ajuda externa.
- Limite operacional: conclusão em até `2` interações.
- Critério de aprovação: `>=90%` dos participantes concluem a tarefa dentro do limite.
- Registro obrigatório: total de participantes, total de sucesso, percentual final e status `PASS/FAIL`.

## Checklist rápido de aceite

- [ ] Lista de histórico disponível na lateral e navegável por teclado
- [ ] Seleção de item carrega iteração correta
- [ ] Entrada ativa com destaque visual claro
- [ ] Nome baseado no primeiro prompt enviado com sucesso
- [ ] Estado vazio exibido quando não há histórico
- [ ] Layout permanece legível com títulos longos
- [ ] Persistência funcional após refresh no mesmo browser
- [ ] SC-004 validado com `n>=10` e taxa de sucesso `>=90%`
