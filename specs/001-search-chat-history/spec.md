# Feature Specification: Busca em Historico de Chats

**Feature Branch**: `001-search-chat-history`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "No menu lateral (o mesmo menu onde esta a opcao de acoes de um historico) crie um botao para fazer busca de informacoes nos historicos de chats. O botao deve ter o nome Buscar em chats. Ao clicar no botao de busca um dialog deve ser aberto com um campo para inputar o texto de pesquisa com o texto Buscar em chats... como texto de fundo. Abaixo do campo de pesquisa deve haver uma barra horizontal para dividir a area de pesquisa da area de resultados. A area de resultados deve exibir inicialmente todos os historicos de chats dos ultimos 7 dias. Caso alguma coisa seja digitada no campo de pesquisa os resultados filtrados devem ser exibidos com o trecho onde o termo apareceu e a data da mensagem. Ao clicar sobre um resultado de pesquisa o historico relacionado deve ser carregado como chat atual."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Abrir busca no menu lateral (Priority: P1)

Como usuario que conversa em varios chats, quero abrir rapidamente uma busca no menu lateral para localizar conversas anteriores sem sair da tela atual.

**Why this priority**: Sem acesso a busca, o usuario nao consegue recuperar contexto de conversas antigas com eficiencia.

**Independent Test**: Pode ser testado abrindo o menu lateral e validando que o botao "Buscar em chats" aparece como acao global no topo (acima do label "Historico"), fora do menu de acoes de cada item, e abre o dialog de busca com os elementos esperados.

**Acceptance Scenarios**:

1. **Given** que o usuario esta na tela principal de chat, **When** ele abre o menu lateral, **Then** o botao "Buscar em chats" deve estar visivel como botao global no topo do menu lateral, acima do label "Historico".
2. **Given** que o usuario clica no botao "Buscar em chats", **When** o dialog abre, **Then** deve existir um campo de texto com placeholder "Buscar em chats...".
3. **Given** que o campo de texto esta vazio, **When** o usuario digita qualquer caractere, **Then** o placeholder deve desaparecer e o texto digitado deve ficar visivel.
4. **Given** que o dialog esta aberto, **When** a area de pesquisa e a area de resultados sao exibidas, **Then** deve existir uma divisao horizontal entre elas.

---

### User Story 2 - Ver resultados padrao dos ultimos 7 dias (Priority: P1)

Como usuario, quero ver resultados iniciais recentes sem precisar digitar, para retomar conversas recentes com menos passos.

**Why this priority**: O estado inicial sem consulta digitada define o comportamento principal de descoberta de conversas recentes.

**Independent Test**: Pode ser testado abrindo o dialog sem digitar texto e validando que apenas itens com mensagens dos ultimos 7 dias aparecem.

**Acceptance Scenarios**:

1. **Given** que o usuario abriu o dialog e nao digitou termo de busca, **When** a lista de resultados e carregada, **Then** devem ser exibidos historicos com mensagens dos ultimos 7 dias.
2. **Given** que nao existem historicos nos ultimos 7 dias, **When** o dialog abre, **Then** uma mensagem de estado vazio deve informar que nao ha resultados recentes.

---

### User Story 3 - Buscar termo e continuar no chat encontrado (Priority: P2)

Como usuario, quero pesquisar um termo e abrir o chat correspondente direto do resultado, para continuar a conversa do ponto certo.

**Why this priority**: Essa etapa converte a busca em acao util, ligando resultado encontrado a continuidade da interacao.

**Independent Test**: Pode ser testado digitando um termo existente, verificando trecho + data no resultado e clicando em um item para carregar o chat associado como atual.

**Acceptance Scenarios**:

1. **Given** que o usuario digitou um termo de busca, **When** existem correspondencias, **Then** a lista deve exibir resultados filtrados pelo termo.
2. **Given** que ha resultados para o termo, **When** um resultado e exibido, **Then** ele deve mostrar um trecho onde o termo aparece e a data da mensagem correspondente.
3. **Given** que o usuario clica em um resultado, **When** a selecao e confirmada, **Then** o historico relacionado deve ser carregado como chat atual para continuidade da conversa.
4. **Given** que o termo nao possui correspondencias, **When** a busca e executada, **Then** uma mensagem de nenhum resultado deve ser exibida sem remover o termo digitado.

### Edge Cases

- Historicos com mensagens enviadas e recebidas no mesmo dia devem mostrar data consistente para ambos os tipos.
- Termos com diferenca de maiusculas/minusculas devem retornar o mesmo conjunto de resultados.
- Entrada apenas com espacos deve ser tratada como busca vazia e manter o comportamento de resultados dos ultimos 7 dias.
- Historico removido entre a exibicao do resultado e o clique do usuario deve apresentar mensagem de indisponibilidade e manter o dialog aberto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema deve exibir, no menu lateral de historico, um botao global com o rotulo "Buscar em chats", posicionado no topo do menu lateral acima do label "Historico".
- **FR-001a**: O botao "Buscar em chats" nao deve ser exibido dentro do menu de acoes de uma iteracao/historico especifico.
- **FR-002**: Ao acionar "Buscar em chats", o sistema deve abrir um dialog de busca sem navegar para outra pagina.
- **FR-003**: O dialog deve conter um campo de pesquisa com placeholder "Buscar em chats..." quando vazio.
- **FR-004**: O texto de placeholder deve deixar de ser exibido assim que houver caractere digitado pelo usuario.
- **FR-005**: O dialog deve conter um separador horizontal entre a area de entrada de pesquisa e a area de resultados.
- **FR-006**: Sem termo digitado, o sistema deve listar historicos com mensagens datadas nos ultimos 7 dias corridos.
- **FR-007**: Com termo digitado, o sistema deve substituir a lista padrao por resultados filtrados que contenham o termo.
- **FR-008**: Cada resultado deve apresentar, no minimo, um trecho contextual de ate 80 caracteres, centralizado no termo encontrado quando possivel, com "..." no inicio/fim quando houver truncamento, e a data da mensagem.
- **FR-009**: O resultado deve indicar se o trecho corresponde a mensagem enviada pelo usuario ou recebida como resposta; quando a origem nao estiver disponivel no historico, deve exibir origem neutra "Mensagem".
- **FR-010**: Ao selecionar um resultado, o sistema deve carregar o historico relacionado como chat atual e permitir continuidade da interacao.
- **FR-011**: Se nao houver resultados para a busca atual, o sistema deve exibir um estado vazio claro mantendo o termo informado no campo.
- **FR-012**: Se nao houver historicos elegiveis para o estado inicial dos ultimos 7 dias, o sistema deve exibir estado vazio especifico para resultados recentes.

### Non-Functional Requirements

- **NFR-001**: O dialog de busca deve ser exibido em ate 200ms no percentil 95, considerando ate 20 historicos locais.
- **NFR-002**: A atualizacao da lista de resultados (modo recentes e modo busca) deve ocorrer em ate 300ms no percentil 95, considerando ate 20 historicos locais.
- **NFR-003**: Durante a digitacao no campo de busca, o tempo entre evento de tecla e atualizacao visual do valor no input deve ser <= 100ms no percentil 95, para ate 20 historicos locais.

### Key Entities *(include if feature involves data)*

- **Historico de Chat**: Conjunto de mensagens associadas a uma conversa, com identificador unico, titulo opcional e data da ultima atividade.
- **Mensagem de Chat**: Registro de texto de uma interacao, com conteudo, data/hora e origem (usuario ou resposta recebida).
- **Resultado de Busca**: Item exibido no dialog contendo referencia ao historico, trecho contextual da mensagem, data e origem da mensagem correspondente.

## Assumptions

- O periodo de "ultimos 7 dias" considera dias corridos a partir da data/hora atual do cliente.
- A data exibida no resultado segue o formato de data ja adotado pela aplicacao para historicos.
- A busca considera apenas mensagens com conteudo textual.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em teste de usabilidade, pelo menos 95% dos usuarios conseguem abrir o dialog de busca a partir do menu lateral em ate 10 segundos.
- **SC-002**: Em dados com historico recente disponivel, 100% das aberturas do dialog sem termo digitado exibem pelo menos os historicos elegiveis dos ultimos 7 dias.
- **SC-003**: Pelo menos 90% das buscas com termo existente retornam resultados com trecho e data corretos na primeira tentativa.
- **SC-004**: Pelo menos 95% dos cliques em resultados validos carregam o historico correto como chat atual sem necessidade de segunda acao.
