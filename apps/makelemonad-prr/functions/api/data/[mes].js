import { verifyToken } from '../auth.js'

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return new Response(response.body, { status: response.status, headers })
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } })
}

async function getAuth(request, env) {
  const auth = request.headers.get('Authorization') || ''
  const token = auth.replace('Bearer ', '')
  if (!token) return null
  return verifyToken(token, env.JWT_SECRET)
}

export async function onRequestGet(context) {
  const { request, env, params } = context
  const user = await getAuth(request, env)
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))

  const mes = params.mes
  const data = await env.PRR_DATA.get(`mes:${mes}`, 'json')
  return cors(Response.json(data || { campanhas: [], config: {} }))
}

export async function onRequestPut(context) {
  const { request, env, params } = context
  const user = await getAuth(request, env)
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))
  if (user.role !== 'editor') return cors(Response.json({ error: 'Sem permissão de edição' }, { status: 403 }))

  const mes = params.mes
  const body = await request.json()
  await env.PRR_DATA.put(`mes:${mes}`, JSON.stringify(body))
  return cors(Response.json({ ok: true }))
}
