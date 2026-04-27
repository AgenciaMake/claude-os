# TI1 — Editorial com Imagem

Slide interno em estilo **editorial/magazine** — fundo preto, kicker pequeno no topo, título grande com destaque verde, **imagem em card retangular ocupando toda a largura útil** (920px), subtítulo com palavras-chave em verde no rodapé. Inspirado em referências contemporâneas tipo @brandsdecoded_.

## Preview

![TI1](preview-ti1.png)

## Quando usar

- Slide narrativo com **rosto humano ou cena real** que ilustra o conteúdo
- Quando você precisa "ancorar" um conceito abstrato com imagem do mundo real
- Posts editoriais (notícia, comportamento, mudança de mercado)
- Limite recomendado: **1 a 2 TI1 por carrossel** (imagens muito repetidas perdem impacto)

## Spec visual

| Elemento | Valor |
|---|---|
| Fundo | `bg-black` |
| Numeração | top-left padrão (branco) |
| Kicker (subtítulo de abertura) | Rubik Medium 32px, branco com opacity 0.6, caixa alta + letter-spacing |
| Headline | Rubik Bold 108px, branco com destaque em verde limão italic na palavra-chave |
| Imagem | Card retangular ocupando 100% largura (920px) × 520px de altura, `object-fit: cover`, border-radius 6px |
| Subtítulo | Rubik Regular 36px, branco com palavras-chave em verde limão Bold |
| Faixa + seta | Padrão (cor do próximo slide na faixa, cor do slide atual na seta) |

## Snippet

```json
{
  "filename": "slideXX-NOME.png",
  "bg": "black",
  "nextBg": "<cor do próximo>",
  "number": <N>,
  "content": "<div style='display:flex;flex-direction:column;width:100%;gap:32px;'><div style='width:100%;'><div style='font-size:32px;font-weight:500;color:var(--white);opacity:0.6;margin-bottom:18px;text-transform:uppercase;letter-spacing:1.5px;'>{{KICKER}}</div><div style='font-size:108px;font-weight:700;color:var(--white);line-height:1.0;letter-spacing:-3px;'>{{TITULO_PRE}} <span style='color:var(--lime);font-style:italic;font-weight:800;'>{{TITULO_DESTAQUE}}</span>{{TITULO_POS}}</div></div><div style='width:100%;height:520px;border-radius:6px;overflow:hidden;background:#111;'><img src='{{IMG_PATH}}' style='width:100%;height:100%;object-fit:cover;display:block;' alt=''/></div><div style='font-size:36px;font-weight:400;color:var(--white);line-height:1.35;width:100%;'>{{SUBTITULO}}</div></div>"
}
```

## Slots

- `{{KICKER}}` — frase curta de abertura (ex: "A virada que ninguém te contou")
- `{{TITULO_PRE}}` / `{{TITULO_DESTAQUE}}` / `{{TITULO_POS}}` — título com destaque verde itálico no meio
- `{{IMG_PATH}}` — caminho da imagem (relativo ao config.json)
- `{{SUBTITULO}}` — texto suporte com palavras-chave envolvidas em `<strong style='font-weight:700;color:var(--lime);'>palavra</strong>`

## Regra de leitura

Editorial em 3 camadas:
1. **Kicker pequeno** — abertura discreta que prepara o leitor
2. **Headline grande** — entrega o ponto-chave com destaque verde
3. **Imagem como evidência** — ancora visualmente o que foi dito
4. **Subtítulo com palavras-chave em verde** — informação técnica suportiva, com destaques chamando atenção
