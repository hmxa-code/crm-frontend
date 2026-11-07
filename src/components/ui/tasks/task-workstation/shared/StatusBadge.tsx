import React from 'react';
import { getStatusConfig, TaskStatus } from '../data/taskHelpers';

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const s = getStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${s.badgeBg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
