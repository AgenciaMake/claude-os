# Prompt para Claude Cowork — finalizar Supabase e Resend no projeto CitraForm

Copie e cole no Cowork, continuando de onde parou (projeto `citraform` no Vercel, integração Supabase Marketplace já aberta na tela de confirmação).

---

## Supabase

Volte à integração Supabase do Marketplace no projeto `citraform` (Vercel → Integrations → Supabase, ou Storage). Na tela de criação do recurso:

1. Troque o plano de **Free** para **Pro** (o Bruno já paga o plano Pro na organização Supabase usada pelo CitraChat — confirme que o projeto novo vai ser criado dentro dessa mesma organização/conta, não numa conta nova).
2. Nome do recurso pode manter o sugerido (`supabase-coral-blanket`) ou, se der pra editar antes de criar, troque para algo como `citraform` ou `citraform-prod` — prefira isso se o campo permitir edição.
3. Região: mantenha Washington D.C. (East) a menos que veja outra opção mais alinhada com a região já usada pelo projeto do CitraChat (se conseguir checar isso no dashboard Supabase, prefira a mesma região do CitraChat pra latência).
4. Confirme a criação.
5. Depois de criado, confirme que as variáveis de ambiente foram injetadas automaticamente no projeto Vercel (Settings → Environment Variables) — devem substituir os placeholders `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` que já estavam lá.

## Resend

A conexão OAuth travou da última vez. Tente de novo:
1. No projeto Vercel → Integrations → Resend → "Link Existing Resend Account".
2. Se o popup de OAuth abrir e travar de novo, tente clicar diretamente no link/botão dentro do popup em vez de esperar redirecionamento automático, ou veja se há opção de abrir em nova aba em vez de popup.
3. Se travar de novo pela segunda vez, pare e me avise — nesse caso o Bruno vai completar essa conexão manualmente.

## Relatório final

Me diga:
- Se o Supabase foi criado em Pro com sucesso, nome final do projeto e se as env vars foram substituídas automaticamente
- Se a Resend conectou dessa vez ou travou de novo
- Redeploy: depois dessas duas integrações, force um novo deploy do projeto (Deployments → Redeploy no último commit) pra garantir que as env vars novas entram em vigor
