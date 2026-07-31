---
name: citrachat-whatsapp-integracao
description: "Arquitetura completa da integração WhatsApp no CitraChat — arquivos, fluxo, DB, admin. Ler antes de qualquer trabalho envolvendo o canal WhatsApp."
metadata: 
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-07-31T23:36:25.014Z
---

**Última atualização: 2026-08-01**

## Status

WhatsApp ESTÁ implementado e em produção no CitraChat como add-on pago.
Landing page: citra.chat/whatsapp
Precificacao: +R$67/mes (Starter), +R$137 (Pro), +R$347 (Business).
Conversas WhatsApp compartilham o pool mensal do plano (nao e cobrado separado por conversa).

Bruno e equipe ja fizeram testes com a integracao.

## Arquivos principais

### `src/lib/whatsapp.ts`
- `sendWhatsAppMessage(phoneNumberId, to, text)` -- envia mensagem via Meta Graph API v20.0
- `markAsRead(phoneNumberId, messageId)` -- marca mensagem como lida
- Usa env var `WHATSAPP_ACCESS_TOKEN`

### `src/app/api/whatsapp/webhook/route.ts`
- `GET` -- verificacao do webhook Meta (token challenge)
- `POST` -- recebe e processa mensagens recebidas
- `resolveAgentForPhone(phoneNumberId)` -- consulta tabela `user_whatsapp`, prefere agente com `is_receptionist=true`, fallback para primeiro agente publicado
- `handleMessage(entry)` -- busca historico de conversa em `conversations` usando `wa_${from}` como sessionId; chama `/api/chat` internamente; envia resposta via `sendWhatsAppMessage`
- Deduplicacao: Set em memoria, max 200 IDs
- `waitUntil` (Vercel) para nao bloquear timeout do webhook
- `splitText(text, 4096)` -- divide mensagens longas em chunks por fronteira de frase

### `src/app/admin/(app)/conta/ContaForm.tsx`
- Secao "WhatsApp Business" aparece quando `waProfile !== null`
- Permite editar: foto do perfil (upload para API de midia Meta), texto "Sobre" (max 139 chars)
- Botao "Salvar WhatsApp" em verde (#25D366)

### `src/app/admin/(app)/conta/actions.ts`
- `saveWhatsAppProfile({ about, photoDataUrl })` -- le `phone_number_id` da tabela `user_whatsapp`, faz upload da foto para Meta, atualiza `whatsapp_business_profile`

## Banco de dados

- `user_whatsapp` -- mapeia `phone_number_id` → `user_id`
- `is_receptionist` flag em `agents` -- agente preferencial para receber mensagens do WA
- Session ID padrao para conversas WhatsApp: `wa_${phoneNumber}`

## Secao "Publicar" (admin)

A pagina Publicar so tem canais web:
- Endereco/slug do chat
- Status de publicacao
- Link publico
- Embed iframe
- Widget WordPress (botao flutuante)

O icone "WhatsApp" que aparece em WidgetSection.tsx (id: 'whatsapp') e apenas um preset de icone para o botao do widget web -- NAO e integracao com WhatsApp. E so o logo do WhatsApp como icone decorativo no botao flutuante.

A configuracao do canal WhatsApp fica em Conta (settings), nao em Publicar.

## Comparativo vs BotConversa

CitraChat usa API Oficial Meta (mesmo nivel que BotConversa).
BotConversa e BSP direto da Meta. CitraChat e integrado via API Oficial.
Ambos usam Meta Graph API para envio de mensagens.

Diferencial: CitraChat faz WhatsApp + site com um unico painel e mesmo pool de conversas.
BotConversa e 100% WhatsApp, sem canal web proprio.

## Status de testes (2026-08-01)

Testes feitos ate o momento foram com o numero de teste sandbox da propria Meta (limitado a numeros pre-autorizados). Bruno vai comprar um numero de producao para validar o fluxo real.

Quando o numero de producao estiver disponivel, o que precisa ser configurado (sem alteracao de codigo):
1. Vincular numero ao app Meta Business / WhatsApp Business API
2. Inserir `phone_number_id` na tabela `user_whatsapp` com o `user_id` correto
3. Confirmar webhook URL registrada na Meta: `citra.chat/api/whatsapp/webhook`
4. Verificar `WHATSAPP_ACCESS_TOKEN` no Vercel -- pode mudar com numero de producao

**Why:** Bruno pediu confirmacao da implementacao apos benchmark com BotConversa revelar que o WA estava implementado (contrario do que foi afirmado inicialmente no benchmark).
**How to apply:** Nao afirmar que CitraChat "nao tem WhatsApp" -- tem, codigo completo, testado no sandbox Meta. Falta validar com numero de producao.
