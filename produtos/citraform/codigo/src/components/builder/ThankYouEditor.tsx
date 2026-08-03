'use client';

import { PartyPopper, Info } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import type { ThankYouScreen, TrackingProvider } from '@/lib/citraform/types';

interface ThankYouEditorProps {
  screen: ThankYouScreen;
  onChange: (patch: Partial<ThankYouScreen>) => void;
  onGoToLogic: () => void;
}

const TRACKING_LABELS: { id: TrackingProvider; label: string }[] = [
  { id: 'google_ads', label: 'Google Ads' },
  { id: 'ga4', label: 'GA4' },
  { id: 'meta_pixel', label: 'Meta Pixel' },
];

function conditionLabel(screen: ThankYouScreen) {
  const c = screen.condition;
  if (c.type === 'default') return 'Padrão — todos os outros casos';
  if (c.type === 'score_gte') return `Score ≥ ${c.scoreValue ?? 0}`;
  if (c.type === 'score_lt') return `Score < ${c.scoreValue ?? 0}`;
  return 'Resposta específica em pergunta';
}

export default function ThankYouEditor({ screen, onChange, onGoToLogic }: ThankYouEditorProps) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.ink3, fontFamily: ff.body, fontSize: 12.5, marginBottom: 18 }}>
            <PartyPopper size={13} /> Thank You Screen
          </div>
          <textarea
            value={screen.title}
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
              fontSize: 26,
              color: C.ink,
              lineHeight: 1.25,
            }}
          />
          <Textarea
            value={screen.description}
            onChange={(e) => onChange({ description: e.target.value })}
            style={{ border: 'none', padding: '4px 0', minHeight: 60, fontSize: 15, color: C.ink2 }}
          />

          <button
            onClick={onGoToLogic}
            style={{
              marginTop: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.cream,
              cursor: 'pointer',
              fontFamily: ff.body,
              fontSize: 12.5,
              color: C.ink2,
            }}
          >
            <Info size={14} />
            Condição de exibição: <strong style={{ color: C.ink }}>{conditionLabel(screen)}</strong>
            <span style={{ color: C.limeDark, fontWeight: 700, marginLeft: 4 }}>editar na aba Lógica →</span>
          </button>
        </div>
      </div>

      <div style={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 14, color: C.ink }}>Ação ao chegar aqui</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Tipo de ação</div>
          <Select
            value={screen.action.type}
            onChange={(e) => onChange({ action: { ...screen.action, type: e.target.value as ThankYouScreen['action']['type'] } })}
          >
            <option value="none">Nenhuma — só exibir a tela</option>
            <option value="redirect_url">Redirecionar para URL própria</option>
            <option value="redirect_whatsapp">Redirecionar para WhatsApp</option>
          </Select>
        </div>

        {screen.action.type === 'redirect_url' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>URL de destino</div>
            <Input value={screen.action.url ?? ''} onChange={(e) => onChange({ action: { ...screen.action, url: e.target.value } })} placeholder="https://makelemonad.com.br/obrigado" />
          </div>
        )}

        {screen.action.type === 'redirect_whatsapp' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Número do WhatsApp</div>
              <Input value={screen.action.whatsappNumber ?? ''} onChange={(e) => onChange({ action: { ...screen.action, whatsappNumber: e.target.value } })} placeholder="5511999999999" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Mensagem inicial</div>
              <Textarea value={screen.action.whatsappMessage ?? ''} onChange={(e) => onChange({ action: { ...screen.action, whatsappMessage: e.target.value } })} style={{ minHeight: 56 }} />
            </div>
          </>
        )}

        <div style={{ height: 1, background: C.border }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 600, color: C.ink }}>Auto redirect</span>
          <Toggle checked={screen.autoRedirect.enabled} onChange={(v) => onChange({ autoRedirect: { ...screen.autoRedirect, enabled: v } })} />
        </div>
        {screen.autoRedirect.enabled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Atraso (segundos)</div>
            <Input
              type="number"
              min={0}
              value={screen.autoRedirect.delaySeconds}
              onChange={(e) => onChange({ autoRedirect: { ...screen.autoRedirect, delaySeconds: Number(e.target.value) } })}
            />
          </div>
        )}

        <div style={{ height: 1, background: C.border }} />

        <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Disparar evento de tracking</div>
        {TRACKING_LABELS.map((t) => (
          <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: ff.body, fontSize: 13, color: C.ink }}>{t.label}</span>
            <Toggle
              checked={screen.tracking[t.id]}
              onChange={(v) => onChange({ tracking: { ...screen.tracking, [t.id]: v } })}
            />
          </div>
        ))}

        <div style={{ height: 1, background: C.border }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 600, color: C.ink }}>Bordas arredondadas (fancy)</span>
          <Toggle checked={screen.fancyBorderRadius} onChange={(v) => onChange({ fancyBorderRadius: v })} />
        </div>
      </div>
    </div>
  );
}
