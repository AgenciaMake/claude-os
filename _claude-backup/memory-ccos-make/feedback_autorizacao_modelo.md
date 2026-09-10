---
name: feedback-autorizacao-modelo
description: Senha que Bruno usa na conversa para autorizar troca de modelo além de Sonnet/Haiku
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 4d2cfc8a-f155-4f7f-bbd9-f552019ca4f0
  modified: 2026-09-10T14:05:21.817Z
---

Para autorizar o uso de Opus, Fable ou outro modelo restrito, Bruno inclui a palavra **brunomdois** na mesma mensagem em que pede a tarefa.

**Fluxo quando a senha aparece:**
1. Rodar `claude-liberar-modelos` via Bash tool (sem precisar de senha — sudoers já configurado)
2. Executar a tarefa com o modelo solicitado
3. Ao final, rodar `claude-restringir-modelos` via Bash tool

**Why:** o managed-settings.json bloqueia modelos no nível do runtime; a senha na conversa é a única forma de destravar sem Bruno ir ao terminal.

**How to apply:** verificar se a palavra está presente na mensagem atual antes de qualquer troca de modelo. Autorização não se carrega para a próxima mensagem.
