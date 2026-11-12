import React from 'react';

export function SlaRiskBadge({ risk }: { risk: 'Low' | 'Medium' | 'High' | 'Critical' }) {
  return (
    <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border border-slate-300 bg-slate-100 text-slate-800 tracking-wider">
      {risk} Risk
    </span>
  );
}