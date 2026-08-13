# Prompt para Claude Cowork — checar integração Git do projeto Vercel (webhook não disparou)

Copie e cole no Cowork com o navegador logado no Vercel e no GitHub.

---

Confirmei que o commit `0ef6d69` chegou certinho no branch `main` do repositório `AgenciaMake/citraform` no GitHub (local e remoto batem exatamente). Mas esse push não gerou NENHUM registro no Vercel — nem como deployment, nem no log de Activity. Isso é diferente dos bloqueios anteriores (que pelo menos apareciam como "Blocked"). Parece que o Vercel simplesmente não recebeu o evento desse push.

## O que verificar

### No Vercel

1. Projeto `citraform` → **Settings → Git**. Confirme:
   - "Connected Git Repository" ainda aponta pra `AgenciaMake/citraform`?
   - "Production Branch" está configurado como `main`?
   - Existe algum toggle de "Ignored Build Step" ou algo que possa estar pulando builds condicionalmente? Se sim, o que está configurado ali?
2. Ainda em Settings → Git, veja se há algum aviso ou banner sobre a conexão com o GitHub precisar de reautorização.

### No GitHub

3. Vá em `github.com/organizations/AgenciaMake/settings/installations` (ou Settings da organização AgenciaMake → GitHub Apps / Installed GitHub Apps). Encontre o app **Vercel**.
4. Clique em "Configure" e confirme: o acesso está em "All repositories" ou "Only select repositories"? Se for "Only select repositories", o repositório `citraform` está na lista?
5. Se conseguir ver algo tipo "Recent Deliveries" ou histórico de eventos do app Vercel (pode não estar disponível pra apps de terceiros, só pra webhooks configurados pelo próprio usuário — se não encontrar, tudo bem, reporte que não achou).

## Relatório final

- O que a tela de Settings → Git do Vercel mostra (repo conectado, branch, qualquer toggle relevante)
- Se o GitHub App "Vercel" tem acesso ao repositório `citraform` (All repositories, ou lista específica incluindo/faltando esse repo)
- Qualquer aviso, erro ou coisa fora do normal que encontrar
