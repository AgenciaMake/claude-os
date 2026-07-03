---
name: feedback-slide-unico-sem-seta
description: Posts de slide único não devem ter a setinha de navegação (swipe arrow)
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b22e2e92-b566-4515-82a4-bce1814924d6
---

Quando o post for de imagem única (um só slide), nunca incluir a seta de navegação pro slide seguinte.

**Why:** A seta indica que há mais slides pra deslizar. Em post de imagem única, ela aparece errada e confunde o usuário.

**How to apply:** Sempre que criar config.json com apenas um slide, adicionar `"noArrow": true` nesse slide. O renderer já suporta essa flag. Só omitir o noArrow em carrosséis com 2+ slides.
