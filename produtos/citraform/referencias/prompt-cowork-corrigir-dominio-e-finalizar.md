# Prompt para Claude Cowork — corrigir domínio .com.br e finalizar Supabase

Copie e cole no Cowork, continuando na sessão logada do Vercel.

---

## 1. Corrigir domínio errado

O domínio `citraforms.com.br` (com "s" extra) foi cadastrado por engano no projeto `citraform` — o correto é `citraform.com.br` (sem "s"), que já tem o DNS certo configurado na HostGator (A → 216.150.1.1).

1. Em Settings → Domains, remova `citraforms.com.br` e `www.citraforms.com.br`.
2. Adicione `citraform.com.br` e `www.citraform.com.br` no lugar, com a mesma configuração de antes: redirect 308 para `citraform.com`.
3. Clique em Refresh nesses dois novos domínios e confirme o status (deve dar "Valid Configuration" já de cara, já que o DNS pra esse domínio específico já está correto há um tempo).

## 2. Liberar a conexão do Supabase

1. Em Settings → Environment Variables, apague as 3 variáveis placeholder antigas: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Volte na integração Supabase (`citraform-prod`, já criado em Pro, região São Paulo) e complete a conexão do banco ao projeto `citraform` — agora sem conflito de nomes.
3. Confirme que as 3 variáveis foram recriadas automaticamente com os valores reais do projeto `citraform-prod`.

## 3. Redeploy

Depois dos dois passos acima, vá em Deployments → Redeploy no último commit, pra pegar as env vars reais do Supabase.

(Resend fica pendente — o Bruno vai completar manualmente depois, não precisa tentar de novo agora.)

## Relatório final

- Status dos domínios `citraform.com.br` / `www.citraform.com.br` depois de recriados e com Refresh
- Confirmação de que as env vars do Supabase foram substituídas pelos valores reais
- Se o redeploy passou sem erro e a URL de produção final
