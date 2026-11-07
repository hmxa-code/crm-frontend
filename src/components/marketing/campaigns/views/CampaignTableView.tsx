import React, { useState } from 'react';
import { 
  FiEye, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiUsers, 
  FiDollarSign,
  FiActivity
} from 'react-icons/fi';
import { Campaign } from '@/src/types/marketing/campaign';
import { CampaignStatusBadge } from '../shared/CampaignStatusBadge';
import { CampaignTypeIcon } from '../shared/CampaignTypeIcon';

interface CampaignTableViewProps {
  campaigns: Campaign[];
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export const CampaignTableView: React.FC<CampaignTableViewProps> = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const allSelected =
    campaigns.length > 0 && campaigns.every((c) => selectedIds.includes(c._id));

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(campaigns.map((c) => c._id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Permanently delete ${selectedIds.length} selected campaign(s)?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
      } else {
        selectedIds.forEach((id) => onDelete(id));
      }
      setSelectedIds([]);
    }
  };

  const formatDate = (val: number | string | undefined) => {
    if (!val) return '—';
    const date = typeof val === 'number' ? new Date(val) : new Date(val);
    return isNaN(date.getTime()) ? String(val) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-800">No campaigns found matching criteria</p>
        <p className="text-slate-400 mt-1">Adjust your search filters or click "Create Campaign" to deploy a new one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {/* Selected Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <span className="font-bold text-rose-800">{selectedIds.length} campaign(s) selected</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FiTrash2 size={13} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3.5">Campaign Name & Identifier</th>
                <th className="px-3 py-3.5">Channel</th>
                <th className="px-4 py-3.5">Lifecycle State</th>
                <th className="px-4 py-3.5">Target Audience Cohort</th>
                <th className="px-4 py-3.5">Reach / Budget</th>
                <th className="px-4 py-3.5">Schedule</th>
                <th className="px-4 py-3.5 text-center">Delivery (Open / Conv)</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {campaigns.map((c) => {
                const isSelected = selectedIds.includes(c._id);
                return (
                  <tr
                    key={c._id}
                    className={`transition-colors ${
                      isSelected ? 'bg-cyan-50/30' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(c._id)}
                        className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-slate-900 hover:text-cyan-700 cursor-pointer text-xs"
                        onClick={() => onView(c)}
                      >
                        {c.campaign_name}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {c._id} • By {c.created_by || 'Growth Team'}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <CampaignTypeIcon type={c.campaign_type} />
                        <span>{c.campaign_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <CampaignStatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-slate-800 text-xs line-clamp-1 max-w-xs">
                        {c.target_audience}
                      </p>
                      {c.utm_campaign && (
                        <span className="text-[10px] font-mono text-slate-400">
                          utm: {c.utm_campaign}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 font-bold text-slate-900 text-xs">
                        <FiUsers className="text-slate-400" size={12} />
                        <span>{(c.target_count || 0).toLocaleString()}</span>
                      </div>
                      <div className="text-[11px] font-medium text-slate-400">
                        ${(c.budget || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 font-medium whitespace-nowrap">
                        <FiCalendar className="text-slate-400" size={11} />
                        <span>{formatDate(c.start_date)}</span>
                        {c.end_date && (
                          <>
                            <span className="text-slate-300">&rarr;</span>
                            <span>{formatDate(c.end_date)}</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60 font-mono text-[11px]">
                        <span className="font-bold text-cyan-800">{c.open_rate || 0}%</span>
                        <span className="text-slate-300">/</span>
                        <span className="font-bold text-emerald-600">{c.conversion_rate || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onView(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="View Parameters"
                        >
                          <FiEye size={13} />
                        </button>
                        <button
                          onClick={() => onEdit(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          title="Edit Campaign"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button
                          onClick={() => onDelete(c._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Campaign"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
