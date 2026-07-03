---
name: Citra — decisões de arquitetura SaaS
description: Decisões técnicas consolidadas pra arquitetura SaaS multi-tenant da linha Citra (CitraDesk + CitraChat)
type: project
originSessionId: af7fa1f9-0339-4470-81fe-029080b21e11
---
Decisões de arquitetura tomadas com Bruno em 2026-04-27 pra a refatoração do CitraDesk pra SaaS modular:

**Stack unificada:** Firebase (Auth + Firestore + Storage + Functions) pra os dois produtos. Doc original do CitraChat sugeria Supabase, mas pra integração modular e billing único ficamos no Firebase. RAG do CitraChat usa Firestore Vector Search nativo.

**Multi-tenancy via path:** `citradesk.com/{slug}` e `citrachat.com/{slug}`. Não usa subdomínio no MVP.

**Modelo de dados multi-tenant:**
```
tenants/{tenantId}/
├── _meta: { type: 'agency'|'workspace', name, slug, plan, trialEnd }
├── modules: { gestao, financeiro, tarefas, crm, chat — cada um com active/plan }
└── (collections de cada módulo)
users/{uid}: { tenantId, role, permissions: { 20 flags granulares } }
```

**Tenant tipo `agency`** — entra pelo CitraDesk, ativa qualquer módulo.
**Tenant tipo `workspace`** — entra pelo CitraChat, só tem módulo Chat.

**Trial 14 dias** com Suite completa liberada. **Free Forever** liberado manualmente pelo super-admin pra clientes específicos.

**Billing:** Stripe (USD/EUR) + Asaas (BRL/Pix/boleto). Cobrança flat por módulo, não por seat.

**Banco Firestore:** `bdmakegestorpro` em `nam5` (US). Decisão em 2026-04-27: NÃO migrar pra SP agora — Bruno opera de PT (latência ficaria pior pra ele) e CitraChat global usará banco próprio em região central. Latência atual aceitável.

**Firebase project ID:** `gen-lang-client-0548502624` (display name: "CitraDesk"). ID interno fixo, não muda.

**Repo GitHub:** `AgenciaMake/citradesk` (renomeado de `make-gestorpro`).

**Domínios comprados** (todos ativos):
- citradesk.com / .com.br / .io
- citrachat.com / .com.br / citra.chat

**Make é a primeira agência cliente** — dados atuais migrarão pra `tenants/makelemonad/...` na Fase 1.

**Why:** essas decisões consolidam o modelo SaaS e evitam refatoração futura. Stack unificada simplifica auth/billing. Path-URL é mais simples que subdomain no MVP. Banco em US é trade-off aceitável até CitraChat exigir banco próprio.

**How to apply:** quando começar a Fase 1 (multi-tenancy), consultar [briefings/02_arquitetura_saas.md](produtos/citradesk/briefings/02_arquitetura_saas.md) pra desenho técnico completo. Mudanças nessas decisões devem ser registradas em briefings novos antes de implementar.
