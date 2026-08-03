'use client';

import { AlertTriangle, Users, MousePointerClick, Clock, TrendingUp } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import type { Question } from '@/lib/citraform/types';

interface ResultsPanelProps {
  questions: Question[];
}

const STATS = [
  { label: 'Total de visitas', value: '2.840', icon: Users },
  { label: 'Início do formulário', value: '1.912', icon: MousePointerClick },
  { label: 'Taxa de conclusão', value: '67%', icon: TrendingUp },
  { label: 'Tempo médio', value: '01:48', icon: Clock },
];

// Dropoff mockado por pergunta — determinístico a partir do índice pra parecer plausível sem backend.
function mockDropoff(i: number) {
  const base = [12, 59, 18, 9, 22, 6, 14, 4];
  return base[i % base.length];
}

export default function ResultsPanel({ questions }: ResultsPanelProps) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 18, color: C.ink }}>Respostas</div>
          <div style={{ fontFamily: ff.body, fontSize: 13, color: C.ink3 }}>Dados fictícios — só pra visualizar o layout de analytics.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} padding={18}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: C.ink3 }}>
                  <Icon size={15} />
                  <span style={{ fontFamily: ff.body, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{s.label}</span>
                </div>
                <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 26, color: C.ink }}>{s.value}</div>
              </Card>
            );
          })}
        </div>

        <Card>
          <div style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink, marginBottom: 14 }}>Análise por pergunta</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px', gap: 8, padding: '0 4px 8px', borderBottom: `1px solid ${C.border}`, fontFamily: ff.body, fontSize: 11.5, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
              <span>Pergunta</span>
              <span style={{ textAlign: 'right' }}>Visitas</span>
              <span style={{ textAlign: 'right' }}>Dropoff</span>
            </div>
            {questions.map((q, i) => {
              const dropoff = mockDropoff(i);
              const visits = Math.round(1912 * (1 - i * 0.08));
              const high = dropoff > 35;
              return (
                <div key={q.id} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 110px', gap: 8, padding: '10px 4px', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
                  <span style={{ fontFamily: ff.body, fontSize: 13, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.title}</span>
                  <span style={{ fontFamily: ff.body, fontSize: 13, color: C.ink2, textAlign: 'right' }}>{visits}</span>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, fontFamily: ff.body, fontSize: 13, fontWeight: 700, color: high ? C.coral : C.ink2 }}>
                    {high && <AlertTriangle size={13} />}
                    {dropoff}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
