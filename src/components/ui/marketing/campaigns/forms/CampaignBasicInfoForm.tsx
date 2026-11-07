'use client'

import React from 'react'
import { Campaign } from '@/src/types/marketing/campaign'

interface CampaignBasicInfoFormProps {
  formData: Campaign
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
}

export const CampaignBasicInfoForm: React.FC<CampaignBasicInfoFormProps> = ({ formData, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="font-semibold text-slate-700 block mb-1">Campaign Title *</label>
        <input
          type="text"
          name="campaign_name"
          required
          value={formData.campaign_name}
          onChange={onChange}
          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
          placeholder="e.g., Q3 Email Update"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="font-semibold text-slate-700 block mb-1">Channel Type</label>
          <select
            name="campaign_type"
            value={formData.campaign_type}
            onChange={onChange}
            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Social">Social</option>
            <option value="Push">Push</option>
            <option value="Multi-Channel">Multi-Channel</option>
          </select>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full px-2 py-1.5 border border-slate-200 rounded-lg cursor-pointer"
          >
            <option value="Draft">Draft</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="font-semibold text-slate-700 block mb-1">Target Audience Segment</label>
        <input
          type="text"
          name="target_audience"
          value={formData.target_audience}
          onChange={onChange}
          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none"
          placeholder="e.g., VIP Subscribers"
        />
      </div>

      <div>
        <label className="font-semibold text-slate-700 block mb-1">Campaign Notes / Objectives</label>
        <textarea
          name="notes"
          rows={3}
          value={formData.notes || ''}
          onChange={onChange}
          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg outline-none resize-none"
          placeholder="Enter context specifications..."
        />
      </div>
    </div>
  )
}