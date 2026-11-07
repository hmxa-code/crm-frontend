'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiClock,
  FiZap,
  FiActivity,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiInfo,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import {
  DripCampaignEditablePayload,
  DripEnrollmentOperator,
  DripEnrollmentRule,
  DripTriggerType,
  TARGET_PERSONAS,
} from '@/src/types/marketing/drip-campaign';
import { DripCampaignsService } from '@/src/services/marketing/DripCampaignsService';

const TRIGGERS: { id: DripTriggerType; title: string; desc: string; icon: typeof FiClock }[] = [
  { id: 'Time-Based', title: 'Time-Based', desc: 'Clock starts at enrollment (Day 0, Day 2, Day 7).', icon: FiClock },
  { id: 'Event-Based', title: 'Event-Based', desc: 'Fires on form submit, download, or CRM event.', icon: FiZap },
  { id: 'Behavior-Based', title: 'Behavior-Based', desc: 'Score, page views, or product usage thresholds.', icon: FiActivity },
];

const OPERATORS: { id: DripEnrollmentOperator; label: string }[] = [
  { id: 'equals', label: 'equals' },
  { id: 'contains', label: 'contains' },
  { id: 'greater_than', label: 'greater than' },
  { id: 'less_than', label: 'less than' },
  { id: 'is_true', label: 'is true' },
  { id: 'is_false', label: 'is false' },
];

const inputClass =
  'w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400';

const labelClass =
  'text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5';

export const CreateDripCampaignForm: React.FC = () => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<DripTriggerType>('Event-Based');
  const [triggerDetail, setTriggerDetail] = useState('');
  const [targetPersona, setTargetPersona] = useState<string>(TARGET_PERSONAS[0]);
  const [goal, setGoal] = useState('');
  const [notes, setNotes] = useState('');
  const [rules, setRules] = useState<DripEnrollmentRule[]>([
    { id: 'rule_1', field: 'Lifecycle stage', operator: 'equals', value: 'MQL' },
  ]);

  const canSubmit = useMemo(
    () => title.trim().length > 2 && triggerDetail.trim().length > 2 && targetPersona.trim().length > 0,
    [title, triggerDetail, targetPersona],
  );

  const updateRule = (id: string, patch: Partial<DripEnrollmentRule>) => {
    setRules((prev) => prev.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error('Add a title, trigger detail, and target persona.');
      return;
    }

    const payload: DripCampaignEditablePayload = {
      title: title.trim(),
      description: description.trim(),
      triggerType,
      triggerDetail: triggerDetail.trim(),
      targetPersona,
      enrollmentRules: rules.filter((r) => r.field.trim() && r.value.trim()),
      goal: goal.trim(),
      notes: notes.trim() || undefined,
    };

    setSaving(true);
    try {
      const created = await DripCampaignsService.create(payload);
      toast.success('Pathway saved as Draft. Telemetry will populate after the first send.');
      router.push(`/marketing/drip-campaigns/${created._id}`);
    } catch {
      toast.error('Could not create the pathway.');
    } finally {
      setSaving(false);
    }
  };

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

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-blue-600">New automation pathway</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create drip sequence
        </h1>
        <p className="mt-1 text-sm text-slate-500 max-w-2xl">
          Configure who enrolls and what starts the clock. Engagement stats are calculated by the
          send pipeline after activation — they are not part of this form.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Campaign title</h2>
            <div>
              <label className={labelClass}>Sequence name</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Nutrition Food Sequence"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Internal description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="What this pathway is designed to convert."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Primary goal</label>
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Book a tasting call within 21 days"
                className={inputClass}
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Trigger type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TRIGGERS.map((item) => {
                const selected = triggerType === item.id;
                const Icon = item.icon;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setTriggerType(item.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'border-blue-600 bg-blue-50/30 ring-2 ring-blue-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Icon className="text-blue-600 mb-2" size={16} />
                    <span className="text-xs font-bold text-slate-900 block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{item.desc}</span>
                  </button>
                );
              })}
            </div>
            <div>
              <label className={labelClass}>Trigger detail</label>
              <input
                value={triggerDetail}
                onChange={(e) => setTriggerDetail(e.target.value)}
                placeholder="e.g. Form submitted: Nutrition wholesale inquiry"
                className={inputClass}
              />
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Enrollment rules</h2>
              <button
                type="button"
                onClick={() =>
                  setRules((prev) => [
                    ...prev,
                    {
                      id: `rule_${Date.now()}`,
                      field: '',
                      operator: 'equals',
                      value: '',
                    },
                  ])
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <FiPlus size={12} />
                Add rule
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Contacts matching every rule enroll automatically. Rules do not include engagement
              metrics.
            </p>
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={rule.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-12 sm:col-span-4">
                    {index === 0 && <label className={labelClass}>Field</label>}
                    <input
                      value={rule.field}
                      onChange={(e) => updateRule(rule.id, { field: e.target.value })}
                      placeholder="Lead score"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    {index === 0 && <label className={labelClass}>Operator</label>}
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        updateRule(rule.id, { operator: e.target.value as DripEnrollmentOperator })
                      }
                      className={inputClass}
                    >
                      {OPERATORS.map((op) => (
                        <option key={op.id} value={op.id}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-5 sm:col-span-4">
                    {index === 0 && <label className={labelClass}>Value</label>}
                    <input
                      value={rule.value}
                      onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                      placeholder="55"
                      className={inputClass}
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex justify-end pb-1">
                    <button
                      type="button"
                      onClick={() => setRules((prev) => prev.filter((r) => r.id !== rule.id))}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      aria-label="Remove rule"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Target persona</h2>
            <div>
              <label className={labelClass}>Segment</label>
              <select
                value={targetPersona}
                onChange={(e) => setTargetPersona(e.target.value)}
                className={inputClass}
              >
                {TARGET_PERSONAS.map((persona) => (
                  <option key={persona} value={persona}>
                    {persona}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Operator notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Exclusions, legal holds, or send windows."
                className={`${inputClass} resize-none`}
              />
            </div>
          </section>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 flex gap-3">
            <FiInfo className="text-blue-600 shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Opened, clicked, converted, active, and completed counts appear on the sequence after
              the first enrolled send. They cannot be set here.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={!canSubmit || saving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
            >
              <FiCheck size={14} />
              {saving ? 'Saving…' : 'Create pathway'}
            </button>
            <Link
              href="/marketing/drip-campaigns"
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-200 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
};
