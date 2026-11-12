'use client';

import React, { useState } from 'react';
import { FiEye, FiTrash2, FiUsers, FiLayers, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { DripCampaign } from '@/src/types/marketing/drip-campaign';
import { DripStatusBadge } from '../shared/DripStatusBadge';
import { TriggerTypeBadge } from '../shared/TriggerTypeBadge';

interface DripTableViewProps {
  campaigns: DripCampaign[];
  onView: (campaign: DripCampaign) => void;
  onDelete: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export const DripTableView: React.FC<DripTableViewProps> = ({
  campaigns,
  onView,
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
    if (confirm(`Permanently delete ${selectedIds.length} selected sequence(s)?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
      } else {
        selectedIds.forEach((id) => onDelete(id));
      }
      setSelectedIds([]);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
        <p className="text-sm font-bold text-slate-700">No drip sequences found</p>
        <p className="text-xs text-slate-400 mt-1">Clear filters or create a new automation pathway.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 font-sans">
      {/* Bulk Delete Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
          <span className="font-bold text-rose-800">{selectedIds.length} sequence(s) selected</span>
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

      {/* Mobile Card Layout (Visible on screens < md) */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {campaigns.map((campaign) => {
          const t = campaign.telemetry;
          return (
            <div 
              key={campaign._id}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <DripStatusBadge status={campaign.status} />
                  <TriggerTypeBadge type={campaign.triggerType} />
                </div>
                <button
                  type="button"
                  onClick={() => onDelete(campaign._id)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>

              <div>
                <h4 
                  onClick={() => onView(campaign)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                >
                  {campaign.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{campaign.description}</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400">
                  <span className="font-semibold text-blue-600">{campaign.targetPersona}</span>
                  <span>•</span>
                  <span>{campaign.steps?.length || 0} Steps</span>
                  <span>•</span>
                  <span>{campaign.owner}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-around text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Active Leads</span>
                  <span className="font-extrabold text-slate-900">{t.activeLeads.toLocaleString()}</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Open Rate</span>
                  <span className="font-extrabold text-blue-600">{t.openRate}%</span>
                </div>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Click Rate</span>
                  <span className="font-extrabold text-emerald-600">{t.clickRate}%</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onView(campaign)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FiEye size={13} />
                <span>View Sequence Timeline</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Desktop & Tablet Data Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-5 py-3.5">Sequence & Strategy</th>
                <th className="px-4 py-3.5">Enrollment Trigger</th>
                <th className="px-4 py-3.5">Target Persona</th>
                <th className="px-4 py-3.5">Active Cohort</th>
                <th className="px-4 py-3.5 text-center">Step Performance (OR / CTR)</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {campaigns.map((campaign) => {
                const t = campaign.telemetry;
                const isSelected = selectedIds.includes(campaign._id);
                return (
                  <tr
                    key={campaign._id}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="px-4 py-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(campaign._id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-4 max-w-sm">
                      <button
                        type="button"
                        onClick={() => onView(campaign)}
                        className="text-left cursor-pointer group"
                      >
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 text-xs leading-snug line-clamp-1">
                          {campaign.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                            <FiLayers size={11} className="text-blue-500" /> {campaign.steps?.length || 0} steps
                          </span>
                          <span>•</span>
                          <span>{campaign.owner}</span>
                        </div>
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <TriggerTypeBadge type={campaign.triggerType} />
                    </td>
                    <td className="px-4 py-4 max-w-[180px]">
                      <span className="font-medium text-slate-700 truncate block">
                        {campaign.targetPersona}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-bold text-slate-900">
                        <FiUsers size={12} className="text-slate-400" />
                        {t.activeLeads.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="inline-flex items-center gap-2 text-[11px] font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/70">
                        <span className="text-blue-600">{t.openRate}% open</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-emerald-600">{t.clickRate}% click</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <DripStatusBadge status={campaign.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => onView(campaign)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Sequence"
                        >
                          <FiEye size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(campaign._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
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
