import React from 'react';
import { FiTrendingUp, FiAlertTriangle, FiDollarSign, FiClock } from 'react-icons/fi';
import { VentureDeal } from '@/src/types/rengrowcure/ventureMatrix';

interface VentureKpiStripProps {
  deals: VentureDeal[];
  totalPipelineValue: number;
  weightedForecast: number;
}

export const VentureKpiStrip: React.FC<VentureKpiStripProps> = ({
  deals,
  totalPipelineValue,
  weightedForecast
}) => {
  const atRiskValue = deals
    .filter(d => d.slaBreachRisk === 'High' || d.slaBreachRisk === 'Critical')
    .reduce((a, b) => a + b.amount, 0);

  const avgMrr = deals.length > 0 ? Math.round(totalPipelineValue / deals.length / 12) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Total Pipeline Value
        </span>
        <div className="text-xl font-bold font-mono text-slate-900 mt-1">
          ${totalPipelineValue.toLocaleString()}
        </div>
        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
          <FiTrendingUp size={11} /> Active in qualified pipeline
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Weighted Close Forecast
        </span>
        <div className="text-xl font-bold font-mono text-cyan-600 mt-1">
          ${Math.round(weightedForecast).toLocaleString()}
        </div>
        <span className="text-[10px] text-slate-500 font-medium mt-1 block">
          Probability adjusted ARR
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          Average Deal MRR
        </span>
        <div className="text-xl font-bold font-mono text-indigo-600 mt-1">
          ${avgMrr.toLocaleString()}
        </div>
        <span className="text-[10px] text-slate-500 font-medium mt-1 block">
          Contracted monthly run-rate
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
          At-Risk Stalled Value
        </span>
        <div className="text-xl font-bold font-mono text-rose-600 mt-1">
          ${atRiskValue.toLocaleString()}
        </div>
        <span className="text-[10px] text-rose-600 font-semibold flex items-center gap-1 mt-1">
          <FiAlertTriangle size={11} /> Requires rep intervention
        </span>
      </div>
    </div>
  );
};
