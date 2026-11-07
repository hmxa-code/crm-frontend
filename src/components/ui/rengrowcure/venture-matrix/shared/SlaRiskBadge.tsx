import React from 'react';

interface SlaRiskBadgeProps {
  risk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const SlaRiskBadge: React.FC<SlaRiskBadgeProps> = ({ risk }) => {
  const badgeClasses = {
    High: 'bg-rose-50 text-rose-700 border-rose-200',
    Critical: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }[risk] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badgeClasses}`}>
      {risk} Risk
    </span>
  );
};
