# Identidade Visual — Redes Sociais da MakeLemonAd

Guia visual específico das redes sociais da Make (Instagram + LinkedIn + TikTok). Complementa o [marca/design-guide.md](../../marca/design-guide.md), que é o guia global da marca.

Ler esse arquivo antes de criar qualquer peça pras redes da Make.

---

## 1. Paleta

Paleta oficial da MakeLemonAd (fonte de verdade: [marca/design-guide.md](../../marca/design-guide.md)).

| Cor | Hex | Uso nas redes |
|---|---|---|
| **Verde limão Make** | `#D6DE23` | Cor principal. Fundos de impacto, CTAs, selo/logo, assinatura. |
| **Verde 02** | `#00A652` | Fundos cheios alternativos, contraste com verde limão. |
| **Verde escuro** | `#006838` | Camadas, profundidade, detalhes internos. |
| **Preto de fundo** | `#000000` | Fundo preto das capas e peças de impacto. |
| **Preto texto** | `#434244` | Tipografia sobre fundo claro (não usar preto puro no texto). |
| **Branco 100%** | `#FFFFFF` | Tipografia sobre fundo escuro. |
| **Branco bg** | `#DEDEDE` | Fundo claro alternativo (suaviza o contraste vs. branco puro). |

Regra: **preto + verde limão é o par institucional**. Todo post tem pelo menos um dos dois como base.

---

## 2. Tipografia

**Família oficial: [Rubik](https://fonts.google.com/specimen/Rubik)**

Funciona em Figma, Google Slides, CapCut, Canva e todos os editores. Disponível de graça no Google Fonts.

### Pesos usados
| Peso | Uso |
|---|---|
| Rubik Regular (400) | Corpo de texto |
| Rubik Medium (500) | Destaques dentro do corpo, subtítulos |
| Rubik Bold (700) | Títulos principais, hooks |
| Rubik Black (900) | Títulos de impacto máximo em caixa alta |
| Rubik Italic (400 / 500 / 700) | Palavras-chave, ênfase, slogans |

### Regras de uso
- **Caixa alta + Bold/Black** = hook ou headline que precisa parar o scroll
- **Itálico** = palavra-chave que carrega o conceito (ex: _TRANSFORMA_, _Conexão que Gera Conversão_)
- **Outline (vazada)** = efeito de profundidade, camada extra de texto sobre outra tipografia
- **Regular** = corpo, explicação, contexto
- **Nunca misturar** Rubik com outras famílias na mesma peça

---

## 3. Anatomia do slide (layout padrão)

Todo slide respeita essa grade. Elementos posicionados sempre nos mesmos cantos.

```
┌─────────────────────────────────────┐
│ #performance...          ⭕ LOGO   ┃ ← topo (margem 50px)
│                                    ┃
│                                    ┃
│        CONTEÚDO CENTRAL            ┃ ← miolo livre
│        (texto, mockup, etc)        ┃   (faixa lateral
│                                    ┃    direita = cor
│                                 ▶  ┃    do próximo slide)
│                                    ┃
│ @make.lemonad  Strategy + ...      ┃ ← rodapé (margem 50px)
└─────────────────────────────────────┘
  ^                             ^   ^
  50px                       110px  faixa 40px
```

### Grade e margens (canvas 1080x1350 — IG carrossel 4:5)

- **Margem superior:** 50px (topo do logo, topo da hashtag/numeração)
- **Margem inferior:** 50px (linha de base do rodapé)
- **Margem esquerda:** 50px (alinha hashtag, numeração e `@make.lemonad`)
- **Margem direita:** 110px (alinha logo e fim do slogan — recuo da faixa lateral)
- **Faixa lateral direita:** 40px de largura, do topo ao bottom

### Área útil pro conteúdo central

- **Largura útil:** 920px (1080 − 50 esquerda − 110 direita)
- **Altura útil aproximada:** 1000px (entre topo do logo/hashtag e topo do rodapé)

### Auto-fit (proteção automática contra overflow)

O script `compose-slides.js` mede o tamanho **natural** do conteúdo central (clonando num test zone sem constraint de largura) e aplica `transform: scale` automaticamente se algum elemento ultrapassar 920×1000px.

Isso significa que pode-se especificar `font-size` agressivos no `config.json` sem se preocupar com palavras estourando margem — o script reduz proporcionalmente até caber. Origem do scale: `left top` (mantém alinhamento à grade).

### Elementos fixos

**Canto superior esquerdo (top: 50px, left: 50px)**

*Nas capas* → hashtag `#performanceestratégica360`:
- Tamanho: **16px** (mesmo do rodapé)
- `#performance` → Rubik **Light italic (300)**
- `estratégica` → Rubik **Medium italic (500)**
- `360` → Rubik **Light italic (300)**

*Nos slides internos* → numeração em caixa retangular:
- Ex: `[ 02 ]`, `[ 03 ]`
- Tamanho: **16px**, Rubik Regular italic (400)
- Border: 1.2px da cor do texto
- Padding: 4px 14px

**Canto superior direito (top: 50px, right: 110px) — SÓ NAS CAPAS**

Selo circular `MAKE LEMON AD`:
- Diâmetro: **90px**
- A borda direita do logo alinha exatamente com o fim do texto do rodapé (`Conversão` / `forever`)
- O logo só aparece na **capa**. Slides internos não levam logo.

**Versão a usar conforme o fundo do slide:**

| Fundo da capa | Versão do logo | Cor |
|---|---|---|
| Preto `#000000` | PNG oficial | Selo verde limão com texto preto cheio |
| Cinza escuro `#434244` | PNG oficial | Selo verde limão com texto preto cheio |
| **Verde limão `#D6DE23`** | **SVG vazado** | `fill: #000000` (círculo preto, texto vazado mostra verde limão atrás) |
| **Cinza claro `#DEDEDE`** | **SVG vazado** | `fill: #434244` (círculo cinza escuro, mesmo tom da tipografia) |
| Verde 02 `#00A652` | SVG vazado | `fill: #000000` |

**Regra de leitura:** quando o fundo é claro (verde limão, cinza claro), o logo PNG oficial fica camuflado porque o círculo verde se mistura com o fundo. Por isso usar o SVG vazado com a mesma cor da tipografia principal — fica discreto e harmônico, sem competir com o título.

**Como o script aplica:** no `config.json` de cada slide, definir `"logoStyle": "png-oficial"` (default) ou `"svg-#XXXXXX"` (com hex desejado pro fill).

**Rodapé (bottom: 50px, left: 50px, right: 110px)**

Tamanho **16px**, todos os elementos:

*Esquerda:* `@make.lemonad`
- Rubik **Medium italic (500)**

*Direita:* `Strategy + Branding + Performance = <slogan>`
- Prefixo "Strategy + Branding + Performance =" em Rubik **Regular (400)**, não-italic
- Slogan final em Rubik **Semibold italic (600)**
- Variantes do slogan em uso:
  - `Conexão que Gera Conversão` (padrão atual)
  - `Growth and scale forever` (alternativa histórica)

**Faixa lateral direita (cor = próximo slide)**
- Largura: **40px**, do topo ao bottom
- Cor: igual ao fundo do slide seguinte — cria continuidade visual no feed

**Seta de transição (cor = slide atual)**
- Triângulo apontando pra direita, posicionado na linha `bottom: 180px`
- Sai do slide atual invadindo a faixa lateral
- Cor preenchida = cor do fundo do slide atual (contrasta com a faixa)
- Proporção: 58px de largura × 84px de altura
- Não aparece no slide de CTA final

---

## 4. Os 3 estilos visuais × pilares de conteúdo

Dentro do mesmo sistema, temos 3 linguagens visuais. A escolha vem do **pilar do post** — isso dá variação sem perder coerência.

### Estilo A — Ilustrativo 3D
**Uso:** pilar **Updates da Make** e **Apresentação da agência** (serviços, cases, time)

- Fundo: verde limão `#D6DE23` cheio
- Elementos 3D renderizados (megafone, laptop, ícones, objetos contextuais)
- Tipografia: Rubik Bold + ênfases em itálico
- Tom: institucional, explicativo, "showroom"
- **Geração de imagem:** este estilo **não** aplica o script de realismo — é caricato/ilustrativo propositalmente. Gerar com prompt tipo "3D product render, clean studio lighting, floating object, no text".

### Estilo B — Tipográfico puro
**Uso:** pilar **Provocações, hooks e curiosidades**

- Fundo: preto cheio ou dividido
- Zero elementos gráficos — a tipografia É o design
- Explora Rubik Black em caixa alta + itálico pra palavras-chave + outline pra camadas
- Tom: conceitual, punchy, filosófico

### Estilo C — Bloco dividido
**Uso:** pilar **Conteúdo técnico estratégico** (Google Ads, Meta Ads, performance, funis)

- Fundo em duas metades: verde limão + preto (horizontal ou vertical)
- Tipografia grande com contraste cross-fundo (palavra atravessa as duas cores)
- Rubik Black caixa alta + outline
- Tom: didático/ensaio técnico, comunica "dois mundos que se conectam"

### Quando misturar
- Capa pode usar um estilo, slides internos outro
- Respeitar: CTA final sempre fechado no **template padrão** (próxima seção)

### Imagens fotorrealistas (pessoas, cenas, ambientes)

Quando um post precisar de **foto real** — alguém mexendo no celular, um escritório vivido, uma cena de rua em SP — **aplicar integralmente** o script de [marca/direcao-de-arte.md](../../marca/direcao-de-arte.md): realismo absoluto, contexto brasileiro, São Paulo como referência, imperfeições naturais, comportamento humano real.

**Regra simples:**
- Pediu mockup 3D / objeto ilustrado → Estilo A (não aplica realismo)
- Pediu foto / cena / pessoa → aplica `direcao-de-arte.md`

---

## 5. Template do slide CTA final (fixo)

**Sempre o último slide do carrossel.** Não criar variações — é o fechamento reconhecível da Make.

**Layout:**
- Fundo: verde limão `#C8D82D` cheio
- Título superior em itálico + bold caixa alta (ex: `SE ESSE POST FEZ SENTIDO PRA VOCÊ...`)
- 3 pílulas pretas empilhadas com texto branco:
  - `❤ DÁ UM LIKE`
  - `✈ COMPARTILHA COM QUEM PRECISA SABER DISSO!`
  - `🔖 SALVA PRA NÃO PERDER`
- Logo `MAKE LEMON AD` circular preta centralizada no inferior

**Regra do CTA:** a ordem de importância das ações é **compartilhar > comentar > salvar > seguir > curtir** (alinhado às métricas primárias do [MAKESOCIAL.md](MAKESOCIAL.md)). Se quiser variar a copy do CTA, manter as 3 ações principais — pode trocar verbos, mas não mexer no visual.

---

## 6. Estrutura de um carrossel típico

| Slide | Função | Estilo recomendado |
|---|---|---|
| 1 | **Capa** — hook forte, pergunta ou provocação | B ou C |
| 2 | Contextualização / problema | Mesmo da capa |
| 3–7 | Desenvolvimento, explicação, exemplos | Consistente, pode variar leve |
| 8 (último) | **CTA padrão fixo** | Template seção 5 |

Min 5 slides, max 10 (limite do Instagram).

---

## 7. Assets disponíveis

### [identidade-visual/logos/](identidade-visual/logos/)

Selo circular `MAKE LEMON AD` em tipografia rústica/stamp (não é Rubik — é a fonte identitária do logo). Hoje existem dois arquivos com propósitos diferentes:

| Arquivo | Característica | Quando usar |
|---|---|---|
| [logo_make_oficial.png](identidade-visual/logos/logo_make_oficial.png) | **Preenchido.** Texto `MAKE LEMON AD` em preto sólido sobre círculo verde limão — igual ao logo do site. | **Comunicação oficial/institucional** — capas de carrossel, apresentações, rodapés, cases, anúncios. Quando o logo precisa aparecer exatamente como a marca se apresenta publicamente. |
| [logo_make.svg](identidade-visual/logos/logo_make.svg) | **Vazado.** Só o círculo verde é preenchido — o nome é espaço negativo (transparente), deixando o fundo atrás aparecer. Cor do círculo editável via `fill` no SVG. | **Arte customizada** — quando quer trocar cor (preto, branco, verde escuro), integrar o logo a um background colorido, sobrepor a fotos, ou criar variações pro post. |

**Como mudar a cor do SVG:** editar a classe `.st0` no topo do arquivo (`fill: #d6de23` → trocar pro hex desejado). Ou aplicar via CSS/Figma.

**A medida que novas variações forem criadas** (ex: logo só texto, logo sem círculo, versão horizontal), adicionar aqui e atualizar a tabela acima com o nome do arquivo + quando usar.

### [identidade-visual/mockups/](identidade-visual/mockups/)
Elementos 3D reutilizáveis (megafone, laptop, saco de moedas, palitos de fósforo, etc.) pra uso no **Estilo A**. PNGs com fundo transparente.

### [identidade-visual/texturas/](identidade-visual/texturas/)
Backgrounds, padrões, grains, texturas do verde limão sobre preto, etc.

### [referencias/](referencias/)
Posts anteriores como referência estética. Usar pra calibrar o padrão antes de criar novo conteúdo.

---

## 8. Checklist antes de publicar uma peça

- [ ] Usa Rubik?
- [ ] Paleta respeitada (preto + verde limão como base)?
- [ ] Numeração do slide no canto superior esquerdo nos slides internos?
- [ ] Hashtag `#performanceestratégica360` ou selo circular na capa?
- [ ] `@make.lemonad` no rodapé?
- [ ] Assinatura `Strategy + Branding + Performance = ...` no rodapé direito?
- [ ] Seta "próximo slide" nos slides internos (não no último)?
- [ ] Último slide segue o template de CTA?
- [ ] Estilo visual bate com o pilar do post?
