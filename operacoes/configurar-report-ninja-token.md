# Configurar Report Ninja Token — Cloudflare Pages

**Projeto:** makelemonad-prr  
**O que faz:** Liga o dashboard de plano de mídia ao Report Ninja para puxar dados reais de Meta, LinkedIn e Google Ads automaticamente.

---

## Passo 1 — Pegar o token do Report Ninja

1. Acessa **app.reportingninja.com**
2. Clica no avatar / nome da conta no canto superior direito
3. Vai em **Settings → API** (ou **Account → API Key**)
4. Copia o token da API (começa com algo tipo `rn_...`)

---

## Passo 2 — Configurar na Cloudflare

Abre o terminal na pasta do projeto (`ccos-make`) e roda:

```bash
echo "COLE_O_TOKEN_AQUI" | npx wrangler pages secret put REPORT_NINJA_TOKEN --project-name makelemonad-prr
```

> Substitui `COLE_O_TOKEN_AQUI` pelo token copiado no passo 1.  
> Vai pedir login na Cloudflare se ainda não estiver autenticado — usa a conta `makelemonad@gmail.com`.

---

## Passo 3 — Confirmar

Depois de rodar, deve aparecer:

```
✨ Success! Saved secret REPORT_NINJA_TOKEN
```

Avisa o Bruno quando estiver feito.

---

**Dúvidas?** Fala com o Bruno.
