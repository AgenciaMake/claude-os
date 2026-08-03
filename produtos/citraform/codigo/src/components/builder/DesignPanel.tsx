'use client';

import { Palette } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { ThemeConfig } from '@/lib/citraform/types';

interface DesignPanelProps {
  theme: ThemeConfig;
  onChange: (patch: Partial<ThemeConfig>) => void;
}

const FONTS = ['Plus Jakarta Sans', 'Bricolage Grotesque', 'Geist', 'Rubik', 'Inter'];

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  // Inputs de cor HTML exigem hex puro — os tokens da paleta são oklch, então usamos
  // um swatch decorativo (não editável via picker nativo) + campo de texto livre editável.
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>{label}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: value, border: `1px solid ${C.border2}`, flexShrink: 0 }} />
        <Input value={value} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: 'monospace', fontSize: 12.5 }} />
      </div>
    </div>
  );
}

export default function DesignPanel({ theme, onChange }: DesignPanelProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, background: C.limeBg, color: C.limeDark }}>
                <Palette size={16} />
              </span>
              <div>
                <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 16, color: C.ink }}>Tema — {theme.name}</div>
                <div style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>Reaproveita a paleta do design system Citra por padrão.</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Nome do tema</div>
              <Input value={theme.name} onChange={(e) => onChange({ name: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <ColorField label="Cor de destaque" value={theme.accentColor} onChange={(v) => onChange({ accentColor: v })} />
              <ColorField label="Cor de fundo" value={theme.backgroundColor} onChange={(v) => onChange({ backgroundColor: v })} />
              <ColorField label="Texto dos botões" value={theme.buttonTextColor} onChange={(v) => onChange({ buttonTextColor: v })} />
              <ColorField label="Barra de progresso" value={theme.progressBarColor} onChange={(v) => onChange({ progressBarColor: v })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Fonte</div>
                <Select value={theme.fontFamily} onChange={(e) => onChange({ fontFamily: e.target.value })}>
                  {FONTS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </Select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Raio da borda dos botões (px)</div>
                <Input type="number" min={0} max={30} value={theme.borderRadius} onChange={(e) => onChange({ borderRadius: Number(e.target.value) })} />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview ao vivo */}
        <div style={{ position: 'sticky', top: 0 }}>
          <div style={{ fontFamily: ff.body, fontSize: 12, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10 }}>
            Preview
          </div>
          <div
            style={{
              borderRadius: 20,
              padding: 28,
              background: theme.backgroundColor,
              border: `1px solid ${C.border}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              minHeight: 260,
            }}
          >
            <div style={{ height: 4, borderRadius: 999, background: C.border2, overflow: 'hidden' }}>
              <div style={{ width: '60%', height: '100%', background: theme.progressBarColor }} />
            </div>
            <div style={{ fontFamily: theme.fontFamily === 'Bricolage Grotesque' ? ff.display : ff.body, fontWeight: 700, fontSize: 19, color: C.ink }}>
              Qual o faturamento mensal da empresa hoje?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Até R$15 mil', 'R$15 mil a R$45 mil'].map((label) => (
                <div key={label} style={{ padding: '10px 14px', borderRadius: theme.borderRadius, border: `1.5px solid ${C.border2}`, fontFamily: ff.body, fontSize: 13.5, color: C.ink }}>
                  {label}
                </div>
              ))}
            </div>
            <button
              style={{
                marginTop: 8,
                alignSelf: 'flex-start',
                padding: '10px 20px',
                borderRadius: theme.borderRadius,
                background: theme.accentColor,
                color: theme.buttonTextColor,
                border: 'none',
                fontFamily: ff.body,
                fontWeight: 700,
                fontSize: 13.5,
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
