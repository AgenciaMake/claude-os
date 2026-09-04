---
name: citrachat-seguranca
description: "Estado atual de segurança do CitraChat — autenticação, RLS, APIs, secrets, headers, webhooks e gaps identificados (snapshot 2026-09-04)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-04T15:22:10.987Z
---

# Segurança CitraChat — Estado Atual (2026-09-04)

## Autenticação

- **Login:** Supabase Auth (email + senha) via `@supabase/ssr`. Usa `auth.getUser()` no servidor (correto — valida JWT com Supabase, não só cookie local).
- **Middleware:** `src/proxy.ts` protege `/admin/:path*` e `/super-admin/:path*`. Rotas públicas explicitamente listadas (login, signup, etc.).
- **Dupla proteção no admin:** middleware + `supabase.auth.getUser()` no layout server-side (`src/app/admin/(app)/layout.tsx`).
- **Super-admin:** sistema próprio independente do Supabase Auth. Senha hasheada com PBKDF2-SHA256 (100k iterações). Token de sessão HMAC-SHA256, 7 dias. Cookie `httpOnly, secure, sameSite: strict`. Login usa `timingSafeEqual` (anti timing attack). **Gap:** server actions do super-admin (`src/app/super-admin/actions.ts`) não verificam o token internamente — dependem 100% do middleware.

## RLS no Supabase

Tabelas COM RLS confirmada via migrations: `agents`, `agent_integrations`, `agent_knowledge_files`, `profiles`, `promo_codes`, `lead_conversations`, `super_admins`, `agent_events`, `agent_connections`, `user_whatsapp`, `pending_notifications`, `training_logs`.

**Tabelas SEM RLS confirmada (criadas fora do sistema de migrations — verificar no Dashboard):**
- `conversations` — todo o histórico de chat de leads
- `protocols` — números de protocolo
- `agent_knowledge_datasets` — metadados de bases de conhecimento
- `agent_knowledge_rows` — linhas de planilhas carregadas

Todo acesso a essas tabelas no backend usa `service_role` (bypassa RLS). O risco: se RLS não estiver habilitado no Dashboard, usuários autenticados via anon key podem ler dados de outros clientes.

**Bug na policy de `user_whatsapp`:** policy `using(true)` sem `to service_role` — qualquer role autenticada pode ler números de WhatsApp de todos os usuários.

## API Routes

- `/api/chat` — pública por design. Rate limiting: 30 req/60s por IP, in-memory (`Map`). **Não funciona em produção no Vercel** (cada instância tem seu próprio Map). Limite de 80 mensagens e 80.000 chars por sessão.
- `/api/agents/[id]/datasets` — autenticada + ownership check.
- `/api/conversations/[id]` — autenticada + ownership check.
- `/api/cron/notify-leads` — `CRON_SECRET` via Bearer header.
- `/api/widget` — pública (serve o script do widget).
- `/api/geo` — pública.

## Secrets e Variáveis de Ambiente

Nenhuma chave sensível usa prefixo `NEXT_PUBLIC_`. Separação correta. `.env.example` documenta apenas 5 das ~20 variáveis — incompleto (faltam `STRIPE_*`, `RESEND_API_KEY`, `CRON_SECRET`, `GOOGLE_*`, `WHATSAPP_*`, `SUPER_ADMIN_*`, `NEXT_PUBLIC_APP_URL`).

## Headers de Segurança (`next.config.ts`)

Aplicados globalmente: `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`.
- Rotas admin e home: `X-Frame-Options: SAMEORIGIN`.
- Rota do widget `/:company/:agent`: `frame-ancestors *` (correto para embed).
- **Faltando:** CSP completo (script-src, style-src) nas rotas admin.

## Webhooks

- **Stripe:** assinatura verificada corretamente com `webhooks.constructEvent`. **Gap:** existem dois arquivos ativos — `src/app/api/stripe/webhook/route.ts` e `src/app/api/webhooks/stripe/route.ts`. Verificar qual é o canônico.
- **WhatsApp POST:** **NÃO verifica assinatura `X-Hub-Signature-256` do Meta.** Qualquer servidor pode injetar mensagens falsas, fazendo o bot responder e consumindo créditos Anthropic.

## Validação de Inputs

Sem Zod ou biblioteca de schema. Validações manuais e esparsas. Sem risco de SQL injection (SDK usa queries parametrizadas), mas dados malformados podem chegar ao banco.

## Gaps por Prioridade

**Crítico:**
1. WhatsApp webhook sem verificação de assinatura HMAC
2. Rate limiting in-memory não funciona com múltiplas instâncias Vercel
3. RLS de `conversations`, `protocols`, `agent_knowledge_datasets`, `agent_knowledge_rows` não confirmada — verificar no Dashboard

**Importante:**
4. `.env.example` incompleto
5. Server actions super-admin sem verificação interna de token
6. Dois webhooks Stripe ativos (duplicata?)
7. Policy `using(true)` em `user_whatsapp` sem escopo de role
8. CSP completo ausente nas rotas admin

**Why:** sistema em produção com clientes reais; gaps críticos representam risco de consumo indevido de créditos Anthropic e vazamento de dados entre tenants.
**How to apply:** antes de qualquer trabalho de segurança, priorizar a verificação de RLS das tabelas sem migration e o fix do webhook WhatsApp.
