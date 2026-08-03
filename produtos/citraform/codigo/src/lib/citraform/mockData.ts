import type { CitraForm } from './types';
import { C } from '@/components/ui/palette';

// Formulário de exemplo carregado no protótipo do builder — adaptado do fluxo real
// "Make Social" (Quill Forms) mapeado em produtos/citraform/briefings/analise-referencias-onboarding.md.
// Generalizado para "Qualificação de Lead" (não específico de social media), mantendo o mesmo
// padrão: pergunta de faturamento pontua o Score, e o resultado decide a Thank You Screen + tracking.
export const mockForm: CitraForm = {
  id: 'demo',
  title: 'Qualificação de Lead — Performance 360º',
  slug: 'qualificacao-lead',
  published: false,

  welcomeScreen: {
    title: 'Vamos entender sua próxima fase de crescimento',
    description:
      'Leva menos de 2 minutos. Com base nas suas respostas, te mostramos o caminho certo — e se fizer sentido, alguém do time entra em contato.',
    buttonLabel: 'Começar',
    showButton: true,
  },

  questions: [
    {
      id: 'q1',
      kind: 'short_text',
      title: 'Qual o seu nome?',
      required: true,
      layout: 'stack',
      minChars: 2,
      maxChars: 80,
    },
    {
      id: 'q2',
      kind: 'email',
      title: 'E qual é o seu e-mail?',
      description: 'Usamos só pra te enviar o diagnóstico.',
      required: true,
      layout: 'stack',
      restrictDomains: {
        enabled: true,
        mode: 'block',
        domains: ['gmail.com', 'hotmail.com'],
      },
    },
    {
      id: 'q3',
      kind: 'phone',
      title: 'Qual o seu WhatsApp?',
      required: true,
      layout: 'stack',
      defaultCountry: 'BR',
      allowOtherCountries: true,
    },
    {
      id: 'q4',
      kind: 'multiple_choice',
      title: 'Qual o faturamento mensal da empresa hoje?',
      required: true,
      layout: 'stack',
      allowMultiple: false,
      options: [
        { id: 'q4a', label: 'Até R$15 mil', score: 0 },
        { id: 'q4b', label: 'R$15 mil a R$45 mil', score: 5 },
        { id: 'q4c', label: 'R$45 mil a R$100 mil', score: 10 },
        { id: 'q4d', label: 'Acima de R$100 mil', score: 10 },
      ],
      jump: {
        rules: [{ id: 'r1', whenOptionId: 'q4a', whenLabel: 'Até R$15 mil', targetId: 'ty2' }],
        fallback: 'next',
      },
    },
    {
      id: 'q5',
      kind: 'multiple_choice',
      title: 'Você já investe em mídia paga (tráfego)?',
      required: true,
      layout: 'stack',
      allowMultiple: false,
      options: [
        { id: 'q5a', label: 'Sim, invisto atualmente', score: 5 },
        { id: 'q5b', label: 'Já investi, mas parei', score: 3 },
        { id: 'q5c', label: 'Nunca investi', score: 0 },
      ],
      jump: {
        rules: [{ id: 'r2', whenOptionId: 'q5c', whenLabel: 'Nunca investi', targetId: 'q7' }],
        fallback: 'next',
      },
    },
    {
      id: 'q6',
      kind: 'short_text',
      title: 'Quais canais você usa hoje?',
      description: 'Ex: Google Ads, Meta Ads, TikTok Ads...',
      required: false,
      layout: 'stack',
    },
    {
      id: 'q7',
      kind: 'opinion_scale',
      title: 'De 0 a 10, quão prioritário é crescer nos próximos 3 meses?',
      required: true,
      layout: 'stack',
      scaleMin: 0,
      scaleMax: 10,
      scaleMinLabel: 'Não é prioridade',
      scaleMaxLabel: 'Prioridade máxima',
    },
    {
      id: 'q8',
      kind: 'legal',
      title: 'Aceito ser contatado pela MakeLemonAd sobre esse diagnóstico',
      required: true,
      layout: 'stack',
    },
  ],

  thankYouScreens: [
    {
      id: 'ty1',
      title: 'Perfeito — seu diagnóstico está pronto',
      description: 'Você é um lead qualificado. Te chamamos agora no WhatsApp pra marcar uma conversa rápida.',
      condition: { type: 'score_gte', scoreValue: 10 },
      action: {
        type: 'redirect_whatsapp',
        whatsappNumber: '5511999999999',
        whatsappMessage: 'Oi! Acabei de responder o diagnóstico de performance da Make.',
      },
      autoRedirect: { enabled: true, delaySeconds: 2 },
      tracking: { google_ads: true, ga4: true, meta_pixel: true },
      fancyBorderRadius: true,
    },
    {
      id: 'ty2',
      title: 'Obrigado por compartilhar suas respostas',
      description: 'Ainda não é o momento ideal pra gente trabalhar juntos, mas guardamos seu contato — sempre bom ficar de olho no seu crescimento.',
      condition: { type: 'default' },
      action: { type: 'none' },
      autoRedirect: { enabled: false, delaySeconds: 0 },
      tracking: { google_ads: false, ga4: true, meta_pixel: false },
      fancyBorderRadius: false,
    },
  ],

  calculator: {
    enabled: true,
    variableName: 'Score',
    initialValue: 0,
  },

  notifications: [
    {
      id: 'n1',
      enabled: true,
      label: 'Novo Lead Qualificado',
      email: 'bruno@makelemonad.com.br',
      operator: 'gte',
      value: 10,
    },
  ],

  theme: {
    name: 'Make 001',
    accentColor: C.limeMid,
    backgroundColor: C.cream,
    buttonTextColor: C.ink,
    fontFamily: 'Plus Jakarta Sans',
    borderRadius: 10,
    progressBarColor: C.limeMid,
  },
};
