<!--
SYNC IMPACT REPORT
==================
Versão anterior: [template/não-versionada]
Nova versão:     1.0.0
Tipo de bump:    MAJOR — criação inicial da constituição; substituição completa de template com placeholders

Seções adicionadas (todas novas):
  - Escopo
  - Princípios de Qualidade (SOLID, KISS, DRY, YAGNI, Clean Architecture)
  - Arquitetura e Organização do Código (Clean Architecture)
  - Padrões de API (REST + HATEOAS)
  - Padrão Único de Erros e Falhas (RFC 9457)
  - Validação (Entrada e Domínio)
  - Persistência e Integridade de Dados
  - UI e UX (semântica e acessibilidade)
  - Testes e Qualidade Contínua
  - Observabilidade e Suporte
  - Segurança e Boas Práticas
  - Definition of Done
  - Governance

Seções removidas:
  - Nenhuma (era template vazio com placeholders)

Templates verificados:
  ✅ .specify/templates/plan-template.md     — "Constitution Check" presente; compatível com novos princípios
  ✅ .specify/templates/spec-template.md     — alinhado com requisitos funcionais e critérios de aceite
  ✅ .specify/templates/tasks-template.md    — fases de teste, logging e validação alinhadas
  ✅ .specify/templates/agent-file-template.md — sem referências à constituição anterior

TODOs pendentes:
  - TODO(RATIFICATION_DATE): informe a data de ratificação formal pelo time técnico
-->

# Constituição de Engenharia

**Última atualização**: 2026-02-26 (UTC-3)

---

## Escopo

**Cobre:**

- Backend: serviços, lógica de domínio, persistência
- APIs: contratos REST, versionamento, erros, segurança
- Dados: modelagem, transações, integridade, auditoria
- UI: semântica visual, acessibilidade, feedback ao usuário

**Não cobre:**

- Infraestrutura de cloud/on-premise (coberta por runbooks de operações)
- Pipelines de CI/CD (cobertos por guia de DevOps)
- Processos de gestão de projeto (cobertos por playbooks de time)

---

## Princípios de Qualidade (não negociáveis)

### I. SOLID

#### Single Responsibility Principle (SRP)

- **Regra**: Cada classe/módulo DEVE ter exatamente uma razão para mudar.
- **Indicadores de violação**: classe com mais de ~200 linhas; método que mistura IO, lógica de negócio e
  formatação; nomes vagos como `Manager`, `Handler`, `Utils`.
- **Ação corretiva**: extrair responsabilidades em classes/serviços coesos; renomear para revelar propósito.

#### Open/Closed Principle (OCP)

- **Regra**: Código DEVE estar aberto para extensão e fechado para modificação.
- **Indicadores de violação**: switch/if-else que cresce a cada novo tipo; modificação de classe existente
  para cada novo caso de uso.
- **Ação corretiva**: introduzir abstrações (interfaces, polimorfismo); aplicar strategy ou decoradores.

#### Liskov Substitution Principle (LSP)

- **Regra**: Subtipos DEVEM ser substituíveis por seus tipos base sem alterar o comportamento esperado.
- **Indicadores de violação**: override que lança exceção não declarada no contrato; pré/pós-condições mais
  restritivas que o tipo base.
- **Ação corretiva**: revisar hierarquia; preferir composição sobre herança.

#### Interface Segregation Principle (ISP)

- **Regra**: Clientes NÃO DEVEM depender de métodos que não utilizam.
- **Indicadores de violação**: interface com mais de cinco métodos heterogêneos; implementações que deixam
  métodos vazios ou lançam `NotImplemented`.
- **Ação corretiva**: dividir interfaces por contexto de uso (role interfaces).

#### Dependency Inversion Principle (DIP)

- **Regra**: Módulos de alto nível NÃO DEVEM depender de módulos de baixo nível; ambos DEVEM depender de
  abstrações.
- **Indicadores de violação**: `new ConcreteRepository()` dentro de serviço de domínio; imports diretos de
  frameworks de infraestrutura em casos de uso.
- **Ação corretiva**: injetar dependências via construtor; declarar ports (interfaces) na camada de domínio.

### II. KISS (Keep It Simple, Stupid)

- **Regra**: A solução mais simples que atende o requisito DEVE ser preferida.
- **Indicadores de violação**: abstrações sem uso imediato; padrões de design aplicados preventivamente;
  código que não pode ser explicado em menos de duas frases.
- **Ação corretiva**: remover indireção desnecessária; questionar cada abstração — "qual problema concreto
  ela resolve hoje?".

### III. DRY (Don't Repeat Yourself)

- **Regra**: Lógica de negócio e regras de validação NÃO DEVEM ser duplicadas.
- **Indicadores de violação**: mesma validação em controller e serviço; constantes mágicas repetidas;
  queries copiadas entre repositórios.
- **Ação corretiva**: centralizar em serviços, constantes ou value objects. Deduplicação NÃO se aplica
  a testes — clareza tem prioridade sobre DRY em testes.

### IV. YAGNI (You Ain't Gonna Need It)

- **Regra**: Funcionalidades NÃO DEVEM ser implementadas com base em necessidade futura especulativa.
- **Indicadores de violação**: parâmetros opcionais sem uso; campos de banco "para uso futuro"; flags
  booleanos de configuração sem consumidor real.
- **Ação corretiva**: remover código não utilizado; implementar apenas quando o requisito for confirmado
  e presente.

### V. Clean Architecture

- **Regra**: Dependências DEVEM apontar exclusivamente de fora para dentro
  (infraestrutura → aplicação → domínio).
- **Indicadores de violação**: entidade de domínio importa ORM; caso de uso importa framework HTTP;
  serviço de aplicação acessa banco diretamente.
- **Ação corretiva**: introduzir ports (interfaces) na fronteira; isolar adapters na camada de
  infraestrutura.

---

## Arquitetura e Organização do Código (Clean Architecture)

### Regras de Dependência

```
[Infra / Adapters] → [Application / Use Cases] → [Domain / Entities]
```

- O **domínio** NÃO DEVE conhecer nenhum framework, biblioteca de IO, ORM ou protocolo.
- Os **casos de uso** DEVEM depender de ports (interfaces), nunca de adapters concretos.
- A **infraestrutura** DEVE implementar ports definidos pelo domínio/aplicação.

**Proibido explicitamente:**

- `import orm.Model` dentro de uma entidade de domínio
- `import http.Request` dentro de um caso de uso
- Chamada direta a banco de dados em controller ou handler

### DTOs vs Entidades

- **Entidade**: representa estado e comportamento de negócio; validada no construtor; imutável por padrão.
- **DTO**: objeto de transferência sem lógica; criado/destruído na fronteira da camada; nunca exposto
  além do adapter.
- A conversão Entidade ↔ DTO DEVE ocorrer no adapter (controller/presenter), nunca no domínio.

### Ports e Adapters

- Ports DEVEM ser interfaces declaradas na camada de domínio ou aplicação.
- Adapters DEVEM implementar um único port por responsabilidade.
- Nomes DEVEM refletir papel: `OrderRepository` (port), `PostgresOrderRepository` (adapter).

### Testabilidade

- Toda dependência externa DEVE ser injetável (via construtor ou parâmetro).
- Casos de uso DEVEM ser testáveis sem instanciar banco de dados, framework HTTP ou serviços externos.

---

## Padrões de API

### Estilo REST

- Recursos DEVEM ser substantivos no plural: `/orders`, `/users/{id}`.
- Verbos HTTP DEVEM expressar a ação: GET (leitura), POST (criação), PUT/PATCH (atualização),
  DELETE (remoção).
- Idempotência DEVE ser garantida para PUT, DELETE e GET.
- POST NÃO É idempotente por padrão; use chave de idempotência no header quando necessário
  (`Idempotency-Key`).

### Versionamento

- APIs DEVEM ser versionadas via path: `/v1/orders`.
- Breaking changes DEVEM gerar nova versão major.
- Versões deprecadas DEVEM ser sinalizadas via header `Deprecation` e mantidas por período mínimo
  definido em contrato.

### HATEOAS

**Quando aplicar:**

- Fluxos com múltiplos estados e transições explícitas (ex.: pedido com estados
  `rascunho → confirmado → enviado`).
- APIs consumidas por clientes que precisam descobrir ações disponíveis sem conhecimento prévio.

**Quando NÃO aplicar:**

- APIs internas simples de CRUD sem lógica de estado.
- Quando o custo de manutenção superar o benefício de navegabilidade.

**Formato padrão de links:**

```json
"_links": {
  "self":    { "href": "/v1/orders/42",         "method": "GET"    },
  "confirm": { "href": "/v1/orders/42/confirm",  "method": "POST"   },
  "cancel":  { "href": "/v1/orders/42/cancel",   "method": "DELETE" }
}
```

- `rel` (a chave) DEVE descrever a semântica da ação (IANA Link Relations quando aplicável).
- `href` DEVE ser URL absoluta ou relativa ao base path da API.
- `method` é RECOMENDADO; quando omitido, GET é assumido.
- Apenas ações disponíveis no estado atual DEVEM ser incluídas.

### Contratos e Compatibilidade

- Adição de campos opcionais NÃO é breaking change.
- Remoção ou renomeação de campo, mudança de tipo ou restrição de valor SÃO breaking changes.
- Toda breaking change DEVE ser comunicada com antecedência e ter migration guide.

---

## Padrão Único de Erros e Falhas (RFC 9457)

### Formato Canônico

Content-Type: `application/problem+json`

**Campos obrigatórios:**

- `type` (URI): identificador único do tipo de problema (não precisa resolver).
- `title` (string): resumo legível do tipo de erro; estável, sem dados dinâmicos.
- `status` (int): código HTTP espelhado.
- `detail` (string): explicação orientada ao cliente; útil, sem dados técnicos internos.
- `instance` (URI): identificador único desta ocorrência (ex.: path da requisição).

**Extension members obrigatórios:**

- `traceId` (string): ID de rastreamento propagado para correlação.
- `errors` (array): presente em erros de validação; cada item com:
  - `name` (string): nome do campo ou contexto.
  - `reason` (string): mensagem de erro legível.
  - `location` (string, opcional): `body | query | path | header`.
  - `code` (string, opcional): código de erro padronizado.

### Mapeamento de Status

- `400` — Requisição malformada (sintaxe inválida)
- `401` — Não autenticado
- `403` — Autenticado, mas sem permissão
- `404` — Recurso não encontrado
- `409` — Conflito de estado (ex.: recurso já existe)
- `422` — Entidade não processável (validação semântica/negócio)
- `429` — Rate limit excedido
- `500` — Erro interno inesperado
- `503` — Serviço indisponível (dependência down, manutenção)

### Regras de Segurança em Erros

- NÃO DEVE expor: stack trace, queries SQL, nomes de classes internas, dados de outros usuários.
- NÃO DEVE incluir: tokens, senhas, IDs internos de sistema, paths de arquivo do servidor.
- `detail` DEVE ser útil ao cliente sem revelar detalhes de implementação.

### Exemplo 1 — Erro de Validação (422)

```json
{
  "type": "https://api.[dominio]/problems/validation-error",
  "title": "Erro de Validação",
  "status": 422,
  "detail": "Um ou mais campos possuem valores inválidos.",
  "instance": "/v1/orders",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736",
  "errors": [
    {
      "name": "email",
      "reason": "Formato de e-mail inválido.",
      "location": "body",
      "code": "INVALID_FORMAT"
    },
    {
      "name": "quantity",
      "reason": "O valor deve ser maior que zero.",
      "location": "body",
      "code": "OUT_OF_RANGE"
    }
  ]
}
```

### Exemplo 2 — Erro Interno (500)

```json
{
  "type": "https://api.[dominio]/problems/internal-error",
  "title": "Erro Interno do Servidor",
  "status": 500,
  "detail": "Ocorreu um erro inesperado. Por favor, tente novamente ou entre em contato com o suporte.",
  "instance": "/v1/orders/42",
  "traceId": "7d3f8a1b9c4e2f6a0b5d1e8c3a7f2e9d"
}
```

---

## Validação (Entrada e Domínio)

### Regra Geral

> DEVE validar tudo que entra, antes de qualquer lógica de negócio ou persistência.

### Parâmetros de Entrada

- `path`: formato do ID (UUID, numérico); existência do recurso quando necessário.
- `query`: tipo, range, valores permitidos; paginação com limite máximo explícito.
- `header`: presença de headers obrigatórios; formato do header `Authorization`.
- `body`: tipo, formato, tamanho máximo; campos obrigatórios; enumerações; estrutura.

### Validação Sintática vs. Semântica

- **Sintática** (formato/tipo): executada na fronteira da API, antes de instanciar entidades de domínio.
- **Semântica** (regras de negócio): executada dentro do domínio; entidades DEVEM lançar exceções
  de domínio para invariantes violadas.

### Resposta de Erro de Validação

- DEVE retornar `422` com `application/problem+json` e `errors[]` populado.
- Cada campo inválido DEVE gerar uma entrada em `errors[]`.
- Todos os erros DEVEM ser retornados de uma vez (não um por vez).

### Proibições

- NÃO DEVE persistir dados sem validar invariantes de domínio.
- NÃO DEVE depender exclusivamente de constraints do banco para garantir regras de negócio.
- NÃO DEVE retornar `400` para erros semânticos de negócio — use `422`.

---

## Persistência e Integridade de Dados

### Regras de Escrita

- Toda escrita DEVE ser precedida por validação de domínio.
- Constraints no banco (chaves únicas, FKs, checks) atuam como **última linha de defesa**,
  não como substituto de validação de domínio.
- Operações DEVEM usar transações quando envolver múltiplas entidades ou tabelas.

### Concorrência e Idempotência

- Operações críticas DEVEM implementar controle de concorrência (optimistic locking ou versioning).
- Endpoints de escrita que podem ser re-tentados DEVEM suportar idempotência via `Idempotency-Key`.
- Erros de chave duplicada do banco DEVEM ser mapeados para `409 Conflict` com Problem Details.

### Auditoria

- Toda entidade persistida DEVE ter `created_at` e `updated_at` (automáticos, não editáveis pelo cliente).
- Deleção física DEVE ser evitada quando o histórico for relevante; use soft delete com `deleted_at`.
- Alterações sensíveis DEVEM registrar `updated_by` (identificador do ator).

---

## UI e UX (semântica e acessibilidade)

### Semântica de Cores

- **Erro**: vermelho — token `--color-error`
- **Warning**: amarelo/âmbar — token `--color-warning`
- **Sucesso**: verde — token `--color-success`
- **Informação**: azul/neutro — token `--color-info`

### Regras de Acessibilidade

- Cor NÃO DEVE ser o único sinal diferenciador; DEVE ser combinada com ícone e texto.
- Contraste mínimo DEVE seguir WCAG 2.1 nível AA (4,5:1 para texto normal; 3:1 para texto grande).
- Ícones com significado DEVEM ter `aria-label` ou texto alternativo.
- Mensagens de erro DEVEM ser associadas ao campo via `aria-describedby` ou equivalente.

### Composição Obrigatória de Feedback Visual

```
[ícone semântico] + [cor de fundo/borda semântica] + [texto claro orientado ao usuário]
```

Exemplo de erro: ícone "×" + borda/fundo vermelho claro + "E-mail inválido. Verifique o formato."

### Mensagens para Usuário vs. Técnicas

- Mensagens ao usuário DEVEM ser em linguagem clara e orientadas a ação
  (ex.: "Verifique o e-mail e tente novamente.").
- Detalhes técnicos (stack trace, códigos internos) DEVEM aparecer apenas em logs internos.
- O campo `detail` do Problem Details DEVE ser redigido para o consumidor técnico da API,
  sem jargão de implementação interna.

---

## Testes e Qualidade Contínua

### Pirâmide de Testes

```
        [ e2e ]          ← poucos; jornadas críticas end-to-end
     [ integração ]      ← adaptadores, repositórios, APIs externas
   [ contrato ]          ← contratos de API (incluindo erros RFC 9457)
[ unitário ]             ← domínio, casos de uso, validações
```

**Critérios mínimos por camada:**

- **Unitário**: toda lógica de domínio e casos de uso — cobertura mínima de 80%.
- **Contrato**: todos os endpoints de API, incluindo cenários de erro — 100% dos endpoints.
- **Integração**: repositórios, clients externos, mensageria — fluxos críticos.
- **E2E**: jornadas de usuário P1 — todas as jornadas P1.

### Testes de Contrato

- DEVEM cobrir respostas de sucesso E cenários de erro.
- DEVEM validar que erros retornam `application/problem+json` com todos os campos obrigatórios.
- Qualquer mudança de contrato DEVE fazer os testes falharem antes de ser mergeada.

### Quality Gates

- Linter e formatter DEVEM ser executados em todo PR (sem warnings críticos).
- Cobertura abaixo do mínimo DEVE bloquear o merge.
- Testes com falha DEVEM bloquear o merge sem exceção.

---

## Observabilidade e Suporte

### Logs Estruturados

- Logs DEVEM ser em formato estruturado (JSON ou equivalente) com campos padrão:
  `timestamp` (ISO 8601), `level`, `service`, `traceId`, `message`.
- Logs NÃO DEVEM conter dados pessoais (PII) sem mascaramento.
- `traceId` DEVE ser propagado em todos os logs e retornado no Problem Details.

### Níveis de Log

- `ERROR`: falha não esperada que impacta o usuário.
- `WARN`: situação degradada, porém recuperável.
- `INFO`: eventos de negócio relevantes (criação de pedido, login bem-sucedido).
- `DEBUG`: detalhes de execução — apenas em ambientes não-produção.

### Métricas e Traces

- Endpoints de API DEVEM emitir métricas de latência, throughput e taxa de erro.
- Requisições DEVEM ter `traceId`/`correlationId` injetado no header de entrada
  (`X-Trace-Id` ou equivalente) e propagado até a resposta e logs.
- `traceId` ausente na entrada DEVE ser gerado pelo serviço receptor.

### Privacidade em Logs

- Campos como senha, token, CPF, número de cartão DEVEM ser mascarados ou omitidos.
- Logs de acesso DEVEM registrar apenas metadados: método, path, status, latência.

---

## Segurança e Boas Práticas

### Autenticação e Autorização

- Todo endpoint protegido DEVE validar token antes de processar a requisição.
- Autorização DEVE ser verificada no nível da entidade, não apenas da rota.
- Tokens NÃO DEVEM ser logados, retornados em erros ou expostos em URLs.

### Validação e Rate Limiting

- Rate limiting DEVE ser aplicado em endpoints públicos e de autenticação.
- Inputs NÃO DEVEM ser executados sem sanitização (SQL injection, XSS, command injection).
- Headers de segurança DEVEM estar configurados (`Content-Security-Policy`,
  `X-Content-Type-Options`, `Strict-Transport-Security`, etc.).

### Princípios OWASP API

- Controle de acesso a nível de objeto e de função DEVE ser explícito e verificado.
- Exposição excessiva de dados DEVE ser evitada: retornar apenas o que o cliente precisa.
- Consumo irrestrito de recursos DEVE ser limitado (tamanho de payload, rate limit,
  paginação máxima).

### O que NÃO retornar em erros

- Stack traces, queries SQL, nomes de classes ou métodos internos.
- Dados de outros usuários ou contexto de autorização.
- Versões de bibliotecas ou do sistema operacional.
- Tokens, chaves ou credenciais de qualquer tipo.

---

## Definition of Done (checklist obrigatório)

Todo PR/entrega DEVE satisfazer os itens abaixo antes do merge:

### Funcionalidade e Validação

- [ ] Todos os inputs (path, query, header, body) são validados na fronteira da API
- [ ] Invariantes de domínio são verificadas antes de persistir
- [ ] Erros retornam `application/problem+json` (RFC 9457) com todos os campos obrigatórios
- [ ] `errors[]` populado para respostas 422

### Arquitetura

- [ ] Dependências respeitam a direção Clean Architecture (sem vazamentos de camada)
- [ ] Nenhum framework de infra importado em domínio ou casos de uso
- [ ] Revisão arquitetural solicitada se novos patterns ou fronteiras forem introduzidos

### APIs e Contratos

- [ ] Endpoints versionados corretamente
- [ ] HATEOAS aplicado quando o recurso possui estados e transições
- [ ] Nenhuma breaking change sem bump de versão major e migration guide

### Testes

- [ ] Testes unitários cobrindo lógica de domínio e casos de uso (≥ 80%)
- [ ] Testes de contrato para todos os endpoints novos ou alterados
- [ ] Cenários de erro cobertos nos testes de contrato (RFC 9457)
- [ ] Todos os testes passando antes do merge

### Observabilidade

- [ ] `traceId` propagado e presente em logs e resposta de erro
- [ ] Logs estruturados sem PII não mascarado
- [ ] Métricas cobertas para novos endpoints

### UX e Acessibilidade

- [ ] Feedbacks visuais combinam cor + ícone + texto
- [ ] Mensagens de erro são claras e orientadas ao usuário
- [ ] Contraste WCAG 2.1 AA verificado para novos componentes visuais

### Segurança

- [ ] Tokens e credenciais não expostos em logs ou respostas de erro
- [ ] Rate limiting aplicado em endpoints públicos novos
- [ ] Autorização verificada no nível da entidade

---

## Governance

- Esta Constituição DEVE ser respeitada em todas as decisões técnicas e revisões de PR.
- Qualquer proposta de emenda DEVE ser documentada, justificada e aprovada pelo time técnico
  responsável antes de entrar em vigor.
- Violações identificadas em revisão DEVEM ser corrigidas antes do merge ou documentadas como
  débito técnico com issue aberta e prazo definido.
- O checklist "Definition of Done" DEVE ser verificado em todo PR.
- Esta Constituição DEVE ser revisada periodicamente — RECOMENDA-SE a cada 3 meses ou a cada
  milestone major do produto.

**Versionamento de emendas:**

- MAJOR: remoção ou redefinição incompatível de princípio ou seção.
- MINOR: adição de novo princípio, seção ou expansão material de conteúdo existente.
- PATCH: correções de redação, clarificações, ajustes não-semânticos.

**Versão**: 1.0.0 | **Ratificada**: TODO(RATIFICATION_DATE): informe a data de ratificação pelo time | **Última atualização**: 2026-02-26
