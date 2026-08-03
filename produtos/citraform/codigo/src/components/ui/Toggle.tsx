'use client';

import { C } from './palette';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

// Switch on/off do design system Citra — usa a paleta de lime pro estado ligado,
// mesmo vocabulário visual de Button/Input.
export default function Toggle({ checked, onChange, disabled, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        position: 'relative',
        width: 40,
        height: 24,
        borderRadius: 999,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: checked ? C.limeMid : C.border2,
        transition: 'background 0.15s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 19 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: C.white,
          boxShadow: '0 1px 2px rgba(0,0,0,0.25)',
          transition: 'left 0.15s ease',
        }}
      />
    </button>
  );
}
