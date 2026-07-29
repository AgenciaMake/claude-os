# Prompt para Claude Cowork — Configurar Firebase Action URL

Cole esse prompt numa sessão do Claude com acesso ao browser:

---

Preciso que você acesse o Firebase Console e altere a Action URL do projeto CitraDesk.

**Credenciais:** usa a conta Google associada ao projeto Firebase `gen-lang-client-0548502624` (projeto "CitraDesk" da MakeLemonAd).

**O que fazer:**

1. Acessa https://console.firebase.google.com/
2. Abre o projeto com ID `gen-lang-client-0548502624` (nome: CitraDesk)
3. No menu lateral, vai em **Build → Authentication**
4. Clica na aba **Templates**
5. Localiza o campo **"Action URL"** no topo da página (deve mostrar algo como `https://gen-lang-client-0548502624.firebaseapp.com/__/auth/action`)
6. Clica no botão de edição ao lado
7. Substitui o valor atual por: `https://makelemonad-citradesk.pages.dev`
8. Salva

**Objetivo:** fazer com que os links de redefinição de senha e verificação de e-mail enviados pelo sistema abram a página personalizada do CitraDesk em vez da página padrão do Firebase.

Confirma quando estiver feito e me mostra um print do campo após salvar.
