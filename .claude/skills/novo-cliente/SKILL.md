# Skill: /novo-cliente

Onboarding operacional de um novo cliente da MakeLemonAd.

> O código de briefing (MK-XXXXX) e o cadastro do cliente agora são gerados automaticamente pelo CitraDesk ao criar o cliente lá. Essa skill cuida só da estrutura de pastas e workspace.

## Quando usar

Sempre que um contrato for assinado e o cliente já tiver sido cadastrado no CitraDesk.

## O que faz

1. Coleta as informações básicas do cliente
2. Cria as duas pastas no Google Drive (cliente + criação)
3. Cria a pasta local no workspace
4. Gera o checklist de onboarding

---

## Passo 1 — Coletar informações

Perguntar ao usuário:

- **Nome do cliente** (como vai aparecer nas pastas)
- **Número do cliente** (já definido no CitraDesk — confirmar qual é)
- **Tipo de serviço**: 360 / Social Media / Performance (Tráfego Pago) / Desenvolvimento / Outro
- **Responsável interno** (Amanda, Thayná, Gustavo, Tiago, etc.)

Formatar o nome da pasta como: `{número}. {Nome do Cliente}`
Exemplo: `33. Empresa ABC`

---

## Passo 2 — Criar pasta no Drive (área do cliente)

**Destino**: `02. CLIENTES` (ID: `1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q`) dentro do Shared Drive `00. MAKELEMONAD` (ID: `0ANDNjpfQd7ZmUk9PVA`)

Usando o MCP `google-drive`, criar a pasta principal e toda a estrutura abaixo:

```
{número}. {Nome do Cliente}/
  ├── 00. OLD
  ├── 01. Criativos/
  │   ├── 00. OLD
  │   ├── 01. Imagens
  │   ├── 02. Fonts
  │   ├── 03. AFs
  │   └── V1
  ├── 02. Materiais de Apoio
  ├── 03. Materiais do Cliente/
  │   └── {NOME DO CLIENTE EM CAIXA ALTA} - USER   ← pasta com permissão especial
  ├── 04. Apresentação
  ├── 05. Documentos
  ├── 06. Planilhas
  ├── 07. Ads
  ├── 08. Pautas e Reunioes
  ├── 09. Relatórios
  ├── 10. Senhas
  └── 11. Logos
```

**ATENÇÃO — parâmetro correto da ferramenta:** `mcp__google-drive__createFolder` só aceita `name` e `parent` (o ID da pasta-mãe). NÃO existe parâmetro `driveId` nem `parentId` nessa ferramenta — se você passar esses nomes, a chamada não dá erro, ela simplesmente os ignora silenciosamente e cria a pasta solta na raiz do "Meu Drive" pessoal, fora do Shared Drive. Já aconteceu em produção (onboarding do Fábio Sassaki, 2026-09-07) e gerou 18 pastas soltas que precisaram ser apagadas e recriadas.

Pra criar a pasta principal, usar `parent: "1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q"` (ID de "02. CLIENTES" — já está dentro do Shared Drive, então o Drive API resolve o driveId sozinho). Pra cada subpasta, usar `parent: {ID da pasta recém-criada correspondente}`.

**Verificação obrigatória:** depois de criar a pasta principal do cliente, antes de criar qualquer subpasta, confirmar que ela caiu no lugar certo com uma busca raw:
```
mcp__google-drive__search com rawQuery=true, query: "'{ID_DA_PASTA_MAE}' in parents and name = '{NOME_DA_PASTA_CRIADA}' and trashed = false"
```
Se não aparecer nada, ou aparecer com `path: Meu Drive`, a pasta foi criada no lugar errado — pare e corrija antes de continuar (apagar e recriar com o `parent` certo).

### Pasta USER — permissões

Após o briefing, quando o cliente informar o(s) email(s) (disponíveis no CitraDesk após o Alfred concluir), configurar a pasta `{NOME} - USER`:

Sempre usar permissão `writer` (contribuidor) — independente de o e-mail ser Gmail ou corporativo. Testado em produção: o Google aceita `writer` para e-mails sem Conta Google desde que `sendNotificationEmail: true` seja enviado (o convite chega por e-mail e o cliente precisa aceitar).

Usar `mcp__google-drive__addPermission` na pasta USER com `role: "writer"`, `type: "user"`, `sendNotificationEmail: true`.

### Permissão obrigatória do Alfred na pasta "03. Materiais do Cliente"

O Alfred (app de briefing) sobe anexos e salva o Doc do briefing nessa pasta usando uma service account própria (`briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com`). A permissão herdada do Shared Drive **não propaga de forma confiável** pras subpastas de cada cliente novo (já causou "Pasta do cliente não encontrada no Drive" em produção). Por isso, é obrigatório, logo após criar a pasta "03. Materiais do Cliente":

1. Rodar `mcp__google-drive__addPermission` nessa pasta com `emailAddress: "briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com"`, `role: "writer"`, `type: "user"`, `sendNotificationEmail: false`.
2. Gravar o ID dessa pasta no Firestore, direto no doc público `tenants/makelemonad/briefing_lookup/{briefingCode}` (já existe nesse ponto, criado pelo CitraDesk ao salvar o cliente com o código de briefing), via PATCH REST sem autenticação:

```
curl -X PATCH "https://firestore.googleapis.com/v1/projects/gen-lang-client-0548502624/databases/bdmakegestorpro/documents/tenants/makelemonad/briefing_lookup/{briefingCode}?updateMask.fieldPaths=materialsFolderId" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"materialsFolderId": {"stringValue": "{ID_DA_PASTA_03_MATERIAIS}"}}}'
```

Sem esses dois passos, o Alfred não consegue salvar nada na pasta do cliente (nem anexos, nem o Doc final do briefing).

---

## Passo 3 — Criar pasta no Drive (área de criação)

**Destino**: dentro da pasta do ANO CORRENTE, dentro do Shared Drive `02. MAKE - CRIAÇÃO` (ID: `0AE-_ZuS1PIchUk9PVA`) — ex: `02. MAKE - CRIAÇÃO/2026/{número}. {Nome}`.

**Atenção — numeração é diferente da de "02. CLIENTES":** essa área organiza por pasta de ano, e cada ano tem sua PRÓPRIA sequência numérica, independente do número usado em "02. CLIENTES". Antes de criar, listar a pasta do ano corrente (`mcp__google-drive__listFolder`) e usar o próximo número disponível NESSA pasta — não reaproveitar o número de "02. CLIENTES". Já aconteceu de criar a pasta certa mas no lugar errado (raiz do Shared Drive em vez de dentro do ano) e com o número errado (copiado de "02. CLIENTES") — precisou mover e renomear depois.

Criar a pasta principal e toda a estrutura abaixo:

```
{número}. {Nome do Cliente}/
  ├── 00. Old
  ├── 01. Fonts
  ├── 02. Materiais de Apoio
  ├── 03. Materiais do Cliente
  ├── 04. Video
  └── 05. Arte/
      └── 00. SOCIAL MEDIA/
          ├── 01. Janeiro
          ├── 02. Fevereiro
          ├── 03. Março
          ├── 04. Abril
          ├── 05. Maio
          ├── 06. Junho
          ├── 07. Julho
          ├── 08. Agosto
          ├── 09. Setembro
          ├── 10. Outubro
          ├── 11. Novembro
          └── 12. Dezembro
```

Mesmo cuidado do Passo 2: usar só `parent` (nunca `driveId`/`parentId`), e verificar com busca raw que a pasta principal caiu dentro da pasta do ano certo antes de criar as subpastas. Pra achar o ID da pasta do ano corrente, buscar `'0AE-_ZuS1PIchUk9PVA' in parents and name = '{ano}' and trashed = false` (rawQuery), e usar o ID retornado como `parent` da pasta principal do cliente.

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

## CitraDesk
- [ ] Cliente cadastrado no CitraDesk
- [ ] Código de briefing gerado (MK-XXXXX) — visível no perfil do cliente
- [ ] Contrato PDF enviado para upload no CitraDesk

## Drive
- [ ] Pasta cliente criada em 02. CLIENTES
- [ ] Pasta criação criada em 02. MAKE - CRIAÇÃO
- [ ] Acesso do cliente configurado (após briefing)

## Briefing
- [ ] Mensagem WhatsApp enviada (código + link do Alfred)
- [ ] Briefing concluído pelo Alfred (aparece como "Concluído" no CitraDesk)
- [ ] Briefing.md preenchido com as respostas do Doc gerado

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

Ao concluir, exibir o status:

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
→ Código de briefing: disponível no perfil do cliente no CitraDesk
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
