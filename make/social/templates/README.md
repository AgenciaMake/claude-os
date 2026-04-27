# Templates da MakeLemonAd

Templates aprovados pra carrosséis nas redes da Make. Divididos em duas famílias:

- **TV (Templates de Capa)** — slide 1 do carrossel
- **TI (Templates Internos)** — slides 2 a N (último slide é sempre o CTA padrão)

Cada arquivo `.md` tem o spec visual completo + snippet JSON pronto pra colar em `config.json`.

**Por que templates:** garante coerência visual entre posts e elimina decisão aleatória. Quando uma variação fica boa e é aprovada, vira template oficial. Toda peça da Make é montada combinando 1 TV + N TIs (alternados pra criar ritmo no swipe) + CTA.

---

## Capas (TV)

| Template | Estilo | Quando usar | Preview |
|---|---|---|---|
| [TV1](tv1-bloco-dividido.md) | Bloco dividido — verde limão em cima, preto embaixo | Provocação/hook em 3 partes (setup verde, sustentação outline, punchline preto) | [preview-tv1.png](preview-tv1.png) |
| [TV2](tv2-preto-puro.md) | Fundo preto puro, tipografia em 3 pesos com acento verde limão | Conceitos provocativos onde a tipografia carrega tudo | [preview-tv2.png](preview-tv2.png) |
| [TV3](tv3-bloco-dividido-invertido.md) | Bloco dividido invertido — preto em cima, verde limão embaixo | Tom mais "afirmação institucional" | [preview-tv3.png](preview-tv3.png) |
| [TV4](tv4-imagem-na-capa.md) | Imagem fotorrealista na metade superior + tipografia na metade inferior preta | Posts com narrativa humana, notícias, cenário real | [preview-tv4.png](preview-tv4.png) |

---

## Internos (TI)

| Template | Estilo | Quando usar | Preview |
|---|---|---|---|
| [TI1](ti1-editorial-com-imagem.md) | Editorial com imagem em card retangular sobre fundo preto | Slide narrativo com rosto/cena ilustrando o conteúdo | [preview-ti1.png](preview-ti1.png) |
| [TI2](ti2-tipografico-repetitivo.md) | Tipográfico puro com 3 linhas em paralelismo retórico ("Não é X, Não é Y, Não é Z") | Listas de afirmações com palavra-chave repetida | [preview-ti2.png](preview-ti2.png) |
| [TI3](ti3-dado-numerico.md) | Número GIGANTE em verde 02 sobre cinza claro | Slide de estatística forte (1 por carrossel) | [preview-ti3.png](preview-ti3.png) |
| [TI4](ti4-lista-numerada.md) | Lista 01/02/03 em outline preto sobre verde limão | 3 ações práticas, antes do CTA | [preview-ti4.png](preview-ti4.png) |
| [TI5](ti5-antes-agora.md) | 2 colunas paralelas sobre cinza escuro | Comparação antes/agora, contraste de paradigma | [preview-ti5.png](preview-ti5.png) |

---

## Como aplicar

1. **Escolher 1 TV** apropriado ao tom do post (ver tabela acima)
2. **Montar a sequência de TIs** — alternar fundos pra criar ritmo no swipe (não usar 2 TIs com mesmo fundo seguidos)
3. **Slide final é sempre o CTA padrão** (verde limão com 3 pílulas pretas)
4. **Copiar os snippets JSON** dos templates escolhidos pro `config.json` do post novo
5. **Trocar só os textos dos slots** — manter parâmetros visuais intactos
6. **Rodar:** `node scripts/compose-slides.js <caminho>/config.json`

## Regras de combinação (carrossel típico de 7 slides)

```
[1] TV  →  [2] TI3  →  [3] TI2  →  [4] TI1  →  [5] TI5  →  [6] TI4  →  [7] CTA
 capa     dado       repetir    imagem     contraste   ações      fechamento
 preto    cinza      preto      preto      cinza-esc   verde      verde
```

Alternância de fundos: preto → cinza claro → preto → preto → cinza escuro → verde → verde. Cada slide muda a cor base — feed alterna no swipe.

## Grade oficial (válida para todos os templates)

- **Margens:** 50px topo/esquerda/bottom, **110px à direita** (faixa lateral 40px + 70px de respiro)
- **Largura útil do conteúdo:** 920px (1080 − 50 − 110)
- **Auto-fit:** ativo no script — preserva 100% da largura, reduz só altura via scale quando o conteúdo passa de ~1140px
- **Tipografia:** Rubik (Light 300 / Regular 400 / Medium 500 / Bold 700 / Black 800). Nunca Black 900.
- **Faixa lateral + seta:** obrigatórias em todos os slides exceto CTA — ver [identidade-visual.md](../identidade-visual.md)
