# MCPs recomendados por perfil

MCPs são conectores que dão superpoderes ao Claude Code. Cada um instalado é uma ferramenta nova que o Claude consegue usar diretamente na conversa.

> Não precisa instalar tudo de uma vez. Começa pelos do seu perfil e vai adicionando conforme a necessidade.

---

## Agência / freelancer (atende clientes)

**Prioridade alta:**

### Notion
Acessa seus projetos, bases de clientes, briefings e tarefas.
```bash
claude mcp add notion -- npx -y @notionhq/notion-mcp-server
```
*Exige: API key do Notion (em notion.so/my-integrations)*

### Gmail
Lê e compõe emails sem sair do Claude Code.
```bash
claude mcp add gmail -- npx -y @gongrzhe/server-gmail-autoauth-mcp
```

### Google Calendar
Vê sua agenda, cria eventos e encontra horários disponíveis.
```bash
claude mcp add google-calendar -- npx -y @gongrzhe/server-google-calendar-autoauth-mcp
```

### Canva
Acessa seus designs, cria novos assets visuais.
```bash
claude mcp add canva -- npx -y @canva/canva-mcp-server
```
*Exige: conta Canva Pro*

---

## Criador de conteúdo / solopreneur

**Prioridade alta:**

### Canva
```bash
claude mcp add canva -- npx -y @canva/canva-mcp-server
```

### Notion
```bash
claude mcp add notion -- npx -y @notionhq/notion-mcp-server
```

### Google Calendar
```bash
claude mcp add google-calendar -- npx -y @gongrzhe/server-google-calendar-autoauth-mcp
```

**Bônus pra quem cria vídeos:**

### Playwright (renderização automática)
Renderiza HTMLs em PNG automaticamente. Necessário pra skill `/carrossel` no modo automático.
```bash
claude mcp add playwright -- npx -y @executeautomation/playwright-mcp-server
```

---

## Gestor de mídia / anunciante

**Prioridade alta:**

### Google Ads
Acessa e edita campanhas, busca dados de performance.
*(configuração via claude mcp add — verificar documentação do servidor escolhido)*

### Meta Ads
Acessa campanhas do Meta (Facebook/Instagram Ads).
*(configuração via claude mcp add — verificar documentação do servidor escolhido)*

### Google Calendar
```bash
claude mcp add google-calendar -- npx -y @gongrzhe/server-google-calendar-autoauth-mcp
```

---

## Profissional CLT / carreira

**Prioridade alta:**

### Notion
```bash
claude mcp add notion -- npx -y @notionhq/notion-mcp-server
```

### Gmail
```bash
claude mcp add gmail -- npx -y @gongrzhe/server-gmail-autoauth-mcp
```

### Google Calendar
```bash
claude mcp add google-calendar -- npx -y @gongrzhe/server-google-calendar-autoauth-mcp
```

---

## MCPs úteis pra todo mundo

### Playwright (renderização de HTML em PNG)
```bash
claude mcp add playwright -- npx -y @executeautomation/playwright-mcp-server
```

### Fetch (busca conteúdo de URLs)
Geralmente já vem instalado. Verifica com `claude mcp list`.

---

## Como verificar o que está instalado

```bash
claude mcp list
```

## Como remover um MCP

```bash
claude mcp remove nome-do-mcp
```

---

> Depois de instalar, atualize a seção "Ferramentas conectadas" no seu CLAUDE.md.
> O Claude vai passar a usar esses conectores automaticamente quando fizer sentido.
