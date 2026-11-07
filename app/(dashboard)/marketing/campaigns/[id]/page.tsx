// 'use client'

// import React, { useEffect, useState } from 'react'
// import { CgMoreVerticalR } from 'react-icons/cg'
// import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'
// import { FiEdit2 } from 'react-icons/fi'
// import { FaMailBulk } from 'react-icons/fa'
// import { FaUsers } from 'react-icons/fa6'
// import { PiTrendUpDuotone } from 'react-icons/pi'
// import { IoCalendar } from 'react-icons/io5'
// import Link from 'next/link'
// import { Campaign, CampaignsService } from '@/src/services/marketing/CampaignsService'

// export default function CampaignDetailPage({ params }: { params: { id: string } }) {
//   const [campaign, setCampaign] = useState<Campaign | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState('')

//   useEffect(() => {
//     async function loadCampaign() {
//       if (!params?.id) return
//       setLoading(true)
//       setError('')
//       try {
//         const loaded = await CampaignsService.getCampaignById(params.id)
//         if (!loaded) {
//           setError('Campaign not found.')
//         }
//         setCampaign(loaded)
//       } catch (err) {
//         console.error('Failed to load campaign detail:', err)
//         setError('Unable to load campaign details.')
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadCampaign()
//   }, [params.id])

//   const formatDate = (timestamp?: number | string) => {
//     if (!timestamp) return 'N/A'
//     const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp)
//     return date.toLocaleDateString()
//   }

//   const openRate = campaign?.open_rate ?? 0
//   const clickRate = campaign?.click_rate ?? 0
//   const conversionRate = campaign?.conversion_rate ?? campaign?.conversation_rate ?? 0
//   const sentCount = campaign?.recipient_count ?? 0

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
//       <div className="max-w-6xl mx-auto">
//         <Link href="/marketing/campaigns" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
//           <MdOutlineKeyboardArrowLeft size={20} />
//           Back to Campaigns
//         </Link>

//         {loading ? (
//           <div className="rounded-xl bg-white p-8 shadow-sm text-center text-slate-600">Loading campaign details...</div>
//         ) : error ? (
//           <div className="rounded-xl bg-red-50 border border-red-200 p-8 text-red-700">{error}</div>
//         ) : campaign ? (
//           <>
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
//               <div>
//                 <h1 className="text-3xl font-bold text-slate-900 mb-2">{campaign.campaign_name}</h1>
//                 <p className="text-slate-600">{campaign.notes || campaign.target_audience || 'Campaign details and schedule.'}</p>
//               </div>
//               <div className="flex gap-2">
//                 <Link
//                   href={`/marketing/campaigns/${params.id}/edit`}
//                   className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   <FiEdit2 size={20} />
//                   Edit
//                 </Link>
//                 <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
//                   <CgMoreVerticalR size={20} className="text-slate-600" />
//                 </button>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//               {[
//                 { label: 'Status', value: campaign.status, icon: FaMailBulk, color: 'bg-green-100 text-green-600' },
//                 { label: 'Recipients', value: sentCount, icon: FaUsers, color: 'bg-blue-100 text-blue-600' },
//                 { label: 'Open Rate', value: `${openRate}%`, icon: PiTrendUpDuotone, color: 'bg-purple-100 text-purple-600' },
//                 { label: 'Click Rate', value: `${clickRate}%`, icon: FaMailBulk, color: 'bg-orange-100 text-orange-600' },
//               ].map((stat) => {
//                 const Icon = stat.icon
//                 return (
//                   <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-4">
//                       <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
//                       <div className={`p-3 rounded-lg ${stat.color}`}>
//                         <Icon size={20} />
//                       </div>
//                     </div>
//                     <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
//                   </div>
//                 )
//               })}
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-slate-900 mb-6">Performance Metrics</h2>
//                 <div className="space-y-4">
//                   {[
//                     { label: 'Sent', value: sentCount },
//                     { label: 'Opened', value: Math.round((sentCount * openRate) / 100) },
//                     { label: 'Clicked', value: Math.round((sentCount * clickRate) / 100) },
//                     { label: 'Converted', value: Math.round((sentCount * conversionRate) / 100) },
//                   ].map((metric) => (
//                     <div key={metric.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
//                       <span className="text-slate-700 font-medium">{metric.label}</span>
//                       <span className="text-slate-900 font-semibold">{metric.value.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg shadow-sm p-6">
//                 <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Timeline</h2>
//                 <div className="space-y-6">
//                   {[
//                     { status: 'Created', date: campaign.createdAt || formatDate(campaign.start_date), icon: FaMailBulk },
//                     { status: 'Start Date', date: formatDate(campaign.start_date), icon: IoCalendar },
//                     { status: 'Last Updated', date: campaign.updatedAt ? formatDate(campaign.updatedAt) : 'N/A', icon: PiTrendUpDuotone },
//                   ].map((event, index) => (
//                     <div key={index} className="flex gap-4">
//                       <div className="flex flex-col items-center">
//                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                           <event.icon size={20} className="text-blue-600" />
//                         </div>
//                         {index < 2 && <div className="w-0.5 h-12 bg-blue-200 mt-2"></div>}
//                       </div>
//                       <div className="pt-2">
//                         <p className="font-semibold text-slate-900">{event.status}</p>
//                         <p className="text-slate-600 text-sm">{event.date}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
//               <h2 className="text-xl font-bold text-slate-900 mb-6">Campaign Details</h2>
//               <div className="grid gap-4">
//                 <div className="text-slate-700">
//                   <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Campaign Type</p>
//                   <p className="text-base font-bold text-slate-900">{campaign.campaign_type}</p>
//                 </div>
//                 <div className="text-slate-700">
//                   <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Target Audience</p>
//                   <p className="text-base font-bold text-slate-900">{campaign.target_audience || 'General audience'}</p>
//                 </div>
//                 <div className="text-slate-700">
//                   <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">Notes</p>
//                   <p className="text-base font-bold text-slate-900">{campaign.notes || 'No additional notes available.'}</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         ) : null}
//       </div>
//     </div>
//   )
// }

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiEdit2, 
  FiTrash2, 
  FiUsers, 
  FiActivity, 
  FiCalendar, 
  FiDollarSign, 
  FiMail, 
  FiLayers,
  FiLoader 
} from 'react-icons/fi';
import { Campaign } from '@/src/types/marketing/campaign';
import { CampaignsService } from '@/src/services/marketing/CampaignsService';
import { CampaignStatusBadge } from '@/src/components/marketing/campaigns/shared/CampaignStatusBadge';
import { CampaignTypeIcon } from '@/src/components/marketing/campaigns/shared/CampaignTypeIcon';
import toast, { Toaster } from 'react-hot-toast';

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadCampaign() {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const loaded = await CampaignsService.getCampaignById(id);
        if (!loaded) {
          setError('Campaign not found.');
        }
        setCampaign(loaded);
      } catch (err) {
        console.error('Failed to load campaign detail:', err);
        setError('Unable to load campaign details.');
      } finally {
        setLoading(false);
      }
    }

    loadCampaign();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    if (confirm('Are you sure you want to permanently delete this campaign?')) {
      try {
        await CampaignsService.deleteCampaign(id);
        toast.success('Campaign removed successfully.');
        router.push('/marketing/campaigns');
      } catch (err) {
        toast.error('Failed to delete campaign.');
      }
    }
  };

  const formatDate = (dateVal?: number | string) => {
    if (!dateVal) return 'Not scheduled';
    const date = typeof dateVal === 'number' ? new Date(dateVal) : new Date(dateVal);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen p-6 text-slate-900 font-sans antialiased">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Navigation */}
        <div>
          <Link
            href="/marketing/campaigns"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <FiArrowLeft size={14} />
            <span>Back to Campaigns Hub</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-20 flex flex-col items-center justify-center shadow-xs">
            <FiLoader className="text-3xl text-blue-600 animate-spin mb-3" />
            <p className="text-xs font-bold text-slate-700">Loading campaign architecture...</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-rose-700 text-xs font-bold">
            {error}
          </div>
        ) : campaign ? (
          <>
            {/* Top Header Banner */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CampaignStatusBadge status={campaign.status} />
                  <span className="text-[10px] font-mono text-slate-400">ID: {campaign._id}</span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {campaign.campaign_name}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  {campaign.notes || 'Multi-touch campaign targeted for audience engagement.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                >
                  <FiTrash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>
            </div>

            {/* Live Backend Telemetry KPI Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
                  <FiActivity /> Live Backend Telemetry
                </span>
                <span className="text-[10px] font-medium text-slate-400">Webhook Automated Sync</span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recipients Dispatched</span>
                  <span className="text-xl font-extrabold text-white">
                    {campaign.recipient_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Open Rate (OR)</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {campaign.open_rate || 0}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-850/80 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Click Rate (CTR)</span>
                  <span className="text-xl font-extrabold text-blue-400">
                    {campaign.click_rate || 0}%
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>Conversion Velocity:</span>
                <span className="text-white font-bold">{campaign.conversion_rate || 0}% Closed-Won Conversion</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Configuration Specifications */}
              <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Campaign Configuration & Targeting
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Channel Type:</span>
                    <CampaignTypeIcon type={campaign.campaign_type} />
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Target Audience Segment:</span>
                    <span className="font-bold text-slate-800">{campaign.target_audience || 'General Audience'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Estimated Audience Size:</span>
                    <span className="font-bold text-slate-800">{(campaign.target_count || 0).toLocaleString()} Contacts</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Send / Ad Budget:</span>
                    <span className="font-extrabold text-emerald-600">${(campaign.budget || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Launch Date:</span>
                    <span className="font-bold text-slate-800">{formatDate(campaign.start_date)}</span>
                  </div>
                  {campaign.end_date && (
                    <div className="flex items-center justify-between text-xs py-2">
                      <span className="text-slate-500 font-medium">Completion Date:</span>
                      <span className="font-bold text-slate-800">{formatDate(campaign.end_date)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* UTM Attribution Panel */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Attribution & UTM
                </h3>

                {(campaign.utm_source || campaign.utm_medium || campaign.utm_campaign) ? (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs text-slate-700 space-y-1.5">
                    <div>source: <span className="font-bold text-blue-600">{campaign.utm_source || '—'}</span></div>
                    <div>medium: <span className="font-bold text-blue-600">{campaign.utm_medium || '—'}</span></div>
                    <div>campaign: <span className="font-bold text-blue-600">{campaign.utm_campaign || '—'}</span></div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">No attribution parameters defined.</p>
                )}

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Created By</span>
                  <span className="text-xs font-semibold text-slate-800">{campaign.created_by || 'Growth Team'}</span>
                </div>
              </div>

            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}