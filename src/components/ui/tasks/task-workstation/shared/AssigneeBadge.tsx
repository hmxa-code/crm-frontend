import React from 'react';
import { getMember } from '../data/taskHelpers';

export default function AssigneeBadge({ assigneeId }: { assigneeId?: string }) {
  const member = getMember(assigneeId);
  if (!member) return <span className="text-xs text-slate-500 font-medium">Unassigned</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
        {member.initials}
      </span>
      <span className="text-xs font-semibold text-slate-800">{member.name}</span>
    </span>
  );
}