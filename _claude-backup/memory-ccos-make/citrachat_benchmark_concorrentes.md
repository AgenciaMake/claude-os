---
name: citrachat-benchmark-concorrentes
description: "Análise competitiva do CitraChat vs Leadster e Octadesk — preços reais, gaps de feature, vantagens e roadmap priorizado. Ler antes de qualquer trabalho de estratégia, pricing ou landing page do CitraChat."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6400d359-e0a7-4d72-ab64-50d6227379e3
---

**Última atualização: 2026-06-09**

## Leadster — concorrente direto mais próximo

**Preço real:** R$ 142–154/mês (plano anual) — praticamente empatado com nosso Starter de R$ 147.

**O que eles têm que o CitraChat não tem ainda:**
- Chat proativo — aborda visitante com base em comportamento (tempo na página, fonte de tráfego, URL). CitraChat é reativo (usuário abre o chat)
- Agendamento de reuniões nativo — inclusive no plano gratuito
- Plano Free (15 leads/mês)
- A/B de fluxos
- Super Dashboard de Mídia (Meta + Google + LinkedIn consolidados)

**Detalhe crítico sobre rastreamento:** A Leadster dispara `fbq()` diretamente no script — client-side puro, NÃO é CAPI. Gera risco de dupla contagem se o cliente já tiver Pixel no GTM. Nossa arquitetura com `dataLayer.push()` é tecnicamente superior — mas CAPI ainda está no roadmap.

---

## Octadesk — segmento diferente, mas com lições

**Preço:** R$ 1.542/mês de entrada — 5x mais caro que nosso Pro.

**O que fazem diferente:**
- BSP oficial Meta — WhatsApp Business API nativo, múltiplos atendentes no mesmo número
- Omnichannel real: WhatsApp + Instagram DM + Facebook + email + chat web numa fila só
- Integrações nativas: Shopify, Nuvemshop, VTEX, Tray, HubSpot, RD Station, Salesforce
- WOZ — IA generativa como camada em cima do sistema de atendimento humano

**Posicionamento:** Octadesk é plataforma de atendimento humano que adicionou IA. CitraChat é IA que adiciona humano quando necessário. São apostas diferentes — não é concorrente direto.

---

## Onde o CitraChat ganha dos dois

| Vantagem | vs Leadster | vs Octadesk |
|----------|-------------|-------------|
| IA real (Claude) | Leadster usa fluxos com prompt engineering — sai do script, falha | WOZ é add-on caro em cima de tickets |
| Rastreamento superior | dataLayer é melhor que fbq() direto | Não tem foco em performance marketing |
| TikTok + LinkedIn nativos | Só Meta + Google | Não tem |
| White-label completo | Personalização básica | Não é white-label |
| Preço PME | Similar, mas IA real por menos | 5x mais caro |

---

## Roadmap priorizado a partir do benchmark

1. **CAPI (Conversions API server-side)** — Leadster não tem, vira diferencial real. Crítico para clientes com iOS14+/bloqueadores
2. **Chat proativo** — abordar visitante com base em comportamento. É o que faz a Leadster converter 295–316% mais leads
3. **WhatsApp via Meta Tech Provider** — próximo grande passo confirmado
4. **Agendamento de reuniões** — Leadster tem até no Free; precisamos ter
5. **Integrações e-commerce** (Shopify, Nuvemshop) — para competir com Octadesk no e-commerce

---

## Posicionamento para página de comparação

**vs Leadster:** "Leadster tem fluxos inteligentes. CitraChat tem IA que entende qualquer pergunta, responde com contexto do seu negócio e rastreia eventos com precisão que o Pixel isolado não entrega."

**vs Octadesk:** "Octadesk é plataforma de atendimento humano com IA como extra. CitraChat é IA primeiro, atendimento humano quando necessário. 5x mais barato."

**vs todos:** "O único com eventos nativos para GA4, Meta, TikTok e LinkedIn — sem GTM manual, sem Zapier."

**Why:** Contexto estratégico gerado em sessão anterior. Usar para decisões de pricing, copy da landing page, roadmap e posicionamento de vendas.

**How to apply:** sempre que Bruno trabalhar na landing page, pricing, copy de vendas ou roadmap do CitraChat — trazer esse contexto junto com [[citrachat-estado-atual-e-pr-ximos-passos]].
