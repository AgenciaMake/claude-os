---
name: feedback-deep-research-custo
description: Deep-research consome tokens demais — evitar salvo quando Bruno pedir explicitamente
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 25cf8ef3-054c-4e56-973b-6256a3f75469
---

**SEMPRE perguntar antes de usar deep-research** — nunca acionar por iniciativa própria, mesmo que a pergunta do Bruno pareça pedir uma pesquisa aprofundada. O comando consumiu 37% dos tokens disponíveis numa sessão só.

Pergunta padrão: "Posso usar deep-research? Vai consumir bastante tokens (fan-out de múltiplos agentes)."

**Why:** Alto custo de tokens por fan-out de múltiplos agentes paralelos — não é o modelo (roda em Sonnet), é a quantidade de agentes. Bruno quer controle explícito sobre quando isso é acionado.

**How to apply:** Para pesquisas de dados/estatísticas, usar WebSearch direto (1-2 buscas) ou responder com o que já se sabe + indicar fontes pra Bruno verificar. Nunca spawnar múltiplos agentes de pesquisa sem permissão explícita.
