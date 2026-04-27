# Produtos SaaS da MakeLemonAd

Esse é o braço de produtos da Make — software desenvolvido internamente pra resolver dores reais da operação da agência, com plano de evoluir até virar SaaS comercial.

## Linha "Citra"

O nome **Citra** vem de cítrico, na mesma família do limão da MakeLemonAd. Cada produto resolve uma dor da operação de uma agência ou equipe digital.

| Produto | O que faz | Stack | Status | Briefing |
|---|---|---|---|---|
| **CitraDesk** | Gestão completa de agência: clientes, projetos, colaboradores, freelancers, ferramentas SaaS, métricas e AI insights | React 19 + TS + Vite + Firebase + Gemini | Em uso interno (v5.0.0) | [citradesk/CITRADESK.md](citradesk/CITRADESK.md) |
| **CitraChat** | (a definir) | (a definir) | Em planejamento | [citrachat/CITRACHAT.md](citrachat/CITRACHAT.md) |

## Filosofia de produto

1. **Construir usando** — cada produto é primeiro usado dentro da Make antes de virar SaaS comercial. Garante que resolve dor real e que a gente entende o problema do cliente.
2. **Verticalização em agências/equipes digitais** — público-alvo inicial são agências de marketing, freelancers e equipes pequenas com operação digital.
3. **Multi-moeda e multi-país** — Bruno opera de Portugal com clientes no Brasil. Todo produto Citra deve suportar BRL, USD, EUR desde o dia 1.
4. **AI nativo** — Gemini/Claude integrado pra análises, automações e copilotos contextuais, não como gimmick.
5. **Identidade visual unificada** — paleta MakeLemonAd (#D6DE23 verde limão) e tom consistente entre os produtos da linha Citra.

## Estrutura de pastas

Cada produto vive em sua própria pasta dentro de `produtos/` com a estrutura:

```
produtos/{nome}/
├── {NOME}.md           ← briefing mestre (ler sempre antes de trabalhar no produto)
├── codigo/             ← clone do repo do GitHub (código real do produto)
├── briefings/          ← documentos de produto, decisões, especificações
└── feedback/           ← feedback de uso interno antes de virar SaaS
```

## Repositórios no GitHub

Os repos estão na organização **AgenciaMake** no GitHub.

- CitraDesk → `AgenciaMake/make-gestorpro` (nome legado, será renomeado pra `citradesk`)
- CitraChat → (a criar)

## Quando trabalhar nesses produtos

Sempre que a sessão envolver código, feature, bug, roadmap, monetização ou estratégia de qualquer produto da linha Citra, **ler o briefing do produto correspondente antes de agir** — é o documento de referência calibrado pelo Bruno.

Não confundir com:
- `make/` — operação interna da agência (redes sociais, processos, propostas)
- `clientes/` — trabalho pra clientes externos da agência
- `apps/` — apps web simples hospedados (ex: app de briefing), não são produtos comerciais
