---
name: Linha de produtos SaaS Citra
description: Make desenvolve produtos SaaS (CitraDesk, CitraChat) que vivem em produtos/, separados de make/ (operação) e clientes/ (externo)
type: project
originSessionId: af7fa1f9-0339-4470-81fe-029080b21e11
---
A Make tem uma linha de produtos SaaS chamada **Citra** (família cítrica do limão da MakeLemonAd). Ambos são produtos SaaS distintos que serão vendidos separadamente. CitraDesk está hoje em uso interno pela Make (fase 0), mas o modelo de negócio é multi-tenant SaaS. Estratégia: usar internamente primeiro, depois vender como SaaS.

**Produtos:**
- **CitraDesk** — sistema de gestão de agência (clientes, projetos, colaboradores, freelancers, ferramentas, AI insights). Stack React 19 + TS + Vite + Firebase + Gemini. v5.0.0 em uso interno. Repo: `AgenciaMake/make-gestorpro` (legado, será renomeado pra `citradesk`). Código clonado em `produtos/citradesk/codigo/`.
- **CitraChat** — produto de comunicação/atendimento. Em planejamento, ainda não tem código nem repo.

**Estrutura padrão por produto:**
```
produtos/{nome}/
├── {NOME}.md     ← briefing mestre (ler sempre)
├── codigo/       ← clone do repo do GitHub
├── briefings/    ← decisões de produto
└── feedback/     ← feedback de uso interno
```

**Why:** Bruno separa explicitamente operação da agência (`make/`), trabalho pra clientes (`clientes/`) e produtos comerciais (`produtos/`). Confundir as três bagunça o workspace.

**How to apply:** Sempre que a sessão envolver código, feature, bug, roadmap ou estratégia de CitraDesk ou CitraChat, ler o briefing do produto correspondente em `produtos/{nome}/{NOME}.md` antes de agir. Não usar skills de cliente nesses produtos. Manter padrão multi-moeda (BRL/USD/EUR), paleta MakeLemonAd (#D6DE23) e AI nativa.
