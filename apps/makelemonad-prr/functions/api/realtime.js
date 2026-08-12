import { verifyToken } from './auth.js'

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return new Response(response.body, { status: response.status, headers })
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }})
}

async function queryNinja(token, body) {
  const r = await fetch('https://api.reportingninja.com/v1/query', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) return null
  return r.json()
}

export async function onRequestGet(context) {
  const { request, env } = context
  const user = await verifyToken((request.headers.get('Authorization') || '').replace('Bearer ', ''), env.JWT_SECRET)
  if (!user) return cors(Response.json({ error: 'Não autorizado' }, { status: 401 }))

  const url = new URL(request.url)
  const start = url.searchParams.get('start') || new Date().toISOString().slice(0, 7) + '-01'
  const end   = url.searchParams.get('end')   || new Date().toISOString().slice(0, 10)

  if (!env.REPORT_NINJA_TOKEN) {
    return cors(Response.json({ meta: null, linkedin: null, google: null, error: 'REPORT_NINJA_TOKEN não configurado' }))
  }

  // Read platform credentials from plan config (stored in KV as mes:config)
  const planConfig = await env.PRR_DATA.get('mes:config', 'json') || {}
  const platCfg = planConfig.plataformas_config || {}
  const activePlats = planConfig.plataformas || ['meta', 'linkedin']

  const dateRange = { preset: 'custom', start, end }
  const attr = 'ATTRIBUTION_MODEL_VIEW_CLICK###VIEW_ATTRIBUTION_WINDOW_1D###CLICK_ATTRIBUTION_WINDOW_7D'

  const queries = {}

  if (activePlats.includes('meta')) {
    const mc = platCfg.meta || { connection_key: 'brunomdois@gmail.com', account_id: '2364073693796998' }
    if (mc.connection_key && mc.account_id) {
      queries.meta = queryNinja(env.REPORT_NINJA_TOKEN, {
        integration_id: 'facebook_ads',
        connection_key: mc.connection_key,
        account_id: mc.account_id,
        fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'reach', 'daily_budget'],
        date_range: dateRange,
        limit: 5000,
        settings: { attribution_window: attr }
      })
    }
  }

  if (activePlats.includes('linkedin')) {
    const lc = platCfg.linkedin || { connection_key: '7YTLMHaQPL', account_id: '514458905' }
    if (lc.connection_key && lc.account_id) {
      queries.linkedin = queryNinja(env.REPORT_NINJA_TOKEN, {
        integration_id: 'linkedin_ads',
        connection_key: lc.connection_key,
        account_id: lc.account_id,
        data_view: 'campaign',
        fields: ['campaignName', 'costInLocalCurrency', 'impressions', 'clicks', 'avgCTR', 'avgCPM'],
        date_range: dateRange,
        limit: 5000
      })
    }
  }

  if (activePlats.includes('google')) {
    const gc = platCfg.google || {}
    if (gc.connection_key && gc.account_id) {
      queries.google = queryNinja(env.REPORT_NINJA_TOKEN, {
        integration_id: 'google_ads',
        connection_key: gc.connection_key,
        account_id: gc.account_id,
        data_view: 'campaign',
        fields: ['campaign.name', 'metrics.cost_micros', 'metrics.impressions', 'metrics.clicks', 'metrics.ctr', 'campaign.start_date_time', 'campaign_budget.amount_micros'],
        date_range: dateRange,
        limit: 5000
      })
    }
  }

  if (activePlats.includes('tiktok')) {
    const tc = platCfg.tiktok || {}
    if (tc.connection_key && tc.account_id) {
      queries.tiktok = queryNinja(env.REPORT_NINJA_TOKEN, {
        integration_id: 'tiktok_ads',
        connection_key: tc.connection_key,
        account_id: tc.account_id,
        fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'ctr', 'cpm'],
        date_range: dateRange,
        limit: 5000
      })
    }
  }

  const keys = Object.keys(queries)
  const results = await Promise.all(Object.values(queries))
  const out = {}
  keys.forEach((k, i) => { out[k] = results[i] })

  return cors(Response.json(out))
}
