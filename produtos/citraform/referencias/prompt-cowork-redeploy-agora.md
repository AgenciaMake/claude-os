# Prompt para Claude Cowork — redeploy manual do commit mais recente (citraform)

Copie e cole no Cowork com o navegador logado no Vercel.

---

No projeto `citraform`, vá em **Deployments** e encontre o deployment do commit **`38f0018`** ("Public respondent experience: /f/[slug]") — o mais recente, hoje marcado como **Blocked**.

1. Abra o menu de três pontos (⋯) desse deployment (ou entre nele e procure o botão) e clique em **Redeploy**.
2. Se aparecer alguma opção tipo "Use existing Build Cache" vs rebuild do zero, pode usar a opção padrão.
3. Confirme o redeploy e acompanhe até o status virar **Ready**.
4. Confirme que esse novo deployment ficou marcado como **Production** (servindo `citraform.com`) — se não promover automaticamente, procure a opção "Promote to Production" nesse deployment.
5. Depois de pronto, acesse `https://citraform.com/login` num navegador anônimo/aba nova e confirme que carrega a tela de login (não deve dar 404).

## Relatório final

- Se o redeploy completou com sucesso (status Ready)
- Se foi promovido pra Production automaticamente ou precisou de ação manual
- Confirmação de que `citraform.com/login` está respondendo (não 404)
- Qualquer erro que apareceu
