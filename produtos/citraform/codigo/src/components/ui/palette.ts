// Design system do CitraForm — herdado 1:1 do CitraChat (produtos/citrachat/codigo/src/components/site/palette.ts).
// Decisão do Bruno (03/08/2026): mesma paleta, mesma tipografia, mesmo tema. Nada de cor nova por enquanto.

export const C = {
  cream:    'oklch(97.5% 0.010 85)',
  cream2:   'oklch(94%   0.012 85)',
  cream3:   'oklch(90%   0.014 85)',
  white:    '#ffffff',
  ink:      'oklch(12%   0.018 260)',
  ink2:     'oklch(40%   0.018 260)',
  ink3:     'oklch(60%   0.016 260)',
  border:   'oklch(88%   0.010 85)',
  border2:  'oklch(80%   0.012 85)',
  lime:     'oklch(88%   0.22  130)',
  limeMid:  'oklch(60%   0.22  130)',
  limeDark: 'oklch(38%   0.20  130)',
  limeBg:   'oklch(95%   0.07  130)',
  coral:    'oklch(65%   0.18  28)',
  sky:      'oklch(62%   0.17  242)',
} as const;

export const ff = {
  display: 'var(--font-display), system-ui, sans-serif',
  body:    'var(--font-body), system-ui, sans-serif',
} as const;
