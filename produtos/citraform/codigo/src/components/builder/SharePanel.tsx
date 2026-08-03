'use client';

import { useState } from 'react';
import { Link2, Code2, MonitorSmartphone, SquareStack, QrCode, Copy, Check } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface SharePanelProps {
  slug: string;
}

function CopyBox({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div
        style={{
          flex: 1,
          fontFamily: 'monospace',
          fontSize: 12.5,
          color: C.ink2,
          background: C.cream,
          border: `1px solid ${C.border}`,
          borderRadius: 10,
          padding: '10px 12px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </div>
      <Button
        variant="secondary"
        size="sm"
        icon={copied ? <Check size={14} /> : <Copy size={14} />}
        onClick={() => {
          navigator.clipboard?.writeText(value).catch(() => {});
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? 'Copiado' : 'Copiar'}
      </Button>
    </div>
  );
}

export default function SharePanel({ slug }: SharePanelProps) {
  const directLink = `https://citra.form/${slug}`;
  const shortcode = `[citraform id="${slug}"]`;
  const embed = `<script src="https://citra.form/embed.js" data-form="${slug}"></script>`;
  const popup = `<script src="https://citra.form/embed.js" data-form="${slug}" data-mode="popup"></script>`;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 18, color: C.ink }}>Compartilhar</div>
          <div style={{ fontFamily: ff.body, fontSize: 13, color: C.ink3 }}>
            Motor único, múltiplos modos de entrega — SaaS puro, embed universal ou domínio próprio via CNAME (fase 2: plugin WordPress).
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Link2 size={16} color={C.limeDark} />
              <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>Link direto</span>
              <Badge tone="lime">Padrão</Badge>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Roda em domínio próprio da Citra — zero instalação.</p>
            <CopyBox value={directLink} />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <SquareStack size={16} color={C.limeDark} />
              <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>Shortcode</span>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Para inserir em post ou página do WordPress.</p>
            <CopyBox value={shortcode} />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Code2 size={16} color={C.limeDark} />
              <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>Embed universal</span>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Script que carrega o mesmo motor em qualquer site (WordPress, Shopify, HTML puro).</p>
            <CopyBox value={embed} />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <MonitorSmartphone size={16} color={C.limeDark} />
              <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>Popup</span>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Abre em modal ao clicar em um botão do site.</p>
            <CopyBox value={popup} />
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <QrCode size={16} color={C.limeDark} />
              <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 14, color: C.ink }}>QR Code</span>
            </div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>Pra materiais impressos e campanhas offline.</p>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 10,
                background: `repeating-conic-gradient(${C.ink} 0% 25%, ${C.white} 0% 50%) 0 0/16px 16px`,
                border: `1px solid ${C.border}`,
              }}
              title="QR Code (mock visual)"
            />
          </Card>

          <Card style={{ background: C.cream }}>
            <div style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 13, color: C.ink, marginBottom: 6 }}>Domínio próprio (CNAME)</div>
            <p style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3, marginBottom: 10 }}>
              Aponte um subdomínio do seu site pro CitraForm — ganho de SEO e tracking first-party sem duplicar o motor.
            </p>
            <Button variant="secondary" size="sm">Configurar domínio</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
