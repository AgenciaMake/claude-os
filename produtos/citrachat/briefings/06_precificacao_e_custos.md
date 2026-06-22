# CitraChat — Precificação, Custos e Benchmark Competitivo

> Arquivo de referência permanente. Atualizar sempre que houver mudança de preço, custo ou benchmark.
> Última revisão: 2026-06-22 (análise completa com todos os pontos de consumo de API)

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

## 2. Preços dos modelos (Anthropic, jun/2026)

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

| Serviço | Custo/mês |
|---|---|
| Vercel Pro | ~US$ 20 (~R$ 116) |
| Supabase Pro | ~US$ 25 (~R$ 145) |
| Resend | ~US$ 20 (~R$ 116) |
| Outros (domínios, etc.) | ~US$ 15 (~R$ 87) |
| **Total** | **~US$ 80/mês (~R$ 464)** |

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

## 5. Custo total mensal por plano — análise completa

### Premissas por plano

| Plano | Conv/mês | Agentes | Leads gerados (~30%) | Saves de treino/mês | Arquivos novos/mês |
|---|---|---|---|---|---|
| Starter | 300 | 1 | 90 | 2 | 0,5 |
| Pro | 1.000 | 3 | 300 | 6 | 1 |
| Business | 7.000 | 10 | 2.100 | 20 | 3 |

### Starter — R$ 147/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (300 conv × R$0,08) | 300 × R$0,08 | R$ 24,00 |
| Notify-lead (90 × R$0,0044) | 90 × R$0,0044 | R$ 0,40 |
| Entrevista treino (1 agent × 2 sessões × R$1,80) | 2 × R$1,80 | R$ 3,60 |
| Extração PDF (0,5 arquivo × R$1,65) | 0,5 × R$1,65 | R$ 0,83 |
| Save treino (2 saves × R$0,27) | 2 × R$0,27 | R$ 0,54 |
| Infra rateada | — | R$ 15,00 |
| **Total** | | **R$ 44,37** |
| **Receita** | | **R$ 147,00** |
| **Margem** | (147 - 44,37) / 147 | **69,8% ✅** |

### Pro — R$ 297/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (1.000 conv × R$0,08) | 1.000 × R$0,08 | R$ 80,00 |
| Notify-lead (300 × R$0,0044) | 300 × R$0,0044 | R$ 1,32 |
| Entrevista treino (3 agents × 2 sessões × R$1,80) | 6 × R$1,80 | R$ 10,80 |
| Extração PDF (1 arquivo × R$1,65) | 1 × R$1,65 | R$ 1,65 |
| Save treino (6 saves × R$0,27) | 6 × R$0,27 | R$ 1,62 |
| Infra rateada | — | R$ 15,00 |
| **Total** | | **R$ 110,39** |
| **Receita** | | **R$ 297,00** |
| **Margem** | (297 - 110,39) / 297 | **62,8% ❌** |

### Business — R$ 1.497/mês

| Item | Cálculo | Custo |
|---|---|---|
| Chat (7.000 conv × R$0,08) | 7.000 × R$0,08 | R$ 560,00 |
| Notify-lead (2.100 × R$0,0044) | 2.100 × R$0,0044 | R$ 9,24 |
| Entrevista treino (10 agents × 2 sessões × R$1,80) | 20 × R$1,80 | R$ 36,00 |
| Extração PDF (3 arquivos × R$1,65) | 3 × R$1,65 | R$ 4,95 |
| Save treino (20 saves × R$0,27) | 20 × R$0,27 | R$ 5,40 |
| Infra rateada | — | R$ 15,00 |
| **Total** | | **R$ 630,59** |
| **Receita** | | **R$ 1.497,00** |
| **Margem** | (1.497 - 630,59) / 1.497 | **57,9% ❌** |

---

## 6. O problema do Business: utilização vs. margem

O Business tem 10 agentes. Cada agente pode receber visitantes independentemente. 7.000 conversas distribuídas em 10 agentes = 700 conv/agente/mês — volume alto mas plausível para empresa de médio porte com tráfego real.

A margem muda muito conforme a utilização real:

| Utilização das 7.000 conv | Conv usadas | Custo variável | Custo total | Margem |
|---|---|---|---|---|
| 30% (cliente pequeno) | 2.100 | R$ 220 | R$ 290 | **80,6% ✅** |
| 50% (uso moderado) | 3.500 | R$ 344 | R$ 414 | **72,3% ✅** |
| 70% (uso ativo) | 4.900 | R$ 467 | R$ 537 | **64,1% ⚠️** |
| 100% (máximo) | 7.000 | R$ 631 | R$ 631 | **57,8% ❌** |

> **Conclusão:** o Business está bem se o cliente médio usa 40–50% do limite. Está no prejuízo de margem se a maioria dos clientes chegar a 70%+.

---

## 7. Análise das recargas (pior ponto do pricing atual)

| Recarga | Preço | Conv | Custo IA | Custo total | Margem |
|---|---|---|---|---|---|
| Starter +100 | R$ 29 | 100 | R$ 8,00 + R$ 0,13 | R$ 8,13 | **72% ✅** |
| Pro +300 | R$ 59 | 300 | R$ 24,00 + R$ 0,40 | R$ 24,40 | **58,6% ❌** |
| Business +1.000 | R$ 99 | 1.000 | R$ 80,00 + R$ 1,32 | R$ 81,32 | **17,9% 🚨** |

> A recarga Business a R$99 é o item mais crítico do pricing. Se o custo médio por conversa subir para R$0,10 (conversas mais longas), a recarga passa a dar **prejuízo**.

---

## 8. O que precisa mudar para 70% de margem garantida

### Opção A — Reduzir conversas incluídas, manter preços

Cálculo: quantas conversas fazem a margem fechar em 70% no pior caso (100% de utilização)?

| Plano | Preço | Custo fixo + treino | Verba pra conv | Conversas possíveis (70% margem) |
|---|---|---|---|---|
| Starter | R$ 147 | R$ 20,37 | R$ 147 × 0,30 - R$ 20,37 = **R$ 23,73** | **296 conv** → manter 300 ✅ |
| Pro | R$ 297 | R$ 30,39 | R$ 297 × 0,30 - R$ 30,39 = **R$ 58,71** | **734 conv** → reduzir para 700 |
| Business | R$ 1.497 | R$ 70,59 | R$ 1.497 × 0,30 - R$ 70,59 = **R$ 378,51** | **4.731 conv** → reduzir para 4.500 |

Recargas ajustadas (para 70% de margem):

| Recarga | Conv | Custo IA | Preço 70% | Preço sugerido |
|---|---|---|---|---|
| Starter | 100 | R$ 8,13 | R$ 27,10 | **R$ 29** (manter ✅) |
| Pro | 300 | R$ 24,40 | R$ 81,33 | **R$ 89** |
| Business | 1.000 | R$ 81,32 | R$ 271,07 | **R$ 299** |

---

### Opção B — Manter conversas, ajustar preços

| Plano | Conv | Custo total (100% util) | Preço 70% margem | Preço sugerido |
|---|---|---|---|---|
| Starter | 300 | R$ 44 | R$ 147 | **R$ 147** (manter ✅) |
| Pro | 1.000 | R$ 110 | R$ 367 | **R$ 397** |
| Business | 7.000 | R$ 631 | R$ 2.103 | **R$ 2.197** |

---

### Opção C — Híbrida (recomendada)

Não meche no Starter. Ajusta Pro com pequeno aumento de preço. Reduz volume do Business sem aumentar preço (comunicar como "volume justo para o tamanho do negócio"). Corrige recargas — especialmente a do Business que está quase em breakeven.

| Item | Atual | Proposta | Margem resultante |
|---|---|---|---|
| Starter | R$ 147 / 300 conv | **sem mudança** | 70% ✅ |
| Pro | R$ 297 / 1.000 conv | **R$ 347 / 1.000 conv** | 68% ⚠️ (próximo) |
| Pro (alternativa) | R$ 297 / 1.000 conv | **R$ 297 / 700 conv** | 71% ✅ |
| Business | R$ 1.497 / 7.000 conv | **R$ 1.497 / 4.500 conv** | 71% ✅ |
| Recarga Starter | R$ 29 / 100 conv | **sem mudança** | 72% ✅ |
| Recarga Pro | R$ 59 / 300 conv | **R$ 89 / 300 conv** | 73% ✅ |
| Recarga Business | R$ 99 / 1.000 conv | **R$ 299 / 1.000 conv** | 73% ✅ |

---

## 9. Benchmark — concorrentes

### Leadster

> ⚠️ Dados do trial levantado em sessão anterior — reinserir após revisão com Bruno.

| Plano | Preço/mês | Leads/mês | Observações |
|---|---|---|---|
| ??? | R$ ??? | ??? | ??? |

**Vantagens da Leadster sobre CitraChat:**
- Interface mais madura e polida
- Base estabelecida no mercado BR
- Mais templates prontos por segmento
- _[completar com outros pontos da análise]_

**Vantagens do CitraChat sobre Leadster:**
- IA conversacional real — não fluxo condicional disfarçado de chat
- Treinamento por PDF/documentos (Leadster não tem)
- 7 eventos de rastreamento padronizados — GTM, Google Ads, Meta, TikTok, LinkedIn, tudo no painel sem código
- Templates GTM exportáveis prontos para importar
- Lead scoring automático com análise IA
- Criado por agência de performance — entende conversão e mídia paga de verdade
- Foco BR/PT — preço em real, suporte em português
- Modelo mais flexível: SAC, FAQ, leads, agendamento, suporte
- _[completar]_

### Typebot

| Plano | Preço/mês |
|---|---|
| Free | US$ 0 |
| Starter | US$ 39 (~R$ 226) |
| Pro | US$ 89 (~R$ 516) |

Posição: fluxos visuais, não IA real. Público técnico. Favorável ao CitraChat no argumento de inteligência.

### ManyChat

| Plano | Preço |
|---|---|
| Free | US$ 0 / até 1.000 contatos |
| Pro | A partir de US$ 15/mês |

Posição: automatizador de WhatsApp/Instagram. Não é concorrente direto.

---

## 10. Decisão — 2026-06-22

**Fase inicial (primeiros clientes):** manter Starter e Pro nos preços atuais e monitorar consumo real antes de qualquer reajuste. Objetivo é mapear utilização média real por plano.

**Ajuste imediato — Business:** elevado de R$1.497 para **R$1.997/mês** — margem de 68,4% garantida mesmo a 100% de utilização das 7.000 conversas. Volumes e recargas sem alteração por enquanto.

**Preços vigentes após ajuste:**

| Plano | Preço | Conversas | Agentes | Margem (100% util) |
|---|---|---|---|---|
| Starter | R$ 147/mês | 300/mês | 1 | 70% ✅ |
| Pro | R$ 297/mês | 1.000/mês | 3 | 63% ⚠️ (monitorar) |
| Business | **R$ 1.997/mês** | 7.000/mês | 10 | **68% ✅** |
| Agência | Lista de espera | — | — | — |

**Recargas (sem alteração agora — revisar após primeiros dados de uso):**

| Recarga | Preço | Conv | Margem atual |
|---|---|---|---|
| Starter | R$ 29 | +100 | 72% ✅ |
| Pro | R$ 59 | +300 | 59% ⚠️ |
| Business | R$ 99 | +1.000 | 18% 🚨 (revisar assim que houver clientes usando) |

**Próximos passos:**
- [x] Documentar decisão neste arquivo
- [x] Atualizar base de conhecimento do agente de suporte (TXT)
- [ ] Atualizar página `/planos` no site (`src/app/planos/page.tsx`)
- [ ] Atualizar produto Business no Stripe (R$1.997)
- [ ] Após primeiros 2–3 meses: revisar Pro e recarga Business com dados reais de uso

---

## 11. Histórico de revisões

| Data | O que mudou |
|---|---|
| 2026-06-22 v1 | Arquivo criado. |
| 2026-06-22 v2 | Análise completa com todos os 6 pontos de consumo de API mapeados (Haiku + Sonnet). Custo total por plano calculado. Análise de utilização do Business. Três opções de ajuste documentadas. |
| 2026-06-22 v3 | Decisão registrada: Business ajustado para R$1.997/mês (68,4% margem no pior caso). Starter e Pro mantidos para monitorar uso real. |
