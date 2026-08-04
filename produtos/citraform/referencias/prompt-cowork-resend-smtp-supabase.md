# Prompt para Claude Cowork — configurar Resend como provedor de e-mail do Supabase Auth (CitraForm)

Copie e cole no Cowork com o navegador logado no Supabase (app.supabase.com) e na Resend (resend.com).

---

Por padrão, o Supabase Auth usa um sistema de e-mail interno limitado (poucos envios por hora) pra mandar os códigos de login (OTP). Isso não é confiável em produção. Vamos configurar o Resend como provedor de SMTP do Supabase Auth do projeto `citraform-prod`, pra garantir que os códigos de login cheguem de verdade.

## Passo 1 — Pegar a API key da Resend

1. Na Resend (resend.com/api-keys), veja se já existe uma API key ativa (provavelmente a mesma usada pelo CitraChat) ou crie uma nova chamada "citraform-smtp" com permissão de envio.
2. Confirme que o domínio `citraform.com` está verificado na Resend (Domains). Se não estiver, isso precisa ser resolvido antes — pare e reporte, não dá pra mandar e-mail de um domínio não verificado.

## Passo 2 — Configurar SMTP no Supabase

1. No dashboard do Supabase, abra o projeto `citraform-prod`.
2. Vá em **Project Settings → Authentication → SMTP Settings** (pode estar em "Auth" → "Emails" → "SMTP Provider" dependendo da versão da interface).
3. Ative "Enable Custom SMTP" e preencha:
   - **Sender email**: algo como `login@citraform.com` (precisa ser um endereço do domínio verificado na Resend)
   - **Sender name**: `CitraForm`
   - **Host**: `smtp.resend.com`
   - **Port**: `465` (SSL) — se der erro, tente `587` (TLS)
   - **Username**: `resend`
   - **Password**: a API key da Resend copiada no Passo 1
4. Salve.

## Passo 3 — Testar

Se o Supabase tiver algum botão de "Send test email" nessa mesma tela, use-o. Se não tiver, não precisa testar login de verdade agora — só confirme que a configuração foi salva sem erro.

## Relatório final

- Se o domínio `citraform.com` já estava verificado na Resend, ou se travou nisso
- Se a configuração de SMTP foi salva com sucesso no Supabase
- Qualquer erro ou aviso que apareceu
