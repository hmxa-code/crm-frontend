import React from 'react';
import { FiDollarSign, FiTrendingUp, FiUsers, FiCheckCircle } from 'react-icons/fi';

interface OpportunityKpiStripProps {
  totalPipelineValue: number;
  weightedForecast: number;
  totalDeals: number;
  closedWon: number;
  winRate: number;
}

export function OpportunityKpiStrip({
  totalPipelineValue,
  weightedForecast,
  totalDeals,
  closedWon,
  winRate
}: OpportunityKpiStripProps) {
  const kpiItems = [
    {
      icon: FiDollarSign,
      label: 'Total Pipeline',
      value: `$${totalPipelineValue.toLocaleString()}`,
      subValue: 'Active deals in pipeline',
    },
    {
      icon: FiTrendingUp,
      label: 'Weighted Forecast',
      value: `$${weightedForecast.toLocaleString()}`,
      subValue: 'Probability-adjusted value',
    },
    {
      icon: FiUsers,
      label: 'Active Opportunities',
      value: totalDeals.toString(),
      subValue: 'Current deals',
    },
    {
      icon: FiCheckCircle,
      label: 'Win Rate',
      value: `${winRate}%`,
      subValue: `${closedWon} closed won`,
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpiItems.map((kpi, idx) => (
        <div 
          key={idx}
          className="bg-white border border-slate-300 rounded-2xl p-4 shadow-xs hover:border-slate-400 transition-all cursor-default"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 flex items-center justify-center">
              <kpi.icon size={15} />
            </div>
            <span className="text-xs font-bold text-slate-500">{kpi.label}</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono">{kpi.value}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{kpi.subValue}</div>
        </div>
      ))}
    </div>
  );
}