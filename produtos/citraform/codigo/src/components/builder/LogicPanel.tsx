'use client';

import { Plus, Trash2, GitBranch, Calculator as CalcIcon, Bell, PartyPopper } from 'lucide-react';
import { C, ff } from '@/components/ui/palette';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Toggle from '@/components/ui/Toggle';
import Badge from '@/components/ui/Badge';
import type {
  CalculatorConfig,
  NotificationOperator,
  NotificationRule,
  Question,
  ThankYouCondition,
  ThankYouScreen,
} from '@/lib/citraform/types';

interface LogicPanelProps {
  questions: Question[];
  thankYouScreens: ThankYouScreen[];
  calculator: CalculatorConfig;
  notifications: NotificationRule[];
  onUpdateQuestion: (id: string, patch: Partial<Question>) => void;
  onUpdateThankYou: (id: string, patch: Partial<ThankYouScreen>) => void;
  onSetCalculator: (patch: Partial<CalculatorConfig>) => void;
  onSetNotifications: (rules: NotificationRule[]) => void;
}

const OPERATOR_LABELS: Record<NotificationOperator, string> = {
  eq: 'é igual a',
  neq: 'é diferente de',
  lt: 'é menor que',
  gt: 'é maior que',
  gte: 'é maior ou igual a',
  lte: 'é menor ou igual a',
};

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 9, background: C.limeBg, color: C.limeDark, flexShrink: 0 }}>
        {icon}
      </span>
      <div>
        <div style={{ fontFamily: ff.display, fontWeight: 700, fontSize: 16, color: C.ink }}>{title}</div>
        <div style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>{subtitle}</div>
      </div>
    </div>
  );
}

export default function LogicPanel({
  questions,
  thankYouScreens,
  calculator,
  notifications,
  onUpdateQuestion,
  onUpdateThankYou,
  onSetCalculator,
  onSetNotifications,
}: LogicPanelProps) {
  const jumpTargets = [
    ...questions.map((q) => ({ id: q.id, label: `Pergunta: ${q.title || q.id}` })),
    ...thankYouScreens.map((t) => ({ id: t.id, label: `Thank You: ${t.title}` })),
  ];
  const choiceQuestions = questions.filter((q) => q.kind === 'multiple_choice' || q.kind === 'dropdown');

  function addRule(q: Question) {
    const firstOption = q.options?.[0];
    if (!firstOption) return;
    const rules = q.jump?.rules ?? [];
    onUpdateQuestion(q.id, {
      jump: {
        fallback: q.jump?.fallback ?? 'next',
        rules: [
          ...rules,
          { id: `rule_${Date.now()}`, whenOptionId: firstOption.id, whenLabel: firstOption.label, targetId: jumpTargets[0]?.id ?? 'next' },
        ],
      },
    });
  }

  function updateRule(q: Question, ruleId: string, patch: Partial<{ whenOptionId: string; targetId: string }>) {
    const rules = (q.jump?.rules ?? []).map((r) => {
      if (r.id !== ruleId) return r;
      const whenOptionId = patch.whenOptionId ?? r.whenOptionId;
      const opt = q.options?.find((o) => o.id === whenOptionId);
      return { ...r, ...patch, whenLabel: opt?.label ?? r.whenLabel };
    });
    onUpdateQuestion(q.id, { jump: { fallback: q.jump?.fallback ?? 'next', rules } });
  }

  function removeRule(q: Question, ruleId: string) {
    onUpdateQuestion(q.id, {
      jump: { fallback: q.jump?.fallback ?? 'next', rules: (q.jump?.rules ?? []).filter((r) => r.id !== ruleId) },
    });
  }

  function updateCondition(screen: ThankYouScreen, patch: Partial<ThankYouCondition>) {
    onUpdateThankYou(screen.id, { condition: { ...screen.condition, ...patch } });
  }

  function updateNotification(id: string, patch: Partial<NotificationRule>) {
    onSetNotifications(notifications.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }

  function addNotification() {
    onSetNotifications([
      ...notifications,
      { id: `notif_${Date.now()}`, enabled: true, label: 'Nova notificação', email: '', operator: 'gte', value: 0 },
    ]);
  }

  function removeNotification(id: string) {
    onSetNotifications(notifications.filter((n) => n.id !== id));
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Jump Logic */}
        <Card>
          <SectionTitle icon={<GitBranch size={16} />} title="Jump Logic" subtitle="Desvie o fluxo conforme a resposta de perguntas de múltipla escolha ou lista suspensa." />
          {choiceQuestions.length === 0 && (
            <div style={{ fontFamily: ff.body, fontSize: 13, color: C.ink3 }}>
              Nenhuma pergunta de múltipla escolha ou lista suspensa no formulário ainda.
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {choiceQuestions.map((q) => (
              <div key={q.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 13.5, color: C.ink, marginBottom: 10 }}>{q.title}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {(q.jump?.rules ?? []).map((rule) => (
                    <div key={rule.id} style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>Se</span>
                      <Select
                        value={rule.whenOptionId}
                        onChange={(e) => updateRule(q, rule.id, { whenOptionId: e.target.value })}
                        style={{ width: 'auto', minWidth: 160 }}
                      >
                        {(q.options ?? []).map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </Select>
                      <span style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>pular para</span>
                      <Select
                        value={rule.targetId}
                        onChange={(e) => updateRule(q, rule.id, { targetId: e.target.value })}
                        style={{ width: 'auto', minWidth: 180 }}
                      >
                        {jumpTargets.map((t) => (
                          <option key={t.id} value={t.id}>{t.label}</option>
                        ))}
                      </Select>
                      <button onClick={() => removeRule(q, rule.id)} style={{ border: 'none', background: 'transparent', color: C.ink3, cursor: 'pointer', display: 'flex', marginLeft: 'auto' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addRule(q)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1.5px dashed ${C.border2}`, borderRadius: 8, background: 'transparent', color: C.ink2, fontFamily: ff.body, fontWeight: 700, fontSize: 12, padding: '6px 10px', cursor: 'pointer', width: 'fit-content' }}
                  >
                    <Plus size={12} /> Adicionar regra
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, paddingTop: 8, borderTop: `1px dashed ${C.border}` }}>
                    <span style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>Todos os outros casos vão para:</span>
                    <Select
                      value={q.jump?.fallback ?? 'next'}
                      onChange={(e) => onUpdateQuestion(q.id, { jump: { rules: q.jump?.rules ?? [], fallback: e.target.value } })}
                      style={{ width: 'auto', minWidth: 160 }}
                    >
                      <option value="next">Próxima pergunta</option>
                      {jumpTargets.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Thank You Screens condicionais */}
        <Card>
          <SectionTitle icon={<PartyPopper size={16} />} title="Thank You Screens condicionais" subtitle="Múltiplas telas finais, cada uma com sua condição de exibição — decisão de produto do CitraForm (não fixo em 2 como no QuillForms)." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {thankYouScreens.map((screen) => (
              <div key={screen.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: ff.body, fontWeight: 700, fontSize: 13.5, color: C.ink }}>{screen.title}</span>
                  {screen.condition.type === 'default' && <Badge tone="neutral">Fallback</Badge>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Select
                    value={screen.condition.type}
                    onChange={(e) => updateCondition(screen, { type: e.target.value as ThankYouCondition['type'] })}
                    style={{ width: 'auto', minWidth: 190 }}
                  >
                    <option value="default">Padrão (todos os outros casos)</option>
                    <option value="score_gte">Score maior ou igual a</option>
                    <option value="score_lt">Score menor que</option>
                    <option value="answer_equals">Resposta específica é igual a</option>
                  </Select>
                  {(screen.condition.type === 'score_gte' || screen.condition.type === 'score_lt') && (
                    <Input
                      type="number"
                      value={screen.condition.scoreValue ?? 0}
                      onChange={(e) => updateCondition(screen, { scoreValue: Number(e.target.value) })}
                      style={{ width: 80 }}
                    />
                  )}
                  {screen.condition.type === 'answer_equals' && (
                    <>
                      <Select
                        value={screen.condition.questionId ?? ''}
                        onChange={(e) => updateCondition(screen, { questionId: e.target.value })}
                        style={{ width: 'auto', minWidth: 160 }}
                      >
                        <option value="">Selecione a pergunta</option>
                        {choiceQuestions.map((q) => (
                          <option key={q.id} value={q.id}>{q.title}</option>
                        ))}
                      </Select>
                      <Select
                        value={screen.condition.optionId ?? ''}
                        onChange={(e) => updateCondition(screen, { optionId: e.target.value })}
                        style={{ width: 'auto', minWidth: 160 }}
                      >
                        <option value="">Selecione a opção</option>
                        {choiceQuestions.find((q) => q.id === screen.condition.questionId)?.options?.map((o) => (
                          <option key={o.id} value={o.id}>{o.label}</option>
                        ))}
                      </Select>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Calculator / Score */}
        <Card>
          <SectionTitle icon={<CalcIcon size={16} />} title="Calculator (Score)" subtitle="Pontuação acumulada por resposta — pontos por opção ficam no painel da própria pergunta (Perguntas → múltipla escolha)." />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontFamily: ff.body, fontSize: 13, fontWeight: 600, color: C.ink }}>Habilitar Calculator</span>
            <Toggle checked={calculator.enabled} onChange={(v) => onSetCalculator({ enabled: v })} />
          </div>
          {calculator.enabled && (
            <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Nome da variável</div>
                <Input value={calculator.variableName} onChange={(e) => onSetCalculator({ variableName: e.target.value })} />
              </div>
              <div style={{ width: 140, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ fontFamily: ff.body, fontSize: 12.5, fontWeight: 700, color: C.ink2 }}>Valor inicial</div>
                <Input type="number" value={calculator.initialValue} onChange={(e) => onSetCalculator({ initialValue: Number(e.target.value) })} />
              </div>
            </div>
          )}
          <div style={{ fontFamily: ff.body, fontSize: 12, fontWeight: 700, color: C.ink3, textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: 8 }}>
            Resumo de pontuação por pergunta
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {choiceQuestions.map((q) => (
              <div key={q.id} style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink2, display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                <strong style={{ color: C.ink }}>{q.title}:</strong>
                {(q.options ?? []).map((o) => (
                  <span key={o.id} style={{ background: C.cream2, borderRadius: 999, padding: '2px 8px' }}>{o.label} → {o.score ?? 0}pt</span>
                ))}
              </div>
            ))}
            {questions.filter((q) => !(q.kind === 'multiple_choice' || q.kind === 'dropdown')).length > 0 && (
              <div style={{ fontFamily: ff.body, fontSize: 11.5, color: C.ink3, fontStyle: 'italic' }}>
                Demais tipos de pergunta não suportam pontuação por opção.
              </div>
            )}
          </div>
        </Card>

        {/* Notificações condicionais */}
        <Card>
          <SectionTitle icon={<Bell size={16} />} title="Notificações por e-mail condicionais" subtitle="Dispara um e-mail apenas quando a condição sobre o Score é atendida." />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map((n) => (
              <div key={n.id} style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Toggle checked={n.enabled} onChange={(v) => updateNotification(n.id, { enabled: v })} />
                  <Input value={n.label} onChange={(e) => updateNotification(n.id, { label: e.target.value })} style={{ flex: 1, fontSize: 13, padding: '7px 10px' }} />
                  <button onClick={() => removeNotification(n.id)} style={{ border: 'none', background: 'transparent', color: C.ink3, cursor: 'pointer', display: 'flex' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>Enviar para</span>
                  <Input value={n.email} onChange={(e) => updateNotification(n.id, { email: e.target.value })} placeholder="email@makelemonad.com.br" style={{ width: 220, fontSize: 12.5, padding: '6px 10px' }} />
                  <span style={{ fontFamily: ff.body, fontSize: 12.5, color: C.ink3 }}>se {calculator.variableName || 'Score'}</span>
                  <Select
                    value={n.operator}
                    onChange={(e) => updateNotification(n.id, { operator: e.target.value as NotificationOperator })}
                    style={{ width: 'auto', minWidth: 150 }}
                  >
                    {(Object.keys(OPERATOR_LABELS) as NotificationOperator[]).map((op) => (
                      <option key={op} value={op}>{OPERATOR_LABELS[op]}</option>
                    ))}
                  </Select>
                  <Input type="number" value={n.value} onChange={(e) => updateNotification(n.id, { value: Number(e.target.value) })} style={{ width: 70, fontSize: 12.5, padding: '6px 10px' }} />
                </div>
              </div>
            ))}
            <button
              onClick={addNotification}
              style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1.5px dashed ${C.border2}`, borderRadius: 8, background: 'transparent', color: C.ink2, fontFamily: ff.body, fontWeight: 700, fontSize: 12.5, padding: '8px 12px', cursor: 'pointer', width: 'fit-content' }}
            >
              <Plus size={13} /> Adicionar notificação
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
