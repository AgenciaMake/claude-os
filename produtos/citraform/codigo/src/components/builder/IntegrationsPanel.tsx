'use client';

import { useState } from 'react';
import { Tags, LineChart, Target, MousePointerClick, Check } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const INTEGRATIONS = [
  { id: 'gtm', name: 'Google Tag Manager', desc: 'Dispara tags customizadas a partir dos eventos do formulário.', icon: Tags },
  { id: 'ga4', name: 'Google Analytics (GA4)', desc: 'Envia eventos de início, avanço e conclusão do formulário.', icon: LineChart },
  { id: 'meta', name: 'Meta Pixel', desc: 'Conversões de lead qualificado prontas pro Meta Ads.', icon: MousePointerClick },
  { id: 'gads', name: 'Google Ads', desc: 'Conversão offline/online amarrada ao resultado da qualificação.', icon: Target },
];

export default function IntegrationsPanel() {
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 18, color: C.ink }}>Integrações</div>
          <div style={{ fontFamily: ff.body, fontSize: 13, color: C.ink3 }}>Visual apenas neste protótipo — sem OAuth real ainda.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {INTEGRATIONS.map((it) => {
            const Icon = it.icon;
            const isConnected = !!connected[it.id];
            return (
              <Card key={it.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: 10, background: C.limeBg, color: C.limeDark, flexShrink: 0 }}>
                    <Icon size={17} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>{it.name}</div>
                    <div style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, margin: '4px 0 12px', lineHeight: 1.4 }}>{it.desc}</div>
                    <Button
                      variant={isConnected ? 'secondary' : 'primary'}
                      size="sm"
                      icon={isConnected ? <Check size={14} /> : undefined}
                      onClick={() => setConnected((c) => ({ ...c, [it.id]: !c[it.id] }))}
                    >
                      {isConnected ? 'Conectado' : 'Conectar'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
