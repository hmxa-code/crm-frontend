'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { PiTrendUpDuotone } from 'react-icons/pi'
import { FaChartBar, FaMailBulk } from 'react-icons/fa'
import { FaUsers } from 'react-icons/fa6'
import Link from 'next/link'
import { CampaignsService, Campaign } from '@/src/services/marketing/CampaignsService'

export default function AnalyticsDashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadCampaigns() {
      setLoading(true)
      try {
        const data = await CampaignsService.getAllCampaigns()
        setCampaigns(data)
      } catch (error) {
        console.error('Error loading analytics data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const totals = useMemo(() => {
    const totalCampaigns = campaigns.length
    const totalLeads = campaigns.reduce((sum, campaign) => sum + (campaign.recipient_count ?? 0), 0)
    const avgOpenRate = totalCampaigns
      ? Number((campaigns.reduce((sum, campaign) => sum + (campaign.open_rate ?? 0), 0) / totalCampaigns).toFixed(1))
      : 0
    const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget ?? 0), 0)

    return { totalCampaigns, totalLeads, avgOpenRate, totalBudget }
  }, [campaigns])

  const campaignRows = useMemo(
    () =>
      campaigns
        .slice()
        .sort((a, b) => (b.open_rate ?? 0) - (a.open_rate ?? 0))
        .slice(0, 5)
        .map((campaign) => ({
          id: campaign._id ?? campaign.campaign_name,
          name: campaign.campaign_name,
          sent: campaign.recipient_count ?? 0,
          opens: campaign.open_rate ?? 0,
          clicks: campaign.click_rate ?? 0,
          conversions: campaign.conversion_rate ?? campaign.conversation_rate ?? 0,
        })),
    [campaigns],
  )

  return (
    <div className="w-full min-h-screen bg-[#fcfdfe] text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-blue-600 font-semibold">Marketing Analytics</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Campaign performance in one place</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-500">
              Monitor campaign health, compare channel performance, and build targeted reports using your latest marketing data.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Link
              href="/marketing/analytics/campaigns"
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:shadow-md transition"
            >
              Campaign Metrics
            </Link>
            <Link
              href="/marketing/analytics/reports"
              className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:shadow-md transition"
            >
              Report Builder
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
          {[
            { label: 'Total Campaigns', value: loading ? '...' : totals.totalCampaigns.toLocaleString(), icon: FaMailBulk },
            { label: 'Total Leads', value: loading ? '...' : totals.totalLeads.toLocaleString(), icon: FaUsers },
            { label: 'Avg. Open Rate', value: loading ? '...' : `${totals.avgOpenRate}%`, icon: PiTrendUpDuotone },
            { label: 'Total Budget', value: loading ? '...' : `$${totals.totalBudget.toLocaleString()}`, icon: FaChartBar },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
                  </div>
                  <Icon size={24} className="text-blue-600" />
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Campaign Performance Overview</h2>
            <p className="text-sm text-slate-500 mb-6">Top campaigns sorted by open rate and campaign engagement.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-1">
                <thead>
                  <tr className="text-sm uppercase tracking-[0.16em] text-slate-500">
                    <th className="py-3 px-4">Campaign</th>
                    <th className="py-3 px-4">Sent</th>
                    <th className="py-3 px-4">Open</th>
                    <th className="py-3 px-4">Click</th>
                    <th className="py-3 px-4">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">Loading performance overview…</td>
                    </tr>
                  ) : campaignRows.length > 0 ? (
                    campaignRows.map((campaign) => (
                      <tr key={campaign.id} className="rounded-3xl bg-slate-50 transition hover:bg-slate-100">
                        <td className="py-4 px-4 font-semibold text-slate-900">{campaign.name}</td>
                        <td className="py-4 px-4 text-slate-600">{campaign.sent.toLocaleString()}</td>
                        <td className="py-4 px-4 text-slate-900 font-semibold">{campaign.opens}%</td>
                        <td className="py-4 px-4 text-slate-900 font-semibold">{campaign.clicks}%</td>
                        <td className="py-4 px-4 text-slate-900 font-semibold">{campaign.conversions}%</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">No campaign performance data available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Summary Actions</h2>
            <div className="space-y-4">
              <Link href="/marketing/analytics/campaigns" className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                View full campaign analytics
              </Link>
              <Link href="/marketing/analytics/reports" className="block rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Open report builder
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
