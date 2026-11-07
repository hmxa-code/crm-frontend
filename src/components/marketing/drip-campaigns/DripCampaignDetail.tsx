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
      <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center">
        <FiLoader className="text-3xl text-blue-600 animate-spin mb-3" />
        <p className="text-xs font-bold text-slate-700">Loading visual builder…</p>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-4">
        <Link href="/marketing/drip-campaigns" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
          <FiArrowLeft size={16} />
          Back to Drip Campaigns
        </Link>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700 text-sm font-medium">
          {error || 'Sequence not found.'}
        </div>
      </div>
    );
  }

  const t = campaign.telemetry;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <Link
        href="/marketing/drip-campaigns"
        className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        <FiArrowLeft size={16} />
        Back to Drip Campaigns
      </Link>

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <DripStatusBadge status={campaign.status} />
            <TriggerTypeBadge type={campaign.triggerType} />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{campaign.title}</h1>
          <p className="mt-1 text-sm text-slate-500 max-w-2xl">{campaign.description}</p>
          <p className="mt-2 text-xs text-slate-400">
            Trigger: {campaign.triggerDetail} · Persona: {campaign.targetPersona} · Owner: {campaign.owner}
          </p>
        </div>
        {(campaign.status === 'Active' || campaign.status === 'Paused') && (
          <button
            type="button"
            onClick={togglePause}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
          >
            {campaign.status === 'Active' ? <FiPause size={14} /> : <FiPlay size={14} />}
            {campaign.status === 'Active' ? 'Pause sequence' : 'Resume sequence'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <Stat icon={FiUsers} label="Enrolled" value={(t?.enrolledLeads || 0).toLocaleString()} hint={`${(t?.activeLeads || 0).toLocaleString()} active`} />
        <Stat icon={FiCheckCircle} label="Completed" value={(t?.completedLeads || 0).toLocaleString()} hint={`${t?.completionRate || 0}% of enrolled`} />
        <Stat icon={FiMail} label="Opened" value={(t?.opened || 0).toLocaleString()} hint={`${t?.openRate || 0}% unique`} />
        <Stat icon={FiMousePointer} label="Clicked" value={(t?.clicked || 0).toLocaleString()} hint={`${t?.clickRate || 0}% unique`} />
        <Stat icon={FiTrendingUp} label="Converted" value={(t?.converted || 0).toLocaleString()} hint={`${t?.conversionRate || 0}%`} />
        <Stat icon={FiUsers} label="Unsubscribed" value={(t?.unsubscribedLeads || 0).toLocaleString()} hint={`${t?.bounced || 0} bounced`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900">Visual sequence builder</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Step stats are webhook telemetry
            </span>
          </div>
          <DripSequenceTimeline steps={campaign.steps || []} />
        </section>

        <aside className="space-y-4">
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Enrollment rules</h3>
            {campaign.enrollmentRules?.length === 0 ? (
              <p className="text-xs text-slate-400">No rules — manual enrollment only.</p>
            ) : (
              <ul className="space-y-2">
                {campaign.enrollmentRules?.map((rule) => (
                  <li key={rule.id} className="text-xs text-slate-600 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
                    <span className="font-bold text-slate-800">{rule.field}</span>{' '}
                    <span className="text-slate-400">{rule.operator.replace('_', ' ')}</span>{' '}
                    <span className="font-semibold">{rule.value}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Goal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{campaign.goal || '—'}</p>
            {campaign.notes && (
              <>
                <h3 className="text-sm font-bold text-slate-900 mt-4 mb-2">Notes</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{campaign.notes}</p>
              </>
            )}
            {campaign.lastRunAt && (
              <p className="text-[10px] text-slate-400 mt-4">
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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        <Icon className="text-blue-600" size={15} />
      </div>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-400 mt-1">{hint}</p>
    </div>
  );
}
