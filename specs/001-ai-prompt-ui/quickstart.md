# Quickstart: Interface de Entrada de Prompts para IA

**Feature**: 001-ai-prompt-ui
**Branch**: 001-ai-prompt-ui

---

## Pré-requisitos

- Docker 24+ e Docker Compose v2+
- Java 21 (JDK) — para build do backend local
- Node.js 20+ e npm — para build do frontend local
- Maven 3.9+ — para build do backend
- Variável de ambiente `AI_BACKEND_URL` configurada com o endpoint do serviço de IA

---

## 1. Build do Backend (Spring Boot)

```bash
cd backend
mvn clean package -DskipTests
```

O `maven-dependency-plugin` baixa o OTEL Java agent para `target/opentelemetry-javaagent.jar`
automaticamente durante o build.

Executar com testes:
```bash
mvn clean verify
```

---

## 2. Build do Frontend (Next.js)

```bash
cd frontend
npm install
npm run build
```

---

## 3. Subir via Docker Compose

```bash
# A partir da raiz do repositório
cp .env.example .env
# Editar .env: configurar AI_BACKEND_URL

docker compose up --build
```

### Serviços disponíveis

| Serviço          | URL                              | Descrição                        |
|------------------|----------------------------------|----------------------------------|
| Frontend (UI)    | http://localhost:3000            | Interface do usuário (Next.js)   |
| Backend (API)    | http://localhost:8080            | API REST Spring Boot             |
| Swagger UI       | http://localhost:8080/swagger-ui.html | Documentação interativa da API |
| OpenAPI Spec     | http://localhost:8080/v3/api-docs | Especificação OpenAPI 3.1        |
| OTEL Collector   | http://localhost:4318 (OTLP HTTP) | Recepção de telemetria           |

---

## 4. Variáveis de Ambiente

### .env.example

```env
# URL do serviço de IA (obrigatório)
AI_BACKEND_URL=http://localhost:11434/v1/chat/completions

# Configurações do backend
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=default

# OpenTelemetry
OTEL_SERVICE_NAME=ai-prompt-api
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4317
OTEL_RESOURCE_ATTRIBUTES=deployment.environment=local

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 5. Fluxo de Uso Básico

### Via Interface Web (recomendado)

1. Abrir http://localhost:3000
2. Uma nova conversa é criada automaticamente
3. Digitar um prompt no campo de texto
4. Clicar em **Enviar** (ou `Ctrl+Enter`)
5. Aguardar a resposta da IA aparecer
6. Para nova conversa: clicar em **Nova Conversa** e confirmar

### Via cURL (teste da API diretamente)

**Criar conversa:**
```bash
CONV=$(curl -s -X POST http://localhost:8080/v1/conversations \
  -H "Content-Type: application/json" | jq -r '.id')
echo "Conversa ID: $CONV"
```

**Enviar prompt:**
```bash
curl -s -X POST http://localhost:8080/v1/conversations/$CONV/prompts \
  -H "Content-Type: application/json" \
  -d '{"content": "O que é Clean Architecture?"}' | jq .
```

**Ver histórico:**
```bash
curl -s http://localhost:8080/v1/conversations/$CONV | jq '.messages'
```

**Limpar conversa:**
```bash
curl -s -X DELETE http://localhost:8080/v1/conversations/$CONV
# Retorna 204 No Content
```

---

## 6. Rodar Testes

### Backend

```bash
cd backend

# Testes unitários
mvn test -pl backend

# Testes de contrato
mvn verify -Dgroups=contract

# Todos os testes
mvn verify
```

### Frontend

```bash
cd frontend
npm test          # Jest unit tests
npm run test:e2e  # Playwright E2E (requer serviços up)
```

---

## 7. Observabilidade

Os spans de telemetria são coletados pelo OTEL Collector em `localhost:4317` (gRPC) e
`localhost:4318` (HTTP).

Para visualizar traces, configure um backend de exportação no
`otel-collector-config.yaml`. Exemplo com logging (local):
```yaml
exporters:
  logging:
    loglevel: debug
service:
  pipelines:
    traces:
      exporters: [logging]
```

Para integrar com Jaeger, Zipkin ou Grafana Tempo, consulte a documentação oficial do
OpenTelemetry Collector Contrib.

---

## 8. Validação do Ambiente

Checklist rápido para confirmar que tudo está funcionando:

- [ ] `docker compose ps` mostra todos os 3 serviços como `running`
- [ ] http://localhost:3000 abre a interface de chat
- [ ] `POST /v1/conversations` retorna 201 com `id` e `_links`
- [ ] Enviar prompt retorna resposta da IA com status 201
- [ ] Swagger UI em http://localhost:8080/swagger-ui.html está acessível
- [ ] Logs do `api` container mostram JSON estruturado com `traceId`

---

## 9. Problemas Comuns

**`AI_BACKEND_URL` não configurado ou inacessível:**
- O endpoint `/v1/conversations/{id}/prompts` retorna `503`
- Verificar se o serviço de IA está acessível no endereço configurado
- Para desenvolvimento local sem IA real: configurar o perfil `mock` via
  `SPRING_PROFILES_ACTIVE=mock` (usa `EchoAiGatewayAdapter`)

**Container `api` reiniciando por OOM:**
- Aumentar o `memory` limit no `docker-compose.yml` para 896m
- Verificar logs: `docker compose logs api | grep -i "out of memory"`

**Frontend não conecta no backend:**
- Verificar se `NEXT_PUBLIC_API_URL` está correto no `.env`
- Verificar se os containers estão na mesma network Docker (padrão: `prompt-ui-network`)
