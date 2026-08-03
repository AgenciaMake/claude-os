'use client';

import type { TextareaHTMLAttributes } from 'react';
import { C, ff } from './palette';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

// Textarea genérica do design system Citra — mesmo tratamento visual do Input.
export default function Textarea({ style, ...rest }: TextareaProps) {
  return (
    <textarea
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
        resize: 'vertical',
        minHeight: 72,
        lineHeight: 1.5,
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
