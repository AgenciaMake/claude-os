'use client';

import { MessageSquare } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Toggle from '@/components/ui/Toggle';
import Button from '@/components/ui/Button';
import type { WelcomeScreen } from '@/lib/citraform/types';

interface WelcomeEditorProps {
  welcome: WelcomeScreen;
  onChange: (patch: Partial<WelcomeScreen>) => void;
}

export default function WelcomeEditor({ welcome, onChange }: WelcomeEditorProps) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.ink3, fontFamily: ff.body, fontSize: 12.5, marginBottom: 18 }}>
            <MessageSquare size={13} /> Welcome Screen
          </div>
          <textarea
            value={welcome.title}
            onChange={(e) => onChange({ title: e.target.value })}
            rows={2}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              background: 'transparent',
              fontFamily: ff.display,
              fontWeight: 700,
              fontSize: 28,
              color: C.ink,
              lineHeight: 1.25,
            }}
          />
          <Textarea
            value={welcome.description}
            onChange={(e) => onChange({ description: e.target.value })}
            style={{ border: 'none', padding: '4px 0', minHeight: 60, fontSize: 15, color: C.ink2 }}
          />
          <div style={{ marginTop: 24 }}>
            <Button variant="primary" disabled>{welcome.buttonLabel || 'Começar'}</Button>
          </div>
        </div>
      </div>

      <div style={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 14, color: C.ink }}>Configurações</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Texto do botão</div>
          <Input value={welcome.buttonLabel} onChange={(e) => onChange({ buttonLabel: e.target.value })} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 600, color: C.ink }}>Exibir botão</span>
          <Toggle checked={welcome.showButton} onChange={(v) => onChange({ showButton: v })} />
        </div>
      </div>
    </div>
  );
}
