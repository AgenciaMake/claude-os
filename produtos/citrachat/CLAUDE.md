# CitraChat — contexto para sessões abertas direto nesta pasta

Esta pasta faz parte do workspace `ccos-make`. Se esta sessão do Claude Code foi aberta
diretamente aqui (em vez de na raiz do workspace), o sistema trata isso como um projeto
separado, com memória própria e vazia — o que quebra a continuidade com o resto do
trabalho já feito no CitraChat.

Para não perder contexto, seguir sempre:

## Ao iniciar a sessão

1. Ler [CITRACHAT.md](CITRACHAT.md) — briefing mestre do produto.
2. Ler as memórias do CitraChat na pasta central do workspace (caminho absoluto, funciona
   independente de qual projeto esta sessão pertence):
   `/Users/brunomartins/.claude/projects/-Users-brunomartins-Desktop-CCode-ccos-make/memory/`
   — em especial qualquer arquivo com `citrachat` no nome (`citrachat_estado_atual.md`,
   `citrachat_benchmark_concorrentes.md`, `citrachat_infra.md`, `citrachat_whatsapp_integracao.md`,
   `citrachat_mapa_disparos.md`, `feedback_citrachat_*.md`, etc.) e o índice
   `/Users/brunomartins/.claude/projects/-Users-brunomartins-Desktop-CCode-ccos-make/memory/MEMORY.md`.
3. Checar `_memoria_pendente/` na raiz do workspace (`/Users/brunomartins/Desktop/CCode/ccos-make/_memoria_pendente/`)
   por snapshots não consumidos de `citrachat_*`.

## Ao salvar memória nova

Escrever os arquivos de memória sempre na pasta central acima
(`.../ccos-make/memory/`), nunca na pasta de memória local desta sessão — mesmo que o
sistema aponte outro caminho por padrão. Isso mantém uma única fonte de verdade para o
CitraChat, acessível de qualquer pasta que a sessão for aberta.

## Trabalho de código

Fica em [codigo/](codigo/) — repo git real (`AgenciaMake/citrachat`), branch de produção
`plataforma`. `codigo/CLAUDE.md` importa `AGENTS.md`, com instruções técnicas do repo.

## Restrição de modelo

Mesma regra do workspace: Opus proibido. Chat público usa Haiku 4.5, treino/análise usa
Sonnet 4.6 — fixos, não atualizar sem aprovação explícita do Bruno.
