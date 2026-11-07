'use client'

import React from 'react'
import { FiX } from 'react-icons/fi'
import { Campaign } from '@/src/types/marketing/campaign'

interface CampaignOverviewSheetProps {
  campaign: Campaign | null
  onClose: () => void
}

export const CampaignOverviewSheet: React.FC<CampaignOverviewSheetProps> = ({ campaign, onClose }) => {
  if (!campaign) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xs" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white border-l border-slate-200 h-full p-4 flex flex-col text-xs animate-in slide-in-from-right duration-150">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm">Campaign Overview</h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
            <FiX size={14} />
          </button>
        </div>
        <div className="mt-4 space-y-4 flex-1 overflow-y-auto">
          <div>
            <span className="text-slate-400 block font-medium">Name</span>
            <p className="font-bold text-slate-900 text-sm mt-0.5">{campaign.campaign_name}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-slate-400 block font-medium">Type</span>
              <p className="font-semibold text-slate-800 mt-0.5">{campaign.campaign_type}</p>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Current Status</span>
              <p className="font-semibold text-slate-800 mt-0.5">{campaign.status}</p>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Target Audience</span>
            <p className="font-semibold text-slate-800 mt-0.5">{campaign.target_audience || 'General Audience'}</p>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Notes</span>
            <p className="font-semibold text-slate-800 mt-0.5">{campaign.notes || 'No notes available'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}