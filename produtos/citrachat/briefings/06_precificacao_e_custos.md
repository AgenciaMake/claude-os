# CitraChat — Precificação, Custos e Benchmark Competitivo

> Arquivo de referência permanente. Atualizar sempre que houver mudança de preço, custo ou benchmark.
> Última revisão: 2026-09-15 (v5 — trocado Twilio SMS por Solvefy RCS, modelo virou add-on opcional cobrado via Stripe)

---

## 1. Todos os pontos de consumo de API

O CitraChat tem 6 tipos de chamada à Anthropic, com modelos diferentes:

| Chamada | Modelo | Quando dispara | Frequência |
|---|---|---|---|
| Chat público (cada resposta) | Haiku 4.5 | Toda mensagem trocada com visitante | Por conversa — MAIOR CUSTO |
| Extração de nome do lead | Haiku 4.5 | Uma vez por conversa que gera lead (~30% das convs) | Por lead |
| Entrevista de treinamento (Limonete) | Haiku 4.5 | Cada mensagem na aba Treinar | Por sessão de treino |
| Extração de PDF/doc (arquivo ≤ 5 MB) | **Sonnet 4.6** | Upload de documento de apoio | Por arquivo |
| Extração de PDF/doc (arquivo > 5 MB) | Haiku 4.5 | Upload de arquivo grande | Por arquivo |
| Salvar contexto de treinamento | **Sonnet 4.6** | Clique em "Salvar configuração" | Por save |

---

## 2. Preços dos modelos (Anthropic, set/2026)

| Modelo | Input / 1M tokens | Output / 1M tokens | Em R$ (câmbio R$5,80) |
|---|---|---|---|
| Haiku 4.5 | US$ 1,00 | US$ 5,00 | R$5,80 input / R$29,00 output |
| Sonnet 4.6 | US$ 3,00 | US$ 15,00 | R$17,40 input / R$87,00 output |

**Custo por token:**
- Haiku input: R$ 0,0000058 / token
- Haiku output: R$ 0,000029 / token
- Sonnet input: R$ 0,0000174 / token
- Sonnet output: R$ 0,000087 / token

---

## 3. Custo unitário de cada operação

### 3.1 Conversa de chat (Haiku)

| Tipo de conversa | Mensagens | Tokens input total | Tokens output total | Custo |
|---|---|---|---|---|
| Curta — FAQ, captação rápida | 3–5 | ~4.000 | ~600 | R$ 0,040 |
| Média — lead qualificado, SAC resolvido | 8–12 | ~10.000 | ~1.500 | R$ 0,101 |
| Longa — SAC complexo, consultivo | 15–20 | ~20.000 | ~3.000 | R$ 0,203 |
| **Blended médio** (60% curta, 30% média, 10% longa) | — | — | — | **R$ 0,077** |

> Usar **R$ 0,08/conversa** como referência de cálculo.

### 3.2 Notify-lead — extração de nome (Haiku)

- Tokens: ~500 input + 50 output
- Custo: R$ 0,0044 por chamada
- Dispara em ~30% das conversas

### 3.3 Entrevista de treinamento — Limonete (Haiku)

- Média de 30 mensagens por sessão de treinamento
- Tokens por mensagem: similar ao chat (~3.500 input + 300 output em média)
- Custo por sessão completa: ~R$ 0,11 × 30 mensagens ponderado = **~R$ 1,80 por sessão**
- Clientes treinam agentes pontualmente, não todo mês. Estimar 1–2 sessões/agente/mês.

### 3.4 Extração de PDF (Sonnet para arquivos ≤ 5 MB)

- Típico: documento de 10 páginas = ~20.000 tokens input + ~15.000 tokens output
- Custo Sonnet: (20.000 × R$0,0000174) + (15.000 × R$0,000087) = R$0,35 + R$1,31 = **R$ 1,65/arquivo**
- É custo pontual por upload, não mensal recorrente.

### 3.5 Salvar configuração de treinamento (Sonnet)

- Tokens: ~8.000 input + 1.500 output
- Custo: (8.000 × R$0,0000174) + (1.500 × R$0,000087) = R$0,14 + R$0,13 = **R$ 0,27 por save**

---

## 4. Custos fixos de infraestrutura

| Serviço | Plano | Custo/mês (USD) | Custo/mês (R$) |
|---|---|---|---|
| Vercel | Pro | ~US$ 20 | ~R$ 116 |
| Supabase | Pro | ~US$ 25 | ~R$ 145 |
| Resend | Pro | ~US$ 20 | ~R$ 116 |
| Outros (domínios, monitoramento, etc.) | — | ~US$ 15 | ~R$ 87 |
| **Total infra fixa** | | **~US$ 80/mês** | **~R$ 464/mês** |

> A Anthropic API **não entra aqui** — é custo variável, pago por uso, cresce com clientes.

### Infra rateada por cliente

| Clientes ativos | Custo infra/cliente |
|---|---|
| 10 | R$ 46,40 |
| 25 | R$ 18,56 |
| 50 | R$ 9,28 |
| 100 | R$ 4,64 |

> **Usar R$ 15/cliente** como referência (base ~30 clientes, realista no médio prazo).

---

## 5. Solvefy RCS — modelo e custos

**Status:** preço confirmado por Bruno como R$0,07/SMS e R$0,10/RCS (16/09) — usar esses
valores nos cálculos de margem abaixo. Substitui o plano de usar Twilio SMS — Twilio
fica como reserva, conta e crédito de US$20 mantidos parados, sem uso previsto.

**Nota — divergência com o self-service, ainda de pé.** O self-service da conta (tela
Canais/Créditos) mostra preços diferentes: SMS R$0,0780 e RCS em 3 categorias
(Conversational R$0,2730, Non-conversational Basic R$0,0865, Non-conversational Single
R$0,1313). R$0,07/R$0,10 provavelmente é um preço negociado à parte, mas vale confirmar
com o suporte técnico **qual categoria de RCS esse preço negociado corresponde** — isso
importa tecnicamente porque a categoria pode ser um parâmetro do payload de envio (ex:
`content.type` ou algo equivalente), não só uma questão de cobrança.

Outros achados do Cowork ao navegar o painel, relevantes para a implementação:
- **Fallback RCS→SMS não é automático** — é opt-in por mensagem via campo `fallback`
  no payload de envio. Sem esse campo, uma mensagem que falha simplesmente não chega —
  vai ter que ser obrigatório em toda chamada. Iphone com iOS 18+ já suporta RCS nativo
  (Apple adicionou em 2024), então o universo sem cobertura é menor do que parecia —
  ainda sobra iPhone com iOS <18 e Android/operadora sem suporte a RCS — mas o fallback
  continua necessário para esses casos.
- **Cadastro do Agente RCS exige CNPJ real** e trava nas etapas 4/5 (onde provavelmente
  está o prazo/processo de aprovação) sem ele. Hoje a conta tem 0 agentes RCS
  provisionados — bloqueante para o lançamento até isso ser feito.
- Não há API de consumo detalhado da Solvefy (só saldo agregado via
  `GET /cpaas/v1/billing/credits`) — o CitraChat vai precisar manter sua própria
  contagem de uso para exibir no painel do cliente.
- Sem SLA ou cláusula de contrato visível no self-service — só existe fora do painel.
- **Modelo de cobrança tem duas fases** (confirmado por Bruno 16/09): começa pré-pago
  (crédito comprado antecipado, consumido pelos disparos) e, depois de validar/testar
  tudo, migra para pós-pago (cobrado pelo uso real, sem depender de saldo). O painel só
  documenta a parte pré-paga (`GET /cpaas/v1/billing/credits`, saldo pode ficar
  negativo); a transição pré→pós-pago (automática por volume? manual, a pedido? tem
  período híbrido?) não está documentada no self-service — perguntar ao suporte técnico.

Outros achados do Cowork ao navegar o painel, relevantes para a implementação:
- **Fallback RCS→SMS não é automático** — é opt-in por mensagem via campo `fallback`
  no payload de envio. Sem esse campo, uma mensagem que falha simplesmente não chega —
  vai ter que ser obrigatório em toda chamada. Iphone com iOS 18+ já suporta RCS nativo
  (Apple adicionou em 2024), então o universo sem cobertura é menor do que parecia —
  ainda sobra iPhone com iOS <18 e Android/operadora sem suporte a RCS — mas o fallback
  continua necessário para esses casos.
- **Cadastro do Agente RCS exige CNPJ real** e trava nas etapas 4/5 (onde provavelmente
  está o prazo/processo de aprovação) sem ele. Hoje a conta tem 0 agentes RCS
  provisionados — bloqueante para o lançamento até isso ser feito.
- Não há API de consumo detalhado da Solvefy (só saldo agregado via
  `GET /cpaas/v1/billing/credits`) — o CitraChat vai precisar manter sua própria
  contagem de uso para exibir no painel do cliente.
- Sem SLA ou cláusula de contrato visível no self-service — só existe fora do painel.

**Por que RCS e não SMS:**
Cotação Solvefy trouxe os dois: **SMS a R$0,07** e **RCS a R$0,10**. RCS é mais rico (template, rastreamento de leitura, mídia) por só R$0,03 a mais — decisão de Bruno (15/09) foi ir de RCS direto, sem oferecer SMS como opção paralela.

**O que a notificação faz no CitraChat:**
Push para o time do cliente quando algo precisa de atenção — novo lead capturado, novo protocolo gerado, novo chamado aberto. **Não é resumo da conversa**, é só um aviso de que há algo novo no painel.

**Mudança de modelo (15/09): de feature do plano para add-on opcional cobrado via Stripe**

Antes o SMS entrava direto na cota do plano (Pro/Business) e o cliente não tinha escolha. Agora é **opt-in**:

1. Notificação por RCS não vem ativada por padrão em nenhum plano.
2. Cliente ativa no painel (checkbox nas Configurações do agente ou da conta) e precisa aceitar os termos daquela cobrança específica antes de habilitar — mesmo padrão de aceite já usado no cadastro (`terms_accepted_at`/`terms_version`).
3. Cada plano continua dando uma **cota incluída** sem custo extra ao cliente (mesmos números de antes: Pro 50/mês, Business 150/mês — agora em RCS, não SMS).
4. **Acima da cota**, cada RCS é cobrado automaticamente via Stripe (add-on/metered), sem o cliente precisar fazer nada — é lançado na fatura dele.

**Preço ao cliente pelo excedente: R$ 0,15/RCS.**

**Margem no excedente:**
- Custo Solvefy: R$ 0,10/RCS
- Preço ao cliente: R$ 0,15/RCS
- Margem: R$ 0,05/RCS (**33% — abaixo da meta de 70% usada no resto deste documento**; decisão consciente de Bruno, tratado como conveniência de baixo atrito e não como centro de lucro. Revisar se o volume de excedente crescer muito.)

**Impacto na margem dos planos com a cota incluída (custo agora em RCS a R$0,10, não SMS a R$0,35):**
- Pro: cota 50 × R$0,10 = R$5,00 (era R$17,50 com Twilio) → margem sobe pra **73,0%**
- Business: cota 150 × R$0,10 = R$15,00 (era R$52,50 com Twilio) → margem sobe pra **70,6%** (antes ficava 68,9%, abaixo da meta — agora bate)

**Provedores avaliados (set/2026):**
- **Solvefy** (solvefy.com/api) — API brasileira, 100 req/s, suporte a template e rastreamento. **Escolhido.** SMS R$0,07, RCS R$0,10.
- Disparo Pro — R$0,07/SMS em pool de 5.000/mês (R$350). Descartado por não oferecer RCS na mesma cotação.
- Zenvia — descartada (experiência ruim de suporte e produto confuso).
- Twilio — descartado como provedor principal por custo (R$0,35/SMS, sem RCS competitivo). Conta mantida como reserva.
- AWS SNS — preço equivalente ao Twilio para BR, sem vantagem.

---

## 6. Custo total mensal por plano — preços vigentes (set/2026)

### Premissas por plano

| Plano | Conv/mês | Agentes | Leads gerados (~30%) | Saves de treino/mês | Arquivos novos/mês |
|---|---|---|---|---|---|
| Starter | 300 | 1 | 90 | 2 | 0,5 |
| Pro | 1.000 | 3 | 300 | 6 | 1 |
| Business | 7.000 | 10 | 2.100 | 20 | 3 |

### Starter — R$ 167/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (300 conv × R$0,08) | 300 × R$0,08 | R$ 24,00 |
| Notify-lead (90 × R$0,0044) | 90 × R$0,0044 | R$ 0,40 |
| Entrevista treino (1 agent × 2 sessões × R$1,80) | 2 × R$1,80 | R$ 3,60 |
| Extração PDF (0,5 arquivo × R$1,65) | 0,5 × R$1,65 | R$ 0,83 |
| Save treino (2 saves × R$0,27) | 2 × R$0,27 | R$ 0,54 |
| Infra rateada | — | R$ 15,00 |
| RCS (add-on opcional, não incluso no Starter) | — | — |
| **COGS total** | | **R$ 44,37** |
| **Receita** | | **R$ 167,00** |
| **Margem bruta** | (167 - 44,37) / 167 | **73,4% ✅** |

### Pro — R$ 427/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (1.000 conv × R$0,08) | 1.000 × R$0,08 | R$ 80,00 |
| Notify-lead (300 × R$0,0044) | 300 × R$0,0044 | R$ 1,32 |
| Entrevista treino (3 agents × 2 sessões × R$1,80) | 6 × R$1,80 | R$ 10,80 |
| Extração PDF (1 arquivo × R$1,65) | 1 × R$1,65 | R$ 1,65 |
| Save treino (6 saves × R$0,27) | 6 × R$0,27 | R$ 1,62 |
| Infra rateada | — | R$ 15,00 |
| RCS incluídos, se cliente ativar o add-on (50 × R$0,10) | 50 × R$0,10 | R$ 5,00 |
| **COGS total** | | **R$ 115,39** |
| **Receita** | | **R$ 427,00** |
| **Margem bruta** | (427 - 115,39) / 427 | **73,0% ✅** |

### Business — R$ 2.197/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (7.000 conv × R$0,08) | 7.000 × R$0,08 | R$ 560,00 |
| Notify-lead (2.100 × R$0,0044) | 2.100 × R$0,0044 | R$ 9,24 |
| Entrevista treino (10 agents × 2 sessões × R$1,80) | 20 × R$1,80 | R$ 36,00 |
| Extração PDF (3 arquivos × R$1,65) | 3 × R$1,65 | R$ 4,95 |
| Save treino (20 saves × R$0,27) | 20 × R$0,27 | R$ 5,40 |
| Infra rateada | — | R$ 15,00 |
| RCS incluídos, se cliente ativar o add-on (150 × R$0,10) | 150 × R$0,10 | R$ 15,00 |
| **COGS total** | | **R$ 645,59** |
| **Receita** | | **R$ 2.197,00** |
| **Margem bruta** | (2.197 - 645,59) / 2.197 | **70,6% ✅** |

### Resumo de margens (com RCS, se o cliente ativar o add-on)

| Plano | Preço | COGS | Margem | Meta 70% |
|---|---|---|---|---|
| Starter | R$167 | R$44 | **73,4%** | ✅ |
| Pro | R$427 | R$115 | **73,0%** | ✅ |
| Business | R$2.197 | R$646 | **70,6%** | ✅ |

> Com Solvefy RCS (R$0,10) em vez de Twilio SMS (R$0,35), Pro e Business sobem de margem — Business, que antes ficava 1,1pp abaixo da meta, agora bate os 70%. Como o RCS agora é opt-in, um cliente que não ativa o add-on nem paga esse custo — as margens acima são o piso (cenário em que todo mundo ativa e usa a cota cheia).
>
> O excedente (acima da cota) é cobrado automaticamente via Stripe a R$0,15/RCS, com margem de apenas 33% (custo R$0,10) — decisão consciente de tratar isso como conveniência, não como centro de lucro. Ver seção 5.

---

## 7. Análise de utilização — Business

O Business tem 10 agentes. 7.000 conversas distribuídas = 700 conv/agente/mês. A margem varia conforme uso real:

| Utilização das 7.000 conv | Conv usadas | Custo variável | Custo total | Margem |
|---|---|---|---|---|
| 30% (cliente pequeno) | 2.100 | R$ 220 | R$ 290 | **86,8% ✅** |
| 50% (uso moderado) | 3.500 | R$ 344 | R$ 414 | **81,2% ✅** |
| 70% (uso ativo) | 4.900 | R$ 467 | R$ 537 | **75,6% ✅** |
| 100% (máximo) | 7.000 | R$ 631 | R$ 631 | **71,3% ✅** |

> Com os preços atualizados (R$2.197), o Business fecha com margem positiva mesmo a 100% de utilização.

---

## 8. Análise das recargas

| Recarga | Preço | Conv | Custo IA | Custo total | Margem |
|---|---|---|---|---|---|
| Starter +100 | R$ 29 | 100 | R$ 8,00 + R$ 0,40 | R$ 8,40 | **71,0% ✅** |
| Pro +300 | R$ 59 | 300 | R$ 24,00 + R$ 1,32 | R$ 25,32 | **57,1% ⚠️** |
| Business +1.000 | R$ 99 | 1.000 | R$ 80,00 + R$ 9,24 | R$ 89,24 | **9,9% 🚨** |

> A recarga Business a R$99 continua sendo o item mais crítico. Se o custo médio por conversa subir para R$0,10, a recarga passa a dar **prejuízo**. Revisar após primeiros dados de uso.

**Preços sugeridos de recarga para margem de 70%:**

| Recarga | Conv | Custo total | Preço 70% margem | Preço atual | Ação |
|---|---|---|---|---|---|
| Starter +100 | 100 | R$ 8,40 | R$ 28,00 | R$ 29 | Manter ✅ |
| Pro +300 | 300 | R$ 25,32 | R$ 84,40 | R$ 59 | Revisar → R$ 89 ⚠️ |
| Business +1.000 | 1.000 | R$ 89,24 | R$ 297,47 | R$ 99 | Revisar → R$ 299 🚨 |

---

## 9. Add-on WhatsApp — custo e margem

Os add-ons de WhatsApp usam a API da Meta (não Twilio). Custo da API Meta para BR é praticamente zero nas mensagens iniciadas pelo usuário (janela de 24h). O custo real é de infraestrutura e gestão do webhook.

| Add-on | Receita extra/mês | Custo infra adicional | Margem adicional |
|---|---|---|---|
| Starter +WA (R$67/mês) | R$ 67 | ~R$ 5 | ~93% ✅ |
| Pro +WA (R$137/mês) | R$ 137 | ~R$ 5 | ~96% ✅ |
| Business +WA (R$347/mês) | R$ 347 | ~R$ 5 | ~99% ✅ |

> O add-on de WhatsApp tem margem altíssima porque o custo incremental é baixo. É uma das melhores fontes de receita por cliente ativo.

---

## 10. Cupom para beta testers

### Contexto

Para os primeiros clientes que ajudam a desenvolver e validar o CitraChat, um cupom de desconto generoso faz sentido como reconhecimento e incentivo. Precisa cobrir os custos mesmo na utilização máxima.

### Quanto cobre?

Com cupom de **65% de desconto**, o cliente paga 35% do preço cheio:

| Plano | Preço cheio | Preço com 65% off | COGS (100% util) | Margem com desconto |
|---|---|---|---|---|
| Starter | R$167 | **R$58,45** | R$44,37 | **24,1% ✅** |
| Pro | R$427 | **R$149,45** | R$110,39 | **26,1% ✅** |
| Business | R$2.197 | **R$768,95** | R$630,59 | **18,0% ✅** |

> Com 65% de desconto, todos os planos ainda cobrem os custos e geram margem positiva. É o máximo seguro para beta testers.

### Resumo da recomendação

| Item | Recomendação |
|---|---|
| Cupom beta | **65% de desconto** |
| Validade sugerida | 3 meses ou até lançamento público (o que vier primeiro) |
| Comunicação | "Desconto de fundador — por ajudar a moldar o produto" |
| Condição | Feedback ativo durante o período de beta |
| Limite de cupons | Definir teto (ex.: primeiros 20 clientes) |

---

## 11. Benchmark — concorrentes (atualizado)

### Leadster

| Plano | Preço/mês | Leads/mês | Observações |
|---|---|---|---|
| Starter | R$ 199 | 250 leads | Fluxo condicional, não IA real |
| Pro | R$ 499 | 1.000 leads | Integração com CRMs populares BR |
| Business | R$ 999+ | Customizado | Foco em grandes volumes |

**Vantagens do CitraChat sobre Leadster:**
- IA conversacional real — não fluxo condicional disfarçado de chat
- Treinamento por PDF/documentos (Leadster não tem)
- 7 eventos de rastreamento padronizados — GTM, Google Ads, Meta, TikTok, LinkedIn, tudo no painel sem código
- Templates GTM exportáveis prontos para importar
- Lead scoring automático com análise IA
- Criado por agência de performance — entende conversão e mídia paga de verdade
- Foco BR/PT — preço em real, suporte em português
- Modelo mais flexível: SAC, FAQ, leads, agendamento, suporte

### Octadesk

| Plano | Preço/mês | Observações |
|---|---|---|
| Básico | R$ 299 | Atendimento humano + chatbot simples |
| Avançado | R$ 599+ | Multicanal, relatórios |

**Posição:** Octadesk é mais plataforma de atendimento (CRM + chat humano) do que agente conversacional IA. Concorrência indireta — pode coexistir.

### Typebot

| Plano | Preço/mês |
|---|---|
| Free | US$ 0 |
| Starter | US$ 39 (~R$ 226) |
| Pro | US$ 89 (~R$ 516) |

**Posição:** fluxos visuais, não IA real. Público técnico. Favorável ao CitraChat no argumento de inteligência.

### ManyChat

| Plano | Preço |
|---|---|
| Free | US$ 0 / até 1.000 contatos |
| Pro | A partir de US$ 15/mês |

**Posição:** automatizador de WhatsApp/Instagram. Não é concorrente direto.

---

## 12. Posicionamento de preço no mercado

| Produto | Plano Entrada | IA real | Eventos analytics | Treinamento por doc |
|---|---|---|---|---|
| CitraChat Starter | **R$167** | ✅ | ✅ | ✅ |
| Leadster Starter | R$199 | ❌ | Parcial | ❌ |
| Typebot Starter | ~R$226 | ❌ | ❌ | ❌ |
| Octadesk Básico | R$299 | ❌ | Parcial | ❌ |

> CitraChat entrega IA real + analytics completo com o menor preço de entrada do segmento. Esse é o argumento principal de vendas.

---

## 13. Decisões e histórico de preços

### Preços vigentes (set/2026)

| Plano | Preço | Conversas | Agentes | Add-on WA | Margem (100% util) |
|---|---|---|---|---|---|
| Starter | **R$167/mês** | 300/mês | 1 | +R$67/mês | 73,4% ✅ |
| Pro | **R$427/mês** | 1.000/mês | 3 | +R$137/mês | 74,2% ✅ |
| Business | **R$2.197/mês** | 7.000/mês | 10 | +R$347/mês | 71,3% ✅ |
| Agência | Lista de espera | — | — | — | — |

### Recargas vigentes (revisar após primeiros dados de uso)

| Recarga | Preço | Conv | Margem atual | Status |
|---|---|---|---|---|
| Starter | R$ 29 | +100 | 71% | ✅ OK |
| Pro | R$ 59 | +300 | 57% | ⚠️ Revisar |
| Business | R$ 99 | +1.000 | 10% | 🚨 Urgente revisar |

---

## 14. Histórico de revisões

| Data | Versão | O que mudou |
|---|---|---|
| 2026-06-22 | v1 | Arquivo criado. |
| 2026-06-22 | v2 | Análise completa com todos os 6 pontos de consumo de API mapeados (Haiku + Sonnet). Custo total por plano calculado. Análise de utilização do Business. Três opções de ajuste documentadas. |
| 2026-06-22 | v3 | Decisão registrada: Business ajustado para R$1.997/mês (68,4% margem no pior caso). Starter e Pro mantidos para monitorar uso real. |
| 2026-09-02 | v4 | Preços atualizados para R$167/R$427/R$2.197 (confirmados no código). Twilio SMS mapeado com preço correto: US$0,0599/SMS para BR (~R$0,35). Feature de notificação SMS definida como push de evento (não resumo) — disponível nos planos Pro e Business. Modelo: 50 SMS incluídos no Pro, 150 no Business; excedente R$0,49/SMS. Add-on WhatsApp com análise de margem separada. Cupom beta 65% no Stripe aprovado por Bruno. Alternativas de provedor SMS pesquisadas: Disparo Pro (R$0,07/SMS, aguardando retorno comercial), Solvefy (cotação pendente); Zenvia descartada; AWS SNS equivalente ao Twilio para BR. Provedor atual: Twilio. |
