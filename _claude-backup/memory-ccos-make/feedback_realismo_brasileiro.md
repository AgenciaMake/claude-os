---
name: Script mestre de realismo brasileiro para geração de imagens
description: Imagens fotorrealistas da Make seguem script rígido de realismo + contexto brasileiro/SP; mockups 3D ilustrativos usam estética própria
type: feedback
originSessionId: b22e2e92-b566-4515-82a4-bce1814924d6
---
Toda geração de imagem **fotorrealista** da MakeLemonAd (com pessoas, cenas, objetos em contexto de uso real) deve seguir integralmente o script mestre em [marca/direcao-de-arte.md](../../../Desktop/CCode/ccos-make/marca/direcao-de-arte.md) — 15 seções que garantem: contexto cultural brasileiro, São Paulo como referência estética, comportamento humano natural (não posado), iluminação natural tropical, textura viva, composição orgânica, e proibição de aparência de banco de imagem ou estética global genérica.

**Why:** Bruno formalizou essa regra em 2026-04-23 ao configurar o Nano Banana. A Make não aceita imagens que "pareçam IA" ou "foto de stock" — a marca precisa parecer autêntica, brasileira, viva. Imagens genéricas globais (apartamentos americanos, sorrisos publicitários, iluminação de estúdio flat) destroem a percepção da agência.

**How to apply:**
- Antes de chamar qualquer modelo de geração (Nano Banana/Gemini, Imagen, Stability, etc.) pra imagem **com pessoas, cenas ou objetos em contexto real**, montar o prompt usando o template da seção final do `direcao-de-arte.md`
- Regra simples: pediu foto/cena/pessoa → aplica o script. Pediu mockup 3D (megafone flutuante, laptop isolado) → usa Estilo A do identidade-visual das redes, não aplica este script
- Em qualquer contexto da Make (redes, site, propostas, apresentações, apps, clientes quando a Make executar) a regra vale
- Checklist final (7 perguntas da seção 14) serve pra validar qualquer imagem antes de aprovar
- Combina com a regra de que **texto nunca é gerado dentro da imagem** — Claude compõe depois como camada separada
