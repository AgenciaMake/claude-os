---
name: citrachat-estado-atual
description: Estado atual do CitraChat — onde paramos, o que está no ar, o que vem a seguir
metadata:
  type: project
---

# CitraChat — Estado atual

**URL de produção:** https://citra.chat  
**Deploy:** Vercel (projeto `citrachat`, org `team_VhzDlgHlM3CqpGYRSbiMGF2l`)  
**Branch de produção:** `plataforma` (branch consolidada — ver commit `20e593d`)  
**Repo GitHub:** https://github.com/AgenciaMake/citrachat

## O que está no ar (branch plataforma)

- Chat público fullscreen em `/{slug}` e `/{company}/{agent}`
- Admin com autenticação, multi-agente, identidade, treino, integrações e publicação
- Widget embeddable via `<script src="citra.chat/widget.js?agent=SLUG">`
- Tracking: GTM, GA4, Meta Pixel, Google Ads, TikTok, LinkedIn via postMessage bridge
- Email de lead qualificado via Resend
- Rate limiting por IP
- Planos: Starter (1 agente), Pro (3), Business (10)

## Problemas em andamento — mobile responsiveness

**Sintoma:** header (foto + nome + status) some quando teclado abre no iOS Safari  
**Root cause identificada:** CSS `height:100%!important` em `#_cc_frame_fs` overridava o `frame.style.height` do JS (`!important` stylesheet > inline style)  
**Fix aplicado (commit 8982ab5):** removido `height` do CSS `#_cc_frame_fs`, JS controla exclusivamente via `window.visualViewport.height`  
**Status:** fix deployado, aguardando teste no celular real

**Arquitetura do fix mobile:**
1. Widget (host): detecta mobile (`innerWidth <= 520`), move iframe para `document.body` diretamente
2. Widget (host): bloqueia scroll do body via `<style id="_cc_bodylock">` com `!important`  
3. Widget (host): sincroniza height do iframe com `window.visualViewport.height` + `offsetTop` via `resize` e `scroll` events
4. Chat page (iframe): `html, body { height: 100% }`, container root `width/height: 100% overflow:hidden`
5. ChatInterface: `flex flex-col h-full` — header `shrink-0`, messages `flex-1 overflow-y-auto`, input `shrink-0`

## Preview page (novo)

**URL:** `https://citra.chat/dev/preview?slug=SLUG`  
Mostra iPhone 15 Pro + Pixel 8 Pro + Desktop (widget em mock-site) simultaneamente.  
Aceita qualquer slug via query param. Botão "Reiniciar chat" em cada frame.

## Eventos de tracking

- `chat_opened` — chat aberto
- `first_message` — primeira mensagem do usuário  
- `lead_captured` — email OU telefone detectado no input do usuário
- `lead_qualified` — agente dispara frase de handoff (QUALIFIED_RE)
- `lead_qualified` também dispara `notify-lead` → email para o dono do agente

## Pendências

- [ ] Testar fix do iOS no dispositivo real
- [ ] Restaurar `Cache-Control` do widget para valor razoável (está em `no-cache`)
- [ ] Marcar `citrachat_lead_qualified` como conversão no GA4 (após primeiro evento real)
- [ ] LP: atualizar coluna "Chat genérico" para referenciar "Leadster" especificamente
- [ ] Mobile tracking: eventos GTM/GA4 não chegam ao dataLayer do parent quando chat em fullscreen

**Why:** bugs de responsividade mobile eram a principal reclamação do Bruno. Fix crítico para usar em produção com clientes.  
**How to apply:** sempre que abrir sessão de CitraChat, ler este arquivo primeiro para entender o estado.
