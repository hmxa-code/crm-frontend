import React from 'react';
import {
  FiMail,
  FiMessageSquare,
  FiTag,
  FiClock,
  FiBell,
  FiTrendingUp,
  FiCheckCircle,
  FiAlertTriangle,
} from 'react-icons/fi';
import { DripSequenceStep, DripStepAction, deriveStepRates } from '@/src/types/marketing/drip-campaign';

interface DripSequenceTimelineProps {
  steps: DripSequenceStep[];
}

const ACTION_META: Record<
  DripStepAction,
  { icon: typeof FiMail; tone: string; iconWrap: string }
> = {
  'Send Email': {
    icon: FiMail,
    tone: 'border-blue-200 bg-blue-50 text-blue-700',
    iconWrap: 'bg-blue-600 text-white',
  },
  'Send SMS': {
    icon: FiMessageSquare,
    tone: 'border-teal-200 bg-teal-50 text-teal-700',
    iconWrap: 'bg-teal-600 text-white',
  },
  'Add Tag': {
    icon: FiTag,
    tone: 'border-violet-200 bg-violet-50 text-violet-700',
    iconWrap: 'bg-violet-600 text-white',
  },
  Wait: {
    icon: FiClock,
    tone: 'border-slate-200 bg-slate-50 text-slate-700',
    iconWrap: 'bg-slate-600 text-white',
  },
  'Notify Owner': {
    icon: FiBell,
    tone: 'border-amber-200 bg-amber-50 text-amber-700',
    iconWrap: 'bg-amber-600 text-white',
  },
  'Update Score': {
    icon: FiTrendingUp,
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    iconWrap: 'bg-emerald-600 text-white',
  },
};

export const DripSequenceTimeline: React.FC<DripSequenceTimelineProps> = ({ steps }) => {
  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
        <p className="text-sm font-bold text-slate-700">No steps yet</p>
        <p className="text-xs text-slate-400 mt-1">
          This draft has no send actions. Activate after the pathway is published.
        </p>
      </div>
    );
  }

  const ordered = [...steps].sort((a, b) => a.order - b.order);

  return (
    <div className="relative space-y-0">
      {ordered.map((step, index) => {
        const meta = ACTION_META[step.actionType];
        const Icon = meta.icon;
        const rates = deriveStepRates(step);
        const isLast = index === ordered.length - 1;

        return (
          <div key={step.id} className="relative pl-12 pb-6">
            {!isLast && (
              <span className="absolute left-[18px] top-10 bottom-0 w-px bg-slate-200" aria-hidden />
            )}
            <div
              className={`absolute left-0 top-1 w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${meta.iconWrap}`}
            >
              <Icon size={15} />
            </div>

            <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Step {step.order}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${meta.tone}`}>
                      {step.actionType}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      <FiClock size={10} />
                      {step.delayLabel}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                  {step.subject && (
                    <p className="text-[11px] text-slate-400 mt-1">Subject: {step.subject}</p>
                  )}
                  {step.tagName && (
                    <p className="text-[11px] text-violet-600 mt-1 font-semibold">Tag: {step.tagName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-3 border-t border-slate-100">
                <Metric label="Delivered" value={step.telemetry.delivered.toLocaleString()} />
                <Metric label="Opened" value={step.telemetry.opened.toLocaleString()} hint={`${rates.openRate}%`} />
                <Metric label="Clicked" value={step.telemetry.clicked.toLocaleString()} hint={`${rates.clickRate}%`} />
                <Metric label="Converted" value={step.telemetry.converted.toLocaleString()} hint={`${rates.conversionRate}%`} />
                <Metric
                  label="Skipped"
                  value={step.telemetry.skipped.toLocaleString()}
                  icon={<FiCheckCircle className="text-slate-400" size={11} />}
                />
                <Metric
                  label="Failed"
                  value={step.telemetry.failed.toLocaleString()}
                  icon={<FiAlertTriangle className="text-amber-500" size={11} />}
                />
              </div>
            </article>
          </div>
        );
      })}
    </div>
  );
};

function Metric({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-100 px-2.5 py-2">
      <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
        {icon}
        {label}
      </p>
      <p className="text-sm font-extrabold text-slate-900 mt-0.5">{value}</p>
      {hint && <p className="text-[10px] font-semibold text-blue-600">{hint}</p>}
    </div>
  );
}
