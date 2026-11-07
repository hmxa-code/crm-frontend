import React from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { VentureDeal, StagnationRiskMetric } from '@/src/types/rengrowcure/ventureMatrix';

interface StagnationRiskViewProps {
  metrics: StagnationRiskMetric[];
  deals: VentureDeal[];
  onTriggerEscalation: (deal: VentureDeal) => void;
}

export const StagnationRiskView: React.FC<StagnationRiskViewProps> = ({
  metrics,
  deals,
  onTriggerEscalation
}) => {
  const atRiskDeals = deals.filter(d => d.slaBreachRisk === 'High' || d.slaBreachRisk === 'Critical' || d.stagnationDays > 7);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Stage Velocity & SLA Risk Bounds</h3>
        <p className="text-xs text-slate-500 mb-4">
          Automated telemetry detects stuck deals exceeding stage dwell times and triggers Kinetic remediation tasks.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {metrics.map((sm) => (
            <div key={sm.stage} className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">{sm.stage}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  SLA: {sm.maxSlaAllowedDays}d max
                </span>
              </div>
              <div className="text-lg font-bold font-mono text-slate-900">
                {sm.avgDaysInStage} avg days
              </div>
              <div className="text-xs text-rose-600 font-semibold flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span>{sm.atRiskDealsCount} Deals at Risk</span>
                <span>${sm.totalValueAtRisk.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At-risk deals alert feed */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          High Risk / Stagnant Deals Requiring Action ({atRiskDeals.length})
        </h4>
        <div className="space-y-2">
          {atRiskDeals.map(d => (
            <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100 text-xs">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="text-rose-500 flex-shrink-0" size={16} />
                <div>
                  <strong className="text-slate-900">{d.accountName}</strong> — {d.dealTitle}
                  <p className="text-[11px] text-slate-500">
                    Stagnant for {d.stagnationDays} days in stage: <span className="font-semibold">{d.stage}</span> • Owner: {d.ownerName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900">${d.amount.toLocaleString()}</span>
                <button 
                  onClick={() => onTriggerEscalation(d)}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Trigger Escalation
                </button>
              </div>
            </div>
          ))}
          {atRiskDeals.length === 0 && (
            <div className="py-6 text-center text-slate-400 text-xs">
              No SLA breach or high stagnation deals detected! All pipelines moving on schedule.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
