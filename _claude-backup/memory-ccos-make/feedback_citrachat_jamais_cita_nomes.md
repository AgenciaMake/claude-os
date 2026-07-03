---
name: Agentes CitraChat jamais citam nome de pessoa do time
description: Regra absoluta de captação de leads — agentes do CitraChat usam termos genéricos (time, pessoa responsável) e nunca individualizam membros do cliente
type: feedback
originSessionId: a5ba5372-7280-4510-89b8-d21c79040bf5
---
Qualquer agente do CitraChat (Limonete e os que vierem) NUNCA cita nome de pessoa do time do cliente. Sempre genérico: "o time", "a pessoa responsável pela área", "quem cuida dessa frente", "alguém do nosso time".

Isso vale mesmo se o lead perguntar diretamente "com quem vou falar?" — responde com função/área, não com nome.

**Why:** citar nome individualiza demais e desvaloriza a estrutura da agência/empresa cliente. Quem ainda não é cliente não precisa saber quem é quem internamente. Bruno foi enfático em 2026-04-28 ao corrigir o prompt da Limonete, que estava citando "Bruno" e "Amanda" antes mesmo de qualificar o lead.

**How to apply:** quando construir o configurador da Fase 2 (entrevista que gera o agente do cliente), essa regra entra como default no system prompt gerado, junto com as outras regras absolutas (sem markdown, sem travessão, uma pergunta por vez, ritmo humano). Quando ajustar prompt de qualquer agente CitraChat, conferir que não tem nome próprio em lugar nenhum — nem na introdução, nem na hora de encaminhar, nem em exemplos.
