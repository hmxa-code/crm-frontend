"use client";

import React from 'react';
import { isSameMonth, isToday as fnsIsToday } from 'date-fns';
import { CalendarEvent } from '@/src/types/index';
import { EventBadge } from '@/src/components/ui/calendar/event-badge';

interface DayCellProps {
  day: Date;
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function DayCell({ day, currentDate, events, onEventClick, onDateClick }: DayCellProps) {
  const isCurrentMonth = isSameMonth(day, currentDate);
  const isToday = fnsIsToday(day);

  // Is specific day ke events filter karein
  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getFullYear() === day.getFullYear() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getDate() === day.getDate()
    );
  });

  const handleCellClick = () => {
    onDateClick(day);
  };

  const handleBadgeClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation(); // Parent cell trigger ko stop karta hai
    onEventClick(event);
  };

  return (
    <div
      onClick={handleCellClick}
      className={`min-h-[120px] bg-white p-2 flex flex-col justify-between border-r border-slate-200 last:border-r-0 transition-all cursor-pointer hover:bg-slate-50/40 select-none ${
        !isCurrentMonth ? 'bg-slate-50/50 text-slate-400 opacity-55' : 'text-slate-800'
      }`}
    >
      {/* Day Number Badge */}
      <div className="flex justify-between items-start mb-1">
        <span
          className={`flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full transition-all ${
            isToday
              ? 'bg-slate-900 text-white shadow-xs'
              : isCurrentMonth
              ? 'text-slate-700 hover:bg-slate-100'
              : 'text-slate-400'
          }`}
        >
          {day.getDate()}
        </span>
      </div>

      {/* Events Container */}
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[80px] scrollbar-none mt-1">
        {dayEvents.map((event) => (
          <EventBadge
            key={event.id}
            event={event}
            onClick={handleBadgeClick}
          />
        ))}
      </div>
    </div>
  );
}