# Prompt para Claude Cowork — diagnosticar por que citraform.com está desatualizado

Copie e cole no Cowork com o navegador logado no Vercel.

---

O site `citraform.com` está servindo uma versão antiga do CitraForm — sem a tela de login, sem o dashboard de formulários, sem a página pública `/f/{slug}`. Isso apesar de já termos dado push de vários commits recentes (auth, persistência de formulários, experiência pública) que buildam limpo localmente. Suspeita: os deploys mais recentes estão falhando no Vercel e a produção ficou presa no primeiro deploy bem-sucedido.

## O que investigar

1. No projeto `citraform` da Vercel, vá em **Deployments**. Liste os últimos 6-8 deployments com: data/hora, commit (mensagem/hash), e status (Ready, Error, Building, Canceled).
2. Identifique qual deployment está atualmente marcado como **Production** (o que está de fato servindo `citraform.com` agora).
3. Se houver deployments com status **Error** ou **Failed** mais recentes que o commit `07e0889` (auth) ou `50e0fe7` (persistência) ou `38f0018` (experiência pública), abra os **Build Logs** do mais recente deployment com erro e copie a mensagem de erro completa (procure especialmente por erros relacionados a variáveis de ambiente do Supabase, ou qualquer erro de build/runtime).
4. Confirme também: as variáveis de ambiente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) ainda estão configuradas corretamente em Settings → Environment Variables, com os valores do projeto `citraform-prod` (não sobrou nenhum resquício de configuração antiga)?

## Relatório final

- Lista dos últimos deployments com status de cada um
- Qual está marcado como Production hoje
- Se algum deployment recente falhou, a mensagem de erro completa do build log
- Confirmação do estado atual das env vars
