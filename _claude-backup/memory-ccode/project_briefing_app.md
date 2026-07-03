---
name: App de briefing conversacional (Cloudflare Pages)
description: Sistema end-to-end de onboarding de cliente — skill /novo-cliente + app Cloudflare Pages que conversa com Claude e gera Google Doc
type: project
originSessionId: e07a4ab4-587b-4e25-b0f9-8d80a07ea67d
---
O workspace `ccos-make` tem um sistema integrado de cadastro de cliente em duas partes:

**1. Skill `/novo-cliente`** (`.claude/skills/novo-cliente/SKILL.md`) — roda no Claude Code. Coleta dados básicos, cria pastas no Google Drive (tanto em `02. CLIENTES` quanto em `02. MAKE - CRIAÇÃO`), cria pasta local em `clientes/{slug}/`, gera código único `MK-XXXXX` e registra linha na Sheet `MAKE_BRIEFING_REGISTRO`.

**2. App Cloudflare Pages** em `apps/briefing/` — site conversacional que o cliente acessa com o código `MK-XXXXX`. Frontend tem 3 telas (código → chat → concluído). Backend (Pages Functions) valida o código contra a Sheet, conversa com Claude API (Sonnet 4.6), e ao final salva um Google Doc com o briefing + marca status "concluído" na Sheet.

**Why:** Bruno quer automatizar o briefing que hoje é feito manualmente via Google Forms. O app oferece experiência mais natural (chat) e gera o Doc pronto na pasta do cliente no Drive.

**How to apply:** Ao trabalhar em qualquer dos dois lados (skill ou app), lembrar que eles compartilham a Sheet `MAKE_BRIEFING_REGISTRO` (ID: `177tCA1GgrC9WyFiwi2PQmiqWg_69dDe6DSKxruVePt0`) como fonte única de verdade dos códigos e status. Qualquer mudança de schema da Sheet afeta os dois.

**Status em 2026-04-22:** 🟢 EM PRODUÇÃO, AGUARDANDO PRIMEIRO CLIENTE REAL. URL https://makelemonad-briefing.pages.dev. Testado com MK-TEST1 (cliente fictício). Personalidade Alfred implementada: avatar, ritmo humanizado com rajadas aleatórias de digitação, checks WhatsApp (✓→✓✓ cinza→✓✓ azul), som de notificação, strip de Markdown, fetch automático de sites mencionados pelo cliente. Mobile layout corrigido (100dvh, safe-area-inset-bottom, botão circular). Credenciais rotacionadas em 2026-04-22.

**Decisão em 2026-04-22:** Bruno optou por segurar o teste end-to-end até aparecer um cliente real (evita criar/deletar pastas de teste no Drive). O app fica ocioso mas pronto — basta rodar `/novo-cliente` quando o primeiro cliente assinar contrato.

**Roadmap aberto:** (1) validação end-to-end no primeiro cliente real, (2) upload de arquivos no chat (V1 simples ou V2 com Claude Vision), (3) notificação pra Amanda quando briefing concluir, (4) domínio custom.
