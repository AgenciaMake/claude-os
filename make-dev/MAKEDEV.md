# MakeDev — braço de sites, protótipos e HTML pra clientes

## O que é

MakeDev é o braço do sistema operacional da Make dedicado a **projetos pontuais** de desenvolvimento web pra clientes: sites institucionais, landing pages, protótipos de campanha. Diferente do trabalho recorrente em `clientes/<cliente>/` (briefing e histórico contínuo da conta), um projeto MakeDev tem **começo, meio e fim** — nasce, é aprovado, é entregue (ou publicado), e fecha.

Substitui o uso do Figma Make. A prototipagem, aprovação e entrega final acontecem por aqui.

## Estrutura de pastas

```
make-dev/
  MAKEDEV.md              — este arquivo
  clientes/
    <cliente>/
      <projeto>/
        briefing.md        — objetivo, referências, escopo, prazo
        prototipo/          — código-fonte do site (HTML/CSS/JS)
        html-elementor/      — seções exportadas prontas pra colar no Elementor
        historico.md         — decisões, versões, links de aprovação
```

Um cliente pode ter vários projetos MakeDev ao longo do tempo (ex: `clientes/springway/site-institucional-2026/`, depois `clientes/springway/landing-black-friday-2027/`). Cada projeto é isolado.

Usar `clientes/_modelo-projeto/` como base ao criar um projeto novo.

## Stack recomendada

**HTML + CSS (Tailwind via CDN) + JS vanilla, sem framework/build step.**

Motivo: o mesmo código que sobe pro Cloudflare Pages precisa virar seções HTML soltas pro Elementor sem transformação nenhuma. Framework com build (React, Vue etc) cria artefatos que não colam direto no Elementor — exige um passo extra de "compilar pra HTML puro" que é retrabalho. HTML puro resolve os dois casos com o mesmo arquivo.

Design de qualidade fica por conta da skill `ui-ux-pro-max` (estilos, paletas, tipografia, componentes) — não depende do Figma Make pra isso.

## Fluxo operacional

1. **Briefing** — Bruno passa objetivo, referências e prazo. Claude cria `clientes/<cliente>/<projeto>/briefing.md`.
2. **Protótipo** — Claude constrói o site em `prototipo/` usando a skill `ui-ux-pro-max` como guia de design.
3. **Deploy de aprovação** — sobe no Cloudflare Pages como projeto `makelemonad-<cliente>-<projeto>` (URL de staging pra Bruno/cliente aprovar).
4. **Aprovação** — Bruno revisa no link, pede ajustes ou aprova.
5. **Entrega**, dois caminhos:
   - **Tem WordPress/Elementor** → Claude exporta cada seção aprovada como bloco HTML independente em `html-elementor/` (um arquivo por seção: hero, sobre, serviços, depoimentos, contato etc), pronto pra colar no widget HTML do Elementor.
   - **Não tem WordPress** → o próprio deploy do Cloudflare Pages vira o site final (trocar de projeto staging pra produção, domínio próprio se houver).
6. **Fechamento** — registrar em `historico.md` a versão final, link publicado e data de entrega. Projeto fica arquivado na pasta do cliente pra consulta futura.

## Deploy — sigilo total, sem passar pelo GitHub

**Regra inegociável:** nenhum dado de cliente (briefing, código do protótipo, histórico) pode sair da máquina local via GitHub. `make-dev/clientes/` está no `.gitignore` da raiz por isso — nunca remover essa regra nem versionar essas pastas.

Isso não impede o site de ficar online. Cloudflare Pages aceita **upload direto via Wrangler CLI**, sem nenhuma integração com repositório Git — o deploy sobe os arquivos locais direto pro servidor da Cloudflare, e o código-fonte nunca toca o GitHub. É o mesmo método que `apps/briefing` já usa.

Cada projeto em `prototipo/` deve ter:

**`wrangler.toml`**
```toml
name = "makelemonad-<cliente>-<projeto>"
compatibility_date = "2024-09-01"
pages_build_output_dir = "."
```

**`package.json`**
```json
{
  "name": "makelemonad-<cliente>-<projeto>",
  "private": true,
  "scripts": {
    "dev": "wrangler pages dev . --compatibility-date=2024-09-01",
    "deploy": "wrangler pages deploy . --project-name=makelemonad-<cliente>-<projeto>"
  },
  "devDependencies": {
    "wrangler": "^3.80.0"
  }
}
```

Deploy roda com `npm run deploy` dentro da pasta `prototipo/`. **Nunca** conectar o projeto Cloudflare Pages a um repositório GitHub na configuração — sempre upload direto (`wrangler pages deploy`).

## Regras de identidade (herdadas do CLAUDE.md)

Todo protótipo/site em MakeDev segue as mesmas 4 regras de apps web hospedados definidas no CLAUDE.md raiz:
1. Favicon com `marca/logo.png`
2. Cor de destaque `#D6DE23` (a menos que a identidade visual do cliente mande outra coisa — nesse caso prevalece a marca do cliente, MakeDev é ferramenta, não vitrine da Make)
3. Título da aba identificável
4. Deploy Cloudflare Pages nomeado `makelemonad-<cliente>-<projeto>`

**Atenção:** ao contrário dos apps internos (`apps/`), sites MakeDev são pra clientes — a identidade visual e a paleta seguem a marca do cliente, não a da Make. As 4 regras acima valem só pro que for genuinamente "vitrine Make" (raro em MakeDev).
