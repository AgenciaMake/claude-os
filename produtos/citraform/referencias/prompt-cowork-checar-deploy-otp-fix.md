# Prompt para Claude Cowork — checar se o deploy do fix de OTP foi pra produção

Copie e cole no Cowork com o navegador logado no Vercel.

---

Fizemos push do commit **`0ef6d69`** ("Fix OTP input to accept the actual code length Supabase sends") há alguns minutos, mas `citraform.com/login` continua mostrando a versão antiga (campo de 6 dígitos, não 8) mesmo com cache-busting na URL. Suspeita: o deploy não completou, não foi promovido pra Production, ou há algum problema de cache no Vercel.

## O que verificar

1. No projeto `citraform` → **Deployments**, encontre o deployment do commit `0ef6d69`. Qual o status (Ready, Building, Error, Blocked)?
2. Ele está marcado como **Production** (servindo `citraform.com`)? Se não, qual deployment está marcado como Production agora?
3. Se estiver com status **Error**, abra os Build Logs e copie a mensagem de erro.
4. Se estiver **Ready** mas não promovido, promova manualmente pra Production ("Promote to Production").
5. Se estiver tudo certo (Ready + Production) mas o site mesmo assim mostra conteúdo antigo, veja se há alguma opção de "Purge Cache" ou similar no projeto (Settings → Data Cache, ou no próprio deployment).

## Relatório final

- Status do deployment `0ef6d69`
- Se está marcado como Production
- Qualquer erro de build encontrado
- O que foi feito pra resolver (promoção manual, purge de cache, etc)
