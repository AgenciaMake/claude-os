# Prompt: Configurar GTM para eventos do CitraChat

**Para usar:** Cole esse prompt num Claude com acesso ao navegador (computer use / browser control).

---

## Contexto

Você vai configurar o Google Tag Manager do CitraChat (container **GTM-KQBZRCHG**) para capturar os eventos que o CitraChat empurra para o dataLayer. O objetivo é rastrear as conversões do agente de suporte da própria plataforma (Limonete / Alex).

Acesse: https://tagmanager.google.com e entre na conta do CitraChat. Selecione o container **GTM-KQBZRCHG**.

---

## Parte 1 — Criar os Acionadores (Triggers)

Para cada evento abaixo, crie um acionador do tipo **Evento personalizado (Custom Event)**:

| Nome do acionador | Nome do evento (exato) |
|---|---|
| CitraChat - Chat Aberto | `citrachat_chat_opened` |
| CitraChat - Conversa Iniciada | `citrachat_chat_started` |
| CitraChat - Lead Capturado | `citrachat_lead_captured` |
| CitraChat - Lead Qualificado | `citrachat_lead_qualified` |
| CitraChat - Engajamento Profundo | `citrachat_chat_deep_engaged` |
| CitraChat - Humano Solicitado | `citrachat_human_requested` |

**Passos para cada acionador:**
1. Menu lateral → **Acionadores** → botão **Novo**
2. Clique na área de configuração do acionador
3. Tipo: **Evento personalizado**
4. Nome do evento: cole o valor exato da tabela acima (ex: `citrachat_chat_started`)
5. Fires on: **Todos os eventos personalizados**
6. Nomeie o acionador conforme a coluna "Nome do acionador"
7. **Salvar**

Repita para todos os 6 eventos.

---

## Parte 2 — Criar as Tags do GA4

O GA4 do CitraChat é: **G-8PCHNQ40G4**

### Tag 1: GA4 — Chat Iniciado

1. Menu lateral → **Tags** → **Novo**
2. Nome: `GA4 - CitraChat Chat Iniciado`
3. Tipo de tag: **Google Analytics: Evento do GA4**
4. ID de medição: `G-8PCHNQ40G4`
5. Nome do evento: `citrachat_chat_started`
6. Acionador: selecionar **CitraChat - Conversa Iniciada**
7. Salvar

### Tag 2: GA4 — Lead Capturado (Conversão Principal)

1. **Tags** → **Novo**
2. Nome: `GA4 - CitraChat Lead Capturado`
3. Tipo: **Google Analytics: Evento do GA4**
4. ID de medição: `G-8PCHNQ40G4`
5. Nome do evento: `generate_lead`
6. Parâmetros do evento → adicionar linha:
   - Nome: `source` | Valor: `citrachat`
7. Acionador: **CitraChat - Lead Capturado**
8. Salvar

> Depois de publicar, marcar esse evento como **Conversão** dentro do GA4 (Admin → Eventos → citrachat → marcar como conversão).

### Tag 3: GA4 — Chat Aberto (Visualização)

1. **Tags** → **Novo**
2. Nome: `GA4 - CitraChat Chat Aberto`
3. Tipo: **Google Analytics: Evento do GA4**
4. ID de medição: `G-8PCHNQ40G4`
5. Nome do evento: `citrachat_chat_view`
6. Acionador: **CitraChat - Chat Aberto**
7. Salvar

### Tag 4: GA4 — Humano Solicitado

1. **Tags** → **Novo**
2. Nome: `GA4 - CitraChat Humano Solicitado`
3. Tipo: **Google Analytics: Evento do GA4**
4. ID de medição: `G-8PCHNQ40G4`
5. Nome do evento: `citrachat_human_requested`
6. Acionador: **CitraChat - Humano Solicitado**
7. Salvar

---

## Parte 3 — Verificar no GTM Preview Mode

1. Botão **Visualizar** (Preview) no canto superior direito do GTM
2. No campo URL, cole: `https://citra.chat/atendimento-make`
3. Clique em **Conectar**
4. Na página do chat, interaja: abra, envie uma mensagem, envie um email
5. Volte ao painel de preview e confirme:
   - `citrachat_chat_opened` aparece → Tag GA4 Chat Aberto disparou ✓
   - `citrachat_chat_started` aparece → Tag GA4 Chat Iniciado disparou ✓
   - `citrachat_lead_captured` aparece → Tag GA4 Lead Capturado disparou ✓
6. Feche o preview

---

## Parte 4 — Publicar

1. Botão **Enviar** no canto superior direito
2. Versão: `v2 - Eventos CitraChat configurados`
3. Descrição: `Acionadores e tags GA4 para os 6 eventos do CitraChat`
4. **Publicar**

---

## Após publicar: Marcar conversão no GA4

1. Acesse: https://analytics.google.com → propriedade G-8PCHNQ40G4
2. Menu Admin (engrenagem) → **Eventos**
3. Encontre `generate_lead` (pode levar até 24h para aparecer após o primeiro disparo)
4. Toggle "Marcar como conversão" → ativar

---

## Resultado esperado

Após a configuração, o painel de desempenho do CitraChat vai mostrar quantos visitantes do site:
- Abriram o chat
- Iniciaram conversa
- Deixaram contato (conversão)
- Pediram atendimento humano

Esses dados ficam visíveis em GA4 → Relatórios → Engajamento → Eventos.
