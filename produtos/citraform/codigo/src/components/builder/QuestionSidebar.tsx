'use client';

import { useState } from 'react';
import { Plus, GripVertical, MessageSquare, PartyPopper, Trash2 } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Badge from '@/components/ui/Badge';
import { getIcon } from './icons';
import { typeDef } from '@/lib/citraform/typeCatalog';
import type { Question, ThankYouScreen } from '@/lib/citraform/types';
import { WELCOME_ID } from '@/lib/citraform/types';

interface QuestionSidebarProps {
  questions: Question[];
  thankYouScreens: ThankYouScreen[];
  selectedId: string;
  onSelect: (id: string) => void;
  onReorder: (questions: Question[]) => void;
  onAddQuestion: () => void;
  onAddThankYou: () => void;
  onDeleteQuestion: (id: string) => void;
}

function Row({
  active,
  onClick,
  icon,
  index,
  label,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDelete,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  index?: number;
  label: string;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className="group"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 10px',
        borderRadius: 10,
        cursor: 'pointer',
        background: active ? C.limeBg : 'transparent',
        border: `1px solid ${active ? C.lime : 'transparent'}`,
      }}
    >
      {draggable && (
        <span style={{ color: C.ink3, display: 'flex', cursor: 'grab', flexShrink: 0 }}>
          <GripVertical size={14} />
        </span>
      )}
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24,
          borderRadius: 7,
          background: active ? C.lime : C.cream2,
          color: active ? C.limeDark : C.ink2,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      {typeof index === 'number' && (
        <span style={{ fontFamily: ff.body, fontSize: 11, color: C.ink3, flexShrink: 0, width: 14 }}>{index}</span>
      )}
      <span
        style={{
          fontFamily: ff.body,
          fontSize: 13,
          fontWeight: active ? 700 : 500,
          color: active ? C.ink : C.ink2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {label}
      </span>
      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            display: 'flex',
            border: 'none',
            background: 'transparent',
            color: C.ink3,
            cursor: 'pointer',
            padding: 2,
            opacity: 0.6,
          }}
          title="Remover"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}

export default function QuestionSidebar({
  questions,
  thankYouScreens,
  selectedId,
  onSelect,
  onReorder,
  onAddQuestion,
  onAddThankYou,
  onDeleteQuestion,
}: QuestionSidebarProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) return;
    const next = [...questions];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
  }

  return (
    <aside
      style={{
        width: 280,
        flexShrink: 0,
        borderRight: `1px solid ${C.border}`,
        background: C.cream,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ fontFamily: ff.body, fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', padding: '4px 10px 6px' }}>
          Boas-vindas
        </div>
        <Row
          active={selectedId === WELCOME_ID}
          onClick={() => onSelect(WELCOME_ID)}
          icon={<MessageSquare size={13} />}
          label="Welcome Screen"
        />

        <div style={{ fontFamily: ff.body, fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', padding: '14px 10px 6px' }}>
          Perguntas · {questions.length}
        </div>
        {questions.map((q, i) => {
          const def = typeDef(q.kind);
          const Icon = getIcon(def?.icon ?? 'Type');
          return (
            <Row
              key={q.id}
              active={selectedId === q.id}
              onClick={() => onSelect(q.id)}
              icon={<Icon size={13} />}
              index={i + 1}
              label={q.title || def?.label || 'Pergunta sem título'}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDelete={() => onDeleteQuestion(q.id)}
            />
          );
        })}

        <button
          onClick={onAddQuestion}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 10px',
            marginTop: 4,
            borderRadius: 10,
            border: `1.5px dashed ${C.border2}`,
            background: 'transparent',
            color: C.ink2,
            fontFamily: ff.body,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Adicionar pergunta
        </button>

        <div style={{ fontFamily: ff.body, fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', padding: '14px 10px 6px' }}>
          Thank You Screens · {thankYouScreens.length}
        </div>
        {thankYouScreens.map((ty) => (
          <Row
            key={ty.id}
            active={selectedId === ty.id}
            onClick={() => onSelect(ty.id)}
            icon={<PartyPopper size={13} />}
            label={ty.title}
          />
        ))}
        <button
          onClick={onAddThankYou}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 10px',
            marginTop: 4,
            borderRadius: 10,
            border: `1.5px dashed ${C.border2}`,
            background: 'transparent',
            color: C.ink2,
            fontFamily: ff.body,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <Plus size={14} /> Adicionar Thank You Screen
        </button>
      </div>

      <div style={{ padding: 12, borderTop: `1px solid ${C.border}` }}>
        <Badge tone="lime">Múltiplas Thank You Screens</Badge>
      </div>
    </aside>
  );
}
