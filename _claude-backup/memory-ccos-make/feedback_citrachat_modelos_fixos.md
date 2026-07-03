---
name: feedback-citrachat-modelos-fixos
description: Modelos de IA do CitraChat são fixos — não atualizar automaticamente para versões mais novas sem aprovação explícita de Bruno
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
---

Não atualizar os modelos do CitraChat sem aprovação explícita de Bruno, mesmo que versões mais novas sejam lançadas.

**Modelos atuais fixados (confirmados no código em 2026-07-01):**
- Chat público (`DEFAULT_MODEL`): `claude-haiku-4-5-20251001`
- Análise/extração/roteamento (`ANALYSIS_MODEL`): `claude-sonnet-4-6`
- Definidos em: `src/lib/anthropic.ts`

**Why:** Bruno quer controle explícito sobre upgrades de modelo. Com o lançamento do Sonnet 5.0 (e futuros), a preferência é manter os modelos atuais até Bruno decidir migrar — upgrades de modelo podem mudar comportamento dos agentes em produção e impactar clientes.

**How to apply:** ao trabalhar no CitraChat, nunca trocar os model IDs em `src/lib/anthropic.ts` ou em qualquer chamada Anthropic sem Bruno pedir explicitamente. Se uma nova versão for sugerida, perguntar antes de aplicar.
