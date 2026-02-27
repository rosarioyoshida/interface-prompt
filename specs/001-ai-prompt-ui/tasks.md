# Tasks: Interface de Entrada de Prompts para IA

**Feature**: 001-ai-prompt-ui
**Input**: Design documents from `/specs/001-ai-prompt-ui/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api-design.md ✅, quickstart.md ✅

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and delivery.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[USn]**: User story this task belongs to (US1–US3)
- Java package root: `com.example.aiprompt` — replace `com.example` with actual groupId

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, build configuration, and container infrastructure

- [x] T0XX Create `backend/pom.xml` with Spring Boot 3.4.x parent, spring-boot-starter-web, spring-boot-starter-hateoas, spring-boot-starter-validation, spring-boot-starter-log4j2 (with Logback excluded from all starters via `<exclusion>`), springdoc-openapi-starter-webmvc-ui 2.7.x; add maven-dependency-plugin to download opentelemetry-javaagent 2.12.0 jar to `target/opentelemetry-javaagent.jar` during `prepare-package` phase
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/AiPromptApplication.java` with `@SpringBootApplication` entry point
- [x] T0XX Create `frontend/package.json` with Next.js 15.x, React 19, TypeScript, Tailwind CSS, @vercel/otel, lucide-react, sonner dependencies; create `frontend/tsconfig.json` with strict mode and Next.js path aliases (`@/*` → `./*`)
- [x] T0XX [P] Create `docker-compose.yml` at repo root defining `api` service (port 8080, memory 640m, cpu 0.50, reserve 320m/0.25cpu), `frontend` service (port 3000, memory 384m, cpu 0.25, reserve 192m/0.10cpu), and `otel-collector` service (ports 4317/4318, memory 128m, cpu 0.25, reserve 64m/0.10cpu); add shared network `prompt-ui-network`; `api` depends on `otel-collector`; `frontend` depends on `api`
- [x] T0XX [P] Create `docker-compose.override.yml` at repo root for local development: override `api` with `SPRING_PROFILES_ACTIVE=mock` and publish debug port; override `frontend` with `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [x] T0XX [P] Create `otel-collector-config.yaml` at repo root with OTLP receivers (grpc on 4317, http on 4318) and logging exporter; wire to traces and metrics pipelines
- [x] T0XX [P] Create `.env.example` at repo root with `AI_BACKEND_URL`, `SERVER_PORT=8080`, `SPRING_PROFILES_ACTIVE=default`, `OTEL_SERVICE_NAME=ai-prompt-api`, `OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317`, `OTEL_RESOURCE_ATTRIBUTES=deployment.environment=local`, `NEXT_PUBLIC_API_URL=http://localhost:8080`
- [x] T0XX Initialize Shadcn/UI in `frontend/`: create `frontend/components.json` with tailwind config path pointing to `frontend/tailwind.config.ts`; create `frontend/tailwind.config.ts`; scaffold components Button, Textarea, ScrollArea, Skeleton, Card, Badge, Separator, AlertDialog under `frontend/components/ui/`

**Checkpoint**: Build infrastructure ready — `mvn clean package -DskipTests` and `npm run build` can run independently

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Domain layer, ports, infrastructure adapters, error handling, logging, and frontend config that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/domain/model/MessageRole.java` enum with `USER` and `ASSISTANT` values
- [x] T0XX [P] Create `backend/src/main/java/com/example/aiprompt/domain/model/ConversationStatus.java` enum with `EMPTY` and `ACTIVE` values
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/domain/model/Message.java` record with `UUID id`, `MessageRole role`, `String content`, `Instant timestamp`; add static factory `Message.of(MessageRole role, String content)` generating UUID and Instant.now()
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/domain/model/Conversation.java` class with `UUID id`, `Instant createdAt`, private `List<Message> messages`; `addMessagePair(Message user, Message assistant)` appending both atomically; `getMessages()` returning unmodifiable view; `getStatus()` returning EMPTY if messages empty, ACTIVE otherwise; static factory `Conversation.create()` generating UUID and Instant.now()
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/domain/port/ConversationRepository.java` interface with `Optional<Conversation> findById(UUID id)`, `Conversation save(Conversation conversation)`, `void delete(UUID id)`
- [x] T0XX [P] Create `backend/src/main/java/com/example/aiprompt/domain/port/AiGateway.java` interface with `String complete(List<Message> history, String newPrompt) throws AiGatewayException`
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/domain/exception/ConversationNotFoundException.java` extending `RuntimeException` with constructor accepting `UUID conversationId`; message: `"Conversa com ID '"+id+"' não foi encontrada."`
- [x] T0XX [P] Create `backend/src/main/java/com/example/aiprompt/domain/exception/AiGatewayException.java` extending `RuntimeException` with constructor accepting `String message, Throwable cause`
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/infrastructure/adapter/persistence/InMemoryConversationRepository.java` implementing `ConversationRepository` with `ConcurrentHashMap<UUID, Conversation>`; annotated `@Repository`
- [x] T0XX [P] Create `backend/src/main/java/com/example/aiprompt/infrastructure/adapter/ai/EchoAiGatewayAdapter.java` implementing `AiGateway`; returns `"[Echo] " + newPrompt`; annotated `@Component @Profile("mock")`
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/advice/ExtendedProblemDetail.java` class extending `ProblemDetail` adding `String traceId` (read from MDC key `"traceId"` via `MDC.get("traceId")`) and `List<FieldError> errors` where `FieldError` is a nested record with `String name, reason, location, code`
- [x] T0XX Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/advice/GlobalExceptionHandler.java` with `@RestControllerAdvice`: map `ConversationNotFoundException` → 404 with type `".../problems/not-found"`; `AiGatewayException` → 503 with type `".../problems/ai-gateway-unavailable"`; `MethodArgumentNotValidException` → 422 with type `".../problems/validation-error"` and `errors[]` list; unhandled `Exception` → 500 with type `".../problems/internal-error"`; all use `ExtendedProblemDetail` with `Content-Type: application/problem+json`
- [x] T0XX Create `backend/src/main/resources/log4j2-spring.xml` with two appender definitions: `JsonTemplateLayout` (for production profile) and `PatternLayout` with `%d{HH:mm:ss} %-5level %logger{36} - %msg%n` (for development); configure root logger at INFO; use `<springProfile>` tags for profile-based appender selection
- [x] T0XX Create `backend/src/main/resources/application.yml` with `server.port: ${SERVER_PORT:8080}`, `spring.application.name: ai-prompt-api`, `spring.mvc.problemdetails.enabled: true`, `ai.backend.url: ${AI_BACKEND_URL}`, OTEL exporter config via `${OTEL_EXPORTER_OTLP_ENDPOINT:http://localhost:4317}`
- [x] T0XX [P] Create `backend/src/main/resources/application-mock.yml` documenting that mock profile activates `EchoAiGatewayAdapter`; set `ai.backend.url: http://localhost:0` (unused in mock)
- [x] T0XX Create `frontend/next.config.ts` with `output: 'standalone'` and `rewrites` mapping `/api/v1/:path*` → `${process.env.BACKEND_URL ?? 'http://localhost:8080'}/v1/:path*`
- [x] T0XX [P] Create `frontend/instrumentation.ts` in root of `frontend/` calling `registerOTel({ serviceName: 'ai-prompt-frontend' })` from `@vercel/otel`; this file is required by Next.js App Router for instrumentation
- [x] T0XX [P] Create `frontend/lib/types/conversation.ts` with TypeScript types: `MessageRole` enum (`USER`, `ASSISTANT`), `ConversationStatus` enum (`EMPTY`, `ACTIVE`), `MessageResponse` interface, `ConversationResponse` interface, `PromptResultResponse` interface, `HateoasLink` and `HateoasLinks` interfaces; export all

**Checkpoint**: Foundation ready — domain model, ports, error handling, logging, and frontend config in place

---

## Phase 3: User Story 1 — Envio de Prompt e Recebimento de Resposta (Priority: P1) 🎯 MVP

**Goal**: User types a prompt, submits it (button or Ctrl+Enter), sees loading indicator, receives AI response in the conversation area; field clears on success; friendly error shown on failure.

**Independent Test**: Open http://localhost:3000 with `SPRING_PROFILES_ACTIVE=mock`. Type any text → click Send → prompt appears → spinner shows → "[Echo] <text>" response appears → field clears. Try empty submit → validation message, no request sent.

### Backend — User Story 1

- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/request/SendPromptRequest.java` Java record with `@NotBlank @Size(min=1, max=4096) String content`
- [x] T0XX [P] [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/MessageResponse.java` Java record with `UUID id`, `String role`, `String content`, `String timestamp` (ISO 8601 string)
- [x] T0XX [P] [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/ConversationResponse.java` Java record with `UUID id`, `String status`, `List<MessageResponse> messages`, `String createdAt`
- [x] T0XX [P] [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/PromptResultResponse.java` Java record with `UUID conversationId`, `MessageResponse userMessage`, `MessageResponse assistantMessage`
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/application/usecase/StartConversationUseCase.java` calling `Conversation.create()`, saving via `ConversationRepository.save()`, returning saved `Conversation`; annotated `@UseCase @Transactional` (or `@Component`)
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/application/usecase/SendPromptUseCase.java` loading Conversation (throw `ConversationNotFoundException` if absent); creating USER Message via `Message.of(USER, content)`; calling `AiGateway.complete(conversation.getMessages(), content)` to get AI response; creating ASSISTANT Message; calling `conversation.addMessagePair(userMsg, assistantMsg)`; saving via repository; returning updated Conversation
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/adapter/ai/AiBackendResponseDto.java` record modeling the external AI service response JSON; include at minimum `String content` or nested `choices[].message.content` per actual AI backend contract (document assumption)
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/adapter/ai/HttpAiGatewayAdapter.java` implementing `AiGateway`; inject `RestClient` bean; POST to `AI_BACKEND_URL` with conversation history mapped to request body; deserialize response as `AiBackendResponseDto`; wrap any `RestClientException` in `AiGatewayException`; annotated `@Component @Primary @Profile("!mock")`
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/config/AiGatewayConfig.java` providing `@Bean RestClient restClient()` configured with `baseUrl(${ai.backend.url})` and default `Content-Type: application/json` header; provide `@Bean @ConditionalOnMissingBean` fallback if needed
- [x] T0XX [P] [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/config/OpenApiConfig.java` with `@OpenAPIDefinition` setting info title `"AI Prompt API"`, version `"1.0"`, description matching spec feature name
- [x] T0XX [P] [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/config/WebConfig.java` implementing `WebMvcConfigurer`; add CORS mapping for `/v1/**` allowing frontend origin (`${FRONTEND_URL:http://localhost:3000}`)
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/assembler/ConversationModelAssembler.java` implementing `RepresentationModelAssembler<Conversation, EntityModel<ConversationResponse>>`; always add `self` and `send-prompt` links; add `clear` and `new` links only when `status == ACTIVE`; map `Conversation` → `ConversationResponse` including messages list
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/application/service/ConversationService.java` `@Service` injecting `StartConversationUseCase` and `SendPromptUseCase` and `ConversationModelAssembler`; expose `startConversation()` and `sendPrompt(UUID conversationId, String content)` delegating to respective use cases
- [x] T0XX [US1] Create `backend/src/main/java/com/example/aiprompt/infrastructure/web/controller/ConversationController.java` with `@RestController @RequestMapping("/v1/conversations")`; implement `POST /v1/conversations` calling `service.startConversation()`, returning 201 with `Location` header and `EntityModel<ConversationResponse>`; implement `POST /v1/conversations/{id}/prompts` with `@Validated @RequestBody SendPromptRequest`, calling `service.sendPrompt()`, returning 201 with `PromptResultResponse` including HATEOAS links
- [x] T0XX [US1] Create `backend/Dockerfile` using `eclipse-temurin:21-jre-jammy` as base; COPY built jar as `app.jar`; COPY `target/opentelemetry-javaagent.jar` to `/opt/opentelemetry-javaagent.jar`; set `ENV JAVA_TOOL_OPTIONS="-javaagent:/opt/opentelemetry-javaagent.jar -XX:MaxRAMPercentage=60.0 -XX:InitialRAMPercentage=30.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"`; EXPOSE 8080; ENTRYPOINT `["java", "-jar", "app.jar"]`

### Frontend — User Story 1

- [x] T0XX [US1] Create `frontend/lib/api/conversationApi.ts` with `createConversation(): Promise<ConversationResponse>` (POST /api/v1/conversations, expect 201) and `sendPrompt(conversationId: string, content: string): Promise<PromptResultResponse>` (POST /api/v1/conversations/{id}/prompts, expect 201); throw descriptive `Error` for non-2xx responses including error detail from RFC 9457 body
- [x] T0XX [US1] Create `frontend/hooks/useConversation.ts` managing state: `messages: MessageResponse[]`, `isLoading: boolean`, `error: string | null`; expose `sendPrompt(content: string)` that sets `isLoading=true`, calls `conversationApi.sendPrompt`, appends both `userMessage` and `assistantMessage` to messages state on success, clears error; sets `error` string on failure; resets `isLoading` in finally block
- [x] T0XX [US1] Create `frontend/components/chat/PromptInput.tsx` client component with Shadcn `Textarea` bound to local state; character counter showing remaining chars (4096 - length); Shadcn `Button` with `Send` icon (lucide-react) for submission; `Ctrl+Enter` keyboard shortcut triggering submit; button and textarea disabled when `isLoading=true`; client-side validation showing inline error when content is empty or whitespace-only on submit attempt
- [x] T0XX [P] [US1] Create `frontend/components/chat/MessageBubble.tsx` component accepting `message: MessageResponse`; USER role: align right, background distinct color; ASSISTANT role: align left, different background; render `message.content` as plain text; show role label ("Você" / "IA")
- [x] T0XX [P] [US1] Create `frontend/app/layout.tsx` root layout with `<html lang="pt-BR"><body>`; include `<Toaster />` (sonner) provider for global toast notifications; apply base font class
- [x] T0XX [US1] Create `frontend/app/chat/layout.tsx` layout wrapper for the chat section; apply full-height flex column layout
- [x] T0XX [US1] Create `frontend/app/chat/page.tsx` server component that calls `createConversation()` then `redirect('/chat/' + conversation.id)`; render minimal loading indicator while executing
- [x] T0XX [P] [US1] Create `frontend/app/page.tsx` with `redirect('/chat')` sending root visitors to the chat section
- [x] T0XX [US1] Create `frontend/app/chat/[id]/page.tsx` client component accepting `params: { id: string }`; use `useConversation` hook; render list of `MessageBubble` for each message in state; render `PromptInput` at bottom passing `sendPrompt` and `isLoading`; show `toast.error(error)` (sonner) when `error` state is set
- [x] T0XX [US1] Create `frontend/Dockerfile` using `node:20-alpine`; run `npm ci` and `npm run build`; copy only `.next/standalone/`, `.next/static/`, and `public/` to production stage; EXPOSE 3000; CMD `["node", "server.js"]`

**Checkpoint**: US1 fully functional. Run `docker compose up` with `SPRING_PROFILES_ACTIVE=mock`. Validate: submit prompt → "[Echo]" response appears; empty submit → validation message; AI error → toast shown; field clears after success.

---

## Phase 4: User Story 2 — Histórico de Conversa na Sessão (Priority: P2)

**Goal**: All prompt–response pairs from the session are visible in a scrollable area with clear visual differentiation; auto-scrolls to latest message; pauses auto-scroll when user scrolls up; resumes when user scrolls back to bottom.

**Independent Test**: Send 3+ prompts, verify all pairs appear in chronological order with sender labels; verify auto-scroll to latest message; scroll up manually → auto-scroll pauses; scroll back to bottom → auto-scroll resumes.

### Backend — User Story 2

- [x] T0XX [US2] Create `backend/src/main/java/com/example/aiprompt/application/usecase/GetConversationUseCase.java` loading Conversation from `ConversationRepository.findById(id)`; throwing `ConversationNotFoundException` if `Optional` is empty; returning the `Conversation`
- [x] T0XX [US2] Extend `backend/src/main/java/com/example/aiprompt/application/service/ConversationService.java` to inject `GetConversationUseCase`; add `getConversation(UUID id)` method delegating to use case and returning `EntityModel<ConversationResponse>` via assembler
- [x] T0XX [US2] Add `GET /v1/conversations/{id}` endpoint to `backend/src/main/java/com/example/aiprompt/infrastructure/web/controller/ConversationController.java` returning 200 + `EntityModel<ConversationResponse>` with messages ordered by `timestamp ASC` and HATEOAS links conditional on `ConversationStatus`

### Frontend — User Story 2

- [x] T0XX [US2] Add `getConversation(conversationId: string): Promise<ConversationResponse>` to `frontend/lib/api/conversationApi.ts` calling GET /api/v1/conversations/{id}; throw on 404 or other non-2xx
- [x] T0XX [US2] Create `frontend/hooks/useAutoScroll.ts` hook accepting a `containerRef: RefObject<HTMLElement>`; auto-scroll container to bottom when messages length changes; detect manual scroll-up (set `isManual = true`); detect scroll back within 50px of bottom (set `isManual = false` to resume auto-scroll); return `{ isManual }`
- [x] T0XX [US2] Create `frontend/components/chat/ChatWindow.tsx` client component accepting `messages: MessageResponse[]` and `isLoading: boolean`; wrap in Shadcn `ScrollArea` with fixed height; render `MessageBubble` for each message in order; show 3 `Skeleton` placeholder rows when `isLoading && messages.length === 0`; render empty state text when `!isLoading && messages.length === 0`; integrate `useAutoScroll` on the scroll container ref
- [x] T0XX [US2] Update `frontend/hooks/useConversation.ts` to load existing conversation on mount via `getConversation(conversationId)` (accept `conversationId` as parameter); populate `messages` state from response; handle 404 by redirecting to `/chat`
- [x] T0XX [P] [US2] Update `frontend/app/chat/[id]/page.tsx` to render `ChatWindow` component above `PromptInput`, passing `messages` and `isLoading` from `useConversation` hook

**Checkpoint**: US2 functional. Verify scrollable history with visual differentiation between user and assistant messages, and auto-scroll behavior.

---

## Phase 5: User Story 3 — Gerenciamento de Conversa (Priority: P3)

**Goal**: User can start a new conversation at any time; confirmation dialog shown when conversation has messages; no confirmation when chat is empty; "Nova Conversa" button disabled during AI processing.

**Independent Test**: Accumulate messages → click "Nova Conversa" → AlertDialog appears → confirm → history clears and new conversation starts at /chat/{newId}. Click "Nova Conversa" with empty chat → no dialog, new conversation starts immediately. During AI processing → button is disabled and non-interactive.

### Backend — User Story 3

- [x] T0XX [US3] Create `backend/src/main/java/com/example/aiprompt/application/usecase/DeleteConversationUseCase.java` loading Conversation by id (throw `ConversationNotFoundException` if absent); calling `ConversationRepository.delete(id)`
- [x] T0XX [US3] Extend `backend/src/main/java/com/example/aiprompt/application/service/ConversationService.java` to inject `DeleteConversationUseCase`; add `deleteConversation(UUID id)` method delegating to use case
- [x] T0XX [US3] Add `DELETE /v1/conversations/{id}` endpoint to `backend/src/main/java/com/example/aiprompt/infrastructure/web/controller/ConversationController.java` calling `service.deleteConversation(id)` and returning 204 No Content (empty body); return 404 via `GlobalExceptionHandler` if conversation not found

### Frontend — User Story 3

- [x] T0XX [US3] Add `deleteConversation(conversationId: string): Promise<void>` to `frontend/lib/api/conversationApi.ts` calling DELETE /api/v1/conversations/{id}; expect 204; throw on error
- [x] T0XX [US3] Add `newConversation()` async function to `frontend/hooks/useConversation.ts`: call `deleteConversation(currentConversationId)`, then `createConversation()`, then `router.push('/chat/' + newConversation.id)`; expose `isNewConversationLoading: boolean` state; make function a no-op when `isLoading` is true
- [x] T0XX [US3] Create `frontend/components/chat/ConversationHeader.tsx` client component accepting `messages: MessageResponse[]`, `onNewConversation: () => void`, `isLoading: boolean`, `isNewConversationLoading: boolean`; render "Nova Conversa" button with `Plus` icon (lucide-react); when `messages.length > 0` (ACTIVE), wrap click in Shadcn `AlertDialog` asking confirmation before calling `onNewConversation`; when `messages.length === 0` (EMPTY), call `onNewConversation` directly without dialog; disable button when `isLoading || isNewConversationLoading`
- [x] T0XX [US3] Update `frontend/app/chat/[id]/page.tsx` to include `ConversationHeader` at the top of the layout, passing `messages`, `newConversation`, `isLoading`, and `isNewConversationLoading` from `useConversation` hook

**Checkpoint**: US3 functional. All 3 user stories working together: send prompts, view full history with auto-scroll, start new conversation with confirmation guard.

---

## Final Phase: Polish & Cross-Cutting Concerns

**Purpose**: UX completeness, observability validation, and deployment readiness verification

- [x] T0XX [P] Verify Skeleton loading states in `frontend/components/chat/ChatWindow.tsx` are visible during initial load (simulate slow network); add 3 staggered Skeleton rows matching MessageBubble dimensions
- [x] T0XX [P] Add sonner `toast.error()` in `frontend/app/chat/[id]/page.tsx` triggered when `error` state is non-null from `useConversation`; auto-dismiss after 5 seconds; message includes actionable text ("Tente novamente")
- [x] T0XX [P] Audit `docker-compose.yml` resource limits against plan.md requirements: api=640m/0.5cpu (reserve 320m/0.25), frontend=384m/0.25cpu (reserve 192m/0.10), otel-collector=128m/0.25cpu (reserve 64m/0.10); correct any discrepancy
- [x] T070 Run quickstart.md validation checklist end-to-end: `docker compose up --build`; verify all 6 items pass: (1) all 3 services show `running`, (2) UI at http://localhost:3000 loads, (3) POST /v1/conversations returns 201 with `id` and `_links`, (4) send prompt returns 201, (5) Swagger UI at /swagger-ui.html accessible, (6) api logs show JSON with `traceId`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Requires Phase 1 — **BLOCKS all user stories**
- **US1 (Phase 3)**: Requires Phase 2 — creates all backend and frontend base files; first MVP story
- **US2 (Phase 4)**: Requires Phase 2 — extends US1 artifacts (same controller, service, hook); sequence after US1 to avoid file conflicts
- **US3 (Phase 5)**: Requires Phase 2 — extends same artifacts as US2; sequence after US2
- **Polish (Final Phase)**: Requires US1 + US2 + US3 completion

### User Story Dependencies

- **US1 (P1)**: No dependency on other stories; creates `ConversationController`, `ConversationService`, `conversationApi.ts`, `useConversation.ts` for the first time
- **US2 (P2)**: Adds `GET /v1/conversations/{id}` to existing files from US1; independently testable after Phase 2
- **US3 (P3)**: Adds `DELETE /v1/conversations/{id}` to existing files from US1/US2; independently testable after Phase 2

### Within Each User Story

- Backend: DTOs (parallel) → Use cases → Service extension → Controller extension → Config/Assembler
- Frontend: API client function → Hook update → Components → Page integration
- Commit at each story checkpoint before proceeding

### Parallel Opportunities

- Phase 1: T004, T005, T006, T007 all parallel after T001+T002
- Phase 2: T009+T010 parallel; T011→T012; T013+T014 parallel; T015+T016 parallel; T021+T022+T023 parallel; T025+T026 parallel
- Phase 3 backend DTOs: T027+T028+T029+T030 all parallel; T035+T036+T037 parallel
- Phase 3 frontend: T045+T046+T049 parallel; T051 parallel with T042–T044
- Phase 4: T055+T056 parallel; T059 parallel after T057+T058
- Final phase: T067+T068+T069 all parallel

---

## Parallel Example: User Story 1

```bash
# Backend DTOs — all independent, launch together (T027–T030):
Task: "Create SendPromptRequest.java in backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/request/"
Task: "Create MessageResponse.java in backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/"
Task: "Create ConversationResponse.java in backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/"
Task: "Create PromptResultResponse.java in backend/src/main/java/com/example/aiprompt/infrastructure/web/dto/response/"

# Frontend independent files — launch together (T045, T046, T049):
Task: "Create MessageBubble.tsx in frontend/components/chat/"
Task: "Create app/layout.tsx in frontend/app/"
Task: "Create app/page.tsx in frontend/app/"
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run with `SPRING_PROFILES_ACTIVE=mock`, test prompt-response loop
5. Demo: working chat interface with echo responses

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 → Working prompt-response loop → **MVP demo**
3. US2 → Scrollable history with auto-scroll
4. US3 → New conversation management
5. Polish → Production-ready deployment

### Parallel Team Strategy

With a backend developer and a frontend developer:

1. Both complete Phase 1 together (backend: T001–T002; frontend: T003, T008)
2. Phase 2: backend developer handles T009–T023; frontend developer handles T024–T026
3. Phase 3: both work in parallel — backend T027–T041, frontend T042–T051 (can start once API contracts are locked from api-design.md)
4. US2 and US3 extend same files sequentially to avoid merge conflicts

---

## Notes

- `[P]` = different files, no incomplete dependencies — safe to run in parallel
- `[USn]` = maps task to user story for traceability and independent delivery
- Java package `com.example.aiprompt` — replace `com.example` with actual project groupId everywhere
- `SPRING_PROFILES_ACTIVE=mock` activates `EchoAiGatewayAdapter` for frontend development without a real AI backend
- US4 (Security: FR-015 to FR-017) is explicitly deferred per spec.md — not included in this task list
- Validate each story checkpoint independently before proceeding to the next story
