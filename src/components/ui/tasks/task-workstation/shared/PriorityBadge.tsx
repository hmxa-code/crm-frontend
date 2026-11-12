import React from 'react';
import { getPriorityConfig, TaskPriority } from '../data/taskHelpers';

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const p = getPriorityConfig(priority);
  return (
    <span className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-800">
      {p.label}
    </span>
  );
}