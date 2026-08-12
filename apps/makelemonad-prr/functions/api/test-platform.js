import { verifyToken } from './auth.js'

const INTEGRATION_IDS = {
  meta:     { id: 'facebook_ads',  fields: ['spend'],                   dataView: null },
  linkedin: { id: 'linkedin_ads',  fields: ['costInLocalCurrency'],      dataView: 'campaign' },
  google:   { id: 'google_ads',    fields: ['metrics.cost_micros'],      dataView: 'campaign' },
  tiktok:   { id: 'tiktok_ads',   fields: ['spend'],                    dataView: null },
}

function cors(res) {
  const h = new Headers(res.headers)
  h.set('Access-Control-Allow-Origin', '*')
  h.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return new Response(res.body, { status: res.status, headers: h })
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }})
}

export async function onRequestGet(context) {
  const { request, env } = context
  const user = await verifyToken((request.headers.get('Authorization') || '').replace('Bearer ', ''), env.JWT_SECRET)
  if (!user) return cors(Response.json({ ok: false, error: 'Não autorizado' }, { status: 401 }))

  if (!env.REPORT_NINJA_TOKEN) {
    return cors(Response.json({ ok: false, error: 'REPORT_NINJA_TOKEN não configurado neste projeto Cloudflare' }))
  }

  const url = new URL(request.url)
  const platform = url.searchParams.get('platform')
  const connection_key = url.searchParams.get('connection_key')
  const account_id = url.searchParams.get('account_id')

  if (!platform || !connection_key || !account_id) {
    return cors(Response.json({ ok: false, error: 'Faltam parâmetros: platform, connection_key, account_id' }))
  }

  const integ = INTEGRATION_IDS[platform]
  if (!integ) return cors(Response.json({ ok: false, error: `Plataforma desconhecida: ${platform}` }))

  const today = new Date()
  const end = today.toISOString().slice(0, 10)
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - 7)
  const start = startDate.toISOString().slice(0, 10)

  const body = {
    integration_id: integ.id,
    connection_key,
    account_id,
    fields: integ.fields,
    date_range: { preset: 'custom', start, end },
    limit: 100
  }
  if (integ.dataView) body.data_view = integ.dataView

  try {
    const r = await fetch('https://api.reportingninja.com/v1/query', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${env.REPORT_NINJA_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    const data = await r.json()
    if (!r.ok) return cors(Response.json({ ok: false, error: data.message || `HTTP ${r.status}` }))
    const rows = (data.rows || []).length
    return cors(Response.json({ ok: true, rows, message: `Conexão OK — ${rows} linha(s) retornadas` }))
  } catch (e) {
    return cors(Response.json({ ok: false, error: e.message }))
  }
}
