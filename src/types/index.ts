export const colorStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-700 border-l-4 border-blue-500 hover:bg-blue-100/80 transition-all",
  purple: "bg-purple-50 text-purple-700 border-l-4 border-purple-500 hover:bg-purple-100/80 transition-all",
  green: "bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500 hover:bg-emerald-100/80 transition-all",
  orange: "bg-orange-50 text-orange-700 border-l-4 border-orange-500 hover:bg-orange-100/80 transition-all",
  red: "bg-rose-50 text-rose-700 border-l-4 border-rose-500 hover:bg-rose-100/80 transition-all",
  gray: "bg-slate-50 text-slate-700 border-l-4 border-slate-400 hover:bg-slate-100/80 transition-all",
};

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'gray';
  allDay?: boolean;
}

export type CalendarView = 'month' | 'week' | 'day' | 'year' | 'agenda';

export const badgeColorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60 hover:bg-blue-100/70',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60 hover:bg-purple-100/70',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/70',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/60 hover:bg-orange-100/70',
  red: 'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/70',
  gray: 'bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100/70',
};

export const badgeDotStyles: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-400',
};