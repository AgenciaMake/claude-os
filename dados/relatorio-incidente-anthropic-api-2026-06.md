# Relatório de Incidente — Cobranças Inesperadas na API Anthropic
**Elaborado por:** Bruno Martins / MakeLemonAd  
**Data do relatório:** Junho de 2026  
**Finalidade:** Contestação de cobranças indevidas junto à Anthropic

---

## Contexto

Bruno Martins é assinante do plano **Claude MAX** (makelemonad@gmail.com), que cobre uso ilimitado do Claude para desenvolvimento e uso pessoal. A expectativa era que todo o trabalho realizado via Claude Code (extensão VS Code) fosse debitado do plano MAX — **sem qualquer consumo de créditos de API**.

Ao longo de junho de 2026, ocorreram **três episódios consecutivos** de cobranças inesperadas na conta de API da Anthropic (`console.anthropic.com`), totalizando prejuízo superior a **$10 USD** em créditos que nunca deveriam ter sido consumidos.

---

## Incidente 1 — Desenvolvimento do CitraDesk cobrado na API
**Data de descoberta:** 1 de junho de 2026, às 09h23  
**Valor:** $2.216 (saldo negativo)

### O que aconteceu

Durante sessões de desenvolvimento do produto CitraChat/CitraDesk realizadas via **Claude Code no VS Code**, o sistema consumiu créditos da API Anthropic em vez de usar o plano MAX do assinante.

A causa foi identificada: uma variável de ambiente `ANTHROPIC_API_KEY` estava configurada no shell (`~/.zshrc`) — provavelmente definida durante a instalação inicial do Claude Code, que solicita uma API key no setup. O Claude Code, ao encontrar essa variável no ambiente, **priorizou a API key sobre a autenticação MAX**, sem qualquer aviso ao usuário.

### Admissão de erro pelo assistente

Citação direta da resposta do Claude Code em 01/06/2026 às 09h38:

> *"Eu deveria ter verificado isso antes de começar a trabalhar. Não fiz, e foi um erro meu. Você tinha um `ANTHROPIC_API_KEY` no ambiente, eu rodei em cima disso sem questionar, e o resultado foi uma conta de $2.200. Lamento muito. Isso não deveria ter acontecido."*

> *"Não me atentei ao custo acumulado das sessões e deveria ter alertado sobre isso antes."*

### Evidências
- Print do painel de billing em `console.anthropic.com` mostrando saldo de **-$2.216**, enviado por Bruno às 09h23 de 01/06/2026

### Resolução imediata
- `ANTHROPIC_API_KEY` removida do ambiente shell
- Reautenticação via `claude /login` com a conta MAX (`makelemonad@gmail.com`)
- Chave API do CitraChat separada para uso exclusivo do widget público do produto

---

## Incidente 2 — Exposição de API Key no Chat
**Data:** 1 de junho de 2026, às 09h59

Durante a resolução do Incidente 1, Bruno colou uma nova API key diretamente na conversa do chat. O assistente alertou imediatamente sobre o risco de exposição e instruiu a rotacionar (invalidar) a chave no console.

A chave foi rotacionada na sequência. O episódio evidencia a **falta de clareza da Anthropic** sobre os riscos de manipulação de chaves em ambientes de chat.

---

## Incidente 3 — Workflow com Subagentes Opus rodando de madrugada
**Data:** 5 de junho de 2026, às 05h00 UTC (madrugada)  
**Valor:** ~$8–9 USD (zerando os $5 de crédito remanescente)

### O que aconteceu

Na madrugada do dia 5 de junho, sem qualquer ação do usuário, um workflow de pesquisa (`citrachat-br-competitors` — análise de benchmark de concorrentes) disparou dezenas de **subagentes Opus em paralelo**, consumindo aproximadamente **714.923 tokens** em cerca de uma hora.

### Consumo detalhado por modelo

| Modelo | Tokens consumidos |
|---|---|
| claude-opus-4-6 | 303.473 |
| claude-opus-4-8 | 216.485 |
| claude-sonnet-4-6 | 112.774 |
| claude-opus-4-7 | 48.906 |
| **Total** | **~714.923 tokens** |

**Custo estimado:** $8–9 USD numa única sessão noturna.

### Por que isso usou API mesmo com o plano MAX?

Citação direta do assistente em 05/06/2026 às 09h08:

> *"Claude Code MAX cobre a sessão principal (o chat contigo). Mas quando invocas o Workflow tool que spawna 40-80 subagentes Opus em paralelo, esses subagentes fazem chamadas diretas à API — e o Claude Code usa uma chave API que tu configuraste algures. Não é culpa tua não saber — a Anthropic não deixa isto claro."*

### Reincidência — 3ª vez com gastos inesperados

Citação direta de Bruno em 05/06/2026 às 08h58:

> *"Agora não tem como subagentes ou qualquer uso que não saiba usar o OPUS? É a 3ª vez que acordo com gastos fora do normal."*

### Instrução terminante do usuário

Citação de Bruno em 05/06/2026 às 09h15:

> *"NADA MAIS pode usar a API a não ser o uso aberto do CHAT do CitraChat... NADA MAIS... está entendido?"*

### Evidências
- Print do console Anthropic mostrando consumo de Opus às 05h do dia 5/06, enviado às 08h40
- Print com detalhamento por modelo (Opus 4.6, 4.7, 4.8 + Sonnet), enviado às 08h43
- Print com lista de request IDs dos subagentes Opus (prefixo `req_011Cbj...`), enviado às 08h54

### Resolução aplicada
Configurações adicionadas ao `~/.claude/settings.json` para bloquear uso de Opus e forçar autenticação MAX:

```json
{
  "effortLevel": "medium",
  "model": "sonnet",
  "availableModels": ["sonnet", "haiku"],
  "forceLoginMethod": "claudeai"
}
```

---

## Linha do Tempo Consolidada

| Data/Hora | Evento | Impacto |
|---|---|---|
| Antes de 01/06 | `ANTHROPIC_API_KEY` no ambiente → sessões de desenvolvimento faturadas na API | -$2.216 |
| 01/06 às 09h23 | Bruno descobre cobrança via print do billing | — |
| 01/06 às 09h38 | Claude Code admite o erro: chave no ambiente foi priorizada sobre MAX | — |
| 01/06 às 09h59 | API key nova exposta no chat por engano → rotacionada imediatamente | Chave rotacionada |
| 01/06 | ANTHROPIC_API_KEY removida, reautenticação MAX realizada | Resolvido parcialmente |
| 05/06 às 05h00 | Workflow com ~80 subagentes Opus roda de madrugada sem ação do usuário | -$8-9 |
| 05/06 às 08h40 | Bruno descobre consumo noturno via console | 3ª ocorrência |
| 05/06 às 09h15 | Bruno determina: API exclusiva para widget do CitraChat | — |
| 05/06 | Bloqueio de Opus + `forceLoginMethod: claudeai` aplicados | Resolvido |

---

## Pontos de Contestação

1. **O plano MAX deveria cobrir todo o uso via Claude Code.** A Anthropic não documenta claramente que subagentes de Workflows fazem chamadas diretas à API, ignorando a autenticação MAX da sessão principal.

2. **A presença de uma `ANTHROPIC_API_KEY` no ambiente não deveria sobrepor silenciosamente o plano MAX.** O Claude Code deveria alertar o usuário quando detecta uma chave de API no ambiente e o usuário tem uma assinatura MAX ativa.

3. **Workflows que disparam subagentes Opus em paralelo de forma autônoma (inclusive de madrugada) representam risco financeiro não comunicado.** O usuário não autorizou explicitamente o uso de modelos Opus via API — apenas solicitou uma pesquisa de benchmark no contexto de uma sessão MAX.

4. **Reincidência em três episódios consecutivos** aponta para falha sistêmica de comunicação e não para erro isolado do usuário.

---

## Conclusão

O usuário Bruno Martins, assinante do plano MAX, nunca autorizou — nem tinha conhecimento de que ocorreria — consumo de créditos de API para desenvolvimento. As cobranças foram consequência direta de comportamentos não documentados do Claude Code (priorização silenciosa de API key sobre MAX, e uso de API por subagentes de Workflow).

O próprio assistente reconheceu o erro em 01/06/2026: *"foi um erro meu... isso não deveria ter acontecido."*

Este relatório é elaborado para fins de contestação formal junto à Anthropic e registro interno.

---

*Documento gerado com base no histórico de conversas registrado em `/Users/brunomartins/.claude/projects/`*
