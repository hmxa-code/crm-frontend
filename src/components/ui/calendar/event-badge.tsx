'use client';

import React from 'react';
import { CalendarEvent } from '@/src/types/index';
import { badgeColorStyles } from '@/src/types/index';

interface EventBadgeProps {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent, event: CalendarEvent) => void;
}

export function EventBadge({ event, onClick }: EventBadgeProps) {
  const styleClass = badgeColorStyles[event.color] || badgeColorStyles.gray;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(e, event);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full text-left px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-md shadow-2xs border border-slate-200/60 cursor-pointer truncate transition-all hover:scale-[1.01] active:scale-[0.98] select-none min-h-[22px] sm:min-h-[24px] flex items-center gap-1 ${styleClass}`}
      title={`${event.title} (${event.priority || 'Normal'} • Click to view details)`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      <span className="truncate flex-1">{event.title}</span>
    </button>
  );
}
