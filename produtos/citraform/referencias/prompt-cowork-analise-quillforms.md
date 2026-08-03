# Prompt para Claude Cowork — análise ao vivo do Quill Forms

Copie o texto abaixo e cole no Cowork com o navegador aberto no wp-admin do site da MakeLemonAd (plugin Quill Forms).

---

Você vai analisar o plugin **Quill Forms** instalado no WordPress da MakeLemonAd (wp-admin → Quill Forms). Este é o form builder que a agência usa hoje pra captar e qualificar leads, e serve de referência pra um novo produto SaaS chamado CitraForm que a Make está construindo. Já existe um mapeamento inicial baseado em screenshots estáticos, mas ficaram pontos em aberto que só dá pra confirmar navegando na ferramenta ao vivo, com dados reais.

Sua tarefa: navegar pela ferramenta e responder, com o máximo de detalhe e prints/trechos de tela relevantes, as perguntas abaixo. Não invente nada — se não conseguir confirmar algo, diga explicitamente que não achou.

## O que investigar

1. **Formulário "Make Social"** — abra esse formulário e confirme: qual é o canal de distribuição real dele hoje (aba Share)? É link direto, embed em alguma página do site, ou usado em anúncio? Dá pra ver isso em algum lugar (histórico, UTM configurados, ou perguntando ao usuário se souber)?

2. **Lógica de pontuação (Score) completa** — abra a aba de Calculator/Score de cada pergunta do formulário "Make Social" (não só a de faturamento) e liste: quais perguntas dão pontos, quantos pontos cada opção de resposta vale, qual é a pontuação máxima somando tudo, e qual é exatamente a condição de "lead qualificado" configurada na notificação por e-mail (aba de notificações → condição). Copie a condição exata, não resuma.

3. **Auto redirect da Thank You Screen** — na aba Design/configuração da(s) Thank You Screen do formulário "Make Social", qual é a URL completa de redirect configurada e qual o delay em segundos? (Nos prints antigos aparecia cortada como `https://makelemonad.com.br/back_to_...` e delay 0 segundos.)

4. **Restrição de domínios de e-mail** — no campo de e-mail do formulário "Make Social", a opção "Restrict Email Domains" está ativa em produção (formulário publicado) ou só configurada no rascunho/editor? Quais domínios estão bloqueados/permitidos exatamente?

5. **Outros formulários da conta** — abra a lista completa de formulários (All Forms) e, pra cada um destes, anote rapidamente do que se trata e se usa lógica condicional/pontuação: "Make Dev", "Make 360 embed", "MakeLemonAd Embed", "Quero Leads Qualificados", "Make Leads Qualificados". Não precisa mapear a fundo cada um, só um resumo de 1-2 linhas por formulário.

6. **Recursos PRO** — Save & Continue, Form Locker, Geolocation, Custom Fonts, Partial Form Submissions — algum desses já foi ativado/usado de fato em algum formulário publicado (não só visto no editor), ou estão todos inativos hoje?

7. **Temas cadastrados** — na biblioteca de temas, liste todos os temas existentes ("Make 001", "New Make", "Incorporara pg Cap Leads" e qualquer outro) e, se der pra identificar, qual formulário usa qual tema.

8. **Integração Quill CRM** — o card de integração "Quill CRM" aparece como conectado ou não conectado nos formulários? Se conectado, dá pra ver pra onde os dados vão (algum painel do CRM interno)? Se não, os leads capturados hoje vão só por e-mail de notificação, ou tem outro destino (planilha, Zapier, etc.) configurado em algum formulário?

9. **Pagamentos** — em qualquer formulário da conta, o toggle "Enable Payments" está ativo em algum deles, com algum gateway instalado e configurado? Se sim, qual formulário e qual gateway.

10. **Qualquer coisa que fuja do que foi listado acima e pareça relevante** — se encontrar alguma funcionalidade, configuração ou fluxo que não está nesta lista mas parece importante pro Bruno decidir o que replicar no CitraForm, documente também.

## Formato do relatório final

Organize a resposta numerada igual as perguntas acima (1 a 10), com o que foi encontrado em cada uma. Onde não for possível confirmar algo, diga isso claramente em vez de supor.
