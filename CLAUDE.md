# MakeLemonAd — Claude Code OS

## O que é esse workspace

Esse é o escritório digital da MakeLemonAd — agência de marketing digital focada em performance estratégica 360º. Aqui ficam os arquivos que o Claude usa pra trabalhar contextualizado com o negócio, os clientes e a equipe.

**Separação MAKE vs CLIENTES:**
Esse workspace tem dois tipos de trabalho convivendo:
- **Trabalho interno da Make** (redes, site, processos, operação da agência) → mora em `make/`
- **Trabalho pra clientes** (briefings, campanhas, entregas, cada cliente com sua pasta) → mora em `clientes/`

Skills em `.claude/skills/` podem ser específicas da Make, específicas de um cliente, ou compartilhadas. Antes de aplicar uma skill, checar o escopo — não usar skill de cliente pra trabalho da Make, nem o contrário.

**Estrutura de pastas:**
- `_contexto/` — quem é o negócio, preferências de comunicação e foco atual
- `marca/` — identidade visual e guia de design
- `make/` — trabalho interno da MakeLemonAd (ex: `make/social/` = redes sociais da agência)
- `clientes/` — uma pasta por cliente com briefing e histórico
- `propostas/` — propostas geradas (modelos Starter, Power, Hyper, 360)
- `operacoes/` — processos internos, checklists, onboarding de clientes, scripts
- `dados/` — arquivos de referência, relatórios, prints
- `templates/` — templates de skills e ferramentas prontos pra usar
- `apps/` — apps web hospedados (Cloudflare Pages, etc.)
- `produtos/` — produtos SaaS desenvolvidos pela Make (linha Citra: CitraDesk, CitraChat). Cada produto tem código clonado do GitHub, briefing mestre e feedback de uso interno
- `tarefas.md` — lista de pendências atualizada conforme o trabalho avança

## Sobre o negócio

MakeLemonAd é uma agência de marketing digital fundada em 2021 por Bruno, publicitário com mais de 23 anos de experiência em grandes agências no Brasil e em Portugal. O foco é performance estratégica 360º — mídia paga, social media, branding, desenvolvimento e estratégia integrados. O nome vem do ditado "se a vida te der limões, faça uma limonada" — e o "Ad" com D mudo é a assinatura de quem entende de publicidade.

## O que mais fazemos aqui

- Gestão de campanhas de mídia paga (Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads)
- Estratégia e social media (Instagram e LinkedIn como canais principais)
- Criação de propostas comerciais (modelos Starter, Power, Hyper, 360)
- Desenvolvimento de sites e landing pages (WordPress/Elementor, Shopify, Nuvemshop, Tray)
- Criação de criativos (Figma, Photoshop, Illustrator, InDesign, After Effects, CapCut)
- Estruturação de processos internos e operações da agência

## Clientes e contexto

Atende clientes externos B2B e B2C — 90% no Brasil (base em São Paulo), 2 clientes em Portugal. Bruno opera de Portugal como CEO/CMO/Fundador. O modelo prioritário de crescimento é o 360º, onde a rentabilidade e o potencial de expansão são maiores.

## Equipe

- **Bruno** — CEO, CMO e Fundador (Portugal)
- **Amanda** — Gerente de Contas
- **Thayná** — Social Media
- **Gustavo e Tiago** — Direção de Arte
- **Stéphanie, Lucas e Vinicius** — Desenvolvimento e Programação
- **Mari** — Financeiro

## Tom de voz

Direto, humano e estratégico. Mistura informalidade com autoridade — próximo sem ser informal demais, técnico sem ser engessado. Hooks fortes, sem enrolação. Adaptado ao canal: mais direto no WhatsApp, mais estruturado em propostas e apresentações.

## Ferramentas conectadas

Google Ads, Meta Ads, TikTok Ads, LinkedIn Ads, Trello, Google Analytics, WordPress/Elementor, Figma, After Effects, CapCut, Photoshop, Illustrator, InDesign, Shopify, Nuvemshop, Tray, WhatsApp, Google Meet, ChatGPT, Claude, Freepik IA

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar [marca/design-guide.md](marca/design-guide.md) como referência de estilo.

Para qualquer **geração de imagem por IA** (Nano Banana/Gemini ou outro modelo):
- Se a imagem é fotorrealista (pessoas, cenas, objetos em contexto real) → ler e aplicar integralmente [marca/direcao-de-arte.md](marca/direcao-de-arte.md) — realismo absoluto + contexto brasileiro/SP.
- Se é mockup 3D ilustrativo/caricato → usar estética apropriada (Estilo A do identidade-visual das redes).
- **Textos nunca são gerados dentro da imagem** — sempre compostos depois por Claude como camada separada.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (quem são os clientes, como funciona a empresa, serviços, mercado) → adicionar em `_contexto/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato de resposta, o que evitar, como estruturar textos) → adicionar em `_contexto/preferencias.md`
- **Sobre prioridades e foco atual** (projetos em andamento, metas do momento, prazos importantes, o que é prioridade agora) → adicionar em `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** (onde salvar arquivos, como nomear, fluxos específicos) → adicionar no próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar o que foi salvo mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Apps web hospedados (Cloudflare Pages, etc.)

Toda página/app web criado dentro de `apps/` deve seguir essas regras de identidade:

1. **Favicon obrigatório:** copiar `marca/logo.png` pra `public/logo.png` (ou `assets/logo.png` conforme a estrutura do app) e adicionar no `<head>`:
   ```html
   <link rel="icon" type="image/png" href="/logo.png">
   <link rel="apple-touch-icon" href="/logo.png">
   ```
2. **Cor de destaque:** usar `#D6DE23` como cor principal (verde limão da Make). Paleta completa em [marca/design-guide.md](marca/design-guide.md).
3. **Título da aba:** começar com "MakeLemonAd — {nome da feature}".
4. **Deploy no Cloudflare Pages:** nomear o projeto sempre como `makelemonad-{slug}` (ex: `makelemonad-briefing`, `makelemonad-proposta`).

Ao criar um novo app, aplicar essas 4 regras automaticamente sem precisar perguntar.

---

## Redes sociais da MakeLemonAd

Em qualquer sessão que envolva Instagram, LinkedIn ou TikTok **da própria Make** (pauta, copy, peça visual, publicação, análise de métricas), ler [make/social/MAKESOCIAL.md](make/social/MAKESOCIAL.md) como briefing mestre — objetivo, público, pilares, tom de voz, estrutura de copy, fluxo operacional e métricas.

**Organização dos artefatos:**
- Referências estéticas e tendências → `make/social/referencias/`
- Pautas aprovadas da semana → `make/social/pautas/` (nomear por data: `2026-04-27_semana.md`)
- Posts prontos (copy + peça + link publicado) → `make/social/posts/` (subpasta por data)
- Relatórios de análise de performance → `make/social/metricas/`

**Fluxo operacional (resumido, detalhes no MAKESOCIAL.md):**
Claude sugere pautas → Bruno aprova/afina → Bruno libera criação → Claude cria copy e peça → Bruno aprova arte → Claude publica via skill `publicar-instagram` (Post for Me Pro) → +2 dias → análise juntos.

Esse fluxo é exclusivo das redes da Make. Não aplicar a clientes.

---

## Produtos SaaS da Make (linha Citra)

A Make desenvolve produtos SaaS usados primeiro internamente, com plano de virar comercial. Vivem em `produtos/` e seguem a estrutura definida em [produtos/PRODUTOS.md](produtos/PRODUTOS.md).

**Produtos atuais:**
- **CitraDesk** — sistema de gestão de agência. Briefing: [produtos/citradesk/CITRADESK.md](produtos/citradesk/CITRADESK.md). Código clonado em [produtos/citradesk/codigo/](produtos/citradesk/codigo/) (repo `AgenciaMake/citradesk` no GitHub).
- **CitraChat** — produto de comunicação/atendimento. Briefing em construção: [produtos/citrachat/CITRACHAT.md](produtos/citrachat/CITRACHAT.md).

**Regras quando trabalhar nos produtos Citra:**

1. Sempre **ler o briefing mestre do produto antes** de qualquer trabalho de código, feature, bug, roadmap ou estratégia. Não confiar só no código — o briefing tem o porquê.
2. Trabalho de código vai em `produtos/{nome}/codigo/`. É um repo git real clonado do GitHub — qualquer commit/push vai pro repositório oficial.
3. Decisões de produto importantes (mudança de stack, novo módulo, definição de tier de preço) → registrar em `produtos/{nome}/briefings/` antes de implementar.
4. Feedback de uso interno da Make → `produtos/{nome}/feedback/`.
5. Manter consistência da linha Citra: paleta MakeLemonAd (#D6DE23), multi-moeda BRL/USD/EUR desde o dia 1, RBAC, AI nativa.
6. **Não confundir `produtos/` com `apps/`** — `apps/` é app web simples hospedado (ex: app de briefing); `produtos/` é produto comercial com roadmap de SaaS.

---

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
