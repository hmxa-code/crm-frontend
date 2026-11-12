import React from 'react';
import { Opportunity } from '@/src/types/dealflow/opportunity';
import { SlaRiskBadge } from './SlaRiskBadge';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onDragStart?: (e: React.DragEvent, id: string) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onSelect?: () => void;
}

export function OpportunityCard({
  opportunity,
  onDragStart,
  onDragEnd,
  onSelect
}: OpportunityCardProps) {
  return (
    <div 
      draggable
      onDragStart={(e) => onDragStart?.(e, opportunity.id)}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      className="
        bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs space-y-2.5
        hover:border-black transition-all cursor-grab active:cursor-grabbing
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
          {opportunity.dealCode}
        </span>
        <SlaRiskBadge risk={opportunity.slaBreachRisk} />
      </div>

      {/* Account & Title */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 leading-tight">
          {opportunity.accountName}
        </h4>
        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
          {opportunity.dealTitle}
        </p>
      </div>

      {/* Financial Info */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-xs">
        <span className="font-mono font-bold text-slate-900">
          ${opportunity.amount.toLocaleString()}
        </span>
        <span className="font-mono text-[11px] text-slate-500 font-semibold">
          Prob: {opportunity.closeProbability}%
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 text-[11px]">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
            {opportunity.ownerAvatar || 'U'}
          </div>
          <span className="text-slate-600 truncate max-w-[90px] font-medium">{opportunity.ownerName}</span>
        </div>
      </div>
    </div>
  );
}