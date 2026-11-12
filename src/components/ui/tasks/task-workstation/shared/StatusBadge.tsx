import React from 'react';
import { getStatusConfig, TaskStatus } from '../data/taskHelpers';

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const s = getStatusConfig(status);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-2xs">
      <span className="h-1.5 w-1.5 rounded-full bg-black" />
      {s.label}
    </span>
  );
}