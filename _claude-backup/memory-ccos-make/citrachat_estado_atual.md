---
name: citrachat-estado-atual-e-pr-ximos-passos
description: "Snapshot vivo do CitraChat (atualizado diariamente). Onde paramos, o que tá no ar, o que vem a seguir. Ler no início de qualquer sessão sobre CitraChat."
metadata: 
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-01T07:20:43.518Z
---

**Última atualização: 2026-07-13**

## O que está no ar (produção)

**Branch `plataforma` → citra.chat** — branch de produção. Todo push vai direto ao Vercel sem promote manual.

Stack: Next.js + Anthropic SDK + Supabase (sa-east-1, `lkcwykalylphhngjivva`) + Tailwind. Hosting: Vercel Pro. Repo: `AgenciaMake/citrachat`.

**Modelo de IA:**
- Chat público: Claude Haiku 4.5
- Treino/análise/resumo de lead: Claude Sonnet 4.6
- Tool use (browse_url): Haiku 4.5 com loop até 2 rounds

## Funcionalidades implementadas e no ar

### Chat público
- Balões estilo WhatsApp: verde à direita (usuário), branco à esquerda (agente), tails SVG nos cantos
- Status de mensagem: check cinza (enviando) → checks azuis (lido) — azuis aparecem após `initialDelay()`, antes dos pontos
- Typing dots sincronizados com o status "digitando..." no header
- Anexos: botão de clipe, aceita imagens e PDFs até 5MB, preview antes de enviar, enviados como content blocks para a IA
- Mensagens do usuário preservadas após resposta do agente (fix stale closure em `finalMessages`)

### Agente
- System prompt inclui `welcome_message` para o agente não se reapresentar
- Tool use `browse_url`: agente busca produtos no site do cliente quando solicitado (proteção SSRF incluída)
- RLS profiles: policy `public_read_company_slug` adicionada para URL pública `/company/agent` funcionar com anon key

### Multi-agente
- URL pública: `citra.chat/{company_slug}/{agent_slug}` — ex: `citra.chat/abyaragraf/vendas`
- Limite por plano: Starter=1, Pro=3, Business=10

### Email de leads qualificados
- Remetente: `leads@citra.chat`
- Domínio `citra.chat` adicionado no Resend, DNS configurado no Namecheap em 2026-06-03
- DNS verificado no Resend, domínio ativo — email de lead qualificado saindo normalmente (confirmado por Bruno em 2026-07-13)
- Email configurado para agentes AbyaraGraf (Tiago e Joana): `bruno@makelemonad.com.br`
- Template HTML: header preto/limão, dados do lead, resumo IA, conversa completa, imagens inline

### Widget WordPress
- Embed code gerado em citra.chat → Publicar → Widget
- Formato: `<script src="https://citra.chat/widget.js?agent=company/slug&position=right&delay=10" defer></script>`
- Config baked na URL — imune a LiteSpeed Cache e bundlers
- Auto-open: exibe mini bubble (bolinha com texto) após delay, não o chat completo. Clicar abre o chat
- DOMContentLoaded guard garante execução mesmo em sites com async/defer agressivo
- Widget da Make: instalado via HFCM Snippet #14 em makelemonad.com.br. Agent: `makelemonad/atendimento-make`

### Tracking (eventos)
- 6 eventos: `citrachat_chat_started`, `citrachat_chat_engaged`, `citrachat_chat_completed`, `citrachat_lead_captured`, `citrachat_lead_qualified`, `citrachat_human_requested`
- **Arquitetura de tracking (pós fix 06/06):**
  - Modo widget (iframe): postMessage → widget.js → dataLayer da página hospedeira → GTM/GA4 do site
  - Modo standalone (URL direta): GA4/GTM carregam normalmente dentro da página
  - NUNCA carrega GTM/pixels dentro do iframe — causava conflito com GTM Preview
  - Check de segurança no widget.js usa `e.origin === 'https://citra.chat'` (não mais `e.source`)
- **Make configurada:** GTM-5R5ZM77 + G-3026YN424E. 6 triggers + 6 tags GA4 publicadas (GTM v33, 05/06/2026)
- Eventos validados no GTM Preview e disparando certo (confirmado por Bruno em 2026-07-13)
- `citrachat_lead_qualified` deve ser marcado como conversão no GA4 após primeiro disparo
- Documentação completa: `clientes/make/citrachat-gtm-setup.md`

### Limonete (demo em `/testelimonete`)
- Sem referências à MakeLemonAd — é demo do próprio CitraChat
- Qualifica visitantes para o CitraChat, cobre todos os verticais de uso

## Clientes ativos no CitraChat

**AbyaraGraf** (`company_slug: abyaragraf`)
- Agente Joana: `citra.chat/abyaragraf/sac`
- Agente Tiago: `citra.chat/abyaragraf/vendas`
- Notificação: `bruno@makelemonad.com.br`

## Custos reais de produção (2026-06-03)
- Supabase Pro: US$ 25/mês
- Vercel Pro: US$ 20/mês
- Resend: US$ 20/mês
- **Total fixo: US$ 65/mês (~R$ 375)**
- Anthropic API: por uso (~0 agora)
- Claude MAX (dev): US$ 100/mês
- **Total com dev: ~US$ 165/mês (~R$ 950)**

## Features pendentes (aguardando pré-requisito externo)

### Notificações via WhatsApp (aguardando números WABA do CitraChat)

CitraChat enviará notificações de eventos diretamente para o WhatsApp do dono do agente, usando números próprios do CitraChat como remetente:
- 1 número Brasil, 1 Europa, 1 América (quando houver operação lá)
- Eventos configuráveis por agente: chat iniciado, chat encerrado, lead qualificado, issue resolvido
- Configuração: campo `notification_whatsapp` + `notification_whatsapp_events` em `agent_integrations`
- Templates precisam ser aprovados pela Meta antes do go-live

**Pré-requisitos para implementar:**
1. Criar número WABA no Meta Business Manager do CitraChat
2. Obter `phone_number_id` e access token de longa duração
3. Criar e submeter 4 templates para aprovação Meta (`citrachat_chat_iniciado`, `citrachat_lead_qualificado`, `citrachat_issue_resolvido`, `citrachat_chat_encerrado`)
4. Adicionar `CITRACHAT_WA_PHONE_NUMBER_ID` e `CITRACHAT_WA_TOKEN` no Vercel

Quando os números estiverem prontos, o código envolve: nova função `sendWhatsAppNotification()`, campos novos na tabela e na UI de configurações, acionamento nos mesmos pontos do email.

### Notificações via SMS — Twilio (pausado, retomar quando fatura baixar)

**Status:** conta Twilio criada (MakeLemonAd, Portugal), plano Pay as you go, $20 de crédito depositado. Auto-recharge desabilitado.

**Falta para implementar:**
1. Entrar no Twilio → Phone Numbers → Buy a number → comprar 1 número para envio (Brasil por enquanto)
2. Pegar na dashboard: Account SID + Auth Token + número comprado
3. Me passar os 3 valores — implemento tudo no CitraChat

**O que o código precisa (já planejado):**
- Migration SQL: campos `notification_sms_phones` (texto, vírgula separado) e `notification_sms_events` (array) em `agent_integrations`
- UI na aba Configurações do agente: campo de números + checkboxes de eventos
- Função `sendSmsNotification()` via Twilio REST API
- Trigger nos mesmos pontos do email: chat iniciado, lead qualificado, issue resolvido, chat encerrado
- Env vars no Vercel: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

---

## Como retomar

1. Ler essa memória + `produtos/citrachat/CITRACHAT.md`
2. Conferir `_memoria_pendente/` — aplicar e apagar se houver snapshot
3. `cd produtos/citrachat/codigo && git log --oneline -5` — branch ativa é `plataforma`

**How to apply:** quando Bruno disser "vamos falar do CitraChat", ler essa memória primeiro.
