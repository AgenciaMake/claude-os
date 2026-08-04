# Prompt para Claude Cowork — levantar DNS atual na HostGator

Copie e cole no Cowork com o navegador logado no painel da HostGator, onde estão registrados os domínios `citraform.com` e `citraforms.com.br`.

---

Você vai apenas **levantar informações**, sem alterar nada ainda — é reconhecimento antes de mexer em DNS de domínio já registrado, pra não quebrar nada que já exista (e-mail, outros subdomínios, etc).

## O que fazer

1. No painel da HostGator, acesse o domínio `citraform.com` → seção de DNS (geralmente "Gerenciar DNS" ou "Zona DNS").
2. Liste **todos** os registros DNS existentes hoje — tipo (A, CNAME, MX, TXT, NS, etc), nome/host, valor, e TTL se visível. Preste atenção especial a:
   - Registros `MX` (roteiam e-mail — se existirem, não podem ser removidos sem risco de quebrar e-mail do domínio)
   - Registros `TXT` (podem ser SPF, verificações de domínio de outros serviços — Google Workspace, Meta Business, etc)
   - Qualquer registro `A` ou `CNAME` já existente em `@` (raiz) ou `www` (pode já estar apontando pra algum site ou landing page ativa)
3. Confirme se o domínio usa **nameservers da própria HostGator** (DNS gerenciado lá) ou nameservers externos (nesse caso o DNS real não é editado na HostGator, e sim onde os nameservers apontam — isso muda tudo, reporte se for o caso).
4. Repita os passos 1-3 para `citraforms.com.br`.
5. Não edite, adicione ou remova nenhum registro. Só documente o que já existe.

## Relatório final

Organize por domínio (`citraform.com` primeiro, depois `citraforms.com.br`), listando cada registro encontrado em formato de tabela (Tipo | Nome | Valor | TTL). Sinalize claramente:
- Se há registros MX ativos (e-mail configurado nesse domínio)
- Se há algum registro em `@` ou `www` que pareça estar em uso ativo (ex: apontando pra hospedagem de site que já existe)
- Se os nameservers são da HostGator ou de outro provedor
