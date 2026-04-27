# TI5 — Comparação Antes/Agora

Slide interno em **2 colunas paralelas** sobre fundo cinza escuro `#434244`. Cada coluna tem um cabeçalho em verde limão italic (`ANTES` / `AGORA`) e descrição com a palavra-chave em destaque verde. A divisão vertical clara comunica contraste/transformação.

## Preview

![TI5](preview-ti5.png)

## Quando usar

- Slide de **contraste temporal ou conceitual** ("antes/agora", "errado/certo", "ontem/hoje")
- Quando você precisa mostrar uma mudança de paradigma de forma visual e direta
- Limite: **1 TI5 por carrossel** (a estrutura é forte, repetir cansa)

## Spec visual

| Elemento | Valor |
|---|---|
| Fundo | `bg-dark-gray` (`#434244`) |
| Numeração | top-left padrão (branco) |
| Kicker | Rubik Medium 34px, branco opacity 0.6, margin-bottom 50px |
| **Layout** | `display: grid; grid-template-columns: 1fr 1fr; gap: 60px;` — duas colunas iguais |
| Cabeçalho de cada coluna | Rubik Bold italic 40px verde limão caixa alta, letter-spacing 1px, margin-bottom 20px |
| Descrição superior | Rubik Medium 50px branco line-height 1.1 |
| Descrição inferior (palavra-chave) | Rubik Bold italic 60px (verde limão na coluna "agora", branco na coluna "antes") line-height 1.05 |
| Border lateral | `border-left: 3px solid var(--lime); padding-left: 34px` em cada coluna |
| Faixa + seta | Padrão |

## Snippet

```json
{
  "filename": "slideXX-NOME.png",
  "bg": "dark-gray",
  "nextBg": "<cor do próximo>",
  "number": <N>,
  "content": "<div style='line-height:1.0;'><div style='font-size:34px;font-weight:500;color:var(--white);opacity:0.6;margin-bottom:50px;'>{{KICKER}}</div><div style='display:grid;grid-template-columns:1fr 1fr;gap:60px;'><div style='border-left:3px solid var(--lime);padding-left:34px;'><div style='font-size:40px;font-weight:700;font-style:italic;color:var(--lime);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;'>{{COL_1_HEADER}}</div><div style='font-size:50px;font-weight:500;color:var(--white);line-height:1.1;'>{{COL_1_TOP}}</div><div style='font-size:60px;font-weight:700;color:var(--white);font-style:italic;line-height:1.05;margin-top:8px;'>{{COL_1_BOTTOM}}</div></div><div style='border-left:3px solid var(--lime);padding-left:34px;'><div style='font-size:40px;font-weight:700;font-style:italic;color:var(--lime);letter-spacing:1px;text-transform:uppercase;margin-bottom:20px;'>{{COL_2_HEADER}}</div><div style='font-size:50px;font-weight:500;color:var(--white);line-height:1.1;'>{{COL_2_TOP}}</div><div style='font-size:60px;font-weight:700;color:var(--lime);font-style:italic;line-height:1.05;margin-top:8px;'>{{COL_2_BOTTOM}}</div></div></div></div>"
}
```

## Slots

- `{{KICKER}}` — abertura ("A mudança de jogo:")
- `{{COL_1_HEADER}}` / `{{COL_2_HEADER}}` — cabeçalhos (ex: "ANTES", "AGORA")
- `{{COL_N_TOP}}` — frase neutra topo da coluna
- `{{COL_N_BOTTOM}}` — palavra-chave/conclusão da coluna (verde na coluna 2 destaca a conclusão "atual")

## Regra de leitura

Olho varre da esquerda pra direita, lê os 2 cabeçalhos primeiro (ANTES → AGORA), depois mergulha no conteúdo de cada coluna. O verde limão no `COL_2_BOTTOM` é a "resposta" — onde o leitor é deixado.
