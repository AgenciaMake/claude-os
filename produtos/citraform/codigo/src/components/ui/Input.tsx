'use client';

import type { InputHTMLAttributes } from 'react';
import { C, ff } from './palette';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Input genérico do design system Citra — mesma paleta de bordas/foco do CitraChat.
export default function Input({ style, ...rest }: InputProps) {
  return (
    <input
      style={{
        fontFamily: ff.body,
        fontSize: 16,
        padding: '10px 14px',
        borderRadius: 10,
        border: `1px solid ${C.border2}`,
        color: C.ink,
        background: C.white,
        outline: 'none',
        width: '100%',
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = C.limeMid;
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = C.border2;
      }}
      {...rest}
    />
  );
}
