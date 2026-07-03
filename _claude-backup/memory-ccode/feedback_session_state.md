---
name: Preservar estado entre sessões proativamente
description: Bruno perde contexto ao fechar o VS Code; sempre documentar ponto de parada em tarefas.md
type: feedback
originSessionId: e07a4ab4-587b-4e25-b0f9-8d80a07ea67d
---
Ao final de qualquer trabalho multi-etapas (ou quando a sessão parecer que pode ser interrompida), atualizar `ccos-make/tarefas.md` com uma seção **"Onde paramos"** contendo: status do projeto, o que está pronto, próximos passos em ordem, e pendências de decisão.

**Why:** Bruno expressou frustração explícita em 2026-04-16 ao perceber que fechar o VS Code apaga o contexto da conversa com o Claude. Ele não lembra quais etapas já passaram. Não é desenvolvedor profissional, então reconstruir mentalmente o estado do trabalho a partir do código é difícil.

**How to apply:** (1) Sempre que concluir uma etapa intermediária de um trabalho maior, registrar em `tarefas.md`. (2) Ao retomar uma sessão nesse workspace, checar `tarefas.md` seção "Onde paramos" ANTES de perguntar onde paramos. (3) Mencionar `/resume` pro Bruno quando ele disser que perdeu contexto — é o mecanismo nativo do Claude Code pra retomar conversas.
