# TV3 — Bloco Dividido Invertido (preto em cima / verde embaixo)

Versão espelhada do TV1: 50% preto em cima, 50% verde limão embaixo. Tipografia segue mesma estrutura mas com cores invertidas. Tom geral fica mais "afirmação institucional" — começa sério no preto e desce na cor da marca.

## Preview

![TV3](preview-tv3.png)

## Quando usar

- Quando o setup é mais "sério/grave" e a punchline aterriza na marca
- Posts em que a parte preta carrega o peso conceitual e o verde limão fecha com identidade
- Variação visual num feed que já tem TV1 — mantém a linguagem mas evita repetição

## Spec visual

| Elemento | Valor |
|---|---|
| **Background** | `split-hv-inv` (linear-gradient preto 50% top + verde limão 50% bottom) |
| **Logo** | PNG oficial (selo verde com texto preto cheio) — sobre preto fica destacado |
| **Hashtag** | Cor `#FFFFFF` (branco), 16px Light italic + Medium italic em "estratégica" |
| **Tipografia** | 3 linhas em Rubik italic caixa alta:<br>1. Setup: Bold 700, cor branco sobre preto<br>2. Outline: stroke 3px branco, transparente, cruzando divisão<br>3. Punchline: Bold 800, cor preto `#000000` sobre o verde |
| **Subtítulo** | Rubik 42px Medium 500, cor `#434244` (preto texto) com destaque em preto puro italic — sobre o verde |
| **Seta** | Cor `#D6DE23` (verde limão — slide atual no ponto da seta) invadindo a faixa lateral do próximo slide |
| **Rodapé** | Cor `#000000` (preto) — sobre o verde limão, contraste OK |

## Snippet pronto pra colar

```json
{
  "filename": "slide01-capa.png",
  "bg": "split-hv-inv",
  "isCover": true,
  "nextBg": "light-gray",
  "logoStyle": "png-oficial",
  "hashtagColor": "#FFFFFF",
  "arrowColor": "#D6DE23",
  "footerColor": "#000000",
  "content": "<div style='line-height:0.92;'><div style='font-size:160px;font-weight:700;color:var(--white);letter-spacing:-4px;text-transform:uppercase;font-style:italic;'>{{LINHA_1}}</div><div style='font-size:200px;font-weight:700;-webkit-text-stroke:3px var(--white);color:transparent;letter-spacing:-4px;text-transform:uppercase;line-height:0.95;margin-top:6px;'>{{LINHA_2}}</div><div style='font-size:240px;font-weight:800;color:var(--black);letter-spacing:-6px;text-transform:uppercase;font-style:italic;line-height:0.95;margin-top:6px;'>{{PUNCHLINE}}</div></div><div style='font-size:42px;font-weight:500;color:var(--text-dark);margin-top:50px;line-height:1.2;'>{{SUBTITULO_PRE}} <span style='font-style:italic;font-weight:700;color:var(--black);'>{{SUBTITULO_DESTAQUE}}</span>{{SUBTITULO_POS}}</div>"
}
```

## Slots

Mesmos do TV1 — `{{LINHA_1}}`, `{{LINHA_2}}`, `{{PUNCHLINE}}`, `{{SUBTITULO_PRE}}`, `{{SUBTITULO_DESTAQUE}}`, `{{SUBTITULO_POS}}`.

## Regra de leitura

Inversão cromática do TV1 — começa no peso institucional preto e aterriza no verde da marca. Útil quando o tom é mais sério ou quando o feed precisa de variação rítmica entre TV1 e TV3.
