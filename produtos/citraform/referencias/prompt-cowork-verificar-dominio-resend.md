# Prompt para Claude Cowork — verificar citraform.com na Resend + configurar DNS na HostGator

Copie e cole no Cowork, com o navegador logado na Resend e na HostGator.

---

O domínio `citraform.com` ainda não está cadastrado na Resend. Vamos adicionar e verificar, depois aplicar os registros DNS necessários na HostGator (mesmo processo seguro já usado antes pra apontar o domínio pro Vercel — Zona de DNS granular, editar/adicionar registro por registro, nunca passar pelo assistente "Configurar domínio").

## Passo 1 — Adicionar o domínio na Resend

1. Na Resend (resend.com/domains), clique em **Add Domain**.
2. Digite `citraform.com`.
3. Ela vai gerar um conjunto de registros DNS pra verificação — tipicamente: um `TXT` (SPF, tipo `v=spf1 include:...`), um ou mais `CNAME` ou `TXT` de DKIM (geralmente 3 registros DKIM com nomes tipo `resend._domainkey`, `resend2._domainkey`, `resend3._domainkey` — pode variar), e possivelmente um `MX` se a Resend gerenciar recebimento (normalmente não precisa pra só enviar e-mail transacional, confirme o que aparecer).
4. **Anote exatamente** tipo, nome/host e valor de cada registro pedido. Não feche essa tela ainda.

## Passo 2 — Aplicar os registros na Zona de DNS da HostGator

1. No painel HostGator, vá em `citraform.com` → "Configurar Domínio" → **"Mostrar configuração manual da Zona de DNS"** (mesmo caminho seguro já usado antes — a lista de registros com botões Editar/Excluir por linha, não o assistente "Sem hospedagem").
2. Para cada registro que a Resend pediu no Passo 1, clique em **"ADICIONAR REGISTRO"** (não edite os registros já existentes de A/CNAME do Vercel — são coisas diferentes, adicione novos).
3. Preencha tipo, nome e valor exatamente como a Resend mostrou. Salve cada um.
4. **Não toque** nos registros `A` (raiz), `CNAME www` (já apontam pro Vercel), nem em `ftp`/`mail`/`MX` existentes — a menos que a Resend peça especificamente pra alterar o `MX`, o que seria incomum pra esse tipo de configuração (só de envio). Se isso acontecer, pare e reporte antes de mexer no MX existente.

## Passo 3 — Verificar na Resend

1. Volte na Resend e clique em **Verify DNS Records** (ou equivalente).
2. DNS pode levar minutos a algumas horas pra propagar — se não verificar de cara, não é erro, tenta de novo depois de um tempo.

## Relatório final

- Quais registros exatos a Resend pediu (tipo, nome, valor) — cole a lista completa
- Se todos foram adicionados com sucesso na HostGator
- Se a verificação já passou, ou se ainda está propagando
- Qualquer erro ou comportamento inesperado (principalmente se a Resend pedir pra mexer no MX)
