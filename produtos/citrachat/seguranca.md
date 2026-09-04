# CitraChat — Auditoria de Segurança (2026-09-04)

> Auditoria realizada pelo Fable 5.1 sobre o código em produção.
> Atualizar este documento sempre que um gap for corrigido.

---

## Resumo executivo

| Severidade | Gaps confirmados | Gaps novos |
|---|---|---|
| 🔴 Crítico | 1 | 0 |
| 🟠 Alto | 2 | 3 |
| 🟡 Médio | 3 | 2 |
| ⚪ Baixo | 0 | 1 |

3 encadeamentos de ataque identificados — um deles é crítico.

---

## GAPS CONFIRMADOS

### 🔴 GAP-1 — WhatsApp webhook POST sem verificação de assinatura HMAC
**Arquivo:** `src/app/api/whatsapp/webhook/route.ts`, linhas 22–38

O handler POST não lê nem verifica o header `X-Hub-Signature-256` enviado pelo Meta. Qualquer pessoa com a URL do webhook pode forjar eventos, injetar mensagens arbitrárias em conversas ativas e fazer o sistema gastar créditos Anthropic respondendo a conteúdo malicioso. O dedup (`processedMessages` Set em memória, linha 8) também não funciona entre instâncias serverless — permite replay infinito.

**Fix:** ler o body como texto, calcular `HMAC-SHA256(rawBody, WHATSAPP_APP_SECRET)` e comparar com o header antes de processar. Rejeitar com 403 se divergir.

---

### 🟠 GAP-4 — Policy `using(true)` sem `to service_role` em `user_whatsapp`
**Arquivo:** `supabase/migrations/020_user_whatsapp.sql`, linhas 16–19

```sql
create policy "service role acessa tudo" on user_whatsapp
  for all using (true) with check (true);
```

Sem `to service_role`, qualquer usuário autenticado pode consultar `user_whatsapp` via anon key e obter `phone_number_id`, `waba_id` e `display_phone_number` de todos os outros clientes da plataforma. **Combinado com GAP-1, cria o encadeamento crítico descrito abaixo.**

**Fix:** migration adicionando `to service_role` na policy.

---

### 🟠 GAP-5 — Server actions do super-admin sem verificação interna de token
**Arquivo:** `src/app/super-admin/actions.ts`

Funções `updatePlan`, `addConversations`, `resetCycle`, `applyPromoCodeToUser`, `removePromoFromUser`, `deleteClient` não verificam o cookie `sa_session` internamente. A única barreira é o middleware. `deleteClient` pode deletar qualquer usuário do Supabase Auth.

**Fix:** extrair o helper de verificação que já existe em `configuracoes/actions.ts` para um helper compartilhado e chamá-lo no início de cada action.

---

### 🟡 GAP-2 — Rate limiting in-memory ineficaz em produção
**Arquivo:** `src/lib/rate-limit.ts`, linha 6

O `Map` não é compartilhado entre instâncias Vercel. O `setInterval` também não dispara de forma confiável em funções efêmeras. Na prática, o rate limit é zero contra carga distribuída.

**Fix:** Upstash Redis ou Vercel KV com janela deslizante.

---

### 🟡 GAP-6 — Dois webhooks Stripe ativos com sobreposição de eventos
**Arquivos:** `src/app/api/stripe/webhook/route.ts` e `src/app/api/webhooks/stripe/route.ts`

Se ambas as URLs estiverem registradas no Stripe, `checkout.session.completed` dispara duas atualizações em ordens diferentes. O webhook antigo não define `subscribed_via`, podendo sobrescrever o valor correto definido pelo novo.

**Fix:** remover o webhook em `/api/stripe/webhook/` e manter apenas `/api/webhooks/stripe/webhook`.

---

### 🟡 GAP-9 — `agentId` não validado como UUID na rota `/api/chat`
**Arquivo:** `src/app/api/chat/route.ts`, linha 1090

Valores malformados chegam ao PostgREST. Se o `agentId` for inválido, o chat ainda responde usando um prompt genérico de fallback (linha 248).

**Fix:** validar com regex UUID antes de qualquer query.

---

## GAPS NOVOS (encontrados na varredura adicional)

### 🟠 NOVO-1 — `/api/notify-lead` e `/api/schedule-notify` sem autenticação
**Arquivos:** `src/app/api/notify-lead/route.ts`, `src/app/api/schedule-notify/route.ts`

Ambos aceitam `agentId`, `sessionId` e `messages[]` de qualquer chamador sem nenhuma verificação. Um atacante pode:
- Bombardear o dono de qualquer agente com emails de "lead" falsos
- Injetar conteúdo arbitrário nas `messages` que aparecem nos emails enviados aos clientes
- Poluir a tabela `pending_notifications`

**Fix:** exigir shared secret no header (ex: `X-Internal-Secret`) ou restringir a chamadas internas.

---

### 🟠 NOVO-2 — `/api/upload` sem autenticação
**Arquivo:** `src/app/api/upload/route.ts`, linha 8

Aceita upload sem verificar sessão. Qualquer pessoa não autenticada pode fazer uploads para `chat-attachments`. Risco: esgotamento de storage (ataque de custo) + arquivos públicos via `getPublicUrl`.

**Fix:** adicionar verificação de sessão igual ao feito em `/api/train/route.ts`.

---

### 🟠 NOVO-3 — `/api/admin/extract-file` não verifica ownership do `fileId`
**Arquivo:** `src/app/api/admin/extract-file/route.ts`, linhas 47–61

Verifica autenticação mas não verifica se o `fileId` pertence ao usuário autenticado. Um usuário pode passar o `fileId` de outro cliente, forçar processamento via Anthropic (consumindo tokens) e sobrescrever o `content_status` do arquivo da vítima.

**Fix:** verificar `agent_knowledge_files.user_id = auth.uid()` antes de processar.

---

### 🟡 NOVO-4 — `/api/admin/conversations-poll` não valida ownership dos `agentIds`
**Arquivo:** `src/app/api/admin/conversations-poll/route.ts`, linhas 12–21

Aceita lista arbitrária de `agentIds` e retorna conversas. Segurança depende inteiramente do RLS na tabela `conversations`. Se RLS estiver desabilitado (status não confirmado via Dashboard), qualquer usuário autenticado pode ler conversas de outros clientes, incluindo nome, contato e histórico completo.

**Fix:** filtrar no código os `agentIds` que pertencem ao `user.id` antes de consultar.

---

### ⚪ NOVO-5 — `/api/stripe/checkout` cria sessão sem autenticação
**Arquivo:** `src/app/api/stripe/checkout/route.ts`

Permite criar sessões de checkout com emails de terceiros. Impacto direto limitado (sem pagamento não completa), mas permite phishing via URL Stripe legítima e spam de emails de confirmação.

**Fix:** exigir autenticação e usar o email do usuário autenticado.

---

## NÃO CONFIRMADOS

- **Gap 3 (RLS de `conversations`, `protocols`, etc.):** tabelas criadas fora do sistema de migrations — status real só verificável no Supabase Dashboard. Risco é real se desabilitado; verificar manualmente.
- **Gap 8 (CSP ausente):** confirmado como lacuna de hardening, mas não é vetor de ataque ativo encontrado no código.

---

## ENCADEAMENTOS DE ATAQUE

### 🔴 Encadeamento A — Injeção de WhatsApp + Enumeração de Números (Crítico)
**GAP-4 + GAP-1**

1. Atacante autenticado faz SELECT em `user_whatsapp` (policy permissiva) → obtém `phone_number_id` de qualquer cliente
2. Forja POST para `/api/whatsapp/webhook` com esse `phone_number_id` (sem HMAC)
3. Sistema resolve o agente associado, processa a mensagem forjada, chama Anthropic e responde via WhatsApp do cliente alvo
4. Resultado: consumo de créditos Anthropic + possível envio de desinformação para usuários reais do cliente

---

### 🟠 Encadeamento B — Spam de notificações com conteúdo forjado (Alto)
**NOVO-1 + GAP-9**

1. Atacante obtém agentId via slugs públicos no widget
2. Chama `/api/notify-lead` com agentId válido e `messages` com conteúdo malicioso (links de phishing, etc.)
3. Email de notificação com conteúdo arbitrário chega diretamente ao cliente da plataforma

---

### 🟡 Encadeamento C — Exfiltração de conversas via poll sem RLS (Médio → Crítico se RLS desabilitado)
**Gap 3 + NOVO-4**

1. Se RLS da tabela `conversations` estiver desabilitado
2. Atacante autenticado obtém agentId de outro cliente (slugs públicos)
3. Chama `/api/admin/conversations-poll?agents={agentId-alvo}`
4. Recebe até 50 conversas com nome, contato, dados de pré-chat e histórico completo

---

## Prioridade de correção sugerida

| Prioridade | Item | Motivo |
|---|---|---|
| 1 | Encadeamento A (GAP-1 + GAP-4) | Permite uso indevido de número de WhatsApp de clientes + gasto de créditos |
| 2 | NOVO-1 (notify-lead sem auth) | Permite spam e phishing direto aos clientes da plataforma |
| 3 | NOVO-2 (upload sem auth) | Custo de storage + conteúdo arbitrário público |
| 4 | Verificar RLS no Dashboard | Se desabilitado, Encadeamento C vira crítico imediato |
| 5 | GAP-5 (super-admin sem verificação interna) | Defesa em profundidade para o painel mais sensível |
| 6 | NOVO-3 (extract-file sem ownership) | Cross-tenant processing de arquivos |
| 7 | NOVO-4 (conversations-poll sem ownership) | Proteção independente do RLS |
| 8 | GAP-6 (webhooks Stripe duplicados) | Risco de inconsistência em cobranças |
| 9 | GAP-2 (rate limit in-memory) | Proteção real contra abuso da rota /api/chat |
| 10 | Demais | Hardening progressivo |
