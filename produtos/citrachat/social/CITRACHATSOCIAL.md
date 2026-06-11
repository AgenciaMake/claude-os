# CITRACHATSOCIAL — Redes Sociais do CitraChat

Briefing mestre das redes sociais do **CitraChat**. Escopo: Instagram e LinkedIn do @citrachat. Produto independente, sem ligação direta com a MakeLemonAd nas comunicações públicas.

Ler esse arquivo no início de qualquer sessão de pauta, criação, aprovação, publicação ou análise de performance das redes do CitraChat.

---

## 1. Objetivo

Construir audiência antes do lançamento comercial. Educar o mercado sobre agentes IA conversacionais, criar autoridade no tema e aquecer uma base de potenciais clientes.

Estágio atual: produto em uso interno, ainda não à venda. Estratégia de "build in public" — mostrar o produto se construindo, educar sobre o problema que ele resolve.

---

## 2. Público-alvo

Empresários, gestores e equipes de marketing/vendas de PMEs brasileiras que:
- Usam ou querem usar chat como canal de atendimento/conversão
- Têm campanhas de mídia paga rodando e perdem leads por falta de qualificação
- Já ouviram falar de chatbot mas não sabem a diferença pra um agente IA
- Estão implementando IA no processo e não sabem por onde começar no atendimento

Segmentos com maior fit: clínicas, clínicas de estética, educação, imobiliário, SaaS, e-commerce, agências.

---

## 3. Posicionamento

**Agente IA que converte, não chatbot que irrita.**

O CitraChat não é mais um chatbot de botões. É um agente que entende contexto, responde de verdade, qualifica leads e dispara eventos pro seu pixel — sem código.

Frase de uma linha: **"Seu lead chegou. O agente já está trabalhando."**

---

## 4. Pilares de conteúdo

1. **Educação sobre agentes IA** — diferença entre chatbot e agente, o que é RAG, como funciona o treinamento por documentos, por que IA conversacional mudou o jogo.
2. **Conversão e tracking** — como chat e mídia paga se conectam, disparar eventos de conversão direto do chat, qualificação de lead automática.
3. **Build in public** — bastidores do produto sendo construído, decisões de produto, novas features, aprendizados.
4. **Cases e uso real** — conversas reais anonimizadas, resultados de agentes em uso, situações que o produto resolveu.

---

## 5. Tom de voz

- Direto, técnico mas acessível. Fala pra quem quer resultado, não pra dev.
- Sem exagero de entusiasmo nem linguagem de startup clichê.
- Mostra o produto com confiança, sem precisar vender a cada frase.
- Humanizado: sem marcas de IA, sem travessões, sem bullets onde frase resolve.
- Mais sério que a Make, mas não corporativo. Produto focado.

### Regras absolutas de copy (idênticas às da Make)

- PROIBIDO travessão longo (`—`) ligando frases.
- PROIBIDO markdown visível: asteriscos, bullets, headers.
- PROIBIDO clichês de IA: "Vamos explorar", "É importante notar", "Vale ressaltar".
- PROIBIDO frases muletas: "Você sabia que...?", "A verdade é que...".
- PROIBIDO CTAs genéricos: "Não perca!", "Aproveite agora!".

---

## 6. Estrutura de copy (carrosséis)

1. **Hook (slide 1)** — para o scroll. Provocação, dado que surpreende, pergunta que o público não sabe responder.
2. **Corpo** — cada slide empurra pro próximo. Informação em camadas.
3. **CTA final** — ação clara: seguir, comentar, salvar, ou entrar na lista de espera.

Legenda: reforça o hook, contextualiza brevemente, termina com CTA.

---

## 7. Distribuição por rede

### Instagram
Canal principal. Carrosséis educativos e de produto. Stories pra tráfego do feed.

### LinkedIn
Mesmo conteúdo visual com adaptação de texto. Público em modo profissional — CTAs tipo "comenta com tua experiência" ou "compartilha com o time de marketing".

---

## 8. Identidade visual

Guia visual completo: [identidade-visual.md](identidade-visual.md)

Assets (logo, mockups, screenshots do produto): [identidade-visual/](identidade-visual/) e [assets/](assets/)

Referências estéticas: [referencias/](referencias/)

**Resumo da paleta:**
- Destaque: `#DFFF00` (lime elétrico — cor principal do produto)
- Fundo primário: `#09090b` (preto profundo — dark mode do produto)
- Fundo secundário: `#18181b` (zinc-900)
- Texto claro: `#FFFFFF`
- Texto muted: `#71717a` (zinc-500)
- Acento alternativo: `#ffffff` com bordas ou opacidade

**Tipografia:** Rubik (mesma base técnica dos slides Make)

**Grid:** 70px em todos os lados (mesmo sistema da Make)

---

## 9. Operação — fluxo semanal

Ritmo: **2 posts por semana** (fase de construção de audiência) — Instagram + LinkedIn.

### Fluxo
1. **Claude sugere pautas** baseado nos pilares + estado atual do produto.
2. **Bruno aprova e afina.**
3. **Bruno libera criação.**
4. **Claude cria** — copy, carrossel, peças visuais.
5. **Bruno aprova artes.**
6. **Claude publica** via skill `publicar-instagram` (Post for Me Pro).
7. **+2 dias → análise de métricas juntos.**

### Onde cada artefato fica
- Pautas aprovadas → [pautas/](pautas/) (nomear: `2026-06-15_semana.md`)
- Post pronto → [posts/](posts/) (subpasta por data)
- Relatórios → [metricas/](metricas/)

---

## 10. Métricas

### Primárias
- Seguidores (crescimento líquido)
- Compartilhamentos
- Salvamentos
- Comentários

### Secundárias
- Curtidas
- Alcance e impressões
- Cliques no link da bio

Análise a cada 2 dias por post. Consolidação semanal em [metricas/](metricas/).

---

## 11. Stack de publicação

- **Post for Me Pro** (postforme.dev) — mesmo método da Make.
- **Skill:** `publicar-instagram` instalada em `.claude/skills/`.
- **Credencial:** `POSTFORME_API_KEY` no `.env` do workspace.
- **Contas:** a conectar no Post for Me quando o Instagram @citrachat for criado.
