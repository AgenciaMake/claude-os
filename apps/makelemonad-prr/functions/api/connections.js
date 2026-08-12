import { verifyToken } from './auth.js'

// Accounts fetched via Report Ninja MCP (2026-08-12)
// Update here when new accounts are connected in Report Ninja
const RN_ACCOUNTS = {
  meta: [
    { connection_key: 'brunomdois@gmail.com', account_id: '10153972324825868', label: 'Bruno Martins · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1045768796177465', label: 'Diretto Importações · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1173907927206696', label: 'CA - Os Melhores da Vila · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1239340883795856', label: 'Shamar Conta de anúncios · EUR' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1313923230956582', label: 'CA - Base Técnia · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1418579886330144', label: 'CA - ABA CENTRAL - 2026 · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '149766240421652', label: 'ABYARA GRAF · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1538635290339734', label: 'Respira · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '1740319286525560', label: 'CA Webeleven · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '2012573932280376', label: 'Pina Cerâmica 02 · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '2364073693796998', label: 'CA - PRR Portugal · EUR' },
    { connection_key: 'brunomdois@gmail.com', account_id: '2871178893202512', label: 'BM - MakeLemonAd · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '3082808398540163', label: 'CA DON RAVELLO · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '325579364219105', label: 'Samanta Trindade - 2 · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '336361581303718', label: 'Ubirálcool · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '361561831512658', label: 'BMdois Ad 01 · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '462812330898031', label: 'CA - Objekti · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '580022114085372', label: 'CA | ID Arq e Design · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '730997981767501', label: 'Pina Cerâmica · BRL' },
    { connection_key: 'brunomdois@gmail.com', account_id: '754799025105555', label: 'B4Waste · BRL' },
  ],
  linkedin: [
    { connection_key: '7YTLMHaQPL', account_id: '507071874', label: 'MakeLemonAd · BRL' },
    { connection_key: '7YTLMHaQPL', account_id: '511569319', label: 'Boost s360.life · USD' },
    { connection_key: '7YTLMHaQPL', account_id: '512566964', label: 'Conta de anúncios da MakeLemonAd · BRL' },
    { connection_key: '7YTLMHaQPL', account_id: '513614877', label: 'Conta de anúncios de Bruno · EUR' },
    { connection_key: '7YTLMHaQPL', account_id: '514458905', label: 'PRR - Recuperar Portugal · EUR' },
    { connection_key: '7YTLMHaQPL', account_id: '514736076', label: 'WebEleven · BRL' },
  ],
  google: [
    { connection_key: 'makelemonad@gmail.com', account_id: '1050674793', label: 'Aba Central · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '1992118980', label: 'PRR - Recupera Portugal · EUR' },
    { connection_key: 'makelemonad@gmail.com', account_id: '2152705196', label: 'Base Técnica · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '2239699748', label: 'Pina Ateliê · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '3715165962', label: 'MakeLemonAd BR · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '5526629296', label: 'Shamar Yoga · EUR' },
    { connection_key: 'makelemonad@gmail.com', account_id: '5617534243', label: 'Springway · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '6393538203', label: 'Abyara Graf · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '7164079970', label: 'Objekti · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '7164536426', label: 'ST Fisioterapia Domiciliar · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '7283971903', label: 'ID Arq Design Oficial · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '7626443356', label: 'Saber de Si · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '8126774805', label: 'WebEleven · BRL' },
    { connection_key: 'makelemonad@gmail.com', account_id: '9738340066', label: 'MakeLemonAd PT · BRL' },
  ],
  tiktok: [
    { connection_key: 'makelemonad', account_id: '7148372474382581762', label: 'B4Waste · BRL' },
    { connection_key: 'makelemonad', account_id: '7151521594064535553', label: 'Green Fuel Digital · USD' },
    { connection_key: 'makelemonad', account_id: '7547765791803080721', label: 'Objekti · BRL' },
  ],
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

  const url = new URL(request.url)
  const platform = url.searchParams.get('platform')

  const accounts = RN_ACCOUNTS[platform]
  if (!accounts) {
    return cors(Response.json({ error: `Plataforma desconhecida: ${platform}`, accounts: [] }))
  }

  return cors(Response.json({ accounts }))
}
