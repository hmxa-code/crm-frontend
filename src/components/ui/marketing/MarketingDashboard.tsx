'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
  FiLayers,
  FiSend,
  FiCheckCircle,
  FiRefreshCw
} from 'react-icons/fi';
import Link from 'next/link';
import { CampaignsService } from '@/src/services/marketing/CampaignsService';
import { DripCampaignsService } from '@/src/services/marketing/DripCampaignsService';
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService';
import { ContentEngineService } from '@/src/services/marketing/ContentEngineService';
import { Campaign } from '@/src/types/marketing/campaign';
import { DripCampaign } from '@/src/types/marketing/drip-campaign';
import { SocialAccount } from '@/src/types/marketing/social-account';
import { ContentItem } from '@/src/types/marketing/content-engine';

export default function MarketingDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [dripCampaigns, setDripCampaigns] = useState<DripCampaign[]>([]);
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [campaignData, dripData, socialData, contentData] = await Promise.all([
          CampaignsService.getAllCampaigns(),
          DripCampaignsService.getAllDripCampaigns(),
          SocialAccountsService.getConnectedAccounts(),
          ContentEngineService.getAllContent(),
        ]);

        setCampaigns(campaignData || []);
        setDripCampaigns(dripData || []);
        setSocialAccounts(socialData || []);
        setContentItems(contentData || []);
      } catch (error) {
        console.error('Error loading marketing dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const avgOpenRate = useMemo(() => {
    if (!campaigns || !campaigns.length) return 0;
    const totalOpenRate = campaigns.reduce((sum, campaign) => sum + (campaign?.open_rate || 0), 0);
    return Number((totalOpenRate / campaigns.length).toFixed(1));
  }, [campaigns]);

  const activeDripCount = useMemo(
    () => (Array.isArray(dripCampaigns) ? dripCampaigns.filter((campaign) => campaign?.status === 'Active').length : 0),
    [dripCampaigns]
  );

  const connectedSocialCount = useMemo(
    () => (Array.isArray(socialAccounts) ? socialAccounts.filter((acc) => acc?.status === 'Connected').length : 0),
    [socialAccounts]
  );

  const stats = [
    {
      label: 'Total Campaigns',
      value: loading ? '...' : (campaigns?.length || 0).toLocaleString(),
      subtext: `${(campaigns || []).filter((c) => c?.status === 'Active').length} active live`,
      icon: FiVolume2,
    },
    {
      label: 'Active Drips',
      value: loading ? '...' : activeDripCount.toLocaleString(),
      subtext: `${dripCampaigns?.length || 0} total pathways`,
      icon: FiZap,
    },
    {
      label: 'Social Channels',
      value: loading ? '...' : `${connectedSocialCount} / ${socialAccounts?.length || 0}`,
      subtext: 'OAuth 2.0 active tokens',
      icon: FiShare2,
    },
    {
      label: 'Content Queue',
      value: loading ? '...' : (contentItems?.length || 0).toLocaleString(),
      subtext: `${(contentItems || []).filter((i) => i?.status === 'Published').length} published dispatches`,
      icon: FiLayers,
    },
  ];

  const coreMarketingModules = [
    {
      title: 'Marketing Campaigns',
      description: 'Manage email blasts, SMS priority alerts, and direct cohort outreach',
      href: '/marketing/campaigns',
      badge: `${campaigns.length} Campaigns`,
    },
    {
      title: 'Social Accounts Hub',
      description: 'Manage OAuth connections, account health, and token synchronization',
      href: '/marketing/social-accounts',
      badge: `${connectedSocialCount} Connected`,
    },
    {
      title: 'Content Engine',
      description: 'Multi-channel post composer, schedule calendar, and live previews',
      href: '/marketing/content-engine',
      badge: `${contentItems.length} Posts`,
    },
    {
      title: 'Drip Campaigns',
      description: 'Time, event, and behavior-based automated lead nurturing pathways',
      href: '/marketing/drip-campaigns',
      badge: `${activeDripCount} Active Sequences`,
    },
    {
      title: 'Workflow Automation',
      description: 'Central CRM trigger rules, branching logic, and task distribution',
      href: '/marketing/workflows',
      badge: 'Decoupled Engine',
    },
    {
      title: 'Marketing Analytics',
      description: 'Cross-channel attribution reports, ROI matrices, and conversion funnels',
      href: '/marketing/analytics',
      badge: `${avgOpenRate}% Avg OR`,
    },
  ];

  const recentCampaigns = useMemo(
    () =>
      campaigns
        .slice(0, 5)
        .map((campaign) => ({
          id: campaign._id,
          name: campaign.campaign_name,
          type: campaign.campaign_type,
          status: campaign.status,
          recipients: campaign.recipient_count ?? 0,
          openRate: `${campaign.open_rate ?? 0}%`,
          conversionRate: `${campaign.conversion_rate ?? 0}%`,
        })),
    [campaigns]
  );

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Module Header & Subtitle */}
        <div className="flex flex-col gap-1.5 bg-white border border-slate-300 rounded-2xl p-5 shadow-xs">
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
            Marketing Operations & Campaigns Hub
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
            Orchestrate multi-channel marketing campaigns, track social platform connections, and monitor live engagement metrics.
          </p>
        </div>

        {/* Unified Performance Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label} 
                className="bg-white border border-slate-300 rounded-2xl p-4 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                  <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-900">
                    <Icon size={14} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-extrabold text-slate-900 font-mono">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Structured Navigation Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
              Marketing Modules & Hubs
            </h2>
            <span className="text-[11px] text-slate-500">All modules running live enterprise datasets</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {coreMarketingModules.map((action) => {
              return (
                <Link key={action.title} href={action.href} className="group block">
                  <div className="bg-white border border-slate-300 hover:border-black hover:shadow-md rounded-2xl p-4.5 transition-all shadow-xs flex items-start justify-between">
                    <div className="flex gap-3.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-xs transition-colors group-hover:text-black">
                            {action.title}
                          </h3>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 font-medium leading-relaxed">
                          {action.description}
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-extrabold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          {action.badge}
                        </span>
                      </div>
                    </div>
                    <FiArrowRight size={13} className="text-slate-400 group-hover:text-black group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Clean Ledger Log */}
        <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-300 bg-slate-50">
            <div>
              <h2 className="text-xs font-bold text-slate-900 tracking-wide">Recent Campaign Dispatches</h2>
              <p className="text-[11px] text-slate-500">Real-time status across active channels</p>
            </div>
            <Link 
              href="/marketing/campaigns" 
              className="text-slate-800 hover:text-black text-[11px] font-bold border border-slate-300 bg-white px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
            >
              View Full Hub &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-600 text-[10px] uppercase font-bold tracking-wider">
                  <th className="py-3 px-5">Campaign Anchor</th>
                  <th className="py-3 px-4">Channel</th>
                  <th className="py-3 px-4">Lifecycle State</th>
                  <th className="py-3 px-4">Dispatched Reach</th>
                  <th className="py-3 px-4 text-center">Open Rate</th>
                  <th className="py-3 px-5 text-right">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">Loading streamed metrics...</td>
                  </tr>
                ) : recentCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">No campaigns found.</td>
                  </tr>
                ) : (
                  recentCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-5 text-slate-900 font-bold max-w-xs truncate">
                        <Link href={`/marketing/campaigns/${campaign.id}`} className="hover:underline">
                          {campaign.name}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 border border-slate-300 rounded-md text-[10px] font-bold">
                          {campaign.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 border border-slate-300 bg-slate-100 text-slate-900 text-[10px] font-bold rounded-md">
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium whitespace-nowrap">
                        {campaign.recipients.toLocaleString()} profiles
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-900">{campaign.openRate}</span>
                      </td>
                      <td className="py-3.5 px-5 text-right font-extrabold text-slate-900">
                        {campaign.conversionRate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}