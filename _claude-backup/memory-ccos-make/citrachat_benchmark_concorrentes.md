---
name: citrachat-benchmark-concorrentes
description: "Análise competitiva do CitraChat vs Leadster, Octadesk, BotConversa e Meta WhatsApp AI — preços reais, gaps de feature, vantagens e roadmap priorizado. Ler antes de qualquer trabalho de estratégia, pricing ou landing page do CitraChat."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6400d359-e0a7-4d72-ab64-50d6227379e3
  modified: 2026-07-31T23:29:15.736Z
---

**Última atualização: 2026-08-01 (adicionado BotConversa)**

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

## Meta (WhatsApp Business AI Agent) — concorrente nativo de plataforma

**Fonte:** whatsappbusiness.com/pt-br/products/business-app-ai-agent/ (checado 2026-07-13)

**O que é:** agente de IA nativo do próprio WhatsApp Business App — responde no WhatsApp, Messenger e anúncios Meta 24/7. Aprende sozinho a partir da Página do Facebook, site e catálogo de produtos. Controles: conhecimento, personalidade, público-alvo, transferência pra humano. Setup "em minutos", sem código. Público: PMEs, começando em mercados selecionados (Brasil não confirmado ainda).

**Por que é diferente dos outros concorrentes:** não é uma startup de SaaS — é a própria Meta comoditizando "IA que responde no WhatsApp" dentro do produto que todo PME já usa. Ameaça de distribuição, não de profundidade de produto.

**Onde ataca o CitraChat:** o add-on de WhatsApp (R$50-200/mês) fica mais difícil de vender se a Meta oferecer isso nativo/grátis dentro do WhatsApp Business Premium.

**Onde o CitraChat continua ganhando:** tracking unificado GTM/GA4/Ads/TikTok/LinkedIn, lead scoring cross-channel, dashboard de performance, white-label pra revenda por agência. A Meta resolve "responder no WhatsApp" — não resolve "transformar isso em dado de mídia paga que otimiza campanha". Isso não é o negócio da Meta.

**Implicação estratégica:** não vender o CitraChat como "IA que conversa no WhatsApp" (isso vai ser comoditizado pela Meta). Vender como "IA que conversa em qualquer canal E alimenta suas campanhas com dado de conversão real" — a camada de performance marketing é o fosso que a Meta não vai construir. Reforça urgência de lançar logo, antes da Meta expandir esse recurso pro Brasil.

---

## BotConversa — concorrente WhatsApp-first (adicionado 2026-08-01)

**Preco real:** R$ 199/mês Pro (com IA e API Oficial Meta). R$189 Starter (sem IA).
Referencia completa: [produtos/citrachat/briefings/07_benchmark_botconversa.md](../produtos/citrachat/briefings/07_benchmark_botconversa.md)

**O que eles têm que o CitraChat não tem:**
- WhatsApp via API Oficial Meta (BSP) — enorme gap, canal dominante no Brasil
- Broadcasts em massa para base de contatos
- Flow builder visual (drag-and-drop para quem quer fluxo fixo)
- CRM Kanban integrado
- 50+ integracoes nativas (Shopify, Nuvemshop, VTEX, Hotmart, Eduzz...)
- App mobile (iOS, nota 3.84, v0.9.0)
- 45.000+ empresas ativas (base estabelecida)

**Onde o CitraChat ganha do BotConversa:**
- Canal web: BotConversa e 100% WhatsApp -- zero chat no site. CitraChat cobre o site.
- Multi-agente com roteamento: BotConversa tem 1 assistente unico por empresa.
- Tracking de midia paga nativo: TikTok, LinkedIn, GA4, Meta -- BotConversa conecta Ads mas nao fecha o loop de conversao.
- IA no plano de entrada: CitraChat Starter R$147 tem IA. BotConversa Starter R$189 nao tem.
- IA mais sofisticada: Claude nativo vs conectar ChatGPT/Gemini como add-on externo.
- Modelo de cobranca: por conversa (previsivel) vs por creditos de mensagem (opaco).
- Analise de imagem multimodal (BotConversa so menciona audio).

**IMPORTANTE:** CitraChat TEM WhatsApp via API Oficial Meta como add-on (citra.chat/whatsapp). Precos: +R$67 Starter, +R$137 Pro, +R$347 Business. Conversas compartilham o pool do plano.

**Comparativo real (com WhatsApp):**
- BotConversa Pro completo: R$199/mês
- CitraChat Starter + WA: R$214/mês | Pro + WA: R$534/mês

**Posicionamento correto:** quem precisa SO de WhatsApp paga menos no BotConversa. Quem precisa de WhatsApp + site + tracking unificado + multi-agente tem uma unica opcao: CitraChat.

**Copy:** "BotConversa atende no WhatsApp. CitraChat atende no WhatsApp E no seu site -- com um painel so, um rastreamento so, e sem pagar duas ferramentas."

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
