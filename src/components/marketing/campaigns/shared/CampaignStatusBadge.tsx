// import React from 'react';
// import { CampaignStatus } from '@/src/types/marketing/campaign';

// interface CampaignStatusBadgeProps {
//   status: CampaignStatus;
//   size?: 'sm' | 'md';
// }

// export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status, size = 'md' }) => {
//   const getBadgeStyle = () => {
//     switch (status) {
//       case 'Active':
//         return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10';
//       case 'Scheduled':
//         return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10';
//       case 'Draft':
//         return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10';
//       case 'Paused':
//         return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10';
//       case 'Completed':
//         return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10';
//       default:
//         return 'bg-slate-100 text-slate-700 border-slate-200';
//     }
//   };

//   const getDotStyle = () => {
//     switch (status) {
//       case 'Active':
//         return 'bg-emerald-500 animate-pulse';
//       case 'Scheduled':
//         return 'bg-blue-500';
//       case 'Draft':
//         return 'bg-slate-400';
//       case 'Paused':
//         return 'bg-amber-500';
//       case 'Completed':
//         return 'bg-purple-500';
//       default:
//         return 'bg-slate-400';
//     }
//   };

//   const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

//   return (
//     <span
//       className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${sizeClasses} ${getBadgeStyle()}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotStyle()}`} />
//       <span>{status}</span>
//     </span>
//   );
// };

import React from 'react';
import { CampaignStatus } from '@/src/types/marketing/campaign';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  size?: 'sm' | 'md';
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10';
      case 'Scheduled':
        return 'bg-blue-50 text-blue-700 border-blue-200/80 ring-blue-500/10';
      case 'Draft':
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/10';
      case 'Paused':
        return 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200/80 ring-purple-500/10';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getDotStyle = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500 animate-pulse';
      case 'Scheduled':
        return 'bg-blue-500';
      case 'Draft':
        return 'bg-slate-400';
      case 'Paused':
        return 'bg-amber-500';
      case 'Completed':
        return 'bg-purple-500';
      default:
        return 'bg-slate-400';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wider ${sizeClasses} ${getBadgeStyle()}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${getDotStyle()}`} />
      <span>{status}</span>
    </span>
  );
};