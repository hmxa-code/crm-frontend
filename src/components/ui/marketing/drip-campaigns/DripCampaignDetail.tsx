'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FiArrowLeft,
  FiUsers,
  FiCheckCircle,
  FiMail,
  FiMousePointer,
  FiTrendingUp,
  FiLoader,
  FiPause,
  FiPlay,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import { DripCampaign } from '@/src/types/marketing/drip-campaign';
import { DripCampaignsService } from '@/src/services/marketing/DripCampaignsService';
import { DripStatusBadge } from './shared/DripStatusBadge';
import { TriggerTypeBadge } from './shared/TriggerTypeBadge';
import { DripSequenceTimeline } from './views/DripSequenceTimeline';

interface DripCampaignDetailProps {
  campaignId: string;
}

export const DripCampaignDetail: React.FC<DripCampaignDetailProps> = ({ campaignId }) => {
  const [campaign, setCampaign] = useState<DripCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await DripCampaignsService.getById(campaignId);
        if (!cancelled) {
          if (!data) setError('Sequence not found.');
          setCampaign(data);
        }
      } catch {
        if (!cancelled) setError('Unable to load sequence telemetry.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const togglePause = async () => {
    if (!campaign) return;
    const next = campaign.status === 'Paused' ? 'Active' : campaign.status === 'Active' ? 'Paused' : campaign.status;
    if (next === campaign.status) return;
    await DripCampaignsService.updateStatus(campaign._id, next);
    setCampaign({ ...campaign, status: next });
    toast.success(next === 'Paused' ? 'Sequence paused.' : 'Sequence resumed.');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 p-16 flex flex-col items-center">
        <FiLoader className="text-3xl text-slate-900 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading visual builder…</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-4 px-2 sm:px-4 lg:px-6 py-4">
        <Link href="/marketing/drip-campaigns" className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:underline">
          <FiArrowLeft size={14} />
          Back to Drip Campaigns
        </Link>
        <div className="rounded-2xl border border-slate-300 bg-slate-50 p-8 text-slate-900 text-xs font-medium">
          {error || 'Sequence not found.'}
        </div>
      </div>
    );
  }

  const t = campaign.telemetry;

  return (
    <div className="w-full space-y-4 font-sans pb-6 px-2 sm:px-4 lg:px-6 py-3 text-slate-900 bg-[#f8fafc] min-h-screen">
      <Toaster position="top-right" />

      {/* Back Link */}
      <Link
        href="/marketing/drip-campaigns"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-black transition-colors"
      >
        <FiArrowLeft size={14} />
        <span>Back to Drip Campaigns</span>
      </Link>

      {/* Module Header & Subtitle */}
      <div className="flex flex-col gap-3 bg-white border border-slate-300 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <DripStatusBadge status={campaign.status} />
              <TriggerTypeBadge type={campaign.triggerType} />
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{campaign.title}</h1>
            <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">{campaign.description}</p>
            <p className="text-[11px] text-slate-500 font-medium">
              Trigger: {campaign.triggerDetail} · Persona: {campaign.targetPersona} · Owner: {campaign.owner}
            </p>
          </div>
          {(campaign.status === 'Active' || campaign.status === 'Paused') && (
            <button
              type="button"
              onClick={togglePause}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-100 text-slate-900 cursor-pointer transition-all shadow-xs shrink-0 active:scale-95"
            >
              {campaign.status === 'Active' ? <FiPause size={13} /> : <FiPlay size={13} />}
              {campaign.status === 'Active' ? 'Pause sequence' : 'Resume sequence'}
            </button>
          )}
        </div>
      </div>

      {/* KPI Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Stat icon={FiUsers} label="Enrolled" value={(t?.enrolledLeads || 0).toLocaleString()} hint={`${(t?.activeLeads || 0).toLocaleString()} active`} />
        <Stat icon={FiCheckCircle} label="Completed" value={(t?.completedLeads || 0).toLocaleString()} hint={`${t?.completionRate || 0}% of enrolled`} />
        <Stat icon={FiMail} label="Opened" value={(t?.opened || 0).toLocaleString()} hint={`${t?.openRate || 0}% unique`} />
        <Stat icon={FiMousePointer} label="Clicked" value={(t?.clicked || 0).toLocaleString()} hint={`${t?.clickRate || 0}% unique`} />
        <Stat icon={FiTrendingUp} label="Converted" value={(t?.converted || 0).toLocaleString()} hint={`${t?.conversionRate || 0}%`} />
        <Stat icon={FiUsers} label="Unsubscribed" value={(t?.unsubscribedLeads || 0).toLocaleString()} hint={`${t?.bounced || 0} bounced`} />
      </div>

      {/* Sequence Timeline & Sidebar Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-300 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Visual sequence builder</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Step stats are webhook telemetry
            </span>
          </div>
          <div className="overflow-x-auto">
            <DripSequenceTimeline steps={campaign.steps || []} />
          </div>
        </section>

        <aside className="space-y-4">
          <section className="bg-white rounded-xl border border-slate-300 shadow-xs p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 border-b border-slate-200 pb-2">Enrollment rules</h3>
            {campaign.enrollmentRules?.length === 0 ? (
              <p className="text-xs text-slate-500">No rules — manual enrollment only.</p>
            ) : (
              <ul className="space-y-2">
                {campaign.enrollmentRules?.map((rule) => (
                  <li key={rule.id} className="text-xs text-slate-700 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                    <span className="font-bold text-slate-900">{rule.field}</span>{' '}
                    <span className="text-slate-500">{rule.operator.replace('_', ' ')}</span>{' '}
                    <span className="font-semibold text-slate-900">{rule.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-300 shadow-xs p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-200 pb-2">Goal & Context</h3>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">{campaign.goal || '—'}</p>
            {campaign.notes && (
              <>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mt-4 mb-2 border-b border-slate-200 pb-2">Notes</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">{campaign.notes}</p>
              </>
            )}
            {campaign.lastRunAt && (
              <p className="text-[10px] text-slate-500 font-mono mt-4 pt-2 border-t border-slate-200">
                Last run {new Date(campaign.lastRunAt).toLocaleString()}
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};

function Stat({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof FiUsers;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-300 shadow-xs p-3.5">
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">{label}</p>
        <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900">
          <Icon size={13} />
        </div>
      </div>
      <p className="text-lg font-extrabold text-slate-900 font-mono">{value}</p>
      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{hint}</p>
    </div>
  );
}