# Data Model: Interface de Entrada de Prompts para IA

**Feature**: 001-ai-prompt-ui
**Date**: 2026-02-26

---

## Domain Entities

### Conversation (Aggregate Root)

Representa uma sequência de interações entre o usuário e a IA durante uma sessão.

| Campo       | Tipo                  | Regras                                              |
|-------------|----------------------|-----------------------------------------------------|
| `id`        | UUID                 | Gerado automaticamente; imutável após criação       |
| `createdAt` | Instant              | Gerado automaticamente; imutável                    |
| `messages`  | List\<Message\>      | Ordenada por timestamp; imutável externamente       |
| `status`    | ConversationStatus   | Derivado: EMPTY se sem mensagens, ACTIVE caso contrário |

**Invariantes de domínio:**
- Mensagens são adicionadas em pares (USER + ASSISTANT) atomicamente.
- Uma conversa `EMPTY` pode aceitar novos prompts.
- Uma conversa `ACTIVE` pode aceitar novos prompts ou ser limpa (deletada).
- Não é possível adicionar apenas uma mensagem de um lado sem a correspondente.

**Estado (ConversationStatus):**
```
EMPTY ──[send-prompt]──► ACTIVE ──[send-prompt]──► ACTIVE
  ▲                         │
  └──────[clear/delete]─────┘
```

---

### Message (Value Object)

Unidade de comunicação dentro de uma Conversation.

| Campo       | Tipo        | Regras                                                  |
|-------------|------------|----------------------------------------------------------|
| `id`        | UUID        | Gerado automaticamente                                   |
| `role`      | MessageRole | Obrigatório; USER ou ASSISTANT                          |
| `content`   | String      | Obrigatório; 1–4096 caracteres; trim aplicado na entrada |
| `timestamp` | Instant     | Gerado automaticamente; imutável                         |

---

### MessageRole (Enum)

| Valor       | Descrição                          |
|-------------|-------------------------------------|
| `USER`      | Mensagem originada pelo usuário     |
| `ASSISTANT` | Resposta gerada pela IA             |

---

### ConversationStatus (Enum — derivado)

| Valor    | Condição                                  |
|----------|-------------------------------------------|
| `EMPTY`  | `messages` está vazio                     |
| `ACTIVE` | `messages` contém ao menos um par         |

---

## DTOs (Fronteira da API)

### SendPromptRequest (entrada)

| Campo     | Tipo   | Validação                                         |
|-----------|--------|---------------------------------------------------|
| `content` | String | @NotBlank; @Size(min=1, max=4096)                |

---

### PromptResultResponse (saída — resultado de POST /prompts)

| Campo             | Tipo            | Descrição                                 |
|-------------------|-----------------|-------------------------------------------|
| `userMessage`     | MessageResponse | Mensagem do usuário criada                |
| `assistantMessage`| MessageResponse | Resposta da IA                            |
| `conversationId`  | UUID            | ID da conversa pai                        |
| `_links`          | HateoasLinks    | Links para ações disponíveis              |

---

### ConversationResponse (saída — GET /conversations/{id})

| Campo        | Tipo                  | Descrição                              |
|--------------|----------------------|-----------------------------------------|
| `id`         | UUID                 | ID da conversa                          |
| `status`     | String               | "EMPTY" ou "ACTIVE"                     |
| `messages`   | List\<MessageResponse\> | Ordenadas por timestamp ASC          |
| `createdAt`  | String               | ISO 8601                                |
| `_links`     | HateoasLinks         | Links para ações disponíveis            |

---

### MessageResponse (saída — elemento de lista)

| Campo       | Tipo   | Descrição                          |
|-------------|--------|-------------------------------------|
| `id`        | UUID   | ID da mensagem                      |
| `role`      | String | "USER" ou "ASSISTANT"               |
| `content`   | String | Conteúdo da mensagem                |
| `timestamp` | String | ISO 8601                            |

---

## Ports (Interfaces de Domínio)

### ConversationRepository

```
+ findById(id: UUID): Optional<Conversation>
+ save(conversation: Conversation): Conversation
+ delete(id: UUID): void
```

**Implementações:**
- `InMemoryConversationRepository` — P1-P3 (thread-safe via ConcurrentHashMap)
- Futura: `JpaConversationRepository` — P4+ (persistência entre sessões)

---

### AiGateway

```
+ complete(conversationHistory: List<Message>, newPrompt: String): String
```

**Implementações:**
- `HttpAiGatewayAdapter` — chama endpoint externo via RestClient; URL configurável via
  `AI_BACKEND_URL` environment variable
- `EchoAiGatewayAdapter` — mock para testes e desenvolvimento local

---

## Regras de Validação (camadas)

### Camada API (Bean Validation — sintática)

| Parâmetro              | Regra                                  |
|------------------------|----------------------------------------|
| `path: id`             | UUID válido; conversa deve existir (404 se não) |
| `body: content`        | @NotBlank; @Size(max=4096)             |

### Camada de Domínio (semântica)

| Invariante                          | Exceção de domínio        | HTTP |
|-------------------------------------|---------------------------|------|
| Conversa não encontrada             | `ConversationNotFoundException` | 404 |
| AI Gateway indisponível             | `AiGatewayException`       | 503 |
| Conteúdo excede limite              | Tratado na fronteira       | 422 |

---

## Mapeamento de Erros → RFC 9457

| Situação                      | Status | `type` URI                          |
|-------------------------------|--------|--------------------------------------|
| Prompt vazio ou inválido      | 422    | `.../problems/validation-error`      |
| Conversa não encontrada       | 404    | `.../problems/not-found`             |
| AI Gateway com falha          | 503    | `.../problems/ai-gateway-unavailable`|
| Erro interno não esperado     | 500    | `.../problems/internal-error`        |
