# Prompt para Claude Cowork — checar organizações e planos no Supabase

Copie e cole no Cowork com o navegador logado no Supabase Dashboard (app.supabase.com).

---

Preciso confirmar se existe duplicidade de assinatura Pro no Supabase. Quando o projeto `citraform-prod` foi criado via integração do Vercel Marketplace, pode ter sido criado numa organização nova em vez de dentro da organização já existente que paga o Pro do CitraChat — o que geraria uma segunda cobrança Pro desnecessária.

## O que verificar

1. No canto superior esquerdo do dashboard (ou em `app.supabase.com/org`), abra o seletor/lista de **organizações**. Liste todas as organizações que aparecem na conta.
2. Para cada organização listada, entre em **Settings → Billing** (ou "Subscription") e anote o **plano atual** (Free, Pro, Team) e, se possível, o **valor cobrado**.
3. Para cada organização, liste os **projetos** dentro dela (ex: `citrachat-dev` deveria estar numa, `citraform-prod` deveria estar na mesma ou em outra).
4. Confirme explicitamente: `citrachat-dev` e `citraform-prod` estão na **mesma organização**, ou em organizações **diferentes**?

## Relatório final

Organize assim:
- Organização 1: nome, plano, projetos dentro dela
- Organização 2 (se existir): nome, plano, projetos dentro dela
- (repita se houver mais)
- Resposta direta: existe duplicidade de plano Pro pagando duas vezes pela mesma coisa, sim ou não?

Não cancele nem altere nenhuma assinatura — só levante a informação.
