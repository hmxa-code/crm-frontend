// import React from 'react';
// import { FiLayers, FiType, FiFlag } from 'react-icons/fi';
// import { CampaignChannelType, CampaignStatus } from '@/src/types/marketing/campaign';

// interface CampaignBasicInfoFormProps {
//   name: string;
//   type: CampaignChannelType;
//   status: CampaignStatus;
//   onChange: (field: string, value: any) => void;
// }

// const CHANNELS: { id: CampaignChannelType; label: string; desc: string }[] = [
//   { id: 'Email', label: 'Email', desc: 'Newsletters & automated drip sequences' },
//   { id: 'SMS', label: 'Direct SMS', desc: 'Instant high-priority mobile text alerts' },
//   { id: 'Social', label: 'Social Media', desc: 'Promotions on LinkedIn, FB & IG' },
//   { id: 'Push', label: 'In-App Push', desc: 'Native web & mobile user reactivation' },
//   { id: 'Multi-Channel', label: 'Multi-Channel', desc: 'Omni-touch synced journey' },
// ];

// export const CampaignBasicInfoForm: React.FC<CampaignBasicInfoFormProps> = ({
//   name,
//   type,
//   status,
//   onChange,
// }) => {
//   return (
//     <div className="space-y-4">
//       {/* Campaign Name */}
//       <div>
//         <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
//           <FiType className="text-slate-400" />
//           Campaign Name <span className="text-rose-500">*</span>
//         </label>
//         <input
//           type="text"
//           required
//           value={name}
//           onChange={(e) => onChange('campaign_name', e.target.value)}
//           placeholder="e.g. Q4 Enterprise SaaS Expansion Drip"
//           className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400"
//         />
//       </div>

//       {/* Channel Type Selector */}
//       <div>
//         <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
//           <FiLayers className="text-slate-400" />
//           Channel Type <span className="text-rose-500">*</span>
//         </label>
//         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//           {CHANNELS.map((ch) => {
//             const isSelected = type === ch.id;
//             return (
//               <button
//                 type="button"
//                 key={ch.id}
//                 onClick={() => onChange('campaign_type', ch.id)}
//                 className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
//                   isSelected
//                     ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20'
//                     : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
//                 }`}
//               >
//                 <span className="text-xs font-bold text-slate-900 block">{ch.label}</span>
//                 <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{ch.desc}</span>
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Deployment Status */}
//       <div>
//         <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
//           <FiFlag className="text-slate-400" />
//           Deployment Status
//         </label>
//         <select
//           value={status}
//           onChange={(e) => onChange('status', e.target.value as CampaignStatus)}
//           className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all cursor-pointer"
//         >
//           <option value="Draft">Draft (Saved locally for review)</option>
//           <option value="Scheduled">Scheduled (Dispatches on start date)</option>
//           <option value="Active">Active (Broadcasting in real-time)</option>
//           <option value="Paused">Paused (Temporarily halted)</option>
//           <option value="Completed">Completed (Finalized run)</option>
//         </select>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { FiLayers, FiType, FiFlag } from 'react-icons/fi';
import { CampaignChannelType, CampaignStatus } from '@/src/types/marketing/campaign';

interface CampaignBasicInfoFormProps {
  name: string;
  type: CampaignChannelType;
  status: CampaignStatus;
  onChange: (field: string, value: any) => void;
}

const CHANNELS: { id: CampaignChannelType; label: string; desc: string }[] = [
  { id: 'Email', label: 'Email', desc: 'Newsletters & automated drip sequences' },
  { id: 'SMS', label: 'Direct SMS', desc: 'Instant high-priority mobile text alerts' },
  { id: 'Social', label: 'Social Media', desc: 'Promotions on LinkedIn, FB & IG' },
  { id: 'Push', label: 'In-App Push', desc: 'Native web & mobile user reactivation' },
  { id: 'Multi-Channel', label: 'Multi-Channel', desc: 'Omni-touch synced journey' },
];

export const CampaignBasicInfoForm: React.FC<CampaignBasicInfoFormProps> = ({
  name,
  type,
  status,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
          <FiType className="text-slate-400" />
          Campaign Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => onChange('campaign_name', e.target.value)}
          placeholder="e.g. Q4 Enterprise SaaS Expansion Drip"
          className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400"
        />
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
          <FiLayers className="text-slate-400" />
          Channel Type <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CHANNELS.map((ch) => {
            const isSelected = type === ch.id;
            return (
              <button
                type="button"
                key={ch.id}
                onClick={() => onChange('campaign_type', ch.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                }`}
              >
                <span className="text-xs font-bold text-slate-900 block">{ch.label}</span>
                <span className="text-[10px] text-slate-400 block line-clamp-1 mt-0.5">{ch.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
          <FiFlag className="text-slate-400" />
          Deployment Status
        </label>
        <select
          value={status}
          onChange={(e) => onChange('status', e.target.value as CampaignStatus)}
          className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all cursor-pointer"
        >
          <option value="Draft">Draft (Saved locally for review)</option>
          <option value="Scheduled">Scheduled (Dispatches on start date)</option>
          <option value="Active">Active (Broadcasting in real-time)</option>
          <option value="Paused">Paused (Temporarily halted)</option>
          <option value="Completed">Completed (Finalized run)</option>
        </select>
      </div>
    </div>
  );
};