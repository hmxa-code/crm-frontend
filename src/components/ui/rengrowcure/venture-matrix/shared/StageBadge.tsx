import React from 'react';
import { DealStage } from '@/src/types/rengrowcure/ventureMatrix';

interface StageBadgeProps {
  stage: DealStage;
  className?: string;
}

const STAGE_STYLES: Record<DealStage, { bg: string; text: string; border: string }> = {
  'Discovery': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Value Prop': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Proposal': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Contract': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Closed Won': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Closed Lost': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const StageBadge: React.FC<StageBadgeProps> = ({ stage, className = '' }) => {
  const style = STAGE_STYLES[stage] || { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${style.bg} ${style.text} ${style.border} ${className}`}>
      {stage}
    </span>
  );
};
