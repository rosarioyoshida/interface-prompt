# Quickstart - Ajustes Visuais da Barra Lateral

## Pré-requisitos
- Aplicação frontend executando localmente.
- Histórico com ao menos uma conversa para validar interações.

## Cenário 1 - Acionador "Buscar em chats"
1. Abrir a tela de chat com sidebar expandida.
2. Confirmar que o acionador `Buscar em chats` aparece abaixo do controle de recolher.
3. Confirmar que o acionador possui aparência textual/neutra.
4. Clicar no acionador e validar abertura do dialog de busca.

## Cenário 2 - Seção "Seus chats" como accordion
1. Na sidebar expandida, validar rótulo `Seus chats`.
2. Acionar recolhimento da seção.
3. Confirmar que a lista de histórico foi ocultada.
4. Acionar expansão da seção.
5. Confirmar que a lista voltou a aparecer.

## Cenário 3 - Regressão de interações por item
1. Com a seção expandida, clicar em um item de histórico.
2. Confirmar carregamento da conversa selecionada.
3. Abrir menu de ações de um item.
4. Confirmar que ações existentes permanecem disponíveis.

## Cenário 4 - Estado vazio
1. Usar ambiente sem entradas de histórico.
2. Expandir seção `Seus chats`.
3. Confirmar que o estado vazio aparece corretamente.
