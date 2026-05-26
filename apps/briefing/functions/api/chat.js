import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { getClientByBriefingCode } from '../_lib/firestore-client.js';
import { buildSystemPrompt } from '../_lib/prompt.js';
import { saveBriefingDoc } from '../_lib/save-doc.js';
import { analyzeUrls } from '../_lib/site-fetch.js';

const DONE_MARKER = '<<BRIEFING_CONCLUIDO>>';

export async function onRequestPost({ request, env }) {
  try {
    const { code, messages } = await request.json();

    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);
    const client = await getClientByBriefingCode(
      token,
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
    const clientData = {
      name: client.name,
      services: (client.services || []).join(', '),
      responsible: client.contacts?.[0]?.name || '',
      firestoreId: client._id,
      contractSummary: client.contractSummary || null,
      alfredNotes: client.alfredNotes || null,
    };

    const systemPrompt = buildSystemPrompt(clientData);

    // Enriquece última mensagem do usuário com contexto de URLs se houver
    let enrichedMessages = messages;
    if (messages.length > 0) {
      const last = messages[messages.length - 1];
      if (last.role === 'user') {
        const siteContext = await analyzeUrls(last.content);
        if (siteContext) {
          enrichedMessages = [
            ...messages.slice(0, -1),
            { ...last, content: last.content + '\n\n' + siteContext },
          ];
        }
      }
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
      console.error('Claude API error:', apiData);
      return json({ error: 'Erro ao processar. Tente novamente.' }, 500);
    }

    const reply = apiData.content?.[0]?.text || '';
    const done = reply.includes(DONE_MARKER);
    const cleanReply = reply.replace(DONE_MARKER, '').trim();

    if (done) {
      const finalMessages = [...messages, { role: 'assistant', content: cleanReply }];
      const saved = await saveBriefingDoc(token, env, clientData, finalMessages);
      const docUrl = saved?.docId ? `https://docs.google.com/document/d/${saved.docId}/edit` : null;
      await markBriefingComplete(token, env, client._id, env.FIREBASE_TENANT_ID, docUrl, saved?.briefingText || null);
    }

    return json({ message: cleanReply, done });
  } catch (err) {
    console.error(err);
    return json({ error: 'Erro interno: ' + err.message }, 500);
  }
}

async function markBriefingComplete(token, env, clientId, tenantId, docUrl, briefingSummary) {
  const fields = {
    briefingStatus: { stringValue: 'concluído' },
    briefingCompletedAt: { stringValue: new Date().toISOString() },
  };
  if (docUrl) fields.briefingDocUrl = { stringValue: docUrl };
  if (briefingSummary) fields.briefingSummary = { stringValue: briefingSummary };

  const masks = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
  const url = `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/${env.FIREBASE_DB_NAME}/documents/tenants/${tenantId}/clients/${clientId}?${masks}`;

  await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  });
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
