# TI4 — Lista Numerada

Slide interno com **lista de 3 itens numerados** sobre fundo verde limão. Os números (01/02/03) aparecem em **outline preto gigante** ao lado do texto, criando hierarquia visual com pouca tipografia. Ideal pra slides de "conclusão acionável" ou "passos práticos".

## Preview

![TI4](preview-ti4.png)

## Quando usar

- Slide de **3 ações práticas** (passos, recomendações, checklist)
- Slide de fechamento útil — antecede o CTA, dá a sensação de "tem o que fazer agora"
- Limite recomendado: **1 TI4 por carrossel** (geralmente perto do final, antes do CTA)

## Spec visual

| Elemento | Valor |
|---|---|
| Fundo | `bg-lime` (`#D6DE23`) |
| Numeração `[N]` | top-left, cor preta via `numColor` |
| Headline | Rubik Black 64px italic preto caixa alta com palavra-chave em italic |
| **Números 01/02/03** | Rubik Black 120px, **outline preto** (stroke 3px, color transparent), italic |
| Título de cada item | Rubik Bold 46px preto com palavra-chave em italic |
| Descrição de cada item | Rubik Regular 24px, preto com opacity 0.8 |
| Rodapé | `footerColor: #000000` |
| Faixa + seta | `nextBg: lime` (CTA também é verde), `arrowColor: #000000` (contrasta com a faixa verde) |

## Snippet

```json
{
  "filename": "slideXX-NOME.png",
  "bg": "lime",
  "nextBg": "lime",
  "number": <N>,
  "numColor": "#000000",
  "arrowColor": "#000000",
  "footerColor": "#000000",
  "content": "<div style='line-height:1.0;'><div style='font-size:64px;font-weight:800;color:var(--black);text-transform:uppercase;font-style:italic;letter-spacing:-1px;line-height:0.95;margin-bottom:44px;'>{{HEADLINE}}</div><div style='display:flex;flex-direction:column;gap:32px;'><div style='display:flex;gap:24px;align-items:flex-start;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>01</div><div style='flex:1;padding-top:14px;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>{{ITEM_1_TITULO}}</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>{{ITEM_1_DESC}}</div></div></div><div style='display:flex;gap:24px;align-items:flex-start;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>02</div><div style='flex:1;padding-top:14px;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>{{ITEM_2_TITULO}}</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>{{ITEM_2_DESC}}</div></div></div><div style='display:flex;gap:24px;align-items:flex-start;'><div style='font-size:120px;font-weight:800;color:transparent;-webkit-text-stroke:3px var(--black);line-height:0.85;font-style:italic;flex:0 0 auto;'>03</div><div style='flex:1;padding-top:14px;'><div style='font-size:46px;font-weight:700;color:var(--black);line-height:1.0;'>{{ITEM_3_TITULO}}</div><div style='font-size:24px;font-weight:400;color:var(--black);line-height:1.3;margin-top:6px;opacity:0.8;'>{{ITEM_3_DESC}}</div></div></div></div></div>"
}
```

## Slots

- `{{HEADLINE}}` — título do slide com `<br>` opcional e `<em>` em palavra-chave
- `{{ITEM_N_TITULO}}` / `{{ITEM_N_DESC}}` — nome e descrição de cada um dos 3 itens

## Regra de leitura

Estrutura escaneável — 3 unidades visuais paralelas, com o número outline criando ritmo lateral. Funciona como "checklist visual" e prepara o leitor pro CTA logo após.
