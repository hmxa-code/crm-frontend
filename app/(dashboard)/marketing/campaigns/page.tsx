'use client'

import React, { useState, useEffect } from 'react'
import { Campaign, CampaignEditablePayload, CampaignStatus } from '@/src/types/marketing/campaign'
import { CampaignsService } from '@/src/services/marketing/CampaignsService'
import { MarketingCampaignsHub } from '@/src/components/marketing/campaigns/MarketingCampaignsHub'
import toast, { Toaster } from 'react-hot-toast'

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const data = await CampaignsService.getAllCampaigns()
      setCampaigns(data || [])
    } catch (err) {
      console.error(err)
      toast.error('Failed to load campaigns.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto space-y-5">
        <MarketingCampaignsHub />
      </div>
    </div>
  )
}