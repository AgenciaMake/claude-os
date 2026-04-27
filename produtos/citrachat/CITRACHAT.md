# CitraChat — Briefing Mestre

> **Ler esse arquivo no início de qualquer sessão que envolva o CitraChat** (código, feature, bug, roadmap, monetização, estratégia).
>
> ⚠️ **Briefing em construção.** Esse documento é um esqueleto — preencher conforme as decisões forem sendo tomadas com o Bruno.

## O que é

CitraChat é um produto da linha **Citra** (família cítrica da MakeLemonAd) com foco em **(definir: chat com clientes? chat com AI? omnichannel? CRM conversacional?)**.

**Origem:** (preencher — surgiu de qual dor / experimento / pedido?)

**Versão atual:** _ainda não há código_
**Ambiente atual:** _planejamento_

## Problema que resolve

> Preencher: qual a dor concreta que o CitraChat ataca? Quem está sofrendo com isso hoje? O que usam pra contornar (concorrência indireta)?

## Público-alvo

**Inicial (uso interno):** MakeLemonAd
**SaaS — Tier 1:** _a definir_
**SaaS — Tier 2 (futuro):** _a definir_

## Módulos / Features (planejados)

> Preencher conforme as decisões forem sendo tomadas. Possíveis direções:
> - Atendimento omnichannel (WhatsApp + Instagram + email num lugar)
> - Chatbot com AI customizado por marca
> - CRM conversacional integrado ao CitraDesk
> - Inbox compartilhada de equipe
> - Automações de follow-up

## Stack técnica (a definir)

> Padrão da linha Citra:
> - Frontend: React 19 + TypeScript + Vite
> - Backend: Firebase (Auth + Firestore) ou Supabase
> - AI: Google Gemini ou Claude API
> - UI: Tailwind + lucide-react
>
> Específico do chat (a decidir):
> - WebSocket / Realtime (Firebase Realtime DB? Supabase Realtime? Pusher?)
> - Integração WhatsApp Business API
> - Integração Meta (Instagram DM)
> - Provider de envio (Twilio? Z-API?)

## Multi-tenancy e arquitetura SaaS

> Aplicar mesmos princípios do CitraDesk:
> - Isolamento por agência/tenant
> - Multi-moeda BRL/USD/EUR
> - Multi-país BR/PT
> - RBAC com roles owner/admin/editor/viewer/agente

## Integração com CitraDesk

Ponto importante: CitraChat e CitraDesk são da mesma família e devem **conversar**. Possibilidades:
- Conversas vinculadas a clientes do CitraDesk
- Histórico de atendimento aparece no perfil do cliente
- AI Insights cruzando dados financeiros (CitraDesk) com atendimento (CitraChat)
- SSO entre os dois produtos
- Plano combinado pros dois produtos

## Monetização (rascunho)

> Preencher após definir features e público.

## Status atual e próximos passos

**Em uso:** ainda não.
**Próximas decisões:**
1. Definir o problema-alvo concreto (qual conversa, qual canal, qual volume)
2. Validar com a operação interna da MakeLemonAd: que dor de comunicação a Make tem hoje?
3. Pesquisa de concorrentes (Octadesk, Zenvia, Take Blip, Chatwoot, Intercom)
4. Definir MVP (o menor produto que entrega valor pra Make usar internamente)
5. Criar repo no GitHub e clonar pra `produtos/citrachat/codigo/`

## Fluxo de trabalho com Claude

Quando o produto evoluir:
1. Ler esse briefing primeiro
2. Trabalhar em `produtos/citrachat/codigo/` (depois que o repo for criado e clonado)
3. Decisões importantes em `produtos/citrachat/briefings/`
4. Feedback interno em `produtos/citrachat/feedback/`

## Repositório

- **GitHub:** _a criar_
- **Local:** _ainda não clonado_
