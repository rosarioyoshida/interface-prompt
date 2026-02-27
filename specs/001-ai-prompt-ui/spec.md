# Feature Specification: Interface de Entrada de Prompts para IA

**Feature Branch**: `001-ai-prompt-ui`
**Created**: 2026-02-26
**Status**: Draft
**Input**: crie uma interface com o usuário para input de prompts para uma IA. Mantenha a feature de segurança como última etapa de evolução.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Envio de Prompt e Recebimento de Resposta (Priority: P1)

O usuário acessa a interface, digita um texto livre (prompt) em um campo dedicado e o submete.
O sistema envia o prompt para a IA e exibe a resposta na área de conversa. O campo de texto
é limpo e fica pronto para um novo prompt.

**Why this priority**: É o núcleo da funcionalidade. Sem enviar um prompt e receber uma resposta
não há produto viável. Todas as demais histórias dependem desta.

**Independent Test**: Pode ser completamente testado abrindo a interface, digitando qualquer
texto, submetendo e verificando que uma resposta é exibida — entregando valor imediato ao usuário.

**Acceptance Scenarios**:

1. **Given** campo de prompt vazio, **When** usuário tenta submeter, **Then** o sistema exibe
   mensagem de validação e não envia nenhuma requisição à IA.
2. **Given** prompt digitado, **When** usuário submete (botão Enviar ou atalho de teclado),
   **Then** o prompt aparece na área de conversa, um indicador de carregamento é exibido,
   e a resposta da IA é exibida ao concluir.
3. **Given** prompt submetido com sucesso, **When** resposta chega, **Then** o campo de texto
   é limpo automaticamente e fica habilitado para novo input.
4. **Given** prompt em processamento, **When** a IA retorna erro, **Then** uma mensagem amigável
   é exibida e o usuário pode tentar novamente.

---

### User Story 2 - Histórico de Conversa na Sessão (Priority: P2)

O usuário pode visualizar todos os prompts enviados e respostas recebidas durante a sessão ativa
em uma área de conversa rolável, com diferenciação visual clara entre mensagens do usuário e
respostas da IA.

**Why this priority**: Permite acompanhar o contexto sem precisar memorizar ou reescrever prompts
anteriores, tornando a interface útil para interações complexas e encadeadas.

**Independent Test**: Pode ser testado enviando três ou mais prompts e verificando que todos os
pares aparecem em ordem cronológica, com remetente identificado, e que a área rola para a mensagem
mais recente.

**Acceptance Scenarios**:

1. **Given** múltiplos prompts enviados, **When** usuário visualiza a área de conversa,
   **Then** vê todos os pares prompt-resposta em ordem cronológica com identificação visual do
   remetente (usuário vs. IA).
2. **Given** área de conversa com mensagens, **When** nova resposta chega, **Then** a visualização
   rola automaticamente para a mensagem mais recente.
3. **Given** histórico com muitas mensagens, **When** o usuário rola manualmente para cima,
   **Then** o scroll automático para a última mensagem é desativado até o usuário rolar de volta ao fim.

---

### User Story 3 - Gerenciamento de Conversa (Priority: P3)

O usuário pode iniciar uma nova conversa a qualquer momento, limpando o histórico da sessão atual,
para recomeçar sem contexto acumulado.

**Why this priority**: Essencial para trocar de assunto ou recomeçar uma investigação sem ruído das
mensagens anteriores.

**Independent Test**: Pode ser testado acumulando mensagens e acionando "Nova Conversa" — verificando
que o histórico é apagado e a interface está pronta para uso.

**Acceptance Scenarios**:

1. **Given** conversa com histórico de mensagens, **When** usuário aciona "Nova Conversa",
   **Then** o sistema exibe confirmação; ao confirmar, o histórico é apagado e a interface é
   reiniciada.
2. **Given** interface sem mensagens, **When** usuário aciona "Nova Conversa",
   **Then** a interface permanece pronta sem exibir confirmação desnecessária.
3. **Given** prompt em processamento, **When** usuário tenta iniciar nova conversa,
   **Then** a opção fica desabilitada até a resposta ser concluída ou o envio ser cancelado.

---

### User Story 4 - Segurança e Controle de Acesso (Priority: P4 — última etapa de evolução)

O sistema protege o acesso à interface e ao uso da IA contra acesso não autorizado e abusos,
garantindo que apenas usuários identificados possam interagir com a ferramenta dentro dos limites
definidos.

**Why this priority**: Definida explicitamente como última etapa de evolução. Depende das histórias
anteriores estarem estáveis e funcionais.

**Independent Test**: Pode ser testado verificando que o acesso direto à URL sem autenticação é
bloqueado e que exceder o limite de uso retorna mensagem clara ao usuário.

**Acceptance Scenarios**:

1. **Given** usuário não autenticado, **When** tenta acessar a interface,
   **Then** é redirecionado para o fluxo de autenticação.
2. **Given** usuário autenticado que excedeu o limite de uso,
   **When** tenta enviar um prompt,
   **Then** recebe mensagem clara informando o limite atingido e quando poderá usar novamente.
3. **Given** prompt com conteúdo potencialmente malicioso,
   **When** é processado pelo sistema,
   **Then** é sanitizado antes de chegar à IA, sem afetar a experiência do usuário legítimo.

---

### Edge Cases

- O que acontece quando a IA demora mais do que o esperado para responder (timeout)?
- Como o sistema se comporta quando a conexão é interrompida durante o processamento?
- O que acontece quando o prompt excede o tamanho máximo permitido?
- Como o sistema reage quando a IA retorna uma resposta em branco ou malformada?
- O que acontece quando o usuário tenta enviar um segundo prompt antes da resposta anterior chegar?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE disponibilizar um campo de texto para o usuário digitar prompts.
- **FR-002**: O sistema DEVE oferecer um mecanismo de submissão (botão e atalho de teclado).
- **FR-003**: O sistema DEVE validar que o prompt não está vazio antes de enviar.
- **FR-004**: O sistema DEVE validar que o prompt não excede o limite máximo de caracteres
  e informar o usuário sobre o limite restante.
- **FR-005**: O sistema DEVE exibir indicador de carregamento enquanto aguarda resposta da IA.
- **FR-006**: O sistema DEVE exibir a resposta da IA na área de conversa ao receber o resultado.
- **FR-007**: O sistema DEVE limpar o campo de prompt após envio bem-sucedido.
- **FR-008**: O sistema DEVE manter o histórico de mensagens da sessão visível e rolável.
- **FR-009**: O sistema DEVE diferenciar visualmente mensagens do usuário e respostas da IA.
- **FR-010**: O sistema DEVE rolar automaticamente para a mensagem mais recente após nova resposta.
- **FR-011**: O sistema DEVE exibir mensagem de erro amigável e acionável quando a IA falhar.
- **FR-012**: O sistema DEVE permitir que o usuário cancele um envio em progresso.
- **FR-013**: O sistema DEVE oferecer ação para iniciar nova conversa, limpando o histórico
  da sessão atual.
- **FR-014**: O sistema DEVE desabilitar o envio de prompts enquanto uma resposta está em progresso.
- **FR-015** *(P4)*: O sistema DEVE exigir autenticação para acessar a interface.
- **FR-016** *(P4)*: O sistema DEVE aplicar limite de uso de prompts por período definido.
- **FR-017** *(P4)*: O sistema DEVE sanitizar o conteúdo dos prompts antes de processar.

### Key Entities

- **Conversa**: representa a sequência de interações da sessão ativa; contém lista ordenada de
  mensagens; pode ser reiniciada pelo usuário.
- **Mensagem**: representa uma unidade de comunicação; possui conteúdo textual, remetente
  (usuário ou IA), timestamp e estado (enviando, entregue, erro).
- **Prompt**: o texto formulado pelo usuário destinado à IA; possui conteúdo, tamanho e estado
  de envio.
- **Resposta**: o texto retornado pela IA em associação a um prompt; pode ser parcial (streaming)
  ou completa.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O usuário consegue enviar seu primeiro prompt e visualizar a resposta da IA
  sem necessidade de instrução ou suporte externo em 95% dos casos.
- **SC-002**: A interface exibe indicador de progresso dentro de 1 segundo após o envio do prompt,
  mantendo o usuário informado em 100% das requisições.
- **SC-003**: Mensagens de erro são compreendidas e o usuário sabe qual ação tomar em 90%
  dos cenários de falha (medido por teste de usabilidade).
- **SC-004**: O histórico de conversa suporta ao menos 100 pares de prompt-resposta sem
  degradação perceptível de responsividade.
- **SC-005**: O usuário consegue iniciar uma nova conversa em no máximo 2 cliques/ações.
- **SC-006** *(P4)*: 100% das tentativas de acesso sem autenticação são bloqueadas antes de
  qualquer interação com o backend de IA.

## Assumptions

- A interface se comunica com um serviço de IA já existente acessível via endpoint de backend.
- Não há requisito de persistência de histórico entre sessões nas etapas P1–P3; o histórico
  é mantido apenas durante a sessão ativa.
- A interface é acessada via navegador web, com suporte a dispositivos desktop e mobile
  (layout responsivo).
- As funcionalidades de segurança (FR-015 a FR-017) são deliberadamente postergadas para P4
  conforme especificado pelo solicitante.
- O tamanho máximo de prompt será definido em conjunto com o time técnico na fase de planejamento.

## Out of Scope

- Seleção de modelo de IA pelo usuário.
- Configuração de parâmetros da IA (temperatura, número de tokens, etc.) pela interface.
- Exportação, compartilhamento ou publicação de conversas.
- Histórico persistido entre sessões (escopo de evolução futura além de P4).
- Funcionalidades administrativas (gestão de usuários, quotas globais).
