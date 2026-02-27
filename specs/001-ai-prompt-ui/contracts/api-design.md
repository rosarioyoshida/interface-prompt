# API Contract: Conversations API v1

**Base URL**: `/v1`
**Content-Type**: `application/json` (requests), `application/json` + `application/problem+json` (responses)
**HATEOAS**: `application/hal+json` para respostas de recursos

---

## Endpoints

### POST /v1/conversations

Cria uma nova conversa (sessão) sem mensagens.

**Request**: body vazio (ou `{}`)

**Response: 201 Created**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "EMPTY",
  "messages": [],
  "createdAt": "2026-02-26T10:00:00Z",
  "_links": {
    "self":        { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000" },
    "send-prompt": { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000/prompts", "method": "POST" }
  }
}
```

**Headers de resposta**:
- `Location: /v1/conversations/{id}`

---

### GET /v1/conversations/{id}

Retorna a conversa com o histórico completo de mensagens.

**Path params**:
- `id` (UUID, obrigatório)

**Response: 200 OK — conversa ativa com mensagens**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "ACTIVE",
  "messages": [
    {
      "id": "msg-001",
      "role": "USER",
      "content": "Explique o que é uma API REST.",
      "timestamp": "2026-02-26T10:01:00Z"
    },
    {
      "id": "msg-002",
      "role": "ASSISTANT",
      "content": "Uma API REST é uma interface de comunicação...",
      "timestamp": "2026-02-26T10:01:02Z"
    }
  ],
  "createdAt": "2026-02-26T10:00:00Z",
  "_links": {
    "self":        { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000" },
    "send-prompt": { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000/prompts", "method": "POST" },
    "clear":       { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000", "method": "DELETE" },
    "new":         { "href": "/v1/conversations", "method": "POST" }
  }
}
```

**Response: 404 Not Found**
```json
{
  "type": "https://api.promptui.local/problems/not-found",
  "title": "Recurso não encontrado",
  "status": 404,
  "detail": "Conversa com ID '550e8400-...' não foi encontrada.",
  "instance": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000",
  "traceId": "4bf92f3577b34da6a3ce929d0e0e4736"
}
```

---

### POST /v1/conversations/{id}/prompts

Envia um prompt do usuário, aguarda a resposta da IA e retorna o par de mensagens criado.

**Path params**:
- `id` (UUID, obrigatório)

**Request body**:
```json
{
  "content": "Explique o que é uma API REST."
}
```

**Response: 201 Created**
```json
{
  "conversationId": "550e8400-e29b-41d4-a716-446655440000",
  "userMessage": {
    "id": "msg-001",
    "role": "USER",
    "content": "Explique o que é uma API REST.",
    "timestamp": "2026-02-26T10:01:00Z"
  },
  "assistantMessage": {
    "id": "msg-002",
    "role": "ASSISTANT",
    "content": "Uma API REST é uma interface de comunicação...",
    "timestamp": "2026-02-26T10:01:02Z"
  },
  "_links": {
    "conversation": { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000" },
    "send-prompt":  { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000/prompts", "method": "POST" },
    "clear":        { "href": "/v1/conversations/550e8400-e29b-41d4-a716-446655440000", "method": "DELETE" }
  }
}
```

**Response: 422 Unprocessable Entity — prompt inválido**
```json
{
  "type": "https://api.promptui.local/problems/validation-error",
  "title": "Erro de Validação",
  "status": 422,
  "detail": "Um ou mais campos possuem valores inválidos.",
  "instance": "/v1/conversations/550e8400-.../prompts",
  "traceId": "7d3f8a1b9c4e2f6a0b5d1e8c3a7f2e9d",
  "errors": [
    {
      "name": "content",
      "reason": "O prompt não pode estar vazio.",
      "location": "body",
      "code": "BLANK_CONTENT"
    }
  ]
}
```

**Response: 422 Unprocessable Entity — prompt muito longo**
```json
{
  "type": "https://api.promptui.local/problems/validation-error",
  "title": "Erro de Validação",
  "status": 422,
  "detail": "Um ou mais campos possuem valores inválidos.",
  "instance": "/v1/conversations/550e8400-.../prompts",
  "traceId": "...",
  "errors": [
    {
      "name": "content",
      "reason": "O prompt não pode exceder 4096 caracteres.",
      "location": "body",
      "code": "CONTENT_TOO_LONG"
    }
  ]
}
```

**Response: 503 Service Unavailable — AI backend fora do ar**
```json
{
  "type": "https://api.promptui.local/problems/ai-gateway-unavailable",
  "title": "Serviço de IA Indisponível",
  "status": 503,
  "detail": "O serviço de inteligência artificial está temporariamente indisponível. Tente novamente em instantes.",
  "instance": "/v1/conversations/550e8400-.../prompts",
  "traceId": "..."
}
```

**Response: 404 Not Found** — conversa não existe (mesmo formato do GET /conversations/{id})

---

### DELETE /v1/conversations/{id}

Remove a conversa e todo o histórico. Usado pelo frontend para "Nova Conversa".

**Path params**:
- `id` (UUID, obrigatório)

**Response: 204 No Content** — deleção bem-sucedida (body vazio)

**Response: 404 Not Found** — conversa não encontrada

---

## HATEOAS: Ações por Estado

| Estado da Conversa | Links disponíveis                             |
|--------------------|-----------------------------------------------|
| `EMPTY`            | `self`, `send-prompt`, `new`                  |
| `ACTIVE`           | `self`, `send-prompt`, `clear`, `new`         |

---

## Headers de Rastreabilidade

Todas as respostas DEVEM incluir o `traceId` propagado:
- Em respostas de erro: campo `traceId` no Problem Details
- Header de entrada aceito: `X-Trace-Id` — se presente, é propagado; se ausente, gerado pelo serviço

---

## Versionamento

- Versão atual: `v1`
- Caminho: `/v1/conversations`
- Breaking changes resultarão em `/v2/conversations`
- Header `Deprecation` será adicionado a versões obsoletas

---

## Documentação Interativa

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI Spec (JSON): `http://localhost:8080/v3/api-docs`
- OpenAPI Spec (YAML): `http://localhost:8080/v3/api-docs.yaml`
