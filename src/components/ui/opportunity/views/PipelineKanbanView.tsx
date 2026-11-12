import React from 'react';
import { useOpportunityStore } from '@/src/stores/useOpportunityStore';
import { OpportunityCard } from '../shared/OpportunityCard';
import { usePipelineDnd } from '@/src/utils/usePipelineDnd';
import { Opportunity } from '@/src/types/dealflow/opportunity';

interface PipelineKanbanViewProps {
  stages: string[];
  opportunities: Opportunity[];
}

export function PipelineKanbanView({ stages, opportunities }: PipelineKanbanViewProps) {
  const { setSelectedDealId, openOverviewDrawer, moveOpportunityToStage } = useOpportunityStore();
  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, isDragOver } = usePipelineDnd();

  const getStageOpportunities = (stage: string) => 
    opportunities.filter(op => op.stage === stage);

  const getStageValue = (stage: string) => 
    getStageOpportunities(stage).reduce((sum, op) => sum + op.amount, 0);

  const handleStageDrop = (e: React.DragEvent, stage: string) => {
    const result = handleDrop(e, stage);
    if (result && result.opportunityId) {
      moveOpportunityToStage(result.opportunityId, stage);
    }
  };

  const handleSelectOpportunity = (id: string) => {
    setSelectedDealId(id);
    openOverviewDrawer();
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {stages.map((stage) => {
        const stageOps = getStageOpportunities(stage);
        const stageTotal = getStageValue(stage);
        const isOver = isDragOver(stage);

        return (
          <div 
            key={stage}
            className={`
              w-80 min-w-[300px] flex-shrink-0 rounded-2xl p-3 flex flex-col gap-3 transition-colors duration-200
              ${isOver ? 'bg-slate-200 border-2 border-black' : 'bg-slate-100 border border-slate-300'}
            `}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDrop={(e) => handleStageDrop(e, stage)}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-300">
              <div>
                <h3 className="text-xs font-bold text-slate-900">{stage}</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] font-mono font-bold text-slate-600">
                    ${stageTotal.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-300">
                    {stageOps.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Opportunities Container */}
            <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-340px)] no-scrollbar">
              {stageOps.map((op) => (
                <OpportunityCard
                  key={op.id}
                  opportunity={op}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  onSelect={() => handleSelectOpportunity(op.id)}
                />
              ))}

              {stageOps.length === 0 && (
                <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs font-medium">
                  No opportunities
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}