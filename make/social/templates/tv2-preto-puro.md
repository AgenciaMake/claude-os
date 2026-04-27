# TV2 — Tudo Preto

Capa de carrossel 100% preta, totalmente tipográfica. Mistura **bold + italic regular + outline** em três pesos pra criar profundidade sem precisar de bloco dividido. O acento da marca fica num único elemento de impacto (geralmente o ponto final ou palavra-chave em verde limão).

## Preview

![TV2](preview-tv2.png)

## Quando usar

- Posts conceituais ou provocativos onde a tipografia carrega tudo
- Quando o feed precisa respirar entre posts mais coloridos (TV1, TV3) — o preto puro funciona como pausa visual
- Hooks "frase única" onde a divisão de bloco distrai do conteúdo

## Spec visual

| Elemento | Valor |
|---|---|
| **Background** | `black` (preto puro `#000000`) |
| **Logo** | PNG oficial (selo verde com texto preto cheio) — destaca sobre o preto |
| **Hashtag** | Cor branco (default), 16px Light italic + Medium italic em "estratégica" |
| **Tipografia** | 3 pesos sobrepostos:<br>1. Setup: Bold 700, branco caixa mista<br>2. Sustentação: Italic Regular 400, branco caixa mista<br>3. Punchline: Bold 700 caixa alta, **outline branco** com stroke 4px<br>4. Acento de marca: 1 caractere ou palavra em **verde limão sólido** (o ponto final, ou um símbolo) |
| **Subtítulo** | Rubik 44px Medium 500, branco com destaque em verde limão italic |
| **Seta** | Cor `var(--black)` (default `from-black`) — preto invadindo a faixa lateral |
| **Rodapé** | Cor branco (default) — bate com o fundo |

## Snippet pronto pra colar

```json
{
  "filename": "slide01-capa.png",
  "bg": "black",
  "isCover": true,
  "nextBg": "light-gray",
  "content": "<div style='line-height:0.92;'><div style='font-size:150px;font-weight:700;color:var(--white);letter-spacing:-3px;'>{{LINHA_1}}</div><div style='font-size:150px;font-weight:400;font-style:italic;color:var(--white);letter-spacing:-3px;margin-top:6px;'>{{LINHA_2}}</div><div style='display:flex;align-items:baseline;gap:18px;margin-top:6px;'><span style='font-size:240px;font-weight:700;-webkit-text-stroke:4px var(--white);color:transparent;letter-spacing:-6px;text-transform:uppercase;line-height:0.9;font-style:italic;'>{{PUNCHLINE}}</span><span style='font-size:240px;font-weight:700;color:var(--lime);line-height:0.9;font-style:italic;'>{{ACENTO}}</span></div></div><div style='font-size:44px;font-weight:500;color:var(--white);margin-top:70px;line-height:1.2;'>{{SUBTITULO_PRE}} <span style='font-style:italic;font-weight:700;color:var(--lime);'>{{SUBTITULO_DESTAQUE}}</span>{{SUBTITULO_POS}}</div>"
}
```

## Slots

| Slot | Função | Exemplo |
|---|---|---|
| `{{LINHA_1}}` | Sujeito do hook (bold) | "Seu tráfego" |
| `{{LINHA_2}}` | Sustentação (italic regular) | "orgânico" |
| `{{PUNCHLINE}}` | Palavra de impacto (outline caixa alta) | "CAIU" |
| `{{ACENTO}}` | Caractere/palavra final em verde limão sólido | "." |
| `{{SUBTITULO_PRE}}` | Início do subtítulo | "E a culpa" |
| `{{SUBTITULO_DESTAQUE}}` | Destaque do subtítulo | "não é sua" |
| `{{SUBTITULO_POS}}` | Fim do subtítulo | "." |

## Regra de leitura

A tipografia constrói uma **escada de peso** (bold → italic regular → outline gigante) que conduz o olho até o acento verde — o único toque de cor que carrega a marca. Se o acento desaparecer, o post perde a assinatura visual da Make.
