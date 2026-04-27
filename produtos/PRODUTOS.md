# Produtos SaaS da MakeLemonAd — Linha Citra

> Status: Em desenvolvimento. Visão SaaS modular com 2 produtos comerciais e infraestrutura compartilhada.

A Make desenvolve produtos SaaS na **linha Citra** (família cítrica do limão da MakeLemonAd). A linha tem **dois produtos comerciais** que podem ser vendidos separados ou combinados.

## Produtos comerciais

### 🍋 CitraDesk — Suíte de Gestão pra Agências

**Quem compra:** agências de marketing digital (3 a 50 pessoas).
**O que resolve:** centraliza gestão de clientes, projetos, equipe, freelancers, ferramentas SaaS, finanças e tarefas num único sistema.
**Modelo:** SaaS modular — agência contrata os módulos que precisa.

**Domínios:** `citradesk.com` (principal), `citradesk.com.br` (redirect), `citradesk.io` (staging).
**URL por cliente:** `citradesk.com/{slug-da-agencia}` (ex: `citradesk.com/makelemonad`).

| Módulo | O que entrega | Status |
|---|---|---|
| **Gestão** (core) | Clientes, Estrutura Digital (SaaS), Acessos (senhas), Equipe, Configurações | ✅ Implementado |
| **Financeiro** | Dashboard, MRR/Churn/LTV, Projetos, Folha (CLT/PJ), Horas Freelancers | ✅ Implementado |
| **Tarefas** | Kanban estilo Trello, automações, integração com clientes/projetos | 🟡 Roadmap |
| **CRM** | Pipeline de leads, propostas comerciais, conversão lead→cliente | 🟡 Roadmap |
| **AI Insights** (addon) | Análise estratégica via IA, simulador de crescimento, chat consultor | ✅ Implementado |
| **Chat (CitraChat plugado)** | Quando agência também assina o CitraChat, integra como módulo dentro do CitraDesk | 🟡 Roadmap |

Briefing completo: [citradesk/CITRADESK.md](citradesk/CITRADESK.md)

---

### 💬 CitraChat — Plataforma de Agentes Conversacionais com IA

**Quem compra:** qualquer empresa que queira agente IA pra gerar leads (clínicas, e-commerce, escolas, profissionais liberais, agências).
**O que resolve:** chat inteligente (não árvore de decisão) com tracking completo (GTM, Meta Pixel, Google Ads, GA4, TikTok, LinkedIn).
**Modelo:** SaaS standalone — vende sozinho. Mas pode ser **plugado no CitraDesk** como módulo pra agências que tenham os dois.

**Domínios:** `citrachat.com` (site comercial), `citrachat.com.br` (redirect), `citra.chat` (URL pública dos agentes — ex: `citra.chat/clinica-x`).

**Diferencial:** integração nativa de tracking. Cliente cola o ID do GTM/Pixel no painel e o chat dispara os 7 eventos padrão (chat_started, lead_qualified, cta_clicked, etc.) direto pra qualquer plataforma de mídia.

**Status:** 🟡 Em planejamento. MVP estimado em 8-10 semanas (dentro da Fase 6 do roadmap).

Briefing completo: [citrachat/CITRACHAT.md](citrachat/CITRACHAT.md)

---

## Filosofia de produto

1. **Construir usando** — cada produto é primeiro usado dentro da Make antes de virar SaaS comercial. Garante que resolve dor real.
2. **Modular** — cliente paga só pelo que usa. Estilo RD Station.
3. **Vendável separado, melhor em conjunto** — CitraDesk e CitraChat são produtos independentes, mas se conversam (lead capturado pelo CitraChat cai como lead no CRM do CitraDesk).
4. **Multi-moeda e multi-país** — Bruno opera de Portugal com clientes no Brasil. Todo produto Citra suporta BRL, USD, EUR desde o dia 1.
5. **AI nativo** — Claude/Gemini integrados pra análises e automações, não como gimmick.
6. **Identidade unificada** — paleta MakeLemonAd (#D6DE23) e tom consistente entre os produtos.

## Infraestrutura compartilhada

Os dois produtos rodam na **mesma infraestrutura técnica**, mas com marcas e domínios próprios:

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript + Vite + Tailwind |
| Backend | Firebase (Auth + Firestore + Storage + Functions) |
| AI | Claude API (principal), Gemini (legacy) |
| Billing | Stripe (USD/EUR) + Asaas (BRL/Pix/boleto) |
| Hosting | Cloudflare Pages ou Vercel (a definir) |
| Vector search | Firestore Vector Search nativo (RAG do CitraChat) |

**Project Firebase:** `gen-lang-client-0548502624` (Display Name: "CitraDesk").
**Repositório principal:** `AgenciaMake/citradesk`.

---

## Modelo de tenancy

Cada cliente (agência ou empresa) é um **tenant** isolado no banco. Estrutura:

```
tenants/{tenantId}/
├── _meta: { type: 'agency' | 'workspace', name, slug, plan, trialEnd }
├── modules: { gestao, financeiro, tarefas, crm, chat — cada um com active/plan }
├── (collections de cada módulo)
└── users[]
```

- **Tenant tipo `agency`** — entra pelo CitraDesk. Pode ter qualquer combinação de módulos.
- **Tenant tipo `workspace`** — entra pelo CitraChat. Só tem o módulo Chat ativo.
- Quem entra pelo CitraChat pode depois fazer "upgrade" pra plano de agência se quiser CitraDesk.

## Estrutura de pastas no workspace

```
produtos/
├── PRODUTOS.md          ← este arquivo (índice da linha SaaS)
├── citradesk/
│   ├── CITRADESK.md     ← briefing mestre
│   ├── codigo/          ← clone do repo AgenciaMake/citradesk
│   ├── briefings/       ← decisões de produto, arquitetura, roadmap
│   └── feedback/        ← feedback de uso interno
└── citrachat/
    ├── CITRACHAT.md     ← briefing mestre
    ├── codigo/          ← (a clonar quando o repo existir)
    ├── briefings/
    └── feedback/
```

## Quando trabalhar nesses produtos

Sempre que a sessão envolver código, feature, bug, roadmap, monetização ou estratégia de qualquer produto da linha Citra, **ler o briefing do produto correspondente antes de agir**.

Não confundir com:
- `make/` — operação interna da agência (redes sociais, processos, propostas)
- `clientes/` — trabalho pra clientes externos da agência
- `apps/` — apps web simples hospedados (ex: app de briefing), não são produtos comerciais
