# Research: Interface de Entrada de Prompts para IA

**Feature**: 001-ai-prompt-ui
**Date**: 2026-02-26
**Status**: Complete

---

## 1. Stack Backend

### Decisão: Spring Boot 3.4.x + Java 21

- **Decision**: Spring Boot 3.4.x (linha LTS mais recente em 2026) com Java 21
- **Rationale**: Spring Boot 3.4.x é a linha de suporte ativo em 2026; Java 21 (LTS) permite
  Virtual Threads (Project Loom) para maior throughput com footprint reduzido. Spring Boot 3.x
  tem suporte nativo a RFC 7807/9457 via `ProblemDetail`.
- **Alternatives considered**: Spring Boot 3.3.x (LTS anterior, suporte até Nov 2025 — descartado
  por estar encerrando); Spring Boot 2.7.x (sem suporte a Java 21 nativo — descartado).

---

## 2. Logging: Log4j2 + SLF4J sem Logback

- **Decision**: Excluir `spring-boot-starter-logging` (Logback), adicionar
  `spring-boot-starter-log4j2`; usar SLF4J como facade; configurar layout JSON para logs
  estruturados via `log4j2-spring.xml`.
- **Rationale**: Log4j2 tem melhor performance que Logback em cenários de alto throughput
  (async appenders); suporte nativo a JSON layout (JsonTemplateLayout) sem biblioteca adicional;
  SLF4J como facade mantém o código desacoplado do provider de log.
- **How-to**:
  ```xml
  <!-- Excluir Logback de todo starter -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter</artifactId>
    <exclusions>
      <exclusion>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-logging</artifactId>
      </exclusion>
    </exclusions>
  </dependency>
  <!-- Adicionar Log4j2 -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-log4j2</artifactId>
  </dependency>
  ```
- **Alternatives considered**: Logback + Logstash encoder (mais complexo; requer dependência
  adicional para JSON — descartado por KISS).

---

## 3. OpenTelemetry: Java Agent no Container

- **Decision**: Usar o OpenTelemetry Java Agent (v2.x) via `-javaagent` no Dockerfile; baixar
  via Maven `maven-dependency-plugin` durante o build para evitar dependência de rede no
  build de imagem.
- **Rationale**: Abordagem zero-code — instrumenta automaticamente Spring Boot, JDBC, HTTP
  clients, etc. sem modificação do código de aplicação; mais completo que a integração
  manual via starter.
- **Agent Maven coordinates**:
  ```xml
  <groupId>io.opentelemetry.javaagent</groupId>
  <artifactId>opentelemetry-javaagent</artifactId>
  <version>2.12.0</version>
  ```
- **Dockerfile pattern**:
  ```dockerfile
  COPY target/opentelemetry-javaagent.jar /opt/opentelemetry-javaagent.jar
  ENV JAVA_TOOL_OPTIONS="-javaagent:/opt/opentelemetry-javaagent.jar \
    -XX:MaxRAMPercentage=60.0 \
    -XX:InitialRAMPercentage=30.0 \
    -XX:+UseG1GC"
  ```
- **Alternatives considered**: `opentelemetry-spring-boot-starter` (requer code changes,
  menos automático — descartado para manter clean architecture); download em runtime no
  Dockerfile (depende de rede no build — descartado por fragilidade).

---

## 4. Springdoc-OpenAPI (Swagger UI)

- **Decision**: `springdoc-openapi-starter-webmvc-ui` versão 2.x compatível com Spring Boot 3.
- **Rationale**: É a biblioteca oficial de integração Springdoc para Spring Boot 3.x;
  gera OpenAPI 3.1.0 spec automaticamente a partir das anotações do controller.
- **Maven coordinates**:
  ```xml
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>2.7.0</version>
  ```
- **Endpoints**: Swagger UI em `/swagger-ui.html`; spec em `/v3/api-docs`
- **Alternatives considered**: SpringFox (descontinuado, incompatível com Spring Boot 3
  — descartado).

---

## 5. HATEOAS

- **Decision**: `spring-boot-starter-hateoas`; usar `RepresentationModel`, `EntityModel`,
  `WebMvcLinkBuilder` para construção de links.
- **Rationale**: Conversation tem estados (`EMPTY` e `ACTIVE`) com transições explícitas
  (send-prompt, clear) — critério da constituição para aplicar HATEOAS.
- **Pattern**:
  ```java
  ConversationModel model = ConversationModel.of(dto);
  model.add(linkTo(methodOn(ConversationController.class)
      .getById(id)).withSelfRel());
  model.add(linkTo(methodOn(ConversationController.class)
      .sendPrompt(id, null)).withRel("send-prompt"));
  ```
- **Alternatives considered**: Links manuais (error-prone, desalinhado do Spring HATEOAS
  — descartado).

---

## 6. Frontend: Next.js + React + Shadcn/UI

- **Decision**: Next.js 15.x App Router, TypeScript, Shadcn/UI, Tailwind CSS.
- **Shadcn components**: `Button`, `Textarea`, `ScrollArea`, `Skeleton`, `Card`,
  `Badge`, `Toast` (via `sonner`), `Separator`.
- **Icons**: `lucide-react` (integrado com Shadcn): `Send`, `Loader2`, `Plus`, `Trash2`.
- **OTEL**: `@vercel/otel` com `instrumentation.ts` no root do app (App Router nativo).
- **Next.js config**: `output: 'standalone'` para otimizar imagem Docker.
- **Rationale**: Next.js App Router é o padrão atual (2026); Shadcn/UI é o design system
  mais adotado com React/Tailwind; standalone mode reduz imagem ~60%.

---

## 7. Docker Compose — Limites Mínimos Recomendados

| Serviço         | Memory Limit | CPU Limit | Memory Reservation | CPU Reservation |
|-----------------|-------------|-----------|-------------------|-----------------|
| `api`           | 640m        | 0.50      | 320m              | 0.25            |
| `frontend`      | 384m        | 0.25      | 192m              | 0.10            |
| `otel-collector`| 128m        | 0.25      | 64m               | 0.10            |

**Justificativa api**: JVM heap 60% de 640m = ~384m; OTEL agent overhead ~100-150m;
JVM off-heap (threads, metaspace) ~100m. Total ~634m → 640m é o mínimo viável.

**Justificativa frontend**: Next.js standalone Node.js process: ~200-250m em produção
com OTEL. 384m oferece margem segura.

**Justificativa otel-collector**: Coletor sem exportador externo de alto volume: 128m é
suficiente para recepcionar spans de 2 serviços.

**JVM flags para container (api)**:
```
-XX:MaxRAMPercentage=60.0    # heap = 60% do memory limit
-XX:InitialRAMPercentage=30.0 # heap inicial = 30% do memory limit
-XX:+UseG1GC                 # GC moderno, bom para latência
-XX:+ExitOnOutOfMemoryError  # fail-fast em OOM
```

---

## 8. Estratégia de Resposta da IA (Síncrona vs. SSE)

- **Decision**: Resposta síncrona (POST aguarda resposta completa; frontend mostra spinner).
- **Rationale**: O spec diz "indicador de carregamento" — não menciona streaming. Resposta
  síncrona é mais simples (KISS), não requer SSE/WebSocket no P1-P3. Streaming pode ser
  adicionado como evolução futura sem breaking change (novo endpoint ou header Accept).
- **Alternatives considered**: Server-Sent Events (mais complexo; necessidade não comprovada
  no spec atual — descartado por YAGNI).

---

## 9. Persistência (P1-P3)

- **Decision**: Repositório em memória (`ConcurrentHashMap`); sem banco de dados nos
  primeiros stories.
- **Rationale**: Spec explicitamente define "histórico mantido apenas na sessão ativa";
  nenhum requisito de persistência entre sessões para P1-P3. Adicionar banco agora seria
  YAGNI. A interface `ConversationRepository` isola a decisão — trocar por JPA/PostgreSQL
  em etapa futura não altera o domínio.
- **Alternatives considered**: H2 em memória com JPA (mais overhead, dependências extras
  sem benefício atual — descartado).

---

## 10. Modelo de Integração com AI Backend

- **Decision**: Port `AiGateway` com adapter HTTP configurável via `AI_BACKEND_URL`
  environment variable. Implementação inicial usa `RestClient` (Spring Boot 3.2+).
- **Rationale**: Desacopla o domínio do provider de IA específico; permite trocar o backend
  de IA sem alterar o domínio ou casos de uso.
- **Alternatives considered**: SDK do provider embutido (acoplamento forte ao vendor
  — descartado por DIP).
