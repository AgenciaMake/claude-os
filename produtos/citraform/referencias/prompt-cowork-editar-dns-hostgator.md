# Prompt para Claude Cowork — editar registros DNS na HostGator (citraform.com e citraform.com.br)

Copie e cole no Cowork, continuando na tela de Zona de DNS de `citraform.com` que você já abriu (Portal do Cliente → Domínios → Configurar Domínio → "Mostrar configuração manual da Zona de DNS").

---

Confirmado: essa lista de registros individuais (com botões "Editar"/"Excluir" por linha) é o lugar certo e seguro pra fazer as alterações — diferente do assistente "Configurar domínio"/"Sem hospedagem" que reseta a configuração inteira, editar uma linha aqui só muda aquele registro específico.

## Para `citraform.com`

1. Localize a linha **A** — `citraform.com.` → valor atual `162.240.81.81`. Clique em **Editar** e troque o valor para **`216.150.1.1`**. Salve.
2. Localize a linha **CNAME** — `www.citraform.com.` → valor atual `citraform.com`. Clique em **Editar** e troque o valor para **`beaa78f161a723e8.vercel-dns-016.com.`**. Salve.
3. **Não toque** nas linhas `ftp.citraform.com`, `mail.citraform.com` nem no registro `MX` — são placeholders da HostGator, não usados hoje, e não têm relação com este deploy.

## Para `citraform.com.br`

1. Repita a mesma exploração: Portal do Cliente → Domínios → `citraform.com.br` → "Configurar Domínio" → "Mostrar configuração manual da Zona de DNS" (mesmo caminho, domínio diferente).
2. A lista de registros pode ter nomes um pouco diferentes (ex: `citraform.com.br.` em vez de `citraform.com.`), mas o padrão deve ser o mesmo (CNAMEs placeholder + MX placeholder + A record de estacionamento). Confirme visualmente antes de editar — se algo parecer diferente do padrão visto em `citraform.com` (por exemplo, um MX apontando pra um servidor de e-mail real, não pra si mesmo), **pare e reporte antes de editar**, não assuma que é igual.
3. Se o padrão for o mesmo placeholder: edite o registro **A** (raiz/`@`/`citraform.com.br.`) para **`216.150.1.1`**, e o registro **CNAME** `www` para **`beaa78f161a723e8.vercel-dns-016.com.`**. Não toque em `ftp`, `mail` ou `MX`.

## Depois de editar os dois domínios

1. Volte na aba do Vercel (projeto `citraform` → Settings → Domains).
2. Clique em **Refresh** em cada um dos 4 domínios listados (`citraform.com`, `www.citraform.com`, `citraform.com.br`, `www.citraform.com.br`) pra forçar a revalidação.
3. DNS pode levar de minutos a algumas horas pra propagar — se ainda aparecer "Invalid Configuration" logo após o Refresh, isso é esperado, não é erro.

## Relatório final

- Confirme que as duas edições em `citraform.com` foram salvas com sucesso (valores finais dos registros A e CNAME www)
- Confirme se o padrão em `citraform.com.br` era igual ao de `citraform.com`, e se as edições lá também foram aplicadas
- Status de cada domínio no Vercel depois do Refresh (Valid ou ainda Invalid/propagando)
- Qualquer coisa fora do esperado
