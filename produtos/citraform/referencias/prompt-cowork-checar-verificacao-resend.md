# Prompt para Claude Cowork — checar verificação do domínio na Resend

Copie e cole no Cowork com o navegador logado na Resend.

---

Em `resend.com/domains`, abra o domínio `citraform.com`.

1. Veja o status atual (deveria ter mudado de "Pending" pra "Verified" — os registros DNS já propagaram há dias, confirmei via consulta DNS pública que DKIM, SPF, MX e DMARC estão todos resolvendo corretamente).
2. Se ainda mostrar "Pending", clique no botão de re-verificar (algo como "Verify DNS Records" de novo).
3. Reporte o status final de cada registro individualmente, se a tela mostrar isso (às vezes cada registro tem seu próprio ✓/✗).

## Relatório final

- Status final do domínio (Verified ou ainda Pending)
- Se algum registro específico aparecer com erro, quais e o que mostra
