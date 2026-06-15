# Verificar aprovação LinkedIn — CitraChat

## Contexto

Criamos um app no LinkedIn Developer Portal chamado **citrachat-org** (Client ID: `786j2jt1x20ujb`) e solicitamos acesso ao **Community Management API** para poder publicar na página de empresa **Citra.Chat** via PostForMe.

O app já está verificado com a página. As credenciais já estão no PostForMe. Só falta o LinkedIn aprovar o Community Management API.

## O que verificar

1. Acessa o LinkedIn Developer Portal: https://www.linkedin.com/developers/apps
2. Abre o app **citrachat-org**
3. Vai na aba **Products**
4. Verifica o status do **Community Management API**:
   - Se estiver **"Added"** ou **"Approved"** → aprovado, pode prosseguir
   - Se estiver **"Pending"** → ainda aguardando, nada a fazer

## Se aprovado — próximos passos

1. Abre o PostForMe (postforme.dev) no projeto **CitraChat**
2. Vai em **Social Media Accounts → Connect → LinkedIn**
3. Na tela de login, seleciona **"Organization"** (não Personal)
4. Escolhe a página **Citra.Chat**
5. Copia o novo **Account ID** gerado (começa com `spc_`)
6. Atualiza o `.env` do projeto em `/Users/brunomartins/Desktop/CCode/ccos-make/.env`:
   ```
   CITRACHAT_POSTFORME_LINKEDIN_ACCOUNT_ID=spc_NOVO_ID_AQUI
   ```
7. Confirma pra Bruno que está tudo pronto pra publicar no LinkedIn do CitraChat

## Se ainda pendente

Informa Bruno que a aprovação ainda não chegou e que o LinkedIn costuma levar 1–5 dias úteis.
