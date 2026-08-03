---
name: feedback-github-contas
description: "Separação de contas GitHub: brunomdois (pessoal), AgenciaMake (Citra). Nunca misturar."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-08-03T18:22:22.265Z
---

Existem múltiplas contas GitHub configuradas no gh CLI e elas não devem se misturar:

- **brunomdois** — conta pessoal do Bruno, projetos pessoais
- **AgenciaMake** — organização da Make; donos dos repos CitraChat, CitraDesk e outros produtos Citra

**Why:** o gh CLI pode trocar a conta ativa (ex: ao fazer login com conta pessoal), e um push com a conta errada falha com "Repository not found" — como aconteceu em 2026-08-03.

**How to apply:** antes de qualquer `git push` em `produtos/citrachat/codigo/` ou `produtos/citradesk/codigo/`, verificar que a conta ativa é `AgenciaMake`:
```bash
gh auth switch --user AgenciaMake
git push origin <branch>
```
Nunca usar `--user brunomdois` nesses repos. Nunca misturar as contas entre projetos.
