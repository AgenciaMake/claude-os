# Configurar Report Ninja Token — Cloudflare Dashboard

**Projeto:** makelemonad-prr  
**O que faz:** Liga o dashboard de plano de mídia ao Report Ninja para puxar dados reais de Meta, LinkedIn e Google Ads automaticamente.  
**Tudo pelo navegador, sem terminal.**

---

## Passo 1 — Pegar o token do Report Ninja

1. Acessa **app.reportingninja.com**
2. Clica no avatar / nome da conta no canto superior direito
3. Vai em **Settings → API**
4. Copia o valor do campo **API Key** (ou **API Token**)

> Guarda esse valor — vai precisar no próximo passo.

---

## Passo 2 — Abrir o projeto na Cloudflare

1. Acessa **dash.cloudflare.com**
2. Faz login com a conta **makelemonad@gmail.com**
3. No menu lateral, clica em **Workers & Pages**
4. Clica no projeto **makelemonad-prr**
5. Vai na aba **Settings**
6. No menu lateral clica em **Variables and Secrets** (ou "Environment Variables")

---

## Passo 3 — Adicionar o token

1. Clica em **Add** (ou **Add variable**)
2. No campo **Variable name** digita exatamente:
   ```
   REPORT_NINJA_TOKEN
   ```
3. No campo **Value** cola o token copiado no Passo 1
4. Marca como **Secret** (toggle/checkbox — esconde o valor)
5. Clica em **Save** (ou **Deploy** se pedir)

---

## Passo 4 — Confirmar

Após salvar, o token aparece na lista como `REPORT_NINJA_TOKEN ••••••••`.

Avisa o Bruno quando estiver feito — ele vai testar a conexão no dashboard.

---

**Dúvidas?** Fala com o Bruno.
