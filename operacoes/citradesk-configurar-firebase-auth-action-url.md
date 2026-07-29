# CitraDesk — Configurar URL de Ação de Autenticação no Firebase

**Para quem:** Pessoa com acesso ao Firebase Console do CitraDesk  
**Tempo estimado:** 5 minutos  
**Objetivo:** Fazer com que os links de "Redefinição de senha" e "Verificação de e-mail" enviados pelo CitraDesk abram a página personalizada do sistema, em vez da página genérica do Firebase.

---

## Antes de começar

Confirma que tens acesso ao Firebase Console com conta Google que tem permissão no projeto. Se não tiveres, pede ao Bruno.

---

## Passo a passo

### 1. Abrir o Firebase Console

Acessa: **https://console.firebase.google.com/**

Faz login com a conta Google da Make se necessário.

---

### 2. Selecionar o projeto certo

Na lista de projetos, seleciona o projeto chamado **"CitraDesk"**  
(ID do projeto: `gen-lang-client-0548502624`)

> Se não aparecer nenhum projeto, pede ao Bruno para te adicionar como colaborador.

---

### 3. Ir para Authentication → Templates

No menu lateral esquerdo:
1. Clica em **"Build"** para expandir (se estiver fechado)
2. Clica em **"Authentication"**
3. Na página que abre, clica na aba **"Templates"** (na barra horizontal no topo da página)

---

### 4. Alterar a Action URL

No topo da página de Templates, deves ver um campo chamado **"Action URL"** com um botão de edição ao lado (ícone de lápis ou link).

Clica nesse botão de edição.

No campo que aparecer, **apaga o valor atual** e coloca:

```
https://makelemonad-citradesk.pages.dev
```

Clica em **"Save"** (ou "Salvar").

> Essa URL é o endereço do CitraDesk no ar. Todos os e-mails de autenticação vão agora abrir essa página em vez da página branca do Firebase.

---

### 5. Confirmar que salvou

Depois de salvar, a Action URL deve mostrar:  
`https://makelemonad-citradesk.pages.dev`

Se mostrar isso, está feito.

---

## Como testar (opcional)

1. Abre o CitraDesk: https://makelemonad-citradesk.pages.dev
2. Na tela de login, clica em **"Esqueci minha senha"**
3. Digita um e-mail válido de um usuário do sistema e confirma
4. Abre o e-mail recebido e clica no link
5. Deve abrir uma página preta com o logo do CitraDesk, campos de nova senha e o botão **"Confirmar nova senha"**

Se abrir assim, está tudo funcionando corretamente.

---

## Algo deu errado?

- **Não encontrou o projeto:** pede ao Bruno para verificar o acesso
- **Não aparece o campo "Action URL":** tenta atualizar a página e ir direto para Authentication → Templates novamente
- **O link do e-mail ainda abre a página branca:** pode levar alguns minutos para propagar — testa de novo em 5 minutos

Qualquer dúvida, fala com o Bruno.
