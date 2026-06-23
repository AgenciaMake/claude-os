import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { getClientByBriefingCode } from '../_lib/firestore-client.js';

export async function onRequestPost({ request, env }) {
  try {
    const { code } = await request.json();

    if (!code || !/^MK-[A-Z0-9]{5}$/.test(code)) {
      return json({ valid: false, error: 'Código inválido.' }, 400);
    }

    const client = await getClientByBriefingCode(
      null,
      env.FIREBASE_PROJECT_ID,
      env.FIREBASE_DB_NAME,
      env.FIREBASE_TENANT_ID,
      code
    );

    if (!client) {
      return json({ valid: false, error: 'Código não encontrado.' }, 404);
    }

    if (client.briefingStatus === 'concluído') {
      return json({ valid: false, error: 'Esse briefing já foi concluído.' }, 409);
    }

    return json({
      valid: true,
      client: {
        code: client.briefingCode || code,
        name: client.name,
        services: client.services || '',
        responsible: client.responsible || '',
        firestoreId: client.clientId || client._id,
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
