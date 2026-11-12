// import React from 'react';
// import { FiUsers, FiTarget, FiFilter } from 'react-icons/fi';

// interface CampaignAudienceSelectProps {
//   audience: string;
//   targetCount: number;
//   onChange: (field: string, value: any) => void;
// }

// const PRESET_SEGMENTS = [
//   { name: 'All Enterprise Decision Makers', count: 8500 },
//   { name: 'Warm Leads (Lead Score > 75)', count: 4200 },
//   { name: 'Free Trial Signups Without Demo', count: 6100 },
//   { name: 'Existing Paying Customers (Up-sell / Cross-sell)', count: 12400 },
//   { name: 'Inactive Users (> 30 Days)', count: 3900 },
//   { name: 'Webinar & Event Attendees', count: 15200 },
// ];

// export const CampaignAudienceSelect: React.FC<CampaignAudienceSelectProps> = ({
//   audience,
//   targetCount,
//   onChange,
// }) => {
//   return (
//     <div className="space-y-4">
//       {/* Target Segment */}
//       <div>
//         <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
//           <FiTarget className="text-slate-400" />
//           Target Audience Segment <span className="text-rose-500">*</span>
//         </label>
//         <div className="relative">
//           <input
//             type="text"
//             required
//             list="segment-suggestions"
//             value={audience}
//             onChange={(e) => onChange('target_audience', e.target.value)}
//             placeholder="Select preset or type custom query..."
//             className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400"
//           />
//           <datalist id="segment-suggestions">
//             {PRESET_SEGMENTS.map((s) => (
//               <option key={s.name} value={s.name} />
//             ))}
//           </datalist>
//         </div>
//       </div>

//       {/* Quick Segment Preset Pills */}
//       <div>
//         <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
//           <FiFilter size={10} />
//           Suggested CRM Segments
//         </p>
//         <div className="flex flex-wrap gap-1.5">
//           {PRESET_SEGMENTS.slice(0, 4).map((s) => (
//             <button
//               type="button"
//               key={s.name}
//               onClick={() => {
//                 onChange('target_audience', s.name);
//                 onChange('target_count', s.count);
//               }}
//               className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
//                 audience === s.name
//                   ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
//                   : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
//               }`}
//             >
//               {s.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Target Volume Counter */}
//       <div>
//         <div className="flex items-center justify-between mb-1.5">
//           <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
//             <FiUsers className="text-slate-400" />
//             Estimated Target Volume
//           </label>
//           <span className="text-[11px] font-bold text-blue-600">
//             {Number(targetCount || 0).toLocaleString()} Contacts
//           </span>
//         </div>
//         <input
//           type="number"
//           min="0"
//           value={targetCount || 0}
//           onChange={(e) => onChange('target_count', Number(e.target.value))}
//           className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all"
//         />
//         <p className="text-[10px] text-slate-400 mt-1">
//           Telemetry calculates actual recipients, delivery rate, and bounced contacts automatically upon dispatch.
//         </p>
//       </div>
//     </div>
//   );
// };

import React from 'react';
import { FiUsers, FiTarget, FiFilter } from 'react-icons/fi';

interface CampaignAudienceSelectProps {
  audience: string;
  targetCount: number;
  onChange: (field: string, value: any) => void;
}

const PRESET_SEGMENTS = [
  { name: 'All Enterprise Decision Makers', count: 8500 },
  { name: 'Warm Leads (Lead Score > 75)', count: 4200 },
  { name: 'Free Trial Signups Without Demo', count: 6100 },
  { name: 'Existing Paying Customers (Up-sell / Cross-sell)', count: 12400 },
  { name: 'Inactive Users (> 30 Days)', count: 3900 },
  { name: 'Webinar & Event Attendees', count: 15200 },
];

export const CampaignAudienceSelect: React.FC<CampaignAudienceSelectProps> = ({
  audience,
  targetCount,
  onChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 flex items-center gap-1.5">
          <FiTarget className="text-slate-400" />
          Target Audience Segment <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            required
            list="segment-suggestions"
            value={audience}
            onChange={(e) => onChange('target_audience', e.target.value)}
            placeholder="Select preset or type custom query..."
            className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400"
          />
          <datalist id="segment-suggestions">
            {PRESET_SEGMENTS.map((s) => (
              <option key={s.name} value={s.name} />
            ))}
          </datalist>
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
          <FiFilter size={10} />
          Suggested CRM Segments
        </p>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_SEGMENTS.slice(0, 4).map((s) => (
            <button
              type="button"
              key={s.name}
              onClick={() => {
                onChange('target_audience', s.name);
                onChange('target_count', s.count);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                audience === s.name
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FiUsers className="text-slate-400" />
            Estimated Target Volume
          </label>
          <span className="text-[11px] font-bold text-blue-600">
            {Number(targetCount || 0).toLocaleString()} Contacts
          </span>
        </div>
        <input
          type="number"
          min="0"
          value={targetCount || 0}
          onChange={(e) => onChange('target_count', Number(e.target.value))}
          className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          Telemetry calculates actual recipients and delivery rates automatically upon dispatch.
        </p>
      </div>
    </div>
  );
};