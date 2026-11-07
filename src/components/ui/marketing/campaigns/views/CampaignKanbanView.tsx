'use client'

import React, { useMemo } from 'react'
import { FiLoader, FiEye, FiEdit2, FiTrash2, FiUsers, FiTrendingUp } from 'react-icons/fi'
import { Campaign, CampaignStatus } from '@/src/types/marketing/campaign'

const STATUS_COLUMNS: CampaignStatus[] = ['Draft', 'Scheduled', 'Active', 'Paused', 'Completed']

interface CampaignKanbanViewProps {
  campaigns: Campaign[]
  loading: boolean
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>, status: CampaignStatus) => void
  onView: (campaign: Campaign) => void
  onEdit: (campaign: Campaign) => void
  onDelete: (id: string) => void
}

export const CampaignKanbanView: React.FC<CampaignKanbanViewProps> = ({
  campaigns,
  loading,
  onDragStart,
  onDrop,
  onView,
  onEdit,
  onDelete,
}) => {
  const columns = useMemo(() => {
    const grouped: Record<CampaignStatus, Campaign[]> = {
      Draft: [],
      Scheduled: [],
      Active: [],
      Paused: [],
      Completed: [],
    }
    campaigns.forEach((campaign) => {
      if (grouped[campaign.status]) {
        grouped[campaign.status].push(campaign)
      }
    })
    return grouped
  }, [campaigns])

  const getStatusColorConfig = (status: CampaignStatus) => {
    switch (status) {
      case 'Active':
        return { dot: 'bg-emerald-500' }
      case 'Completed':
        return { dot: 'bg-blue-500' }
      case 'Scheduled':
        return { dot: 'bg-amber-500' }
      case 'Paused':
        return { dot: 'bg-rose-500' }
      default:
        return { dot: 'bg-slate-400' }
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {STATUS_COLUMNS.map((status) => {
        const conf = getStatusColorConfig(status)
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, status)}
            className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col min-h-[220px] shadow-2xs"
          >
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${conf.dot}`} />
                <span className="font-bold text-slate-800 text-xs tracking-wide">{status}</span>
              </div>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                {columns[status]?.length || 0}
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-6 text-slate-400">
                <FiLoader className="animate-spin" size={14} />
              </div>
            ) : (
              <div className="grid gap-2.5 grid-cols-1 overflow-y-auto max-h-[300px] pr-1">
                {columns[status]?.length ? (
                  columns[status].map((campaign) => (
                    <div
                      key={campaign._id}
                      draggable
                      onDragStart={(e) => campaign._id && onDragStart(e, campaign._id)}
                      className="bg-slate-50/50 hover:bg-white border border-slate-200/70 rounded-lg p-3 transition-all cursor-grab active:cursor-grabbing group relative"
                    >
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <h4 className="font-bold text-slate-900 text-xs truncate max-w-[80%]">
                          {campaign.campaign_name || 'Untitled'}
                        </h4>
                        <span className="text-[9px] font-bold bg-white text-slate-500 border border-slate-200/60 px-1 py-0.5 rounded">
                          {campaign.campaign_type}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">
                        {campaign.target_audience || 'Global segment'}
                      </p>

                      <div className="flex items-center justify-between text-[10px] border-t border-slate-100/80 pt-2 text-slate-500">
                        <span className="flex items-center gap-1 font-medium">
                          <FiUsers size={11} /> {campaign.recipient_count} target
                        </span>
                        <span className="text-slate-800 font-bold flex items-center gap-0.5">
                          <FiTrendingUp size={10} className="text-blue-500" /> {campaign.conversion_rate || 0}% CR
                        </span>
                      </div>

                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center bg-white border border-slate-200 rounded shadow-2xs transition-opacity">
                        <button type="button" onClick={() => onView(campaign)} className="p-1 text-slate-400 hover:text-slate-700">
                          <FiEye size={11} />
                        </button>
                        <button type="button" onClick={() => onEdit(campaign)} className="p-1 text-slate-400 hover:text-amber-600">
                          <FiEdit2 size={11} />
                        </button>
                        <button type="button" onClick={() => campaign._id && onDelete(campaign._id)} className="p-1 text-slate-400 hover:text-rose-600">
                          <FiTrash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 flex items-center justify-center border border-dashed border-slate-200 rounded-lg text-slate-400 text-[11px]">
                    No records active
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}