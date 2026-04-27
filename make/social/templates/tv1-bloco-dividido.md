# TV1 — Bloco Dividido (verde em cima / preto embaixo)

Capa de carrossel com fundo dividido horizontalmente: 50% verde limão em cima, 50% preto embaixo. Tipografia gigante em italic caixa alta atravessa a divisão criando contraste de cor + camada outline.

## Preview

![TV1](preview-tv1.png)

## Quando usar

- Provocação ou pergunta que vira "queda" — começa no verde (positivo) e termina no preto (drama)
- Hooks em 3 partes: setup + sustentação + punchline
- Tom de alarme leve / news flash

## Spec visual

| Elemento | Valor |
|---|---|
| **Background** | `split-hv` (linear-gradient verde limão 50% top + preto 50% bottom) |
| **Logo** | SVG vazado com fill `#000000` (selo preto, texto vazado mostra o verde atrás) |
| **Hashtag** | Cor `#434244` (preto texto), 16px Light italic + Medium italic em "estratégica" |
| **Tipografia** | 3 linhas em Rubik italic caixa alta:<br>1. Setup: Bold 700, cor preto sobre verde<br>2. Outline: stroke 3px preto, transparente, cruzando divisão<br>3. Punchline: Bold 800, cor verde limão `#D6DE23` sobre o preto |
| **Subtítulo** | Rubik 42px Medium 500, cor branco com destaque em verde limão italic |
| **Seta** | Cor `#000000` (preto — slide atual no ponto da seta) invadindo a faixa lateral do próximo slide |
| **Rodapé** | Cor branco (default) — fica sobre o preto, contraste OK |

## Snippet pronto pra colar

```json
{
  "filename": "slide01-capa.png",
  "bg": "split-hv",
  "isCover": true,
  "nextBg": "light-gray",
  "logoStyle": "svg-#000000",
  "hashtagColor": "#434244",
  "arrowColor": "#000000",
  "content": "<div style='line-height:0.92;'><div style='font-size:160px;font-weight:700;color:var(--black);letter-spacing:-4px;text-transform:uppercase;font-style:italic;'>{{LINHA_1}}</div><div style='font-size:200px;font-weight:700;-webkit-text-stroke:3px var(--black);color:transparent;letter-spacing:-4px;text-transform:uppercase;line-height:0.95;margin-top:6px;'>{{LINHA_2}}</div><div style='font-size:240px;font-weight:800;color:var(--lime);letter-spacing:-6px;text-transform:uppercase;font-style:italic;line-height:0.95;margin-top:6px;'>{{PUNCHLINE}}</div></div><div style='font-size:42px;font-weight:500;color:var(--white);margin-top:50px;line-height:1.2;'>{{SUBTITULO_PRE}} <span style='font-style:italic;font-weight:700;color:var(--lime);'>{{SUBTITULO_DESTAQUE}}</span>{{SUBTITULO_POS}}</div>"
}
```

## Slots

| Slot | Função | Exemplo |
|---|---|---|
| `{{LINHA_1}}` | Sujeito do hook (sobre verde) | "Seu tráfego" |
| `{{LINHA_2}}` | Sustentação em outline (cruzando divisão) | "orgânico" |
| `{{PUNCHLINE}}` | Palavra/frase de impacto (sobre preto) | "caiu." |
| `{{SUBTITULO_PRE}}` | Início do subtítulo | "E a culpa" |
| `{{SUBTITULO_DESTAQUE}}` | Destaque do subtítulo (verde limão italic) | "não é sua" |
| `{{SUBTITULO_POS}}` | Fim do subtítulo | "." |

## Regra de leitura

A leitura segue **3 tempos cromáticos** que reforçam a queda do significado:
1. Topo verde — promessa, status quo, contexto
2. Meio outline — transição visual, "mas..."
3. Embaixo verde sobre preto — punch final
