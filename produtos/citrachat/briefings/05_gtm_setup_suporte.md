# Guia de Suporte: Integração com Google Tag Manager

**Para quem é isso:** clientes que já têm GTM instalado no site e querem que os eventos do CitraChat alimentem seus pixels (Meta Ads, Google Ads, GA4, TikTok Ads) — inclusive quando o chat é acessado via link público.

---

## Por que usar GTM em vez de configurar cada pixel separado?

Com GTM, você configura uma vez e todos os pixels que já estão no seu container disparam automaticamente. Funciona em qualquer cenário:

- Chat incorporado no seu site (widget)
- Link público compartilhado no WhatsApp ou num botão
- QR code, stories, anúncios — qualquer origem

---

## O que o CitraChat envia pro GTM

Quando o usuário interage com o chat, o CitraChat empurra esses eventos pro `dataLayer` do GTM:

| Nome do evento no GTM | Quando dispara |
|---|---|
| `citrachat_chat_opened` | Página do chat carregada |
| `citrachat_chat_started` | Usuário envia a 1ª mensagem |
| `citrachat_chat_engaged` | Usuário envia a 3ª mensagem |
| `citrachat_lead_captured` | Email ou telefone detectado na conversa |
| `citrachat_lead_qualified` | Após lead capturado |
| `citrachat_chat_deep_engaged` | Usuário envia a 10ª mensagem |
| `citrachat_human_requested` | Usuário pede atendimento humano |

---

## Passo 1 — Colocar o Container ID no CitraChat

No painel do CitraChat:
1. Acesse o agente → aba **Integrações**
2. Campo **Google Tag Manager → Container ID**
3. Formato: `GTM-XXXXXXX`
4. Clicar em **Salvar**

---

## Passo 2 — Criar os Acionadores no GTM

Um acionador por evento que você quer rastrear. Para cada um:

1. No GTM, menu lateral → **Acionadores** → botão **Novo**
2. Clique na área cinza de configuração (onde diz "Escolher um tipo de acionador")
3. Selecione **Evento personalizado**
4. No campo **Nome do evento**, cole o nome exato do evento (ex: `citrachat_lead_captured`)
5. Em **Este acionador é ativado em**: deixe em **Todos os eventos personalizados**
6. No campo de nome (canto superior esquerdo), dê um nome claro: ex: `CitraChat - Lead Capturado`
7. Clique em **Salvar**

Repita para cada evento que importa pro seu negócio. Os mais relevantes para campanhas:
- `citrachat_chat_started` → início de conversa
- `citrachat_lead_captured` → conversão principal

---

## Passo 3 — Criar as Tags

### GA4 — Registrar eventos no Analytics

1. Menu lateral → **Tags** → **Novo**
2. Clique na área de configuração da tag
3. Tipo de tag: **Google Analytics: Evento do GA4**
4. **ID de medição**: cole seu ID do GA4 (formato `G-XXXXXXXXXX`)
5. **Nome do evento**: escolha um nome descritivo — ex: `generate_lead` para lead capturado, ou use o mesmo nome do evento CitraChat
6. (Opcional) Em **Parâmetros do evento**, adicione `source` = `citrachat` para filtrar depois no GA4
7. Em **Acionamento**, selecione o acionador criado no Passo 2
8. Nomeie a tag: ex: `GA4 - CitraChat Lead Capturado`
9. **Salvar**

> Para marcar como conversão: depois de publicar e do evento aparecer no GA4, acesse **Admin → Eventos** e ative o toggle "Marcar como conversão" ao lado do evento.

### Meta Pixel — Disparar evento Lead

1. **Tags** → **Novo**
2. Tipo de tag: **HTML personalizado**
3. No campo HTML, cole:
```html
<script>
  fbq('track', 'Lead');
</script>
```
4. Acionamento: acionador do `citrachat_lead_captured`
5. Nome: `Meta Pixel - CitraChat Lead`
6. **Salvar**

### Google Ads — Registrar conversão

1. **Tags** → **Novo**
2. Tipo de tag: **Conversão do Google Ads**
3. **ID de conversão**: cole o ID da sua conta Google Ads (formato `AW-XXXXXXXXX`)
4. **Rótulo de conversão**: cole o rótulo da conversão configurada no Google Ads
5. Acionamento: acionador do `citrachat_lead_captured`
6. Nome: `Google Ads - CitraChat Conversão`
7. **Salvar**

---

## Passo 4 — Verificar com o Preview Mode

Antes de publicar, confirme que tudo está funcionando:

1. No GTM, clique em **Visualizar** (Preview) no canto superior direito
2. No campo de URL, cole o link público do agente (ex: `https://citra.chat/atendimento-make`)
3. Clique em **Conectar** — uma nova aba abre com o chat
4. Interaja: abra a conversa, envie uma mensagem, depois envie um email
5. Volte para a aba do Preview Mode
6. No painel da esquerda, você verá os eventos disparados (ex: `citrachat_chat_started`)
7. Clique em cada evento e confirme que as tags correspondentes aparecem em **Tags Fired**
8. Feche o Preview quando confirmar tudo ✓

---

## Passo 5 — Publicar

1. Clique em **Enviar** no canto superior direito do GTM
2. Dê um nome para a versão: ex: `v2 - Eventos CitraChat`
3. Clique em **Publicar**

A partir daí, todos os eventos do CitraChat disparam automaticamente os pixels do seu container.

---

## Perguntas frequentes

**O GTM do meu site vai funcionar na página do CitraChat?**
Sim. O CitraChat carrega o seu container GTM na página do chat (incluindo link público). O GTM não é restrito ao domínio do seu site — ele carrega em qualquer página onde o snippet estiver.

**Preciso configurar os pixels individualmente também?**
Não. Se o GTM estiver configurado, o CitraChat carrega só o GTM e para por aí. O GTM distribui pra todos os pixels do seu container.

**E se eu não tiver GTM?**
Você pode configurar cada pixel individualmente na aba Integrações (Meta Pixel ID, Google Ads Conversion ID, etc.). Mas GTM é o caminho recomendado.

**Quanto tempo leva para os eventos aparecerem no GA4?**
Os eventos aparecem em tempo real no GA4 (aba **Tempo real**). Na lista de Eventos do painel Admin pode levar até 24h para aparecer pela primeira vez.

**Posso usar o mesmo acionador em várias tags?**
Sim. Um acionador pode disparar quantas tags precisar. Um `citrachat_lead_captured` pode disparar GA4, Meta Pixel e Google Ads ao mesmo tempo.

---

## Suporte

Dúvidas? Fale com a equipe pelo chat de suporte ou em [suporte@citrachat.com].
