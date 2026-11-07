'use client'

import React from 'react'
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi'
import { Campaign } from '@/src/types/marketing/campaign'

interface CampaignTableViewProps {
  campaigns: Campaign[]
  onView: (campaign: Campaign) => void
  onEdit: (campaign: Campaign) => void
  onDelete: (id: string) => void
}

export const CampaignTableView: React.FC<CampaignTableViewProps> = ({
  campaigns,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-5 py-3 font-semibold text-slate-500">Campaign Detail</th>
              <th className="px-5 py-3 font-semibold text-slate-500">Type</th>
              <th className="px-5 py-3 font-semibold text-slate-500">Audience</th>
              <th className="px-5 py-3 font-semibold text-slate-500">Metrics</th>
              <th className="px-5 py-3 font-semibold text-slate-500">Status</th>
              <th className="px-5 py-3 font-semibold text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-slate-50/40 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{campaign.campaign_name}</td>
                  <td className="px-5 py-3 uppercase tracking-wider text-[10px] text-slate-500">
                    {campaign.campaign_type}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {campaign.recipient_count} / {campaign.target_count}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    CR: <span className="text-slate-900 font-bold">{campaign.conversion_rate || 0}%</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 font-bold rounded-full text-[10px] bg-slate-100 text-slate-700">
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => onView(campaign)} className="p-1 text-slate-400 hover:text-slate-700">
                        <FiEye size={13} />
                      </button>
                      <button onClick={() => onEdit(campaign)} className="p-1 text-slate-400 hover:text-amber-600">
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => campaign._id && onDelete(campaign._id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-400 text-xs">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}