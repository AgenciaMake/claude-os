# Incidente Anthropic API — Material de Contestação

Jogue aqui tudo que tiver sobre os incidentes de cobrança indevida.

## Estrutura

- `prints/` — screenshots do console.anthropic.com, billing, uso por modelo, request IDs
- `evidencias/` — outros arquivos: e-mails, respostas da Anthropic, faturas, etc.

## O que colocar em `prints/`

- Print do saldo negativo de $2.216 (descoberto em 01/06)
- Print do consumo de Opus de madrugada (05/06 às 05h UTC)
- Print do detalhamento por modelo (Opus 4.6, 4.7, 4.8 + Sonnet)
- Print com os request IDs dos subagentes (prefixo req_011Cbj...)
- Print do consumo de 28/05 (widget com Opus + thinking adaptive, 2.567 rate limit hits)
- Qualquer outro print do console da Anthropic relacionado

## Nomeação sugerida

Use nomes descritivos com a data, ex:
- `2026-05-28_widget-opus-rate-limit.png`
- `2026-06-01_billing-saldo-negativo.png`
- `2026-06-05_consumo-opus-madrugada.png`
- `2026-06-05_detalhe-por-modelo.png`
- `2026-06-05_request-ids.png`

## Relatório base

O relatório narrativo já está em:
`../relatorio-incidente-anthropic-api-2026-06.md`

Quando os prints estiverem aqui, avisa o Claude para montar o dossiê final.
