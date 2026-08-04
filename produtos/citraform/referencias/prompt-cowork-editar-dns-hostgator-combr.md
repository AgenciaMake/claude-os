# Prompt para Claude Cowork — editar DNS de citraform.com.br (confirmado seguro)

Copie e cole no Cowork, continuando de onde parou na tela "Escolha a plataforma de site" de `citraform.com.br`.

---

Confirmei via consulta DNS pública (fora do painel HostGator) que `citraform.com.br` tem exatamente o mesmo padrão placeholder que `citraform.com` tinha antes da edição: MX apontando pra si mesmo (prioridade 0), registro A em `162.240.81.81` (IP de estacionamento padrão da HostGator), CNAME `www` apontando pra si mesmo, e nenhum registro TXT. Não há nada real configurado nesse domínio — pode prosseguir com confiança, mesmo que a interface do painel tenha mostrado um fluxo diferente do `.com`.

## Passos

1. Clique em **"Sem hospedagem (apenas Zona de DNS)"** e depois em **"Configurar"**, aceitando o aviso de perda de configuração (confirmado que não há nada de valor a perder).
2. Chegue na Zona de DNS de `citraform.com.br` e confirme que os registros batem com o padrão esperado (A em `162.240.81.81`, CNAME `www`/`ftp`/`mail` apontando pra si mesmo, MX prioridade 0 pra si mesmo). Se algo vier diferente do esperado depois de "Configurar", pare e reporte antes de editar.
3. Edite o registro **A** (raiz/`citraform.com.br.`) de `162.240.81.81` para **`216.150.1.1`**. Salve.
4. Edite o registro **CNAME** `www.citraform.com.br.` de `citraform.com.br` para **`beaa78f161a723e8.vercel-dns-016.com.`**. Salve.
5. Não toque em `ftp`, `mail` nem no `MX`.

## Depois

1. Volte no Vercel (projeto `citraform` → Settings → Domains) e clique **Refresh** nos 4 domínios (`citraform.com`, `www.citraform.com`, `citraform.com.br`, `www.citraform.com.br`).
2. Reporte o status final de cada um (Valid Configuration ou ainda propagando) e confirme que as duas edições em `citraform.com.br` foram salvas.
