# Implementation Plan: Interface de Entrada de Prompts para IA

**Branch**: `001-ai-prompt-ui` | **Date**: 2026-02-26 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ai-prompt-ui/spec.md`

---

## Summary

Interface web para envio de prompts a um backend de IA, com histórico de conversa na sessão,
gerenciamento de conversas e segurança como última etapa. Backend em Spring Boot 3.4 / Java 21
com Clean Architecture, HATEOAS, RFC 9457, OpenTelemetry. Frontend em Next.js 15 / React /
Shadcn/UI. Containerizado com Docker Compose com limites mínimos de recursos.

---

## Technical Context

**Language/Version**: Java 21 (backend) · TypeScript / Node.js 20 (frontend)
**Primary Dependencies**:
- Backend: Spring Boot 3.4.x, Spring HATEOAS, spring-boot-starter-log4j2 (Log4j2 + SLF4J),
  springdoc-openapi-starter-webmvc-ui 2.7.x, OpenTelemetry Java Agent 2.12.0, spring-boot-starter-validation
- Frontend: Next.js 15.x (App Router), React 19, Shadcn/UI, Tailwind CSS, @vercel/otel,
  lucide-react

**Storage**: In-memory (`ConcurrentHashMap`) para P1-P3; sem banco de dados

**Testing**:
- Backend: JUnit 5, Mockito, Spring Boot Test (MockMvc para contratos)
- Frontend: Jest + Testing Library (unit), Playwright (E2E)

**Target Platform**: Docker Linux containers; Docker Compose v2

**Project Type**: Web application (REST API backend + SPA-like frontend)

**Performance Goals**: Indicador de progresso visível em < 1s após envio do prompt;
suporte a histórico de até 100 pares prompt-resposta sem degradação de usabilidade

**Constraints**:
- Limites Docker: api=640m/0.5cpu, frontend=384m/0.25cpu, otel-collector=128m/0.25cpu
- JVM: `-XX:MaxRAMPercentage=60.0 -XX:InitialRAMPercentage=30.0 -XX:+UseG1GC`
- Sem logging Logback (Spring Boot default removido)
- Segurança (FR-015 a FR-017) diferida para US4/P4

**Scale/Scope**: Single-user por sessão (P1-P3); multi-user com autenticação (P4)

---

## Constitution Check

*GATE: Verificado antes da Phase 0. Re-verificado após Phase 1.*

| Princípio / Regra                          | Status | Observação                                          |
|--------------------------------------------|--------|-----------------------------------------------------|
| Clean Architecture (dependency direction)  | ✅     | Domain ← Application ← Infrastructure; ports definidos |
| SOLID — DIP                                | ✅     | `AiGateway` e `ConversationRepository` são interfaces |
| SOLID — SRP                                | ✅     | Controllers, use cases e adapters têm responsabilidade única |
| KISS — armazenamento in-memory             | ✅     | ConcurrentHashMap; sem JPA/DB desnecessários (P1-P3) |
| DRY — error handling centralizado          | ✅     | `@RestControllerAdvice` único para todos os erros   |
| YAGNI — sem features especulativas         | ✅     | Segurança explicitamente em P4; sem extras           |
| REST — verbos e status codes corretos      | ✅     | POST=201, GET=200, DELETE=204, erros=RFC 9457        |
| HATEOAS — aplicado (Conversation tem estados) | ✅  | EMPTY→ACTIVE com links condicionais por estado      |
| RFC 9457 — formato canônico de erro        | ✅     | ProblemDetail + traceId + errors[] em todos os erros |
| Validação na fronteira (Bean Validation)   | ✅     | `@NotBlank`, `@Size` no DTO; exceções de domínio mapeadas |
| Logs estruturados (Log4j2 JSON + traceId)  | ✅     | log4j2-spring.xml com JsonTemplateLayout            |
| OpenTelemetry instrumentado                | ✅     | Java agent 2.x via JAVA_TOOL_OPTIONS; frontend via @vercel/otel |
| Testes — pirâmide mínima                   | ✅     | Unit (domínio), Contrato (MockMvc + RFC 9457), E2E (P1) |
| UI/UX — cor + ícone + texto (WCAG AA)      | ✅     | Shadcn/UI tem acessibilidade built-in; error states explícitos |
| Segurança diferida (P4)                    | ✅     | FR-015 a FR-017 marcados; sem implementação prematura |

**Nenhuma violação não-justificada identificada. Gates aprovados.**

---

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-prompt-ui/
├── plan.md              ← este arquivo
├── spec.md              ← feature specification
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── api-design.md    ← Phase 1 output
├── checklists/
│   └── requirements.md  ← spec quality checklist
└── tasks.md             ← Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/[groupid]/aiprompt/
│   │   │   ├── domain/
│   │   │   │   ├── model/
│   │   │   │   │   ├── Conversation.java
│   │   │   │   │   ├── Message.java
│   │   │   │   │   ├── MessageRole.java
│   │   │   │   │   └── ConversationStatus.java
│   │   │   │   ├── port/
│   │   │   │   │   ├── AiGateway.java
│   │   │   │   │   └── ConversationRepository.java
│   │   │   │   └── exception/
│   │   │   │       ├── ConversationNotFoundException.java
│   │   │   │       └── AiGatewayException.java
│   │   │   ├── application/
│   │   │   │   ├── usecase/
│   │   │   │   │   ├── StartConversationUseCase.java
│   │   │   │   │   ├── SendPromptUseCase.java
│   │   │   │   │   ├── GetConversationUseCase.java
│   │   │   │   │   └── DeleteConversationUseCase.java
│   │   │   │   └── service/
│   │   │   │       └── ConversationService.java
│   │   │   └── infrastructure/
│   │   │       ├── adapter/
│   │   │       │   ├── ai/
│   │   │       │   │   ├── HttpAiGatewayAdapter.java
│   │   │       │   │   ├── EchoAiGatewayAdapter.java
│   │   │       │   │   └── AiBackendResponseDto.java
│   │   │       │   └── persistence/
│   │   │       │       └── InMemoryConversationRepository.java
│   │   │       ├── web/
│   │   │       │   ├── controller/
│   │   │       │   │   └── ConversationController.java
│   │   │       │   ├── dto/
│   │   │       │   │   ├── request/
│   │   │       │   │   │   └── SendPromptRequest.java
│   │   │       │   │   └── response/
│   │   │       │   │       ├── ConversationResponse.java
│   │   │       │   │       ├── MessageResponse.java
│   │   │       │   │       └── PromptResultResponse.java
│   │   │       │   ├── assembler/
│   │   │       │   │   └── ConversationModelAssembler.java
│   │   │       │   └── advice/
│   │   │       │       ├── GlobalExceptionHandler.java
│   │   │       │       └── ExtendedProblemDetail.java
│   │   │       └── config/
│   │   │           ├── OpenApiConfig.java
│   │   │           ├── WebConfig.java
│   │   │           └── AiGatewayConfig.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-mock.yml
│   │       └── log4j2-spring.xml
│   └── test/
│       └── java/com/[groupid]/aiprompt/
│           ├── domain/
│           │   └── model/
│           │       ├── ConversationTest.java
│           │       └── MessageTest.java
│           ├── application/
│           │   └── service/
│           │       └── ConversationServiceTest.java
│           └── infrastructure/
│               └── web/
│                   └── ConversationControllerContractTest.java
├── pom.xml
└── Dockerfile

frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx               # redirect → /chat
│   ├── instrumentation.ts     # OpenTelemetry setup
│   └── chat/
│       ├── layout.tsx
│       ├── page.tsx           # cria/redireciona para conversa ativa
│       └── [id]/
│           └── page.tsx       # tela principal de chat
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── PromptInput.tsx
│   │   └── ConversationHeader.tsx
│   └── ui/                    # Shadcn/UI (gerado via CLI)
├── hooks/
│   ├── useConversation.ts
│   └── useAutoScroll.ts
├── lib/
│   ├── api/
│   │   └── conversationApi.ts
│   └── types/
│       └── conversation.ts
├── public/
├── next.config.ts
├── tailwind.config.ts
├── components.json            # Shadcn config
├── package.json
├── tsconfig.json
└── Dockerfile

docker-compose.yml
docker-compose.override.yml    # overrides de desenvolvimento local
otel-collector-config.yaml
.env.example
```

**Structure Decision**: Web application (Option 2 do template) com módulos `backend/` e
`frontend/` separados na raiz do repositório. Separação permite builds independentes,
Dockerfiles dedicados e trabalho paralelo no frontend e backend.

---

## Design Decisions

### Backend

**Clean Architecture layers:**
```
domain/      → entidades Conversation, Message; ports AiGateway, ConversationRepository
application/ → casos de uso SendPromptUseCase, StartConversationUseCase, etc.
infrastructure/ → adapters HTTP (AiGateway), in-memory repo, controller REST, config
```

**Log4j2 + SLF4J:** `spring-boot-starter-logging` excluído de todos os starters;
`spring-boot-starter-log4j2` adicionado. `log4j2-spring.xml` com `JsonTemplateLayout`
para output JSON estruturado em produção; pattern simples em desenvolvimento.

**OpenTelemetry Java Agent:** Baixado via `maven-dependency-plugin` em `prepare-package`;
copiado ao container via Dockerfile; ativado por `JAVA_TOOL_OPTIONS`.

**RFC 9457:** Spring Boot 3.x tem `ProblemDetail` nativo. `ExtendedProblemDetail` adiciona
`traceId` (do MDC do Log4j2 / OTEL) e `errors[]` (validação). `GlobalExceptionHandler`
com `@RestControllerAdvice` mapeia todas as exceções de domínio.

**HATEOAS:** `ConversationModelAssembler` constrói links condicionais por estado
(`EMPTY` vs `ACTIVE`). Todos os recursos de `Conversation` retornam `EntityModel<ConversationResponse>`.

**Perfil `mock`:** `EchoAiGatewayAdapter` ativo no perfil `mock` para desenvolvimento sem
AI backend real — repete o prompt com prefixo "[Echo] ".

### Frontend

**App Router:** Rota `/chat/[id]` é a tela principal. `/chat` (sem ID) cria uma conversa
via `POST /v1/conversations` e redireciona para `/chat/{id}`. Root `/` redireciona para `/chat`.

**Estado da UI:** `useConversation` hook gerencia o estado local (mensagens, loading, erro)
e sincroniza com a API via `conversationApi.ts`. Sem state management externo (KISS).

**Feedback visual:** Estados de loading via `Skeleton` (Shadcn); erro via Toast (`sonner`)
+ borda vermelha no campo; sucesso implícito (resposta aparece). Ícone `Loader2` animado
no botão durante processamento.

**API proxy:** `next.config.ts` com `rewrites` aponta `/api/v1/*` → `http://api:8080/v1/*`
(Docker) ou `http://localhost:8080/v1/*` (local). Frontend usa `/api/v1/conversations` —
evita CORS em produção.

### Docker Compose

**Recursos mínimos recomendados:**

```yaml
# api (Spring Boot + OTEL agent)
deploy:
  resources:
    limits:
      cpus: '0.50'
      memory: 640M
    reservations:
      cpus: '0.25'
      memory: 320M

# frontend (Next.js standalone)
deploy:
  resources:
    limits:
      cpus: '0.25'
      memory: 384M
    reservations:
      cpus: '0.10'
      memory: 192M

# otel-collector
deploy:
  resources:
    limits:
      cpus: '0.25'
      memory: 128M
    reservations:
      cpus: '0.10'
      memory: 64M
```

---

## Complexity Tracking

> Nenhuma violação da constituição identificada que requeira justificativa.

---

## Artifacts Generated (Phase 0 + Phase 1)

| Arquivo                            | Status    |
|------------------------------------|-----------|
| `specs/001-ai-prompt-ui/research.md`   | ✅ Gerado |
| `specs/001-ai-prompt-ui/data-model.md` | ✅ Gerado |
| `specs/001-ai-prompt-ui/contracts/api-design.md` | ✅ Gerado |
| `specs/001-ai-prompt-ui/quickstart.md` | ✅ Gerado |
| `specs/001-ai-prompt-ui/plan.md`       | ✅ Este arquivo |
| `specs/001-ai-prompt-ui/tasks.md`      | ⏳ Gerado por `/speckit.tasks` |
