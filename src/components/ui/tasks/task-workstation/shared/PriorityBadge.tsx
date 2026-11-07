import React from 'react';
import { getPriorityConfig, TaskPriority } from '../data/taskHelpers';

export default function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const p = getPriorityConfig(priority);
  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${p.className}`}>
      {p.label}
    </span>
  );
}
