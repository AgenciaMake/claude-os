---
name: setup
description: >
  Configura o Claude Code OS pro seu negócio. Faz perguntas sobre quem você é,
  o que faz e como trabalha, e gera CLAUDE.md, memória, estrutura de pastas e
  lista de MCPs personalizados pro seu perfil.
  Use quando o usuário chamar /setup, quando _contexto/empresa.md estiver vazio
  ou ausente, ou quando disser "configurar o sistema", "primeira vez", "setup".
---

# /setup — Configuração do Sistema

## Verificação inicial

Antes de qualquer coisa, verifique se `_contexto/empresa.md` existe e tem conteúdo real (não apenas o template).

- Se **não existe ou está vazio**: inicia o fluxo de onboarding abaixo.
- Se **já tem conteúdo**: informa ao usuário que o setup já foi feito e pergunta se quer refazer ou apenas atualizar alguma parte.

---

## Onboarding (primeira vez)

Comece com uma mensagem curta de boas-vindas:

> "Boa. Vou te fazer algumas perguntas pra configurar o sistema pro seu negócio. Responde com calma — quanto mais específico, melhor o sistema vai trabalhar pra ti."

Faça as perguntas em sequência, uma por vez, em conversa natural. Não liste todas de uma vez. Espere a resposta de cada uma antes de ir pra próxima.

### Pergunta 1
"Qual é o seu nome e o nome do seu negócio?"

### Pergunta 2
"Em uma frase: o que você faz e pra quem?"

*(Exemplo: "Sou designer freelancer, faço identidades visuais pra pequenas empresas" ou "Tenho uma agência de marketing digital com foco em e-commerce")*

### Pergunta 3
"O que você mais produz no dia a dia? Pode ser mais de uma coisa."

*(Exemplos: conteúdo pra redes sociais, propostas comerciais, relatórios, código, emails pra clientes, apresentações, combinação de tudo)*

### Pergunta 4
"Você atende clientes externos ou usa o sistema principalmente pro seu próprio negócio?"

*(Ou os dois — pode responder livremente)*

### Pergunta 5
"Quais ferramentas você usa hoje no trabalho? Cita as principais."

*(Exemplos: Notion, Google Drive, Canva, Gmail, Meta Ads, Google Ads, Figma, Slack, WhatsApp Business — qualquer uma que use com frequência)*

### Pergunta 6
"Sua marca tem identidade visual definida? Se sim, descreve brevemente as cores e o estilo."

*(Exemplos: "fundo preto, amarelo de destaque, estilo bold" / "tons terrosos, fonte serifada, visual mais suave" / "ainda não tenho definido")*

### Pergunta 7
"Como você prefere que o Claude escreva? O que mais incomoda em textos gerados por IA?"

*(Exemplos: "direto, sem enrolação, sem bullet points desnecessários" / "odeio travessão e 'mergulhe de cabeça'" / "pode ser mais informal, falo gíria com clientes")*

### Pergunta 8
"Tem equipe ou é você que toca tudo?"

*(Pode mencionar parceiros, freelas, sócios se tiver)*

---

## Processamento das respostas

Com todas as respostas, detecte o perfil principal:

**Perfis possíveis:**
- `agencia` — atende múltiplos clientes, tem processos de entrega
- `freelancer` — trabalha solo, atende clientes, vende serviço próprio
- `solopreneur` — negócio próprio sem foco em clientes, mais em audiência/produto
- `criador` — foco em conteúdo, canal, audiência
- `profissional-clt` — usa pra produtividade pessoal e carreira

*(Um perfil pode ter características de outro — use o que melhor descreve o uso principal)*

---

## O que gerar

### 1. Atualizar `CLAUDE.md` na raiz

Substitua o conteúdo placeholder pelo CLAUDE.md real do usuário:

```markdown
# [Nome do Negócio] — Claude Code OS

## Sobre o negócio
[descrição em 2-4 linhas com o que foi dito]

## O que mais fazemos aqui
[lista das principais atividades/entregas]

## Clientes e contexto
[atende clientes ou uso interno, tamanho, tipo]

## Tom de voz
[como escrever, o que evitar, exemplos se mencionou]

## Regras do sistema
[o que NÃO fazer, preferências específicas]

## Ferramentas conectadas
[lista das ferramentas que usa — atualizar conforme MCPs forem instalados]

## Estrutura de pastas
[descrição da estrutura criada, pra o Claude saber onde salvar cada coisa]
```

### 2. Criar `_contexto/empresa.md`

```markdown
# Contexto da Empresa — [Nome]

**Nome:** [nome do usuário]
**Negócio:** [nome do negócio]
**O que faz:** [descrição]
**Perfil:** [agencia / freelancer / solopreneur / criador / profissional-clt]
**Atende clientes:** [sim/não/ambos]
**Equipe:** [solo / com equipe — detalhe se mencionou]
**Ferramentas:** [lista]
**Principais entregas:** [lista do que mais produz]

## Contexto adicional
[qualquer informação relevante que surgiu nas respostas]
```

### 3. Criar `_contexto/preferencias.md`

```markdown
# Preferências de Comunicação

## Tom de voz
[como o Claude deve escrever pros outputs desse usuário]

## O que evitar
[lista do que incomoda, palavras proibidas, construções a evitar]

## Estilo geral
[formal/informal, curto/longo, com/sem bullet points, etc]

## Preferências adicionais
[qualquer outra preferência mencionada]
```

### 4. Pré-preencher `marca/design-guide.md`

Se o usuário descreveu cores e estilo, preencha com o que foi dito.
Se não tem identidade definida, preencha com campos em branco e um comentário orientando como preencher depois.

### 5. Criar estrutura de pastas conforme o perfil

**Perfil agência / freelancer (atende clientes):**
```
clientes/
  _modelo-cliente/
    briefing.md
    proposta.html
briefings/
propostas/
conteudo/
tarefas.md
```

**Perfil solopreneur / criador:**
```
conteudo/
  carrosseis/
  newsletters/
  roteiros/
projetos/
estudos/
publicacoes/
tarefas.md
```

**Perfil profissional / carreira:**
```
trabalho/
  projetos/
  reunioes/
anotacoes/
curriculo/
tarefas.md
```

### 6. Criar `_configurar-mcps.md`

Gere uma lista personalizada baseada no perfil e nas ferramentas que o usuário citou. Use os dados de `mcps/por-perfil.md` como referência, mas personalize pra o que foi dito.

Formato do arquivo:

```markdown
# MCPs recomendados pro seu perfil

Esses são os conectores que vão dar mais poder pro seu setup.
Instale na ordem sugerida — os primeiros da lista têm mais impacto imediato.

## Instalar agora (prioridade alta)

### [Nome do MCP]
**Por que instalar:** [motivo específico pro perfil desse usuário]
**Como instalar:**
\`\`\`bash
[comando exato]
\`\`\`

[repetir para cada MCP recomendado]

## Instalar depois (quando quiser expandir)

[MCPs de segundo nível]

---

Depois de instalar, atualize a seção "Ferramentas conectadas" no CLAUDE.md.
```

---

## Mensagem final

Após gerar todos os arquivos, envie uma mensagem de encerramento:

> "[Nome], seu sistema tá configurado.
>
> Aqui está o que foi criado:
> - CLAUDE.md — o Claude agora sabe quem você é e como trabalha
> - _contexto/ — contexto e preferências salvos
> - marca/design-guide.md — identidade visual [preenchida / pronta pra preencher]
> - Estrutura de pastas pro seu perfil de [perfil detectado]
> - _configurar-mcps.md — [N] MCPs recomendados pro que você faz
>
> **Próximo passo:** instala pelo menos o primeiro MCP do arquivo _configurar-mcps.md.
> Depois volta aqui e chama `/carrossel` pra criar seu primeiro carrossel,
> ou `/proposta-comercial` se tiver um cliente esperando."

---

## Regras

- Tom direto e humano, sem excesso de entusiasmo
- Não use listas com bullet points nas perguntas — faça em conversa
- Se o usuário der respostas vagas, faz uma pergunta de acompanhamento antes de continuar
- Gera os arquivos todos de uma vez no final, não um a um durante as perguntas
- Após gerar, mostra a mensagem final resumida — não lista cada linha de cada arquivo
