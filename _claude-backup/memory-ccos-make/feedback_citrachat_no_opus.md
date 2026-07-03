---
name: feedback_citrachat_no_opus
description: Opus proibido em todo o workspace — uso indevido causou vazamento de key e prejuízo real
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 118f9f59-4c91-4970-9023-1cc5fa7db646
---

**Regra absoluta: Opus está PROIBIDO em todo o workspace MakeLemonAd**, incluindo CitraChat, CitraDesk, skills, subagentes, workflows e qualquer chamada de API.

**Why:** O uso indevido de Opus gerou consumo excessivo de tokens que levou ao comprometimento/vazamento da API key da Anthropic — causando prejuízo financeiro real e risco de segurança. O incidente foi documentado como caso grave.

**How to apply:**
- Modelos permitidos no CitraChat:
  - Chat e operações rápidas → `claude-haiku-4-5` (DEFAULT_MODEL)
  - Extração de PDF e análise pesada → `claude-sonnet-4-6` (ANALYSIS_MODEL)
- Workspace geral: sempre Sonnet (padrão) ou Haiku (operações simples)
- Antes de qualquer commit que toque chamadas Anthropic: `grep -rn "opus"` nos arquivos alterados
- Se qualquer skill ou ferramenta tentar usar Opus: interromper e perguntar ao Bruno antes de prosseguir
- A restrição está reforçada no CLAUDE.md do projeto como regra primária

**Contexto do incidente:** Vazamento de key por uso indevido de Opus → risco financeiro + segurança. Nunca ignorar essa regra mesmo que o contexto "pareça justificar" o modelo mais poderoso.
