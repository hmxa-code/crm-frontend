'use client'

import React, { useMemo, useState } from 'react'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
import { FaMailBulk } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6'
import { FiCalendar } from 'react-icons/fi'
import { IoSendSharp } from 'react-icons/io5'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CampaignsService, Campaign } from '@/src/services/marketing/CampaignsService'

export default function CreateCampaignPage() {
  const router = useRouter()
  const [campaignType, setCampaignType] = useState<'email' | 'sms' | 'drip' | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState<Partial<Campaign> & { scheduledDate: string; scheduledTime: string }>({
    campaign_name: '',
    campaign_type: 'Email',
    status: 'Draft',
    start_date: Date.now(),
    target_audience: '',
    target_count: 0,
    recipient_count: 0,
    open_rate: 0,
    click_rate: 0,
    conversion_rate: 0,
    budget: 0,
    notes: '',
    scheduledDate: '',
    scheduledTime: '',
  })

  const mapCampaignType = (type: 'email' | 'sms' | 'drip'): Campaign['campaign_type'] => {
    if (type === 'sms') return 'SMS'
    if (type === 'drip') return 'Multi-Channel'
    return 'Email'
  }

  const campaignTypeLabel = useMemo(() => {
    if (campaignType === 'sms') return 'SMS'
    if (campaignType === 'drip') return 'Multi-Channel'
    return 'Email'
  }, [campaignType])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!formData.campaign_name?.trim()) {
      setErrorMessage('Campaign name is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const scheduledDateTime = formData.scheduledDate
        ? new Date(`${formData.scheduledDate}T${formData.scheduledTime || '00:00'}`).getTime()
        : Date.now()

      const campaignPayload: Omit<Campaign, '_id'> = {
        campaign_name: formData.campaign_name?.trim() || '',
        campaign_type: (formData.campaign_type as Campaign['campaign_type']) || mapCampaignType(campaignType ?? 'email'),
        status: (formData.status as Campaign['status']) ?? 'Draft',
        start_date: scheduledDateTime,
        target_audience: formData.target_audience || 'General Audience',
        target_count: formData.target_count ?? 0,
        recipient_count: formData.recipient_count ?? 0,
        open_rate: formData.open_rate ?? 0,
        click_rate: formData.click_rate ?? 0,
        conversion_rate: formData.conversion_rate ?? 0,
        budget: formData.budget ?? 0,
        created_by: 'Current User',
        notes: formData.notes || '',
      }

      await CampaignsService.createCampaign(campaignPayload as Campaign)

      setSuccessMessage('Campaign saved to the backend successfully.')
      window.setTimeout(() => router.push('/marketing/campaigns'), 800)
    } catch (error) {
      console.error('Failed to create campaign:', error)
      setErrorMessage('Unable to save campaign right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-[#fcfdfe] text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto px-4 md:px-10 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <Link href="/marketing/campaigns" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
              ← Back to Campaigns
            </Link>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Create New Campaign</h1>
            <p className="mt-2 text-sm text-slate-500 max-w-2xl">
              Choose a campaign type and provide the campaign configuration using the same marketing campaign fields used across the CRM.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <div className="grid gap-6">
          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Campaign Type</h2>
                <p className="text-sm text-slate-500 mt-1">Select the campaign channel before filling in campaign details.</p>
              </div>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {campaignType ? campaignTypeLabel : 'No type selected'}
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { type: 'email', title: 'Email Campaign', description: 'Send targeted messages by email.', icon: FaMailBulk },
                { type: 'sms', title: 'SMS Campaign', description: 'Send quick SMS broadcasts.', icon: FaUsers },
                { type: 'drip', title: 'Drip Campaign', description: 'Build automated drip flows.', icon: FiCalendar },
              ].map((option) => {
                const Icon = option.icon
                const selected = campaignType === option.type
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => {
                      setCampaignType(option.type as 'email' | 'sms' | 'drip')
                      setFormData((prev) => ({
                        ...prev,
                        campaign_type: mapCampaignType(option.type as 'email' | 'sms' | 'drip'),
                      }))
                    }}
                    className={`rounded-3xl border px-5 py-6 text-left transition-all shadow-sm ${
                      selected ? 'border-blue-500 bg-blue-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-blue-600 mb-4">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{option.title}</h3>
                    <p className="mt-2 text-sm text-slate-500">{option.description}</p>
                  </button>
                )
              })}
            </div>
          </section>

          {campaignType && (
            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Campaign Details</h2>
                  <p className="text-sm text-slate-500">Use the live campaign fields below to create a marketing campaign that matches the CRM data model.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  {campaignTypeLabel}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign Name</label>
                    <input
                      type="text"
                      name="campaign_name"
                      value={formData.campaign_name ?? ''}
                      onChange={handleChange}
                      placeholder="Enter campaign name"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Campaign Type</label>
                    <select
                      name="campaign_type"
                      value={formData.campaign_type ?? campaignTypeLabel}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Email">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="Multi-Channel">Multi-Channel</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status ?? 'Draft'}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="Draft">Draft</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Target Audience</label>
                    <input
                      type="text"
                      name="target_audience"
                      value={formData.target_audience ?? ''}
                      onChange={handleChange}
                      placeholder="e.g. Inactive subscribers"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Target Count</label>
                    <input
                      type="number"
                      name="target_count"
                      value={formData.target_count ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Recipients</label>
                    <input
                      type="number"
                      name="recipient_count"
                      value={formData.recipient_count ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Start Date</label>
                    <input
                      type="date"
                      name="scheduledDate"
                      value={formData.scheduledDate}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Start Time</label>
                    <input
                      type="time"
                      name="scheduledTime"
                      value={formData.scheduledTime}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Open Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="open_rate"
                      value={formData.open_rate ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Click Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="click_rate"
                      value={formData.click_rate ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Conversion Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="conversion_rate"
                      value={formData.conversion_rate ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Budget ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="budget"
                      value={formData.budget ?? 0}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes ?? ''}
                    onChange={handleChange}
                    placeholder="Add internal campaign notes..."
                    rows={5}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4">
                  <div className="text-sm text-slate-500">Complete the campaign form and save it to the marketing campaigns list.</div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setCampaignType(null)}
                      className="rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-3xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? 'Creating...' : 'Create Campaign'}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}