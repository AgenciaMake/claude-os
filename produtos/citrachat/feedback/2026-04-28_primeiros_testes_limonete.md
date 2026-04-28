# Feedback Limonete — primeiros testes (2026-04-28)

Feedbacks do Bruno após testar o agente piloto Limonete na Fase 1 do CitraChat.

## Bugs identificados (corrigidos)

- **Texto do input invisível** — textarea sem `text-gray-900` explícito, ficava com cor padrão branca em alguns navegadores. Corrigido em `ChatInterface.tsx`.

## Padrões absolutos pra QUALQUER agente do CitraChat

Aplicar a partir desta sessão pra Limonete e como base pro configurador (Fase 2):

1. **Sem travessões `—`** — proibido na Make. Marcador clássico de IA.
2. **Sem markdown** — zero asteriscos pra negrito, zero bullets, zero numeração. Texto puro estilo WhatsApp.
3. **Uma pergunta por vez** — nunca despeje múltiplas perguntas numa mensagem só. Nunca enumere ("1.... 2.... 3....").
4. **Resposta com ritmo humano** — implementado via `lib/typing-rhythm.ts`:
   - Delay aleatório de "pensar" antes de começar (800-2200ms)
   - Renderização char-a-char com pausas em pontuação
   - Indicador "digitando..." enquanto pensa, "online" quando termina
5. **Mensagens curtas** — 1-3 frases geralmente, raramente mais de 4.
6. **Reconhecer antes de perguntar** — "entendi, [resumo curto]. mas me conta..." — sem floreado.

## Frameworks de qualificação (aplicado na Limonete)

- **SPIN selling** como estrutura mental de aprofundamento (Situação → Problema → Implicação → Necessidade-resultado)
- **BANT** (Budget, Authority, Need, Timeline) coletado em paralelo, distribuído pela conversa, não em forma de checklist
- Coleta de contato (nome + email/WhatsApp + empresa) só quando o lead está engajado, não logo de cara
- Encaminhamento: lead bom → Bruno (estratégico) ou Amanda (operacional). Lead ruim → educadamente direcionar pra outro caminho

## Decisão de produto: configuração via entrevista

Quando o cliente assina o CitraChat, NÃO vai preencher formulário. Vai conversar com um agente configurador (como o Alfred do briefing) que entrevista e gera dinamicamente o agente dele. Detalhes em `briefings/01_configuracao_do_agente_via_entrevista.md`.

## Próximas calibragens possíveis

- Testar o "digitar/apagar/voltar" (simulação de hesitação humana mais avançada) — não implementado ainda
- Variar tamanho de mensagens (algumas mais curtas, "tá", "entendi", outras mais longas) — atualmente o modelo decide, mas pode ser instruído
- Usar emoji com moderação (1 por mensagem, e só quando faz sentido)
