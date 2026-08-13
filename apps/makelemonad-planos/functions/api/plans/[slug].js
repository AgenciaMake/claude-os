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

async function editorOnly(request, env) {
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '')
  const user = await verifyToken(token, env.JWT_SECRET)
  if (!user || user.role !== 'editor') return null
  return user
}

// GET /api/plans/:slug — retorna credenciais do plano
export async function onRequestGet(context) {
  const { request, env, params } = context
  const user = await editorOnly(request, env)
  if (!user) return cors(Response.json({ error: 'Acesso restrito à agência' }, { status: 403 }))

  const plans = await env.PRR_DATA.get('plans:index', 'json') || []
  const plan = plans.find(p => p.slug === params.slug)
  if (!plan) return cors(Response.json({ error: 'Plano não encontrado' }, { status: 404 }))

  return cors(Response.json({
    slug: plan.slug,
    cliente: plan.cliente,
    email_cliente: plan.email_cliente || '',
    senha_cliente: plan.senha_cliente || '',
  }))
}

// PUT /api/plans/:slug — atualiza email e senha do cliente
export async function onRequestPut(context) {
  const { request, env, params } = context
  const user = await editorOnly(request, env)
  if (!user) return cors(Response.json({ error: 'Acesso restrito à agência' }, { status: 403 }))

  const body = await request.json()
  const plans = await env.PRR_DATA.get('plans:index', 'json') || []
  const idx = plans.findIndex(p => p.slug === params.slug)
  if (idx === -1) return cors(Response.json({ error: 'Plano não encontrado' }, { status: 404 }))

  if (body.email_cliente !== undefined) plans[idx].email_cliente = body.email_cliente
  if (body.senha_cliente !== undefined && body.senha_cliente !== '') plans[idx].senha_cliente = body.senha_cliente

  await env.PRR_DATA.put('plans:index', JSON.stringify(plans))
  return cors(Response.json({ ok: true }))
}
