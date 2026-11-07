import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiCheck, 
  FiLoader, 
  FiCalendar, 
  FiDollarSign, 
  FiFileText,
  FiZap,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';
import Link from 'next/link';
import { Campaign, CampaignEditablePayload } from '@/src/types/marketing/campaign';
import toast from 'react-hot-toast';

interface CreateCampaignDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CampaignEditablePayload) => Promise<void>;
  campaignToEdit?: Campaign | null;
}

const DEFAULT_PAYLOAD: CampaignEditablePayload = {
  campaign_name: '',
  campaign_type: 'Email',
  status: 'Draft',
  start_date: new Date().toISOString().split('T')[0],
  end_date: '',
  target_audience: '',
  target_count: 5000,
  budget: 1500,
  notes: '',
  utm_source: 'crm_outreach',
  utm_medium: 'cpc_email',
  utm_campaign: '',
};

export const CreateCampaignDrawer: React.FC<CreateCampaignDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
  campaignToEdit,
}) => {
  const [formData, setFormData] = useState<CampaignEditablePayload>(DEFAULT_PAYLOAD);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (campaignToEdit) {
      const formatDate = (val: number | string | undefined) => {
        if (!val) return '';
        if (typeof val === 'number') {
          return new Date(val).toISOString().split('T')[0];
        }
        return val.includes('T') ? val.split('T')[0] : String(val);
      };

      setFormData({
        campaign_name: campaignToEdit.campaign_name || '',
        campaign_type: campaignToEdit.campaign_type || 'Email',
        status: campaignToEdit.status || 'Draft',
        start_date: formatDate(campaignToEdit.start_date),
        end_date: formatDate(campaignToEdit.end_date),
        target_audience: campaignToEdit.target_audience || '',
        target_count: campaignToEdit.target_count || 0,
        budget: campaignToEdit.budget || 0,
        notes: campaignToEdit.notes || '',
        utm_source: campaignToEdit.utm_source || 'crm_outreach',
        utm_medium: campaignToEdit.utm_medium || 'cpc_email',
        utm_campaign: campaignToEdit.utm_campaign || '',
      });
    } else {
      setFormData(DEFAULT_PAYLOAD);
    }
  }, [campaignToEdit, isOpen]);

  if (!isOpen) return null;

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.campaign_name.trim()) {
      toast.error('Please enter a campaign name.');
      return;
    }
    if (!formData.target_audience.trim()) {
      toast.error('Please specify a target audience.');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch {
      toast.error('Failed to save campaign');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] overflow-hidden bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200/80 flex flex-col justify-between animate-in slide-in-from-right duration-250 font-sans">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                {campaignToEdit ? 'Edit Campaign Configuration' : 'Deploy Outbound Program'}
              </span>
              <h2 className="text-base font-bold text-slate-900">
                {campaignToEdit ? campaignToEdit.campaign_name : 'Create Enterprise Campaign'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Form Content */}
          <form id="campaign-drawer-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* Decoupling Banner */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <FiZap size={14} className="text-amber-600 shrink-0" />
                <span>Automated branching & drip actions are managed via <strong>Workflows</strong>.</span>
              </div>
              <Link href="/workflows" target="_blank" className="font-bold text-cyan-800 hover:underline shrink-0 flex items-center gap-1 text-[11px]">
                Workflows <FiArrowRight size={10} />
              </Link>
            </div>

            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campaign Name / Identifier
              </label>
              <input
                type="text"
                placeholder="e.g. Q4 Enterprise Health Systems Adoption"
                value={formData.campaign_name}
                onChange={(e) => handleFieldChange('campaign_name', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
                required
              />
            </div>

            {/* Channel Type & Initial Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Delivery Channel</label>
                <select
                  value={formData.campaign_type}
                  onChange={(e) => handleFieldChange('campaign_type', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white outline-none cursor-pointer text-slate-900"
                >
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Social">Social</option>
                  <option value="Push">Push</option>
                  <option value="Multi-Channel">Multi-Channel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Initial State</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFieldChange('status', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white outline-none cursor-pointer text-slate-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Audience Cohort
              </label>
              <input
                type="text"
                placeholder="e.g. Clinical Research Directors & Hospital CMOs"
                value={formData.target_audience}
                onChange={(e) => handleFieldChange('target_audience', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
                required
              />
            </div>

            {/* Target Size & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Cohort Volume</label>
                <input
                  type="number"
                  min="0"
                  value={formData.target_count}
                  onChange={(e) => handleFieldChange('target_count', Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Allocated Budget ($)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => handleFieldChange('budget', Number(e.target.value))}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 font-mono text-slate-900"
                />
              </div>
            </div>

            {/* Schedule Window */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  value={String(formData.start_date || '')}
                  onChange={(e) => handleFieldChange('start_date', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">End Date (Optional)</label>
                <input
                  type="date"
                  value={String(formData.end_date || '')}
                  onChange={(e) => handleFieldChange('end_date', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 text-slate-900"
                />
              </div>
            </div>

            {/* Strategic Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Strategic Notes & Collateral Links
              </label>
              <textarea
                rows={3}
                placeholder="Key value propositions, partner exclusions, or creative assets..."
                value={formData.notes || ''}
                onChange={(e) => handleFieldChange('notes', e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
              />
            </div>

            {/* UTM Parameters */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                UTM Attribution Parameters
              </span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Source"
                  value={formData.utm_source || ''}
                  onChange={(e) => handleFieldChange('utm_source', e.target.value)}
                  className="text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Medium"
                  value={formData.utm_medium || ''}
                  onChange={(e) => handleFieldChange('utm_medium', e.target.value)}
                  className="text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800"
                />
                <input
                  type="text"
                  placeholder="Campaign"
                  value={formData.utm_campaign || ''}
                  onChange={(e) => handleFieldChange('utm_campaign', e.target.value)}
                  className="text-[11px] font-mono px-2.5 py-1.5 bg-white border border-slate-200 rounded text-slate-800"
                />
              </div>
            </div>

          </form>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="campaign-drawer-form"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {submitting ? <FiLoader className="animate-spin" size={13} /> : <FiCheck size={13} />}
              <span>{campaignToEdit ? 'Update Campaign' : 'Deploy Program'}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
