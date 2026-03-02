# Research - Ajustes Visuais da Barra Lateral

## Decision 1: Acionador "Buscar em chats" como elemento textual acessivel
- Decision: usar um elemento interativo textual (estilo neutro) sem aparência de botão destacado, preservando foco por teclado e ativação por Enter/Espaço.
- Rationale: atende ao requisito visual sem perder acessibilidade nem comportamento de clique.
- Alternatives considered:
  - Manter componente Button com variante ghost/link: rejeitado por ainda comunicar visual de botão.
  - Usar texto sem semântica interativa: rejeitado por quebrar acessibilidade.

## Decision 2: Reposicionamento abaixo do controle de recolher
- Decision: posicionar "Buscar em chats" abaixo do botão de recolher/expandir, com espaçamento vertical consistente no header da sidebar.
- Rationale: cumpre a regra de hierarquia visual solicitada e reduz competição com o controle de layout.
- Alternatives considered:
  - Manter na mesma linha do controle de recolher: rejeitado por não atender ao posicionamento solicitado.
  - Mover para dentro da lista de histórico: rejeitado por reduzir descoberta da ação global.

## Decision 3: Renomear seção para "Seus chats"
- Decision: substituir o rótulo "Histórico" por "Seus chats" em todos os estados expandidos da sidebar.
- Rationale: alinha nomenclatura ao pedido de UX e torna o bloco mais pessoal/objetivo.
- Alternatives considered:
  - Exibir ambos os rótulos: rejeitado por ruído visual.
  - Renomear apenas em alguns estados: rejeitado por inconsistência.

## Decision 4: Accordion para ocultar/exibir histórico
- Decision: encapsular a lista da seção "Seus chats" em comportamento de accordion com estado expandido por padrão.
- Rationale: permite controle de densidade visual sem remover funcionalidades existentes por item.
- Alternatives considered:
  - Toggle custom sem semântica de accordion: rejeitado por menor clareza e maior custo de manutenção.
  - Sempre expandido: rejeitado por não atender requisito de ocultação.

## Decision 5: Preservar comportamentos atuais dos itens
- Decision: manter seleção de conversa e menu de ações inalterados quando accordion estiver expandido.
- Rationale: minimiza risco de regressão funcional e mantém curva de uso.
- Alternatives considered:
  - Reformular ações por item junto da mudança visual: rejeitado por ampliar escopo sem necessidade.

## Result
Nenhum ponto ficou como NEEDS CLARIFICATION; todas as decisões foram fechadas com base na especificação e no padrão da feature anterior.
