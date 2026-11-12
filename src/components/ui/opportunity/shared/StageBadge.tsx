import React from 'react';
import { DealStage } from '@/src/types/dealflow/opportunity';

export function StageBadge({ stage }: { stage: DealStage }) {
  return (
    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-300 bg-slate-100 text-slate-900 tracking-wider">
      {stage}
    </span>
  );
}