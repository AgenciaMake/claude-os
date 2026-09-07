---
name: feedback-google-drive-createfolder-parent
description: mcp__google-drive__createFolder só aceita name e parent; driveId/parentId são ignorados silenciosamente
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 206eb368-7a01-4455-90d2-d3c2e272a0e2
  modified: 2026-09-07T10:33:13.032Z
---

A ferramenta `mcp__google-drive__createFolder` tem schema `{ name, parent }`. Não existe `driveId` nem `parentId`. Se você passar esses nomes (por hábito de outras APIs do Drive, ou por copiar de doc antigo), a chamada retorna sucesso normalmente, mas ignora o parâmetro desconhecido e cria a pasta solta na raiz do "Meu Drive" pessoal — fora de qualquer Shared Drive, sem erro nenhum pra avisar.

**Why:** Aconteceu em produção no onboarding do cliente Fábio Sassaki (2026-09-07): 18 pastas foram criadas soltas em "Meu Drive" porque usei `parentId`/`driveId`. Precisou apagar tudo e recriar. A skill [[novo-cliente]] tinha essa instrução errada desde a origem (nunca tinha sido testada contra o schema real da ferramenta).

**How to apply:**
- Sempre usar só `parent: "{ID da pasta-mãe}"` — o Drive API resolve o Shared Drive sozinho a partir do parent.
- Depois de criar a primeira pasta de qualquer lote (principal de um cliente, por exemplo), confirmar o local antes de criar as subpastas: `mcp__google-drive__search` com `rawQuery: true`, query `"'{ID_PASTA_MAE}' in parents and name = '{NOME}' and trashed = false"`. Se vier vazio ou com `path: Meu Drive`, parou no lugar errado.
- Já corrigido em `.claude/skills/novo-cliente/SKILL.md` (Passos 2 e 3) com essa mesma instrução de verificação obrigatória.
