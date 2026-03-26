# DobraLabs — Claude Code OS

## O que é esse workspace
Workspace principal da DobraLabs. Aqui ficam propostas, conteúdos, projetos de clientes, protótipos e tudo que o Eduardo toca no dia a dia do laboratório.

**Estrutura de pastas:**
- `_contexto/` — contexto do negócio, preferências e foco atual
- `marca/` — identidade visual e design guide
- `clientes/` — pastas por cliente com briefing e entregas
- `briefings/` — briefings recebidos
- `propostas/` — propostas comerciais geradas
- `conteudo/` — carrosséis, roteiros, newsletters, posts
- `projetos/` — projetos internos e experimentos
- `dados/` — arquivos de dados e assets pra análise
- `templates/` — templates reutilizáveis

## Sobre o negócio
DobraLabs é um laboratório que experimenta ideias e cria produtos com IA pra resolver problemas reais de negócios. Combina design, tecnologia e automação. Eduardo também é cofundador da Dobra (marca de produtos) e da Ótica Rönnau.

## O que mais fazemos aqui
- Soluções com IA sob medida (apps, automações, agentes, sistemas)
- Protótipos rápidos (Lovable, IA)
- Palestras e workshops sobre IA pra empresas e líderes
- Conteúdo (roteiros, frameworks, exemplos práticos)
- Propostas comerciais e PRDs
- Branding, comunicação e posicionamento
- Estratégia pra negócios próprios (Dobra, Rönnau)

## Clientes e contexto
Atende clientes externos (empresas que contratam a DobraLabs) e usa internamente pros próprios negócios. Equipe com Murilo, Duda, Helena. Eduardo lidera como estrategista + mão na massa.

## Tom de voz
- Informal, direto, conversa como gente
- Storytelling e analogias
- Clareza + profundidade, sem enrolação
- Textos autorais com virada/reflexão no final
- Nunca corporativo engessado
- Nunca genérico ou superficial

## Ferramentas conectadas
- ChatGPT, Claude
- Lovable (prototipagem)
- n8n (automação)
- Supabase (backend/data)
- WordPress, Elementor, WooCommerce
- Bento (event tracking)
- WhatsApp
- OpenRouter, ElevenLabs

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

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/commands/`.
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

1. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/commands/` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/` (global)
2. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
3. Seguir o fluxo da skill-creator nativa do Claude Code
