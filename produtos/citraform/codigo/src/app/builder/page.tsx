'use client';

import { useState } from 'react';
import { C } from '@/components/ui/palette';
import TopBar from '@/components/builder/TopBar';
import QuestionSidebar from '@/components/builder/QuestionSidebar';
import AddQuestionModal from '@/components/builder/AddQuestionModal';
import QuestionEditor from '@/components/builder/QuestionEditor';
import WelcomeEditor from '@/components/builder/WelcomeEditor';
import ThankYouEditor from '@/components/builder/ThankYouEditor';
import LogicPanel from '@/components/builder/LogicPanel';
import DesignPanel from '@/components/builder/DesignPanel';
import SharePanel from '@/components/builder/SharePanel';
import ResultsPanel from '@/components/builder/ResultsPanel';
import IntegrationsPanel from '@/components/builder/IntegrationsPanel';
import PaymentsPanel from '@/components/builder/PaymentsPanel';
import { mockForm } from '@/lib/citraform/mockData';
import { typeDef } from '@/lib/citraform/typeCatalog';
import type { BuilderTab, CitraForm, Question, QuestionKind, ThankYouScreen } from '@/lib/citraform/types';
import { WELCOME_ID } from '@/lib/citraform/types';

function createQuestion(kind: QuestionKind): Question {
  const def = typeDef(kind);
  const base: Question = {
    id: `q_${Date.now()}`,
    kind,
    title: def?.label ?? 'Nova pergunta',
    required: false,
    layout: 'stack',
  };
  if (kind === 'multiple_choice' || kind === 'dropdown') {
    base.options = [
      { id: `opt_${Date.now()}_1`, label: 'Opção 1', score: 0 },
      { id: `opt_${Date.now()}_2`, label: 'Opção 2', score: 0 },
    ];
  }
  if (kind === 'opinion_scale' || kind === 'slider') {
    base.scaleMin = 0;
    base.scaleMax = 10;
  }
  if (kind === 'rating') {
    base.ratingMax = 5;
  }
  if (kind === 'phone') {
    base.defaultCountry = 'BR';
    base.allowOtherCountries = true;
  }
  return base;
}

function createThankYouScreen(index: number): ThankYouScreen {
  return {
    id: `ty_${Date.now()}`,
    title: `Nova Thank You Screen ${index}`,
    description: 'Obrigado por responder!',
    condition: { type: 'default' },
    action: { type: 'none' },
    autoRedirect: { enabled: false, delaySeconds: 0 },
    tracking: { google_ads: false, ga4: false, meta_pixel: false },
    fancyBorderRadius: false,
  };
}

export default function BuilderPage() {
  const [form, setForm] = useState<CitraForm>(mockForm);
  const [activeTab, setActiveTab] = useState<BuilderTab>('perguntas');
  const [selectedId, setSelectedId] = useState<string>(mockForm.questions[0]?.id ?? WELCOME_ID);
  const [modalOpen, setModalOpen] = useState(false);

  function updateQuestion(id: string, patch: Partial<Question>) {
    setForm((f) => ({ ...f, questions: f.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)) }));
  }

  function updateThankYou(id: string, patch: Partial<ThankYouScreen>) {
    setForm((f) => ({ ...f, thankYouScreens: f.thankYouScreens.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
  }

  function handleAddQuestion(kind: QuestionKind) {
    const q = createQuestion(kind);
    setForm((f) => ({ ...f, questions: [...f.questions, q] }));
    setSelectedId(q.id);
    setModalOpen(false);
  }

  function handleDeleteQuestion(id: string) {
    setForm((f) => ({ ...f, questions: f.questions.filter((q) => q.id !== id) }));
    if (selectedId === id) setSelectedId(WELCOME_ID);
  }

  function handleAddThankYou() {
    const t = createThankYouScreen(form.thankYouScreens.length + 1);
    setForm((f) => ({ ...f, thankYouScreens: [...f.thankYouScreens, t] }));
    setSelectedId(t.id);
  }

  const selectedQuestion = form.questions.find((q) => q.id === selectedId);
  const selectedThankYou = form.thankYouScreens.find((t) => t.id === selectedId);
  const selectedIndex = selectedQuestion ? form.questions.findIndex((q) => q.id === selectedId) : -1;

  return (
    <div style={{ height: '100dvh', display: 'flex', flexDirection: 'column', background: C.cream }}>
      <TopBar
        formTitle={form.title}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        published={form.published}
        onPublish={() => setForm((f) => ({ ...f, published: !f.published }))}
      />

      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {activeTab === 'perguntas' && (
          <>
            <QuestionSidebar
              questions={form.questions}
              thankYouScreens={form.thankYouScreens}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onReorder={(questions) => setForm((f) => ({ ...f, questions }))}
              onAddQuestion={() => setModalOpen(true)}
              onAddThankYou={handleAddThankYou}
              onDeleteQuestion={handleDeleteQuestion}
            />
            <div style={{ flex: 1, display: 'flex', minHeight: 0, background: C.white }}>
              {selectedId === WELCOME_ID && (
                <WelcomeEditor
                  welcome={form.welcomeScreen}
                  onChange={(patch) => setForm((f) => ({ ...f, welcomeScreen: { ...f.welcomeScreen, ...patch } }))}
                />
              )}
              {selectedQuestion && (
                <QuestionEditor
                  question={selectedQuestion}
                  index={selectedIndex}
                  onChange={(patch) => updateQuestion(selectedQuestion.id, patch)}
                />
              )}
              {selectedThankYou && (
                <ThankYouEditor
                  screen={selectedThankYou}
                  onChange={(patch) => updateThankYou(selectedThankYou.id, patch)}
                  onGoToLogic={() => setActiveTab('logica')}
                />
              )}
            </div>
          </>
        )}

        {activeTab === 'logica' && (
          <LogicPanel
            questions={form.questions}
            thankYouScreens={form.thankYouScreens}
            calculator={form.calculator}
            notifications={form.notifications}
            onUpdateQuestion={updateQuestion}
            onUpdateThankYou={updateThankYou}
            onSetCalculator={(patch) => setForm((f) => ({ ...f, calculator: { ...f.calculator, ...patch } }))}
            onSetNotifications={(notifications) => setForm((f) => ({ ...f, notifications }))}
          />
        )}

        {activeTab === 'design' && (
          <DesignPanel theme={form.theme} onChange={(patch) => setForm((f) => ({ ...f, theme: { ...f.theme, ...patch } }))} />
        )}

        {activeTab === 'compartilhar' && <SharePanel slug={form.slug} />}
        {activeTab === 'respostas' && <ResultsPanel questions={form.questions} />}
        {activeTab === 'integracoes' && <IntegrationsPanel />}
        {activeTab === 'pagamentos' && <PaymentsPanel />}
      </div>

      {modalOpen && <AddQuestionModal onClose={() => setModalOpen(false)} onPick={handleAddQuestion} />}
    </div>
  );
}
