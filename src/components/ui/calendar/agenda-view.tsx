"use client";

import React from 'react';
import { CalendarEvent } from '@/src/types/index';
import { format } from 'date-fns';
import { colorStyles } from '@/src/types/index';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({ events, onEventClick }: AgendaViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50/40">
        <p className="text-sm text-slate-500">No scheduled activities registered.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedEvents.map((event) => {
        const styleClass = colorStyles[event.color] || colorStyles.gray;
        return (
          <div
            key={event.id}
            onClick={() => onEventClick(event)}
            className={`p-5 rounded-2xl border border-slate-200/60 cursor-pointer shadow-xs hover:scale-[1.005] active:scale-[0.995] transition-all flex justify-between items-center ${styleClass}`}
          >
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-sm tracking-tight">{event.title}</h3>
              {event.description && <p className="text-xs opacity-80 line-clamp-1">{event.description}</p>}
            </div>
            <span className="text-xs font-bold">
              {format(event.startDate, 'hh:mm a')} - {format(event.endDate, 'hh:mm a')}
            </span>
          </div>
        );
      })}
    </div>
  );
}