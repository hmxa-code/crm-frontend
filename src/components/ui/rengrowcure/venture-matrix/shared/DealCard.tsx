import React from 'react';
import { VentureDeal, DealStage } from '@/src/types/rengrowcure/ventureMatrix';
import { SlaRiskBadge } from '../shared/SlaRiskBadge';

interface DealCardProps {
  deal: VentureDeal;
  stages: DealStage[];
  onMoveStage: (dealId: string, direction: 'prev' | 'next') => void;
  onSelectDeal?: (deal: VentureDeal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  stages,
  onMoveStage,
  onSelectDeal
}) => {
  return (
    <div 
      onClick={() => onSelectDeal?.(deal)}
      className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-xs space-y-2.5 hover:border-cyan-400 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100">
          {deal.dealCode}
        </span>
        <SlaRiskBadge risk={deal.slaBreachRisk} />
      </div>

      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-tight">
          {deal.accountName}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
          {deal.dealTitle}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
        <span className="font-mono font-bold text-slate-900">
          ${deal.amount.toLocaleString()}
        </span>
        <span className="font-mono text-[11px] text-slate-500">
          Prob: {deal.closeProbability}%
        </span>
      </div>

      {/* Rep & Stage Controls */}
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center">
            {deal.ownerAvatar || 'U'}
          </div>
          <span className="text-slate-600 truncate max-w-[80px]">{deal.ownerName}</span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onMoveStage(deal.id, 'prev')}
            disabled={deal.stage === stages[0]}
            className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
            title="Previous Stage"
          >
            &larr;
          </button>
          <button
            onClick={() => onMoveStage(deal.id, 'next')}
            disabled={deal.stage === stages[stages.length - 1]}
            className="p-1 text-cyan-600 hover:text-cyan-800 disabled:opacity-30 cursor-pointer font-bold"
            title="Advance Stage"
          >
            &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
