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
- **Nome do contato principal do cliente** (pessoa pra quem a mensagem do briefing vai ser enviada — só o primeiro nome basta)

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

Para criar cada pasta usar `mcp__google-drive__createFolder` com o `driveId: "0ANDNjpfQd7ZmUk9PVA"`.

### Pasta USER — permissões

Após o briefing, quando o cliente informar o(s) email(s), configurar a pasta `{NOME} - USER`:

- **Cliente com Gmail**: permissão `writer` (pode adicionar e editar)
- **Cliente sem Gmail**: permissão `commenter` (só pode adicionar — limitação do Google)

Usar `mcp__google-drive__addPermission` na pasta USER com o email fornecido no briefing.

---

## Passo 3 — Criar pasta no Drive (área de criação)

**Destino**: Shared Drive `02. MAKE - CRIAÇÃO` (ID: `0AE-_ZuS1PIchUk9PVA`)

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

## Passo 5 — Gerar código de briefing e registrar na Sheet

Gerar um código único no formato `MK-XXXXX` (5 caracteres aleatórios maiúsculos/números, ex: `MK-8F3K2`).

Adicionar uma linha na Sheet `MAKE_BRIEFING_REGISTRO` (ID: `177tCA1GgrC9WyFiwi2PQmiqWg_69dDe6DSKxruVePt0`):

| Campo | Valor |
|---|---|
| CÓDIGO | `MK-XXXXX` gerado |
| CLIENTE | Nome do cliente |
| NÚMERO | Número do cliente |
| SERVIÇOS CONTRATADOS | Lista dos serviços (separados por vírgula) |
| STATUS | `pendente` |
| DATA DE CRIAÇÃO | Data atual no formato `DD.MM.AA` |
| DATA DO BRIEFING | (vazio — preenchido quando o cliente concluir) |
| RESPONSÁVEL INTERNO | Nome do responsável informado no Passo 1 |
| EMAIL CLIENTE | (vazio — preenchido após receber o briefing) |
| OBSERVAÇÕES | (vazio) |

Usar `mcp__google-drive__appendSpreadsheetRows` para inserir a linha.

---

## Passo 6 — Resumo final

Ao concluir, exibir **dois blocos**:

### Bloco 1 — Status interno (pra Amanda conferir)

```
Cliente: {Nome do Cliente}
Número: {número}
Tipo: {tipo}
Responsável: {responsável}

Pastas criadas:
✓ Drive cliente: 00. MAKELEMONAD > 02. CLIENTES > {número}. {Nome}
✓ Drive criação: 02. MAKE - CRIAÇÃO > {número}. {Nome}
✓ Workspace local: clientes/{slug}/

Código de briefing: MK-XXXXX
Link do app: https://makelemonad-briefing.pages.dev
```

### Bloco 2 — Mensagem pronta pra mandar ao cliente

Exibir exatamente essa mensagem, já formatada e pronta pra copiar e colar no WhatsApp:

```
Oi, {primeiroNomeDoCliente}! Tudo bem?

Aqui é da MakeLemonAd 🍋

Pra dar o start no seu projeto, preciso que você responda um briefing
rápido com nosso assistente virtual, o Alfred. Leva uns 20 minutos
e ajuda muito a equipe a entender seu negócio antes de começar.

🔗 https://makelemonad-briefing.pages.dev
🔑 Código: MK-XXXXX

Qualquer dúvida, é só me chamar aqui!
```

Obs: {primeiroNomeDoCliente} é só o primeiro nome (ex: se o cliente é "Empresa ABC", use o nome do responsável pelo contato se já conhecido; senão, coloca "pessoal" ou similar — perguntar no Passo 1 se faz sentido capturar esse nome também).

### Próximos passos a lembrar a Amanda

```
→ Copiar a mensagem acima e enviar ao contato do cliente
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
