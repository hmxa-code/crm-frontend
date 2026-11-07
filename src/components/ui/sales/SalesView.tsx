'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FiAward, 
  FiGitCommit, 
  FiTrendingUp, 
  FiLayers, 
  FiActivity, 
  FiCheckSquare, 
  FiBarChart2,
  FiArrowRight,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';

const QUICK_MODULES = [
  { id: 'leadintel', label: 'LeadIntel', href: '/rengrowcure/leadintel', icon: FiAward, desc: 'Scoring Matrix' },
  { id: 'distroengine', label: 'DistroEngine', href: '/rengrowcure/distroengine', icon: FiGitCommit, desc: 'Routing Rules' },
  { id: 'venture-matrix', label: 'Venture Matrix', href: '/rengrowcure/venture-matrix', icon: FiTrendingUp, desc: 'Deals & Pipeline' },
  { id: 'outreach-sequences', label: 'Sequences', href: '/rengrowcure/outreach-sequences', icon: FiLayers, desc: 'Automated Cadences' },
  { id: 'chronos', label: 'Chronos', href: '/rengrowcure/chronos', icon: FiActivity, desc: 'Touchpoint Audit' },
  { id: 'kinetics', label: 'Kinetics', href: '/rengrowcure/kinetics', icon: FiCheckSquare, desc: 'SLA Workstation' },
  { id: 'reportscure', label: 'ReportsCure', href: '/rengrowcure/reportscure', icon: FiBarChart2, desc: 'Revenue Analytics' },
];

export default function SalesView() {
  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Compact Header for Multi-Window Column */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl space-y-1 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="font-bold flex items-center gap-1.5 text-cyan-400">
            <FiZap size={14} /> RenGrowCure
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
            Active Sync
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Commercial operations suite with predictive scoring, SLA engines & multi-window telemetry.
        </p>
      </div>

      {/* Quick Access Submodules */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1 block">
          Commercial Modules
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {QUICK_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-cyan-400 hover:shadow-2xs transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-slate-50 text-slate-700 group-hover:bg-cyan-50 group-hover:text-cyan-600 transition-colors">
                    <Icon size={14} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {mod.label}
                    </div>
                    <div className="text-[10px] text-slate-500">{mod.desc}</div>
                  </div>
                </div>
                <FiArrowRight size={12} className="text-slate-400 group-hover:text-cyan-600 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Live Telemetry Snapshot */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
          <span>Active Pipeline Value</span>
          <span className="font-mono font-bold text-emerald-600">$706,000</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
          <span>SLA Adherence Rate</span>
          <span className="font-mono font-bold text-cyan-700">94.2%</span>
        </div>
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
          <span>Active Reps Available</span>
          <span className="font-mono font-bold text-slate-900">4 / 5</span>
        </div>
      </div>
    </div>
  );
}
