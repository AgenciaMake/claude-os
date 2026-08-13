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
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }})
}

async function editorOnly(request, env) {
  const token = (request.headers.get('Authorization') || '').replace('Bearer ', '')
  const user = await verifyToken(token, env.JWT_SECRET)
  if (!user || user.role !== 'editor') return null
  return user
}

// GET /api/plans — lista todos os planos
export async function onRequestGet(context) {
  const { request, env } = context
  const user = await editorOnly(request, env)
  if (!user) return cors(Response.json({ error: 'Acesso restrito à agência' }, { status: 403 }))

  const plans = await env.PRR_DATA.get('plans:index', 'json') || []

  // Para cada plano, tenta carregar o config para exibir nome/cliente
  const enriched = await Promise.all(plans.map(async p => {
    const cfg = await env.PRR_DATA.get(`plan:${p.slug}:mes:config`, 'json') || {}
    return { ...p, cliente: cfg.cliente || p.cliente || p.slug, moeda: cfg.moeda || 'EUR' }
  }))

  return cors(Response.json({ plans: enriched }))
}

// POST /api/plans — criar novo plano
export async function onRequestPost(context) {
  const { request, env } = context
  const user = await editorOnly(request, env)
  if (!user) return cors(Response.json({ error: 'Acesso restrito à agência' }, { status: 403 }))

  const body = await request.json()
  const { slug, cliente, email_cliente, senha_cliente, moeda, periodo_inicio, periodo_fim } = body

  if (!slug || !cliente) {
    return cors(Response.json({ error: 'slug e cliente são obrigatórios' }, { status: 400 }))
  }

  // Slug: apenas letras, números e hífens
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return cors(Response.json({ error: 'Slug inválido — use apenas letras minúsculas, números e hífens' }, { status: 400 }))
  }

  // Verifica duplicidade
  const plans = await env.PRR_DATA.get('plans:index', 'json') || []
  if (plans.find(p => p.slug === slug)) {
    return cors(Response.json({ error: `Plano com slug "${slug}" já existe` }, { status: 409 }))
  }

  // Cria o config do plano
  const planConfig = {
    cliente,
    agencia: 'MakeLemonAd',
    moeda: moeda || 'EUR',
    periodo_inicio: periodo_inicio || '',
    periodo_fim: periodo_fim || '',
    plataformas: ['meta', 'linkedin'],
    plataformas_config: {},
    tipo_orcamento: 'mensal_variavel',
    orcamento_mensal_base: 0,
    orcamento_anual: 0,
    orcamentos_mensais: {},
    verba_seguranca: 0,
    verba_seguranca_por_mes: false,
    verbas_mensais: {},
  }
  await env.PRR_DATA.put(`plan:${slug}:mes:config`, JSON.stringify(planConfig))

  // Adiciona ao índice
  const newPlan = { slug, cliente, email_cliente: email_cliente || '', senha_cliente: senha_cliente || '', criado_em: new Date().toISOString() }
  plans.push(newPlan)
  await env.PRR_DATA.put('plans:index', JSON.stringify(plans))

  return cors(Response.json({ ok: true, slug }))
}
