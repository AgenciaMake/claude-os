# Prompt para Claude Cowork — adicionar o código OTP nos templates de e-mail do Supabase Auth

Copie e cole no Cowork com o navegador logado no Supabase Dashboard.

---

O login por código do CitraForm está enviando e-mail, mas o template padrão do Supabase só tem um link de confirmação, sem mostrar o código de 6 dígitos — e o app pede pra digitar o código, não clicar em link. Precisa editar os templates pra incluir a variável `{{ .Token }}`.

## Passo 1 — Editar os templates

No projeto `citraform-prod` → **Authentication → Email Templates**.

Existem provavelmente estes templates relevantes: **"Confirm signup"** (usado quando é a primeira vez desse e-mail) e **"Magic Link"** (usado em logins seguintes do mesmo e-mail). Edite os DOIS, um de cada vez:

Pra cada um, no corpo do e-mail (HTML), adicione uma linha visível com o código, por exemplo logo abaixo do parágrafo principal:

```html
<p style="font-size: 32px; font-weight: 700; letter-spacing: 4px; text-align: center;">{{ .Token }}</p>
```

Pode manter o link de confirmação que já existe (`{{ .ConfirmationURL }}`) junto, não precisa remover — só adicionar o código visível. Se preferir, pode simplificar o template inteiro, mas o mínimo necessário é ter `{{ .Token }}` aparecendo em algum lugar legível do corpo do e-mail.

Salve cada template depois de editar.

## Passo 2 — Testar

Se o Supabase tiver uma prévia/teste de envio nessa tela, use. Senão, não precisa testar aqui — o Bruno vai testar direto no app depois.

## Relatório final

- Quais templates foram editados (Confirm signup, Magic Link, outros que existirem)
- Se salvou com sucesso
- Cole o HTML final de pelo menos um dos templates editados, pra eu conferir que ficou correto
