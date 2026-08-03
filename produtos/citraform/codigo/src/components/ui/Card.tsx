import type { HTMLAttributes, ReactNode } from 'react';
import { C } from './palette';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
}

// Card genérico do design system Citra — fundo branco, borda suave, cantos
// arredondados. Mesmo vocabulário visual (bordas, raios, sombra) do CitraChat.
export default function Card({ children, padding = 24, style, ...rest }: CardProps) {
  return (
    <div
      style={{
        background: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding,
        boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
