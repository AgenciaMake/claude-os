import {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Globe,
  Hash,
  BarChart3,
  SlidersHorizontal,
  Star,
  ListChecks,
  ChevronDown,
  Image,
  Calendar,
  CalendarClock,
  CalendarCheck,
  ScrollText,
  FileText,
  Upload,
  MessageSquare,
  PartyPopper,
  Layers,
  type LucideIcon,
} from 'lucide-react';

// Resolve o nome de ícone (string) usado no catálogo de tipos para o componente Lucide real.
export const ICONS: Record<string, LucideIcon> = {
  Type,
  AlignLeft,
  Mail,
  Phone,
  Globe,
  Hash,
  BarChart3,
  SlidersHorizontal,
  Star,
  ListChecks,
  ChevronDown,
  Image,
  Calendar,
  CalendarClock,
  CalendarCheck,
  ScrollText,
  FileText,
  Upload,
  MessageSquare,
  PartyPopper,
  Layers,
};

export function getIcon(name: string): LucideIcon {
  return ICONS[name] ?? Type;
}
