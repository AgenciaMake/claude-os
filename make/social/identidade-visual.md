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
┌──────────────────────────────────────────┐
│ #performance...   ≫  ⭕ LOGO            │ ← topo (margem 70px)
│                                          │
│                                          │
│           CONTEÚDO CENTRAL              │ ← miolo livre
│           (texto, mockup, etc)          │
│                                          │
│ @make.lemonad        Strategy + ...     │ ← rodapé (margem 70px)
└──────────────────────────────────────────┘
  ^                                    ^
  70px                               70px
```

### Grade e margens (canvas 1080x1350 — IG carrossel 4:5)

- **Margem em todos os lados:** 70px (topo, inferior, esquerda, direita)

### Área útil pro conteúdo central

- **Largura útil:** 940px (1080 − 70 esquerda − 70 direita)
- **Altura útil:** 1100px (1350 − 70 topo − 70 rodapé − espaço dos elementos fixos)

### Auto-fit (proteção automática contra overflow)

O script `compose-slides.js` mede o tamanho **natural** do conteúdo central e aplica `transform: scale` automaticamente se algum elemento ultrapassar a área útil.

Isso significa que pode-se especificar `font-size` agressivos no `config.json` sem se preocupar com overflow — o script reduz proporcionalmente até caber. Origem do scale: `left top`.

### Elementos fixos

**Canto superior esquerdo (top: 70px, left: 70px)**

*Nas capas* → label "Agência Boutique 360":
- Tamanho: **16px**, Rubik Light italic (300)
- Cor: currentColor (branco em fundos escuros, escuro em fundos claros)

*Nos slides internos* → numeração em caixa retangular:
- Ex: `[ 02 ]`, `[ 03 ]`
- Tamanho: **16px**, Rubik Regular italic (400)
- Border: 1.2px da cor do texto
- Padding: 4px 14px
- Override de cor via `numColor` no config (ex: `"numColor": "#000000"` pra fundos claros)

**Canto superior direito (top: 70px, right: 70px)**

*Nas capas* → Selo circular `MAKE LEMON AD` (90px). Só nas capas — slides internos não levam logo.
*Nos slides internos* → duplo chevron de continuidade (≫) indicando próximo slide.
- Cor automática: branco em fundos escuros, preto/cinza em fundos claros
- **Não aparece em posts de slide único** (`"noArrow": true` no config) nem no slide de CTA

**Versão do logo conforme fundo:**

| Fundo da capa | Versão do logo | Cor |
|---|---|---|
| Preto `#000000` | PNG oficial | Selo verde limão com texto preto cheio |
| Cinza escuro `#434244` | PNG oficial | Selo verde limão com texto preto cheio |
| **Verde limão `#D6DE23`** | **SVG vazado** | `fill: #000000` |
| **Cinza claro `#DEDEDE`** | **SVG vazado** | `fill: #434244` |
| Verde 02 `#00A652` | SVG vazado | `fill: #000000` |

No `config.json`: `"logoStyle": "png-oficial"` (default) ou `"logoStyle": "svg-#XXXXXX"`.

**Rodapé (bottom: 70px, left: 70px, right: 70px)**

Tamanho **16px**:

*Esquerda:* `@make.lemonad` — Rubik Medium italic (500)

*Direita:* slogan — Rubik Semibold italic (600)
- Padrão atual: `Menos Ruído. Mais Resultado.`
- Override via `footerSlogan` no config
- Override de cor via `footerColor` (ex: `"footerColor": "#000000"` em fundos claros)

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
- [ ] Margens 70px em todos os lados?
- [ ] Numeração no canto superior esquerdo nos slides internos?
- [ ] Label "Agência Boutique 360" ou selo circular na capa?
- [ ] `@make.lemonad` no rodapé?
- [ ] Slogan `Menos Ruído. Mais Resultado.` no rodapé direito?
- [ ] Duplo chevron (≫) nos slides internos de carrossel — **ausente em slide único** (`noArrow: true`)?
- [ ] Último slide segue o template de CTA?
- [ ] Legenda tem `#performanceestrategica360`, `#agenciaboutique360` e `#makelemonad`?
- [ ] Estilo visual bate com o pilar do post?
