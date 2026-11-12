import React, { useState } from 'react';
import { FiEye, FiUsers, FiLayers } from 'react-icons/fi';
import { DripCampaign, DripCampaignStatus } from '@/src/types/marketing/drip-campaign';
import { TriggerTypeBadge } from '../shared/TriggerTypeBadge';
import toast from 'react-hot-toast';

interface DripKanbanViewProps {
  campaigns: DripCampaign[];
  onStatusChange: (id: string, status: DripCampaignStatus) => Promise<void>;
  onView: (campaign: DripCampaign) => void;
}

const COLUMNS: { id: DripCampaignStatus; label: string; pill: string }[] = [
  { id: 'Draft', label: 'Draft', pill: 'bg-slate-100 text-slate-700' },
  { id: 'Active', label: 'Active', pill: 'bg-emerald-50 text-emerald-700' },
  { id: 'Paused', label: 'Paused', pill: 'bg-amber-50 text-amber-700' },
  { id: 'Completed', label: 'Completed', pill: 'bg-purple-50 text-purple-700' },
];

export const DripKanbanView: React.FC<DripKanbanViewProps> = ({
  campaigns,
  onStatusChange,
  onView,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropColumn, setDropColumn] = useState<DripCampaignStatus | null>(null);

  const handleDrop = async (e: React.DragEvent, targetStatus: DripCampaignStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedId;
    setDropColumn(null);
    setDraggedId(null);
    if (!id) return;
    const current = campaigns.find((c) => c._id === id);
    if (!current || current.status === targetStatus) return;
    try {
      await onStatusChange(id, targetStatus);
      toast.success(`Moved “${current.title}” to ${targetStatus}`);
    } catch {
      toast.error('Could not update sequence status.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnItems = campaigns.filter((c) => c.status === col.id);
        const isTarget = dropColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              if (dropColumn !== col.id) setDropColumn(col.id);
            }}
            onDragLeave={() => setDropColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`rounded-2xl border transition-all flex flex-col min-h-[520px] ${
              isTarget
                ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/20'
                : 'bg-slate-50/60 border-slate-200/80'
            }`}
          >
            <div className="p-3.5 border-b bg-white rounded-t-2xl flex items-center justify-between border-slate-200/80">
              <span className="text-xs font-bold text-slate-800">{col.label}</span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${col.pill}`}>
                {columnItems.length}
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1">
              {columnItems.length === 0 ? (
                <div className="h-36 border-2 border-dashed border-slate-200/80 rounded-xl flex items-center justify-center">
                  <span className="text-[11px] text-slate-400 font-medium">Drop a sequence here</span>
                </div>
              ) : (
                columnItems.map((campaign) => (
                  <div
                    key={campaign._id}
                    draggable
                    onDragStart={(e) => {
                      setDraggedId(campaign._id);
                      e.dataTransfer.setData('text/plain', campaign._id);
                    }}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-white shadow-2xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing hover:border-slate-300 space-y-3 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <TriggerTypeBadge type={campaign.triggerType} compact />
                      <button
                        type="button"
                        onClick={() => onView(campaign)}
                        className="p-1 text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Open builder"
                      >
                        <FiEye size={12} />
                      </button>
                    </div>
                    <h4
                      onClick={() => onView(campaign)}
                      className="text-xs font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer line-clamp-2"
                    >
                      {campaign.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium line-clamp-1">{campaign.targetPersona}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <FiUsers size={11} />
                        {(campaign.telemetry?.activeLeads || 0).toLocaleString()} active
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FiLayers size={11} />
                        {campaign.steps?.length || 0}
                      </span>
                    </div>
                    {(campaign.telemetry?.enrolledLeads || 0) > 0 ? (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          {campaign.telemetry?.openRate || 0}% OR
                        </span>
                        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                          {campaign.telemetry?.clickRate || 0}% CTR
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-medium">Telemetry queued</span>
                    )}
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
