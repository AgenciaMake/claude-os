# CitraChat — Briefing Mestre

> **Ler esse arquivo no início de qualquer sessão que envolva o CitraChat** (código, feature, bug, roadmap, monetização, estratégia).
>
> Status: 🟡 Em planejamento. MVP planejado pra começar após CitraDesk virar SaaS multi-tenant (Fase 6 do roadmap geral).

## O que é

**CitraChat é uma plataforma SaaS de agentes conversacionais com IA**. Diferente de chatbots tradicionais baseados em árvores de decisão, os agentes do CitraChat **conversam de verdade**: entendem contexto, respondem perguntas, lidam com objeções e qualificam leads de forma humanizada.

O produto nasce dentro da MakeLemonAd como ferramenta interna pra clientes da agência e evolui pra um SaaS independente comercializado pra o mercado brasileiro e português.

> ⚠️ Nome anterior: **MakeChat AI**. Em qualquer documento ou referência antiga, "MakeChat" = "CitraChat".

## Posicionamento

**Produto irmão do CitraDesk** — vendável sozinho, mas **plugável** dentro da suíte CitraDesk pra agências que querem os dois.

| Cenário | Como funciona |
|---|---|
| Empresa quer só chat (clínica, e-commerce, escola) | Compra CitraChat avulso em `citrachat.com`. Workspace só com módulo Chat. |
| Agência só quer gestão | Usa CitraDesk em `citradesk.com/agencia`. Sem CitraChat. |
| Agência quer chat também | Adiciona CitraChat como módulo no CitraDesk. Lead capturado pelo chat cai automaticamente no CRM/Clientes do CitraDesk. |

## Proposta de Valor

- Agentes IA que conversam como humanos, não chatbots engessados.
- Setup em minutos: sobe documentos (PDFs), define a persona, publica.
- **Diferencial central:** integração completa de tracking (GTM, Google Ads, GA4, Meta Pixel, TikTok Pixel, LinkedIn).
- Interface estilo WhatsApp (familiar pro usuário final).
- White-label completo: logo, cores, avatar, domínio customizado.

## Domínios

| Domínio | Uso |
|---|---|
| `citrachat.com` | Site comercial (pricing, signup, login) |
| `citrachat.com.br` | Redirect 301 pro `.com` |
| `citra.chat` | URL pública dos agentes (ex: `citra.chat/clinica-x`) — domínio curto pra compartilhar |

---

## Stack técnica

**DECISÃO:** stack unificada com CitraDesk (Firebase). Doc original do produto sugeria Supabase, mas pra integração modular com o CitraDesk e billing único, fica em Firebase.

| Camada | Tecnologia | Notas |
|---|---|---|
| Frontend público (chat) | React + Vite + Tailwind | Componente standalone, embedável via iframe ou link direto |
| Frontend admin | React + Vite + Tailwind | Mesmo monorepo do CitraDesk; `citrachat.com` aponta pra mesma app, com layout e branding próprio |
| Backend | Firebase Cloud Functions | Endpoints HTTPS pra chat, embeddings, webhooks |
| Banco de dados | Firestore | Já em uso pelo CitraDesk |
| Auth | Firebase Auth | Mesma do CitraDesk |
| Storage (PDFs) | Firebase Storage | PDFs de treinamento dos agentes |
| **Vector search (RAG)** | **Firestore Vector Search** | Nativo do Firebase desde 2024, sem pgvector |
| IA Principal | **Claude API (Sonnet)** | Melhor custo/qualidade em PT-BR |
| IA Backup | OpenAI GPT-4o-mini | Fallback |
| Tracking | GTM, gtag.js, fbq, ttq, lintrk | Injeção dinâmica no chat público |
| Pagamentos | Stripe + Asaas | Compartilhado com CitraDesk |
| Analytics interno | PostHog (free tier) | Tracking de uso, funis, retenção |

## Modelo de dados (Firestore)

Como tenant do SaaS unificado:

```
tenants/{tenantId}/
├── _meta: { type: 'workspace' | 'agency', plan, ... }
├── modules: { chat: { active, plan, conversationsLimit, agentsLimit } }
└── chat_agents/
    └── {agentId}/
        ├── config: {
        │     name, persona, tone, objective, welcomeMessage,
        │     branding: { primaryColor, logo, avatar, faviconUrl },
        │     integrations: {
        │       gtm: { containerId },
        │       googleAds: { conversionId, conversionLabel },
        │       ga4: { measurementId },
        │       metaPixel: { pixelId },
        │       tiktokPixel: { pixelId },
        │       linkedinTag: { partnerId },
        │       webhook: { url }
        │     },
        │     leadScoringThreshold: 70,
        │     fallbackToHuman: { enabled, notifyEmails }
        │   }
        ├── knowledge/
        │   └── {docId}: { url, fileName, chunks[], embeddings[] (vector) }
        ├── conversations/
        │   └── {convId}: {
        │         startedAt, completedAt, status,
        │         leadData: { name, email, phone, score },
        │         messages[]: { role, content, timestamp }
        │       }
        └── analytics/
            └── events/{eventId}: { type, data, firedAt }  ← log dos 7 eventos
```

## Funcionalidades do MVP

### Interface do Chat (público)
- Visual estilo WhatsApp: bolhas, avatar, typing indicator
- Mobile-first
- Personalizável: cores, logo, avatar, nome, mensagem de boas-vindas
- Botão de ação no fim (CTA configurável)
- Coleta de dados (nome, email, telefone) integrada na conversa
- Modo embed (iframe/widget) e link direto (`citra.chat/{slug}`)

### Painel Admin (pro tenant)
- Dashboard de métricas: conversas, leads, taxa de conversão
- CRUD de agentes
- Editor de persona/prompt com templates por segmento
- Upload de PDFs de treinamento (com chunking e embedding automático)
- Customização visual em tempo real
- Histórico de conversas com busca/filtro
- Análise de cada conversa por IA (lead score, resumo, próximos passos)
- Código embed e link de compartilhamento
- Configuração de webhooks

### Sistema de Tracking (DIFERENCIAL CENTRAL)

**7 eventos padrão** disparados automaticamente:
| Evento | Quando dispara |
|---|---|
| `chat_started` | Primeira mensagem do usuário |
| `chat_engaged` | Usuário responde 3+ mensagens |
| `lead_captured` | Nome + email/telefone coletados |
| `lead_qualified` | Lead score atinge threshold configurado |
| `cta_clicked` | Usuário clica no botão de ação |
| `chat_completed` | Conversa finalizada pelo agente |
| `human_requested` | Usuário pede humano |

**Plataformas integradas** (admin cola IDs no painel):
- Google Tag Manager (recomendado pra agências)
- Google Ads (Conversion ID + Label)
- Google Analytics 4 (Measurement ID)
- Meta Pixel (Pixel ID)
- TikTok Pixel
- LinkedIn Insight Tag
- Pinterest Tag (opcional)
- Webhook customizado (POST JSON pra CRM/Zapier/Make.com)

**Modo GTM** (recomendado): chat dispara só pro `dataLayer`, GTM gerencia todos os pixels. Painel mostra:
- Lista de eventos com nomes copiáveis
- Tutorial passo-a-passo (screenshots)
- Templates GTM exportáveis (JSON pronto pra importar)
- Botão de teste que simula disparo
- Log dos últimos 7 dias de eventos disparados (sucesso/falha)

### Motor de IA
- System prompt dinâmico construído a partir das configurações
- RAG: consulta base de conhecimento antes de responder
- Memória da conversa (contexto durante toda interação)
- Detecção de intenção (quando lead está pronto pra converter)
- Lead scoring automático
- Fallback pra humano (quando agente não resolve)
- Multi-idioma: PT-BR padrão, PT-PT e ES como expansão

## Roadmap de desenvolvimento (estimativa solo com Claude Code)

**Pré-requisito:** CitraDesk em multi-tenant (Fase 1 do roadmap geral) deve estar pronto antes.

| Fase | Semanas | Entregas |
|---|---|---|
| **1. Fundação** | 1-2 | Estrutura do tenant tipo workspace; CRUD de agente; chat funcional com Claude |
| **2. Personalização** | 3-4 | Configurações do agente (persona, tom, objetivo); customização visual; embed/link público |
| **3. Inteligência** | 5-6 | Upload PDF + chunking; RAG com Firestore Vector Search; lead scoring; histórico com análise IA |
| **4. Conversão & Tracking** | 7-8 | Painel de integrações; 7 eventos; modo GTM; templates exportáveis; webhooks; dashboard de métricas |

Total: **8 semanas** pra MVP utilizável.

## Pricing (sugestão)

| Plano | Preço/mês | Conversas/mês | Agentes | Target |
|---|---|---|---|---|
| **Start** | R$ 297 | 100 | 1 | MEI / profissionais liberais |
| **Growth** | R$ 597 | 500 | 3 | PMEs |
| **Premium** | R$ 997 | 2.000 | 10 | Empresas médias |
| **Agência** (white-label) | R$ 1.997 | 5.000 | Ilimitados | Agências revendendo pros clientes |

**Margem estimada:**
- Custo médio IA por conversa: R$ 0,15-0,30 (Claude Sonnet)
- Cliente Start (100 conv): custo IA = R$ 15-30 | receita = R$ 297 | margem > 90%
- Cliente Growth (500 conv): custo IA = R$ 75-150 | receita = R$ 597 | margem > 75%
- 10 clientes Growth = R$ 5.970/mês receita | ~R$ 800 custo infra | ~R$ 5.000 lucro

## Custos de infra (estimativa MVP com 10 clientes)

| Item | Mensal | Anual |
|---|---|---|
| Firebase (Firestore + Auth + Storage + Functions) | R$ 100-200 | R$ 1.200-2.400 |
| API Claude (Sonnet) — ~10 clientes | R$ 300-600 | R$ 3.600-7.200 |
| Hosting (Cloudflare Pages ou Vercel) | R$ 0-100 | R$ 0-1.200 |
| Domínio | R$ 5/mês | R$ 60 |
| Stripe (2.9% + R$0.60 por trx) | variável | variável |
| **Total estimado** | **R$ 405-905** | **R$ 4.860-10.860** |

## Diferenciais competitivos

Por que o CitraChat se diferencia dos Typebots, ManyChats e similares:

1. **Conversação real com IA**, não árvore de decisão
2. **Treinamento por documentos** (sobe PDF, agente aprende)
3. **Integração completa de tracking** — GTM, Ads, GA4, Pixel, TikTok, LinkedIn no painel sem código
4. **7 eventos padronizados** que alimentam campanhas de paid media
5. **Templates GTM exportáveis** (JSON pronto)
6. **Lead scoring automático** com análise IA
7. **Feito por agência de performance** — entendemos conversão, não só tecnologia
8. **Foco BR/PT** — português nativo, pricing em real

## Integração com CitraDesk

Quando uma agência tem **CitraDesk + CitraChat**:

- **Lead capturado pelo chat** → cai automaticamente no módulo CRM do CitraDesk
- **Lead que converte** (cta_clicked + lead_qualified) → vira cliente no módulo Gestão
- **Conversas atreladas a clientes** → histórico de chat aparece no perfil do cliente
- **Métricas unificadas** → Dashboard do CitraDesk soma faturamento gerado por leads do CitraChat
- **Equipe compartilhada** → mesma conta de usuário, mesmas permissões

## Repositório

- **GitHub:** a criar (`AgenciaMake/citrachat` quando MVP começar)
- **Local:** `produtos/citrachat/codigo/` (a clonar futuramente)
- **Status:** ainda não há código

## Fluxo de trabalho com Claude

Quando o produto evoluir:
1. Ler esse briefing primeiro
2. Trabalhar em `produtos/citrachat/codigo/`
3. Decisões de produto importantes em `produtos/citrachat/briefings/`
4. Feedback de uso interno em `produtos/citrachat/feedback/`
