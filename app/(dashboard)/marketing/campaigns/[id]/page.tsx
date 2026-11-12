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
import { CampaignStatusBadge } from '@/src/components/ui/marketing/campaigns/shared/CampaignStatusBadge';
import { CampaignTypeIcon } from '@/src/components/ui/marketing/campaigns/shared/CampaignTypeIcon';
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
    <div className="w-full bg-[#f8fafc] min-h-screen p-4 sm:p-6 lg:p-8 text-slate-900 font-sans antialiased">
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
                  <FiActivity /> Live Dispatched Telemetry
                </span>
                <span className="text-[10px] font-medium text-slate-400">Sync Frequency: Live</span>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Recipients Dispatched</span>
                  <span className="text-xl font-extrabold text-white">
                    {campaign.recipient_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Open Rate (OR)</span>
                  <span className="text-xl font-extrabold text-emerald-400">
                    {campaign.open_rate || 0}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
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

              {/* Attribution Panel */}
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
