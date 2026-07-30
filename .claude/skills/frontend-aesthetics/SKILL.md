---
name: frontend-aesthetics
description: Evita o "AI slop" em interfaces web. Aplica tipografia com caráter, paleta com intenção, movimento de impacto e fundos com profundidade. Adaptada ao stack da Make (React/Next.js para produtos Citra, HTML/CSS para make-dev).
scope: make
---

# Skill: Frontend Aesthetics

Baseada no cookbook `prompting_for_frontend_aesthetics` da Anthropic, adaptada para o stack e contexto da MakeLemonAd.

## Quando usar

Invocar `/frontend-aesthetics` antes de criar qualquer página, landing page, componente visual novo ou sessão de design. Serve para os dois contextos da Make:

- **Produtos Citra** (CitraChat, CitraDesk): React/Next.js com framer-motion. Tem design system próprio (`palette.ts`). Usar as regras para criar novos elementos com caráter, não só seguir o template cegamente.
- **make-dev** (sites e LPs para clientes): HTML/CSS puro ou WordPress/Elementor. Sem design system pré-definido. Aqui as escolhas de tipografia e paleta começam do zero.

---

## Regras que entram em vigor imediatamente

### Tipografia

**Proibido sempre:**
- Inter, Roboto, Open Sans, Lato, Arial, system-ui, -apple-system
- Space Grotesk (convergência documentada entre gerações de IA)
- Pesos medianos empilhados (400 vs 600). Sem contraste, sem identidade.

**Princípio central:** Alto contraste = interessante. Combinar uma fonte de display com outra de corpo em extremos opostos de peso e estilo.

**Categorias recomendadas:**
- Code/técnico: JetBrains Mono, Fira Code, IBM Plex Mono
- Editorial: Playfair Display, Crimson Pro, Fraunces, Newsreader
- Startup moderno: Clash Display, Satoshi, Cabinet Grotesk
- Técnico institucional: IBM Plex Sans, Source Sans 3
- Distinto/expressivo: Bricolage Grotesque, Obviously

**Para produtos Citra:** as fontes já estão definidas (Bricolage Grotesque + Plus Jakarta Sans). Aplicar a regra de extremos de peso: 200 vs 800, não 400 vs 600. Saltos de tamanho 3x+.

**Para make-dev:** declarar a escolha de fonte antes de começar o código. Exemplo: "Vou usar Fraunces para display e IBM Plex Sans para corpo — editorial com estrutura técnica."

### Cor e Tema

- Comprometer com uma estética coesa. Variáveis CSS para consistência.
- Paleta dominante com acento pontual supera paleta equilibrada e tímida.
- Buscar inspiração em temas de IDE, estéticas culturais, não em "o que ficaria bonito".
- Variar entre light e dark entre projetos — não defaultar sempre para o mesmo.

**Para produtos Citra:** a paleta está em `palette.ts`. Usar `C.lime` como acento agudo, não como cor de fundo dominante. Quando criar novos elementos, ampliar a paleta com propósito: `C.sky` para informação, `C.coral` para alerta, `C.limeDark` para CTA de alto contraste.

**Para make-dev:** definir a paleta antes do CSS. Máximo 3 cores base + 1 acento. Declarar explicitamente antes de começar o HTML.

### Movimento

- HTML/CSS puro: `animation` + `animation-delay` para stagger. CSS transitions para hover.
- React/Next.js: framer-motion com `viewport={{ once: true }}` para scroll reveal.
- **Prioridade:** um page load bem orquestrado com stagger vale mais que 10 micro-interações espalhadas.
- Evitar animações decorativas sem propósito. Movimento deve guiar o olho ou confirmar uma ação.

**Padrão de stagger recomendado (framer-motion):**
```tsx
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } } }
```

### Fundos

- Nunca fundo sólido puro em seções de destaque. Criar atmosfera e profundidade.
- Opções: gradiente radial sutil, padrão geométrico SVG, noise texture, camadas de gradiente.
- O fundo contextualiza o conteúdo — deve ter relação semântica com o que está sobre ele.

**Exemplos para produtos Citra (tema escuro C.ink):**
```tsx
// Glow sutil — hero com energia
background: `radial-gradient(circle at 50% 40%, oklch(88% 0.22 130 / 0.08) 0%, transparent 65%)`

// Profundidade — seção intermediária
background: `linear-gradient(180deg, ${C.ink} 0%, oklch(10% 0.02 240) 100%)`
```

---

## Anti-padrões documentados (nunca fazer)

- Gradiente roxo sobre fundo branco
- Cards todos iguais, espaçados uniformemente, sem hierarquia visual
- Hero com H1 genérico + parágrafo + dois botões em linha, fundo liso
- Grid de 3 colunas com ícone + título + parágrafo, sem variação de ritmo
- Heading + divider line decorativa + texto corrido — layout de template
- Usar `Inter` ou `System UI` em qualquer novo projeto sem justificativa explícita

---

## Checklist antes de entregar qualquer interface

- [ ] A escolha de fonte foi declarada e justificada?
- [ ] Pesos extremos estão em uso (200/800, não 400/600)?
- [ ] O fundo tem profundidade (gradiente, textura, glow)?
- [ ] O movimento está concentrado nos momentos de entrada, não espalhado?
- [ ] A paleta tem um acento dominante claro, não 4 cores equivalentes?
- [ ] O layout tem ritmo e variação, não é uma grid uniforme?
- [ ] Nenhuma fonte proibida foi usada?

---

## Aplicação ao CLAUDE.md / system prompt (para projetos make-dev)

Incluir este bloco no início de qualquer sessão de criação de site para cliente:

```
<frontend_aesthetics>
Evite o "AI slop" em interfaces. Faça escolhas criativas e distintas que surpreendam. Foque em:

Tipografia: Use fontes com caráter. Nunca Inter, Roboto, Arial ou Space Grotesk. Prefira: Bricolage Grotesque, Cabinet Grotesk, Fraunces, Newsreader, IBM Plex. Use extremos de peso (200 vs 800). Saltos de tamanho de 3x+. Declare a escolha antes de codar.

Cor: Comprometer com uma estética coesa. CSS variables. Uma cor dominante com acento pontual. Sem paletas tímidas e equilibradas.

Movimento: CSS para HTML puro, framer-motion para React. Um page load bem orquestrado > dez micro-interações espalhadas. Stagger com animation-delay.

Fundos: Nunca sólido puro em seções de destaque. Gradiente radial, padrão geométrico, noise, camadas.

Nunca: gradiente roxo sobre branco, cards todos iguais, grid de 3 colunas cookie-cutter, layout de template previsível.
</frontend_aesthetics>
```

---

## Notas

Fonte desta skill: `claude-cookbooks-main/coding/prompting_for_frontend_aesthetics.ipynb` (Anthropic, 2025).
O notebook usa `claude-sonnet-4-6` com `max_tokens=64000` como modelo de referência.
