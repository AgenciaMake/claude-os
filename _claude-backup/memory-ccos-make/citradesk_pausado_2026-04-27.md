---
name: CitraDesk — onde paramos (pausado em 2026-04-27)
description: Estado completo do CitraDesk quando Bruno pausou pra focar no CitraChat. Como retomar.
type: project
originSessionId: af7fa1f9-0339-4470-81fe-029080b21e11
---
CitraDesk pausado em **2026-04-27** pra Bruno focar em CitraChat (ciclo de venda mais curto). Retomar quando CitraChat tiver MVP no ar ou Bruno pedir.

## ✅ O QUE FOI FEITO

### Fase 0 — Higienização (concluída)
- Firebase config movida pra `.env.local` (não commitado)
- Gemini API key padronizada (`VITE_GEMINI_API_KEY`)
- Modelo Gemini estável (`gemini-2.5-pro`)
- "God User" hardcoded removido
- Cadastro aberto fechado (acesso só por convite)
- Hourly rate de freelancer agora por usuário
- Lista de cartões/métodos de pagamento configurável (Configurações > Empresa)
- Tailwind instalado localmente (sem CDN)
- `importmap` do AI Studio removido
- Logo do Imgur trocada por asset local
- Rebrand 100% (GestorPro → CitraDesk)
- Firestore + Storage Rules deployadas
- Bug fix: bootstrap de auth (não deixa user em estado limbo)
- Permissão do Colaborador corrigida (não vê dashboard financeiro)
- Auto-update de permissions ao mudar role
- Labels amigáveis nos badges (Colaborador, Visualizador, etc.)
- 30 alerts nativos substituídos por toast elegante
- Modais fecham clicando fora (exceto confirmação delete)
- Repo renomeado: `make-gestorpro` → `citradesk` no GitHub (`AgenciaMake/citradesk`)
- Projeto Firebase renomeado pra "CitraDesk" (ID interno fixo: `gen-lang-client-0548502624`)
- README com setup completo

### Fase 1.1 — Tipos novos (concluída)
- `UserPermissions` agora tem 20 flags granulares (`dashboard.view`, `clients.edit`, `clients.view`, etc.)
- `LegacyUserPermissions` mantém os 4 flags antigos pra compat
- Função `expandPermissions()` converte legado → novo automaticamente
- Função `can(user, perm)` é o helper único — owner/admin sempre passam
- Tipos `Tenant`, `TenantType`, `TenantModules`, `TenantModuleConfig` definidos em [types.ts](produtos/citradesk/codigo/types.ts)
- Defaults `DEFAULT_AGENCY_MODULES` e `DEFAULT_WORKSPACE_MODULES` definidos

### Fase 1.4 — UI de permissões (concluída)
- AgencySettings mostra 11 módulos com toggles Ver / Editar lado a lado
- Coerência automática: ligar Edit liga View; desligar View desliga Edit
- DEFAULT_PERMISSIONS por role atualizado pros 20 flags

### Fase 1.5 — Sidebar + App.tsx (concluída)
- Todas checagens viraram `can(appUser, 'flag')`
- Admin pode entrar em Configurações também (não só owner)

### Build status: VERDE (validado em 2026-04-27)

## ⏳ O QUE FALTA DA FASE 1 (multi-tenancy)

### 1.2 — Refatorar `services/storage.ts`
- Mudar TODAS as collections de `clients` → `tenants/{tenantId}/clients` (e idem pras outras 9 collections)
- Passar `tenantId` em todo CRUD
- Hoje em [services/storage.ts](produtos/citradesk/codigo/services/storage.ts) tudo é flat: `collection(db, 'clients')` etc.

### 1.3 — Bootstrap de tenant no App.tsx
- Quando user loga, ler `tenantId` do doc dele em `users/{uid}` (já tem campo opcional em `AppUser`)
- Carregar `tenants/{tenantId}` doc pra pegar `modules` ativos
- Criar contexto React `useTenant()` pra componentes acessarem
- Renderizar módulos só se `tenant.modules[X].active === true`

### 1.6 — Firestore Rules multi-tenant
- Reescrever [firestore.rules](produtos/citradesk/codigo/firestore.rules) pra validar `tenantId`
- Toda regra de `match /tenants/{tenantId}/clients/{id}` precisa checar `request.auth.uid` em users + `tenantId` igual
- Manter regra atual como referência

### 1.7 — Script de migração da Make
- Criar script Node em [scripts/migrate-to-multitenant.mjs](produtos/citradesk/codigo/scripts/) (pasta a criar)
- Cria `tenants/makelemonad` com:
  - `_meta: { type: 'agency', name: 'MakeLemonAd', slug: 'makelemonad', ownerUid: <uid do Bruno>, ... }`
  - `modules: DEFAULT_AGENCY_MODULES` (Gestão + Financeiro + AI Insights ativos)
- Copia tudo de `clients/`, `tools/`, `projects/`, `collaborators/`, `freelancer_logs/`, `access_*` pra `tenants/makelemonad/<col>/`
- Atualiza todos os 8 users com `tenantId: 'makelemonad'`
- IMPORTANTE: rodar primeiro com `--dry-run`, validar, depois rodar pra valer
- Bruno aprova antes de rodar

### 1.8 — Cloud Function pro Gemini
- Tirar a chave Gemini do client (hoje em `import.meta.env.VITE_GEMINI_API_KEY`)
- Criar `functions/` no repo, deploy via `firebase deploy --only functions`
- Função `analyzeBusinessData` recebe dados, chama Gemini, retorna texto
- Atualizar `services/geminiService.ts` pra chamar a function HTTPS em vez do SDK direto

### 1.9 — Testes E2E
- Testar com 2-3 users de roles diferentes que cada um vê só o que deveria
- Confirmar que rules bloqueiam acesso cross-tenant (criar tenant fake e tentar ler dados da Make)

## ⏭ FASES 2 EM DIANTE (após Fase 1)

- **Fase 2 (3-4 sem):** Sistema de Módulos + Onboarding (signup público, trial 14d)
- **Fase 3 (3-4 sem):** Billing (Stripe + Asaas)
- **Fase 4 (1-2 sem):** Painel super-admin (Bruno vê todas agências)
- **Fase 5 (1-2 sem):** Landing comercial em `citradesk.com`
- **Fase 7 (6-8 sem):** Módulo Tarefas (Kanban)
- **Fase 8 (4-6 sem):** Módulo CRM

## 🛠 CONTEXTO TÉCNICO PRA RETOMAR

- **Repo:** `AgenciaMake/citradesk` no GitHub
- **Local:** `produtos/citradesk/codigo/`
- **Firebase project:** `gen-lang-client-0548502624` (display name "CitraDesk")
- **Banco Firestore atual:** `bdmakegestorpro` em `nam5` (US). Decisão de NÃO migrar pra SP por enquanto.
- **8 users no Firebase Auth:** Bruno, Mari, Amanda, Stéphanie, Lucas, Jorge, Jose (teste), + 1
- **Versão atual:** v5.1.0
- **Stack:** React 19 + Vite + Tailwind + Firebase. Build OK validado.
- **Documentos referência:**
  - [produtos/citradesk/CITRADESK.md](produtos/citradesk/CITRADESK.md) — briefing completo
  - [produtos/citradesk/briefings/01_diagnostico_e_roadmap.md](produtos/citradesk/briefings/01_diagnostico_e_roadmap.md) — diagnóstico técnico
  - [produtos/citradesk/briefings/02_arquitetura_saas.md](produtos/citradesk/briefings/02_arquitetura_saas.md) — desenho técnico do SaaS multi-tenant

## ⚠️ ARMADILHAS / OBSERVAÇÕES

1. **Auto-sync** está rodando — qualquer mudança no repo `AgenciaMake/citradesk` é commitada e pushada automaticamente. Pra Fase 1.7 (migração de banco), garantir que o script só roda manualmente.

2. **Senhas em texto puro no Firestore** (módulos `access_emails`, `access_platforms`, `access_clients_credentials`) — TODO crítico antes de ter outras agências usando o sistema. Plano: criptografar client-side com master password do user.

3. **Gemini API key** ainda no client (TODO 1.8). Não é gritante porque uso é interno hoje, mas obrigatório antes de SaaS público.

4. **2 bancos Firestore** existem: `bdmakegestorpro` (em uso, US) e `makegestorprodb` (vazio, SP). Quando construir CitraChat, o banco do Chat pode ir num terceiro banco em região mais central.

## 🚀 COMO RETOMAR

Quando Bruno disser "voltar pro CitraDesk":

1. Reler este memory + os 3 docs em `produtos/citradesk/`
2. Confirmar que app continua funcionando (build verde, login OK)
3. Validar que ainda concorda com modelo SaaS modular descrito em `02_arquitetura_saas.md`
4. Começar Fase 1.2 — `storage.ts` é o ponto de entrada pra refatoração multi-tenant

**Why:** CitraChat tem ciclo de venda mais curto e maior potencial de receita imediata. CitraDesk fica em uso interno da Make funcionando bem e retoma quando der.

**How to apply:** ao retomar, NÃO começar do zero. Continuar exatamente da Fase 1.2 conforme descrito acima.
