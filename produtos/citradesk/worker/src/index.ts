interface Env {
  ANTHROPIC_API_KEY: string;
}

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ALLOWED_MODELS = ['claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') ?? '*';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    if (request.method !== 'POST' || new URL(request.url).pathname !== '/proxy') {
      return new Response('Not found', { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return json({ error: 'JSON inválido' }, 400, origin);
    }

    if (!ALLOWED_MODELS.includes(body.model as string)) {
      return json({ error: 'Modelo não permitido' }, 400, origin);
    }

    const anthropicHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    };

    // Extrai betas antes de repassar o body (vira header, não campo)
    const betas = body.betas as string[] | undefined;
    if (betas?.length) {
      anthropicHeaders['anthropic-beta'] = betas.join(',');
      const { betas: _b, ...rest } = body;
      body = rest;
    }

    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: anthropicHeaders,
      body: JSON.stringify(body),
    });

    const data = await upstream.json();
    return json(data, upstream.status, origin);
  },
};

function cors(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function json(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...cors(origin) },
  });
}
