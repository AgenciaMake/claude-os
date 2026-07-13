import { getGoogleAccessToken } from '../_lib/google-auth.js';
import { getClientByBriefingCode } from '../_lib/firestore-client.js';
import { resolveMaterialsFolderId } from '../_lib/save-doc.js';
import { buildBriefingDocx } from '../_lib/docx-builder.js';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const BOUNDARY = 'make_briefing_docx_boundary';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const { code } = await request.json();
    if (!code) return json({ error: 'Código é obrigatório.' }, 400);

    const client = await getClientByBriefingCode(
      null,
      env.FIREBASE_PROJECT_ID,
      env.FIREBASE_DB_NAME,
      env.FIREBASE_TENANT_ID,
      code
    );
    if (!client) return json({ error: 'Código inválido.' }, 404);

    const token = await getGoogleAccessToken(env.GOOGLE_SERVICE_ACCOUNT);
    const folderId = await resolveMaterialsFolderId(token, client);
    if (!folderId) return json({ error: 'Pasta do cliente não encontrada no Drive.' }, 500);

    const docxBytes = await buildBriefingDocx({
      clientName: client.name,
      services: client.services,
      summary: client.briefingSummary,
      transcript: client.briefingTranscript,
    });

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yy = String(today.getFullYear()).slice(-2);
    const slug = (client.name || 'cliente').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '');
    const fileName = `MAKE_BRIEFING_${slug}_${dd}.${mm}.${yy}.docx`;

    const metadata = { name: fileName, parents: [folderId] };
    const encoder = new TextEncoder();
    const head = encoder.encode(
      `--${BOUNDARY}\r\n` +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) + '\r\n' +
      `--${BOUNDARY}\r\n` +
      `Content-Type: ${DOCX_MIME}\r\n\r\n`
    );
    const tail = encoder.encode(`\r\n--${BOUNDARY}--`);

    const fullBody = new Uint8Array(head.length + docxBytes.byteLength + tail.length);
    fullBody.set(head, 0);
    fullBody.set(docxBytes, head.length);
    fullBody.set(tail, head.length + docxBytes.byteLength);

    const uploadRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true&fields=id,webViewLink',
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
      return json({ error: uploadData?.error?.message || 'Erro ao subir o docx pro Drive.' }, 500);
    }

    return json({ ok: true, fileName, fileId: uploadData.id, webViewLink: uploadData.webViewLink });
  } catch (err) {
    console.error(err);
    return json({ error: 'Erro interno: ' + err.message }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
