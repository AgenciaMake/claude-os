import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { buildSystemPrompt } from '../_lib/prompt.js';
import { saveBriefingDoc } from '../_lib/save-doc.js';
import { analyzeUrls } from '../_lib/site-fetch.js';

const DONE_MARKER = '<<BRIEFING_CONCLUIDO>>';

export async function onRequestPost({ request, env }) {
  try {
    const { code, messages } = await request.json();

    // Busca os dados do cliente na Sheet
    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);
    const client = await getClientByCode(token, env.SHEET_ID, code);
    if (!client) {
      return json({ error: 'Código inválido.' }, 404);
    }
    if (client.status === 'concluído') {
      return json({ error: 'Briefing já concluído.' }, 409);
    }

    // Monta o system prompt contextualizado
    const systemPrompt = buildSystemPrompt(client);

    // Se a última mensagem do usuário tem URLs, busca e injeta contexto real
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

    // Chama a Claude API
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

    // Se o briefing terminou, gera o Doc e atualiza a Sheet
    if (done) {
      const finalMessages = [
        ...messages,
        { role: 'assistant', content: cleanReply },
      ];
      await saveBriefingDoc(token, env, client, finalMessages);
      await markBriefingComplete(token, env.SHEET_ID, code, client.rowIndex);
    }

    return json({
      message: cleanReply,
      done,
    });
  } catch (err) {
    console.error(err);
    return json({ error: 'Erro interno: ' + err.message }, 500);
  }
}

async function getClientByCode(token, sheetId, code) {
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A2:J1000`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await res.json();
  const rows = data.values || [];
  const idx = rows.findIndex(r => r[0] === code);
  if (idx === -1) return null;
  const row = rows[idx];
  return {
    rowIndex: idx + 2, // 1-based + header
    code: row[0],
    name: row[1],
    number: row[2],
    services: row[3],
    status: row[4],
    responsible: row[7],
  };
}

async function markBriefingComplete(token, sheetId, code, rowIndex) {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yy = String(today.getFullYear()).slice(-2);
  const dateStr = `${dd}.${mm}.${yy}`;

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/E${rowIndex}:G${rowIndex}?valueInputOption=RAW`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [['concluído', '', dateStr]],
      }),
    }
  );
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
