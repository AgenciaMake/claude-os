---
name: Fluxo de redes sociais da Make em andamento
description: Estado atual do Instagram/LinkedIn/TikTok da MakeLemonAd — pautas de 13/07 paradas, post 3 nunca criado, nada publicado nem analisado ainda
type: project
originSessionId: c4f98cf2-7a75-4832-8297-3e2fe6852e87
modified: 2026-09-08T12:20:18.769Z
---
Estado do trabalho de redes sociais da MakeLemonAd verificado em **2026-09-08** (última atividade real no repo: 2026-07-17).

## Quando retomar

Quando Bruno disser "vamos continuar a falar do instagram da make" (ou similar), ler este arquivo + [MAKESOCIAL.md](../../../Desktop/CCode/ccos-make/make/social/MAKESOCIAL.md) + [identidade-visual.md](../../../Desktop/CCode/ccos-make/make/social/identidade-visual.md) pra retomar o contexto exato.

## Infraestrutura (pronta, testada, sem mudanças)

- **Publicação:** skill `publicar-instagram` em [.claude/skills/publicar-instagram/](../../../Desktop/CCode/ccos-make/.claude/skills/publicar-instagram/), método Post for Me Pro. `POSTFORME_API_KEY` + `POSTFORME_INSTAGRAM_ACCOUNT_ID` + `POSTFORME_LINKEDIN_ACCOUNT_ID` + `POSTFORME_TIKTOK_ACCOUNT_ID` no `.env`. TikTok sempre publica como draft (`--draft`) pra Bruno escolher música no app.
- **Guias:** [MAKESOCIAL.md](../../../Desktop/CCode/ccos-make/make/social/MAKESOCIAL.md) (briefing mestre) + [identidade-visual.md](../../../Desktop/CCode/ccos-make/make/social/identidade-visual.md) (grade, tipografia Rubik, templates).
- Ritmo alvo: 3 posts/semana (IG + LinkedIn + TikTok a partir da mesma peça).

## Última pauta aprovada — semana de 13/07/2026

Arquivo: [pautas/2026-07-13_semana.md](../../../Desktop/CCode/ccos-make/make/social/pautas/2026-07-13_semana.md). 3 posts aprovados por Bruno em 2026-07-13:

1. **"As 3 métricas que parecem boas mas te enganam"** (CTR, alcance, CPC) — pasta [posts/2026-07-13_metricas-enganosas/](../../../Desktop/CCode/ccos-make/make/social/posts/2026-07-13_metricas-enganosas/). **Completo**: 7 slides renderizados, caption pronta, teaser pronto. Nunca publicado (sem registro de link/publicação em nenhum arquivo).
2. **"Brasil é o 3º/4º país que mais usa Instagram"** — pasta [posts/2026-07-13_brasil-instagram/](../../../Desktop/CCode/ccos-make/make/social/posts/2026-07-13_brasil-instagram/). Tem duas versões: v1 (5 slides, config.json) e **v2 revisado** (7 slides incluindo "risco" e "ecossistema", config-v2.json, caption-v2.md, teaser). A v2 parece ser a versão final pretendida. Nunca publicado.
3. **"O anúncio brasileiro que mudou a publicidade digital"** — pasta `posts/2026-07-13_anuncio-icone/` **nunca foi criada**. Esse post não saiu do papel.

## Onde parou exatamente

Trabalho parou em 2026-07-17 (último commit auto-sync tocando `make/social`). Bruno fechou a aba da conversa sem finalizar: faltava decidir/publicar os posts 1 e 2 e criar o post 3 do zero. Pasta [metricas/](../../../Desktop/CCode/ccos-make/make/social/metricas/) está **vazia** — nenhum post chegou a ser publicado e analisado.

## Próximos passos possíveis (perguntar a Bruno o que priorizar)

1. Revisar e aprovar definitivamente os 2 posts prontos (metricas-enganosas e brasil-instagram v2).
2. Publicar via skill `publicar-instagram`.
3. Criar do zero o post 3 (anúncio icônico) — ou substituir por pauta mais atual, já que passaram quase 2 meses.
4. Depois de publicar, rodar análise de métricas (+2 dias) e começar a alimentar `metricas/`.
5. Considerar gerar pauta nova pra semana atual (13/07 já está bem datada).

## Métricas primárias

Compartilhamentos, comentários, salvamentos, seguidores. Secundárias: curtidas, alcance, impressões.
