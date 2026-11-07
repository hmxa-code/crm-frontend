import React from 'react';
import {
  FiX,
  FiEdit2,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
  FiCheckCircle,
  FiClock,
  FiActivity,
  FiLink,
  FiExternalLink,
  FiZap,
  FiShield,
  FiArrowRight
} from 'react-icons/fi';
import Link from 'next/link';
import { Campaign } from '@/src/types/marketing/campaign';
import { CampaignStatusBadge } from '../shared/CampaignStatusBadge';
import { CampaignTypeIcon } from '../shared/CampaignTypeIcon';

interface CampaignOverviewSheetProps {
  campaign: Campaign | null;
  onClose: () => void;
  onEdit: (campaign: Campaign) => void;
}

export const CampaignOverviewSheet: React.FC<CampaignOverviewSheetProps> = ({
  campaign,
  onClose,
  onEdit,
}) => {
  if (!campaign) return null;

  const formatDate = (dateVal: number | string | undefined) => {
    if (!dateVal) return 'Not scheduled';
    const date = typeof dateVal === 'number' ? new Date(dateVal) : new Date(dateVal);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-l border-slate-200/80 flex flex-col justify-between animate-in slide-in-from-right duration-250 font-sans">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CampaignStatusBadge status={campaign.status} size="sm" />
                <span className="text-[10px] font-mono text-slate-400">ID: {campaign._id}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-snug">
                {campaign.campaign_name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Live Metrics Card */}
            <div className="p-4.5 rounded-xl bg-slate-900 text-white shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
                  <FiActivity /> Live Execution Metrics
                </span>
                <span className="text-[10px] font-mono text-slate-400">Telemetry Verified</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center pt-1">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Recipients</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {campaign.recipient_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Open Rate</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">
                    {campaign.open_rate || 0}%
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Conversion</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {campaign.conversion_rate || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Central Automation Notice */}
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <FiZap size={13} className="text-amber-700" />
                <span>Centralized Workflow Decoupling</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                This campaign executes outbound delivery only. Multi-step conditional drip branching, AE reassignment, and webhook notifications are controlled in the central Workflow Engine.
              </p>
              <Link
                href="/workflows"
                className="inline-flex items-center gap-1 font-bold text-amber-900 hover:underline pt-1 text-[11px]"
              >
                <span>Manage in Workflows</span>
                <FiArrowRight size={11} />
              </Link>
            </div>

            {/* Campaign Attributes */}
            <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 space-y-3 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Targeting & Budget Parameters
              </span>

              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Channel Type</span>
                  <span className="font-semibold text-slate-800">{campaign.campaign_type}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Target Audience</span>
                  <span className="font-semibold text-slate-800 text-right max-w-xs">{campaign.target_audience}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Audience Cohort Size</span>
                  <span className="font-semibold text-slate-800 font-mono">{campaign.target_count?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/50">
                  <span className="text-slate-500">Allocated Budget</span>
                  <span className="font-semibold text-slate-800 font-mono">${campaign.budget?.toLocaleString() || 0}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Schedule</span>
                  <span className="font-semibold text-slate-800">
                    {formatDate(campaign.start_date)} &rarr; {formatDate(campaign.end_date)}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {campaign.notes && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Strategic Notes
                </span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/70 leading-relaxed">
                  {campaign.notes}
                </p>
              </div>
            )}

            {/* Tracking Parameters */}
            {(campaign.utm_source || campaign.utm_campaign) && (
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  UTM Taxonomy
                </span>
                <div className="font-mono text-[11px] text-slate-700">
                  source: <span className="font-bold">{campaign.utm_source || 'direct'}</span> | campaign: <span className="font-bold">{campaign.utm_campaign || 'general'}</span>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <span className="text-[11px] text-slate-400 font-mono">
              Created by {campaign.created_by || 'Growth Team'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(campaign)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
              >
                <FiEdit2 size={13} />
                <span>Edit Parameters</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
