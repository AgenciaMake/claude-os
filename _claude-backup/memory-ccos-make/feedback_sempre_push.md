---
name: feedback-sempre-push
description: "Após qualquer commit no CitraChat (ou qualquer projeto do workspace), fazer push imediatamente sem precisar perguntar"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
---

Sempre fazer `git push` imediatamente após cada commit, sem esperar aprovação.

**Why:** Bruno descobriu que mudanças não apareciam em produção porque os commits ficavam apenas locais — o Cloudflare Pages só faz rebuild quando o push chega ao GitHub.

**How to apply:** Commit → push na mesma sequência, sempre. Vale para o repositório do CitraChat (`plataforma`) e qualquer outro repo no workspace.
