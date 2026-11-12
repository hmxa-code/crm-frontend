import React from 'react';
import { FiClock, FiZap, FiActivity } from 'react-icons/fi';
import { DripTriggerType } from '@/src/types/marketing/drip-campaign';

interface TriggerTypeBadgeProps {
  type: DripTriggerType;
  compact?: boolean;
}

export const TriggerTypeBadge: React.FC<TriggerTypeBadgeProps> = ({ type, compact = false }) => {
  const meta = {
    'Time-Based': {
      icon: FiClock,
      className: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    'Event-Based': {
      icon: FiZap,
      className: 'bg-violet-50 text-violet-700 border-violet-200',
    },
    'Behavior-Based': {
      icon: FiActivity,
      className: 'bg-teal-50 text-teal-700 border-teal-200',
    },
  }[type || 'Time-Based'];

  const Icon = meta?.icon || FiClock;

  if (!type) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border font-semibold px-2 py-1 text-[11px] bg-slate-50 text-slate-700 border-slate-200">
        <FiClock size={12} />
        Unknown
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${
        compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]'
      } ${meta.className}`}
    >
      <Icon size={compact ? 10 : 12} />
      {type}
    </span>
  );
};
