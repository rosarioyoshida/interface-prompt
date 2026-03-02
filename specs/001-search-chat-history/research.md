# Research - Busca em Historico de Chats

## Decisao 1: Fonte de dados para busca
- Decision: Usar o historico local ja persistido em `prompt_ui.history.v1` como fonte primaria para indexacao e busca.
- Rationale: Mantem o escopo no frontend, evita dependencia de novos endpoints e reaproveita o padrao definido em `001-prompt-history-sidebar`.
- Alternatives considered:
  - Endpoint dedicado de busca no backend: descartado por ampliar escopo e contratos.
  - Indexacao em IndexedDB: descartado por complexidade desnecessaria para volume pequeno.

## Decisao 2: Comportamento inicial do dialog
- Decision: Ao abrir com campo vazio, listar historicos com atividade nos ultimos 7 dias corridos.
- Rationale: Alinha com FR-006 e melhora descoberta sem exigir digitacao inicial.
- Alternatives considered:
  - Exibir historico completo sem filtro temporal: descartado por reduzir relevancia inicial.
  - Exibir lista vazia ate digitar termo: descartado por pior experiencia de descoberta.

## Decisao 3: Estrategia de matching do termo
- Decision: Aplicar busca case-insensitive e trim de espacos, tratando entrada vazia como modo padrao de 7 dias.
- Rationale: Cobre edge cases de maiusculas/minusculas e entrada com espacos sem ambiguidades.
- Alternatives considered:
  - Busca case-sensitive: descartado por menor taxa de acerto do usuario.
  - Busca com regex livre: descartado por complexidade e risco de inconsistencias.

## Decisao 4: Formato do resultado de busca
- Decision: Cada item exibira trecho contextual da mensagem, data da ocorrencia e origem (usuario/resposta).
- Rationale: Atende FR-008 e FR-009 com contexto suficiente para decisao de clique.
- Alternatives considered:
  - Mostrar apenas titulo da conversa: descartado por falta de contexto do termo.
  - Mostrar mensagem completa: descartado por poluicao visual e baixa escaneabilidade.

## Decisao 5: Comportamento ao selecionar resultado
- Decision: Clique em resultado carrega a conversa correspondente como chat atual; se conversa nao estiver mais disponivel, exibir feedback amigavel e manter dialog.
- Rationale: Atende FR-010 e edge case de historico removido sem quebrar fluxo.
- Alternatives considered:
  - Fechar dialog mesmo em erro: descartado por interromper recuperacao do usuario.
  - Ignorar erro silenciosamente: descartado por baixa transparencia.

## Decisao 6: Estrategia de testes
- Decision: Cobrir funcoes de normalizacao/filtro/snippet com testes unitarios e o fluxo completo do dialog com Playwright.
- Rationale: Garante previsibilidade das regras e valida integracao de UX ponta a ponta.
- Alternatives considered:
  - Apenas E2E: descartado por diagnostico dificil de regressao em regras de busca.
  - Apenas unitario: descartado por nao validar interacao real no menu/dialog.

## Resultado
Todos os pontos de contexto tecnico foram resolvidos sem pendencias de clarificacao.
