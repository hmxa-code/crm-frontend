import React from 'react';
import { ContentStatus } from '@/src/types/marketing/content-engine';

interface ContentStatusBadgeProps {
  status: ContentStatus;
  size?: 'sm' | 'md';
}

export const ContentStatusBadge: React.FC<ContentStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStyle = () => {
    switch (status) {
      case 'Published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Publishing':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'Failed':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const px = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-wider ${px} ${getStyle()}`}>
      <span>•</span>
      <span>{status}</span>
    </span>
  );
};