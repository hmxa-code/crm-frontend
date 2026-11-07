'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { 
  FiMail, 
  FiUsers, 
  FiTrendingUp, 
  FiVolume2, 
  FiCpu, 
  FiPieChart, 
  FiShare2,
  FiZap,
  FiBarChart2,
  FiArrowRight
} from 'react-icons/fi'
import Link from 'next/link'
import { CampaignsService, Campaign } from '@/src/services/marketing/CampaignsService'
import { DripCampaignsService, DripCampaign } from '@/src/services/marketing/DripCampaignsService'

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [dripCampaigns, setDripCampaigns] = useState<DripCampaign[]>([])
  const [leadScoresCount, setLeadScoresCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const [campaignData, dripData, leadScores] = await Promise.all([
          CampaignsService.getAllCampaigns(),
          DripCampaignsService.getAllDripCampaigns(),
        ])

        setCampaigns(campaignData || [])
        setDripCampaigns(dripData || [])
        setLeadScoresCount(leadScores?.length || 0)
      } catch (error) {
        console.error('Error loading marketing dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const avgOpenRate = useMemo(() => {
    if (!campaigns.length) return 0
    const totalOpenRate = campaigns.reduce((sum, campaign) => sum + (campaign.open_rate || 0), 0)
    return Number((totalOpenRate / campaigns.length).toFixed(1))
  }, [campaigns])

  const activeDripCount = useMemo(
    () => dripCampaigns.filter((campaign) => campaign.status === 'Active').length,
    [dripCampaigns],
  )

  const stats = [
    {
      label: 'Total Campaigns',
      value: loading ? '...' : campaigns.length.toLocaleString(),
      icon: FiVolume2,
    },
    {
      label: 'Active Drips',
      value: loading ? '...' : activeDripCount.toLocaleString(),
      icon: FiZap,
    },
    {
      label: 'Leads Scored',
      value: loading ? '...' : leadScoresCount.toLocaleString(),
      icon: FiUsers,
    },
    {
      label: 'Avg. Open Rate',
      value: loading ? '...' : `${avgOpenRate}%`,
      icon: FiTrendingUp,
    },
  ]

  const quickActions = [
    {
      title: 'Create Campaign',
      description: 'Deploy direct email or SMS targets',
      icon: FiMail,
      href: '/marketing/campaigns/create',
    },
    {
      title: 'Drip Sequences',
      description: 'Manage drip nurturing queues',
      icon: FiZap,
      href: '/marketing/drip-campaigns',
    },
    {
      title: 'Lead Scoring',
      description: 'Calibrate behavior score matrix',
      icon: FiPieChart,
      href: '/marketing/lead-scoring',
    },
    {
      title: 'Automation Workflows',
      description: 'Orchestrate conditional triggers',
      icon: FiCpu,
      href: '/marketing/workflows',
    },
    {
      title: 'Social Integrations',
      description: 'Connect enterprise profiles',
      icon: FiShare2,
      href: '/marketing/social-integration',
    },
    {
      title: 'Performance Analytics',
      description: 'Audit distribution statistics',
      icon: FiBarChart2,
      href: '/marketing/analytics',
    },
  ]

  const recentCampaigns = useMemo(
    () =>
      campaigns
        .slice()
        .sort((a, b) => (b.start_date || 0) - (a.start_date || 0))
        .slice(0, 4)
        .map((campaign) => ({
          id: campaign._id ?? campaign.campaign_name,
          name: campaign.campaign_name,
          type: campaign.campaign_type,
          status: campaign.status,
          recipients: campaign.recipient_count ?? 0,
          openRate: `${campaign.open_rate ?? 0}%`,
        })),
    [campaigns],
  )

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Scheduled':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200'
    }
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Top Title Bar --- */}
        <div className="bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-2xs">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Marketing Intelligence</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Streamline automated sequences, user matrix distribution, and core tracking loops.</p>
        </div>

        {/* --- Unified Performance Metrics Row --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500">
                  <Icon size={14} />
                </div>
              </div>
            )
          })}
        </div>

        {/* --- Structured Navigation Grid --- */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Operational Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} href={action.href} className="group block">
                  <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 transition-all shadow-3xs flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors h-9 w-9 flex items-center justify-center shrink-0">
                        <Icon size={14} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-xs transition-colors group-hover:text-slate-900">{action.title}</h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium leading-relaxed">{action.description}</p>
                      </div>
                    </div>
                    <FiArrowRight size={12} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* --- Clean Ledger Log --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold text-slate-800 tracking-wide">Recent Campaign Tracks</h2>
            <Link href="/marketing/campaigns" className="text-slate-600 hover:text-slate-900 text-[11px] font-bold border border-slate-200 bg-white px-2.5 py-1 rounded-md transition-colors shadow-2xs">
              Audit Index
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Campaign Anchor</th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Channel</th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">State</th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Reach</th>
                  <th className="py-2.5 px-5 font-semibold text-slate-400 text-[10px] uppercase tracking-wider">Conversions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">Loading streaming metrics...</td>
                  </tr>
                ) : recentCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No active streams monitored.</td>
                  </tr>
                ) : (
                  recentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-5 text-slate-900 font-bold">{campaign.name}</td>
                      <td className="py-3 px-5">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[10px] font-semibold tracking-wide">
                          {campaign.type}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-0.5 border text-[10px] font-bold rounded-md ${getStatusStyle(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-500 font-medium">{campaign.recipients.toLocaleString()} profiles</td>
                      <td className="py-3 px-5 text-slate-900 font-bold">{campaign.openRate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}