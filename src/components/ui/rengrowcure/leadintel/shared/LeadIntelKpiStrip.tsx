'use client';

import React from 'react';

interface LeadIntelKpiStripProps {
  totalModels: number;
  activeRules: number;
  avgLatency: string;
  clusterStatus: string;
}

export default function LeadIntelKpiStrip({ 
  totalModels = 4, 
  activeRules = 4, 
  avgLatency = '16ms', 
  clusterStatus = 'Active' 
}: LeadIntelKpiStripProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="bg-white border border-slate-200/80 rounded p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Scoring Models</span>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{totalModels} Deployed</div>
        </div>
        <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-100">
          Active
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotion Rules</span>
          <div className="text-sm font-bold text-slate-900 mt-0.5">{activeRules} Active Rules</div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          Live
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telemetry Latency</span>
          <div className="text-sm font-mono font-bold text-slate-900 mt-0.5">{avgLatency}</div>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Sub-25ms
        </span>
      </div>

      <div className="bg-white border border-slate-200/80 rounded p-3.5 shadow-2xs flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cluster Sync</span>
          <div className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {clusterStatus}
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
          Synced
        </span>
      </div>
    </div>
  );
}