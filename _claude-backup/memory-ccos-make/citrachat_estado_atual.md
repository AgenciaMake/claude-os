---
name: citrachat-estado-atual-e-pr-ximos-passos
description: "Ponteiro pro snapshot vivo do CitraChat, que agora vive no workspace (não aqui). Ler no início de qualquer sessão sobre CitraChat."
metadata:
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-18T11:02:30.326Z
---

**O conteúdo completo mora em `produtos/citrachat/ESTADO_ATUAL.md`, dentro do workspace** —
Bruno pediu explicitamente (2026-09-18) que esse registro ficasse visível como arquivo normal na
pasta do produto, versionado no repo, não só na memória interna do Claude. Ler esse arquivo primeiro
em qualquer sessão sobre CitraChat.

Este arquivo de memória continua existindo como ponteiro (pra sessões que carregam memória mas não
começam lendo arquivos do workspace automaticamente), e como lembrete da regra: ver
[[feedback_citrachat_memoria_continua]] — que agora também cobre manter os dois em sincronia.

**How to apply:**
1. Ler `produtos/citrachat/ESTADO_ATUAL.md` inteiro.
2. Conferir `_memoria_pendente/` na raiz do workspace.
3. `cd produtos/citrachat/codigo && git log --oneline -10` — branch ativa é `plataforma`.
4. Ao terminar trabalho relevante, atualizar `produtos/citrachat/ESTADO_ATUAL.md` (não este arquivo).
