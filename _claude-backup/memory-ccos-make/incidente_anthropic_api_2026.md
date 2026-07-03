---
name: incidente_anthropic_api_2026
description: Incidente Anthropic API 2026 — cobranças indevidas ~$2.716 USD + vazamento de chaves via bundle VITE
metadata: 
  node_type: memory
  type: reference
  originSessionId: 118f9f59-4c91-4970-9023-1cc5fa7db646
---

Incidente documentado em junho de 2026. Dois relatórios complementares:

**Relatório de contestação formal:**
`dados/relatorio-incidente-anthropic-api-2026-06.md`
`dados/incidente-anthropic-api-2026/` (pasta com prints, evidências e .docx)

**Relatório técnico de segurança:**
`operacoes/incidente-vazamento-api-keys-2026-06-06.md`

## Resumo do incidente

**5 episódios de consumo abusivo** entre 28/05 e 06/06/2026, todos de madrugada sem ação do usuário.

**Causa 1 — Conflito MAX vs API key no shell:**
Variável `ANTHROPIC_API_KEY` no `~/.zshrc` fez o Claude Code ignorar a autenticação do plano MAX e debitar créditos de API. Workflows com subagentes Opus rodaram de madrugada sozinhos.

**Causa 2 — Vazamento de chave via bundle Vite:**
`VITE_ANTHROPIC_API_KEY` e `VITE_GEMINI_API_KEY` foram embutidas no bundle JS público do CitraDesk (Cloudflare Pages). Alguém extraiu e usou as chaves com modelos Opus.

**Impacto financeiro:**
- ~$500 USD faturados e debitados (28/05)
- $2.216,41 de saldo negativo
- Total: ~$2.716 USD contestados

**Modelo envolvido:** claude-opus-4-7 / 4-6 / 4-8 em volume massivo (pico: ~68M tokens numa noite)

**Correção aplicada:**
- Chaves revogadas e rotacionadas
- Cloudflare Worker `citradesk-ai-proxy` criado como proxy server-side — chave nunca mais vai ao browser
- Variáveis `VITE_*` de API removidas do build
- `forceLoginMethod: claudeai` aplicado no Claude Code
- Opus bloqueado via settings.json

**Suporte Anthropic:** Negou reembolso via bot, prometeu agente humano que nunca respondeu (ID 215474528984029).

**Lição permanente:** Nunca usar prefixo `VITE_` pra chaves de API pagas em projetos Vite. Sempre server-side.

Relacionado: [[feedback_citrachat_no_opus]]
