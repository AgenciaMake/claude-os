async function signToken(payload, secret) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return btoa(payload) + '.' + btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function verifyToken(token, secret) {
  try {
    const [b64payload, b64sig] = token.split('.')
    const payload = atob(b64payload)
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify'])
    const sig = Uint8Array.from(atob(b64sig), c => c.charCodeAt(0))
    const valid = await crypto.subtle.verify('HMAC', key, sig, enc.encode(payload))
    if (!valid) return null
    const data = JSON.parse(payload)
    if (data.exp < Date.now()) return null
    return data
  } catch {
    return null
  }
}

function cors(response) {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', '*')
  return new Response(response.body, { status: response.status, headers })
}

export async function onRequestOptions() {
  return new Response(null, { headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization'
  }})
}

export async function onRequestPost(context) {
  const { request, env } = context
  try {
    const { usuario, senha } = await request.json()
    let role = null, planSlug = null

    // Agency editor
    if (usuario === 'bruno@makelemonad.com.br' && senha === env.SENHA_EDICAO) {
      role = 'editor'
    } else {
      // Check per-plan client credentials
      const plans = await env.PRR_DATA.get('plans:index', 'json') || []
      const plan = plans.find(p => p.email_cliente && p.email_cliente.toLowerCase() === usuario.toLowerCase())
      if (plan && plan.senha_cliente && senha === plan.senha_cliente) {
        role = 'viewer'
        planSlug = plan.slug
      }
    }

    if (!role) {
      return cors(Response.json({ error: 'Credenciais inválidas' }, { status: 401 }))
    }

    const payload = JSON.stringify({ usuario, role, planSlug, exp: Date.now() + 86400000 * 7 })
    const token = await signToken(payload, env.JWT_SECRET)
    return cors(Response.json({ token, role, usuario, planSlug }))
  } catch (e) {
    return cors(Response.json({ error: 'Erro interno' }, { status: 500 }))
  }
}
