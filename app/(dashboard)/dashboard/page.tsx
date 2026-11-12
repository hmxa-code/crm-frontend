'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
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
  FiLoader,
} from 'react-icons/fi'
import { CampaignsService } from '@/src/services/marketing/CampaignsService'
import { DripCampaignsService } from '@/src/services/marketing/DripCampaignsService'
import { Campaign } from '@/src/types/marketing/campaign'
import { DripCampaign } from '@/src/types/marketing/drip-campaign'

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [dripCampaigns, setDripCampaigns] = useState<DripCampaign[]>([])
  // TODO: replace with your lead scoring service count
  const [leadScoresCount, setLeadScoresCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const [campaignData, dripData] = await Promise.all([
          CampaignsService.getAllCampaigns(),
          DripCampaignsService.getAllDripCampaigns(),
        ])

        setCampaigns(campaignData || [])
        setDripCampaigns(dripData || [])
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

  const analyticsTrend = [
    { month: 'Jan', openRate: 24, clicks: 12, conversions: 4.2 },
    { month: 'Feb', openRate: 28, clicks: 15, conversions: 5.1 },
    { month: 'Mar', openRate: 35, clicks: 22, conversions: 6.8 },
    { month: 'Apr', openRate: 32, clicks: 19, conversions: 5.9 },
    { month: 'May', openRate: 41, clicks: 28, conversions: 8.4 },
    { month: 'Jun', openRate: 45, clicks: 31, conversions: 9.1 },
  ]

  const channelDistribution = [
    { name: 'Email Direct', value: 45, color: '#0f172a' },
    { name: 'Drip Sequence', value: 30, color: '#10b981' },
    { name: 'Social Push', value: 15, color: '#f59e0b' },
    { name: 'SMS Flow', value: 10, color: '#64748b' },
  ]

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
        .sort(
          (a, b) =>
            new Date(b.start_date ?? 0).getTime() - new Date(a.start_date ?? 0).getTime(),
        )
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

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] bg-[#f8fafc] flex flex-col items-center justify-center px-4">
        <FiLoader className="animate-spin w-7 h-7 text-slate-600 mb-3" />
        <p className="text-slate-400 text-xs font-bold tracking-tight text-center">
          Syncing Marketing Intelligence...
        </p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f8fafc] p-3 sm:p-4 lg:p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* Title */}
        <div className="bg-white border border-slate-200/80 rounded-xl px-4 sm:px-5 py-3 sm:py-4 shadow-2xs">
          <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            Marketing Intelligence
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
            Streamline automated sequences, user matrix distribution, and core tracking loops.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-3xs flex items-center justify-between gap-2 min-w-0"
              >
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-2 sm:p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 shrink-0">
                  <Icon size={14} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* Area Chart */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-3xs lg:col-span-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4 sm:mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Performance Stream
                </span>
                <h3 className="font-bold text-slate-900 text-xs mt-0.5">Engagement Velocity</h3>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 bg-slate-900 rounded-xs" /> Open Rate %
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-xs" /> Conversions %
                </span>
              </div>
            </div>
            <div className="h-48 sm:h-56 lg:h-64 w-full text-xs font-medium">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpenRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={5} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-5} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#e2e8f0',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="openRate"
                    stroke="#0f172a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorOpenRate)"
                    name="Open Rate (%)"
                  />
                  <Area
                    type="monotone"
                    dataKey="conversions"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorConversions)"
                    name="Conversions (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between min-w-0">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Traffic Matrix
              </span>
              <h3 className="font-bold text-slate-900 text-xs mt-0.5 mb-2">Channel Allocation</h3>
            </div>

            <div className="h-44 sm:h-48 lg:h-40 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="85%"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center pointer-events-none">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                  Allocation
                </span>
                <span className="text-base font-extrabold text-slate-900">100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-slate-100 text-[10px] font-bold text-slate-600">
              {channelDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-xs shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}