---
name: feedback_responsividade_obrigatoria
description: "Qualquer alteração no site CitraChat (LP, /testelimonete, etc.) deve obrigatoriamente incluir responsividade mobile"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
---

Toda vez que uma seção do site for criada, editada ou atualizada — seja copy, layout, nova seção ou ajuste visual — a responsividade mobile é obrigatória no mesmo commit. Nunca entregar uma mudança de site sem verificar o comportamento em telas pequenas.

**Why:** O site foi lançado sem breakpoints e ficou completamente quebrado no mobile. Bruno definiu como regra permanente após esse incidente.

**How to apply:** Ao trabalhar em qualquer arquivo de `src/app/LandingPage.tsx`, `src/app/testelimonete/page.tsx` ou qualquer outra página/componente do CitraChat:
- Grids de 2 ou 3 colunas → colapsar para 1 coluna em `max-width: 767px`
- Padding lateral `48px` → `20px` no mobile
- Fontes grandes → verificar que `clamp()` está aplicado
- Tabelas → `overflow-x: auto` no mobile
- Elementos decorativos (cards flutuantes, colunas direitas do hero) → `display: none` se necessário no mobile
- Usar o padrão já estabelecido: bloco `<style>` com classes `.lp-*` e `!important` para sobrescrever inline styles
