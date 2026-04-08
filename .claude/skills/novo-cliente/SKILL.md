# Skill: /novo-cliente

Onboarding completo de um novo cliente da MakeLemonAd.

## Quando usar

Sempre que um contrato for assinado e for hora de montar a estrutura do cliente.

## O que faz

1. Coleta as informações básicas do cliente
2. Cria as duas pastas no Google Drive (cliente + criação)
3. Cria a pasta local no workspace
4. Gera o checklist de onboarding

---

## Passo 1 — Coletar informações

Perguntar ao usuário:

- **Nome do cliente** (como vai aparecer nas pastas)
- **Número do cliente** (ver último número em `02. CLIENTES` no Drive e sugerir o próximo)
- **Tipo de serviço**: 360 / Social Media / Performance (Tráfego Pago) / Desenvolvimento / Outro
- **Responsável interno** (Amanda, Thayná, Gustavo, Tiago, etc.)

Formatar o nome da pasta como: `{número}. {Nome do Cliente}`
Exemplo: `33. Empresa ABC`

---

## Passo 2 — Criar pasta no Drive (área do cliente)

**Destino**: `02. CLIENTES` (ID: `1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q`) dentro do Shared Drive `00. MAKELEMONAD` (ID: `0ANDNjpfQd7ZmUk9PVA`)

Usando o MCP `google-drive`, criar a pasta principal e as subpastas abaixo:

```
{número}. {Nome do Cliente}/
  ├── 01. Criativos
  ├── 02. Materiais de Apoio
  ├── 03. Materiais do Cliente
  ├── 04. Apresentação
  ├── 05. Documentos
  ├── 06. Planilhas
  ├── 07. Ads
  ├── 08. Pautas e Reunioes
  ├── 09. Relatórios
  ├── 10. Senhas
  └── 11. Logos
```

Para criar cada pasta usar `mcp__google-drive__createFolder` com o `driveId: "0ANDNjpfQd7ZmUk9PVA"` nas subpastas.

---

## Passo 3 — Criar pasta no Drive (área de criação)

**Destino**: Shared Drive `02. MAKE - CRIAÇÃO` (ID: `0AE-_ZuS1PIchUk9PVA`)

Criar a pasta principal e as subpastas:

```
{número}. {Nome do Cliente}/
  ├── 01. Fonts
  ├── 02. Materiais de Apoio
  ├── 03. Materiais do Cliente
  ├── 04. Video
  └── 05. Arte
```

Para criar cada pasta usar `mcp__google-drive__createFolder` com o `driveId: "0AE-_ZuS1PIchUk9PVA"`.

---

## Passo 4 — Criar pasta local no workspace

Criar em `clientes/{slug-do-cliente}/` com os arquivos:

- `briefing.md` — template abaixo
- `checklist-onboarding.md` — template abaixo

### Template briefing.md

```markdown
# Briefing — {Nome do Cliente}

**Número:** {número}
**Tipo de serviço:** {tipo}
**Responsável interno:** {responsável}
**Data de início:** {data}

---

## Sobre o negócio

- **Segmento:**
- **Produto/Serviço principal:**
- **Público-alvo:**
- **Diferenciais:**

## Objetivos

- **Objetivo principal:**
- **Meta numérica:**
- **Prazo:**

## Concorrência

-

## Canais ativos

- [ ] Instagram
- [ ] LinkedIn
- [ ] Google Ads
- [ ] Meta Ads
- [ ] TikTok
- [ ] Site

## Acessos recebidos

- [ ] Google Ads
- [ ] Meta Business
- [ ] Google Analytics
- [ ] Instagram
- [ ] Site/CMS

## Observações

```

### Template checklist-onboarding.md

```markdown
# Checklist Onboarding — {Nome do Cliente}

## Drive
- [ ] Pasta cliente criada em 02. CLIENTES
- [ ] Pasta criação criada em 02. MAKE - CRIAÇÃO
- [ ] Acesso do cliente configurado (após briefing)

## Briefing
- [ ] Google Forms enviado ao cliente
- [ ] Respostas recebidas
- [ ] Briefing.md preenchido

## Trello
- [ ] Card criado no board de clientes
- [ ] Responsável atribuído: {responsável}
- [ ] Entregas do contrato registradas

## Kickoff
- [ ] Reunião de kickoff agendada
- [ ] Acesso às ferramentas solicitado (Meta, Google, etc.)
- [ ] Prazo de entrega do primeiro material definido
```

---

## Passo 5 — Resumo final

Ao concluir, exibir:

```
Cliente: {Nome do Cliente}
Número: {número}
Tipo: {tipo}
Responsável: {responsável}

Pastas criadas:
✓ Drive cliente: 00. MAKELEMONAD > 02. CLIENTES > {número}. {Nome}
✓ Drive criação: 02. MAKE - CRIAÇÃO > {número}. {Nome}
✓ Workspace local: clientes/{slug}/

Próximos passos:
→ Enviar Google Forms de briefing
→ Criar card no Trello
→ Agendar kickoff
```

---

## IDs de referência

| Recurso | ID |
|---|---|
| Shared Drive MAKELEMONAD | `0ANDNjpfQd7ZmUk9PVA` |
| Shared Drive MAKE - CRIAÇÃO | `0AE-_ZuS1PIchUk9PVA` |
| Pasta 02. CLIENTES | `1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q` |
| Template Pastas para Clientes | `1vSNCrdGc80nH7r5YHvivqTStmkO1ubfk` |
| Template Pastas Criação | `1ttRqXWuct6zGQh-_I2oVLIpF5s808yx7` |
