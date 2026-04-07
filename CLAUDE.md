# MakeLemonAd — Claude Code OS

## O que é esse workspace

Esse é o escritório digital da MakeLemonAd — agência de marketing digital focada em performance estratégica 360º. Aqui ficam os arquivos que o Claude usa pra trabalhar contextualizado com o negócio, os clientes e a equipe.

**Estrutura de pastas:**
- `_contexto/` — quem é o negócio, preferências de comunicação e foco atual
- `marca/` — identidade visual e guia de design
- `clientes/` — uma pasta por cliente com briefing e histórico
- `propostas/` — propostas geradas (modelos Starter, Power, Hyper, 360)
- `conteudo/` — pautas, roteiros e carrosséis por canal (instagram/, linkedin/)
- `operacoes/` — processos internos, checklists, onboarding de clientes, scripts
- `dados/` — arquivos de referência, relatórios, prints
- `templates/` — templates de skills e ferramentas prontos pra usar
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

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

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

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
