import { verifyToken } from './auth.js'

const INTEGRATION_IDS = {
  meta:     'facebook_ads',
  linkedin: 'linkedin_ads',
  google:   'google_ads',
  tiktok:   'tiktok_ads',
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
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))

  if (!env.REPORT_NINJA_TOKEN) {
    return cors(Response.json({ error: 'REPORT_NINJA_TOKEN não configurado', accounts: [] }))
  }

  const url = new URL(request.url)
  const platform = url.searchParams.get('platform')
  const integration_id = INTEGRATION_IDS[platform]
  if (!integration_id) {
    return cors(Response.json({ error: `Plataforma desconhecida: ${platform}`, accounts: [] }))
  }

  try {
    const r = await fetch(`https://api.reportingninja.com/v1/connections?integration_id=${integration_id}`, {
      headers: { 'Authorization': `Bearer ${env.REPORT_NINJA_TOKEN}` }
    })

    if (!r.ok) {
      const err = await r.text()
      return cors(Response.json({ error: `Report Ninja: ${r.status} — ${err}`, accounts: [] }))
    }

    const data = await r.json()
    // Flatten connections → accounts with label "Nome da Conta (currency) [connection]"
    const accounts = []
    const connections = data.connections || data.data || []
    connections.forEach(conn => {
      const ck = conn.connection_key
      const connName = conn.connection_name || ck
      ;(conn.accounts || []).forEach(acc => {
        accounts.push({
          connection_key: ck,
          account_id: acc.account_id,
          label: `${acc.account_name} · ${acc.currency}`,
          connection_name: connName,
        })
      })
    })

    return cors(Response.json({ accounts }))
  } catch (e) {
    return cors(Response.json({ error: e.message, accounts: [] }))
  }
}
