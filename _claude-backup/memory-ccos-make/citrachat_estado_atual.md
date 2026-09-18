---
name: citrachat-estado-atual-e-pr-ximos-passos
description: "Snapshot vivo do CitraChat (atualizar a cada trabalho relevante, nunca deixar ficar velho). Onde paramos, o que tá no ar, o que vem a seguir. Ler no início de qualquer sessão sobre CitraChat."
metadata:
  node_type: memory
  type: project
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-18T10:54:06.947Z
---

**Última atualização: 2026-09-18**

> Regra permanente sobre este arquivo: ver [[feedback_citrachat_memoria_continua]].
> Ficou 2 meses sem atualizar (13/07 → 18/09) enquanto sessões inteiras de trabalho
> aconteciam — é exatamente o problema que essa regra existe para evitar.

## O que está no ar (produção)

**Branch `plataforma` → citra.chat** — branch de produção. Todo push vai direto ao Vercel sem promote manual.

Stack: Next.js (App Router) + Anthropic SDK + Supabase + Tailwind. Repo: `AgenciaMake/citrachat`.

**Infraestrutura (region, 2026-09-17):** Supabase em `sa-east-1` (São Paulo, ref
`lkcwykalylphhngjivva`). Funções Vercel fixadas em **gru1 (São Paulo)** via
`vercel.json` (`regions: ["gru1"]`) — antes rodavam em `iad1` (Washington), cada
consulta ao banco atravessava o Atlântico. Detalhe completo e como verificar a
região em produção: [[citrachat_infra]].

**Modelo de IA (fixos, não atualizar sem aprovação — [[feedback_citrachat_modelos_fixos]]):**
- Chat público: Claude Haiku 4.5
- Treino/análise/resumo de lead: Claude Sonnet 4.6
- Tool use (browse_url): Haiku 4.5 com loop até 2 rounds
- Opus é proibido em qualquer chamada ([[feedback_citrachat_no_opus]])

## Funcionalidades no ar

### Chat público
- Balões estilo WhatsApp, status de mensagem, typing dots, anexos (imagem/PDF até 5MB)
- Upload de arquivo por visitante (sem login) funciona via `agentId` publicado, não sessão
- Agente ativo (pós-transferência) persiste em localStorage por sessão — refresh não reseta pra recepção
- Transferência entre agentes preserva contexto: `knownVisitorData()` injeta no prompt o que a
  recepção já coletou, pra especialista não perguntar de novo
- Agente sem destino de transferência avisa isso ao visitante em vez de prometer transferir e não fazer
- **Formatação proibida por código, não só por prompt:** `stripEmDash()` em `chat/route.ts` remove
  qualquer travessão da resposta antes de enviar — o prompt já proibia, mas o modelo (Haiku) quebrava a
  regra em produção mesmo assim. Termos em inglês seguem só por regra de prompt (Bruno vai reforçar no
  treinamento, decisão de 2026-09-16, sem camada de código).
- Extração de dados coletados (nome, telefone, email) é feita pela IA e **verificada pelo servidor**
  contra as mensagens reais do visitante (`verifiedCollected` em `closure-fields.ts`) — o agente não
  pode inventar que coletou algo que o visitante não escreveu.

### Agente / multi-agente
- URL pública: `citra.chat/{company_slug}/{agent_slug}`. Limite por plano: Starter=1, Pro=3, Business=10
- Bases de dados consultáveis (planilha .xlsx/.csv): upload processa linha a linha, mas **não guarda o
  arquivo original** — só existe botão de **download** desde 2026-09-16 (reconstrói o .xlsx a partir das
  linhas salvas). Cuidado ao adicionar: nome de arquivo acentuado quebra `Content-Disposition` com 500 se
  não sanitizar pra ASCII (bug real, já corrigido nesse endpoint).

### Protocolos (SAC)
- Painel de Protocolos tem paridade com o de Conversas: parseContent (imagens), nome do cliente, cadeia
  de agentes com divisor visual de transferência, hover verde (#d9fdd3), resend-email, export-PDF,
  "Carregar mais" (paginação além do corte de 100), badge de número de conversa.
- **Protocolo e conversa agora têm exclusão em cascata nos dois sentidos** (2026-09-17): deletar uma
  conversa com protocolo apaga o protocolo (antes ficava órfão pra sempre — não existe FK entre as duas
  tabelas, só `session_id` sem cascade); deletar um protocolo apaga a conversa vinculada. Diálogo de
  confirmação mostra o status do protocolo antes de confirmar.
- `gerar_protocolo` é **idempotente por sessão** (2026-09-15): antes, um retry de rede ou o modelo
  chamando a ferramenta duas vezes gerava dois protocolos pra mesma conversa. Agora devolve o já existente.
- Protocolo tem `resolved_at` (migration 054, 2026-09-17) — data em que foi de fato resolvido, separada de
  `created_at` (quando foi aberto). Sem isso, "resolvidos no período" filtrava pela data de abertura e
  escondia trabalho recente feito em casos antigos (bug real, validado: 11 resolvidos reais apareciam
  como 4). Grava só na primeira vez que o status fecha; reabrir limpa a data.

### Painel de Métricas — reescrito e corrigido em profundidade (2026-09-17/18)
Depois de uma bateria de bugs reais encontrados e corrigidos nesta janela (todos confirmados contra o
banco de produção, não só teoria):
- Blocos por tipo de agente (Recepção/Leads/SAC/Agendamento), cada um só aparece se a conta tem esse
  tipo de agente.
- "Precisa de ação" saiu do topo do painel (poluía a leitura) e foi para dentro da seção SAC, que é o
  contexto real dessas pendências. Conta sem agente de SAC ainda vê o bloco, em seção própria.
- Funil do visitante ganhou 2ª linha de cards: leads capturados, problemas resolvidos, casos fechados,
  taxa de resolução — calculados independente de quais grupos de agente a conta tem.
- **`resolved_at`** separou duas perguntas que usavam a mesma data por engano: "abertos no período"
  (por `created_at`) vs. "resolvidos no período" (por `resolved_at`). Autonomia por agente tinha um bug
  de 275% (dividia dois conjuntos diferentes — resolvidos-no-período por abertos-no-período, quando
  deveria ser dentro do MESMO conjunto de abertos); corrigido.
- **`human_requested` era descartado.** O chat disparava o evento corretamente (regex `HUMAN_RE` em
  `ChatInterface.tsx` funcionava), mas `ChatPage.tsx` só encaminhava 2 tipos de evento ao banco
  (`chat_started`→`conversation_started`, `lead_qualified`→`conversion`) — todo o resto, incluindo
  `human_requested`, morria ali. Corrigido; card "Pediram humano" começa do zero a partir de agora, sem
  histórico pra recuperar. `HUMAN_RE` também foi ampliada (deixava passar "me passa pra um humano", "tem
  alguém de verdade aí?").
- **Migration `021_human_takeover.sql` nunca tinha rodado em produção**, apesar de existir no repo desde
  muito antes. Sem as colunas `human_takeover`/`takeover_at`, o SELECT da página de métricas por agente
  falhava inteiro (erro 400) e zerava em silêncio qualificados, motivos de contato e mais. Aplicada em
  2026-09-18.
- Qualificação de lead (`lead_qualified`, `contact_reason`) e resumo (`lead_summary`) já são gerados
  ricos pela IA no fechamento (`send-lead-notification.ts`) — o prompt também gera `qualificationReason`
  (por que foi/não foi qualificado) e `nextStep` (ação concreta pro time), mas **esses dois campos são
  descartados hoje**, só vão pro corpo do e-mail. Se for enriquecer o painel de novo, é natural persistir
  esses dois também.
- **Pendente, adiado por decisão do próprio Bruno:** "tempo até resolver" mostra ~29 dias porque vários
  protocolos de teste antigos foram fechados manualmente numa limpeza em 2026-09-17 — a data ficou
  tecnicamente correta (foi isso que aconteceu), só que distorce a média de atendimento real. Bruno vai
  apagar os protocolos de teste manualmente, um por um, pelo botão de deletar do painel. Não fazer isso
  por código (não dá pra distinguir teste de caso real automaticamente).
- **Pendente, não feito ainda:** mais gráficos por agente (pedido explícito do Bruno, deixado pra próxima
  rodada depois dele validar que os números atuais fazem sentido).

### Performance do painel admin (2026-09-17, resolvido — Bruno confirmou "mudou super bem")
Causa da demora de 2-3s trocando entre Agentes/Métricas/Conversas/Protocolos:
1. Funções em Washington, banco em São Paulo (ver Infraestrutura acima) — maior parte do ganho.
2. `auth.getUser()` chamado 2x por navegação (layout + página) — cada chamada é ida e volta real ao
   servidor de Auth do Supabase. Corrigido com `getAuthedUser()` em `lib/supabase/get-user.ts`, com
   `cache()` do React deduplicando por request.
3. Mesma duplicação na tabela `profiles` (layout lia a linha, página lia de novo só pro fuso horário).
   Corrigido com `getCurrentProfile()` / `getTimezoneForCurrentUser()` em `lib/supabase/get-profile.ts`.
4. `loading.tsx` adicionado em Conversas/Protocolos/Métricas/Agentes — sem isso o clique não dava
   nenhuma resposta visual até o servidor terminar, e ficava parecendo que não tinha registrado o clique.

### Notificações — WhatsApp (ao vivo) e SMS/RCS (pendente)
- WhatsApp: implementado via Meta Graph API como add-on pago. `lib/whatsapp.ts` + webhook route +
  ContaForm + conta/actions. Detalhe: [[citrachat_whatsapp_integracao]].
- **RCS/SMS (Solvefy) — decidido mas não implementado.** Modelo: opt-in (não vem ativado em nenhum
  plano), checkbox + aceite de termos no painel, cota incluída por plano (Pro 50/mês, Business 150/mês em
  RCS), excedente cobrado automaticamente via Stripe a R$0,15/mensagem. Canal escolhido: **RCS**, não SMS
  (RCS funciona em iPhone com iOS 18+, mas ainda precisa de fallback pra SMS pra quem não tem — esse
  fallback NÃO é automático na API da Solvefy, é opt-in por mensagem via campo `fallback` no payload).
  **Bloqueios antes de codar:** (a) preço negociado (R$0,07 SMS / R$0,10 RCS) não bate com o self-service
  da conta Solvefy (lá aparece R$0,078 SMS e RCS em 3 categorias, R$0,0865 a R$0,2730) — Bruno vai
  confirmar com o comercial qual categoria corresponde ao preço negociado; (b) cadastro do Agente RCS
  exige CNPJ real e trava sem ele, e não se sabe ainda o prazo/quem aprova; (c) transição do modelo
  pré-pago pro pós-pago não está documentada. Detalhe completo, preços e achados técnicos:
  `produtos/citrachat/briefings/06_precificacao_e_custos.md` (v5).
- Twilio (SMS) foi descartado como provedor principal por custo (R$0,35/SMS vs Solvefy R$0,07-0,10);
  conta e crédito de US$20 ficam parados, sem uso previsto.

### Segurança e legal
- Checkbox de aceite de termos obrigatório no cadastro (migration 052, `TERMS_VERSION`).
- Rascunho de blindagem jurídica (indenização por dano causado por agente de cliente) existe em
  `produtos/citrachat/briefings/11_blindagem_juridica_responsabilidade.md`, **não publicado**, aguardando
  revisão de advogado — Bruno decidiu construir junto antes de envolver jurídico, não é esquecimento.
- Snapshot de segurança (auth, RLS, APIs, secrets): [[citrachat_seguranca]] (2026-09-04, 3 gaps críticos
  na época: WhatsApp sem HMAC, rate limit in-memory, RLS de conversations/protocols não confirmada — 
  conferir se ainda procede antes de assumir).

## Feature roadmap — documentada, não implementada

**Multiusuário/papéis** (convite de equipe, 3 papéis: Admin/Treinamento/Atendimento, restrito a planos
Pro/Business): [[citrachat_roadmap_multiusuario]]. Decisão explícita do Bruno foi só documentar por
enquanto, sem escrever código.

## Clientes ativos

- **AbyaraGraf** (`company_slug: abyaragraf`) — agentes Joana (SAC) e Tiago (vendas).
- **Diretto** (`company_slug: diretto`) — agentes Lara (recepção), Eduardo (SAC/suporte), João (vendas/
  captação). Cliente mais ativo — a maior parte dos bugs reais encontrados nesta janela veio de
  conversas reais dessa conta (protocolo duplicado, travessão, atribuição de métricas, migration
  faltante). Base de dados "Revendedores x Marcas" (4.977 linhas) treinada no Eduardo.

## Como retomar uma sessão

1. Ler essa memória inteira primeiro.
2. Conferir `_memoria_pendente/` na raiz do workspace — aplicar e apagar se houver snapshot novo.
3. `cd produtos/citrachat/codigo && git log --oneline -10` — branch ativa é `plataforma`.
4. Se o trabalho envolver preço/custo, ler também `produtos/citrachat/briefings/06_precificacao_e_custos.md`.
5. **Ao terminar qualquer trabalho relevante nesta sessão, atualizar este arquivo antes de encerrar** —
   ver [[feedback_citrachat_memoria_continua]].
