'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { C, ff } from './palette';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const sizeStyles: Record<Size, { padding: string; fontSize: number }> = {
  sm: { padding: '8px 14px', fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 14 },
  lg: { padding: '14px 28px', fontSize: 16 },
};

// Botões padrão do design system Citra — extraídos dos estilos inline
// usados no CitraChat (SiteHeader "Entrar" = primary, nav links = ghost).
export default function Button({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  const dims = sizeStyles[size];

  const variantStyles: Record<Variant, React.CSSProperties> = {
    primary: {
      background: C.lime,
      color: C.ink,
      border: 'none',
    },
    secondary: {
      background: C.white,
      color: C.ink,
      border: `1px solid ${C.border2}`,
    },
    ghost: {
      background: 'transparent',
      color: C.ink2,
      border: 'none',
    },
  };

  return (
    <button
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: ff.body,
        fontWeight: 700,
        fontSize: dims.fontSize,
        padding: dims.padding,
        borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'transform 0.12s ease, opacity 0.12s ease',
        ...variantStyles[variant],
        ...style,
      }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.97)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
