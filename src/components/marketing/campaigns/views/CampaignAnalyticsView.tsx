// import React from 'react';
// import {
//   FiTrendingUp,
//   FiUsers,
//   FiMail,
//   FiDollarSign,
//   FiActivity,
//   FiPieChart,
//   FiCheckCircle
// } from 'react-icons/fi';
// import { Campaign } from '@/src/types/marketing/campaign';

// interface CampaignAnalyticsViewProps {
//   campaigns: Campaign[];
// }

// export const CampaignAnalyticsView: React.FC<CampaignAnalyticsViewProps> = ({ campaigns }) => {
//   const totalCampaigns = campaigns.length;
//   const activeCount = campaigns.filter((c) => c.status === 'Active').length;
//   const completedCount = campaigns.filter((c) => c.status === 'Completed').length;
//   const totalAudience = campaigns.reduce((acc, c) => acc + (c.target_count || 0), 0);
//   const totalRecipients = campaigns.reduce((acc, c) => acc + (c.recipient_count || 0), 0);
//   const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

//   const activeOrCompleted = campaigns.filter((c) => c.recipient_count > 0);
//   const avgOpenRate =
//     activeOrCompleted.length > 0
//       ? (activeOrCompleted.reduce((acc, c) => acc + (c.open_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
//       : '0.0';

//   const avgClickRate =
//     activeOrCompleted.length > 0
//       ? (activeOrCompleted.reduce((acc, c) => acc + (c.click_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
//       : '0.0';

//   const avgConversionRate =
//     activeOrCompleted.length > 0
//       ? (activeOrCompleted.reduce((acc, c) => acc + (c.conversion_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
//       : '0.0';

//   // Group by channel
//   const channelBreakdown = campaigns.reduce((acc: Record<string, number>, c) => {
//     acc[c.campaign_type] = (acc[c.campaign_type] || 0) + 1;
//     return acc;
//   }, {});

//   return (
//     <div className="space-y-6">
//       {/* Top 4 Macro KPIs */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
//           <div className="flex items-center justify-between">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline Budget</span>
//             <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
//               <FiDollarSign className="text-sm" />
//             </div>
//           </div>
//           <p className="mt-3 text-2xl font-extrabold text-slate-900">${totalBudget.toLocaleString()}</p>
//           <span className="text-[11px] font-medium text-slate-500 mt-1 block">Across {totalCampaigns} registered campaigns</span>
//         </div>

//         <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
//           <div className="flex items-center justify-between">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dispatched Audience</span>
//             <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
//               <FiUsers className="text-sm" />
//             </div>
//           </div>
//           <p className="mt-3 text-2xl font-extrabold text-slate-900">{totalRecipients.toLocaleString()}</p>
//           <span className="text-[11px] font-medium text-slate-500 mt-1 block">Of {totalAudience.toLocaleString()} target segment contacts</span>
//         </div>

//         <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
//           <div className="flex items-center justify-between">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg. Open Rate (OR)</span>
//             <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
//               <FiMail className="text-sm" />
//             </div>
//           </div>
//           <p className="mt-3 text-2xl font-extrabold text-purple-700">{avgOpenRate}%</p>
//           <span className="text-[11px] font-medium text-slate-500 mt-1 block">Industry benchmark: 21.5%</span>
//         </div>

//         <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
//           <div className="flex items-center justify-between">
//             <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Closed-Won Conversion</span>
//             <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
//               <FiTrendingUp className="text-sm" />
//             </div>
//           </div>
//           <p className="mt-3 text-2xl font-extrabold text-cyan-700">{avgConversionRate}%</p>
//           <span className="text-[11px] font-medium text-slate-500 mt-1 block">Avg Click-through: {avgClickRate}%</span>
//         </div>
//       </div>

//       {/* Middle Grid: Channel Diversity & Top Performers */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Channel Distribution */}
//         <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
//           <div className="flex items-center justify-between pb-3 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-900">Campaign Channel Diversity</h3>
//             <span className="text-xs text-slate-400 font-medium">Multichannel Matrix</span>
//           </div>

//           <div className="space-y-3">
//             {Object.entries(channelBreakdown).map(([ch, count]) => {
//               const percentage = Math.round((count / totalCampaigns) * 100);
//               return (
//                 <div key={ch}>
//                   <div className="flex items-center justify-between text-xs font-semibold mb-1">
//                     <span className="text-slate-700">{ch}</span>
//                     <span className="text-slate-500">{count} ({percentage}%)</span>
//                   </div>
//                   <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
//                     <div
//                       className="bg-blue-600 h-full rounded-full transition-all duration-500"
//                       style={{ width: `${percentage}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* Status Distribution */}
//         <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
//           <div className="flex items-center justify-between pb-3 border-b border-slate-100">
//             <h3 className="text-sm font-bold text-slate-900">Deployment Pipeline Health</h3>
//             <span className="text-xs text-slate-400 font-medium">Lifecycle Breakdown</span>
//           </div>

//           <div className="grid grid-cols-2 gap-3 text-center">
//             <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
//               <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">Live Active</span>
//               <span className="text-2xl font-extrabold text-emerald-700">{activeCount}</span>
//             </div>
//             <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
//               <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">Archived Finished</span>
//               <span className="text-2xl font-extrabold text-purple-700">{completedCount}</span>
//             </div>
//           </div>

//           <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
//             💡 <strong>SaaS Benchmark:</strong> Campaigns with unified email + SMS touchpoints maintain <strong>+42% higher conversion velocity</strong> than single-channel email outreach.
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import {
  FiTrendingUp,
  FiUsers,
  FiMail,
  FiDollarSign,
  FiActivity,
  FiPieChart,
  FiCheckCircle
} from 'react-icons/fi';
import { Campaign } from '@/src/types/marketing/campaign';

interface CampaignAnalyticsViewProps {
  campaigns: Campaign[];
}

export const CampaignAnalyticsView: React.FC<CampaignAnalyticsViewProps> = ({ campaigns }) => {
  const totalCampaigns = campaigns.length;
  const activeCount = campaigns.filter((c) => c.status === 'Active').length;
  const completedCount = campaigns.filter((c) => c.status === 'Completed').length;
  const totalAudience = campaigns.reduce((acc, c) => acc + (c.target_count || 0), 0);
  const totalRecipients = campaigns.reduce((acc, c) => acc + (c.recipient_count || 0), 0);
  const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);

  const activeOrCompleted = campaigns.filter((c) => c.recipient_count > 0);
  const avgOpenRate =
    activeOrCompleted.length > 0
      ? (activeOrCompleted.reduce((acc, c) => acc + (c.open_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
      : '0.0';

  const avgClickRate =
    activeOrCompleted.length > 0
      ? (activeOrCompleted.reduce((acc, c) => acc + (c.click_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
      : '0.0';

  const avgConversionRate =
    activeOrCompleted.length > 0
      ? (activeOrCompleted.reduce((acc, c) => acc + (c.conversion_rate || 0), 0) / activeOrCompleted.length).toFixed(1)
      : '0.0';

  const channelBreakdown = campaigns.reduce((acc: Record<string, number>, c) => {
    acc[c.campaign_type] = (acc[c.campaign_type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pipeline Budget</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign className="text-sm" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">${totalBudget.toLocaleString()}</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">Across {totalCampaigns} registered campaigns</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Dispatched Audience</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FiUsers className="text-sm" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-slate-900">{totalRecipients.toLocaleString()}</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">Of {totalAudience.toLocaleString()} target segment contacts</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg. Open Rate (OR)</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FiMail className="text-sm" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-purple-700">{avgOpenRate}%</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">Industry benchmark: 21.5%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Closed-Won Conversion</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <FiTrendingUp className="text-sm" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-cyan-700">{avgConversionRate}%</p>
          <span className="text-[11px] font-medium text-slate-500 mt-1 block">Avg Click-through: {avgClickRate}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Campaign Channel Diversity</h3>
            <span className="text-xs text-slate-400 font-medium">Multichannel Matrix</span>
          </div>

          <div className="space-y-3">
            {Object.entries(channelBreakdown).map(([ch, count]) => {
              const percentage = Math.round((count / totalCampaigns) * 100);
              return (
                <div key={ch}>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{ch}</span>
                    <span className="text-slate-500">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Deployment Pipeline Health</h3>
            <span className="text-xs text-slate-400 font-medium">Lifecycle Breakdown</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block mb-1">Live Active</span>
              <span className="text-2xl font-extrabold text-emerald-700">{activeCount}</span>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100">
              <span className="text-[10px] uppercase font-bold text-purple-700 block mb-1">Archived Finished</span>
              <span className="text-2xl font-extrabold text-purple-700">{completedCount}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 leading-relaxed">
            💡 <strong>SaaS Benchmark:</strong> Campaigns with unified email + SMS touchpoints maintain <strong>+42% higher conversion velocity</strong> than single-channel email outreach.
          </div>
        </div>
      </div>
    </div>
  );
};