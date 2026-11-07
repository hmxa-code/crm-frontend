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
  FiArrowUpRight
} from 'react-icons/fi';
import RenGrowCureHeader, { RENGROWCURE_SUBMODULES } from './shared/RenGrowCureHeader';

interface SubmoduleItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ElementType;
  tagline?: string;
}

const SUBMODULE_ICONS: Record<string, React.ElementType> = {
  'leadintel': FiAward,
  'distroengine': FiGitCommit,
  'venture-matrix': FiTrendingUp,
  'outreach-sequences': FiLayers,
  'chronos': FiActivity,
  'kinetics': FiCheckSquare,
  'reportscure': FiBarChart2,
};

const SUBMODULE_TAGLINES: Record<string, string> = {
  'leadintel': 'Multi-signal predictive lead scoring matrix with real-time intent telemetry.',
  'distroengine': 'Rule-based algorithmic distribution engine with strict SLA governance.',
  'venture-matrix': 'Pipeline velocity modeling, deal health indexes & attribution tracking.',
  'outreach-sequences': 'Orchestrated omnichannel sales cadences with adaptive timing.',
  'chronos': 'Temporal event sequencing, bi-directional calendar sync & scheduling.',
  'kinetics': 'High-velocity task automation fabric with self-escalating triggers.',
  'reportscure': 'Unified executive KPI analytics, win-rate forecasts & immutable audit trails.',
};

export default function RenGrowCureDashboardView() {
  // Pehle 6 operational execution modules (3 columns x 2 rows)
  const standardModules = RENGROWCURE_SUBMODULES.slice(0, 6);
  // 7th module (ReportsCure) jo top featured analytics suite banega
  const featuredModule = RENGROWCURE_SUBMODULES[6];

  const FeaturedIcon = featuredModule 
    ? (featuredModule.icon || SUBMODULE_ICONS[featuredModule.id] || FiBarChart2) 
    : FiBarChart2;

  return (
    <div className="w-full space-y-6 px-1 pb-16 font-sans text-slate-900 antialiased">
      {/* 1. Top Header */}
      <RenGrowCureHeader currentModule="dashboard" badge="Commercial Ops Suite" />

      {/* 2. Key Metrics Row (4 equal KPI boxes) */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Active Cadences', value: '1,428', change: '+12% vs last wk' },
          { label: 'Routed Opportunities', value: '$8.4M', change: 'Real-time velocity' },
          { label: 'Avg Dispatch Time', value: '42ms', change: '99.9th percentile' },
          { label: 'Compliance Score', value: '100%', change: 'Zero SLA breaches' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs"
          >
            <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{stat.label}</div>
            <div className="my-1 text-2xl font-bold tracking-tight text-slate-900">{stat.value}</div>
            <div className="text-[11px] font-medium text-emerald-600">{stat.change}</div>
          </div>
        ))}
      </section>

      {/* 3. Executive Intelligence Strip (ReportsCure - Placed on Top) */}
      {featuredModule && (
        <section className="space-y-2">
          <div className="px-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Executive Intelligence & Audit
          </div>
          <Link
            href={featuredModule.href}
            className="group flex flex-col justify-between gap-4 rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md sm:flex-row sm:items-center"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                <FeaturedIcon size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-slate-900">
                    {featuredModule.label}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200/60 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    LIVE TELEMETRY
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {featuredModule.tagline || SUBMODULE_TAGLINES[featuredModule.id]}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:border-0 sm:pt-0">
              <span className="font-mono text-[11px] text-slate-400">/{featuredModule.id}</span>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-700 group-hover:text-slate-950">
                Launch Intelligence Suite
                <FiArrowUpRight size={15} />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* 4. Core Operational Engines Grid (6 Modules = 3x2 Perfect Grid) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Core Operational Engines
          </h2>
          <span className="text-xs font-medium text-slate-400">6 Specialized Modules</span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {standardModules.map((sub: SubmoduleItem) => {
            const Icon = sub.icon || SUBMODULE_ICONS[sub.id] || FiAward;
            const tagline = sub.tagline || SUBMODULE_TAGLINES[sub.id] || 'Operational submodule.';

            return (
              <Link
                key={sub.id}
                href={sub.href}
                className="group flex h-[190px] flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-150 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Icon + Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      <Icon size={17} />
                    </div>
                    
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200/60 bg-emerald-50/70 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      ACTIVE
                    </span>
                  </div>

                  {/* Title & Description with Fixed 2-Line Height */}
                  <div className="mt-3">
                    <h3 className="flex items-center justify-between text-sm font-semibold tracking-tight text-slate-900">
                      <span>{sub.label}</span>
                      <FiArrowUpRight size={15} className="text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-900" />
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {tagline}
                    </p>
                  </div>
                </div>

                {/* Footer (Aligned across all cards) */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="font-mono text-[11px] text-slate-400">/{sub.id}</span>
                  <span className="font-semibold text-slate-700 transition-colors group-hover:text-slate-950">
                    Open Engine →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}