import type { HTMLAttributes, ReactNode } from 'react';
import { C, ff } from './palette';

type Tone = 'lime' | 'neutral' | 'coral' | 'sky';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: Tone;
}

const toneStyles: Record<Tone, { bg: string; color: string }> = {
  lime: { bg: C.limeBg, color: C.limeDark },
  neutral: { bg: C.cream2, color: C.ink2 },
  coral: { bg: 'oklch(90% 0.06 28)', color: C.coral },
  sky: { bg: 'oklch(92% 0.05 242)', color: C.sky },
};

// Selo pequeno pra status/labels ("NEW", "PRO", contagens) — mesmo vocabulário de cor do design system.
export default function Badge({ children, tone = 'neutral', style, ...rest }: BadgeProps) {
  const t = toneStyles[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: ff.body,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: 999,
        background: t.bg,
        color: t.color,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
