---
name: feedback-sessoes-fora-da-raiz
description: "Abrir VS Code direto numa subpasta (ex. produtos/citrachat) cria projeto Claude Code separado, com memória própria vazia"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 23d6fd7d-13b6-49d0-822a-2d32a6e6b633
  modified: 2026-09-01T09:58:13.361Z
---

Quando Bruno abre uma sessão do Claude Code diretamente numa subpasta do workspace (ex.
`produtos/citrachat`, em vez da raiz `ccos-make`), o sistema trata isso como um projeto
diferente — sessões e pasta de memória (`~/.claude/projects/<hash-da-pasta>/memory/`)
completamente separadas da memória central do workspace. Sem correção, a nova sessão
começa "zerada", sem acesso ao histórico e decisões já acumuladas.

**Why:** aconteceu em 2026-09-01 — Bruno abriu uma aba nova em `produtos/citrachat` e
perguntou como recuperar "tudo que já falamos" ali. Investigação mostrou que o projeto
tinha uma pasta de memória nova e vazia (`-Users-brunomartins-Desktop-CCode-ccos-make-produtos-citrachat`).

**How to apply:** corrigido criando `produtos/citrachat/CLAUDE.md` que instrui a sessão a
ler e escrever memória sempre na pasta central
(`/Users/brunomartins/.claude/projects/-Users-brunomartins-Desktop-CCode-ccos-make/memory/`),
por caminho absoluto, independente de qual "projeto" a sessão pertence. Se Bruno reportar o
mesmo problema em outra subpasta (ex. `produtos/citradesk`, `clientes/<algum>`), aplicar o
mesmo padrão: criar um `CLAUDE.md` de ponte na subpasta apontando pra memória central.
Alternativa mais simples quando possível: sugerir abrir o VS Code sempre na raiz do
workspace (`ccos-make`), já que é ali que `_contexto/`, memória e `CLAUDE.md` principal
vivem — subpastas abertas direto são a exceção, não a regra.
