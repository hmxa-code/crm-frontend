'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCRMSettings, type CRMSettings } from '@/src/utils/crmSettings';

interface RenGrowCureHeaderProps {
  currentModule: string;
  badge?: string;
}

export const RENGROWCURE_SUBMODULES = [
  { id: 'leadintel', label: 'LeadIntel', href: '/rengrowcure/leadintel' },
  { id: 'distroengine', label: 'DistroEngine', href: '/rengrowcure/distroengine' },
  { id: 'venture-matrix', label: 'Venture Matrix', href: '/rengrowcure/venture-matrix' },
  { id: 'outreach-sequences', label: 'Outreach Sequences', href: '/rengrowcure/outreach-sequences' },
  { id: 'chronos', label: 'Chronos', href: '/rengrowcure/chronos' },
  { id: 'kinetics', label: 'Kinetics', href: '/rengrowcure/kinetics' },
  { id: 'reportscure', label: 'ReportsCure', href: '/rengrowcure/reportscure' },
];

export default function RenGrowCureHeader({ currentModule, badge }: RenGrowCureHeaderProps) {
  const pathname = usePathname();
  const [crmSettings, setCrmSettings] = useState<CRMSettings>(getCRMSettings());

  useEffect(() => {
    const update = () => setCrmSettings(getCRMSettings());
    update();
    window.addEventListener('crm-settings-updated', update);
    return () => window.removeEventListener('crm-settings-updated', update);
  }, []);

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded p-6 shadow-xs mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">RenGrowCure Commercial Operations</h1>
            {/* <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-700 border border-cyan-200 uppercase tracking-wider">
              {badge || 'Enterprise Suite'}
            </span> */}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unified Commercial Intelligence, SLA Engines, Predictive Routing & Real-Time Telemetry.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded self-start lg:self-center">
          <span className="w-1.5 h-1.5 rounded bg-emerald-500"></span>
          <span className="text-xs font-semibold text-slate-700">Cluster Sync: Active</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-mono text-slate-500">18ms</span>
        </div>
      </div>

      {/* Submodules Navigation Tabs (CRM Settings Style) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
        {RENGROWCURE_SUBMODULES.map((sub) => {
          const isActive = pathname.startsWith(sub.href);

          return (
            <Link
              key={sub.id}
              href={sub.href}
              className={`text-xs px-4 py-2 rounded font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'text-white shadow-lg'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              style={{
                backgroundColor: isActive ? crmSettings.primaryColor : 'rgba(241, 245, 249, 0.6)',
                color: isActive ? '#ffffff' : undefined,
              }}
            >
              {sub.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}