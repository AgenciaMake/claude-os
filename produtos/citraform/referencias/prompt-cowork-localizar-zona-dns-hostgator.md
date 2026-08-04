# Prompt para Claude Cowork — localizar o editor de Zona DNS na HostGator (sem alterar nada)

Copie e cole no Cowork, continuando logado no painel da HostGator.

---

Você já confirmou que `citraform.com` usa nameservers da própria HostGator (`dns3.hostgator.com.br`, `dns4.hostgator.com.br`) e que a opção "Configurar domínio" é um assistente que **reseta a configuração de apontamento atual** — por isso não foi usada. Sua tarefa agora é achar o editor de Zona DNS de verdade, sem passar por esse assistente.

## O que procurar

Explore o painel de cliente da HostGator (não é cPanel — como não há hospedagem ativa vinculada a `citraform.com`, o gerenciamento de DNS deve estar só no painel de domínios) procurando por algo como:
- "Zona DNS", "Editor de Zona DNS", "DNS Avançado", "Gerenciar DNS", "Registros DNS"
- Pode estar dentro de "Meus Produtos" → clicar no domínio → alguma aba separada de "Gerenciar" (não confundir com "Configurar domínio")
- Pode estar em um menu de "Ferramentas" ou "Avançado" na página de detalhes do domínio
- Verifique também se existe um cPanel de algum outro produto ativo na conta que dê acesso a "Zone Editor" (ferramenta clássica de zona DNS em cPanel) — mesmo que não seja o hosting deste domínio específico, às vezes o DNS de domínios "só registro" fica acessível por um cPanel de conta geral

## Regra de segurança

**Não clique em nada que pareça alterar, resetar, ou "configurar" o apontamento do domínio.** Se qualquer tela mostrar aviso de que a ação vai mudar a configuração atual, pare e volte, mesmo que pareça ser o caminho certo. Só reporte o que encontrou — a edição de verdade eu confirmo com o Bruno antes de fazer.

Se depois de explorar você não achar nenhum caminho de Zona DNS sem passar pelo assistente de "Configurar domínio", pare e reporte isso também — nesse caso o próximo passo é abrir um chat de suporte com a HostGator perguntando diretamente.

## Relatório final

- O caminho exato (cliques/menus) até a Zona DNS, se encontrado
- Prints ou descrição do que a tela de Zona DNS mostra (se chegou lá)
- Se não encontrou, o que foi tentado e onde travou
