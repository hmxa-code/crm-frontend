'use client';

import React, { useState } from 'react';
import { 
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiActivity, 
  FiEye, 
  FiEdit2,
  FiChevronRight
} from 'react-icons/fi';
import { Campaign, CampaignStatus } from '@/src/types/marketing/campaign';
import { CampaignTypeIcon } from '../shared/CampaignTypeIcon';
import toast from 'react-hot-toast';

interface CampaignKanbanViewProps {
  campaigns: Campaign[];
  onStatusChange: (id: string, newStatus: CampaignStatus) => Promise<void>;
  onView: (campaign: Campaign) => void;
  onEdit: (campaign: Campaign) => void;
}

const COLUMNS: { id: CampaignStatus; label: string; headerColor: string; pillColor: string }[] = [
  { id: 'Draft', label: 'Draft / In Planning', headerColor: 'border-slate-300 text-slate-700', pillColor: 'bg-slate-100 text-slate-700' },
  { id: 'Scheduled', label: 'Scheduled Queue', headerColor: 'border-blue-400 text-blue-700', pillColor: 'bg-blue-50 text-blue-700' },
  { id: 'Active', label: 'Active Live Stream', headerColor: 'border-emerald-500 text-emerald-700', pillColor: 'bg-emerald-50 text-emerald-700' },
  { id: 'Paused', label: 'Paused / Testing', headerColor: 'border-amber-400 text-amber-700', pillColor: 'bg-amber-50 text-amber-700' },
  { id: 'Completed', label: 'Completed Archive', headerColor: 'border-purple-400 text-purple-700', pillColor: 'bg-purple-50 text-purple-700' },
];

export const CampaignKanbanView: React.FC<CampaignKanbanViewProps> = ({
  campaigns,
  onStatusChange,
  onView,
  onEdit,
}) => {
  const [draggedCampaignId, setDraggedCampaignId] = useState<string | null>(null);
  const [activeDropColumn, setActiveDropColumn] = useState<CampaignStatus | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCampaignId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, status: CampaignStatus) => {
    e.preventDefault();
    if (activeDropColumn !== status) {
      setActiveDropColumn(status);
    }
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: CampaignStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedCampaignId;
    setActiveDropColumn(null);
    setDraggedCampaignId(null);

    if (!id) return;
    const current = campaigns.find((c) => c._id === id);
    if (!current || current.status === targetStatus) return;

    try {
      await onStatusChange(id, targetStatus);
      toast.success(`Moved "${current.campaign_name}" to ${targetStatus}`);
    } catch {
      toast.error('Failed to update campaign status.');
    }
  };

  const handleSelectStatusMobile = async (id: string, newStatus: CampaignStatus) => {
    await onStatusChange(id, newStatus);
    toast.success(`Updated status to ${newStatus}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 font-sans">
      {COLUMNS.map((col) => {
        const columnCampaigns = campaigns.filter((c) => c.status === col.id);
        const isTarget = activeDropColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`rounded-2xl border transition-all flex flex-col min-h-[500px] ${
              isTarget
                ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-slate-50/60 border-slate-200/80'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b bg-white rounded-t-2xl flex items-center justify-between border-slate-200/80">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{col.label}</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${col.pillColor}`}>
                  {columnCampaigns.length}
                </span>
              </div>
            </div>

            {/* Column Body Cards */}
            <div className="p-3 space-y-3 flex-1 overflow-y-auto">
              {columnCampaigns.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-slate-200/80 rounded-xl flex items-center justify-center text-center p-3">
                  <span className="text-[11px] text-slate-400 font-medium">No campaigns in this state</span>
                </div>
              ) : (
                columnCampaigns.map((camp) => (
                  <div
                    key={camp._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, camp._id)}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-slate-300 space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CampaignTypeIcon type={camp.campaign_type} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{camp.campaign_type}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onView(camp)}
                          className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                          title="Quick View"
                        >
                          <FiEye size={12} />
                        </button>
                        <button
                          onClick={() => onEdit(camp)}
                          className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors"
                          title="Edit"
                        >
                          <FiEdit2 size={12} />
                        </button>
                      </div>
                    </div>

                    <h4
                      onClick={() => onView(camp)}
                      className="text-xs font-bold text-slate-900 leading-snug hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                    >
                      {camp.campaign_name}
                    </h4>

                    <p className="text-[10px] text-slate-500 font-medium line-clamp-1">
                      🎯 {camp.target_audience}
                    </p>

                    {/* Touch / Mobile status switcher */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span className="text-slate-700 font-extrabold">
                        ${Number(camp.budget || 0).toLocaleString()}
                      </span>

                      {camp.recipient_count > 0 ? (
                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {camp.open_rate}% OR
                        </span>
                      ) : (
                        <span className="text-slate-400 font-normal">Queued</span>
                      )}
                    </div>

                    {/* Quick Move Select for Mobile & Touch */}
                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Move to:</span>
                      <select
                        value={camp.status}
                        onChange={(e) => handleSelectStatusMobile(camp._id, e.target.value as CampaignStatus)}
                        className="text-[10px] font-semibold bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
