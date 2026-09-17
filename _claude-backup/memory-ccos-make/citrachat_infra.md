---
name: citrachat-infra
description: "Infraestrutura do CitraChat — onde está hospedado, contas e serviços"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-17T11:29:44.618Z
---

CitraChat (Next.js) está hospedado no **Vercel**, não Cloudflare.
- Conta Vercel: **bruno@makelemonad.com.br**
- Banco de dados: **Supabase**
- Repositório: **AgenciaMake/citrachat**, branch `plataforma`

Cloudflare é usado apenas para os apps simples em `apps/` (ex: app de briefing), não para produtos SaaS da linha Citra.

**How to apply:** ao falar de deploy, logs ou infra do CitraChat, sempre referenciar Vercel. Logs de função ficam em: Vercel dashboard → projeto citrachat → aba Logs → filtrar Functions.

## Região: funções e banco ficam JUNTOS em São Paulo (desde 2026-09-17)

- Banco Supabase: **sa-east-1 (São Paulo)**, ref `lkcwykalylphhngjivva`.
- Funções Vercel: fixadas em **gru1 (São Paulo)** via `vercel.json` → `"regions": ["gru1"]`.

**Why:** as funções rodavam no padrão do Vercel, **iad1 (Washington)**, enquanto o banco
está em São Paulo. Toda consulta atravessava o Atlântico (~130ms por ida e volta), e cada
navegação do painel faz de 4 a 5 consultas EM SEQUÊNCIA — o que dava 2 a 3 segundos por
troca de página, a ponto do Bruno clicar duas vezes achando que não tinha registrado.
Medido antes/depois no mesmo dia: TTFB de página dinâmica caiu de ~0,81s para ~0,52s
(medido de Portugal; o ganho para usuários brasileiros é maior, porque as duas pernas
encurtam). Página estática de controle não mudou, confirmando que o ganho veio da
proximidade com o banco.

**How to apply:** não mover a região das funções para longe de `sa-east-1` sem antes
medir — compute e banco devem ficar colados. Para verificar em que região uma função está
rodando, olhar o header `x-vercel-id` de uma rota dinâmica: o formato é
`<POP da borda>::<região da função>::<id>`, então `cdg1::gru1::...` significa função em
São Paulo. Contrapartida aceita conscientemente: a chamada à API da Anthropic (EUA) fica
um pouco mais lenta a partir de São Paulo, o que é irrelevante perto do tempo de geração
do próprio modelo.
</content>
</invoke>