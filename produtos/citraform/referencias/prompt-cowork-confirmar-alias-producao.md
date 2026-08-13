# Prompt para Claude Cowork — confirmar se o deployment novo está aliasado à Production

Copie e cole no Cowork com o navegador logado no Vercel.

---

O commit `bd7496d` (empty commit, gerado pra forçar um novo evento de deploy) teve build com sucesso segundo a API do GitHub. Mas `citraform.com/login` continua servindo conteúdo antigo (campo de código com 6 dígitos, não 8) mesmo várias checagens depois, com cache-busting na URL.

## O que verificar

1. No projeto `citraform` → **Deployments**, encontre o deployment do commit `bd7496d`. Confirme o status (deve ser Ready).
2. Esse deployment tem a tag/badge **"Current"** ou está explicitamente listado como o deployment ativo em **Production**? Ou o deployment do `6dbc0f3` (mais antigo) ainda está marcado como o atual?
3. Vá em **Settings → Domains**, clique em `citraform.com`, e veja pra qual deployment ele está apontando/aliasado atualmente (deve mostrar o deployment específico vinculado).
4. Se `citraform.com` ainda estiver apontando pro deployment antigo (`6dbc0f3`) em vez do novo (`bd7496d`), promova o novo manualmente: no deployment `bd7496d`, procure a opção **"Promote to Production"**.
5. Depois de promover (se precisou), espere alguns segundos e acesse `https://citraform.com/login` numa aba anônima nova — confirme visualmente se o campo de código agora tem 8 caixinhas em vez de 6, e se o texto diz "código de verificação" (não mais "código de 6 dígitos").

## Relatório final

- Status do deployment `bd7496d` e se estava aliasado à Production ou não
- O que a tela de Domains mostrava antes de qualquer ação
- Se precisou promover manualmente, e se funcionou
- Confirmação visual final: o campo tem 8 caixinhas agora?
