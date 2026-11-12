import React from 'react';
import { DripCampaignStatus } from '@/src/types/marketing/drip-campaign';

interface DripStatusBadgeProps {
  status: DripCampaignStatus;
  size?: 'sm' | 'md';
}

export const DripStatusBadge: React.FC<DripStatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles: Record<DripCampaignStatus, { wrap: string; dot: string }> = {
    Active: {
      wrap: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500 animate-pulse',
    },
    Draft: {
      wrap: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
    Paused: {
      wrap: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500',
    },
    Completed: {
      wrap: 'bg-purple-50 text-purple-700 border-purple-200/80',
      dot: 'bg-purple-500',
    },
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const current = styles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${sizeClasses} ${current.wrap}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />
      <span>{status}</span>
    </span>
  );
};
