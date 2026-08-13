import { verifyToken } from '../auth.js'

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return new Response(response.body, { status: response.status, headers })
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }})
}

async function getAuth(request, env) {
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '')
  if (!token) return null
  return verifyToken(token, env.JWT_SECRET)
}

// Lazy migration: se a chave nova não existe, tenta a chave antiga e migra
async function getWithMigration(env, newKey, oldKey) {
  let data = await env.PRR_DATA.get(newKey, 'json')
  if (data !== null) return data
  const legacy = await env.PRR_DATA.get(oldKey, 'json')
  if (legacy !== null) {
    await env.PRR_DATA.put(newKey, JSON.stringify(legacy))
    return legacy
  }
  return null
}

export async function onRequestGet(context) {
  const { request, env, params } = context
  const user = await getAuth(request, env)
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))

  const mes = params.mes
  const url = new URL(request.url)
  const planSlug = url.searchParams.get('plan') || user.planSlug || 'prr'

  // Viewers só podem acessar o seu plano
  if (user.role === 'viewer' && user.planSlug && user.planSlug !== planSlug) {
    return cors(Response.json({ error: 'Acesso negado' }, { status: 403 }))
  }

  const newKey = `plan:${planSlug}:mes:${mes}`
  const oldKey = mes === 'config' ? 'mes:config' : `mes:${mes}`
  const data = await getWithMigration(env, newKey, oldKey)
  return cors(Response.json(data || { campanhas: [], config: {} }))
}

export async function onRequestPut(context) {
  const { request, env, params } = context
  const user = await getAuth(request, env)
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))
  if (user.role !== 'editor') return cors(Response.json({ error: 'Sem permissão de edição' }, { status: 403 }))

  const mes = params.mes
  const url = new URL(request.url)
  const planSlug = url.searchParams.get('plan') || 'prr'

  const body = await request.json()
  await env.PRR_DATA.put(`plan:${planSlug}:mes:${mes}`, JSON.stringify(body))
  return cors(Response.json({ ok: true }))
}
