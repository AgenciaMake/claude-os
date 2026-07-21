---
name: citrachat-mapa-disparos
description: Mapa de eventos de tracking e disparos de e-mail por tipo de agente no CitraChat
metadata: 
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-07-21T23:08:46.570Z
---

# Mapa de Disparos — CitraChat

Referência de quando cada evento de tracking e e-mail de notificação é disparado, por tipo de agente.

## Por tipo de agente

| Tipo | objective_type | Tracking event | E-mail | Gatilho |
|---|---|---|---|---|
| Captação de Lead | `lead_capture` | `lead_qualified` | ✓ | Agente chama `encerrar_atendimento` |
| Intenção de Compra | `sales` | `lead_qualified` | ✓ | Agente chama `encerrar_atendimento` |
| Agendamento | `appointment` | `lead_qualified` | ✓ | Agente chama `encerrar_atendimento` |
| Suporte / SAC | `support` | `issue_resolved` | ✓ | Agente chama `encerrar_atendimento` |
| FAQ / Autoatendimento | `faq` | `issue_resolved` | ✓ | Agente chama `encerrar_atendimento` |
| Recepcionista | `receptionist` | `lead_qualified` | ✓ | Agente chama `encerrar_atendimento` |

## Evento transversal (qualquer tipo)

| Evento | Tracking event | E-mail | Gatilho |
|---|---|---|---|
| Pedido de humano | `human_requested` | ✓ (imediato) | Usuário digita frase de solicitação de humano (1x por sessão) |

## Como funciona a ferramenta encerrar_atendimento

- O agente chama silenciosamente quando tem o que precisa (nome + contato para leads; chamado resolvido para suporte; agendamento confirmado para appointment)
- Backend detecta o tool call e seta o header `X-CitraChat-Event`:
  - `support` / `faq` → `support_closed`
  - demais → `lead_closed`
- Frontend recebe o evento, dispara o tracking certo e envia POST para `/api/notify-lead` com histórico completo
- Se o usuário voltar a conversar e o agente encerrar de novo → novo e-mail é enviado com histórico atualizado

## Arquivos envolvidos

- Ferramenta e header: `src/app/api/chat/route.ts`
- Instrução pro agente: `src/lib/agents/build-system-prompt.ts`
- Evento + disparo de e-mail: `src/components/chat/ChatInterface.tsx`
- E-mail de notificação: `src/app/api/notify-lead/route.ts`
