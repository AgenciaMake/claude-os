import type { QuestionTypeDef } from './types';

// Catálogo de tipos de pergunta do modal "Adicionar pergunta" — espelha a seção 4
// do relatório de análise (produtos/citraform/briefings/analise-referencias-onboarding.md),
// incluindo os tipos marcados como "requer instalação" no Quill Forms (aqui: comingSoon).
export const QUESTION_TYPES: QuestionTypeDef[] = [
  // Texto
  { kind: 'short_text', label: 'Texto curto', category: 'texto', icon: 'Type', description: 'Resposta em uma linha' },
  { kind: 'long_text', label: 'Texto longo', category: 'texto', icon: 'AlignLeft', description: 'Resposta em parágrafo' },

  // Contato
  { kind: 'email', label: 'E-mail', category: 'contato', icon: 'Mail', description: 'Com restrição de domínio' },
  { kind: 'phone', label: 'Telefone', category: 'contato', icon: 'Phone', description: 'Com DDI padrão' },
  { kind: 'website', label: 'Site', category: 'contato', icon: 'Globe', description: 'URL validada' },

  // Numérico / escala
  { kind: 'number', label: 'Número', category: 'numerico', icon: 'Hash', description: 'Resposta numérica' },
  { kind: 'opinion_scale', label: 'Escala de opinião', category: 'numerico', icon: 'BarChart3', description: 'Escala 0–10' },
  { kind: 'slider', label: 'Slider', category: 'numerico', icon: 'SlidersHorizontal', description: 'Arrastar até um valor' },
  { kind: 'rating', label: 'Avaliação', category: 'numerico', icon: 'Star', description: 'Estrelas ou corações' },

  // Seleção
  { kind: 'multiple_choice', label: 'Múltipla escolha', category: 'selecao', icon: 'ListChecks', description: 'Uma ou várias opções' },
  { kind: 'dropdown', label: 'Lista suspensa', category: 'selecao', icon: 'ChevronDown', description: 'Selecionar da lista' },
  { kind: 'picture_choice', label: 'Escolha por imagem', category: 'selecao', icon: 'Image', description: 'Opções com imagem', comingSoon: true },

  // Data / agenda
  { kind: 'date', label: 'Data', category: 'data', icon: 'Calendar', description: 'Seletor de data' },
  { kind: 'calendar_picker', label: 'Calendário', category: 'data', icon: 'CalendarClock', description: 'Escolher data no calendário', comingSoon: true },
  { kind: 'booking', label: 'Agendamento Citra', category: 'data', icon: 'CalendarCheck', description: 'Alternativa ao Calendly', badge: 'novo' },

  // Outros
  { kind: 'legal', label: 'Termo legal', category: 'outros', icon: 'ScrollText', description: 'Aceite de termos' },
  { kind: 'statement', label: 'Bloco informativo', category: 'outros', icon: 'FileText', description: 'Texto sem resposta' },
  { kind: 'file_upload', label: 'Upload de arquivo', category: 'outros', icon: 'Upload', description: 'Anexar arquivo' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  texto: 'Texto',
  contato: 'Contato',
  numerico: 'Numérico / Escala',
  selecao: 'Seleção',
  data: 'Data / Agenda',
  outros: 'Outros',
};

export const CATEGORY_ORDER = ['texto', 'contato', 'numerico', 'selecao', 'data', 'outros'] as const;

export function typeDef(kind: string): QuestionTypeDef | undefined {
  return QUESTION_TYPES.find((t) => t.kind === kind);
}
