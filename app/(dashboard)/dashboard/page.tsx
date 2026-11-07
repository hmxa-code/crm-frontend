'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
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
  FiArrowRight, 
  FiCheckCircle, 
  FiClock, 
  FiLoader,
  FiActivity
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

  // Chart Mock Analytics matching the sleek Slate palette
  const analyticsTrend = [
    { month: 'Jan', openRate: 24, clicks: 12, conversions: 4.2 },
    { month: 'Feb', openRate: 28, clicks: 15, conversions: 5.1 },
    { month: 'Mar', openRate: 35, clicks: 22, conversions: 6.8 },
    { month: 'Apr', openRate: 32, clicks: 19, conversions: 5.9 },
    { month: 'May', openRate: 41, clicks: 28, conversions: 8.4 },
    { month: 'Jun', openRate: 45, clicks: 31, conversions: 9.1 },
  ]

  const channelDistribution = [
    { name: 'Email Direct', value: 45, color: '#0f172a' }, // Slate 900
    { name: 'Drip Sequence', value: 30, color: '#10b981' }, // Emerald 500
    { name: 'Social Push', value: 15, color: '#f59e0b' }, // Amber 500
    { name: 'SMS Flow', value: 10, color: '#64748b' }, // Slate 500
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

  if (loading) {
    return (
      <div className="w-full h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <FiLoader className="animate-spin w-7 h-7 text-slate-600 mb-3" />
        <p className="text-slate-400 text-xs font-bold tracking-tight">Syncing Marketing Intelligence...</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* --- Top Title Bar (Original Style) --- */}
        <div className="bg-white border border-slate-200/80 rounded-xl px-5 py-4 shadow-2xs">
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Marketing Intelligence</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Streamline automated sequences, user matrix distribution, and core tracking loops.
          </p>
        </div>

        {/* --- Unified Performance Metrics Row --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div 
                key={stat.label} 
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-3xs flex items-center justify-between"
              >
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

        {/* --- Charts Grid (Matching Original Theme) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Analytics Area Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Performance Stream</span>
                <h3 className="font-bold text-slate-900 text-xs mt-0.5">Engagement Velocity</h3>
              </div>
              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 bg-slate-900 rounded-xs" /> Open Rate %
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 bg-emerald-500 rounded-xs" /> Conversions %
                </span>
              </div>
            </div>
            <div className="h-56 w-full text-xs font-medium">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsTrend} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorOpenRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.12}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} dy={5} />
                  <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} dx={-5} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="openRate" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorOpenRate)" name="Open Rate (%)" />
                  <Area type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorConversions)" name="Conversions (%)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Traffic Share Donut Chart */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Traffic Matrix</span>
              <h3 className="font-bold text-slate-900 text-xs mt-0.5 mb-2">Channel Allocation</h3>
            </div>
            
            <div className="h-40 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
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
              <div className="absolute flex flex-col items-center">
                <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Allocation</span>
                <span className="text-base font-extrabold text-slate-900">100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[10px] font-bold text-slate-600">
              {channelDistribution.map((item, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* --- Structured Navigation Grid (Operational Nodes) --- */}
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

        {/* --- Ledger Table & Activity Split --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Campaigns Table (2 Cols) */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-3xs overflow-hidden lg:col-span-2">
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
                  {recentCampaigns.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">No active streams monitored.</td>
                    </tr>
                  ) : (
                    recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-slate-50/40 transition-colors">
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

          {/* Clean Vector Activity Feed (1 Col) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-3xs flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Audit Trails</span>
              <h3 className="font-bold text-slate-900 text-xs mt-0.5 mb-3">System Events</h3>
              
              <div className="divide-y divide-slate-100">
                {[
                  { activity: 'Drip campaign sequence synchronized', time: '10 mins ago', icon: FiZap },
                  { activity: 'Lead score matrix recalibrated', time: '1 hour ago', icon: FiActivity },
                  { activity: 'New email broadcast dispatched', time: '3 hours ago', icon: FiMail },
                  { activity: 'Social API integration validated', time: '5 hours ago', icon: FiCheckCircle },
                ].map((item, i) => {
                  const ActivityIcon = item.icon
                  return (
                    <div key={i} className="flex gap-3 py-2.5 first:pt-0 last:pb-0 items-center">
                      <div className="w-7 h-7 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <ActivityIcon size={13} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-slate-800 font-bold truncate">{item.activity}</p>
                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <FiClock size={10} /> {item.time}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}