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

// Fetch campaign start/stop times directly from Meta Graph API
async function fetchMetaCampaignDates(graphToken, accountId) {
  if (!graphToken) return {}
  try {
    const actId = accountId.startsWith('act_') ? accountId : `act_${accountId}`
    const fields = 'name,start_time,stop_time,status'
    const url = `https://graph.facebook.com/v21.0/${actId}/campaigns?fields=${fields}&limit=500&access_token=${graphToken}`
    const r = await fetch(url)
    if (!r.ok) return {}
    const data = await r.json()
    if (!data.data) return {}
    // Build map: lowercase name → {start_time, stop_time}
    const map = {}
    const addToMap = c => {
      map[c.name.toLowerCase()] = { name: c.name, start_time: c.start_time || '', stop_time: c.stop_time || '', status: c.status || '' }
    }
    data.data.forEach(addToMap)
    // Handle pagination (up to 1 extra page)
    if (data.paging?.next) {
      const r2 = await fetch(data.paging.next)
      if (r2.ok) {
        const d2 = await r2.json()
        ;(d2.data || []).forEach(addToMap)
      }
    }
    return map
  } catch { return {} }
}

async function queryNinja(token, body) {
  const r = await fetch('https://api.reportingninja.com/v1/query', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  if (!r.ok) return { _error: `HTTP ${r.status}` }
  const data = await r.json()
  if (data.status === 'error') return { _error: data.message || 'Erro desconhecido' }
  return data
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
        fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'reach', 'daily_budget', 'effective_status'],
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
        fields: ['campaignName', 'costInLocalCurrency', 'impressions', 'clicks', 'avgCTR', 'avgCPM', 'campaignStatus'],
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
        fields: ['campaign.name', 'metrics.cost_micros', 'metrics.impressions', 'metrics.clicks', 'metrics.ctr', 'campaign.start_date_time', 'campaign.end_date_time', 'campaign_budget.amount_micros', 'campaign.status'],
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
        fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'campaign_status'],
        date_range: dateRange,
        limit: 5000
      })
    }
  }

  const keys = Object.keys(queries)
  const results = await Promise.all(Object.values(queries))
  const out = {}
  keys.forEach((k, i) => { out[k] = results[i] })

  // Enrich Meta rows with Graph API data + inject zero-spend campaigns Report Ninja omits
  if (out.meta && env.META_GRAPH_TOKEN) {
    const mc = platCfg.meta || { account_id: '2364073693796998' }
    const dateMap = await fetchMetaCampaignDates(env.META_GRAPH_TOKEN, mc.account_id)
    const rows = out.meta?.data?.rows || out.meta?.rows || []
    // Inject dates into existing rows
    rows.forEach(row => {
      const info = dateMap[(row.campaign_name || '').toLowerCase()]
      if (info) { row.start_time = info.start_time; row.stop_time = info.stop_time }
    })
    // Inject zero-spend campaigns that Report Ninja omitted (spend=0 → not returned)
    const existing = new Set(rows.map(r => (r.campaign_name || '').toLowerCase()))
    Object.values(dateMap).forEach(info => {
      if (!existing.has(info.name.toLowerCase())) {
        rows.push({
          campaign_name: info.name,
          spend: 0, impressions: 0, clicks: 0, daily_budget: 0,
          effective_status: info.status,
          start_time: info.start_time,
          stop_time: info.stop_time,
          _zero_spend: true
        })
      }
    })
    // Ensure rows array is referenced in out.meta
    if (out.meta.data) out.meta.data.rows = rows
    else out.meta.rows = rows
  }

  return cors(Response.json(out))
}
