---
name: IDs e caminhos do ecossistema MakeLemonAd
description: Google Drive IDs, Sheet do registro de briefing, paths do workspace e da skill/app
type: reference
originSessionId: e07a4ab4-587b-4e25-b0f9-8d80a07ea67d
---
**Google Drive**
- Shared Drive MAKELEMONAD: `0ANDNjpfQd7ZmUk9PVA`
- Shared Drive MAKE - CRIAÇÃO: `0AE-_ZuS1PIchUk9PVA`
- Pasta `02. CLIENTES`: `1R6NWb_YjeiMryxSS_a4U-ye5a0F2Wh4q`
- Template Pastas para Clientes: `1vSNCrdGc80nH7r5YHvivqTStmkO1ubfk`
- Template Pastas Criação: `1ttRqXWuct6zGQh-_I2oVLIpF5s808yx7`
- Sheet `MAKE_BRIEFING_REGISTRO`: `177tCA1GgrC9WyFiwi2PQmiqWg_69dDe6DSKxruVePt0` — colunas A-J: CÓDIGO, CLIENTE, NÚMERO, SERVIÇOS, STATUS, DATA CRIAÇÃO, DATA BRIEFING, RESPONSÁVEL, EMAIL, OBSERVAÇÕES

**Workspace**
- Root: `/Users/brunomartins/Desktop/CCode/ccos-make/`
- Skill novo-cliente: `.claude/skills/novo-cliente/SKILL.md`
- App briefing: `apps/briefing/`
- Pasta modelo de cliente: `clientes/_modelo-cliente/`

**Cloudflare Pages**
- Project name: `makelemonad-briefing` (NÃO criado ainda — nasce no primeiro deploy)
- Conta autenticada: `bruno@makelemonad.com.br` — account ID `8978598388ccc2513f2f23b68b9eed8c`
- Dev: `cd apps/briefing && npm run dev` (wrangler pages dev)
- Deploy: `npm run deploy`
- Secrets: `npx wrangler pages secret put {NAME} --project-name=makelemonad-briefing`
- Secrets necessários: `CLAUDE_API_KEY`, `SHEET_ID`, `GOOGLE_SERVICE_ACCOUNT` (JSON completo)

**Google Cloud / Service Account do app briefing**
- Projeto GCP: `makelemonad-drive-mcp`
- Service Account: `briefing-app@makelemonad-drive-mcp.iam.gserviceaccount.com`
- Chave JSON ID atual: `1bc5cbd0c2fbe14fbcc6f6529273767f73e3b883` (rotacionada em 2026-04-22)
- Acesso: writer na Sheet `MAKE_BRIEFING_REGISTRO` + writer no Shared Drive `00. MAKELEMONAD`
- APIs que precisam estar ativas no projeto GCP: Sheets API, Drive API, Docs API

**Claude API**
- Key do app: "MakeLemonAd Briefing App" (criada no console)
- Modelo usado no chat.js: `claude-sonnet-4-6`
