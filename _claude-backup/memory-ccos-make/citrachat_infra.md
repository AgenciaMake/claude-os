---
name: citrachat-infra
description: "Infraestrutura do CitraChat — onde está hospedado, contas e serviços"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
---

CitraChat (Next.js) está hospedado no **Vercel**, não Cloudflare.
- Conta Vercel: **bruno@makelemonad.com.br**
- Banco de dados: **Supabase**
- Repositório: **AgenciaMake/citrachat**, branch `plataforma`

Cloudflare é usado apenas para os apps simples em `apps/` (ex: app de briefing), não para produtos SaaS da linha Citra.

**How to apply:** ao falar de deploy, logs ou infra do CitraChat, sempre referenciar Vercel. Logs de função ficam em: Vercel dashboard → projeto citrachat → aba Logs → filtrar Functions.
</content>
</invoke>