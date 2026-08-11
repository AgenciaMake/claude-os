import { verifyToken } from './auth.js'

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  return new Response(response.body, { status: response.status, headers })
}

export async function onRequestOptions() {
  return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type,Authorization' } })
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
  const end = url.searchParams.get('end') || new Date().toISOString().slice(0, 10)

  if (!env.REPORT_NINJA_TOKEN) {
    return cors(Response.json({ meta: null, linkedin: null, error: 'REPORT_NINJA_TOKEN não configurado' }))
  }

  const dateRange = { preset: 'custom', start, end }
  const attribution = 'ATTRIBUTION_MODEL_VIEW_CLICK###VIEW_ATTRIBUTION_WINDOW_1D###CLICK_ATTRIBUTION_WINDOW_7D'

  const [meta, linkedin] = await Promise.all([
    queryNinja(env.REPORT_NINJA_TOKEN, {
      integration_id: 'facebook_ads',
      connection_key: 'brunomdois@gmail.com',
      account_id: '2364073693796998',
      fields: ['campaign_name', 'spend', 'impressions', 'clicks', 'ctr', 'cpm', 'reach'],
      date_range: dateRange,
      settings: { attribution_window: attribution }
    }),
    queryNinja(env.REPORT_NINJA_TOKEN, {
      integration_id: 'linkedin_ads',
      connection_key: '7YTLMHaQPL',
      account_id: '514458905',
      data_view: 'campaign',
      fields: ['campaignName', 'costInLocalCurrency', 'impressions', 'clicks', 'avgCTR', 'avgCPM'],
      date_range: dateRange
    })
  ])

  return cors(Response.json({ meta, linkedin }))
}
