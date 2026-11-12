'use client';

import React from 'react';
import { isSameMonth, isToday as fnsIsToday } from 'date-fns';
import { CalendarEvent } from '@/src/types/index';
import { EventBadge } from '@/src/components/ui/calendar/event-badge';
import { FiPlus } from 'react-icons/fi';

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

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return (
      eventDate.getFullYear() === day.getFullYear() &&
      eventDate.getMonth() === day.getMonth() &&
      eventDate.getDate() === day.getDate()
    );
  });

  const handleCellClick = (e: React.MouseEvent) => {
    // If this day already contains scheduled events, clicking anywhere on the day opens event view details
    if (dayEvents.length > 0) {
      onEventClick(dayEvents[0]);
    } else {
      // Empty day cell click opens the schedule modal for this date
      onDateClick(day);
    }
  };

  const handleBadgeClick = (e: React.MouseEvent, event: CalendarEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEventClick(event);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDateClick(day);
  };

  return (
    <div
      onClick={handleCellClick}
      className={`group min-h-[75px] sm:min-h-[100px] md:min-h-[125px] bg-white p-1 sm:p-2 flex flex-col justify-between border-r border-slate-200 last:border-r-0 transition-colors cursor-pointer hover:bg-slate-50/70 select-none relative ${
        !isCurrentMonth ? 'bg-slate-50/60 text-slate-400 opacity-60' : 'text-slate-800'
      }`}
    >
      {/* Day Header Bar */}
      <div className="flex justify-between items-center mb-1">
        <span
          className={`flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs font-bold rounded-full transition-all ${
            isToday
              ? 'bg-slate-900 text-white shadow-xs'
              : isCurrentMonth
              ? 'text-slate-700 hover:bg-slate-200/60'
              : 'text-slate-400'
          }`}
        >
          {day.getDate()}
        </span>

        {/* Dedicated Quick Add Button on Hover / Focus */}
        <button
          type="button"
          onClick={handleQuickAddClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-200/70 rounded-md cursor-pointer"
          title={`Add task schedule on ${day.toLocaleDateString()}`}
        >
          <FiPlus size={12} />
        </button>
      </div>

      {/* Events Container - Strictly stop propagation to prevent accidental Add Modal */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[60px] sm:max-h-[90px] scrollbar-none mt-0.5 cursor-default"
      >
        {dayEvents.map((event, index) => (
          <EventBadge
            key={event.id || `evt-idx-${index}-${Date.now()}`}
            event={event}
            onClick={handleBadgeClick}
          />
        ))}
      </div>
    </div>
  );
}
