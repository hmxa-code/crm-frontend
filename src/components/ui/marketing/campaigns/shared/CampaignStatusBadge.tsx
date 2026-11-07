'use client'

import React from 'react'
import { CampaignStatus } from '@/src/types/marketing/campaign'

interface CampaignStatusBadgeProps {
  status: CampaignStatus
}

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Paused':
        return 'bg-rose-50 text-rose-700 border-rose-200'
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200'
    }
  }

  return (
    <span className={`px-2 py-0.5 font-bold rounded-full text-[10px] border ${getStyles()}`}>
      {status}
    </span>
  )
}