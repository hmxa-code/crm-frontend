import React from 'react';
import { VentureDeal, DealStage } from '@/src/types/rengrowcure/ventureMatrix';
import { DealCard } from '../shared/DealCard';

interface PipelineKanbanViewProps {
  stages: DealStage[];
  deals: VentureDeal[];
  onMoveStage: (dealId: string, direction: 'prev' | 'next') => void;
  onSelectDeal?: (deal: VentureDeal) => void;
}

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  stages,
  deals,
  onMoveStage,
  onSelectDeal
}) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
      {stages.map((stage) => {
        const stageDeals = deals.filter(d => d.stage === stage);
        const stageTotal = stageDeals.reduce((sum, d) => sum + d.amount, 0);

        return (
          <div 
            key={stage}
            className="w-72 min-w-[280px] flex-shrink-0 bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3 flex flex-col gap-3"
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{stage}</h3>
                <span className="text-[11px] font-mono font-bold text-slate-500">
                  ${stageTotal.toLocaleString()}
                </span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-2xs border border-slate-200">
                {stageDeals.length}
              </span>
            </div>

            {/* Deal Cards */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] scrollbar-none">
              {stageDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  stages={stages}
                  onMoveStage={onMoveStage}
                  onSelectDeal={onSelectDeal}
                />
              ))}

              {stageDeals.length === 0 && (
                <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                  No deals in {stage}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
