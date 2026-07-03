---
name: Ferramentas de publicação social da MakeLemonAd
description: Post for Me Pro é a ferramenta oficial pra publicar nas redes da Make — usar via skill publicar-instagram (duduesh/publicar-social-ratos)
type: project
originSessionId: b22e2e92-b566-4515-82a4-bce1814924d6
---
A MakeLemonAd tem plano **Post for Me Pro** (postforme.dev) assinado — esse é o método escolhido pra publicar nas redes sociais da agência. Libera IG, TikTok e LinkedIn.

**Why:** Bruno contratou o plano em 2026-04-23 especificamente pra automatizar o fluxo de posts da Make (prioridade 3 da estratégia — automatizar publicações no IG e LinkedIn).

**How to apply:**
- Pra publicar, usar a skill `publicar-instagram` (repo `duduesh/publicar-social-ratos`) com método Post for Me
- Credencial: `POSTFORME_API_KEY=pfm_live_xxxxx` no `.env`
- NÃO sugerir Graph API direto (só cobre IG e dá mais trabalho de setup)
- Fluxo dos posts da Make: Bruno cria sozinho (equipe não toca), Claude ajuda na análise de métricas
