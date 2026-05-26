// Firestore REST API client para Cloudflare Workers
// Autentica via Google Service Account (mesmo token usado pra Sheets/Drive)
// Documentação: https://firebase.google.com/docs/firestore/reference/rest

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1';

// Converte um documento Firestore (formato REST) em objeto JS plano
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

// Busca um cliente pelo campo briefingCode na coleção tenants/{tenantId}/clients
export async function getClientByBriefingCode(token, projectId, dbName, tenantId, code) {
  const parent = `projects/${projectId}/databases/${dbName}/documents/tenants/${tenantId}/clients`;
  const url = `${FIRESTORE_BASE}/projects/${projectId}/databases/${dbName}/documents:runQuery`;

  const body = {
    structuredQuery: {
      from: [{ collectionId: 'clients' }],
      where: {
        compositeFilter: {
          op: 'AND',
          filters: [
            {
              fieldFilter: {
                field: { fieldPath: 'briefingCode' },
                op: 'EQUAL',
                value: { stringValue: code },
              },
            },
          ],
        },
      },
      limit: 1,
    },
    parent: `projects/${projectId}/databases/${dbName}/documents/tenants/${tenantId}`,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await res.json();

  if (!res.ok) {
    throw new Error(`Firestore query error: ${JSON.stringify(results)}`);
  }

  const match = results.find(r => r.document);
  if (!match) return null;

  return firestoreDocToObject(match.document);
}
