# CitraChat — Setup de Tracking
**Documento vivo. Atualizar sempre que novos eventos forem adicionados ao CitraChat.**
Última atualização: 2026-08-27

---

## Como funciona o tracking do CitraChat

O CitraChat dispara eventos via `window.dataLayer` (padrão GTM). Existem dois modos de integração:

**Modo A — GTM (recomendado):** Informa o GTM Container ID na aba Integrações do agente. O CitraChat injeta o container automaticamente e todos os eventos chegam ao GTM. O GTM distribui para GA4, Google Ads e demais ferramentas.

**Modo B — Direto:** Preenche GA4 Measurement ID e/ou Google Ads Conversion ID diretamente na aba Integrações. O CitraChat dispara os eventos sem GTM. Mais simples, mas menos flexível.

**Widget (iframe embed):** Quando o chat está embebido via widget em um site externo, os eventos são enviados por `postMessage` para a página hospedeira. A página precisa ter o GTM do cliente instalado — o CitraChat se comunica com ele automaticamente.

---

## Referência de eventos

Todos os eventos seguem o padrão: `citrachat_{evento}` — ou `citrachat_{tag}_{evento}` quando o campo **Tag de evento** está preenchido na aba Integrações (ex: tag `sac` → `citrachat_sac_chat_opened`).

| Evento | Nome no dataLayer | Quando dispara | Recomendação |
|--------|-------------------|----------------|--------------|
| Chat aberto | `citrachat_chat_opened` | Página/widget carregado | GA4 — métrica de alcance |
| Chat iniciado | `citrachat_chat_started` | Usuário envia a 1ª mensagem | GA4 — métrica de engajamento |
| Chat engajado | `citrachat_chat_engaged` | Usuário envia a 3ª mensagem | GA4 — métrica de qualidade |
| Lead capturado | `citrachat_lead_captured` | Email ou telefone detectado na conversa | GA4 + Google Ads (micro-conversão) |
| Lead qualificado | `citrachat_lead_qualified` | Agente de captação/vendas/agendamento encerra o atendimento | GA4 + Google Ads (conversão principal) |
| Engajamento profundo | `citrachat_chat_deep_engaged` | Usuário envia a 10ª mensagem | GA4 — métrica de intenção alta |
| Humano solicitado | `citrachat_human_requested` | Usuário pede atendimento humano | GA4 — métrica operacional |
| Caso resolvido | `citrachat_issue_resolved` | Agente SAC/FAQ registra resolução confirmada | GA4 + Google Ads (conversão SAC) |

> **Nota:** `citrachat_issue_resolved` dispara em dois momentos distintos:
> - Quando o agente SAC chama `registrar_resolucao` (cliente confirma Sim na pergunta de satisfação)
> - Quando um agente FAQ encerra e o usuário confirma resolução espontânea

---

## Parte 1 — Google Tag Manager (GTM)

### 1.1 — Criar conta e container (se ainda não existir)

1. Acessar [tagmanager.google.com](https://tagmanager.google.com)
2. Clicar em **Criar conta**
3. Preencher:
   - **Nome da conta:** nome do cliente (ex: Diretto)
   - **País:** Brasil
   - **Nome do container:** nome do domínio (ex: diretto.com.vc)
   - **Plataforma do destino:** Web
4. Aceitar os termos
5. Copiar o **GTM Container ID** (formato: `GTM-XXXXXXX`)

### 1.2 — Inserir o Container ID no CitraChat

1. No painel CitraChat, acessar o agente → aba **Integrações**
2. No campo **Google Tag Manager**, colar o Container ID (`GTM-XXXXXXX`)
3. (Opcional) Preencher o campo **Tag de evento** com um identificador do agente (ex: `sac`, `vendas`, `recepcao`) — os eventos ficarão como `citrachat_sac_chat_opened`, etc. Útil quando há múltiplos agentes no mesmo GTM.
4. Clicar em **Salvar**

> O CitraChat injeta o container automaticamente — não é necessário adicionar o código do GTM no site para os chats standalone. Para widget (iframe), o container do cliente já precisa estar no site hospedeiro.

### 1.3 — Criar as variáveis de dataLayer

No GTM, ir em **Variáveis → Nova → Variável de camada de dados**:

Não é necessário criar variáveis separadas — o nome do evento já vem diretamente no campo `event` do dataLayer. O GTM captura isso automaticamente com a variável nativa **{{Event}}**.

### 1.4 — Criar os triggers (um por evento)

No GTM, ir em **Acionadores → Novo**:

Para cada evento da tabela abaixo, criar um acionador do tipo **Evento personalizado**:

| Nome do acionador | Tipo | Nome do evento (campo "Nome do evento") |
|-------------------|------|------------------------------------------|
| CitraChat — Chat aberto | Evento personalizado | `citrachat_chat_opened` |
| CitraChat — Chat iniciado | Evento personalizado | `citrachat_chat_started` |
| CitraChat — Chat engajado | Evento personalizado | `citrachat_chat_engaged` |
| CitraChat — Lead capturado | Evento personalizado | `citrachat_lead_captured` |
| CitraChat — Lead qualificado | Evento personalizado | `citrachat_lead_qualified` |
| CitraChat — Engajamento profundo | Evento personalizado | `citrachat_chat_deep_engaged` |
| CitraChat — Humano solicitado | Evento personalizado | `citrachat_human_requested` |
| CitraChat — Caso resolvido | Evento personalizado | `citrachat_issue_resolved` |

> Se estiver usando tag de evento, substituir o nome por `citrachat_sac_chat_opened`, etc. conforme a tag configurada.

Configuração de cada acionador:
- **Este acionador é ativado em:** Todos os eventos personalizados
- **Nome do evento:** [conforme tabela acima] — usar **correspondência de expressão regular** se quiser capturar com e sem tag: `citrachat_(sac_)?chat_opened`

---

## Parte 2 — Google Analytics 4

### 2.1 — Criar propriedade GA4 (se ainda não existir)

1. Acessar [analytics.google.com](https://analytics.google.com)
2. Clicar em **Admin → Criar propriedade**
3. Preencher nome, fuso horário (Brasília) e moeda (BRL ou EUR conforme o cliente)
4. Selecionar tipo de negócio e objetivos
5. Criar **Fluxo de dados Web** com a URL do site do cliente
6. Copiar o **Measurement ID** (formato: `G-XXXXXXXXXX`)

### 2.2 — Configurar GA4 via GTM

No GTM, criar uma tag de configuração:

1. Ir em **Tags → Nova**
2. **Tipo de tag:** Google Analytics: configuração do GA4
3. **ID de medição:** colar o `G-XXXXXXXXXX`
4. **Acionador:** All Pages (Todas as páginas)
5. Nomear: `GA4 — Configuração`
6. Salvar

### 2.3 — Criar tags de evento GA4 para cada evento CitraChat

Para cada evento, criar uma tag:

1. **Tags → Nova**
2. **Tipo de tag:** Google Analytics: evento do GA4
3. **Tag de configuração:** selecionar a tag de configuração criada acima
4. **Nome do evento:** usar o mesmo nome do acionador (ex: `citrachat_chat_opened`)
5. **Acionador:** selecionar o acionador correspondente criado na Parte 1
6. Salvar

Repetir para todos os 8 eventos.

### 2.4 — Marcar eventos como conversão no GA4

No GA4, ir em **Admin → Eventos → Marcar como conversão**:

| Evento | Marcar como conversão? | Motivo |
|--------|------------------------|--------|
| `citrachat_chat_opened` | Não | Métrica de alcance |
| `citrachat_chat_started` | Não | Métrica de engajamento |
| `citrachat_chat_engaged` | Não | Métrica de qualidade |
| `citrachat_lead_captured` | Sim (opcional) | Micro-conversão: dado de contato detectado |
| `citrachat_lead_qualified` | **Sim** | Conversão principal de captação |
| `citrachat_chat_deep_engaged` | Não | Métrica de intenção |
| `citrachat_human_requested` | Não | Métrica operacional |
| `citrachat_issue_resolved` | **Sim** | Conversão de SAC: caso resolvido |

> Para marcar: no GA4, ir em **Admin → Eventos**, localizar o evento e ativar o toggle "Marcar como conversão". Os eventos só aparecem na lista após serem disparados pelo menos uma vez.

### 2.5 — Publicar o container GTM

Após criar todas as tags e acionadores:

1. No GTM, clicar em **Enviar**
2. Adicionar um nome de versão (ex: "CitraChat — setup inicial")
3. Clicar em **Publicar**

---

## Parte 3 — Google Ads

### Opção A — Importar conversões do GA4 (recomendado)

Vincula Google Ads ao GA4 e importa as conversões já configuradas. Não exige configuração extra no CitraChat.

1. No Google Ads, ir em **Ferramentas e configurações → Conversões**
2. Clicar em **+ Nova ação de conversão**
3. Selecionar **Importar → Google Analytics 4 → Continuar**
4. Selecionar a propriedade GA4 do cliente
5. Selecionar os eventos marcados como conversão:
   - `citrachat_lead_qualified`
   - `citrachat_issue_resolved`
6. Clicar em **Importar e continuar**
7. Definir:
   - **Categoria:** Lead
   - **Valor:** usar valor fixo ou deixar sem valor
   - **Janela de conversão:** 30 dias (padrão)
   - **Modelo de atribuição:** baseado em dados (recomendado) ou último clique

### Opção B — Conversão direta no CitraChat (sem GTM)

Apenas quando o cliente não usa GTM e a configuração é direta.

1. No Google Ads, ir em **Ferramentas → Conversões → + Nova ação de conversão**
2. Selecionar **Website**
3. Configurar o objetivo e clicar em **Criar e continuar**
4. Selecionar **Usar o Google Tag Manager**
5. Copiar:
   - **ID de conversão** (formato: `AW-XXXXXXXXX`)
   - **Rótulo de conversão** (string alfanumérica)
6. No CitraChat, aba **Integrações**:
   - **Google Ads — ID de conversão:** colar o `AW-XXXXXXXXX`
   - **Google Ads — Rótulo:** colar o rótulo
7. Salvar

> No modo direto, o CitraChat dispara a conversão do Ads nos eventos `citrachat_lead_captured` e `citrachat_lead_qualified`.

---

## Parte 4 — Widget (chat embebido em site externo)

Quando o CitraChat é usado como widget (script embed no site do cliente):

1. O GTM do cliente **já deve estar instalado** no site hospedeiro
2. O CitraChat envia os eventos via `postMessage` para a janela pai
3. O script `widget.js` do CitraChat faz a ponte — recebe o `postMessage` e empurra para o `dataLayer` da página hospedeira
4. Os acionadores do GTM capturam normalmente os eventos `citrachat_*`

**Não é necessário** inserir um segundo GTM para o widget — apenas garantir que o GTM do cliente já esteja no site e que o widget.js esteja carregado.

---

## Checklist de configuração por cliente

- [ ] GTM Container ID inserido na aba Integrações do(s) agente(s)
- [ ] Tag de evento preenchida (quando há múltiplos agentes no mesmo GTM)
- [ ] Propriedade GA4 criada e Measurement ID vinculado via GTM
- [ ] Tags GTM criadas para todos os 8 eventos CitraChat
- [ ] Acionadores GTM criados e vinculados às tags
- [ ] Container GTM publicado
- [ ] Eventos `citrachat_lead_qualified` e `citrachat_issue_resolved` marcados como conversão no GA4
- [ ] Conversões importadas no Google Ads (ou configuradas direto)
- [ ] Teste: abrir o chat, trocar mensagens e verificar eventos no GTM Preview + DebugView do GA4

---

## Histórico de atualizações

| Data | Mudança |
|------|---------|
| 2026-08-27 | Documento criado. 8 eventos mapeados. Fluxo GTM + GA4 + Ads documentado. |
