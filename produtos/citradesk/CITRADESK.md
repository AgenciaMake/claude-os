# CitraDesk — Briefing Mestre

> **Ler esse arquivo no início de qualquer sessão que envolva o CitraDesk** (código, feature, bug, roadmap, monetização, estratégia).

## O que é

CitraDesk é um **sistema de gestão integrado pra agências de marketing digital**. Centraliza clientes recorrentes, projetos pontuais, colaboradores, freelancers, ferramentas SaaS, métricas financeiras, gestão de senhas e insights de AI num só lugar — substituindo a colcha de retalhos de planilhas, Trello, Notion, LastPass e ferramentas avulsas que a maioria das agências usa.

**Origem:** começou como `make-gestorpro` no Google AI Studio, criado pra resolver a dor de gestão da própria MakeLemonAd. A partir da v5.0.0 ganhou o rebrand pra **CitraDesk** (repo agora é `AgenciaMake/citradesk`), com plano de virar SaaS comercial modular.

**Versão atual:** v5.0.0 (CitraDesk Rebrand) — versão constante em [App.tsx:35](codigo/App.tsx#L35)
**Ambiente atual:** uso interno da MakeLemonAd, instância única do Firebase (projeto `gen-lang-client-0548502624`, banco `bdmakegestorpro`).
**Ambiente de desenvolvimento:** clone local em [codigo/](codigo/) (a partir desta sessão)

## Problema que resolve

Agências de marketing pequenas e médias geralmente têm:
- Clientes em planilha (sem histórico de preço, churn, LTV)
- Projetos no Trello/Asana (sem visão financeira)
- Custos de SaaS perdidos em emails e cartões
- Equipe e freelancers gerenciados em planilhas separadas
- Senhas em LastPass/Bitwarden ou pior, em arquivo de texto
- Zero visão consolidada de MRR, churn, LTV, custo por cliente

**CitraDesk junta tudo isso em um lugar com AI por cima pra dar leitura estratégica.**

## Público-alvo

**Inicial (uso interno):** MakeLemonAd
**SaaS — Tier 1:** Agências boutique de 3 a 15 pessoas, com operação digital (mídia paga, social, dev), gerenciando 5 a 50 clientes recorrentes.
**SaaS — Tier 2 (futuro):** Equipes internas de marketing em empresas, freelancers seniores que gerenciam carteira própria.

---

## Stack técnica

| Camada | Tecnologia | Versão | Observação |
|---|---|---|---|
| Frontend | React | 19.2.0 | Última versão estável |
| Linguagem | TypeScript | ~5.8.2 | |
| Build | Vite | ^6.2.0 | |
| UI | **Tailwind via CDN** | — | ⚠️ `cdn.tailwindcss.com` no [index.html:8](codigo/index.html#L8) — não usar em produção |
| Tipografia | Inter (Google Fonts) | — | |
| Ícones | lucide-react | ^0.554.0 | |
| Charts | recharts | ^3.5.0 | |
| Markdown | react-markdown | ^10.1.0 | |
| Backend | Firebase | ^12.6.0 | Auth + Firestore + Storage |
| AI | @google/genai | ^1.30.0 | Gemini com modelo `gemini-3-pro-preview` ⚠️ preview |
| Cotação | AwesomeAPI | — | `economia.awesomeapi.com.br` (USD-BRL, EUR-BRL) |

**Variáveis de ambiente:**
- `GEMINI_API_KEY` — usado em `.env.local` segundo [README.md:18](codigo/README.md#L18)
- ⚠️ Mas o código em [services/geminiService.ts:9](codigo/services/geminiService.ts#L9) lê `process.env.API_KEY` (inconsistência)
- Firebase config está **hardcoded** em [services/firebase.ts:8-15](codigo/services/firebase.ts#L8-L15) — chaves visíveis no GitHub público

**Firebase config atual:**
- Projeto: `gen-lang-client-0548502624`
- Banco Firestore: `bdmakegestorpro` (nome próprio, não default)
- Storage: `gen-lang-client-0548502624.firebasestorage.app`

---

## Módulos / Features (estado real)

### 1. Autenticação ([auth/LoginScreen.tsx](codigo/components/auth/LoginScreen.tsx))
- Login e cadastro com email + senha (Firebase Auth)
- Cadastro **aberto** (qualquer um pode criar conta) ⚠️ inadequado pra SaaS
- "God User Logic" em [App.tsx:83-100](codigo/App.tsx#L83-L100) — email `bruno@makelemonad.com.br` é forçado a virar owner ⚠️ hardcoded
- Primeiro usuário cadastrado vira owner automaticamente

### 2. Dashboard ([Dashboard.tsx](codigo/components/Dashboard.tsx) — 722 linhas)
KPIs principais:
- Faturamento total do mês (MRR + projetos pagos)
- Meta mensal editável inline
- Receita de projetos (cashflow do mês)
- Clientes ativos (com trend vs mês anterior)
- 3 cards de churn: mensal, anual, geral (com seletor de ano)

Gráficos:
- Evolução de faturamento (3M / 1Y / ALL) com forecast linear de 6 meses
- Projeção pra meta com gráfico Composed (Area + Line + ReferenceLine)
- Crescimento da base de clientes por mês com filtro de anos
- Performance anual (3 cards): Faturamento, Crescimento %, Ticket médio
- Receita de Projetos (Realizado vs A Receber) com seletor de ano
- **Radar de Reajustes** — clientes com aniversário nos próximos 60 dias

Conversão de moeda em tempo real via AwesomeAPI ([Dashboard.tsx:111-120](codigo/components/Dashboard.tsx#L111-L120)).

### 3. Gestão de Clientes ([ClientList.tsx](codigo/components/ClientList.tsx) + ClientModal)
- Cadastro completo: CNPJ/NIF, endereço, país, contatos múltiplos, logo
- **Histórico de preços** (price history): cada reajuste tem data, valor, moeda
- Reajustes podem ser % ou valor fixo
- Status: Ativo / Churn (computado também como "NOTICE" se está em aviso prévio — endDate futura)
- Contratos com PDF/URL, lista de serviços
- KPIs por serviço: top receita, maior churn
- **LTV calculado mês-a-mês** com price history real ([ClientList.tsx:370-406](codigo/components/ClientList.tsx#L370-L406))
- Tabela com sort por share/MRR/LTV
- Filtro padrão: ativos

### 4. Projetos ([Projects.tsx](codigo/components/Projects.tsx))
- Status: lead, ativo, concluído, cancelado
- Multi-moeda (BRL/USD/EUR)
- **Parcelas com data prevista vs data real de pagamento** (`paidDate`) — fundamental pro cashflow
- Geração automática de parcelas: à vista, 50/50, 2x, 3x, 4x, 5x
- Custos de equipe alocada por projeto
- KPIs: ativos, a receber bruto, custo equipe, recebível líquido
- Cards com indicador de prazo (atrasado, próximo entrega)

### 5. Colaboradores ([Collaborators.tsx](codigo/components/Collaborators.tsx))
- Equipe interna CLT ou PJ
- Histórico de reajustes de salário (% ou fixo)
- Histórico de bonificações
- Status ativo / desligado
- Dados completos: CPF, CNPJ, LinkedIn, endereço, telefone

### 6. Freelancer Space ([FreelancerSpace.tsx](codigo/components/FreelancerSpace.tsx))
- **Portal de freelancer com layout próprio** (não tem sidebar — é uma página dedicada)
- Login com role `freelancer` redireciona pra cá automaticamente
- Registro de horas: descrição, cliente (lista ou avulso), data, horas
- Hourly rate **mockado em R$ 70** ([FreelancerSpace.tsx:33](codigo/components/FreelancerSpace.tsx#L33)) ⚠️ deveria ser por usuário
- Status: aberto / parcial / pago
- Métricas: total recebido vs total pendente

### 7. Freelancers Manager ([admin/FreelancersManager.tsx](codigo/components/admin/FreelancersManager.tsx))
- Visão admin: lista todos freelancers (com badge de pendência)
- Mostra extrato individual de cada freelancer
- Toggle pago/aberto direto do extrato
- Marca `paymentDate` automaticamente

### 8. Estrutura Digital ([DigitalStructure.tsx](codigo/components/DigitalStructure.tsx) — 732 linhas)
Gestão de SaaS/ferramentas:
- Categorias: SaaS, Plugin, Software, Infra, Banco de Imagem, IA, Outro
- Ciclos: mensal, anual, lifetime
- Multi-moeda com cotação ao vivo
- **Forma de pagamento hardcoded** ([DigitalStructure.tsx:19-28](codigo/components/DigitalStructure.tsx#L19-L28)) — lista de cartões da Make, inclui nomes pessoais ("Cartão de Crédito Mari", "Cartão de Crédito Nubank Elaine") ⚠️ tem que virar configurável por agência
- Seats (licenças)
- Próxima cobrança calculada dinamicamente
- KPIs: despesa mês atual, próximo mês, total contratos anuais
- Gráfico horizontal de quantidade por categoria

### 9. Financeiro / Growth Simulator ([GrowthSimulator.tsx](codigo/components/GrowthSimulator.tsx))
- Chamado "Financeiro" no menu mas o componente é GrowthSimulator
- 3 sliders: ticket médio, novos clientes/mês, churn mensal %
- Gráfico anual: real (preto) + simulado (amarelo)
- Card flutuante de chat com Gemini contextualizado nos dados ([geminiService.ts:79-142](codigo/services/geminiService.ts#L79-L142))

### 10. AI Insights ([AIInsights.tsx](codigo/components/AIInsights.tsx))
- Análise via Gemini ([geminiService.ts:25-77](codigo/services/geminiService.ts#L25-L77))
- Prompt: "atue como CFO sênior", analisa MRR, gap pra meta, churn
- ⚠️ Header diz "**GestorPro** AI Analyst" — rebrand não foi pro componente

### 11. Gestão de Acessos
3 sub-módulos:
- **Emails da empresa** ([CompanyEmails.tsx](codigo/components/access/CompanyEmails.tsx)) — login, senha, 2FA, última atualização
- **Plataformas** ([PlatformsAccess.tsx](codigo/components/access/PlatformsAccess.tsx)) — credenciais de Meta Ads, Google Ads, etc.
- **Acessos de cliente** ([ClientAccess.tsx](codigo/components/access/ClientAccess.tsx)) — credenciais que o cliente forneceu pra agência operar
- ⚠️⚠️ **Senhas em texto puro no Firestore** — gravíssimo. Qualquer um com permissão de leitura no Firestore lê todas as senhas. Tem que migrar pra criptografia client-side (master key) ou serviço dedicado tipo 1Password/Bitwarden API.

### 12. Configurações & RBAC ([AgencySettings.tsx](codigo/components/AgencySettings.tsx) — 957 linhas, maior arquivo)
**Identidade da agência:**
- Nome, logo (upload pro Firebase Storage)
- Países de atuação (tags livres)
- Catálogo de serviços (tags livres)
- Meta de receita

**Roles (5):** owner, admin, editor, viewer, freelancer
**Permissões (4 flags granulares):**
- `canViewFinancial` — Dashboard, Projetos, Financeiro
- `canManageClients` — CRUD de clientes
- `canManageStructure` — CRUD de ferramentas + acessos
- `canManageUsers` — gestão de equipe

**Defaults por role:** definidos em [AgencySettings.tsx:29-34](codigo/components/AgencySettings.tsx#L29-L34)

**Convite de usuário:** cria conta secundária com `initializeApp` paralelo, cria UserCredential, salva no Firestore. Se email já existe, tenta login com a senha pra recuperar UID. ⚠️ Reset de senha de outros usuários requer Cloud Functions (não implementado, AgencySettings.tsx avisa o admin).

### 13. Profile do usuário ([user/UserProfileModal.tsx](codigo/components/user/UserProfileModal.tsx))
- Atualizar nome, foto
- Trocar própria senha (com reauth via senha atual)
- Upload pro Firebase Storage em `avatars/{uid}_{timestamp}_{name}`

---

## Modelo de dados (Firestore)

Todas as collections são **flat** (nível raiz, sem isolamento por tenant):

| Collection | Conteúdo | Tipo TS |
|---|---|---|
| `users` | Usuários do sistema | `AppUser` |
| `clients` | Clientes recorrentes | `Client` |
| `tools` | Ferramentas / SaaS | `DigitalTool` |
| `projects` | Projetos pontuais | `Project` |
| `collaborators` | Equipe interna | `Collaborator` |
| `freelancer_logs` | Horas de freelancer | `FreelancerLog` |
| `access_emails` | Emails corporativos | `AccessEmail` |
| `access_platforms` | Plataformas de mídia | `AccessPlatform` |
| `access_clients_credentials` | Credenciais de cliente | `ClientCredential` |
| `config` (doc `general`) | Config da agência | `AgencyConfig` |

Tipos definidos em [types.ts](codigo/types.ts).

**Storage paths:**
- `branding/logo_{timestamp}_{filename}` — logo da agência
- `avatars/{uid ou user_timestamp}_{filename}` — fotos de perfil

---

## Multi-tenancy e arquitetura SaaS

**Status atual:** ⚠️ **single-tenant duro**. Todos os dados em collections flat. Pra virar SaaS precisa:
- Refatorar pra `agencies/{agencyId}/clients/{...}`, `agencies/{agencyId}/tools/{...}`, etc.
- Adicionar `agencyId` em todo `users` doc
- Onboarding/signup que cria agência + primeiro owner
- Subdomínio ou path por agência (ex: `makelemonad.citradesk.com`)
- Limites por plano (cap de clientes, seats, projetos)
- Firestore Rules robustas (não existe `firestore.rules` no repo)
- Billing (Stripe ou Asaas pro BR)

---

## Monetização (rascunho — calibrar com Bruno)

Possíveis tiers:
- **Free** — até 3 clientes, 1 usuário, sem AI
- **Starter** — até 15 clientes, 3 usuários, AI básico
- **Pro** — clientes ilimitados, 10 usuários, AI completo, freelancers
- **Agency** — multi-marca, 25+ usuários, white-label, suporte prioritário

Preço-âncora a definir com base em concorrentes diretos (ContaAzul Agência, Operand, Studio, Bonsai) e indiretos (Trello + Asana + planilhas).

---

## ROADMAP — ver [briefings/01_diagnostico_e_roadmap.md](briefings/01_diagnostico_e_roadmap.md)

Diagnóstico técnico completo, gaps críticos pra virar SaaS e plano de ação faseado pra fechar o produto.

---

## Fluxo de trabalho com Claude

Quando trabalhar no código:
1. Ler esse briefing primeiro
2. Trabalhar em [codigo/](codigo/) (é o repo clonado, dá `git push` direto pro GitHub)
3. Antes de mudanças grandes, registrar a decisão em [briefings/](briefings/)
4. Feedback de uso da MakeLemonAd vai pra [feedback/](feedback/)

## Repositório

- **GitHub:** https://github.com/AgenciaMake/make-gestorpro (a renomear pra `citradesk` — instruções no diagnóstico)
- **Local:** [codigo/](codigo/)
- **Branch principal:** `main`
- **Deploy atual:** Google AI Studio — https://ai.studio/apps/drive/1p5CnPVAz2pZCQy3VD4BjfCSyYcjMKRsM (a aposentar)
