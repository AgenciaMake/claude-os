# MAKESOCIAL — Redes Sociais da MakeLemonAd

Briefing mestre das redes sociais **da própria agência**. Escopo: Instagram, LinkedIn e TikTok do @makelemonad. Não se aplica a trabalho de clientes.

Ler esse arquivo no início de qualquer sessão de pauta, criação, aprovação, publicação ou análise de performance das redes da Make.

---

## 1. Objetivo

Gerar autoridade, ganhar público, engajar e converter em leads.

---

## 2. Público-alvo

Empresários e empresas — pequeno, médio e grande porte. B2B majoritariamente.

Dor na timeline deles: entender a parte estratégica do digital (mídia, performance, leads) sem precisar se aprofundar tecnicamente. Querem resultado, não aula.

---

## 3. Posicionamento

Autoridade em estratégia digital e performance, com linguagem leve e divertida. Agência de publicidade 360 que entende do assunto e não é careta.

Frase de uma linha: **"Quem entende do seu negócio, mas fala sua língua."**

---

## 4. Pilares de conteúdo

Pilares iniciais — serão **validados e ajustados ao longo do tempo** com base em performance.

1. **Notícias do universo** — mídia, performance, publicidade, leads, estratégias digitais. Conecta a Make como empresa plugada no que está acontecendo no mercado.
2. **Conteúdo técnico estratégico** — Google Ads, Meta Ads, LinkedIn Ads, Analytics e afins. Sem travar na terminologia — traduzir pra empresário que não vive nesse mundo.
3. **Curiosidades do universo** — fatos, dados, histórias do mercado de publicidade e marketing digital.
4. **Updates da Make** — trabalhos concluídos, ações executadas, cases.

Esses pilares evoluem conforme as análises semanais.

---

## 5. Tom de voz

- Divertido, mas com autoridade — **23 anos de mercado publicitário + 5 em estratégia digital** dão o lastro.
- Não somos caretas. Linguagem próxima, informal quando couber, estratégica sempre.
- Humanizada de verdade — **sem cara de IA**. Nada de "traveções", frases certinhas demais, listas mecânicas, conectores genéricos ("ademais", "outrossim", "em suma"), emojis em excesso, bullets quando a frase serve, ou fechamentos formais.
- Termos informais que aproximam do público alvo sim. Gírias de internet sem exagero.
- Nunca pedante. Nunca didático de forma chata.

---

## 6. Estrutura de copy (carrosséis)

1. **Hook (slide 1)** — forte o suficiente pra fazer parar o scroll e abrir o post. Provocação, estatística que surpreende, pergunta direta, afirmação polêmica.
2. **Corpo (slides intermediários)** — cada slide termina empurrando o usuário pro próximo. Ganchos entre slides. Informação em camadas, do geral pro específico.
3. **CTA final** — sempre pedindo ação: **compartilhar, seguir ou comentar**. Evitar CTA de "curtir" — curtida é métrica secundária.

Legenda: reforça o hook, contextualiza, e termina com CTA.

---

## 7. Distribuição por rede

### Instagram + TikTok (comunicação idêntica)
Mesmo copy, mesmo visual, mesmo CTA. O TikTok via Post for Me sai como **rascunho** — finalização manual no app.

### LinkedIn (ajustes)
- **CTAs diferentes** — público está em modo profissional, CTAs tipo "comenta com sua experiência", "compartilha com seu time" em vez de "marca aquele amigo".
- **Descrição pode mudar** — às vezes precisa de um enquadramento mais voltado a empresa/colaborador, em vez do tom solto do IG/TikTok.
- Mesma peça visual, mesma ideia central — adaptações de texto conforme o contexto do post.

---

## 8. Identidade visual

Guia visual completo das redes: [identidade-visual.md](identidade-visual.md) — paleta, tipografia (Rubik), anatomia do slide, 3 estilos mapeados aos pilares, template do CTA final, checklist de publicação.

Referência global da marca: [marca/design-guide.md](../../marca/design-guide.md).

Banco de inspirações e posts-referência: [referencias/](referencias/). Bruno alimenta essa pasta sempre que surge uma tendência, estética nova ou ajuste.

Assets reutilizáveis (logos, mockups 3D, texturas): [identidade-visual/](identidade-visual/).

---

## 9. Operação — fluxo semanal

Ritmo: **3 posts por semana** (IG + LinkedIn + TikTok publicados a partir da mesma peça, com adaptação de LinkedIn).

### Fluxo
1. **Claude sugere pautas** da semana (baseado nos pilares + contexto atual da Make + tendências).
2. **Bruno aprova, discute, afina** — conversa até fechar as 3 pautas.
3. **Bruno libera para criação.**
4. **Claude cria** — copy, roteiro do carrossel, peças visuais.
5. **Bruno aprova as artes.**
6. **Claude publica** via skill `publicar-instagram` (método Post for Me Pro).
7. **+2 dias após cada post → análise juntos** das métricas.

### Onde cada artefato fica
- Pautas aprovadas da semana → [pautas/](pautas/) (nomear por data: `2026-04-27_semana.md`)
- Post pronto (copy + peças + link publicado) → [posts/](posts/) (subpasta por data)
- Relatórios de análise → [metricas/](metricas/)

---

## 10. Métricas

### Primárias (o que importa)
- **Compartilhamentos**
- **Comentários**
- **Salvamentos**
- **Seguidores** (crescimento líquido)

### Secundárias (complementares)
- Curtidas
- Alcance e impressões
- Tempo médio no post

Análise a cada 2 dias por post. Consolidação semanal em [metricas/](metricas/).

---

## 11. Stack de publicação

- **Post for Me Pro** (postforme.dev) — método oficial. Plano Pro assinado em 2026-04-23.
- **Skill:** `publicar-instagram` (repo `duduesh/publicar-social-ratos`), instalada em `.claude/skills/`.
- **Credencial:** `POSTFORME_API_KEY` no `.env` do workspace.
