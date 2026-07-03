---
name: Geração de imagem nunca contém texto
description: Qualquer imagem gerada por IA (Nano Banana, outras) deve vir sem textos — textos são inseridos depois por Claude como camada separada
type: feedback
originSessionId: b22e2e92-b566-4515-82a4-bce1814924d6
---
Qualquer imagem gerada por IA (Nano Banana / Gemini 2.5 Flash Image, ou qualquer outro modelo de geração) **nunca deve conter texto**. O prompt pede apenas o visual (mockup, cena, background, objeto). Todo texto é inserido depois por Claude como camada separada (via HTML+CSS+Puppeteer, Figma, ou outra ferramenta de composição).

**Why:** Modelos de geração de imagem erram tipografia — letras trocadas, palavras truncadas, fontes imprecisas. Dividir em duas etapas garante tipografia correta (Rubik com peso/itálico/outline exatos) e preserva a identidade visual da Make. Bruno confirmou essa regra em 2026-04-23 ao configurar o Nano Banana pras redes sociais.

**How to apply:**
- Sempre que gerar imagem via IA, o prompt descreve apenas elementos visuais (objetos, mockups, cenário, paleta, estilo) — **nunca pede texto, título, headline ou legenda embutida**
- Se o usuário pedir "cria um post com o título X", quebrar em dois passos: (1) gerar imagem base sem texto, (2) compor o texto por cima
- Regra vale para qualquer contexto: redes da Make, material de cliente, apresentações, apps
