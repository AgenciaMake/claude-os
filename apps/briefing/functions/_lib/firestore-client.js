// Firestore REST API client para Cloudflare Workers
// Lê de briefing_lookup (coleção pública, sem auth necessária)
// Escreve de volta via PATCH público para marcar briefing como concluído

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

function firestoreDocToObject(doc) {
  if (!doc || !doc.fields) return null;
  const obj = { _id: doc.name?.split('/').pop() };
  for (const [key, val] of Object.entries(doc.fields)) {
    obj[key] = parseFirestoreValue(val);
  }
  return obj;
}

function parseFirestoreValue(val) {
  if ('stringValue' in val) return val.stringValue;
  if ('integerValue' in val) return parseInt(val.integerValue, 10);
  if ('doubleValue' in val) return val.doubleValue;
  if ('booleanValue' in val) return val.booleanValue;
  if ('nullValue' in val) return null;
  if ('arrayValue' in val) return (val.arrayValue.values || []).map(parseFirestoreValue);
  if ('mapValue' in val) return firestoreDocToObject({ fields: val.mapValue.fields });
  if ('timestampValue' in val) return val.timestampValue;
  return null;
}

// Leitura pública: GET direto em briefing_lookup/{code} — sem autenticação
export async function getClientByBriefingCode(_token, projectId, dbName, tenantId, code) {
  const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/${dbName}/documents/tenants/${tenantId}/briefing_lookup/${code}`;

  const res = await fetch(url);

  if (res.status === 404) return null;

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Firestore query error: ${JSON.stringify(body)}`);
  }

  const doc = await res.json();
  if (!doc || !doc.fields) return null;

  return firestoreDocToObject(doc);
}

// O briefing_lookup tem dois formatos hoje: cliente recorrente (name, services,
// responsible, contacts, contractSummary, alfredNotes) e projeto pontual
// (type: 'project', clientName, projectName, clientServices, clientContacts,
// projectContext). Essa função normaliza os dois pro mesmo formato que o
// prompt.js espera, senão o Alfred fica sem saber o nome de quem tá falando.
export function normalizeBriefingClient(raw) {
  if (raw.type !== 'project') {
    return {
      name: raw.name || '',
      projectName: null,
      services: raw.services || '',
      responsible: raw.responsible || '',
      contacts: raw.contacts || '',
      firestoreId: raw.clientId || raw._id,
      contractSummary: raw.contractSummary || null,
      alfredNotes: raw.alfredNotes || null,
      materialsFolderId: raw.materialsFolderId || null,
    };
  }

  const contacts = Array.isArray(raw.clientContacts)
    ? raw.clientContacts.map(c => c.name).filter(Boolean).join(', ')
    : (raw.clientContact || '');

  // "responsible" é o nome que a etapa de identificação usa pra já cumprimentar
  // a pessoa (ver prompt.js). Se não tiver lista de contatos separada, o próprio
  // clientName É o contato — é uma pessoa física ou um projeto pontual com um só
  // interlocutor, então não faz sentido perguntar "com quem estou falando".
  const firstContactName = contacts ? contacts.split(', ')[0] : (raw.clientName || '');

  return {
    name: raw.clientName || raw.projectName || '',
    projectName: raw.projectName || null,
    services: Array.isArray(raw.clientServices) ? raw.clientServices.join(', ') : '',
    responsible: firstContactName,
    contacts,
    firestoreId: raw.projectId || raw._id,
    contractSummary: raw.projectContext || raw.briefingContext || null,
    alfredNotes: raw.alfredNotes || null,
    materialsFolderId: raw.materialsFolderId || null,
  };
}

// Marca briefing como concluído na briefing_lookup (coleção pública)
export async function markBriefingCompleteLookup(projectId, dbName, tenantId, code, docUrl, briefingSummary, briefingTranscript) {
  const fields = {
    briefingStatus: { stringValue: 'concluído' },
    briefingCompletedAt: { stringValue: new Date().toISOString() },
  };
  if (docUrl) fields.briefingDocUrl = { stringValue: docUrl };
  if (briefingSummary) fields.briefingSummary = { stringValue: briefingSummary };
  if (briefingTranscript) fields.briefingTranscript = { stringValue: briefingTranscript };

  const masks = Object.keys(fields).map(f => `updateMask.fieldPaths=${f}`).join('&');
  const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/${dbName}/documents/tenants/${tenantId}/briefing_lookup/${code}?${masks}`;

  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields }),
  });
}

// Busca os emails configurados para notificação de briefing concluído
export async function getBriefingNotificationEmails(projectId, dbName, tenantId) {
  const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/${dbName}/documents/tenants/${tenantId}/config/general`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const doc = await res.json();
  if (!doc || !doc.fields) return [];
  const emailsField = doc.fields.briefingNotificationEmails;
  if (!emailsField || !emailsField.arrayValue || !emailsField.arrayValue.values) return [];
  return emailsField.arrayValue.values.map(v => v.stringValue).filter(Boolean);
}
