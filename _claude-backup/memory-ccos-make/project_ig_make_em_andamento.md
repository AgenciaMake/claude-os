---
name: Fluxo de redes sociais da Make em andamento
description: Estado atual do desenvolvimento do Instagram/LinkedIn/TikTok da MakeLemonAd — sistema de templates TV+TI consolidado, primeiro post quase pronto
type: project
originSessionId: b22e2e92-b566-4515-82a4-bce1814924d6
---
Estado do trabalho de redes sociais da MakeLemonAd em **2026-05-05**.

## Quando retomar

Quando Bruno disser "vamos continuar a falar do instagram da make" (ou similar — "redes da make", "postagens", "@make.lemonad", "vamos voltar pros posts"), ler este arquivo + [MAKESOCIAL.md](../../../Desktop/CCode/ccos-make/make/social/MAKESOCIAL.md) + [templates/README.md](../../../Desktop/CCode/ccos-make/make/social/templates/README.md) pra retomar o contexto exato.

## Sistema consolidado nesta fase

### Infraestrutura (toda pronta e testada)

- **Publicação:** skill `publicar-instagram` em [.claude/skills/publicar-instagram/](../../../Desktop/CCode/ccos-make/.claude/skills/publicar-instagram/). Script `publish-postforme.js` corrigido (URL `api.postforme.dev/v1`, auto-seleciona conta certa via env vars). Contas IG (@make.lemonad), LinkedIn (página MakeLemon/Ad) e TikTok (@MakeLemonAd) configuradas e testadas via dry-run.
- **Post for Me Pro:** `POSTFORME_API_KEY` + 3 account IDs no `.env`.
- **Geração de imagem:** Nano Banana (Gemini 2.5 Flash Image) testado e funcionando. `GEMINI_API_KEY` no `.env`. Billing ativado no projeto Google Cloud "MakeLemonAd AI".
- **Composição de slides:** Playwright + HTML/CSS em [scripts/](../../../Desktop/CCode/ccos-make/scripts/). Template em `templates/slide.html`, script `compose-slides.js`. Gera PNGs 1080x1350 com Rubik do Google Fonts.
- **Auto-fit refatorado:** preserva largura 100% (920px), reduz só o alto via scale quando o conteúdo passa de ~1140px. SAFE_AREA = `{ width: 920, height: 1140 }`.
- **Grade oficial implementada:** `padding: 50px 110px 50px 50px` no `.slide` — todos os elementos batem na grade documentada (50px topo/esq/baixo, 110px direita pra faixa lateral).
- **Suporte completo no script:** `coverImage` (TV4), `fullBleedImage`, `sideImage`, inline `<img>` (auto-converte pra base64), `logoStyle` (PNG oficial vs SVG vazado configurável), `hashtagColor`, `numColor`, `arrowColor`, `footerColor` — todos por config slide.

### Família de templates oficial em [make/social/templates/](../../../Desktop/CCode/ccos-make/make/social/templates/)

**4 capas (TV)** + **5 internos (TI)** + CTA padrão = **10 peças combináveis**.

**Capas:**
- TV1 — Bloco dividido (verde/preto)
- TV2 — Tudo preto (tipográfico com acento verde)
- TV3 — Bloco dividido invertido (preto/verde)
- TV4 — Imagem na capa (foto fotorrealista no topo + tipografia embaixo)

**Internos:**
- TI1 — Editorial com imagem (card retangular + texto editorial estilo @brandsdecoded_)
- TI2 — Tipográfico repetitivo (paralelismo "Não é X, Não é Y, Não é Z")
- TI3 — Dado numérico (número GIGANTE em verde 02 sobre cinza claro)
- TI4 — Lista numerada (01/02/03 em outline preto sobre verde limão)
- TI5 — Antes/Agora (2 colunas paralelas sobre cinza escuro)

Cada template tem `.md` com spec + snippet JSON + preview. README catálogo atualizado com regra de combinação ("não usar 2 TIs com mesmo fundo seguidos").

### Skill `direcao-arte-make`

Em [.claude/skills/direcao-arte-make/SKILL.md](../../../Desktop/CCode/ccos-make/.claude/skills/direcao-arte-make/SKILL.md). Decide template, hierarquia tipográfica, contraste e geração de imagem. **Pendente atualizar** com o catálogo TI completo e regras de seleção dos internos (foi criada antes da família TI estar consolidada).

### Guias de identidade (consolidados)

- [MAKESOCIAL.md](../../../Desktop/CCode/ccos-make/make/social/MAKESOCIAL.md) — briefing mestre
- [identidade-visual.md](../../../Desktop/CCode/ccos-make/make/social/identidade-visual.md) — grade, tipografia, anatomia do slide
- [marca/design-guide.md](../../../Desktop/CCode/ccos-make/marca/design-guide.md) — paleta oficial (7 hex)
- [marca/direcao-de-arte.md](../../../Desktop/CCode/ccos-make/marca/direcao-de-arte.md) — script de realismo brasileiro

## Primeiro post em desenvolvimento

**Pauta:** "Seu tráfego orgânico caiu. E a culpa não é sua."
**Tema:** zero-click search / tráfego orgânico caindo por causa de ChatGPT, Perplexity, Gemini, AI Overviews
**Pasta:** [make/social/posts/2026-04-23_trafego-organico/](../../../Desktop/CCode/ccos-make/make/social/posts/2026-04-23_trafego-organico/)
**Config:** [config.json](../../../Desktop/CCode/ccos-make/make/social/posts/2026-04-23_trafego-organico/config.json) com 7 slides definidos

### Slides do post

| Slide | Template | Status |
|---|---|---|
| 1 — Capa | **TV4** (cover-tv4.png — empresário pensativo home-office SP) | ✅ aprovado |
| 2 — Dado "15% e 64%" | TI3 | gerado, mas auto-fit pode estar deixando muito espaço inferior — talvez ajustar |
| 3 — "Não é..." | TI2 | gerado, parece OK |
| 4 — "É o usuário parando de clicar" | **TI1** (slide4-img.png — close cinematográfico do empresário) | ✅ aprovado pelo Bruno como modelo do TI1 |
| 5 — Antes/Agora | TI5 | gerado, "Ranquear em 1º =" quebra estranho |
| 6 — 3 ações | TI4 | gerado, parece OK |
| 7 — CTA | template fixo | ✅ ok |

### Arquivos da pasta (limpa e ordenada)

- `cover-tv4.png` — imagem da capa
- `slide4-img.png` — imagem do slide 4 (TI1)
- `slide01-capa-tv1/2/3/4.png` — variações de capa testadas (deletar se for confirmar TV4)
- `slide02-dado.png` ... `slide07-cta.png` — slides renderizados
- `config.json` — fonte de verdade

## Onde paramos exatamente (2026-05-05)

Última iteração: terminamos de **documentar a família TI completa** (TI1-TI5) e **limpamos arquivos órfãos** da pasta do post (`slide01-capa.png`, `slide4-phone.png` deletados; `slide4-fullbleed.png` renomeado pra `slide4-img.png` e config atualizado, slide 4 regerado funcionando).

## Próximos passos (em ordem)

1. **Atualizar a skill `direcao-arte-make`** com o catálogo TI completo e regras de seleção/combinação dos templates internos. A skill foi criada antes da família TI estar consolidada.
2. **Refinar slides 2, 5 e 6** se necessário — alguns podem ter espaço inferior vazio depois do refactor do auto-fit (o conteúdo é menor que o `SAFE_AREA.height = 1140`, então não escala mas fica com o resto da grade vazia).
3. **Decidir definitivamente qual TV usar** pra capa do post (atualmente está como TV4) e apagar os outros TV1/TV2/TV3 PNGs renderizados que ficaram na pasta.
4. **Aprovação final** dos 7 slides com Bruno.
5. **Escrever a legenda** do post (pra IG, LinkedIn e TikTok — LinkedIn pode ter copy ligeiramente ajustada pro tom profissional).
6. **Publicar** via skill `publicar-instagram` (`@make.lemonad` no IG, página `MakeLemon/Ad` no LinkedIn, `@MakeLemonAd` no TikTok).
7. **+2 dias após publicação** → análise de métricas juntos (compartilhamentos, comentários, salvamentos, seguidores como primárias).

## Feedbacks importantes do Bruno (já no SKILL.md / templates / memórias)

- Geração de imagem nunca contém texto (Claude compõe depois)
- Imagens fotorrealistas seguem [direcao-de-arte.md](../../../Desktop/CCode/ccos-make/marca/direcao-de-arte.md)
- Tipografia da Make não usa Rubik Black 900 — prefere Bold 700 e Medium 500
- Capas devem preencher bem o slide com tipografia grande + camadas (bold + italic + outline)
- Texto e imagem **obrigatoriamente** ocupam 100% da largura útil (920px) — auto-fit garante isso
- Faixa lateral + seta em **todos** os slides (exceto CTA), seta na cor do slide atual invadindo a faixa do próximo
- Logo só na capa (slides internos têm numeração `[N]` no topo esquerdo)
- Hashtag/numeração superior e rodapé em **16px** (mesma proporção pequena)
- Slide internos com imagem precisam ter composição **diferente da capa** (capa = horizontal split, interno = card editorial)
- Estética inspirada em @brandsdecoded_ pra editorial — texto grande, destaque colorido em palavras-chave
- Sempre respeitar **regra de ouro da grade** (50/110)

## Métricas primárias

Compartilhamentos, comentários, salvamentos, seguidores. Secundárias: curtidas, alcance, impressões.
