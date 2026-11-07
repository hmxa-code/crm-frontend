"use client";

import React from 'react';
import { CalendarEvent } from '@/src/types/index';
import { badgeColorStyles } from '@/src/types/index';

interface EventBadgeProps {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent, event: CalendarEvent) => void;
}

export function EventBadge({ event, onClick }: EventBadgeProps) {
  const styleClass = badgeColorStyles[event.color] || badgeColorStyles.gray;

  return (
    <div
      onClick={(e) => onClick(e, event)}
      className={`px-2 py-1 text-[11px] font-bold rounded-md shadow-xs border border-slate-200/50 cursor-pointer truncate transition-all ${styleClass}`}
    >
      {event.title}
    </div>
  );
}