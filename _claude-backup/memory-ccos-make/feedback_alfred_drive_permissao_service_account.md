---
name: feedback-alfred-drive-permissao-service-account
description: Service account do Alfred não herda permissão de subpastas de cliente no Shared Drive; precisa de permissão explícita + ID salvo no Firestore
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 206eb368-7a01-4455-90d2-d3c2e272a0e2
---

O app de briefing (Alfred, em `apps/briefing/`) usa uma service account própria (`briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com`) pra ler/escrever no Google Drive da Make. Essa conta tem permissão concedida no nível do Shared Drive `00. MAKELEMONAD` e herda até a pasta `02. CLIENTES`, mas a herança **não propaga de forma confiável** pras subpastas de cada cliente (ex: `{número}. {Nome}/03. Materiais do Cliente`). Na prática isso significa:
- `files.list` (buscar pasta por nome) retorna vazio pra essa service account nas subpastas de cliente, mesmo com `supportsAllDrives`/`includeItemsFromAllDrives`/`corpora` configurados certos.
- Até `files.get`/upload direto por ID falha com 404 se a subpasta específica não tiver uma permissão explícita.

**Why:** Causou o erro "Pasta do cliente não encontrada no Drive" tanto no recurso de anexo do Alfred quanto (potencialmente, de forma silenciosa) no salvamento do Doc de briefing ao concluir a entrevista. Só resolveu depois de rodar `mcp__google-drive__addPermission` (role writer) direto na pasta "03. Materiais do Cliente" específica do cliente.

**How to apply:** Pra todo cliente novo, a skill [[novo-cliente]] (`.claude/skills/novo-cliente/SKILL.md`) agora exige, logo após criar a pasta "03. Materiais do Cliente":
1. `addPermission` explícita nessa pasta pra `briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com` (role writer).
2. Gravar o ID dessa pasta no campo `materialsFolderId` do doc `tenants/makelemonad/briefing_lookup/{briefingCode}` no Firestore (PATCH REST sem autenticação, é uma coleção pública).

O código em `apps/briefing/functions/_lib/save-doc.js` (`resolveMaterialsFolderId`) agora prioriza esse campo do Firestore em vez de buscar a pasta por nome — a busca por nome só é fallback e não é confiável.

Firebase do CitraDesk/Alfred: projeto `gen-lang-client-0548502624`, banco `bdmakegestorpro`, tenant `makelemonad`.
