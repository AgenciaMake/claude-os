# CitraDesk — Briefing Mestre

> **Ler esse arquivo no início de qualquer sessão que envolva o CitraDesk** (código, feature, bug, roadmap, monetização, estratégia).

## O que é

CitraDesk é um **sistema de gestão integrado pra agências de marketing digital**. Centraliza clientes, projetos, colaboradores, freelancers, ferramentas SaaS, métricas financeiras e insights de AI num só lugar — substituindo a colcha de retalhos de planilhas, Trello, Notion e ferramentas avulsas que a maioria das agências usa.

**Origem:** começou como `make-gestorpro` no Google AI Studio, criado pra resolver a dor de gestão da própria MakeLemonAd. A partir da v5.0.0 ganhou o rebrand pra **CitraDesk**, com plano de virar SaaS comercial.

**Versão atual:** v5.0.0 (CitraDesk Rebrand)
**Ambiente atual:** uso interno da MakeLemonAd, instância única com Firebase

## Problema que resolve

Agências de marketing pequenas e médias geralmente têm:
- Clientes em planilha (sem histórico de preço, churn, LTV)
- Projetos no Trello/Asana (sem visão financeira)
- Custos de SaaS perdidos em emails e cartões
- Equipe e freelancers gerenciados em planilha separada
- Senhas em LastPass/Bitwarden ou pior, em arquivo de texto
- Zero visão consolidada de MRR, churn, LTV, custo por cliente

**CitraDesk junta tudo isso em um lugar com AI por cima pra dar leitura estratégica.**

## Público-alvo

**Inicial (uso interno):** MakeLemonAd
**SaaS — Tier 1:** Agências boutique de 3 a 15 pessoas, com operação digital (mídia paga, social, dev), gerenciando 5 a 50 clientes recorrentes.
**SaaS — Tier 2 (futuro):** Equipes internas de marketing em empresas, freelancers seniores que gerenciam carteira própria.

## Módulos / Features

Tudo levantado a partir do código atual:

### 1. Dashboard ([Dashboard.tsx](codigo/components/Dashboard.tsx))
Visão consolidada do negócio:
- MRR total
- Clientes ativos
- Receita acumulada (lifetime)
- LTV médio
- Duração média ativa / churn
- Churn rate (lifetime e mensal recorrente últimos 6 meses)

### 2. Gestão de Clientes ([ClientList.tsx](codigo/components/ClientList.tsx), [ClientProfileView.tsx](codigo/components/ClientProfileView.tsx))
- Cadastro completo: CNPJ/NIF, endereço, país, contatos múltiplos
- Histórico de preços (com mudança de moeda e data de início)
- Contratos com PDF, lista de serviços, datas de início/fim
- Status Ativo / Churn
- Logo do cliente

### 3. Projetos ([Projects.tsx](codigo/components/Projects.tsx))
- Status: lead, ativo, concluído, cancelado
- Multi-moeda (BRL/USD/EUR)
- Parcelas com data prevista vs paga (cash flow real)
- Custos de equipe alocada (custo por pessoa, com pagamento separado)

### 4. Colaboradores ([Collaborators.tsx](codigo/components/Collaborators.tsx))
- Equipe interna CLT ou PJ
- Histórico de salários (reajustes percentuais ou fixos)
- Histórico de bonificações
- Status ativo / desligado
- Dados completos: CPF, CNPJ, LinkedIn, endereço

### 5. Freelancer Space ([FreelancerSpace.tsx](codigo/components/FreelancerSpace.tsx), [admin/FreelancersManager.tsx](codigo/components/admin/FreelancersManager.tsx))
- Portal de freelancer com login próprio
- Registro de horas (hourly rate, projeto/cliente, descrição)
- Status do pagamento: aberto, parcial, pago
- Admin gerencia todos freelancers e libera pagamentos

### 6. Estrutura Digital ([DigitalStructure.tsx](codigo/components/DigitalStructure.tsx))
Gestão de ferramentas/SaaS que a agência usa:
- Categorias: SaaS, Plugin, Software, Infra, Banco de Imagem, IA, Outro
- Ciclos: mensal, anual, lifetime
- Multi-moeda
- Fonte de pagamento (Banco Asaas, C6, Cartão Pessoal Bruno/Mari, Outro)
- Seats, status, próxima cobrança calculada

### 7. Growth Simulator ([GrowthSimulator.tsx](codigo/components/GrowthSimulator.tsx))
Simula cenários de crescimento e impacto financeiro.

### 8. AI Insights ([AIInsights.tsx](codigo/components/AIInsights.tsx))
Análise via Google Gemini ([geminiService.ts](codigo/services/geminiService.ts)) sobre os dados do negócio. Saída em markdown.

### 9. Gestão de Acessos ([components/access/](codigo/components/access/))
- **Emails da empresa** — login, senha, 2FA
- **Plataformas** — credenciais de ferramentas
- **Acessos de cliente** — credenciais que o cliente forneceu pra agência operar (Meta Ads, Google Ads, WordPress, etc.)

### 10. Configurações & RBAC ([AgencySettings.tsx](codigo/components/AgencySettings.tsx))
- Nome, logo, meta de receita
- Países de operação (multi-país)
- Serviços oferecidos
- **Roles:** owner, admin, editor, viewer, freelancer
- **Permissões granulares:** ver financeiro, gerenciar clientes, gerenciar estrutura, gerenciar usuários

## Stack técnica

| Camada | Tecnologia | Versão |
|---|---|---|
| Frontend | React | 19.2.0 |
| Linguagem | TypeScript | ~5.8.2 |
| Build | Vite | ^6.2.0 |
| UI | Tailwind (via index.html) + lucide-react | — |
| Charts | recharts | ^3.5.0 |
| Markdown | react-markdown | ^10.1.0 |
| Backend | Firebase (Auth + Firestore) | ^12.6.0 |
| AI | @google/genai (Gemini) | ^1.30.0 |

**Variáveis de ambiente:** `GEMINI_API_KEY` (em `.env.local`) — provavelmente também keys do Firebase, a verificar.

## Multi-tenancy e arquitetura SaaS

**Status atual:** instância única, Firebase com dados da MakeLemonAd. Pra virar SaaS, precisa:
- Isolar dados por agência (tenant) no Firestore (collection `agencies/{agencyId}/...`)
- Onboarding/signup de novas agências
- Billing (Stripe? Asaas?)
- Limites por plano (ex: nº de clientes, seats, projetos)
- Subdomínio ou path por agência (ex: `makelemonad.citradesk.com`)

## Monetização (rascunho — calibrar com Bruno)

Possíveis tiers:
- **Free** — até 3 clientes, 1 usuário, sem AI
- **Starter** — até 15 clientes, 3 usuários, AI básico
- **Pro** — clientes ilimitados, 10 usuários, AI completo, freelancers
- **Agency** — multi-marca, 25+ usuários, white-label, suporte prioritário

Preço-âncora a definir com base em: ContaAzul, Conta Simples, Trello+Asana+planilhas (custo da concorrência indireta).

## Status atual e próximos passos

**Em uso:** MakeLemonAd usa internamente.
**Próximas decisões:**
1. Renomear repo no GitHub: `make-gestorpro` → `citradesk`
2. Definir roadmap pra multi-tenancy
3. Decidir billing (provavelmente Stripe pra escala internacional)
4. Landing page comercial e captação de beta-users
5. Política de preços e tiers

## Fluxo de trabalho com Claude

Quando trabalhar no código:
1. Ler esse briefing primeiro
2. Trabalhar em `produtos/citradesk/codigo/` (é o repo clonado, dá push direto pro GitHub)
3. Antes de mudanças grandes, registrar a decisão em `produtos/citradesk/briefings/`
4. Feedback de uso da MakeLemonAd vai pra `produtos/citradesk/feedback/`

## Repositório

- **GitHub:** https://github.com/AgenciaMake/make-gestorpro (a renomear pra `citradesk`)
- **Local:** [codigo/](codigo/)
- **Branch principal:** `main`
- **Deploy atual:** Google AI Studio — https://ai.studio/apps/drive/1p5CnPVAz2pZCQy3VD4BjfCSyYcjMKRsM
