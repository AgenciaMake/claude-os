---
name: citrachat-roadmap-multiusuario
description: Roadmap de gerenciamento de usuários/permissões por conta no CitraChat (multiusuário)
metadata:
  type: project
  node_type: memory
  originSessionId: 16f3a8cf-6c02-498f-adc5-4abc80036d4c
  modified: 2026-09-15T15:35:15.635Z
---

Bruno pediu suporte a múltiplas pessoas por conta CitraChat (ex: a Diretto quer
que uma pessoa cuide do treinamento dos agentes e outra só acompanhe o painel
de conversas, sem acesso a assinatura/pagamento).

**Por quê:** hoje o CitraChat é 1 conta = 1 login. `profiles.id` é literalmente
o `auth.users.id` de quem se cadastrou, e toda tabela do produto (agentes,
conversas, config, assinatura) é filtrada só por esse ID — tanto no código
(32 pontos com `.eq('user_id', user.id)`) quanto no RLS do banco (~25 policies,
quase todas `auth.uid() = user_id`). Não existe hoje nenhum conceito de "conta"
separado de "pessoa logada".

**Decisões já tomadas com Bruno (10/09/2026):**
- Três papéis fixos, não permissão granular por seção:
  - **Admin** — acesso total, inclusive convidar/remover gente e ver
    Assinatura/Conta (dados fiscais e pagamento).
  - **Treinamento** — Agentes, Treinar, Publicar, Integrações. Sem Assinatura,
    sem Conta.
  - **Atendimento** — só Conversas e Protocolos (acompanhar e assumir
    atendimento).
- Fica restrito aos planos **Pro e Business**, com limite de pessoas por
  plano — mesmo padrão que já existe para número de agentes (ver
  `PLAN_LIMITS` em `assinatura/page.tsx` e `admin/planos`). Sugestão inicial:
  Pro até 3 pessoas (contando a dona da conta), Business até 10 — espelhando
  o limite de agentes de cada plano, mas o número exato ainda não foi
  confirmado por Bruno, só a existência do limite.

**Desenho técnico proposto (ainda não implementado, nem migration nem código):**

1. **Tabela nova `team_members`**: `account_id` (o `profiles.id` da conta
   principal/dona), `member_user_id` (o `auth.users.id` da pessoa convidada,
   nulo até aceitar o convite), `email`, `role` (`admin` | `treinamento` |
   `atendimento`), `status` (`pending` | `ativo`), datas de convite/aceite.

2. **Convite por e-mail, não cadastro normal.** A pessoa convidada cria a
   própria senha, mas não deve cair no fluxo de `signupWithPromo` (que sempre
   cria `profiles` novo com trial de 14 dias) — precisa de um fluxo de aceite
   de convite dedicado que vincula o `auth.users.id` dela a um
   `team_members.member_user_id` existente, sem criar `profiles` própria.

3. **Resolução de conta no login — o ponto mais delicado.** Hoje
   `src/app/admin/(app)/layout.tsx` resolve tudo lendo `profiles` pelo próprio
   `user.id` de quem logou. Pra um membro de equipe, isso não funciona: o
   `auth.users.id` dele não bate com nenhum `profiles.id`. Precisa checar
   primeiro `team_members` (por `member_user_id`) pra achar o `account_id`
   certo, e só então carregar o `profiles` daquela conta. Essa resolução deve
   rodar uma vez, central, no layout — o resto do painel usa o `account_id`
   resolvido a partir daí, não mais `user.id` direto.

4. **RLS reescrito tabela por tabela.** Cada uma das ~25 policies atuais
   (`auth.uid() = user_id`) precisa virar algo como "o dono vê, OU um membro
   ativo de `team_members` com o papel certo para esta tabela vê". Trabalho
   mecânico mas extenso — cada policy testável isoladamente, mas errar aqui
   vaza dado entre contas, então merece revisão cuidadosa antes de ir ao ar.

5. **Guarda de rota por papel no App Router**, não só esconder link no menu —
   Treinamento e Atendimento não podem simplesmente digitar a URL de
   Assinatura/Conta e entrar.

6. **Tela de gestão de equipe** (dentro de Conta, ou seção própria) pro Admin
   convidar, ver pendentes/ativos, trocar papel, remover, e ver quantas vagas
   ainda tem no limite do plano.

**Status:** roadmap registrado em 15/09/2026. Documentado a pedido explícito
de Bruno — ele quis só o registro por agora, sem começar a implementação
("Só documentar por agora"). Não existe nenhum código nem migration desse
recurso ainda.

**How to apply:** quando Bruno disser algo como "vamos fazer o multiusuário"
ou "vamos implementar convite de equipe", retomar este roadmap. Antes de
escrever qualquer migration, confirmar com ele: (a) o número exato de vagas
por plano, (b) se quer revisar a lista de permissões por papel antes de
começar, e (c) se prefere a resolução de conta feita como descrito no item 3
ou de outra forma. Dado o tamanho (toca auth, RLS de ~25 policies e o painel
inteiro), tratar como trabalho de várias sessões, não uma tarefa pontual —
melhor quebrar em etapas (schema + convite, depois RLS, depois guarda de
rota/UI) e confirmar cada etapa antes da próxima.
