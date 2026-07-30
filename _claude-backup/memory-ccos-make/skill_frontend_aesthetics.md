---
name: skill-frontend-aesthetics
description: Skill local para evitar AI slop em interfaces — quando invocar e o que faz
metadata: 
  node_type: memory
  type: reference
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-07-30T10:46:29.849Z
---

Skill em `.claude/skills/frontend-aesthetics/SKILL.md`.

Invocar `/frontend-aesthetics` antes de criar qualquer página, landing page ou componente visual novo.

Cobre dois contextos:
- **Produtos Citra** (React/Next.js + framer-motion): usa design system existente mas com caráter, pesos extremos, fundos com profundidade
- **make-dev** (HTML/CSS para clientes): tipografia e paleta do zero, declarar escolha antes de codar

Baseada em `claude-cookbooks-main/coding/prompting_for_frontend_aesthetics.ipynb`.

**Why:** Bruno quer interfaces com menos cara de IA. Sem Inter, sem gradiente roxo, sem grid uniforme de cards. Fontes com caráter, pesos extremos, movimento concentrado no page load, fundos com profundidade.
