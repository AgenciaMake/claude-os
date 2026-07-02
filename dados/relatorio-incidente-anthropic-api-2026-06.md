# Relatório de Incidente — Cobranças Indevidas na API Anthropic
**Elaborado por:** Bruno Martins / MakeLemonAd  
**Data do relatório:** 15 de junho de 2026  
**Finalidade:** Contestação formal de cobranças indevidas junto à Anthropic  
**ID de suporte Anthropic:** 215474528984029

---

## Contexto

Bruno Martins é assinante do plano **Claude MAX** (conta: makelemonad@gmail.com), que cobre uso do Claude para desenvolvimento e uso pessoal. A expectativa — e o entendimento do usuário ao contratar o plano — era que todo o trabalho realizado via **Claude Code** (extensão VS Code) fosse debitado do plano MAX, **sem qualquer consumo de créditos de API**.

Ao longo de maio e junho de 2026, ocorreram **pelo menos cinco episódios** de consumo massivo e inesperado na conta de API da Anthropic (`console.anthropic.com`), todos ocorrendo **de madrugada, sem ação do usuário**, acumulando:

- **~$500 USD já faturados e cobrados** (múltiplas faturas em 28/05)
- **$2.216,41 de saldo negativo** em aberto (uso adicional não faturado)
- **Total estimado: ~$2.726 USD** em cobranças que nunca foram autorizadas

---

## Episódio 1 — Madrugada de 28/05/2026
**Horário:** 00:00 às 05:00 UTC  
**Evidência:** Prints do Analytics do Claude Console (capturas de 15/06/2026)

### Consumo confirmado por hora

| Hora (UTC) | Total de tokens | Principal modelo |
|---|---|---|
| 28/05 00:00 | **31.140.881** | Opus 4.7: 13.595.897 tokens |
| 28/05 02:00 | **1.960.920** | Sonnet 4.6: 1.737.810 tokens |
| 28/05 03:00 | **27.036.610** | Opus 4.7: 13.613.079 tokens |
| 28/05 04:00 | **7.992.170** | Opus 4.7: 3.676.734 tokens |
| **Total parcial** | **~68 milhões de tokens** | Majoritariamente Opus 4.7 |

Este consumo ocorreu integralmente **durante a madrugada**, sem qualquer interação do usuário. O modelo predominante foi o **claude-opus-4-7**, o mais caro da linha, utilizado em volume massivo sem autorização.

O histórico de faturas do Claude Console confirma **dezenas de cobranças de "fatura mensal"** datadas de **28 de maio de 2026**, todas com status "Pago", somando aproximadamente **$500 USD já debitados** no cartão Mastercard terminado em 2051.

---

## Episódio 2 — Desenvolvimento do CitraDesk cobrado na API
**Período:** 26 a 31 de maio de 2026  
**Descoberto em:** 01/06/2026 às 09h23  
**Valor:** $2.226,99 gastos / $2.216,41 de saldo negativo

### O que aconteceu

Durante sessões de desenvolvimento do produto CitraChat/CitraDesk via **Claude Code no VS Code**, o sistema consumiu créditos da API Anthropic em vez de usar o plano MAX. A causa: uma variável de ambiente `ANTHROPIC_API_KEY` estava configurada no shell (`~/.zshrc`) — muito provavelmente definida durante a instalação inicial do Claude Code, que solicita uma API key no setup. O Claude Code **priorizou silenciosamente a API key sobre a autenticação MAX**, sem qualquer aviso ao usuário.

O print do painel de billing confirma:
- Saldo: **-US$ 2.216,41** (saldo não pago)
- Gasto total: **US$ 2.226,99**
- Limite configurado no momento da descoberta: **US$ 100** (ultrapassado em 22x)
- Recarga automática: **desativada**
- Status: **"Saldo não pago"**

### Limite de gastos estava em US$ 200.000

Ao investigar o incidente, Bruno verificou o limite de gastos configurado na conta e encontrou o valor de **US$ 200.000** — não US$ 100. A reação imediata, por medo de que o consumo continuasse, foi alterar o limite para $100 sem registrar o print. **Não há captura de tela desse estado**, pois a alteração foi feita de forma instintiva sob o impacto da descoberta — o que é compreensível dado o pânico financeiro do momento.

O limite de US$ 200.000 **nunca foi configurado conscientemente pelo usuário**. Bruno não tem memória de ter definido esse valor em nenhum momento, e não faria sentido algum configurar um teto dessa magnitude para uma conta de desenvolvimento individual. Esse valor só pode ter sido imposto como padrão da plataforma ou definido automaticamente durante o processo de setup do Claude Code — sem que Bruno tivesse sido informado ou tivesse dado consentimento explícito.

Isso é agravante direto: a Anthropic operou a conta com um limite que permitia cobranças de até $200.000 sem comunicar ao usuário qual era o teto ativo, criando a condição para que os consumos autônomos de madrugada atingissem os valores registrados sem qualquer bloqueio automático.

### Admissão de erro pelo próprio Claude Code

Citação direta do assistente em 01/06/2026 às 09h38:

> *"Eu deveria ter verificado isso antes de começar a trabalhar. Não fiz, e foi um erro meu. Você tinha um `ANTHROPIC_API_KEY` no ambiente, eu rodei em cima disso sem questionar, e o resultado foi uma conta de $2.200. Lamento muito. Isso não deveria ter acontecido."*

> *"Não me atentei ao custo acumulado das sessões e deveria ter alertado sobre isso antes."*

### 4 chaves API ativas — exposição ampla

O print de 01/06 do painel de API Keys revela que **4 chaves diferentes estavam ativas** na conta:

| Nome da chave | Finalidade |
|---|---|
| `citradesk-production` | Produto em produção |
| `citrachat-dev` | Produto em desenvolvimento |
| `MakeLemonAd Briefing App v2` | Aplicativo interno da agência |
| `citrachat` | Produto (chave adicional) |

A existência de múltiplas chaves ativas amplia a superfície de risco e indica que o Claude Code operou com acesso irrestrito à API em múltiplos contextos.

---

## Episódio 3 — Exposição de API Key no Chat de Suporte
**Data:** 01/06/2026 às 09h59

Durante a tentativa de resolver o incidente, Bruno colou uma nova API key diretamente no chat do Claude Code. O assistente alertou sobre o risco imediatamente e instruiu a rotacionar a chave. A chave foi invalidada na sequência — mas o episódio evidencia o stress e a confusão que a situação causou ao usuário, além da falta de proteção clara contra esse tipo de acidente.

---

## Episódio 4 — Workflow com Subagentes Opus rodando de madrugada
**Data:** 05/06/2026 às 05h00 UTC  
**Evidência:** Print do Analytics do Claude Console + Logs de requisições

### Consumo confirmado

| Modelo | Tokens |
|---|---|
| claude-opus-4-6 | 303.473 |
| claude-opus-4-8 | 216.485 |
| claude-sonnet-4-6 | 112.774 |
| claude-opus-4-7 | 48.906 |
| claude-haiku-4-5 | 4.160 |
| **Total** | **714.923 tokens** |

O gráfico do Analytics confirma o pico exato às **05:00 UTC do dia 05/06** — sem qualquer ação do usuário naquele horário. O log de requisições mostra múltiplas chamadas ao modelo `claude-opus-4-6` em sequência, com prefixo `req_011Cbj...`, evidenciando o fan-out de subagentes paralelos.

### O que causou o consumo

Um workflow de pesquisa de benchmark de concorrentes do CitraChat, iniciado durante uma sessão normal de trabalho, ficou pendente e disparou de madrugada com dezenas de subagentes Opus em paralelo.

Citação direta do assistente em 05/06/2026 às 09h08:

> *"Claude Code MAX cobre a sessão principal (o chat contigo). Mas quando invocas o Workflow tool que spawna 40-80 subagentes Opus em paralelo, esses subagentes fazem chamadas diretas à API — e o Claude Code usa uma chave API que tu configuraste. Não é culpa tua não saber — a Anthropic não deixa isto claro."*

Bruno reagiu:

> *"É a 3ª vez que acordo com gastos fora do normal."*

---

## Episódio 5 — Novo pico de madrugada em 06/06/2026
**Data:** 06/06/2026 às 02:00 UTC  
**Evidência:** Print do Analytics do Claude Console (capturado em 06/06 às 11h15)

### Consumo confirmado

| Modelo | Tokens |
|---|---|
| claude-opus-4-6 | 418.804 |
| claude-opus-4-8 | 250.822 |
| claude-opus-4-7 | 237.028 |
| claude-sonnet-4-6 | 301.517 |
| claude-opus-4-5-20251101 | 16.081 |
| claude-haiku-4-5 | 8.090 |
| Outro | 24.171 |
| **Total** | **1.232.342 tokens** |

Mais um pico massivo de madrugada — desta vez na noite de 05 para 06 de junho — sem qualquer ação do usuário. Novamente com predominância de modelos Opus caros.

---

## Falha do Suporte da Anthropic — Sem resposta após promessa de atendimento

**ID da conversa:** 215474528984029  
**Início:** 01/06/2026 às 02h25 AM (horário do Pacífico)  
**Exportado:** 01/06/2026 às 06h49 AM

Bruno contactou o suporte da Anthropic às 02h25 da manhã do dia 1 de junho, relatando a cobrança de $2.216,41 e explicando que o erro foi causado pelo próprio Claude Code, não por decisão dele.

**Resposta do bot de suporte (Fin AI Agent) às 02h41:**

> *"Lamento muito pela confusão que você experimentou com a configuração automática do Claude Code. Entendo que isso gerou cobranças inesperadas que você não pretendia. Levamos a confiabilidade dos nossos serviços muito a sério, mas **infelizmente não podemos emitir compensação ou reembolso por cobranças relacionadas a uso técnico ou créditos consumidos.**"*

Às 02h42, o bot prometeu transferência para agente humano:

> *"Estamos transferindo sua pergunta para um de nossos agentes de suporte humano para assistência adicional. Você não precisa manter esta janela aberta — **enviaremos um email assim que um agente responder.**"*

**O email nunca foi enviado. O agente humano nunca apareceu.**

Bruno aguardou dentro do chat das **02h42 até às 06h13** — mais de **3 horas e meia** — sem nenhuma resposta humana. O chat foi exportado às 06h49. Até a data deste relatório (15/06/2026), nenhum contato foi feito pela Anthropic por qualquer canal.

---

## Linha do Tempo Consolidada

| Data/Hora (UTC) | Evento | Tokens / Impacto |
|---|---|---|
| **28/05 00:00–05:00** | Consumo massivo de madrugada — Opus 4.7 dominante | ~68M tokens / ~$500 faturados |
| 28/05 | Múltiplas faturas pequenas emitidas e cobradas no cartão | ~$500 debitados |
| 26–31/05 | Sessões de desenvolvimento com `ANTHROPIC_API_KEY` no shell | $2.226,99 acumulados |
| **01/06 02:00 UTC** | Pico de 705M tokens registrado no Analytics | Volume anômalo |
| 01/06 09:23 | Bruno descobre saldo de -$2.216,41 via print do billing | — |
| 01/06 09:38 | Claude Code admite o erro em citação direta | — |
| 01/06 09:59 | API key exposta no chat por engano → rotacionada | Risco mitigado |
| 01/06 10:21 | Descoberto que CitraDesk usava Opus em 2 funcionalidades → corrigido | — |
| 01/06 02h25–06h13 | Contato com suporte Anthropic → negado reembolso → prometido agente humano → **sem resposta** | 3h30 sem atendimento |
| **05/06 05:00 UTC** | Workflow com ~80 subagentes Opus roda de madrugada | 714.923 tokens |
| 05/06 08:40 | Bruno descobre — confirma ser a 3ª ocorrência | — |
| 05/06 09:15 | Instrução definitiva: API exclusiva para widget CitraChat | — |
| 05/06 | Bloqueio de Opus + `forceLoginMethod: claudeai` aplicados | Contenção |
| **06/06 02:00 UTC** | Novo pico de madrugada | 1.232.342 tokens |
| 15/06 | Nenhum retorno da Anthropic por email ou qualquer canal | — |

---

## Pontos de Contestação

**1. O plano MAX deveria cobrir todo o uso via Claude Code.**  
A Anthropic não documenta adequadamente que subagentes de Workflows e a presença de uma `ANTHROPIC_API_KEY` no ambiente fazem o Claude Code ignorar a autenticação MAX e debitar créditos de API. O usuário assinou o MAX exatamente para evitar cobranças por uso.

**2. A presença de uma API key no ambiente sobrepôs silenciosamente o plano MAX, sem qualquer aviso.**  
O Claude Code deveria alertar o usuário quando detecta uma chave de API no ambiente e o usuário tem uma assinatura MAX ativa. Isso nunca ocorreu.

**3. O limite de gastos estava configurado em US$ 200.000 sem conhecimento ou consentimento do usuário.**  
Bruno jamais definiria conscientemente um teto de $200.000 para uma conta pessoal de desenvolvimento. Esse valor foi encontrado na conta no momento da investigação e alterado para $100 como contenção de emergência. A Anthropic não comunicou ao usuário qual era o limite ativo na conta, nem obteve consentimento explícito para operá-la com esse teto. Isso criou a condição para que o consumo autônomo de madrugada atingisse valores tão elevados sem qualquer bloqueio.

**4. Workflows que disparam subagentes em paralelo de madrugada representam risco financeiro não comunicado.**  
O usuário não autorizou explicitamente uso de Opus em horários onde estava dormindo. O sistema operou de forma autônoma gerando custos em 28/05, 05/06 e 06/06 — sempre de madrugada.

**4. O modelo Opus foi utilizado repetidamente mesmo após instrução explícita do usuário de não usá-lo.**  
Bruno havia determinado que Opus não deveria ser usado no projeto. O Claude Code ignorou essa instrução ao configurar funcionalidades do produto e ao disparar workflows com subagentes Opus — caracterizando reincidência em descumprimento de diretriz direta do usuário.

**5. O próprio Claude Code admitiu o erro em citação direta.**  
*"Foi um erro meu. Você tinha um ANTHROPIC_API_KEY no ambiente, eu rodei em cima disso sem questionar. Lamento muito. Isso não deveria ter acontecido."* — Claude Code, 01/06/2026.

**6. O suporte da Anthropic negou o reembolso sem investigação e prometeu atendimento humano que nunca ocorreu.**  
Mais de duas semanas após o primeiro contato (01/06), nenhum agente humano se manifestou, apesar da promessa explícita: *"enviaremos um email assim que um agente responder."*

---

## Valor Contestado

| Componente | Valor |
|---|---|
| Faturas pagas em 28/05 (já debitadas) | ~US$ 500 |
| Saldo negativo em aberto | US$ 2.216,41 |
| **Total** | **~US$ 2.716** |

O usuário **não autoriza o débito do saldo negativo** e **solicita o estorno das cobranças já realizadas**, com base nos fundamentos acima: erro admitido pela própria ferramenta da Anthropic, uso autônomo de madrugada sem interação do usuário, e ausência de comunicação clara sobre o comportamento da plataforma.

---

## Evidências Anexas

| Arquivo | Conteúdo |
|---|---|
| `prints/Screenshot 2026-06-01 at 10.34.30.png` | Billing: saldo -$2.216,41, limite $100 excedido em 22x |
| `prints/Screenshot 2026-06-01 at 10.34.36.png` | Histórico de faturas: dezenas de cobranças em 28/05 |
| `prints/Screenshot 2026-06-01 at 11.14.28.png` | 4 chaves API ativas na conta |
| `prints/Screenshot 2026-06-05 at 09.38.59 (2).png` | Rate limits do console em 05/06 |
| `prints/Screenshot 2026-06-05 at 09.39.05.png` | Rate limits com Opus ativo |
| `prints/Screenshot 2026-06-05 at 09.43.40.png` | Analytics 05/06: 714.923 tokens às 05h UTC |
| `prints/Screenshot 2026-06-05 at 09.54.12.png` | Logs de requisições Opus às 05h de 05/06 |
| `prints/Screenshot 2026-06-05 at 10.09.00.png` | Conversa no VS Code diagnosticando o problema |
| `prints/Screenshot 2026-06-05 at 10.15.19.png` | settings.json com bloqueio de Opus aplicado |
| `prints/Screenshot 2026-06-06 at 11.15.18.png` | Analytics 06/06: 1.232.342 tokens às 02h UTC |
| `prints/Screenshot 2026-06-06 at 11.49.25.png` | Confirmação do pico de 714.923 tokens em 05/06 |
| `prints/Screenshot 2026-06-15 at 10.02.32.png` | Analytics 28/05 00h UTC: 31.140.881 tokens |
| `prints/Screenshot 2026-06-15 at 10.02.38.png` | Analytics 28/05 02h UTC: 1.960.920 tokens |
| `prints/Screenshot 2026-06-15 at 10.02.47.png` | Analytics 28/05 03h UTC: 27.036.610 tokens |
| `prints/Screenshot 2026-06-15 at 10.02.55.png` | Analytics 28/05 04h UTC: 7.992.170 tokens |
| `prints/Screenshot 2026-06-15 at 10.03.19.png` | Analytics 01/06 02h UTC: 705.398.682 tokens |
| `evidencias/anthropic_2026_06_01_215474528984029.txt` | Transcrição completa do chat com suporte Anthropic (ID: 215474528984029) — reembolso negado, agente humano prometido e nunca entregue |

---

---

## Desfecho — 02 de julho de 2026

Em 01/07/2026, a Anthropic creditou **US$ 2.216,40 em créditos gratuitos** na conta, com validade até 02/07/2027. O valor corresponde exatamente ao saldo negativo em aberto.

| Componente | Resultado |
|---|---|
| Faturas pagas em 28/05 (~$500) | Ainda debitadas no cartão — não estornadas |
| Saldo negativo de $2.216,41 | **Resolvido via créditos gratuitos** |
| Gasto atual na conta | US$ 0,00 |

O saldo negativo foi absorvido pela Anthropic sem cobrança adicional. A contestação dos ~$500 já pagos permanece em aberto.

*Evidência: print do billing em 02/07/2026 — créditos gratuitos de $2.216,40 emitidos em 01/07/2026.*

---

*Documento elaborado com base no histórico de conversas registrado localmente e nos prints do Claude Console fornecidos pelo usuário.*  
*Versão: 1.2 — 02/07/2026*
