import React from 'react';
import { FiX, FiClock, FiCalendar, FiDollarSign, FiUser, FiActivity } from 'react-icons/fi';
import { VentureDeal } from '@/src/types/rengrowcure/ventureMatrix';
import { StageBadge } from '../shared/StageBadge';
import { SlaRiskBadge } from '../shared/SlaRiskBadge';

interface DealOverviewSheetProps {
  deal: VentureDeal | null;
  onClose: () => void;
}

export const DealOverviewSheet: React.FC<DealOverviewSheetProps> = ({
  deal,
  onClose
}) => {
  if (!deal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
                {deal.dealCode}
              </span>
              <StageBadge stage={deal.stage} />
              <SlaRiskBadge risk={deal.slaBreachRisk} />
            </div>
            <h3 className="text-base font-bold text-slate-900">{deal.accountName}</h3>
            <p className="text-xs text-slate-500">{deal.dealTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total ARR</span>
            <span className="text-sm font-mono font-bold text-slate-900">${deal.amount.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">MRR</span>
            <span className="text-sm font-mono font-bold text-indigo-600">${deal.mrr.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Probability</span>
            <span className="text-sm font-mono font-bold text-cyan-600">{deal.closeProbability}%</span>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="space-y-2.5 text-xs text-slate-700">
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5"><FiUser size={13} /> Account Executive</span>
            <span className="font-semibold text-slate-900">{deal.ownerName}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5"><FiCalendar size={13} /> Expected Close Date</span>
            <span className="font-mono font-semibold text-slate-900">{deal.expectedCloseDate}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5"><FiClock size={13} /> Stagnation Dwell</span>
            <span className="font-semibold text-slate-900">{deal.stagnationDays} days in stage</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-1.5"><FiActivity size={13} /> Deal Health Score</span>
            <span className="font-mono font-bold text-emerald-600">{deal.healthScore}/100</span>
          </div>
          <div className="py-1.5 border-b border-slate-100">
            <span className="text-slate-500 block mb-0.5">Last Touchpoint</span>
            <p className="text-slate-800 font-medium">{deal.lastTouchpoint}</p>
          </div>
          {deal.notes && (
            <div className="py-1.5">
              <span className="text-slate-500 block mb-0.5">Strategic Notes</span>
              <p className="text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{deal.notes}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
