# UI Contract - Sidebar Visual Adjustments

## Escopo
Contrato de comportamento visual e interativo da barra lateral para:
- acionador "Buscar em chats" no topo;
- renomeação da seção para "Seus chats";
- comportamento de accordion para ocultar/exibir histórico.

## 1. Search Trigger Contract

### Regras
- O acionador deve exibir texto exato: `Buscar em chats`.
- O acionador deve estar posicionado abaixo do controle de recolher/expandir da sidebar.
- O acionador deve ter estilo visual neutro (sem aparência de botão destacado).
- O acionador deve abrir o mesmo dialog de busca já existente.

### Critérios de aceitação
1. Trigger visível no topo quando sidebar expandida.
2. Trigger não exibido no menu de ações por item.
3. Trigger acionável por mouse e teclado.

## 2. Chats Section Contract

### Regras
- O título da seção deve ser `Seus chats`.
- A seção deve operar como accordion com estado expandido/recolhido.
- Quando recolhida, a lista de histórico não deve ficar visível.
- Quando expandida, lista e interações por item devem funcionar normalmente.

### Critérios de aceitação
1. Título atualizado em 100% das renderizações da seção.
2. Toggling expandir/recolher funcional.
3. Ações por item continuam acessíveis no estado expandido.

## 3. Non-regression Contract

### Regras
- Abertura do dialog de busca não muda comportamento funcional.
- Seleção de conversa e menu de ações por item não podem regredir.
- Estado vazio da lista continua disponível na seção expandida.

### Critérios de aceitação
1. Fluxo de abrir busca continua operacional.
2. Fluxo de abrir conversa por item continua operacional.
3. Fluxo de estado vazio continua operacional.
