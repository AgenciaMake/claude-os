# Prompt para Claude Cowork — finalizar tudo no projeto Vercel `citraform`

Copie e cole no Cowork depois de logar manualmente na sua conta Vercel na aba que ele já tinha aberto (ele não faz login sozinho, por segurança).

---

Você vai finalizar a configuração do projeto `citraform` no Vercel (org `AgenciaMake`/conta `makelemonad`). O DNS dos domínios `citraform.com` e `citraform.com.br` já foi corrigido na HostGator (registro A → `216.150.1.1`, CNAME `www` → `beaa78f161a723e8.vercel-dns-016.com.`). Siga os passos na ordem — cada um depende do anterior.

## Passo 1 — Confirmar domínios

No projeto `citraform` → Settings → Domains, clique em **Refresh** nos 4 domínios:
- `citraform.com`
- `www.citraform.com`
- `citraform.com.br`
- `www.citraform.com.br`

Anote o status de cada um (Valid Configuration ou ainda propagando/Invalid — se ainda inválido, não é erro, DNS pode levar até algumas horas).

## Passo 2 — Criar o projeto Supabase (plano Pro)

Vá em Integrations (ou Storage) → Supabase → conectar/criar recurso. Na tela de configuração:
1. Selecione o plano **Pro** (não Free — o Bruno já paga Pro na organização Supabase usada pelo CitraChat; confirme que o projeto novo é criado dentro dessa mesma organização/conta, não uma nova).
2. Nome do recurso: mantenha o sugerido, ou troque para algo como `citraform`/`citraform-prod` se o campo permitir editar antes de criar.
3. Região: Washington D.C. (East), a menos que veja uma opção mais próxima da região já usada pelo projeto do CitraChat (se conseguir checar isso no dashboard Supabase, prefira igualar).
4. Confirme a criação.
5. Depois de criado, confirme no projeto Vercel (Settings → Environment Variables) que as variáveis `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY` foram substituídas automaticamente pelos valores reais (não devem mais aparecer os placeholders antigos).

## Passo 3 — Conectar Resend

Em Integrations → Resend → **"Link Existing Resend Account"** (conta já usada pelo CitraChat).
- Se o popup de OAuth travar (já aconteceu uma vez): tente clicar direto no botão dentro do popup em vez de esperar redirecionamento automático, ou veja se há opção de abrir em nova aba.
- Depois de conectar, adicione `citraform.com` como domínio verificado dentro da Resend (Settings → Domains → Add Domain). Ela vai gerar registros DNS (SPF/DKIM, tipicamente TXT e CNAME) — **anote esses registros exatos**, pois também vão precisar ser adicionados na Zona de DNS da HostGator (não configure isso agora, só anote e reporte).
- Se travar de novo, pare e reporte — nesse caso o Bruno completa manualmente.

## Passo 4 — Redeploy

Depois de Supabase e Resend configurados, vá em Deployments → menu do último deployment → **Redeploy**, pra garantir que o build pega as novas variáveis de ambiente reais.

## Relatório final

Me diga, na ordem:
1. Status de cada um dos 4 domínios após o Refresh
2. Se o Supabase foi criado em Pro com sucesso, nome final do recurso, e se as env vars foram substituídas automaticamente
3. Se a Resend conectou dessa vez, e se sim, quais registros DNS exatos ela pediu para verificar `citraform.com`
4. Se o redeploy passou sem erro, e a URL final de produção
5. Qualquer erro, tela inesperada, ou passo que não pôde ser concluído
