---
name: feedback-citrachat-memoria-continua
description: "Regra permanente: atualizar citrachat_estado_atual.md a cada trabalho relevante no CitraChat, nunca deixar ficar velho"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-18T10:54:26.406Z
---

Ao final de qualquer sessão (ou bloco de trabalho relevante dentro de uma sessão longa) que toque o
CitraChat — bug corrigido, feature nova, decisão de produto, migration aplicada, investigação que mudou
o entendimento de como algo funciona — atualizar [[citrachat_estado_atual]] antes de considerar o
trabalho encerrado. Não esperar o usuário pedir de novo.

**Why:** Bruno pediu isso explicitamente em 2026-09-18, depois de uma sessão gigante (correção de
duplicidade de protocolo, banimento de travessão por código, migração de região Vercel, cache de
auth/perfil, reescrita do painel de métricas com múltiplos bugs de atribuição de data corrigidos,
pesquisa de provedor RCS/SMS) inteira sem que nada disso fosse registrado em memória. O arquivo
`citrachat_estado_atual.md` já existia com a descrição "atualizado diariamente, ler primeiro em
qualquer sessão" — mas ficou 2 meses parado (13/07 → 18/09) enquanto sessões inteiras de trabalho real
aconteciam. O mecanismo existia, só não estava sendo seguido. Perder esse contexto entre sessões
significa redescobrir os mesmos bugs, refazer o mesmo diagnóstico, ou pior, desfazer uma correção sem
saber por que ela existe.

**How to apply:**
- Atualizar o arquivo existente (`citrachat_estado_atual.md`), nunca criar um arquivo de memória novo e
  paralelo para "o que está acontecendo agora" — isso fragmenta o contexto em vez de centralizá-lo.
- Decisões de produto importantes (preço, modelo de cobrança, arquitetura) que geram um documento
  próprio (ex: `produtos/citrachat/briefings/`) não precisam ser duplicadas por extenso na memória — só
  linkar de lá pra cá com um resumo de 1-2 frases e o que está pendente.
- Bug real encontrado e corrigido: registrar a causa raiz em 1-2 frases, não só "corrigido X". A causa é
  o que evita repetir o erro ou desfazer a correção por engano depois.
- Feature adiada por decisão explícita do Bruno (ex: "só documentar, não implementar"; "vou fazer
  manualmente") precisa ficar clara como decisão dele, não como algo esquecido — outra sessão não deve
  achar que é trabalho pendente do Claude.
- Isso não substitui memórias mais específicas e duráveis (roadmap, infra, segurança, precificação) —
  aquelas continuam existindo separadamente; `citrachat_estado_atual.md` é o índice vivo que aponta pra
  elas e registra o que mudou recentemente.
