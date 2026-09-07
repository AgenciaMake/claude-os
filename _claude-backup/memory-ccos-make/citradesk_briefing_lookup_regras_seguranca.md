---
name: citradesk-briefing-lookup-regras-seguranca
description: "Regras do Firestore em briefing_lookup: create exige auth, update é público só em doc existente, delete exige auth"
metadata: 
  node_type: memory
  type: project
  originSessionId: 206eb368-7a01-4455-90d2-d3c2e272a0e2
  modified: 2026-09-07T13:00:03.477Z
---

Em 2026-09-04, uma auditoria de segurança encontrou a coleção pública `briefing_lookup` do CitraDesk (usada pelo backend do Alfred, `apps/briefing`) com regra `if true` — qualquer pessoa podia escrever em qualquer código de briefing. Bruno corrigiu em 2026-09-07 com uma regra que separa por operação:

- **create** — exige autenticação (só o próprio CitraDesk, autenticado, cria códigos novos).
- **update** — público se o documento já existe (`resource != null`). O código do briefing funciona como a própria credencial: ninguém escreve num código que a agência não criou primeiro.
- **delete** — exige autenticação.

**Why:** A correção inicial (fechar tudo pra autenticado) quebrou o `markBriefingCompleteLookup` do Alfred, que faz PATCH sem auth pra marcar o briefing como concluído e salvar resumo/transcrição — esse é o único jeito de o Alfred (que roda sem login de usuário) terminar um briefing. A regra final resolve os dois lados: fecha a brecha de escrita arbitrária e mantém o fluxo do Alfred funcionando.

**How to apply:** Se qualquer escrita pública (unauthenticated PATCH/fetch) no `briefing_lookup` começar a dar 403, checar primeiro se o documento-alvo já existe (`update` exige isso) antes de suspeitar de outra coisa. Não tentar "resolver" reabrindo `create`/`delete` pra público — a intenção é exatamente mantê-los fechados.
