'use client'

import React from 'react'
import { FiX, FiLayers, FiCalendar, FiUsers, FiSliders, FiDollarSign } from 'react-icons/fi'
import { Campaign } from '@/src/types/marketing/campaign'

interface CreateCampaignDrawerProps {
  isOpen: boolean
  isEditing: boolean
  formData: Campaign
  onClose: () => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  onSubmit: (e: React.FormEvent) => void
  submitting: boolean
}

export const CreateCampaignDrawer: React.FC<CreateCampaignDrawerProps> = ({
  isOpen,
  isEditing,
  formData,
  onClose,
  onChange,
  onSubmit,
  submitting,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-2xs" onClick={onClose} />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md bg-white border-l border-slate-200 h-full p-5 flex flex-col text-xs animate-in slide-in-from-right duration-150 shadow-xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 rounded-md text-slate-700">
              <FiLayers size={15} />
            </div>
            <h2 className="font-bold text-slate-900 text-sm">
              {isEditing ? 'Configure Enterprise Campaign' : 'Create New Campaign'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-slate-100 rounded text-slate-400 cursor-pointer">
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body - Scrollable Sections */}
        <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
          
          {/* Section 1: Basic Information */}
          <div className="space-y-3 bg-slate-50/60 p-3 rounded-lg border border-slate-200/60">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <FiSliders size={12} className="text-blue-600" /> Basic Details
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Campaign Title *</label>
              <input
                type="text"
                name="campaign_name"
                required
                value={formData.campaign_name}
                onChange={onChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-medium text-slate-900"
                placeholder="e.g., Q3 Product Launch & Retention"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Channel Type</label>
                <select
                  name="campaign_type"
                  value={formData.campaign_type}
                  onChange={onChange}
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-slate-800 font-medium"
                >
                  <option value="Email">Email Broadcast</option>
                  <option value="SMS">SMS Sequence</option>
                  <option value="Social">Social Media</option>
                  <option value="Push">Push Notification</option>
                  <option value="Multi-Channel">Multi-Channel</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Deployment Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={onChange}
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer text-slate-800 font-medium"
                >
                  <option value="Draft">Draft Mode</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Active">Active Live</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Audience & Targeting */}
          <div className="space-y-3 bg-slate-50/60 p-3 rounded-lg border border-slate-200/60">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <FiUsers size={12} className="text-blue-600" /> Audience Targeting
            </h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Segment / List</label>
              <input
                type="text"
                name="target_audience"
                value={formData.target_audience}
                onChange={onChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-900"
                placeholder="e.g., VIP Subscribers, High-Intent Leads"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Estimated Target Volume</label>
              <input
                type="number"
                name="target_count"
                value={formData.target_count || 0}
                onChange={onChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-900"
                placeholder="0"
              />
            </div>
          </div>

          {/* Section 3: Schedule & Budget */}
          <div className="space-y-3 bg-slate-50/60 p-3 rounded-lg border border-slate-200/60">
            <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
              <FiCalendar size={12} className="text-blue-600" /> Schedule & Allocation
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Ad / Send Budget ($)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-slate-400">
                    <FiDollarSign size={12} />
                  </span>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget || ''}
                    onChange={onChange}
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-slate-900"
                    placeholder="500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Notes & Context */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">Campaign Strategy & Notes</label>
            <textarea
              name="notes"
              rows={3}
              value={formData.notes || ''}
              onChange={onChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none resize-none text-slate-900"
              placeholder="Enter context specifications or UTM parameter details..."
            />
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-100 flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 font-semibold hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 cursor-pointer disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save Campaign'}
          </button>
        </div>
      </form>
    </div>
  )
}