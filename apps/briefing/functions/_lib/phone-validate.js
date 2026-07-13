// Valida números de telefone/WhatsApp por código (contagem de dígitos não é confiável
// quando deixada só pro modelo de linguagem contar sozinho).

const PHONE_CANDIDATE_REGEX = /(?:\+?\d[\d()\-.\s]{6,}\d)/g;

function digitsOnly(raw) {
  return raw.replace(/\D/g, '');
}

function classify(digitsRaw) {
  let digits = digitsRaw;
  let country = null;

  if (digits.startsWith('55') && digits.length >= 12) {
    country = 'BR';
    digits = digits.slice(2);
  } else if (digits.startsWith('351') && digits.length >= 11) {
    country = 'PT';
    digits = digits.slice(3);
  }

  if (country === 'PT' || (!country && digits.length === 9 && /^9/.test(digits))) {
    if (digits.length === 9) {
      return { valid: true, detail: `Portugal, ${digits.length} dígitos (celular/fixo PT)` };
    }
    return { valid: false, detail: `Portugal esperado, mas tem ${digits.length} dígitos (esperado 9)` };
  }

  if (country === 'BR' || !country) {
    if (digits.length === 11) {
      return { valid: true, detail: `Brasil celular, ${digits.length} dígitos (DDD ${digits.slice(0, 2)} + 9 + ${digits.slice(3)})` };
    }
    if (digits.length === 10) {
      return { valid: true, detail: `Brasil fixo, ${digits.length} dígitos (DDD ${digits.slice(0, 2)} + ${digits.slice(2)})` };
    }
    return { valid: false, detail: `${digits.length} dígitos — esperado 11 (celular BR) ou 10 (fixo BR) ou 9 (PT)` };
  }

  return { valid: false, detail: `${digits.length} dígitos — formato não reconhecido` };
}

export function validatePhoneNumbers(text) {
  if (!text) return null;
  const matches = text.match(PHONE_CANDIDATE_REGEX) || [];
  if (matches.length === 0) return null;

  const seen = new Set();
  const lines = [];

  for (const raw of matches) {
    const digits = digitsOnly(raw);
    if (digits.length < 8 || digits.length > 15 || seen.has(digits)) continue;
    seen.add(digits);
    const { valid, detail } = classify(digits);
    lines.push(
      `"${raw.trim()}" → contagem exata feita por código: ${digits.length} dígitos. ${detail}. ${valid ? 'FORMATO VÁLIDO — aceite sem pedir confirmação de dígitos.' : 'FORMATO INVÁLIDO — peça pra confirmar o número.'}`
    );
  }

  if (lines.length === 0) return null;

  return `\n\n[Validação automática de telefone, feita por código (não pelo modelo). Confie nesse resultado, NÃO conte os dígitos você mesmo:\n${lines.join('\n')}]`;
}
