// import React from 'react';
// import { FiMail, FiMessageSquare, FiShare2, FiBell, FiLayers } from 'react-icons/fi';
// import { CampaignChannelType } from '@/src/types/marketing/campaign';

// interface CampaignTypeIconProps {
//   type: CampaignChannelType;
//   showLabel?: boolean;
// }

// export const CampaignTypeIcon: React.FC<CampaignTypeIconProps> = ({ type, showLabel = true }) => {
//   const getConfig = () => {
//     switch (type) {
//       case 'Email':
//         return {
//           icon: FiMail,
//           color: 'text-sky-600 bg-sky-50 border-sky-100',
//           label: 'Email Campaign',
//         };
//       case 'SMS':
//         return {
//           icon: FiMessageSquare,
//           color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
//           label: 'Direct SMS',
//         };
//       case 'Social':
//         return {
//           icon: FiShare2,
//           color: 'text-purple-600 bg-purple-50 border-purple-100',
//           label: 'Social Media',
//         };
//       case 'Push':
//         return {
//           icon: FiBell,
//           color: 'text-amber-600 bg-amber-50 border-amber-100',
//           label: 'Push Alert',
//         };
//       case 'Multi-Channel':
//       default:
//         return {
//           icon: FiLayers,
//           color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
//           label: 'Multi-Channel',
//         };
//     }
//   };

//   const config = getConfig();
//   const Icon = config.icon;

//   return (
//     <div className="inline-flex items-center gap-2">
//       <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${config.color}`}>
//         <Icon className="text-xs" />
//       </div>
//       {showLabel && <span className="text-xs font-semibold text-slate-700">{config.label}</span>}
//     </div>
//   );
// };

import React from 'react';
import { FiMail, FiMessageSquare, FiShare2, FiBell, FiLayers } from 'react-icons/fi';
import { CampaignChannelType } from '@/src/types/marketing/campaign';

interface CampaignTypeIconProps {
  type: CampaignChannelType;
  showLabel?: boolean;
}

export const CampaignTypeIcon: React.FC<CampaignTypeIconProps> = ({ type, showLabel = true }) => {
  const getConfig = () => {
    switch (type) {
      case 'Email':
        return {
          icon: FiMail,
          color: 'text-sky-600 bg-sky-50 border-sky-100',
          label: 'Email Campaign',
        };
      case 'SMS':
        return {
          icon: FiMessageSquare,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
          label: 'Direct SMS',
        };
      case 'Social':
        return {
          icon: FiShare2,
          color: 'text-purple-600 bg-purple-50 border-purple-100',
          label: 'Social Media',
        };
      case 'Push':
        return {
          icon: FiBell,
          color: 'text-amber-600 bg-amber-50 border-amber-100',
          label: 'Push Alert',
        };
      case 'Multi-Channel':
      default:
        return {
          icon: FiLayers,
          color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
          label: 'Multi-Channel',
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${config.color}`}>
        <Icon className="text-xs" />
      </div>
      {showLabel && <span className="text-xs font-semibold text-slate-700">{config.label}</span>}
    </div>
  );
};