# Identidade Visual — CitraChat Social

Guia de estilo dos slides para Instagram e LinkedIn do CitraChat.

---

## Paleta

| Nome | Hex | Uso |
|---|---|---|
| Lime elétrico | `#DFFF00` | Destaque principal, números, palavras-chave |
| Preto profundo | `#09090b` | Fundo primário |
| Zinc-900 | `#18181b` | Fundo secundário (alternativo ao preto) |
| Zinc-700 | `#3f3f46` | Cards, bordas internas |
| Zinc-500 | `#71717a` | Texto muted, rodapés secundários |
| Branco | `#FFFFFF` | Texto principal sobre fundos escuros |

> A cor lime do CitraChat (`#DFFF00`) é propositalmente mais elétrica que a da Make (`#D6DE23`). Remete ao produto — digital, neon, tech.

---

## Tipografia

- **Família:** Rubik (mesma base do sistema Make)
- **Pesos usados:** 400 (regular), 500 (medium), 700 (bold), 800 (extrabold)
- **Estilo:** itálico em títulos grandes e hooks (personalidade)

---

## Grid e margens

- **Canvas feed:** 1080 × 1350 px
- **Canvas story:** 1080 × 1920 px
- **Margem (todos os lados):** 70 px
- **Área útil feed:** 940 × 1100 px
- **Área útil story:** 940 × 1480 px

---

## Fundos disponíveis (classes CSS no renderer)

| Classe | Hex | Quando usar |
|---|---|---|
| `bg-black` | `#09090b` | Fundo padrão — dark do produto |
| `bg-dark-gray` | `#3f3f46` | Variação escura — zinc-700 |
| `bg-lime` | `#DFFF00` | Destaque forte, slides de impacto |
| `bg-white` | `#FFFFFF` | Contraste, slides de alívio |
| `bg-light-gray` | `#DEDEDE` | Fundos neutros |

> Configurar `#DFFF00` como variável lime no template de slide ao criar o primeiro post CitraChat (o renderer da Make usa `#D6DE23`; criar config separado ou override inline).

---

## Elementos fixos dos slides

### Numeração (slides internos)
- Canto superior esquerdo
- Borda fina, itálico, tamanho 16px
- Cor: `#DFFF00` nos fundos escuros, `#09090b` nos fundos claros

### Rodapé
- Handle: `@citrachat`
- Slogan sugerido: *"Agentes que convertem."*
- Posição: 70px do fundo

### Logo
- Usar `produtos/citrachat/logo/logo_citrachat.png`
- Aparece no canto superior direito nos slides de capa

---

## Estilos de slide (3 modos)

### Modo Dark (padrão)
`bg-black` + texto branco + destaque `#DFFF00`
→ Usado em conteúdo técnico, educação, dados.

### Modo Lime
`bg-lime` + texto `#09090b`
→ Usado em hooks fortes, afirmações de impacto.

### Modo Contraste
`bg-white` + texto `#09090b` + acento `#DFFF00`
→ Usado pra quebrar ritmo visual, slides de respiro.

---

## CTA final

Fundo: `bg-black` com `isCta: true`
Ações sugeridas:
- "Entra na lista de espera" (pré-lançamento)
- "Salva esse post"
- "Comenta aqui embaixo"
- "Segue pra ver o produto sendo construído"
