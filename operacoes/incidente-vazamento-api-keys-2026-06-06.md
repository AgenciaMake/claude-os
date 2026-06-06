# Incidente de Segurança — Vazamento de Chaves de API
**Data:** 06 de junho de 2026
**Severidade:** Alta
**Status:** Resolvido

---

## O que aconteceu

Na madrugada de 05 para 06 de junho de 2026, entre 01h e 03h UTC (02h–04h horário de Lisboa), foram detectados consumos anômalos na conta Anthropic da MakeLemonAd. O consumo chegou a aproximadamente 1,2 milhão de tokens em uma única hora, utilizando modelos Opus (claude-opus-4-6, claude-opus-4-7, claude-opus-4-8) — modelos que nunca foram usados em nenhum código da empresa.

O custo estimado desse consumo foi de aproximadamente **$8 USD** em uma única madrugada. Padrão similar havia ocorrido em noites anteriores.

---

## Causa raiz

O CitraDesk (ferramenta interna de gestão da agência, hospedada no Cloudflare Pages) foi desenvolvido com chamadas diretas à API da Anthropic e da Google Gemini **a partir do browser do usuário**.

Em aplicações Vite (framework usado no CitraDesk), qualquer variável de ambiente com prefixo `VITE_` é **embutida diretamente no bundle JavaScript público** da aplicação. Isso significa que qualquer pessoa que acesse o site e inspecione o código-fonte consegue ler a chave de API em texto claro.

### Arquivos afetados

- `services/claudeService.ts` — usava `import.meta.env.VITE_ANTHROPIC_API_KEY` com `dangerouslyAllowBrowser: true`
- `services/geminiService.ts` — usava `import.meta.env.VITE_GEMINI_API_KEY`

### Chaves expostas

| Chave | Serviço | Como foi exposta |
|---|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic Claude API | Bundle JS público do CitraDesk (Cloudflare Pages) |
| `VITE_GEMINI_API_KEY` | Google Gemini API | Bundle JS público do CitraDesk (Cloudflare Pages) |

---

## O que foi consumido

Conforme visualizado no console da Anthropic (console.anthropic.com → Usage):

| Modelo | Tokens consumidos | Observação |
|---|---|---|
| claude-opus-4-6 | ~418.000 | Nunca usado no nosso código |
| claude-opus-4-8 | ~250.000 | Nunca usado no nosso código |
| claude-opus-4-7 | ~237.000 | Nunca usado no nosso código |
| claude-sonnet-4-6 | ~301.000 | Pode incluir uso legítimo do CitraChat |
| claude-haiku-4-5 | ~8.000 | Uso normal do CitraChat |

O consumo de Opus é 100% abusivo — alguém extraiu a chave do bundle do CitraDesk e utilizou os modelos mais caros da Anthropic às expensas da conta da MakeLemonAd.

---

## Como foi descoberto

Bruno identificou o consumo elevado ao verificar o saldo da conta Anthropic e notar queda de aproximadamente $8 USD sem justificativa no uso dos produtos. Ao abrir o gráfico de uso no console Anthropic, os modelos Opus apareceram com consumo massivo na janela de 01h–03h UTC.

---

## Ações tomadas

1. **Revogação da chave Anthropic comprometida** — chave `citradesk-dev` revogada no console Anthropic. Nova chave criada.
2. **Atualização do secret no GitHub** — `VITE_ANTHROPIC_API_KEY` atualizado no repositório `AgenciaMake/citradesk`.
3. **Redeploy do CitraDesk** — push forçado no branch `main` do citradesk para triggerar o GitHub Actions e gerar novo bundle com a nova chave.
4. **Deleção da chave Gemini** — "Generative Language API Key" deletada no Google Cloud Console, projeto CitraDesk (`gen-lang-client-0548502624`).
5. **Remoção do secret Gemini do GitHub** — `VITE_GEMINI_API_KEY` não existia como secret (nunca chegou a ser adicionado ao repositório, apenas ao `.env.local` local).

---

## O que NÃO foi afetado

- **CitraChat** (`citrachat-dev`) — chave Anthropic usada exclusivamente server-side no Vercel. Nunca exposta ao browser. Não comprometida.
- **Supabase** — anon key é intencionalmente pública; service role key é server-side only.
- **Resend** — server-side only no CitraChat.
- **Firebase keys** — intencionalmente públicas por design do Firebase; segurança gerenciada via Firestore Rules.

---

## Vulnerabilidade pendente (não resolvida)

O CitraDesk ainda chama a API da Anthropic diretamente do browser com `dangerouslyAllowBrowser: true`. A nova chave foi rotacionada, mas continua igualmente exposta no bundle público enquanto essa arquitetura não for corrigida.

**Solução definitiva:** mover as chamadas de IA do CitraDesk para uma função server-side (Cloudflare Worker ou Firebase Function) que funcione como proxy. O browser chama o proxy, o proxy chama a Anthropic com a chave guardada server-side. A chave nunca chega ao browser.

Essa correção deve ser priorizada antes do CitraDesk ser expandido ou compartilhado com outros usuários.

---

## Lição aprendida

Variáveis de ambiente com prefixo `VITE_` em projetos Vite são públicas por definição. Nunca usar esse prefixo para chaves de API de serviços pagos (Anthropic, OpenAI, Google Gemini, Stripe, etc.). Apenas Firebase e serviços que explicitamente disponibilizam chaves públicas (como Supabase anon key) devem ir para o bundle do browser.
