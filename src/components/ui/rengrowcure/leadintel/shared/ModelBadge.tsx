'use client';

import React from 'react';

interface ModelBadgeProps {
  status?: 'Active' | 'Draft' | 'Deprecated';
  tier?: 'Enterprise' | 'Mid-Market' | 'SMB' | 'Strategic';
  type?: 'status' | 'tier';
}

export default function ModelBadge({ status = 'Active', tier = 'Enterprise', type = 'status' }: ModelBadgeProps) {
  if (type === 'status') {
    const isActive = status === 'Active';
    return (
      <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${
        isActive 
          ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
          : 'text-slate-600 bg-slate-100 border-slate-200'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
        {status}
      </span>
    );
  }

  return (
    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      {tier}
    </span>
  );
}