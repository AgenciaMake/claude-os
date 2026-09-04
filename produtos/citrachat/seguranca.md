# CitraChat — Segurança e Protocolos (snapshot 2026-09-04)

> Documento vivo. Atualizar sempre que houver mudança relevante na postura de segurança.

---

## Autenticação e Acesso

### Painel admin (clientes)
- **Provedor:** Supabase Auth — email + senha
- **Validação server-side:** `auth.getUser()` (valida JWT com o servidor Supabase, não apenas cookie local)
- **Middleware:** `src/proxy.ts` — protege `/admin/:path*`; rotas públicas explicitamente listadas
- **Dupla barreira:** middleware + verificação no layout server-side (`src/app/admin/(app)/layout.tsx`)

### Painel super-admin (Make)
- **Provedor:** sistema próprio, independente do Supabase Auth
- **Senha:** PBKDF2-SHA256, 100.000 iterações
- **Sessão:** token HMAC-SHA256, expiração 7 dias; cookie `httpOnly, secure, sameSite: strict`
- **Login:** usa `timingSafeEqual` para prevenir timing attack
- **Limitação atual:** server actions super-admin não verificam o token internamente — dependência exclusiva do middleware

---

## RLS (Row Level Security) no Supabase

### Tabelas protegidas por RLS (confirmado via migrations)

| Tabela | Acesso permitido |
|---|---|
| `agents` | Owner por `user_id`; SELECT público para agentes publicados |
| `agent_integrations` | Owner via JOIN em agents |
| `profiles` | `auth.uid() = id` — só próprio usuário |
| `lead_conversations` | SELECT por owner via JOIN em agents |
| `super_admins` | Bloqueado para todos (só service_role) |
| `agent_events` | SELECT por owner; INSERT só service_role |
| `agent_connections` | Owner via `from_agent` |
| `pending_notifications` | Bloqueado para todos (só service_role) |
| `promo_codes` | Bloqueado para todos (só service_role) |
| `user_whatsapp` | Owner por `user_id` — **ver bug abaixo** |
| `training_logs` | SELECT por owner; INSERT bloqueado |

### ⚠️ Tabelas sem RLS confirmada (criadas fora do sistema de migrations)

Verificar no Supabase Dashboard se RLS está habilitado:

- **`conversations`** — histórico completo de chat (inclui dados de leads)
- **`protocols`** — números de protocolo de atendimento
- **`agent_knowledge_datasets`** — metadados das bases de conhecimento
- **`agent_knowledge_rows`** — linhas das planilhas carregadas

Todo acesso a essas tabelas no backend usa `SUPABASE_SERVICE_ROLE_KEY` (bypassa RLS). **Se RLS estiver desabilitado, usuários autenticados com a anon key poderiam ler dados de outros tenants.**

### Bug conhecido: policy `user_whatsapp`
Policy `using(true)` sem `to service_role` — qualquer role autenticada pode ler números de WhatsApp de todos os usuários. Corrigir com `to service_role`.

---

## Proteção das API Routes

| Rota | Proteção |
|---|---|
| `/api/chat` | Pública (por design). Rate limit 30 req/60s por IP (in-memory — ver limitação) |
| `/api/agents/[id]/datasets` | Autenticada + ownership check |
| `/api/conversations/[id]` | Autenticada + ownership check |
| `/api/admin/conversations-poll` | `auth.getUser()` |
| `/api/cron/notify-leads` | Bearer `CRON_SECRET` |
| `/api/stripe/webhook` | Assinatura Stripe (HMAC-SHA256) |
| `/api/whatsapp/webhook GET` | `hub.verify_token` (verificação Meta) |
| `/api/whatsapp/webhook POST` | ⚠️ **Sem verificação de assinatura** |
| `/api/widget` | Pública (script do widget) |
| `/api/geo` | Pública |

### Rate limiting — limitação crítica
O store de rate limiting é um `Map` in-memory (`src/lib/rate-limit.ts`). No Vercel com múltiplas instâncias (auto-scaling), cada instância tem seu próprio Map. O limite real em produção é `30 × número de instâncias`. **Não é efetivo contra abuso.** Solução: Upstash Redis ou Vercel Edge Config.

---

## Variáveis de Ambiente

Nenhuma chave sensível usa prefixo `NEXT_PUBLIC_`. Separação correta.

| Variável | Exposta ao browser? |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sim (por design — URL pública) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sim (por design — chave pública) |
| `NEXT_PUBLIC_APP_URL` | Sim (URL base — ok) |
| `ANTHROPIC_API_KEY` | Não |
| `SUPABASE_SERVICE_ROLE_KEY` | Não |
| `STRIPE_SECRET_KEY` | Não |
| `RESEND_API_KEY` | Não |
| `WHATSAPP_ACCESS_TOKEN` | Não |
| Demais `*_SECRET`, `*_KEY` | Não |

**Problema operacional:** `.env.example` documenta apenas 5 das ~20 variáveis. Atualizar antes do próximo onboarding de dev.

---

## Headers de Segurança

Configurados em `next.config.ts`:

**Globais:**
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

**Por rota:**
- `/admin/*` e `/`: `X-Frame-Options: SAMEORIGIN`
- `/:company/:agent`: `Content-Security-Policy: frame-ancestors *` (necessário para embed do widget)

**Ausente:** Content-Security-Policy completa (script-src, style-src) nas rotas admin.

---

## Webhooks Externos

### Stripe
- Verificação de assinatura implementada e correta (`webhooks.constructEvent`)
- **Atenção:** dois arquivos de webhook ativos — `src/app/api/stripe/webhook/route.ts` e `src/app/api/webhooks/stripe/route.ts`. Verificar qual é o canônico e remover o outro.

### WhatsApp (Meta)
- GET (verificação inicial): `hub.verify_token` verificado ✓
- **POST (mensagens recebidas): sem verificação de `X-Hub-Signature-256`**
  - O Meta assina cada payload com HMAC-SHA256 usando o app secret
  - Atualmente ignorado — qualquer servidor pode fazer POST e injetar mensagens falsas
  - Impacto: bot responde a mensagens fabricadas, consumindo créditos Anthropic

---

## Validação de Inputs

- Sem biblioteca de schema (Zod ou similar)
- Validações manuais esparsas em alguns endpoints
- Sem risco de SQL injection (SDK Supabase usa queries parametrizadas)
- Risco: dados malformados chegando ao banco sem tratamento

---

## Gaps por Prioridade

### 🔴 Crítico
1. **WhatsApp POST sem verificação de assinatura** — risco de injeção de mensagens e consumo indevido de créditos
2. **Rate limiting in-memory ineficaz** — não protege `/api/chat` em produção com múltiplas instâncias
3. **RLS de `conversations`, `protocols`, `agent_knowledge_datasets`, `agent_knowledge_rows` não confirmada** — verificar no Dashboard imediatamente

### 🟡 Importante
4. **`.env.example` incompleto** — risco operacional no setup de novos ambientes
5. **Server actions super-admin sem verificação interna de token**
6. **Dois webhooks Stripe ativos** — possível duplicata de processamento
7. **Policy `using(true)` em `user_whatsapp`** sem escopo de role
8. **CSP completo ausente** nas rotas admin

### 🟢 Melhorias futuras
9. Introduzir Zod para validação de inputs em server actions e API routes
10. Validar `agentId` como UUID antes de queries

---

## Incidente anterior relacionado

Em 2026, a chave `ANTHROPIC_API_KEY` foi exposta via bundle Vite (`VITE_ANTHROPIC_API_KEY`) em projeto paralelo, gerando ~$2.716 em cobranças indevidas. Documentação em `dados/` e `operacoes/`. Lição aplicada: nenhuma variável sensível usa `NEXT_PUBLIC_` no CitraChat.
