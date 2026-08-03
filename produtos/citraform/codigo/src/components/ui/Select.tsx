'use client';

import type { SelectHTMLAttributes } from 'react';
import { C, ff } from './palette';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

// Select genérico do design system Citra — mesmo tratamento visual de bordas/foco do Input.
export default function Select({ style, children, ...rest }: SelectProps) {
  return (
    <select
      style={{
        fontFamily: ff.body,
        fontSize: 14,
        padding: '10px 14px',
        borderRadius: 10,
        border: `1px solid ${C.border2}`,
        color: C.ink,
        background: C.white,
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.limeMid;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border2;
      }}
      {...rest}
    >
      {children}
    </select>
  );
}
