# TI2 — Tipográfico Repetitivo

Slide interno **100% tipográfico** com fundo preto, kicker pequeno no topo e **3 linhas em paralelismo retórico** — uma palavra-chave (ex: "Não é") repete em verde limão italic, criando ritmo visual e reforço por anáfora.

## Preview

![TI2](preview-ti2.png)

## Quando usar

- Posts com **lista de afirmações negativas ou positivas** que se beneficiam de repetição (ex: "Não é X, Não é Y, Não é Z" / "Foi assim, é assim, será assim")
- Quando o conteúdo carrega peso retórico e precisa de estrutura clara sem distração visual
- Slide de "limpeza" entre slides com imagem ou cores fortes — o preto puro funciona como pausa visual

## Spec visual

| Elemento | Valor |
|---|---|
| Fundo | `bg-black` |
| Numeração | top-left padrão (branco) |
| Kicker | Rubik Regular 36px, branco com opacity 0.55 |
| 3 linhas | Rubik Bold 80px, branco com a **palavra-chave repetida** em verde limão italic Bold (Black 800) |
| Espaçamento | 34px entre linhas |
| Faixa + seta | Padrão |

## Snippet

```json
{
  "filename": "slideXX-NOME.png",
  "bg": "black",
  "nextBg": "<cor do próximo>",
  "number": <N>,
  "content": "<div style='line-height:1.0;'><div style='font-size:36px;font-weight:400;color:var(--white);opacity:0.55;margin-bottom:38px;'>{{KICKER}}</div><div style='font-size:80px;font-weight:700;color:var(--white);line-height:1.05;'><span style='color:var(--lime);font-style:italic;font-weight:800;'>{{REPETIDO}}</span> {{LINHA_1}}</div><div style='font-size:80px;font-weight:700;color:var(--white);line-height:1.05;margin-top:34px;'><span style='color:var(--lime);font-style:italic;font-weight:800;'>{{REPETIDO}}</span> {{LINHA_2}}</div><div style='font-size:80px;font-weight:700;color:var(--white);line-height:1.05;margin-top:34px;'><span style='color:var(--lime);font-style:italic;font-weight:800;'>{{REPETIDO}}</span> {{LINHA_3}}</div></div>"
}
```

## Slots

- `{{KICKER}}` — abertura curta (ex: "Antes de culpar quem não deve:")
- `{{REPETIDO}}` — palavra-chave que repete nas 3 linhas (ex: "Não é", "Foi", "Será")
- `{{LINHA_1}}`, `{{LINHA_2}}`, `{{LINHA_3}}` — complementos de cada linha

## Regra de leitura

Anáfora visual: a palavra repetida em verde italic vira o "tic-tic-tic" do conteúdo, criando memorização. Funciona melhor com 3 elementos (regra dos 3 do storytelling).
