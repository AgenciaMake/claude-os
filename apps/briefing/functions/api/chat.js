import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { getClientByBriefingCode, markBriefingCompleteLookup, getBriefingNotificationEmails } from '../_lib/firestore-client.js';
import { buildSystemPrompt } from '../_lib/prompt.js';
import { saveBriefingDoc } from '../_lib/save-doc.js';
import { analyzeUrls } from '../_lib/site-fetch.js';
import { validatePhoneNumbers } from '../_lib/phone-validate.js';
import { sendBriefingCompletionEmail } from '../_lib/send-email.js';

const DONE_MARKER = '<<BRIEFING_CONCLUIDO>>';

export async function onRequestPost({ request, env }) {
  try {
    const { code, messages } = await request.json();

    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);
    const client = await getClientByBriefingCode(
      null,
      env.FIREBASE_PROJECT_ID,
      env.FIREBASE_DB_NAME,
      env.FIREBASE_TENANT_ID,
      code
    );

    if (!client) {
      return json({ error: 'Código inválido.' }, 404);
    }
    if (client.briefingStatus === 'concluído') {
      return json({ error: 'Briefing já concluído.' }, 409);
    }

    // Normaliza client para o formato esperado pelo prompt
    // services já vem como string no briefing_lookup
    // Pré-analisa site se URL estiver nas notas ou no resumo do contrato (só no início)
    let preSiteContext = null;
    if (messages.length === 0) {
      const notesText = [client.alfredNotes, client.contractSummary].filter(Boolean).join(' ');
      preSiteContext = await analyzeUrls(notesText);
    }

    const clientData = {
      name: client.name,
      services: client.services || '',
      responsible: client.responsible || '',
      contacts: client.contacts || '',
      firestoreId: client.clientId || client._id,
      contractSummary: client.contractSummary || null,
      alfredNotes: client.alfredNotes || null,
      preSiteContext: preSiteContext || null,
    };

    const systemPrompt = buildSystemPrompt(clientData);

    // Enriquece última mensagem do usuário com contexto de URLs se houver
    let enrichedMessages = messages;
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'user') {
        const siteContext = await analyzeUrls(last.content);
        const phoneContext = validatePhoneNumbers(last.content);
        const extra = [siteContext, phoneContext].filter(Boolean).join('\n');
        if (extra) {
          enrichedMessages = [
            ...messages.slice(0, -1),
            { ...last, content: last.content + '\n\n' + extra },
          ];
        }
      }
    }

    // Atalho de teste: conclui o briefing imediatamente sem chamar a API
    const lastMsg = enrichedMessages.length > 0 ? enrichedMessages[enrichedMessages.length - 1] : null;
    if (lastMsg?.role === 'user' && lastMsg.content.includes('#make-test-done')) {
      const fakeReply = 'Perfeito, vou encerrar o briefing por aqui. Obrigado pelo tempo e pelas informações. A equipe da Make vai revisar tudo e entrar em contato com os próximos passos. ' + DONE_MARKER;
      const finalMessages = [...messages.slice(0, -1), { role: 'user', content: '#make-test-done' }, { role: 'assistant', content: fakeReply.replace(DONE_MARKER, '').trim() }];
      const saved = await saveBriefingDoc(token, env, clientData, finalMessages);
      const docUrl = saved?.docId ? `https://docs.google.com/document/d/${saved.docId}/edit` : null;
      await markBriefingCompleteLookup(env.FIREBASE_PROJECT_ID, env.FIREBASE_DB_NAME, env.FIREBASE_TENANT_ID, code, docUrl, saved?.briefingText || null);
      if (env.RESEND_API_KEY) {
        const notifEmails = await getBriefingNotificationEmails(env.FIREBASE_PROJECT_ID, env.FIREBASE_DB_NAME, env.FIREBASE_TENANT_ID);
        await sendBriefingCompletionEmail(env.RESEND_API_KEY, notifEmails, clientData.name, docUrl, saved?.briefingText || null);
      }
      return json({ message: fakeReply.replace(DONE_MARKER, '').trim(), done: true });
    }

    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: enrichedMessages.length === 0
          ? [{ role: 'user', content: 'Início da conversa. Se apresente e comece a entrevista.' }]
          : enrichedMessages,
      }),
    });

    const apiData = await apiRes.json();

    if (!apiRes.ok) {
      const detail = apiData?.error?.message || JSON.stringify(apiData);
      return json({ error: `Erro ao processar: ${detail}` }, 500);
    }

    const reply = apiData.content?.[0]?.text || '';
    const done = reply.includes(DONE_MARKER);
    const cleanReply = reply.replace(DONE_MARKER, '').trim();

    if (done) {
      const finalMessages = [...messages, { role: 'assistant', content: cleanReply }];
      const saved = await saveBriefingDoc(token, env, clientData, finalMessages);
      const docUrl = saved?.docId ? `https://docs.google.com/document/d/${saved.docId}/edit` : null;
      await markBriefingCompleteLookup(
        env.FIREBASE_PROJECT_ID,
        env.FIREBASE_DB_NAME,
        env.FIREBASE_TENANT_ID,
        code,
        docUrl,
        saved?.briefingText || null,
      );
      if (env.RESEND_API_KEY) {
        const notifEmails = await getBriefingNotificationEmails(env.FIREBASE_PROJECT_ID, env.FIREBASE_DB_NAME, env.FIREBASE_TENANT_ID);
        await sendBriefingCompletionEmail(env.RESEND_API_KEY, notifEmails, clientData.name, docUrl, saved?.briefingText || null);
      }
    }

    return json({ message: cleanReply, done });
  } catch (err) {
    console.error(err);
    return json({ error: 'Erro interno: ' + err.message }, 500);
  }
}


function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
