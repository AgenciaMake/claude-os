# Prompt para Claude Cowork — deploy do CitraForm no Vercel

Copie o texto abaixo e cole no Cowork com o navegador logado na sua conta Vercel (a mesma usada pro CitraChat).

---

Você vai configurar o deploy de um novo projeto no Vercel. O código já está no GitHub, em `https://github.com/AgenciaMake/citraform` (repositório privado, branch `main`, raiz do repo já é a raiz do projeto Next.js — não tem subpasta).

## Passo 1 — Criar o projeto

1. No dashboard do Vercel, clique em "Add New" → "Project".
2. Se o repositório `AgenciaMake/citraform` não aparecer na lista, provavelmente precisa autorizar o GitHub App do Vercel a acessar esse repo específico na organização `AgenciaMake` (clique em "Adjust GitHub App Permissions" ou similar e adicione o repo `citraform`).
3. Selecione `AgenciaMake/citraform` e importe.
4. Framework preset: deve detectar "Next.js" automaticamente. Root Directory: deixe como `./` (raiz).
5. Nome do projeto: `citraform`.

## Passo 2 — Integrações Supabase e Resend via Vercel Marketplace

O Vercel tem integrações nativas que provisionam Supabase e Resend direto pela aba "Integrations" (ou "Storage") do projeto, já injetando as variáveis de ambiente automaticamente — sem precisar copiar/colar chave nenhuma.

**Resend**: pode conectar direto, sem restrição — adicione a integração Resend do Marketplace, conecte (ou crie) a conta Resend já usada pelo CitraChat, e adicione `citraform.com` como domínio verificado dentro do Resend (Settings → Domains → Add Domain, vai pedir registros DNS de SPF/DKIM — anote também).

**Supabase — PARE ANTES DE CONFIRMAR**: a integração Supabase do Marketplace vai oferecer criar um projeto novo. **Antes de clicar em "Create" no projeto Supabase, pare e me avise** — criar um projeto novo tem custo mensal recorrente (mesmo dentro da organização Pro que já paga o CitraChat, cada projeto adicional é cobrado à parte) e essa decisão ainda não foi fechada com o Bruno. Chegue até a tela de confirmação, tire nota do que ela mostra (nome sugerido, região, tier de preço oferecido), e reporte antes de prosseguir.

Enquanto isso não é resolvido, adicione estas variáveis de ambiente PLACEHOLDER manualmente (Settings → Environment Variables), pra não travar o deploy:

```
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
SUPER_ADMIN_EMAIL=bruno@makelemonad.com.br
```

Aplique essas variáveis (e a `RESEND_API_KEY` real, se a integração Resend já tiver injetado) para os ambientes Production, Preview e Development.

## Passo 3 — Deploy

Faça o deploy (deve buildar com Next.js sem erro — já testamos localmente e builda limpo). Confirme que a URL temporária do Vercel (tipo `citraform.vercel.app` ou `citraform-xxxx.vercel.app`) carrega a landing page corretamente.

## Passo 4 — Domínios

Em Settings → Domains do projeto:
1. Adicione `citraform.com` como domínio principal.
2. Adicione `citraform.com.br` também, e configure como **redirect** para `citraform.com` (o Vercel tem uma opção de "Redirect to" ao adicionar o segundo domínio — use isso em vez de servir os dois como sites separados).
3. O Vercel vai mostrar os registros DNS necessários (CNAME ou nameservers) para cada domínio. Anote exatamente o que ele pedir para cada um — eu preciso saber pra configurar no registrador onde esses domínios foram comprados.

## Relatório final

Ao terminar, me diga:
- Se a importação do repo funcionou de primeira ou precisou de alguma autorização extra
- A URL temporária do projeto (`.vercel.app`) e se o deploy passou
- Os registros DNS exatos que o Vercel pediu para `citraform.com` e para `citraform.com.br`
- Qualquer erro ou tela inesperada que apareceu
