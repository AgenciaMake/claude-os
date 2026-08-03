'use client';

import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';

const GATEWAYS = ['Stripe', 'PayPal', 'Mercado Pago', 'Asaas', 'PIX direto'];

export default function PaymentsPanel() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 18, color: C.ink }}>Pagamentos</div>
          <div style={{ fontFamily: ff.body, fontSize: 13, color: C.ink3 }}>Não é prioridade imediata — versão simplificada do protótipo.</div>
        </div>

        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: C.limeBg, color: C.limeDark }}>
                <CreditCard size={17} />
              </span>
              <div>
                <div style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>Habilitar pagamentos</div>
                <div style={{ fontFamily: ff.body, fontSize: 12, color: C.ink3 }}>Cobrar direto no formulário, tipo checkout embutido.</div>
              </div>
            </div>
            <Toggle checked={enabled} onChange={setEnabled} />
          </div>
        </Card>

        <div style={{ fontFamily: ff.body, fontSize: 12, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 10 }}>
          Gateways
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GATEWAYS.map((g) => (
            <div
              key={g}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 12,
                border: `1px solid ${C.border}`,
                background: C.cream,
                opacity: enabled ? 1 : 0.6,
              }}
            >
              <span style={{ fontFamily: ff.body, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{g}</span>
              <Badge tone="neutral">Em breve</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
