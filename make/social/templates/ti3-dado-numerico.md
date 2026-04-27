# TI3 — Dado Numérico

Slide interno construído em torno de **um número gigante em verde 02 (`#00A652`)** sobre fundo cinza claro `#DEDEDE`. Ideal pra slides de impacto estatístico — o número é o protagonista, com texto contextual em cinza escuro acima e abaixo dele.

## Preview

![TI3](preview-ti3.png)

## Quando usar

- Slide com **estatística forte** (ex: "15% e 64%", "R$26,5 milhões", "+800 contas")
- Quando o dado é o ponto central da narrativa — a tipografia gigante força o olhar a parar
- Limite: **1 TI3 por carrossel** (mais de um perde o impacto)

## Spec visual

| Elemento | Valor |
|---|---|
| Fundo | `bg-light-gray` (`#DEDEDE`) |
| Numeração | top-left padrão (cor `#434244` via `numColor`) |
| Texto contextual (acima e abaixo do número) | Rubik Medium 46px, `#434244`, com partes em Bold |
| **Número/dado** | Rubik Black 280px, **verde 02 (`#00A652`)**, italic, letter-spacing -10px, line-height 0.92 |
| Subtítulo (linha de fechamento) | Rubik Regular italic 28px, `#434244` com opacity 0.7 |
| Rodapé | `footerColor: #434244` (preto texto) |
| Faixa + seta | Padrão (próximo geralmente é preto pra contraste) |

## Snippet

```json
{
  "filename": "slideXX-NOME.png",
  "bg": "light-gray",
  "nextBg": "black",
  "number": <N>,
  "numColor": "#434244",
  "footerColor": "#434244",
  "content": "<div style='line-height:1.0;'><div style='font-size:46px;font-weight:500;color:var(--text-dark);line-height:1.2;'>{{CONTEXTO_ANTES}}</div><div style='font-size:280px;font-weight:800;color:var(--green2);letter-spacing:-10px;font-style:italic;line-height:0.92;margin:18px 0;'>{{NUMERO}}</div><div style='font-size:46px;font-weight:500;color:var(--text-dark);line-height:1.2;'>{{CONTEXTO_DEPOIS}}</div><div style='font-size:28px;font-weight:400;color:var(--text-dark);line-height:1.4;margin-top:50px;opacity:0.7;font-style:italic;'>{{FECHAMENTO}}</div></div>"
}
```

## Slots

- `{{CONTEXTO_ANTES}}` — frase que enquadra o dado (ex: "Em 2025, o tráfego orgânico caiu entre")
- `{{NUMERO}}` — o dado em si (ex: "15% e 64%", "R$26,5 milhões")
- `{{CONTEXTO_DEPOIS}}` — complemento (ex: "em diferentes categorias.")
- `{{FECHAMENTO}}` — observação opcional, italic discreto

## Regra de leitura

Olho do leitor segue a hierarquia: contexto → **número (impacto)** → contexto → fechamento. O verde 02 é mais saturado que o verde limão, dá peso de "alarme" sem perder a paleta.
