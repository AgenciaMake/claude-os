import { getGoogleAccessToken } from '../_lib/google-auth.js';

export async function onRequestPost({ request, env }) {
  try {
    const { code } = await request.json();

    if (!code || !/^MK-[A-Z0-9]{5}$/.test(code)) {
      return json({ valid: false, error: 'Código inválido.' }, 400);
    }

    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);

    const sheetId = env.SHEET_ID;
    const range = 'A2:J1000';

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = await res.json();
    const rows = data.values || [];

    const row = rows.find(r => r[0] === code);

    if (!row) {
      return json({ valid: false, error: 'Código não encontrado.' }, 404);
    }

    if (row[4] === 'concluído') {
      return json({ valid: false, error: 'Esse briefing já foi concluído.' }, 409);
    }

    return json({
      valid: true,
      client: {
        code: row[0],
        name: row[1],
        number: row[2],
        services: row[3],
        responsible: row[7],
      },
    });
  } catch (err) {
    return json({ valid: false, error: 'Erro interno: ' + err.message }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
