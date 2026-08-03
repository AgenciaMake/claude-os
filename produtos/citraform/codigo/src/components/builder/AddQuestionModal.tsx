'use client';

import { X } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Badge from '@/components/ui/Badge';
import { getIcon } from './icons';
import { QUESTION_TYPES, CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/citraform/typeCatalog';
import type { QuestionKind } from '@/lib/citraform/types';

interface AddQuestionModalProps {
  onClose: () => void;
  onPick: (kind: QuestionKind) => void;
}

export default function AddQuestionModal({ onClose, onPick }: AddQuestionModalProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(20,18,10,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.white,
          borderRadius: 20,
          width: '100%',
          maxWidth: 720,
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 18, color: C.ink }}>
            Adicionar pergunta
          </div>
          <button onClick={onClose} style={{ border: 'none', background: C.cream2, borderRadius: 8, padding: 6, cursor: 'pointer', color: C.ink2, display: 'flex' }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 22, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
          {CATEGORY_ORDER.map((cat) => {
            const items = QUESTION_TYPES.filter((t) => t.category === cat);
            if (!items.length) return null;
            return (
              <div key={cat}>
                <div style={{ fontFamily: ff.body, fontSize: 12, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 10 }}>
                  {CATEGORY_LABELS[cat]}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
                  {items.map((item) => {
                    const Icon = getIcon(item.icon);
                    return (
                      <button
                        key={item.kind}
                        onClick={() => !item.comingSoon && onPick(item.kind)}
                        disabled={item.comingSoon}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 10,
                          textAlign: 'left',
                          padding: '12px 12px',
                          borderRadius: 12,
                          border: `1px solid ${C.border}`,
                          background: item.comingSoon ? C.cream : C.white,
                          cursor: item.comingSoon ? 'not-allowed' : 'pointer',
                          opacity: item.comingSoon ? 0.55 : 1,
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 32,
                            height: 32,
                            borderRadius: 9,
                            background: C.limeBg,
                            color: C.limeDark,
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={16} />
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 700, color: C.ink }}>{item.label}</span>
                            {item.badge === 'novo' && <Badge tone="lime">Novo</Badge>}
                            {item.comingSoon && <Badge tone="neutral">Em breve</Badge>}
                          </span>
                          <span style={{ fontFamily: ff.body, fontSize: 11.5, color: C.ink3, lineHeight: 1.3 }}>{item.description}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
