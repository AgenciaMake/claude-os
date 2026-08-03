'use client';

import { Eye, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { C, ff } from '@/components/ui/palette';
import Button from '@/components/ui/Button';
import type { BuilderTab } from '@/lib/citraform/types';

const TABS: { id: BuilderTab; label: string }[] = [
  { id: 'perguntas', label: 'Perguntas' },
  { id: 'logica', label: 'Lógica & Pontuação' },
  { id: 'design', label: 'Design' },
  { id: 'compartilhar', label: 'Compartilhar' },
  { id: 'respostas', label: 'Respostas' },
  { id: 'integracoes', label: 'Integrações' },
  { id: 'pagamentos', label: 'Pagamentos' },
];

interface TopBarProps {
  formTitle: string;
  activeTab: BuilderTab;
  onTabChange: (tab: BuilderTab) => void;
  published: boolean;
  onPublish: () => void;
}

export default function TopBar({ formTitle, activeTab, onTabChange, published, onPublish }: TopBarProps) {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        height: 60,
        borderBottom: `1px solid ${C.border}`,
        background: C.white,
        flexShrink: 0,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: C.ink2,
          fontFamily: ff.body,
          fontSize: 13,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        <ArrowLeft size={16} />
      </Link>

      <div style={{ flexShrink: 0, maxWidth: 220 }}>
        <div
          style={{
            fontFamily: ff.display,
            fontWeight: 700,
            fontSize: 14,
            color: C.ink,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {formTitle}
        </div>
        <div style={{ fontFamily: ff.body, fontSize: 11, color: published ? C.limeDark : C.ink3 }}>
          {published ? 'Publicado' : 'Rascunho'}
        </div>
      </div>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flex: 1,
          overflowX: 'auto',
          justifyContent: 'center',
        }}
      >
        {TABS.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                fontFamily: ff.body,
                fontWeight: 700,
                fontSize: 13,
                padding: '8px 14px',
                borderRadius: 8,
                border: 'none',
                background: active ? C.limeBg : 'transparent',
                color: active ? C.limeDark : C.ink2,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background 0.12s ease, color 0.12s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <Button variant="ghost" size="sm" icon={<Eye size={15} />}>
          Preview
        </Button>
        <Button variant="primary" size="sm" icon={<Rocket size={15} />} onClick={onPublish}>
          {published ? 'Publicado' : 'Publicar'}
        </Button>
      </div>
    </header>
  );
}
