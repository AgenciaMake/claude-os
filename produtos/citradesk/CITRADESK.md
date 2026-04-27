# CitraDesk — Briefing Mestre

> **Ler esse arquivo no início de qualquer sessão que envolva o CitraDesk** (código, feature, bug, roadmap, monetização, estratégia).

## O que é

**CitraDesk é uma suíte SaaS modular pra gestão de agências de marketing digital.** Cada agência cliente contrata os módulos que usa — modelo estilo RD Station onde você paga por produto.

A suíte centraliza clientes recorrentes, projetos pontuais, equipe, freelancers, ferramentas SaaS, métricas financeiras, gestão de senhas, tarefas e (futuramente) CRM. O CitraChat (produto irmão) pode ser plugado como módulo pra agências que também querem chat IA.

**Origem:** começou como `make-gestorpro` no Google AI Studio, criado pra resolver a dor de gestão da própria MakeLemonAd. A partir da v5.0.0 ganhou o rebrand pra **CitraDesk** (repo agora é `AgenciaMake/citradesk`), com plano de virar SaaS comercial modular.

**Versão atual:** v5.1.0 — em uso interno da MakeLemonAd, instância única do Firebase. Multi-tenancy planejado pra Fase 1 do roadmap.

**Make é a primeira agência cliente** — quando o multi-tenant for implementado, os dados atuais migram pra `tenants/makelemonad/...`.

## Posicionamento

**Suíte modular vendida em `citradesk.com`.** Cada agência tem sua URL: `citradesk.com/{slug}` (ex: `citradesk.com/makelemonad`).

| Módulo | Status atual | Preço sugerido |
|---|---|---|
| **Gestão** (core) | ✅ Implementado | R$ 149/mês |
| **Financeiro** | ✅ Implementado | R$ 199/mês |
| **AI Insights** (addon) | ✅ Implementado | R$ 79/mês |
| **Tarefas** (Kanban + automações) | 🟡 Roadmap | R$ 99/mês |
| **CRM** (pipeline + propostas) | 🟡 Roadmap | R$ 149/mês |
| **Chat** (CitraChat plugado) | 🟡 Produto irmão | preço do CitraChat |
| **Suite Completa** | combo | R$ 599/mês (com 30% desc) |

> Preços indicativos pra discussão. Calibrar antes do lançamento comercial.

## Domínios

| Domínio | Uso |
|---|---|
| `citradesk.com` | App principal e site comercial |
| `citradesk.com.br` | Redirect 301 |
| `citradesk.io` | Staging/dev |

## Problema que resolve

Agências de marketing pequenas/médias geralmente têm:
- Clientes em planilha (sem histórico de preço, churn, LTV)
- Projetos no Trello/Asana (sem visão financeira)
- Custos de SaaS perdidos em emails e cartões
- Equipe e freelancers em planilhas separadas
- Senhas em LastPass/Bitwarden ou pior, em arquivo de texto
- Zero visão consolidada de MRR, churn, LTV, custo por cliente

**CitraDesk junta tudo num lugar com AI por cima pra leitura estratégica.**

## Público-alvo

**Inicial (uso interno):** MakeLemonAd
**Tier 1 SaaS:** Agências boutique de 3-15 pessoas, gerenciando 5-50 clientes recorrentes
**Tier 2 (futuro):** Equipes internas de marketing em empresas; freelancers seniores com carteira própria

---

## Stack técnica

| Camada | Tecnologia | Versão | Observação |
|---|---|---|---|
| Frontend | React | 19.2.0 | |
| Linguagem | TypeScript | ~5.8.2 | |
| Build | Vite | ^6.2.0 | |
| UI | Tailwind (instalado) + lucide-react | 3.4.17 | Sem CDN |
| Charts | recharts | ^3.5.0 | |
| Markdown | react-markdown | ^10.1.0 | |
| Backend | Firebase | ^12.6.0 | Auth + Firestore + Storage + (Functions futuro) |
| AI | @google/genai (Gemini) | ^1.30.0 | Modelo: `gemini-2.5-pro` |
| Cotação | AwesomeAPI | — | USD-BRL, EUR-BRL |

**Firebase:** projeto `gen-lang-client-0548502624` (Display Name: "CitraDesk").
**Banco Firestore:** `bdmakegestorpro` em `nam5` (US). 🚨 Idealmente migrar pra `southamerica-east1` antes do SaaS lançar.
**Storage Rules + Firestore Rules:** deployadas (v1, focadas em RBAC do tenant único atual).

**Variáveis de ambiente** (em `.env.local`, não commitado):
- `VITE_FIREBASE_*` — config do Firebase
- `VITE_GEMINI_API_KEY` — Gemini (TODO: migrar pra Cloud Function antes do SaaS público)

---

## Módulos / Features (estado real do código)

### MÓDULO GESTÃO (core — implementado)

#### 1. Autenticação ([auth/LoginScreen.tsx](codigo/components/auth/LoginScreen.tsx))
- Login email + senha (Firebase Auth)
- Cadastro fechado (acesso só por convite via Configurações > Equipe)
- Bootstrap do owner: documentado no README, criação manual no Firebase Console (primeira vez)

#### 2. Gestão de Clientes ([ClientList.tsx](codigo/components/ClientList.tsx) + ClientModal)
- Cadastro completo: CNPJ/NIF, endereço, país (com bandeirinha), contatos múltiplos, logo
- Histórico de preços (price history) com data, valor, moeda
- Reajustes em % ou valor fixo
- Status: Ativo / Churn / NOTICE (em aviso prévio)
- Contratos com PDF/URL, lista de serviços
- KPIs por serviço: top receita, maior churn
- LTV calculado mês-a-mês com price history real

#### 3. Estrutura Digital ([DigitalStructure.tsx](codigo/components/DigitalStructure.tsx))
Gestão de SaaS/ferramentas da agência:
- Categorias: SaaS, Plugin, Software, Infra, Banco de Imagem, IA, Outro
- Ciclos: mensal, anual, lifetime
- Multi-moeda com cotação ao vivo (AwesomeAPI)
- Métodos de pagamento configuráveis (em Configurações > Empresa)
- Seats, próxima cobrança calculada
- KPIs: despesa mês atual, próximo mês, total contratos anuais

#### 4. Gestão de Acessos
3 sub-módulos:
- **Emails da empresa** ([CompanyEmails.tsx](codigo/components/access/CompanyEmails.tsx))
- **Plataformas** ([PlatformsAccess.tsx](codigo/components/access/PlatformsAccess.tsx)) — Meta Ads, Google Ads, etc.
- **Acessos de cliente** ([ClientAccess.tsx](codigo/components/access/ClientAccess.tsx))
- ⚠️⚠️ **Senhas em texto puro no Firestore** — TODO crítico antes de SaaS público: criptografar client-side

#### 5. Configurações & RBAC ([AgencySettings.tsx](codigo/components/AgencySettings.tsx))
- Identidade da agência: nome, logo (upload pro Firebase Storage), países, serviços, métodos de pagamento
- Meta de receita
- **Roles atuais (5):** owner, admin, editor (Colaborador), viewer (Visualizador), freelancer
- **Permissões (4 flags hoje, vão virar 20 granulares na Fase 1):**
  - `canViewFinancial`, `canManageClients`, `canManageStructure`, `canManageUsers`
- Convite de membro com criação de auth secundária
- Hourly rate por usuário (relevante pra freelancer)

### MÓDULO FINANCEIRO (implementado)

#### 6. Dashboard ([Dashboard.tsx](codigo/components/Dashboard.tsx))
KPIs principais: faturamento total, meta mensal, receita de projetos, clientes ativos. 3 cards de churn (mensal/anual/geral).
Gráficos: evolução com forecast linear, projeção pra meta, crescimento da base, performance anual (faturamento + crescimento % + ticket médio), receita de projetos (realizado vs previsto), radar de reajustes (clientes com aniversário próximo).

#### 7. Projetos ([Projects.tsx](codigo/components/Projects.tsx))
- Status: lead, ativo, concluído, cancelado
- Multi-moeda (BRL/USD/EUR)
- Parcelas com data prevista vs paga (cashflow real)
- Geração automática: à vista, 50/50, 2x-5x
- Custos de equipe alocada
- KPIs: ativos, a receber bruto, custo equipe, recebível líquido

#### 8. Colaboradores ([Collaborators.tsx](codigo/components/Collaborators.tsx))
- CLT ou PJ
- Histórico de reajustes de salário (% ou fixo)
- Histórico de bonificações
- Status ativo / desligado
- Dados completos: CPF, CNPJ, LinkedIn, endereço

#### 9. Freelancer Space ([FreelancerSpace.tsx](codigo/components/FreelancerSpace.tsx))
Portal próprio com layout dedicado (login com role `freelancer` redireciona pra cá):
- Registro de horas: descrição, cliente, data, horas
- Hourly rate vem do perfil do user (configurável em Configurações > Equipe)
- Status: aberto / parcial / pago
- Métricas: total recebido vs pendente

#### 10. Freelancers Manager ([admin/FreelancersManager.tsx](codigo/components/admin/FreelancersManager.tsx))
Visão admin: lista todos freelancers com pendência. Toggle pago/aberto.

### MÓDULO AI INSIGHTS (implementado)

#### 11. Growth Simulator ([GrowthSimulator.tsx](codigo/components/GrowthSimulator.tsx))
Sliders: ticket médio, novos clientes/mês, churn mensal. Gráfico anual real (preto) + simulado (amarelo). Chat com Gemini contextualizado nos dados.

#### 12. AI Insights ([AIInsights.tsx](codigo/components/AIInsights.tsx))
Análise via Gemini com prompt "atue como CFO sênior" — gap pra meta, churn, sugestões de aceleração.

### MÓDULO TAREFAS (planejado)

Kanban estilo Trello:
- Boards (geral + por cliente + por área + pessoais)
- Listas customizáveis
- Cards com responsável, prazo, anexos, comentários
- Drag-and-drop
- Notificações por email quando @user é mencionado
- Filtros por responsável, cliente, prazo
- (Fase 2) Automações tipo Butler — quando card move pra X, fazer Y

Stack: o que você usa é Trello hoje, com boards por cliente, por área, e pessoais com colunas-cliente.

### MÓDULO CRM (planejado)

Pipeline de leads (~RD Station simplificado):
- Estágios: Lead → Qualificado → Proposta → Fechado/Perdido
- Cards com nome, contato, origem, valor estimado, notas
- Tarefas atreladas (integra com módulo Tarefas)
- Conversão automática: lead que fecha vira cliente no módulo Gestão
- Captação de lead via formulário público (link curto)
- (Futuro) Integração com CitraChat pra leads do chat caírem aqui

> Bruno hoje usa RD Station — futuro CRM do CitraDesk vai espelhar a dinâmica.

### MÓDULO CHAT (CitraChat plugado — produto irmão)

Quando agência tem o CitraChat ativo, o módulo aparece no menu do CitraDesk e:
- Leads capturados pelo chat caem direto no CRM
- Conversas linkam ao perfil do cliente
- Dashboard do Financeiro soma receita gerada por leads de chat

Briefing detalhado em [../citrachat/CITRACHAT.md](../citrachat/CITRACHAT.md).

---

## Modelo de dados (atual e futuro)

### Atual (single-tenant — banco da Make)

Collections flat na raiz:
| Collection | Tipo |
|---|---|
| `users` | `AppUser` |
| `clients` | `Client` |
| `tools` | `DigitalTool` |
| `projects` | `Project` |
| `collaborators` | `Collaborator` |
| `freelancer_logs` | `FreelancerLog` |
| `access_emails` | `AccessEmail` |
| `access_platforms` | `AccessPlatform` |
| `access_clients_credentials` | `ClientCredential` |
| `config` (doc `general`) | `AgencyConfig` |

### Futuro (multi-tenant — Fase 1)

```
tenants/{tenantId}/
├── _meta: { type: 'agency' | 'workspace', name, slug, plan, trialEnd }
├── modules: {
│     gestao: { active, plan }
│     financeiro: { active, plan }
│     tarefas: { active, plan }
│     crm: { active, plan }
│     chat: { active, plan }
│   }
├── clients/
├── tools/
├── projects/
├── collaborators/
├── freelancer_logs/
├── access_emails/
├── access_platforms/
├── access_clients_credentials/
├── tasks/         (módulo Tarefas)
├── leads/         (módulo CRM)
├── proposals/     (módulo CRM)
├── chat_agents/   (módulo Chat)
└── config/

users/{uid}: { ..., tenantId, role, permissions: { 20 flags } }
```

---

## Roadmap (visão de SaaS)

| Fase | Semanas | Resultado |
|---|---|---|
| **0. Higienização** | 3-5 dias | ✅ Concluída — env vars, rules, rebrand, Tailwind, toasts, modais |
| **0.5. Migrar banco pro BR** | 1 dia | Latência caindo de 150ms pra 30ms |
| **1. Multi-tenant + Permissões granulares** | 4-6 | `tenants/{id}/...`, 20 flags, migração da Make |
| **2. Sistema de Módulos + Onboarding** | 3-4 | Cada agência ativa módulos. Signup público com trial 14d. |
| **3. Billing (Stripe + Asaas)** | 3-4 | Cobra. Plano Free Forever pra dar a alguém manualmente. |
| **4. Painel super-admin** | 1-2 | Bruno vê todas agências, MRR, churn. |
| **5. Landing comercial em citradesk.com** | 1-2 | Pitch + preços + signup. |
| **6. Módulo Tarefas (Kanban)** | 6-8 | Vendável como módulo novo. |
| **7. Módulo CRM** | 4-6 | Vendável como módulo novo. |
| **8. CitraChat (produto irmão)** | 8-10 | Lançamento em citrachat.com, plugável no CitraDesk. |

**Total até primeira venda real:** ~14 semanas (Gestão + Financeiro vendáveis, MVP Suite).
**Total tudo lançado:** ~36 semanas (~9 meses).

---

## Fluxo de trabalho com Claude

Quando trabalhar no código:
1. Ler esse briefing primeiro
2. Trabalhar em [codigo/](codigo/) (clone do `AgenciaMake/citradesk` no GitHub)
3. Antes de mudanças grandes, registrar a decisão em [briefings/](briefings/)
4. Feedback de uso da MakeLemonAd vai pra [feedback/](feedback/)

## Repositório

- **GitHub:** https://github.com/AgenciaMake/citradesk
- **Local:** [codigo/](codigo/)
- **Branch principal:** `main`
- **Deploy:** ainda manual; CI/CD vem na Fase 5
