import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { getClientByBriefingCode } from '../_lib/firestore-client.js';
import { resolveMaterialsFolderId } from '../_lib/save-doc.js';

const MAX_BYTES = 20 * 1024 * 1024; // 20MB
const BOUNDARY = 'make_briefing_upload_boundary';

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const code = form.get('code');
    const file = form.get('file');

    if (!code || !file || typeof file === 'string') {
      return json({ error: 'Código e arquivo são obrigatórios.' }, 400);
    }

    if (file.size > MAX_BYTES) {
      return json({ error: 'Arquivo maior que 20MB. Envie um arquivo menor.' }, 400);
    }

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

    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);
    const folderId = await resolveMaterialsFolderId(token, client);

    if (!folderId) {
      return json({ error: 'Pasta do cliente não encontrada no Drive.' }, 500);
    }

    const metadata = { name: file.name, parents: [folderId] };
    const fileBuffer = await file.arrayBuffer();

    const encoder = new TextEncoder();
    const head = encoder.encode(
      `--${BOUNDARY}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) + '\r\n' +
      `--${BOUNDARY}\r\n` +
      `Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`
    );
    const tail = encoder.encode(`\r\n--${BOUNDARY}--`);

    const fullBody = new Uint8Array(head.length + fileBuffer.byteLength + tail.length);
    fullBody.set(head, 0);
    fullBody.set(new Uint8Array(fileBuffer), head.length);
    fullBody.set(tail, head.length + fileBuffer.byteLength);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${BOUNDARY}`,
        },
        body: fullBody,
      }
    );

    const uploadData = await uploadRes.json();

    if (!uploadRes.ok) {
      return json({ error: uploadData?.error?.message || 'Erro ao subir arquivo pro Drive.' }, 500);
    }

    return json({ ok: true, fileName: file.name, fileId: uploadData.id });
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
