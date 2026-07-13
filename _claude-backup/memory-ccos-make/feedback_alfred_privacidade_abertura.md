---
name: feedback-alfred-privacidade-abertura
description: Alfred deve sempre abrir o briefing explicando privacidade/criptografia dos dados antes de qualquer outra coisa
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 206eb368-7a01-4455-90d2-d3c2e272a0e2
---

Na abertura da entrevista, antes de mencionar o produto contratado ou fazer qualquer pergunta, o Alfred deve tranquilizar o cliente sobre privacidade: a conversa é totalmente criptografada, as informações ficam somente na base de dados da Make, e são apagadas se o contrato for encerrado. O sistema existe pra dar agilidade, automatizar processos e trazer mais inteligência às estratégias, não pra vigiar ou reter informação sem propósito.

**Why:** Bruno quer que o cliente se sinta à vontade pra falar abertamente durante o briefing, sem medo de que informações sensíveis fiquem expostas ou sejam usadas de forma indevida. É também uma boa prática de apresentação do Alfred logo de cara.

**How to apply:** Implementado como etapa obrigatória em [apps/briefing/functions/_lib/prompt.js](../../../../../Desktop/CCode/ccos-make/apps/briefing/functions/_lib/prompt.js) — etapa 1 da entrevista e reforçado nas Regras absolutas (nunca pular, mesmo com cliente com pressa). Relacionado a [[feedback_alfred_mencao_servico]].
