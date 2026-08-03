'use client';

import { useState } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import { getIcon } from './icons';
import { typeDef } from '@/lib/citraform/typeCatalog';
import type { Question, Layout, ChoiceOption } from '@/lib/citraform/types';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onChange: (patch: Partial<Question>) => void;
}

const LAYOUT_OPTIONS: { value: Layout; label: string }[] = [
  { value: 'stack', label: 'Empilhado' },
  { value: 'float-right', label: 'Flutuante à direita' },
  { value: 'float-left', label: 'Flutuante à esquerda' },
  { value: 'split-right', label: 'Dividido à direita' },
  { value: 'split-left', label: 'Dividido à esquerda' },
];

const COUNTRIES = [
  { value: 'BR', label: 'Brasil (+55)' },
  { value: 'PT', label: 'Portugal (+351)' },
  { value: 'US', label: 'Estados Unidos (+1)' },
];

function ConfigRow({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>{label}</div>
      {children}
      {help && <div style={{ fontFamily: ff.body, fontSize: 11.5, color: C.ink3, lineHeight: 1.4 }}>{help}</div>}
    </div>
  );
}

function ToggleRow({ label, checked, onChange, help }: { label: string; checked: boolean; onChange: (v: boolean) => void; help?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 600, color: C.ink }}>{label}</span>
        <Toggle checked={checked} onChange={onChange} />
      </div>
      {help && <div style={{ fontFamily: ff.body, fontSize: 11.5, color: C.ink3, lineHeight: 1.4 }}>{help}</div>}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border, margin: '4px 0' }} />;
}

function OptionsEditor({ options, onChange, showScore }: { options: ChoiceOption[]; onChange: (opts: ChoiceOption[]) => void; showScore: boolean }) {
  function update(id: string, patch: Partial<ChoiceOption>) {
    onChange(options.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }
  function remove(id: string) {
    onChange(options.filter((o) => o.id !== id));
  }
  function add() {
    onChange([...options, { id: `opt_${Date.now()}`, label: 'Nova opção', score: 0 }]);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map((opt, i) => (
        <div key={opt.id} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: ff.body, fontSize: 11, color: C.ink3, width: 14 }}>{i + 1}</span>
          <Input value={opt.label} onChange={(e) => update(opt.id, { label: e.target.value })} style={{ flex: 1, fontSize: 13, padding: '7px 10px' }} />
          {showScore && (
            <Input
              type="number"
              value={opt.score ?? 0}
              onChange={(e) => update(opt.id, { score: Number(e.target.value) })}
              title="Pontos"
              style={{ width: 56, fontSize: 13, padding: '7px 8px', textAlign: 'center' }}
            />
          )}
          <button onClick={() => remove(opt.id)} style={{ border: 'none', background: 'transparent', color: C.ink3, cursor: 'pointer', display: 'flex' }}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          border: `1.5px dashed ${C.border2}`,
          borderRadius: 8,
          background: 'transparent',
          color: C.ink2,
          fontFamily: ff.body,
          fontWeight: 700,
          fontSize: 12.5,
          padding: '7px 10px',
          cursor: 'pointer',
        }}
      >
        <Plus size={13} /> Adicionar opção
      </button>
    </div>
  );
}

export default function QuestionEditor({ question: q, index, onChange }: QuestionEditorProps) {
  const [domainsText, setDomainsText] = useState((q.restrictDomains?.domains ?? []).join(', '));
  const def = typeDef(q.kind);
  const Icon = def ? getIcon(def.icon) : null;
  const isChoice = q.kind === 'multiple_choice' || q.kind === 'dropdown';
  const isStatement = q.kind === 'statement';

  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      {/* Canvas central */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 700, color: C.limeDark, background: C.limeBg, padding: '4px 10px', borderRadius: 999 }}>
              {index + 1}
            </span>
            {Icon && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.ink3, fontFamily: ff.body, fontSize: 12.5 }}>
                <Icon size={13} /> {def?.label}
              </span>
            )}
          </div>

          <textarea
            value={q.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Escreva a pergunta..."
            rows={1}
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
              lineHeight: 1.3,
            }}
          />
          <Textarea
            value={q.description ?? ''}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Descrição (opcional)"
            style={{ border: 'none', padding: '4px 0', minHeight: 40, fontSize: 15, color: C.ink2 }}
          />

          <div style={{ marginTop: 24 }}>
            {isChoice && (
              <OptionsEditor options={q.options ?? []} onChange={(options) => onChange({ options })} showScore />
            )}
            {(q.kind === 'short_text' || q.kind === 'website') && (
              <Input placeholder="Resposta em texto..." disabled style={{ background: C.cream }} />
            )}
            {q.kind === 'long_text' && <Textarea placeholder="Resposta em parágrafo..." disabled style={{ background: C.cream }} />}
            {q.kind === 'email' && <Input placeholder="nome@empresa.com" disabled style={{ background: C.cream }} />}
            {q.kind === 'phone' && <Input placeholder="(11) 99999-9999" disabled style={{ background: C.cream }} />}
            {q.kind === 'opinion_scale' && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {Array.from({ length: (q.scaleMax ?? 10) - (q.scaleMin ?? 0) + 1 }).map((_, i) => (
                  <span
                    key={i}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      border: `1px solid ${C.border2}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: ff.body,
                      fontSize: 12,
                      color: C.ink2,
                    }}
                  >
                    {(q.scaleMin ?? 0) + i}
                  </span>
                ))}
              </div>
            )}
            {q.kind === 'rating' && (
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: q.ratingMax ?? 5 }).map((_, i) => (
                  <span key={i} style={{ color: C.limeMid, fontSize: 22 }}>★</span>
                ))}
              </div>
            )}
            {isStatement && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', color: C.ink3, fontFamily: ff.body, fontSize: 12.5, background: C.cream, padding: 12, borderRadius: 10 }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                Bloco informativo — não coleta resposta, só exibe conteúdo (ex: contexto antes de perguntas sensíveis).
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Painel de configuração */}
      <div style={{ width: 340, flexShrink: 0, borderLeft: `1px solid ${C.border}`, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 14, color: C.ink }}>Configurações</div>

        {!isStatement && (
          <ToggleRow label="Obrigatória" checked={q.required} onChange={(v) => onChange({ required: v })} />
        )}

        <Divider />

        <ConfigRow label="Layout">
          <Select value={q.layout} onChange={(e) => onChange({ layout: e.target.value as Layout })}>
            {LAYOUT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </ConfigRow>

        <ToggleRow label="Exibir anexo" checked={!!q.showAttachment} onChange={(v) => onChange({ showAttachment: v })} help="Imagem ou vídeo ao lado da pergunta." />

        {/* Short / Long text */}
        {(q.kind === 'short_text' || q.kind === 'long_text') && (
          <>
            <Divider />
            <ConfigRow label="Mínimo de caracteres">
              <Input type="number" value={q.minChars ?? ''} onChange={(e) => onChange({ minChars: Number(e.target.value) || undefined })} />
            </ConfigRow>
            <ConfigRow label="Máximo de caracteres">
              <Input type="number" value={q.maxChars ?? ''} onChange={(e) => onChange({ maxChars: Number(e.target.value) || undefined })} />
            </ConfigRow>
          </>
        )}

        {/* Email */}
        {q.kind === 'email' && (
          <>
            <Divider />
            <ToggleRow
              label="Restringir domínios de e-mail"
              checked={!!q.restrictDomains?.enabled}
              onChange={(v) =>
                onChange({
                  restrictDomains: {
                    enabled: v,
                    mode: q.restrictDomains?.mode ?? 'block',
                    domains: q.restrictDomains?.domains ?? [],
                  },
                })
              }
              help="Diferencial mapeado do QuillForms: bloqueia ou permite só domínios específicos (ex: filtrar e-mail pessoal em lead B2B)."
            />
            {q.restrictDomains?.enabled && (
              <>
                <ConfigRow label="Modo">
                  <Select
                    value={q.restrictDomains.mode}
                    onChange={(e) =>
                      onChange({ restrictDomains: { ...q.restrictDomains!, mode: e.target.value as 'block' | 'allow' } })
                    }
                  >
                    <option value="block">Bloquear estes domínios</option>
                    <option value="allow">Permitir só estes domínios</option>
                  </Select>
                </ConfigRow>
                <ConfigRow label="Domínios" help="Separados por vírgula.">
                  <Textarea
                    value={domainsText}
                    onChange={(e) => setDomainsText(e.target.value)}
                    onBlur={() =>
                      onChange({
                        restrictDomains: {
                          ...q.restrictDomains!,
                          domains: domainsText.split(',').map((d) => d.trim()).filter(Boolean),
                        },
                      })
                    }
                    style={{ minHeight: 56 }}
                    placeholder="gmail.com, hotmail.com"
                  />
                </ConfigRow>
              </>
            )}
          </>
        )}

        {/* Phone */}
        {q.kind === 'phone' && (
          <>
            <Divider />
            <ConfigRow label="País padrão">
              <Select value={q.defaultCountry ?? 'BR'} onChange={(e) => onChange({ defaultCountry: e.target.value })}>
                {COUNTRIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </Select>
            </ConfigRow>
            <ToggleRow
              label="Permitir outros países"
              checked={q.allowOtherCountries ?? true}
              onChange={(v) => onChange({ allowOtherCountries: v })}
            />
          </>
        )}

        {/* Opinion scale / slider */}
        {(q.kind === 'opinion_scale' || q.kind === 'slider') && (
          <>
            <Divider />
            <div style={{ display: 'flex', gap: 8 }}>
              <ConfigRow label="Mín.">
                <Input type="number" value={q.scaleMin ?? 0} onChange={(e) => onChange({ scaleMin: Number(e.target.value) })} />
              </ConfigRow>
              <ConfigRow label="Máx.">
                <Input type="number" value={q.scaleMax ?? 10} onChange={(e) => onChange({ scaleMax: Number(e.target.value) })} />
              </ConfigRow>
            </div>
            <ConfigRow label="Rótulo do mínimo">
              <Input value={q.scaleMinLabel ?? ''} onChange={(e) => onChange({ scaleMinLabel: e.target.value })} />
            </ConfigRow>
            <ConfigRow label="Rótulo do máximo">
              <Input value={q.scaleMaxLabel ?? ''} onChange={(e) => onChange({ scaleMaxLabel: e.target.value })} />
            </ConfigRow>
          </>
        )}

        {/* Rating */}
        {q.kind === 'rating' && (
          <>
            <Divider />
            <ConfigRow label="Quantidade de estrelas">
              <Input type="number" min={3} max={10} value={q.ratingMax ?? 5} onChange={(e) => onChange({ ratingMax: Number(e.target.value) })} />
            </ConfigRow>
          </>
        )}

        {/* Choice-based */}
        {isChoice && (
          <>
            <Divider />
            <ToggleRow label="Permitir múltiplas respostas" checked={!!q.allowMultiple} onChange={(v) => onChange({ allowMultiple: v })} />
            <ToggleRow label="Randomizar opções" checked={!!q.randomizeOptions} onChange={(v) => onChange({ randomizeOptions: v })} />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, background: C.limeBg, padding: 10, borderRadius: 10 }}>
              <Info size={13} color={C.limeDark} style={{ flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontFamily: ff.body, fontSize: 11.5, color: C.limeDark, lineHeight: 1.4 }}>
                Pontuação por opção e desvios (Jump Logic) ficam na aba <strong>Lógica &amp; Pontuação</strong>.
              </span>
            </div>
          </>
        )}

        <Divider />
        <ConfigRow label="HTML customizado" help="Injetado abaixo da descrição no formulário publicado.">
          <Textarea value={q.customHtml ?? ''} onChange={(e) => onChange({ customHtml: e.target.value })} placeholder="<div>...</div>" style={{ fontFamily: 'monospace', fontSize: 12, minHeight: 56 }} />
        </ConfigRow>

        <Badge tone="neutral" style={{ alignSelf: 'flex-start' }}>ID: {q.id}</Badge>
      </div>
    </div>
  );
}
