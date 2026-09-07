---
name: citradesk-projetos-pontuais
description: "CitraDesk ganhou o tipo 'Projeto pontual' (Project), separado de Cliente recorrente, com schema diferente no briefing_lookup"
metadata: 
  node_type: memory
  type: project
  originSessionId: 206eb368-7a01-4455-90d2-d3c2e272a0e2
  modified: 2026-09-07T13:00:17.397Z
---

Em 2026-09-07, o CitraDesk ganhou um segundo modelo de engajamento além do `Client` recorrente: `Project` (projeto pontual — ex: um trabalho de branding fechado, sem contrato recorrente). Primeiro caso real: Fábio Sassaki, branding de uma padaria de rodovia, código `MK-089MM`.

O `briefing_lookup/{code}` de um projeto pontual tem campos diferentes do cliente recorrente:
- `type: "project"` (marca qual formato é)
- `clientName` (não `name`), `projectName`, `projectContext` (não `contractSummary`), `clientServices` (array, não `services` string), `clientContacts` (array, não `contacts` string já joinada)
- Não tem `responsible` nem `services` no sentido dos produtos recorrentes (Make 360/Performance/Social/Dev)

**Why:** O backend do Alfred (`apps/briefing/functions/api/chat.js` e `generate-docx.js`) só sabia ler o schema de `Client`. Quando o Fábio testou o briefing, o Alfred não sabia o nome dele e perguntava "com quem estou falando" de forma genérica, e também tentava forçar o projeto de branding numa categoria "Make X" que não existe pra esse caso.

**How to apply:** Corrigido em `apps/briefing/functions/_lib/firestore-client.js` — nova função `normalizeBriefingClient(raw)` detecta `raw.type === 'project'` e mapeia os campos pro formato que `prompt.js`/`save-doc.js`/`docx-builder.js` esperam (`name`, `services`, `responsible`, `contacts`, `contractSummary`, `projectName`). `chat.js` e `generate-docx.js` agora sempre passam pelo normalizador antes de usar `client.*`. `prompt.js` ganhou uma regra pra não forçar produtos recorrentes quando for projeto pontual, e um bloco de perguntas específico pra Branding/Naming/Identidade Visual.

Relacionado: [[citradesk_briefing_lookup_regras_seguranca]], [[feedback_alfred_privacidade_abertura]].
