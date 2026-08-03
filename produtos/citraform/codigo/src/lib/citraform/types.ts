// Tipos do motor de formulário do CitraForm — protótipo de builder (fase 1, sem persistência).
// Modelo inspirado no mapeamento do Quill Forms (produtos/citraform/briefings/analise-referencias-onboarding.md),
// com a decisão já tomada de suportar N Thank You Screens condicionais (não fixo em 2).

export type QuestionKind =
  | 'short_text'
  | 'long_text'
  | 'email'
  | 'phone'
  | 'website'
  | 'number'
  | 'opinion_scale'
  | 'slider'
  | 'rating'
  | 'multiple_choice'
  | 'dropdown'
  | 'picture_choice'
  | 'date'
  | 'calendar_picker'
  | 'booking'
  | 'legal'
  | 'statement'
  | 'file_upload';

export type QuestionCategory =
  | 'texto'
  | 'contato'
  | 'numerico'
  | 'selecao'
  | 'data'
  | 'outros';

export interface QuestionTypeDef {
  kind: QuestionKind;
  label: string;
  category: QuestionCategory;
  description: string;
  icon: string; // nome do ícone lucide, resolvido no componente
  comingSoon?: boolean; // "requer instalação" no QuillForms
  badge?: 'novo';
}

export type Layout = 'stack' | 'float-right' | 'float-left' | 'split-right' | 'split-left';

export interface ChoiceOption {
  id: string;
  label: string;
  score?: number;
}

export interface JumpRule {
  id: string;
  /** id da opção (múltipla escolha/dropdown) ou valor textual (outros tipos) que dispara a regra */
  whenOptionId?: string;
  whenLabel: string;
  targetId: string; // id da pergunta ou de uma thank you screen
}

export interface JumpLogic {
  rules: JumpRule[];
  fallback: string; // 'next' ou id de pergunta/thank you screen
}

export interface Question {
  id: string;
  kind: QuestionKind;
  title: string;
  description?: string;
  required: boolean;
  layout: Layout;
  showAttachment?: boolean;
  customHtml?: string;
  // texto
  minChars?: number;
  maxChars?: number;
  // email
  restrictDomains?: {
    enabled: boolean;
    mode: 'block' | 'allow';
    domains: string[];
  };
  // phone
  defaultCountry?: string;
  allowOtherCountries?: boolean;
  // numérico / escala
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  ratingMax?: number;
  // seleção
  options?: ChoiceOption[];
  allowMultiple?: boolean;
  randomizeOptions?: boolean;
  // thank you (quando kind especial embutido na lista, tratado à parte via ThankYouScreen)
  jump?: JumpLogic;
}

export interface WelcomeScreen {
  title: string;
  description: string;
  buttonLabel: string;
  showButton: boolean;
}

export type TrackingProvider = 'google_ads' | 'ga4' | 'meta_pixel';

export interface ThankYouAction {
  type: 'none' | 'redirect_url' | 'redirect_whatsapp';
  url?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export interface ThankYouCondition {
  /** telas sem condição explícita caem no fallback — sempre deve haver 1 marcada como default */
  type: 'default' | 'score_gte' | 'score_lt' | 'answer_equals';
  scoreValue?: number;
  questionId?: string;
  optionId?: string;
}

export interface ThankYouScreen {
  id: string;
  title: string;
  description: string;
  condition: ThankYouCondition;
  action: ThankYouAction;
  autoRedirect: {
    enabled: boolean;
    delaySeconds: number;
  };
  tracking: Record<TrackingProvider, boolean>;
  fancyBorderRadius: boolean;
}

export interface CalculatorConfig {
  enabled: boolean;
  variableName: string;
  initialValue: number;
}

export type NotificationOperator = 'eq' | 'neq' | 'lt' | 'gt' | 'gte' | 'lte';

export interface NotificationRule {
  id: string;
  enabled: boolean;
  label: string;
  email: string;
  operator: NotificationOperator;
  value: number;
}

export interface ThemeConfig {
  name: string;
  accentColor: string;
  backgroundColor: string;
  buttonTextColor: string;
  fontFamily: string;
  borderRadius: number;
  progressBarColor: string;
}

export interface CitraForm {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  welcomeScreen: WelcomeScreen;
  questions: Question[];
  thankYouScreens: ThankYouScreen[];
  calculator: CalculatorConfig;
  notifications: NotificationRule[];
  theme: ThemeConfig;
}

export type BuilderTab =
  | 'perguntas'
  | 'logica'
  | 'design'
  | 'compartilhar'
  | 'respostas'
  | 'integracoes'
  | 'pagamentos';

/** id sentinela usado na lista lateral pra representar a Welcome Screen (não é uma Question de verdade) */
export const WELCOME_ID = '__welcome__';
