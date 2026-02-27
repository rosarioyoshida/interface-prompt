# Research - Prompt History Sidebar

## Decisão 1: Persistência do histórico
- Decision: Usar `localStorage` no frontend com chave versionada (`prompt_ui.history.v1`).
- Rationale: Atende FR-005 (persistência após refresh no mesmo browser), não exige mudanças de backend e mantém baixo acoplamento.
- Alternatives considered:
  - `sessionStorage`: descartado por não persistir após refresh completo/fechamento.
  - IndexedDB: descartado por complexidade desnecessária para volume pequeno.
  - Backend endpoint de listagem: descartado nesta fase por ampliar escopo.

## Decisão 2: Momento de criação/nomeação da entrada
- Decision: Criar entrada no histórico ao criar conversa e definir `title` apenas quando o primeiro prompt for enviado com sucesso.
- Rationale: Respeita edge case de falha no primeiro envio; evita nome inconsistente.
- Alternatives considered:
  - Nomear no momento da criação da conversa: descartado, não há conteúdo ainda.
  - Nomear no primeiro input digitado: descartado, pode não ser enviado com sucesso.

## Decisão 3: Estratégia de título e legibilidade
- Decision: Usar conteúdo do primeiro prompt com `trim`, normalização de espaços e truncamento visual (ex.: 60 chars + ellipsis em UI).
- Rationale: Atende FR-004 e FR-008 mantendo legibilidade sem perda do significado inicial.
- Alternatives considered:
  - Limitar hard no dado persistido: descartado para não perder contexto original.
  - Quebra em múltiplas linhas sem truncar: descartado por risco de quebrar layout da lista.

## Decisão 4: Ordenação e item ativo
- Decision: Ordenar por `lastActivatedAt` desc e manter `activeConversationId` em estado da tela.
- Rationale: Atende assunção de "mais recente primeiro" e facilita retomada rápida (SC-001).
- Alternatives considered:
  - Ordenar por `createdAt`: descartado, não reflete uso recente.
  - Ordem fixa de criação: descartado por pior UX.

## Decisão 5: Estado colapsado da sidebar
- Decision: Persistir flag `isHistorySidebarCollapsed` em `localStorage` separado.
- Rationale: Mantém preferência do usuário entre recargas e reduz fricção de uso.
- Alternatives considered:
  - Estado apenas em memória React: descartado por resetar a cada refresh.
  - Cookie: descartado, não agrega benefício para estado local de UI.

## Decisão 6: Comportamento quando conversa não existe mais
- Decision: Ao clicar em item histórico que retornar 404 no carregamento, remover item inválido do store e mostrar feedback não bloqueante.
- Rationale: Mantém integridade da lista e evita loop de erro.
- Alternatives considered:
  - Manter item inválido com erro persistente: descartado por degradar UX.
  - Ocultar erro silenciosamente: descartado por falta de transparência ao usuário.

## Decisão 7: Estratégia de testes
- Decision: Cobrir lógica de store/hook com testes unitários e fluxos críticos da sidebar com Playwright.
- Rationale: Garante regressão baixa em persistência/seleção/toggle com custo moderado.
- Alternatives considered:
  - Apenas E2E: descartado por baixa precisão de diagnóstico.
  - Apenas unitário: descartado por não validar interação real de UI.

## Resultado
Todos os pontos de **NEEDS CLARIFICATION** foram resolvidos para a fase de design.
