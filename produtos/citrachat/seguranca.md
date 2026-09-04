# CitraChat — Segurança e Protocolos

> Última auditoria: 2026-09-04 (Fable 5.1)
> Última atualização de status: 2026-09-04
> Commit de correções: `b627c67`

---

## Status geral

| Severidade | Total | Corrigido | Pendente |
|---|---|---|---|
| 🔴 Crítico | 1 | 1 | 0 |
| 🟠 Alto | 5 | 5 | 0 |
| 🟡 Médio | 5 | 4 | 1 |
| ⚪ Baixo | 1 | 1 | 0 |
| 🔍 Requer Dashboard | 1 | — | 1 |

---

## Arquitetura de segurança atual

### Autenticação

- **Painel admin (clientes):** Supabase Auth — email + senha. Validação server-side com `auth.getUser()` (nunca `getSession()`). Dupla barreira: middleware (`src/proxy.ts`) + verificação no layout server-side.
- **Painel super-admin (Make):** Sistema próprio independente do Supabase. Senha PBKDF2-SHA256 (100k iterações). Token HMAC-SHA256, 7 dias. Cookie `httpOnly, secure, sameSite: strict`. Login com `timingSafeEqual` (anti timing attack). **Desde `b627c67`:** todas as server actions verificam o token internamente além do middleware.

### RLS no Supabase

Tabelas protegidas por RLS (confirmado via migrations): `agents`, `agent_integrations`, `agent_knowledge_files`, `profiles`, `promo_codes`, `lead_conversations`, `super_admins`, `agent_events`, `agent_connections`, `user_whatsapp`, `pending_notifications`, `training_logs`.

⚠️ **Tabelas sem RLS confirmada — verificar no Supabase Dashboard:**
- `conversations` — histórico completo de chat e dados de leads
- `protocols` — números de protocolo de atendimento
- `agent_knowledge_datasets` — metadados de bases de conhecimento
- `agent_knowledge_rows` — linhas das planilhas carregadas

Criadas fora do sistema de migrations. Se RLS estiver desabilitado, usuários autenticados podem ler dados de outros clientes.

### Proteção de API Routes

| Rota | Proteção |
|---|---|
| `/api/chat` | Rate limit 30 req/60s por IP + validação UUID do agentId |
| `/api/agents/[id]/datasets` | Auth + ownership check |
| `/api/conversations/[id]` | Auth + ownership check |
| `/api/admin/conversations-poll` | Auth + filtro de agentIds por user_id ✅ |
| `/api/admin/extract-file` | Auth + ownership via `agents!inner(user_id)` ✅ |
| `/api/upload` | Auth obrigatória ✅ |
| `/api/notify-lead` | `CRON_SECRET` via `x-internal-secret` ✅ |
| `/api/schedule-notify` | `CRON_SECRET` via `x-internal-secret` ✅ |
| `/api/cron/notify-leads` | Bearer `CRON_SECRET` |
| `/api/stripe/checkout` | Auth obrigatória + usa `user.email` ✅ |
| `/api/webhooks/stripe` | Assinatura Stripe (HMAC-SHA256) |
| `/api/whatsapp/webhook GET` | `hub.verify_token` |
| `/api/whatsapp/webhook POST` | HMAC-SHA256 `X-Hub-Signature-256` ✅ |
| `/api/widget` | Pública (por design) |
| `/api/geo` | Pública (por design) |

### Headers de segurança (`next.config.ts`)

Globais: `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security (HSTS)`.
- `/admin/*`: `X-Frame-Options: SAMEORIGIN`
- Widget `/:company/:agent`: `frame-ancestors *` (necessário para embed)
- CSP completo (script-src, style-src) ainda ausente nas rotas admin — item de hardening futuro.

### Secrets e variáveis de ambiente

Nenhuma chave sensível usa prefixo `NEXT_PUBLIC_`. `.env.example` atualizado com `WHATSAPP_APP_SECRET`.

---

## Histórico de gaps e correções

### ✅ GAP-1 — WhatsApp webhook POST sem verificação HMAC
**Corrigido em:** `b627c67` — `src/app/api/whatsapp/webhook/route.ts`

Body lido como texto antes do parse. HMAC-SHA256 calculado com `WHATSAPP_APP_SECRET` e comparado com `X-Hub-Signature-256` usando `timingSafeEqual`. Rejeita com 403 se divergir. A variável `WHATSAPP_APP_SECRET` foi adicionada ao `.env.example`.

---

### ✅ GAP-4 — Policy `using(true)` sem `to service_role` em `user_whatsapp`
**Corrigido em:** `b627c67` — `supabase/migrations/046_fix_user_whatsapp_policy.sql`

Drop da policy permissiva original e recriação explícita com `TO service_role`. Usuários autenticados não conseguem mais ler `phone_number_id`, `waba_id` e `display_phone_number` de outros clientes.

---

### ✅ GAP-5 — Server actions do super-admin sem verificação interna de token
**Corrigido em:** `b627c67` — `src/app/super-admin/actions.ts`

Helper `assertSuperAdmin()` adicionado internamente. Lê o cookie `sa_session` e chama `verifyToken()` da lib existente. Chamado no início de todas as 6 actions: `updatePlan`, `addConversations`, `resetCycle`, `applyPromoCodeToUser`, `removePromoFromUser`, `deleteClient`.

---

### ✅ GAP-6 — Dois webhooks Stripe ativos com sobreposição de eventos
**Corrigido em:** `b627c67` — arquivo `src/app/api/stripe/webhook/route.ts` deletado

Apenas `/api/webhooks/stripe/route.ts` permanece ativo. O arquivo removido só processava `checkout.session.completed` por email; o remanescente processa também `subscription.created/updated/deleted` com `user_id`.

---

### ✅ GAP-9 — `agentId` não validado como UUID em `/api/chat`
**Corrigido em:** `b627c67` — `src/app/api/chat/route.ts`

Validação com regex UUID logo após extração do body. Retorna 400 antes de qualquer query ao banco.

---

### ✅ NOVO-1 — `/api/notify-lead` e `/api/schedule-notify` sem autenticação
**Corrigido em:** `b627c67`

Ambas as rotas exigem header `x-internal-secret` igual a `CRON_SECRET`. Criadas relay routes server-side (`/api/notify-lead-relay` e `/api/schedule-notify-relay`) para uso pelo `ChatInterface.tsx` (client component que não acessa o secret diretamente). WhatsApp webhook passou a chamar as rotas originais com o header correto.

---

### ✅ NOVO-2 — `/api/upload` sem autenticação
**Corrigido em:** `b627c67` — `src/app/api/upload/route.ts`

Verificação de sessão via `createServerClient` no início do handler. Retorna 401 se não autenticado.

---

### ✅ NOVO-3 — `/api/admin/extract-file` sem verificação de ownership
**Corrigido em:** `b627c67` — `src/app/api/admin/extract-file/route.ts`

Query com `agents!inner(user_id)` verifica que o arquivo pertence a um agente do usuário autenticado antes de qualquer processamento. Retorna 404 se ownership falhar.

---

### ✅ NOVO-4 — `/api/admin/conversations-poll` sem ownership dos `agentIds`
**Corrigido em:** `b627c67` — `src/app/api/admin/conversations-poll/route.ts`

`agentIds` recebidos são filtrados contra agentes reais do `user_id` antes de qualquer consulta a conversas.

---

### ✅ NOVO-5 — `/api/stripe/checkout` sem autenticação
**Corrigido em:** `b627c67` — `src/app/api/stripe/checkout/route.ts`

Exige sessão autenticada. Usa `user.email` em vez do body. Adiciona `client_reference_id: user.id` e `metadata.user_id` ao checkout — corrigindo também a lacuna que impedia o webhook de associar o pagamento ao usuário correto.

---

### 🟡 GAP-2 — Rate limiting in-memory ineficaz em produção
**Status: melhoria parcial aplicada em `b627c67`**

O `Map` não é compartilhado entre instâncias Vercel. Melhoria aplicada: cap em 10.000 entradas com purga automática das mais antigas. **Fix completo requer Redis externo** (Upstash ou Vercel KV) — decisão de infra pendente.

---

### 🔍 GAP-3 — RLS de `conversations`, `protocols`, `agent_knowledge_datasets`, `agent_knowledge_rows` não confirmada
**Status: não verificável via código — requer ação manual no Supabase Dashboard**

Tabelas criadas fora do sistema de migrations. Verificar no Dashboard se RLS está habilitado. Se não estiver, criar migration ativando RLS com policies de owner por `agent_id → agents.user_id`.

---

## Pendências ativas

| Item | Ação necessária | Quem |
|---|---|---|
| RLS de `conversations` e `protocols` | Verificar no Supabase Dashboard e criar migration se necessário | Bruno (acesso ao Dashboard) |
| Rate limit externo | Decidir entre Vercel KV e Upstash; implementar quando priorizar | Bruno/dev |
| CSP completo nas rotas admin | Hardening futuro — script-src, style-src, etc. | Dev |

---

## Incidente anterior relacionado

Em 2026, a chave `ANTHROPIC_API_KEY` foi exposta via bundle Vite (`VITE_ANTHROPIC_API_KEY`) em projeto paralelo, gerando ~$2.716 USD em cobranças indevidas. Documentação em `dados/` e `operacoes/`. Lição aplicada: nenhuma variável sensível usa `NEXT_PUBLIC_` no CitraChat.
