import React from 'react';
import { getMember } from '../data/taskHelpers';

export default function AssigneeBadge({ assigneeId }: { assigneeId?: string }) {
  const member = getMember(assigneeId);
  if (!member) return <span className="text-xs text-slate-400">Unassigned</span>;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${member.color}`}>
        {member.initials}
      </span>
      <span className="text-xs font-medium text-slate-600">{member.name}</span>
    </span>
  );
}
