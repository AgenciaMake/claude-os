# CitraChat — Estado Atual

> Snapshot vivo do produto: onde paramos, o que está no ar, o que vem a seguir.
> **Ler antes de qualquer trabalho novo no CitraChat.** Atualizar a cada trabalho relevante —
> bug corrigido, feature nova, decisão de produto, migration aplicada, investigação que mudou o
> entendimento de como algo funciona. Não deixar ficar velho: este arquivo ficou 2 meses parado
> (13/07 → 18/09/2026) enquanto sessões inteiras de trabalho aconteciam sem ser registradas — é
> exatamente o problema que ele existe para evitar.

**Última atualização: 2026-09-18**

---

## O que está no ar (produção)

**Branch `plataforma` → citra.chat** — branch de produção. Todo push vai direto ao Vercel sem promote manual.

Stack: Next.js (App Router) + Anthropic SDK + Supabase + Tailwind. Repo: `AgenciaMake/citrachat`.

**Infraestrutura (região, 2026-09-17):** Supabase em `sa-east-1` (São Paulo, ref
`lkcwykalylphhngjivva`). Funções Vercel fixadas em **gru1 (São Paulo)** via `vercel.json`
(`regions: ["gru1"]`) — antes rodavam em `iad1` (Washington), e cada consulta ao banco
atravessava o Atlântico. Para verificar em produção em que região uma função está rodando:
olhar o header `x-vercel-id` de uma rota dinâmica — formato `<POP da borda>::<região da
função>::<id>`, então `cdg1::gru1::...` confirma função em São Paulo.

**Modelo de IA (fixos, não atualizar sem aprovação explícita do Bruno):**
- Chat público: Claude Haiku 4.5
- Treino/análise/resumo de lead: Claude Sonnet 4.6
- Tool use (`browse_url`): Haiku 4.5 com loop até 2 rounds
- **Opus é proibido em qualquer chamada do CitraChat.**

---

## Funcionalidades no ar

### Chat público
- Balões estilo WhatsApp, status de mensagem, typing dots, anexos (imagem/PDF até 5MB).
- Upload de arquivo por visitante (sem login) funciona via `agentId` publicado, não via sessão logada.
- Agente ativo (pós-transferência) persiste em `localStorage` por sessão — refresh não reseta pra recepção.
- Transferência entre agentes preserva contexto: `knownVisitorData()` injeta no prompt o que a
  recepção já coletou, pra o especialista não perguntar de novo.
- Agente sem destino de transferência configurado avisa isso ao visitante em vez de prometer
  transferir e não fazer.
- **Formatação proibida por código, não só por prompt:** `stripEmDash()` em `src/app/api/chat/route.ts`
  remove qualquer travessão da resposta antes de enviar ao visitante — o prompt já proibia
  ("nunca, em nenhuma hipótese"), e o modelo (Haiku) quebrava a regra em produção mesmo assim.
  Termos em inglês seguem só por regra de prompt por decisão do Bruno (2026-09-16): ele reforça no
  treinamento manualmente, sem camada de código.
- Extração de dados coletados (nome, telefone, email) é feita pela IA e **verificada pelo servidor**
  contra as mensagens reais do visitante (`verifiedCollected` em `src/lib/closure-fields.ts`) — o
  agente não pode inventar que coletou algo que o visitante não escreveu.

### Agente / multi-agente
- URL pública: `citra.chat/{company_slug}/{agent_slug}`. Limite por plano: Starter=1, Pro=3, Business=10.
- Bases de dados consultáveis (planilha .xlsx/.csv): upload processa linha a linha, mas **não guarda
  o arquivo original** — só existe botão de **download** desde 2026-09-16 (reconstrói o .xlsx a partir
  das linhas salvas no banco). Cuidado ao tocar nesse endpoint: nome de arquivo acentuado quebra
  `Content-Disposition` com erro 500 se não sanitizar pra ASCII (bug real já corrigido ali).

### Protocolos (SAC)
- Painel de Protocolos tem paridade com o de Conversas: leitura de imagens, nome do cliente, cadeia
  de agentes com divisor visual de transferência, hover verde (`#d9fdd3`), reenvio de e-mail,
  exportação em PDF, "Carregar mais" (paginação além do corte de 100 linhas), badge de número de
  conversa.
- **Protocolo e conversa têm exclusão em cascata nos dois sentidos** (2026-09-17): deletar uma
  conversa com protocolo apaga o protocolo também (antes ficava órfão pra sempre — não existe FK
  entre as duas tabelas, só `session_id` sem cascade); deletar um protocolo apaga a conversa
  vinculada. O diálogo de confirmação mostra o status do protocolo antes de confirmar a exclusão.
- `gerar_protocolo` é **idempotente por sessão** (2026-09-15): antes, um retry de rede ou o modelo
  chamando a ferramenta duas vezes na mesma conversa gerava dois protocolos pro mesmo caso. Agora
  devolve o já existente em vez de duplicar.
- Protocolo tem coluna `resolved_at` (migration 054, 2026-09-17) — a data em que foi de fato
  resolvido, separada de `created_at` (quando foi aberto). Sem isso, "resolvidos no período"
  filtrava pela data de abertura e escondia trabalho recente feito em casos antigos (bug real,
  validado contra produção: 11 protocolos resolvidos apareciam como só 4). Grava só na primeira vez
  que o status fecha; reabrir o caso limpa a data.

### Painel de Métricas — reescrito e corrigido em profundidade (2026-09-17/18)
Bateria de bugs reais encontrados e corrigidos nesta janela, todos confirmados contra o banco de
produção da conta Diretto, não só por leitura de código:

- Blocos por tipo de agente (Recepção / Leads / SAC / Agendamento) — cada bloco só aparece se a
  conta tem esse tipo de agente.
- "Precisa de ação" saiu do topo do painel (poluía a leitura antes de qualquer métrica) e foi para
  dentro da seção SAC, que é o contexto real dessas pendências. Conta sem agente de SAC ainda vê o
  bloco, em seção própria.
- Funil do visitante ganhou uma 2ª linha de cards: leads capturados, problemas resolvidos, casos
  fechados, taxa de resolução — calculados independente de quais grupos de agente a conta tem.
- **`resolved_at` separou duas perguntas que usavam a mesma data por engano:** "abertos no período"
  (por `created_at`) vs. "resolvidos no período" (por `resolved_at`). A autonomia por agente tinha
  um bug de 275% (dividia dois conjuntos diferentes — resolvidos-no-período por abertos-no-período —
  quando deveria dividir dentro do MESMO conjunto de abertos); corrigido.
- **`human_requested` era descartado silenciosamente.** O chat disparava o evento corretamente (a
  regex `HUMAN_RE` em `ChatInterface.tsx` já detectava certo), mas `ChatPage.tsx` só encaminhava 2
  tipos de evento pro banco (`chat_started`→`conversation_started`, `lead_qualified`→`conversion`) —
  todo o resto, incluindo `human_requested`, morria ali antes de chegar ao Supabase. Corrigido; o
  card "Pediram humano" começa do zero a partir de agora, sem histórico pra recuperar (o evento nunca
  foi salvo desde que o produto existe). A regex `HUMAN_RE` também foi ampliada — deixava passar
  frases naturais como "me passa pra um humano" e "tem alguém de verdade aí?".
- **Migration `021_human_takeover.sql` nunca tinha rodado em produção**, apesar de existir no repo
  desde muito antes. Sem as colunas `human_takeover`/`takeover_at`, o SELECT da página de métricas
  por agente falhava inteiro com erro 400 — e isso zerava em silêncio qualificados, motivos de
  contato e mais. Aplicada em produção em 2026-09-18.
- Qualificação de lead (`lead_qualified`, `contact_reason`) e resumo (`lead_summary`) já são gerados
  ricos pela IA no fechamento da conversa (`src/lib/send-lead-notification.ts`) — o prompt também
  gera `qualificationReason` (por que foi/não foi qualificado) e `nextStep` (ação concreta pro
  time), mas **esses dois campos são descartados hoje**, só vão pro corpo do e-mail de notificação.
  Se for enriquecer o painel de novo, é natural persistir esses dois também.
- **Pendente, adiado por decisão do próprio Bruno:** "tempo até resolver" mostra ~29 dias porque
  vários protocolos de teste antigos (da própria Diretto) foram fechados manualmente numa limpeza em
  2026-09-17 — a data ficou tecnicamente correta (foi isso que de fato aconteceu), só que distorce a
  média de atendimento real. Bruno vai apagar os protocolos de teste manualmente, um por um, pelo
  botão de deletar do painel. Decisão explícita: não fazer isso por código, porque não dá pra
  distinguir teste de caso real automaticamente.
- **Pendente, não feito ainda:** mais gráficos por agente (pedido explícito do Bruno), deixado pra
  próxima rodada depois dele validar que os números atuais fazem sentido.
- **Taxa de resolução e autonomia corrigidas de novo (2026-09-18, mesmo dia, rodada seguinte).**
  Bruno reportou a taxa do funil saltando 100% → 0% → 33,3% ao trocar o período, com "resolvidos"/
  "fechados" praticamente estáveis (3/3, 1/1, 3/3) ao lado — confirmado no banco: a fórmula dividia
  "resolvidos dentro do grupo aberto no período" (por `created_at`), população sem relação com o que
  os cards de resolvidos/fechados mostram (por `resolved_at`). Mesma causa raiz do bug de 275% já
  corrigido antes, só que também presente no card do funil geral e na autonomia agregada do SAC — só
  a tabela por agente tinha sido corrigida na rodada anterior. Agora os três (funil, autonomia
  agregada, autonomia por agente) usam sempre a própria contagem de "fechados" visível ao lado,
  dividida por ela mesma + o que abriu no período e ainda não foi resolvido. **Lição:** quando a mesma
  fórmula errada é copiada em mais de um lugar, corrigir um local não basta — procurar todas as
  ocorrências do padrão antes de considerar resolvido.
- Cards "Qualificados"/"Não qualificados" ganharam legenda explicando a lacuna (maioria dos leads sem
  avaliação): `lead_qualified` só existe para conversas fechadas a partir de 15/09 (migration 053), a
  notificação dispara uma única vez por sessão, e sessões anteriores a essa data já foram notificadas
  sem essa avaliação — não são reclassificadas retroativamente. Confirmado no banco (não é bug):
  100% das conversas com o campo preenchido começam em 15/09+; 0% das sem preenchimento estão presas
  em fila.

### Painel de Agentes
- Link público do agente (linha 3 do card, embaixo do nome) agora abre em nova aba ao clicar e tem
  botão de copiar ao lado (2026-09-18) — antes era só texto estático dentro do card inteiro, que era
  clicável só pra ir pra aba de configuração.
- Card do agente mostra a foto configurada (`avatar_url`, upload ou preset da aba Identidade) no
  lugar do ícone genérico de robô, quando existe (2026-09-18).

### Métricas — mais uma rodada de ajustes (2026-09-19)
- **Taxa de resolução e autonomia (agregada e por agente) corrigidas outra vez**, mesma causa raiz
  do bug de 275% já corrigido: a fórmula dividia "resolvidos por `resolved_at`" por "abertos por
  `created_at`" — duas populações sem relação. Sintoma que o Bruno reportou: taxa saltando
  100% → 0% → 33,3% trocando o filtro de período com "resolvidos"/"fechados" praticamente estáveis
  (3/3, 1/1, 3/3) ao lado. Corrigido pra sempre reconciliar com o próprio número de "fechados"
  visível ao lado: `taxa = fechados ÷ (fechados + pendentes do período)`. **Lição:** a mesma fórmula
  errada estava copiada em 3 lugares (funil geral, autonomia agregada do SAC, autonomia por agente na
  tabela) — corrigir um não bastou, foi preciso caçar as outras ocorrências do mesmo padrão.
- Cards "Qualificados"/"Não qualificados" ganharam legenda explicando por que a maioria dos leads
  não tem avaliação: `lead_qualified` só existe para conversas fechadas a partir de 15/09
  (migration 053), a notificação dispara uma única vez por sessão, sessões antigas não são
  reclassificadas. Confirmado no banco, não é bug.
- **Funil do visitante ganhou 2 cards** (Abertos no período com legenda de pendentes; Taxa de
  conversão com destaque próprio, antes era só uma legenda pequena embaixo de "Leads capturados") —
  feedback direto do Bruno: minha explicação de uma conta (3÷7=42,9%) só fazia sentido porque eu
  tinha ido no banco buscar números que não apareciam em lugar nenhum da tela. **Regra de design pra
  esse painel a partir de agora: toda taxa/percentual precisa ter os números que a compõem visíveis
  como cards ao lado, nunca só a explicação por fora.**
## Qualificação de lead — reescrita (2026-09-19, no ar em `d89dfc3`)

**O problema que originou:** o evento `lead_qualified` alimenta Google Ads, Meta e GTM — e disparava
no instante em que a conversa fechava, **sem nenhuma avaliação por trás**. Todo lead que chegava ao
fim virava "qualificado" para a mídia paga, fosse um comprador ativo ou alguém sem CNPJ que o agente
já tinha descartado. A análise de qualidade existia, mas rodava 5 minutos depois e só alimentava o
painel e o filtro do e-mail — nunca chegava a plataforma nenhuma.

**Por que não bastou mover o evento para os 5 minutos:** naquele momento o navegador do visitante já
fechou, e Google Ads, GTM, OpenAI e os demais pixels **só existem no navegador**. Só Meta CAPI e
webhook são server-to-server. Por isso a avaliação passou a acontecer **no fechamento**, em paralelo
à mensagem de despedida, com o navegador ainda aberto.

**O que mudou:**
- `quickQualify()` em `send-lead-notification.ts`: avaliação enxuta (Sim/Não) no fechamento, separada
  da análise completa para não atrasar a resposta ao visitante.
- `/api/qualify-lead` + `/api/qualify-lead-relay` (relay porque o `CRON_SECRET` não pode ir ao
  navegador — mesmo padrão do `notify-lead-relay`).
- **A qualificação passa a ler o treinamento do próprio agente** (`training_context` → seções
  `CLIENTE IDEAL (ICP)`, `ANTI-ICP`, `REGRAS DE COMPORTAMENTO`), em vez de uma regra genérica igual
  para todos os clientes do produto. Antes, o `send-lead-notification.ts` não lia `training_context`
  em lugar nenhum: a IA julgava o lead da Diretto sem saber que a Diretto é B2B e tem pedido mínimo
  por região. Testado contra o treinamento real dos 3 agentes: extrai de 2,3k a 5,1k chars de
  critério por agente.
- **Avaliação inconclusiva não gera e-mail em conta com filtro "só qualificados"** (decisão do Bruno,
  19/09, corrigindo uma escolha minha anterior de "falhar em aberto"). Raciocínio dele, e está certo:
  o lead não se perde nisso — a conversa continua no painel; o e-mail é notificação, não registro.
  Mandar assim mesmo violaria a configuração explícita do cliente. Fica um `console.error` quando a
  avaliação é inconclusiva, senão uma quebra de formato faria os e-mails sumirem sem alerta nenhum.
  O evento de mídia também **falha em fechado** (um falso "qualificado" suja a otimização e custa
  dinheiro de campanha).
- Corrigido bug em que qualquer resposta fora do formato virava `qualificado = true`. E o painel
  passa a gravar `null` (desconhecido) quando a avaliação é inconclusiva, em vez de mostrar como
  "não qualificado" um lead que ninguém conseguiu julgar.
- **Fluxo de e-mail intacto:** 5 min após o encerramento, +5 min a cada mensagem nova, varredura de
  30 min para conversa abandonada. (O Bruno lembrava "10 ou 20 min" para inatividade — é 30.)

### Correção do veredito instável (2026-09-19, `cac0097`)

Validação contra **9 conversas reais** do João (Diretto) expôs que a primeira versão que subi era
**instável**: rodando o mesmo lead 3 vezes seguidas, o veredito alternava entre Sim e Não. Só 2 de 5
casos davam resposta consistente. Como é esse veredito que libera o evento de mídia, o disparo para
Google Ads/GTM estava virando **sorteio** em qualquer lead sutil. Duas causas, ambas minhas:

1. **Pedir UMA palavra com `max_tokens: 8`** não deixa espaço para avaliar uma conversa longa — o
   modelo responde por impulso e ancora no último trecho lido. Agora escreve o motivo citando o
   trecho decisivo e só então o veredito (200 tokens).
2. **Contradição dentro da própria regra que escrevi:** uma frase dizia que objeção de valor mínimo
   NÃO desqualifica se ficou combinado retomar contato, e a seguinte mandava desqualificar quem
   "recusou explicitamente". Um lead que recusa o pedido mínimo satisfaz as duas → o modelo escolhia
   uma a esmo. Agora está explícito que **recusar condição comercial (preço, pedido mínimo, prazo)
   não é recusar o atendimento**.

Também entrou instrução anti-alucinação: numa execução o modelo citou como decisiva uma frase que
**não existe** na conversa, para justificar o veredito.

O mesmo critério passou a valer nos **dois** lugares (avaliação do fechamento e análise completa dos
5 min), que antes usavam textos diferentes e podiam discordar sobre o mesmo lead.

**Resultado medido** (prompt extraído do próprio código-fonte, 3 execuções por conversa):
2/5 estáveis antes → **8/8 estáveis e corretos** depois. Os 4 leads já marcados como qualificados
continuaram qualificados — sem correção em excesso.

**Lição de método, para não repetir:** inferi duas vezes o "resultado esperado" a partir do resumo de
uma linha em vez de ler a conversa inteira, e errei nas duas (Rafaela e Stephanie). Ao validar
julgamento de IA, a referência tem que vir da transcrição real — senão o teste calibra em cima de uma
suposição errada e a conclusão vira ruído.

### Critério final e correção do telefone (2026-09-19, `2965502`)

**Regra de qualificação, decidida com o Bruno.** A localizabilidade virou **pré-requisito avaliado
antes de tudo**: o nome sozinho nunca basta, é preciso nome + pelo menos um identificador (telefone,
e-mail, nome da empresa, CNPJ ou cidade/região). Só quem passa nessa verificação é avaliado pelos
outros critérios (perfil do negócio, profundidade da conversa, recusa explícita). Recusar uma
**condição comercial** (preço, pedido mínimo, prazo) não é recusar o atendimento — mas só continua
qualificado quem, depois da recusa, seguiu conversando ou **aceitou explicitamente** a retomada.

**Por que a estrutura importa:** duas vezes o critério quebrou porque cláusulas minhas se
contradiziam entre si (localizável × demonstrou interesse; objeção de preço × recusou
explicitamente). Um lead que satisfaz as duas faz o modelo escolher uma a esmo, e o veredito oscila.
Transformar a condição dominante em pré-requisito, em vez de mais um item de lista, foi o que
estabilizou. **Medido: 2 de 5 estáveis antes → 8 de 8 depois.**

**Bug do telefone — extração passou a ser por CONTEXTO** (`4f68c18`, 2026-09-19).

O problema: `extractContact` garimpava "coisas com cara de telefone" no texto inteiro da conversa.
CNPJ, CPF e telefone são todos sequências de dígitos, e o agente **pede CNPJ antes do telefone** —
então gravava pedaço de CNPJ como contato e descartava o celular dado depois. **Medido: 44 leads
tinham celular real na conversa e ficaram sem número utilizável**; o time não conseguia ligar.

Foi o Bruno quem derrubou a primeira tentativa de conserto: *"é estranho a pessoa dar telefone quando
o agente pede CNPJ"*. Isso expôs que o erro era de **abordagem**, não da expressão regular. A versão
intermediária (regex mais rigorosa) ainda produzia, medido nas 212 conversas: CPF gravado como
telefone, número de 11 dígitos truncado para 10, e número internacional (`+244…`, `+393…`)
transformado em número brasileiro falso.

Como ficou: acha a pergunta do agente ("qual seu WhatsApp?"), pega a resposta do lead e valida.
Três detalhes que os dados reais exigiram:
- **Última** resposta válida da janela, não a primeira — o lead erra e reenvia corrigido na mensagem
  seguinte (3 casos reais; num deles o próprio agente confirmou o número corrigido em voz alta).
- Número internacional preservado como veio, em vez de virar brasileiro inventado.
- Lookarounds de fronteira na regex de reserva, senão ela morde 10 dígitos de um número de 11.

A regex ficou só como **reserva**, para quando o lead informa sem ter sido perguntado. Dos 108
telefones encontrados na base, **97 vêm do contexto** e 6 da reserva.

**Lição que vale além deste bug:** quando vários tipos de dado têm o mesmo formato (dígitos), validar
o formato não resolve — é preciso usar o contexto que diz o que aquele dado é. Nenhuma regex ia
distinguir CNPJ de telefone; a pergunta do agente distingue.

O histórico dos 44 **não foi recuperado** — os telefones certos estão nas transcrições salvas, dá
para rodar um script de recuperação (agora com a lógica por contexto, que é bem mais precisa) se o
Bruno quiser.

**Lição de método, repetida três vezes nesta sessão:** inferi o "resultado esperado" a partir do
resumo de uma linha em vez de ler a transcrição, e errei nas três (Rafaela, Stephanie, rafa). No caso
da `rafa` o resumo dizia "foi proposto que um consultor entre em contato" — isso descreve a **oferta
do agente**, não a aceitação dela, que nunca respondeu. Ao validar julgamento de IA, a referência tem
que vir da conversa inteira, especialmente do **final**; senão o teste calibra em cima de suposição
errada e a conclusão vira ruído.

**Risco de overfitting, conscientemente interrompido:** foram 6 iterações do prompt contra as mesmas
9 conversas. Parei ali de propósito — continuar afinando para forçar um caso específico produz prompt
que funciona nessas 9 e falha no resto.

**Aberto, aguardando decisão do Bruno (2 casos limítrofes):**
- **Reinaldo** — deu só o primeiro nome e "estamos montando um restaurante, interesse nas farinhas La
  Molisana", sem empresa, CNPJ, cidade ou contato; sumiu quando o agente pediu o nome da empresa. Pela
  regra literal é **não qualificado** (nome sozinho), mas o modelo diz qualificado de forma estável,
  lendo "montando um restaurante" como identificação de negócio. Hoje está marcado como qualificado
  no banco.
- **Stephanie** — deu nome, empresa (Brasa & Beef) e cidade, ouviu o pedido mínimo e sumiu sem
  responder. Passa na verificação de localizabilidade e não recusou nada, então o modelo diz
  qualificado de forma estável. Hoje está marcado como não qualificado no banco.

**Também parado esperando liberação:** backfill dos 138 leads antigos do João sem avaliação. Agora
faz mais sentido do que antes, porque o critério está validado.

**Onde o critério por empresa é configurado:** no treinamento que já existe por agente, não em campo
novo. Decisão consciente — o `saveTrainingContext` regenera o documento inteiro passando o anterior
como base, então guardar o critério numa seção do mesmo documento faz os dois se enxergarem
automaticamente. Um campo separado é justamente o que quebraria essa conexão.

**Contexto de mídia da Diretto (levantado no caminho, ainda pendente do lado dele):**
- **O Google Ads recebe a conversão via GTM, não pela configuração do CitraChat.** `google_ads_conversion_id`
  está vazio nos 3 agentes **de propósito**: esse campo só serve para o disparo direto via `gtag`
  quando NÃO há GTM. Como a Diretto tem GTM lendo o `dataLayer`, é o GTM que alimenta o Google Ads a
  partir do evento `citrachat_{tag}_lead_qualified`. (Registro de erro meu: cheguei a afirmar que o
  Google não recebia nada por causa do campo vazio — errado, o Bruno corrigiu.)
- Meta (pixel + token de CAPI) só está na **Lara** (recepção); o **João**, que é quem capta lead, não
  tem pixel. Mas **não há campanha de Meta rodando**, então isso não é lacuna ativa hoje.
- `gclid`/`fbclid` **não são capturados em lugar nenhum** do código. Sem isso, conversão offline para
  o Google Ads (a única via possível depois que o navegador fecha) não é viável — seria projeto
  próprio: capturar o click ID na abertura do chat, guardar na conversa e integrar a API do Google.
- Tags de evento por agente configuradas pelo Bruno em 19/09: Eduardo=`sac`, João=`vendas`,
  Lara=`atendimento`. **Atenção:** isso muda o nome do evento no dataLayer
  (`citrachat_lead_qualified` → `citrachat_vendas_lead_qualified`), então triggers antigos do GTM
  param de disparar. O Bruno está reconfigurando o GTM (container `GTM-NWCKHMTH`) por conta própria.
- **Risco não confirmado:** a ponte do widget chama `gtag('event', ...)` direto para o GA4 sempre que
  há measurement ID, **sem checar se já existe GTM** (diferente do caminho sem widget, que só faz
  isso quando não há GTM). Como os 3 agentes têm GA4 **e** GTM, pode haver contagem dobrada no GA4.
  Não verificado em produção.

### Performance do painel admin (2026-09-17 — resolvido, Bruno confirmou "mudou super bem")
Causa da demora de 2-3s trocando entre Agentes/Métricas/Conversas/Protocolos:
1. Funções rodando em Washington, banco em São Paulo (ver Infraestrutura acima) — a maior parte do ganho.
2. `auth.getUser()` era chamado 2x por navegação (layout + página) — cada chamada é uma ida e volta
   real ao servidor de Auth do Supabase, não é local. Corrigido com `getAuthedUser()` em
   `src/lib/supabase/get-user.ts`, usando `cache()` do React pra deduplicar por request.
3. Mesma duplicação na leitura da tabela `profiles` (layout lia a linha inteira, cada página lia de
   novo só pra pegar o fuso horário). Corrigido com `getCurrentProfile()` /
   `getTimezoneForCurrentUser()` em `src/lib/supabase/get-profile.ts`.
4. `loading.tsx` adicionado em Conversas/Protocolos/Métricas/Agentes — sem isso o clique não dava
   nenhuma resposta visual até o servidor terminar de responder, e parecia que o clique não tinha
   registrado (chegando a clicar duas vezes).

### Notificações — WhatsApp (no ar) e SMS/RCS (decidido, não implementado)
- **WhatsApp:** implementado via Meta Graph API como add-on pago. Arquivos: `src/lib/whatsapp.ts` +
  webhook route + `ContaForm` + `conta/actions`.
- **RCS/SMS (Solvefy) — decidido, mas ainda não implementado.** Modelo: opt-in (não vem ativado em
  nenhum plano por padrão), cliente precisa marcar checkbox + aceitar termos específicos no painel,
  cota incluída por plano (Pro 50/mês, Business 150/mês em RCS), excedente cobrado automaticamente
  via Stripe a R$0,15/mensagem. Canal escolhido: **RCS**, não SMS puro (RCS já funciona em iPhone com
  iOS 18+, mas ainda precisa de fallback pra SMS pra quem não tem — esse fallback NÃO é automático na
  API da Solvefy, é opt-in por mensagem via campo `fallback` no payload de envio).
  **Bloqueios antes de codar:**
  - Preço negociado (R$0,07 SMS / R$0,10 RCS) não bate com o self-service da própria conta Solvefy
    (lá aparece R$0,078 SMS e RCS em 3 categorias: R$0,0865 a R$0,2730). Bruno vai confirmar com o
    comercial da Solvefy qual categoria corresponde ao preço negociado.
  - Cadastro do Agente RCS exige CNPJ real e trava sem ele nas etapas 4/5 — não se sabe ainda o
    prazo nem quem aprova (a própria Solvefy ou Google/operadora).
  - Transição do modelo pré-pago pro pós-pago não está documentada no self-service.
  - Detalhe completo, preços exatos e achados técnicos do Cowork:
    `produtos/citrachat/briefings/06_precificacao_e_custos.md` (v5, seção 5).
- Twilio (SMS) foi descartado como provedor principal por custo (R$0,35/SMS vs Solvefy R$0,07-0,10);
  a conta e o crédito de US$20 ficam parados, sem uso previsto.

### Segurança e legal
- Checkbox de aceite de termos obrigatório no cadastro (migration 052, campo `TERMS_VERSION`).
- Rascunho de blindagem jurídica (indenização por dano causado por agente de cliente) existe em
  `produtos/citrachat/briefings/11_blindagem_juridica_responsabilidade.md`, **não publicado**,
  aguardando revisão de advogado — decisão explícita do Bruno foi construir junto antes de envolver
  jurídico, não é esquecimento.
- Snapshot de segurança (auth, RLS, APIs, secrets, webhooks) em `produtos/citrachat/seguranca.md`
  (2026-09-04) — 3 gaps críticos identificados na época: WhatsApp sem HMAC, rate limit in-memory, RLS
  de conversations/protocols não confirmada. Conferir se ainda procede antes de assumir como atual.

---

## Feature roadmap — documentada, não implementada

**Multiusuário/papéis** (convite de equipe, 3 papéis: Admin/Treinamento/Atendimento, restrito a
planos Pro/Business, Atendimento também vê Métricas): decisão explícita do Bruno foi só documentar
por enquanto, sem escrever nenhum código. Toca auth, ~25 RLS policies e o painel inteiro quando for
implementada.

---

## EM ABERTO — Tagueamento GTM por agente (parado em 2026-09-19, retomar aqui)

Bruno pediu para pausar e voltar depois. Nada foi alterado em código nem no GTM.

**Contexto.** Bruno criou tags por agente na Diretto (`sac`, `vendas`, `atendimento`) e pediu ao
Claude Cowork uma auditoria do container GTM-NWCKHMTH. O Cowork auditou e devolveu um relatório com
três perguntas. A resposta a essas perguntas está escrita e pronta para colar, mas ainda NÃO foi
enviada ao Cowork.

**O que o Cowork acertou.** O container nunca teve tags/triggers do CitraChat (só 2 tags: MAKE Pixel
FB e Google Tag para GA4 `G-0WJYEFT9ZB`). Buscar "citrachat" não retorna nada. Logo, a renomeação das
tags não quebrou nada, porque o GTM nunca consumiu esses eventos. Confirmou também que o widget
injeta no DOM (Shadow DOM), não é iframe cross-origin, então o dataLayer é o da página principal e
triggers de Evento Personalizado funcionam normalmente.

**Descoberta que invalida o plano proposto pelo Cowork.** A tag do evento congela no agente de
entrada da página:

- `src/app/[company]/ChatPage.tsx:102-117` monta `trackingConfig` uma única vez a partir do
  `agent_integrations` da página e passa para `useTracking`. Não é estado, nunca é refeito.
- `src/lib/tracking/use-tracking.ts:99-100` monta o nome como `citrachat_{config.eventTag}_{evento}`.
- `src/app/api/widget/route.ts:365` empurra `citrachat_agent` com o parâmetro estático do script.

Consequência: na diretto.com.vc só o widget da Lara está embutido. Quando a Lara transfere para João
ou Eduardo, os eventos continuam saindo como `citrachat_atendimento_*`. **`citrachat_vendas_*` e
`citrachat_sac_*` nunca disparam naquele site.** Só disparam se a pessoa cair direto em
`citra.chat/diretto/atendimento-comercial` ou `/sac-diretto`. E `citrachat_agent` também não muda no
meio da sessão, ao contrário do que o Cowork supôs.

**Mapa confirmado no banco (tabela `agent_integrations`, não `agents`):**

| Agente | slug | objective_type | tag | evento de fechamento |
|---|---|---|---|---|
| Lara | atendimento-diretto | receptionist | `atendimento` | `citrachat_atendimento_lead_qualified` |
| João | atendimento-comercial | sales | `vendas` | `citrachat_vendas_lead_qualified` |
| Eduardo | sac-diretto | support | `sac` | `citrachat_sac_issue_resolved` |

Outros: Alex (`makelemonad`, GTM-5R5ZM77), Ana (`limonete`, GTM-KQBZRCHG). Renata, Renato, Sofia e
Tomás não têm tag nem tracking configurado.

**Respostas às 3 perguntas do Cowork (prontas, não enviadas):**

1. *Criar triggers mesmo sem tags usando?* **Não, ainda não.** Triggers de `vendas` e `sac` no
   container da Diretto ficariam mortos pelo motivo acima.
2. *`lead_qualified` pode ocorrer na Lara?* **Sim, definitivamente.** Lara é `receptionist`, e
   `src/app/api/qualify-lead/route.ts:61` só exclui `support` e `faq`.
3. *Existem páginas reais onde vendas/sac aparecem?* Os 404 do Cowork foram domínio errado. Ele
   testou `diretto.com.vc/diretto/sac-diretto`. As URLs reais são em `citra.chat` e foram verificadas
   retornando 200: `/diretto/atendimento-diretto`, `/diretto/atendimento-comercial`,
   `/diretto/sac-diretto`.

**Ponto em aberto com o Cowork.** Ele afirmou que o chat chama `gtag()` direto. No código esse
caminho exige `!gtmContainerId`, e a Lara tem GTM configurado, então o que deveria acontecer é
`dataLayer.push`. Falta ele confirmar em qual URL exata capturou o `/g/collect` com
`en=citrachat_atendimento_chat_opened`. Se foi na página do citra.chat, explica-se pelo GTM próprio
de lá.

**Decisão pendente do Bruno (é o que destrava o resto).** Hoje uma conversa que a Lara passa para o
João converte como `atendimento`, então não dá para separar no Google Ads o que veio de venda do que
veio de recepção. Para separar, a tag precisa seguir o agente ativo após a transferência, e isso é
mudança de código (reler `agent_integrations` na transferência, ou mandar a tag do agente ativo junto
do evento), não configuração de GTM. Claude perguntou se deve implementar; Bruno pausou antes de
responder.

**Próximo passo ao retomar:** obter a decisão do Bruno sobre a tag seguir o agente ativo. Só depois
enviar as respostas ao Cowork e autorizar qualquer criação de trigger. O Cowork declarou que nada
será publicado sem aprovação.

---

## Anexos de conversa — reescrita completa (2026-09-19)

**Origem.** Bruno mandou o PDF da conversa #235 (Jocemir, agente João): o visitante enviou o
currículo, o painel mostrava só `[arquivo]` em itálico, e o e-mail não trouxe nada.

### O que estava quebrado (três defeitos independentes)

1. **O painel ignorava documento.** `parseContent` estava duplicado em `ConversasClient.tsx` e
   `ProtocolosClient.tsx` e só procurava bloco `type === 'image'`. Bloco `document` caía no
   `[arquivo]` sem link. O arquivo nunca se perdeu: a URL sempre esteve no banco.
2. **O e-mail perdia o anexo, inclusive imagem.** Existem dois caminhos. O disparo imediato pelo
   navegador manda `attachment` e funcionava. O disparo normal (cron de 5 min) relê a conversa do
   banco, e `saveConversation` grava só `role`, `content` e `at`. Aí `normalizeContent` filtrava só
   blocos de texto e devolvia string vazia.
3. **Nada ia como anexo de verdade**, só link.

### Limites que se contradiziam

Código dizia 10 MB, bucket recusava acima de 5 MB, e a Vercel recusa corpo de requisição acima de
**4,5 MB** (erro 413). O limite real era 4,5 MB e não estava escrito em lugar nenhum. O maior anexo
já recebido tinha 4,14 MB, a 8% do teto.

### Decisões do Bruno

- Teto de **25 MB**. Não é escolha nossa: Resend aceita 40 MB pós-base64 (~30 MB reais) e o Gmail
  envia no máximo 25 MB. Quem recebe é o gargalo.
- Sempre **anexar de verdade**, não link. Com isso o link público deixa de ser necessário.
- Formatos: **PDF, TXT, MD, CSV, JPG, PNG, GIF, WebP e DOCX**. HEIC e PPTX fora, por decisão dele.
  (XLSX sairia de graça, o conversor já existe na base de conhecimento; ficou para se ele quiser.)
- Não reenviar e-mail de teste; validar no próximo lead real que chegar.

### O que foi implementado e está verificado

- **`src/lib/attachments.ts` (novo)** — leitor único (`parseContent`) que entende `image` e
  `document`, recupera o nome original da URL removendo o carimbo `Date.now()_`, mais a allowlist de
  tipos e o teto de 25 MB. Fonte única de verdade, para não voltar a ter limites divergentes.
- **`ConversasClient.tsx` e `ProtocolosClient.tsx`** — parser local removido, bolha e exportação em
  PDF passam a mostrar o anexo com nome e link.
- **`send-lead-notification.ts`** — `visibleMessages` reconstrói o anexo a partir dos blocos antes de
  normalizar, e `montarAnexosDoEmail` baixa o arquivo e manda no `attachments` do Resend (nos dois
  envios: notificação e protocolo resolvido). Teto de 25 MB somados; acima disso vai só o link.
- **`/api/upload/sign` (novo)** — assina upload direto para o Storage, tirando a Vercel do caminho.
  Mecanismo testado fora do app: assinatura com service key, envio **sem autenticação** HTTP 200,
  arquivo legível, limpeza ok.
- **`/api/upload/extract` (novo)** — converte para texto o que a Anthropic não lê. A API só lê PDF,
  texto puro e JPEG/PNG/GIF/WebP; a própria documentação manda converter DOCX antes. Usa `mammoth`,
  já instalado. Extração testada com .docx real.
- **`ChatInterface.tsx`** — upload assinado com fallback para `/api/upload` se a assinatura falhar
  (um erro de auth já derrubou todo anexo de cliente uma vez). DOCX/TXT/CSV entram na conversa como
  bloco de texto; bloco `document` com esses tipos faria a API recusar a requisição inteira.
- **Bucket `chat-attachments`** — teto 5 MB → 25 MB; lista de MIME removida de lá de propósito.

### Recuperado retroativamente

18 conversas passam a mostrar o anexo assim que isso subir, sem migração (a URL já está no banco):
documento em **#97, #112, #120, #156, #158, #170, #235**; imagem em **#2, #72, #77, #87, #113,
#119, #122, #129, #170, #226, #233**.

### PENDENTE

- **Não foi feito deploy.** Build, typecheck e lint passaram (os 2 erros de lint do ChatInterface e
  o 1 do ConversasClient já existiam antes, conferido contra o git HEAD).
- **Bucket privado com URL assinada** — aprovado em conceito, não implementado. Quebra o caminho em
  que a Anthropic busca o arquivo pela URL pública; a saída é URL assinada, que expira. Também exige
  gerar URL nova no painel e na exportação de PDF.
- **Validar o e-mail com anexo** no próximo lead real.

---

## Clientes ativos

- **AbyaraGraf** (`company_slug: abyaragraf`) — agentes Joana (SAC) e Tiago (vendas).
- **Diretto** (`company_slug: diretto`) — agentes Lara (recepção), Eduardo (SAC/suporte), João
  (vendas/captação). Cliente mais ativo — a maior parte dos bugs reais encontrados nesta janela veio
  de conversas reais dessa conta (protocolo duplicado, travessão, atribuição de métricas, migration
  faltante). Base de dados "Revendedores x Marcas" (4.977 linhas) treinada no agente Eduardo.

---

## Como retomar uma sessão

1. Ler este arquivo inteiro primeiro.
2. Conferir `_memoria_pendente/` na raiz do workspace (`ccos-make/_memoria_pendente/`) — aplicar e
   apagar se houver snapshot novo pra `citrachat`.
3. `cd produtos/citrachat/codigo && git log --oneline -10` — branch ativa é `plataforma`.
4. Se o trabalho envolver preço ou custo, ler também `produtos/citrachat/briefings/06_precificacao_e_custos.md`.
5. **Ao terminar qualquer trabalho relevante, atualizar este arquivo antes de encerrar a sessão.**
   Não esperar ser pedido de novo.
