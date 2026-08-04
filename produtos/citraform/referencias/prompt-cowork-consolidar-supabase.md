# Prompt para Claude Cowork — consolidar Supabase na organização AgenciaMake (eliminar Pro duplicado)

Copie e cole no Cowork, com o navegador logado no Supabase e no Vercel. Siga a ordem exata — não pule etapas nem apague nada antes da hora marcada.

---

Contexto: hoje existem duas organizações Supabase, cada uma pagando Pro ($25/mês): "AgenciaMake" (com o projeto `citrachat-dev`) e "agenciamake's projects" (criada automaticamente pelo Vercel Marketplace, com o projeto `citraform-prod`, ainda vazio — nenhuma migration foi aplicada nele ainda, não há dado nenhum a perder). Objetivo: ficar com **um projeto só, dentro da organização "AgenciaMake"**, e eliminar a segunda assinatura Pro.

## Passo 1 — Criar o projeto novo, no lugar certo

1. No Supabase Dashboard, com a organização **"AgenciaMake"** selecionada (a mesma do `citrachat-dev`), clique em **New Project**.
2. Nome: `citraform-prod`.
3. Região: **South America (São Paulo) — sa-east-1** (mesma do `citrachat-dev` e do projeto antigo).
4. Banco/senha: gere uma senha forte (o Supabase sugere uma), anote/copie — vai precisar depois só se for conectar via string de conexão direta, mas normalmente não precisa.
5. Crie o projeto e espere provisionar (leva 1-2 minutos).
6. Depois de criado, vá em **Project Settings → API** e copie: **Project URL**, **anon public key**, **service_role key** (essa é secreta, não exponha em lugar nenhum além do Vercel).

## Passo 2 — Desconectar a integração antiga no Vercel

1. No Vercel, projeto `citraform` → **Settings → Integrations** (ou Storage).
2. Encontre a integração Supabase existente (conectada ao projeto antigo, da organização "agenciamake's projects") e **remova/desconecte** essa integração. Isso deve remover as env vars que ela injetou automaticamente (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_*`, etc — confira e apague manualmente qualquer uma que sobrar em Settings → Environment Variables).

## Passo 3 — Conectar manualmente ao projeto novo (sem usar o Marketplace de novo)

Em vez de usar a integração automática do Marketplace (que foi o que criou a organização duplicada da primeira vez), adicione as variáveis manualmente em Settings → Environment Variables do projeto `citraform`, para Production, Preview e Development:

```
NEXT_PUBLIC_SUPABASE_URL=<Project URL copiado no Passo 1>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key copiado no Passo 1>
SUPABASE_SERVICE_ROLE_KEY=<service_role key copiado no Passo 1>
```

## Passo 4 — Redeploy

Deployments → Redeploy no último commit, pra pegar as novas env vars.

## Passo 5 — Confirmar que o novo projeto funciona ANTES de apagar qualquer coisa

Confirme que o redeploy passou sem erro. Se quiser, pode checar no Supabase (SQL Editor do `citraform-prod` novo) rodando `select 1;` só pra confirmar que o projeto responde.

## Passo 6 — SÓ AGORA apagar o projeto/organização duplicados

**Não faça isso antes de confirmar o Passo 5.**

1. No Supabase, vá no projeto antigo (dentro da organização "agenciamake's projects") → Project Settings → General → **Delete Project** (confirme, já que está vazio e sem uso).
2. Depois de apagar o projeto, vá na organização "agenciamake's projects" → Settings/Billing e veja se ainda mostra cobrança ativa. Como o aviso dizia "Billing... managed in Vercel", pode ser necessário ir no **Vercel** também (Account/Team Settings → Marketplace ou Integrations → Supabase) para remover/cancelar essa assinatura por lá. Se não achar onde cancelar, **pare e reporte** em vez de tentar mexer em cobrança às cegas.

## Relatório final

- Projeto novo criado com sucesso, e se o redeploy do Vercel passou
- Confirmação de que as env vars antigas (da organização duplicada) foram removidas
- Se conseguiu apagar o projeto antigo e cancelar a assinatura Pro duplicada, e onde exatamente isso foi feito (Supabase ou Vercel)
- Se ficou alguma cobrança pendente ou dúvida sobre onde cancelar, descreva exatamente o que viu na tela
