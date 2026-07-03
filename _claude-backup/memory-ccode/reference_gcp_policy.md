---
name: Política de chave de Service Account no projeto makelemonad-drive-mcp
description: Org policy iam.disableServiceAccountKeyCreation foi desativada nesse projeto pra permitir gerar chaves JSON
type: reference
originSessionId: e07a4ab4-587b-4e25-b0f9-8d80a07ea67d
---
**Política:** `iam.disableServiceAccountKeyCreation` (legada)
**Projeto afetado:** `makelemonad-drive-mcp`
**Estado atual:** "Substituir política do recurso pai" → regra "Não aplicada" (desativada apenas nesse projeto, resto da organização continua com a restrição herdada)

**Caminho no console:**
https://console.cloud.google.com/iam-admin/orgpolicies/iam-disableServiceAccountKeyCreation?project=makelemonad-drive-mcp

**Como reverter (endurecer de volta):** Gerenciar política → "Herdar política do recurso pai" → Definir política. Isso reativa a restrição e impede criação de novas chaves JSON (chaves existentes continuam funcionando).

**Nota:** Existe também a versão nova `iam.managed.disableServiceAccountKeyCreation`. Não precisou mexer nela — a legacy bastou.

**Contexto:** Política foi desativada em 2026-04-17 pra criar a chave do Service Account `briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com`. Depois que o app briefing estiver estável, pode considerar reativar (a chave já emitida continua válida).
