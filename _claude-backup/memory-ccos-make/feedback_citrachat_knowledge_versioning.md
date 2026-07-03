---
name: feedback-citrachat-knowledge-versioning
description: "Cada atualização da base de conhecimento do CitraChat deve criar um novo arquivo versionado, nunca sobrescrever o anterior"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
---

Ao atualizar o arquivo de base de conhecimento do agente de suporte do CitraChat, criar sempre um novo arquivo com versão incrementada — nunca editar o arquivo anterior.

**Convenção:** `citrachat_conhecimento_v1.txt` → `citrachat_conhecimento_v2.txt` → `v3.txt` → ...

**Localização:** `produtos/citrachat/base_conhecimento/`

**Why:** Bruno quer histórico de versões do documento de treinamento para poder rastrear o que estava em vigor em cada período e facilitar a comparação entre versões.

**How to apply:** Sempre que for atualizar o conteúdo do TXT de conhecimento, ler a versão mais recente existente, criar um novo arquivo com o número seguinte e commitar. Não usar Edit no arquivo anterior.
