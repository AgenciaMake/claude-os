// Detecta URLs na mensagem do cliente e busca conteúdo pra dar contexto real ao Alfred

const URL_REGEX = /https?:\/\/[^\s<>()"']+/gi;
const MAX_BYTES = 60000;
const TIMEOUT_MS = 8000;

export function extractUrls(text) {
  if (!text) return [];
  const matches = text.match(URL_REGEX) || [];
  const cleaned = matches.map(u => u.replace(/[.,;:!?)\]]+$/, ''));
  return [...new Set(cleaned)].slice(0, 3);
}

async function fetchSite(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MakeLemonAdBriefing/1.0; +https://makelemonad.com.br)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    const status = res.status;
    const contentType = res.headers.get('content-type') || '';
    if (!res.ok) {
      return { url, ok: false, status, error: `HTTP ${status}` };
    }
    if (!/html|text/i.test(contentType)) {
      return { url, ok: false, status, error: `Resposta não é HTML (${contentType || 'sem content-type'})` };
    }
    const buf = await res.arrayBuffer();
    const sliced = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    const html = new TextDecoder('utf-8', { fatal: false }).decode(sliced);
    return { url, ok: true, status, html };
  } catch (err) {
    const msg = err.name === 'AbortError'
      ? 'Timeout (site demorou mais de 8s)'
      : (err.message || 'erro desconhecido');
    return { url, ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
}

function summarizeHtml(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');

  const titleMatch = cleaned.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  const descMatch =
    cleaned.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) ||
    cleaned.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i);
  const description = descMatch ? descMatch[1].trim() : '';

  const ogDescMatch = cleaned.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']*)["']/i);
  const ogDesc = ogDescMatch ? ogDescMatch[1].trim() : '';

  const body = cleaned
    .replace(/<head[\s\S]*?<\/head>/i, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);

  const tech = [];
  if (/wp-content|wp-includes/i.test(html)) tech.push('WordPress');
  if (/elementor/i.test(html)) tech.push('Elementor');
  if (/cdn\.shopify\.com|myshopify\.com/i.test(html)) tech.push('Shopify');
  if (/nuvemshop|nuvem\.shop/i.test(html)) tech.push('Nuvemshop');
  if (/lojainteg\.com|tray\.com\.br/i.test(html)) tech.push('Tray');
  if (/woocommerce/i.test(html)) tech.push('WooCommerce');
  if (/googletagmanager\.com|gtag\(/i.test(html)) tech.push('GA / GTM');
  if (/connect\.facebook\.net\/.*fbevents/i.test(html)) tech.push('Meta Pixel');
  if (/tiktok\.com\/i18n\/pixel/i.test(html)) tech.push('TikTok Pixel');
  if (/hotjar|clarity\.ms/i.test(html)) tech.push('Heatmap (Hotjar/Clarity)');
  if (/react|next\.js|_next\//i.test(html)) tech.push('React/Next.js');

  return { title, description: description || ogDesc, body, tech };
}

export async function analyzeUrls(userText) {
  const urls = extractUrls(userText);
  if (urls.length === 0) return null;

  const results = await Promise.all(urls.map(u => fetchSite(u)));

  const parts = [
    '[Análise automática executada pelo sistema do Alfred — o cliente mencionou URLs acima. O sistema tentou acessar cada uma e devolveu o resultado abaixo. Use essas informações pra fazer perguntas embasadas. Se alguma falhou, mencione isso pro cliente e peça pra confirmar a URL.]',
  ];

  for (const r of results) {
    if (!r.ok) {
      parts.push(
        `\nURL: ${r.url}\nStatus: FALHA — ${r.error}\nInstrução: o site não está acessível no momento. Pergunte ao cliente se a URL está correta, se o site está no ar, e se ele pode confirmar outra URL.`
      );
    } else {
      const info = summarizeHtml(r.html);
      parts.push(
        `\nURL: ${r.url}\nStatus: OK (HTTP ${r.status})\nTítulo: ${info.title || '(sem título)'}\nDescrição (meta): ${info.description || '(sem meta description)'}\nStack detectada: ${info.tech.length ? info.tech.join(', ') : '(não identificada)'}\nConteúdo da home (extrato):\n${info.body || '(vazio)'}`
      );
    }
  }

  return parts.join('\n');
}
