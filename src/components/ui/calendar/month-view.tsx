"use client";

import React from 'react';
import { CalendarEvent } from '@/src/types/index';
import { DayCell } from '@/src/components/ui/calendar/day-cell';

interface MonthViewProps {
  gridDays: Date[];
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function MonthView({ gridDays, currentDate, events, onEventClick, onDateClick }: MonthViewProps) {
  return (
    <div className="flex flex-col flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mt-3 sm:mt-6">
      
      {/* Weekdays Header */}
      <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 flex-none">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
          <div
            key={day}
            className={`py-2 sm:py-3 text-center text-[10px] sm:text-xs font-bold text-slate-500 tracking-wider uppercase truncate px-1 ${
              idx !== 6 ? 'border-r border-slate-200' : ''
            }`}
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>

      {/* Grid cells containing modular day-cells */}
      <div className="grid grid-cols-7 grid-rows-6 flex-1 divide-y divide-x sm:divide-x-0 divide-slate-200 bg-slate-100/30">
        {gridDays.map((day, index) => (
          <DayCell
            key={day.toISOString() + index}
            day={day}
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onDateClick={onDateClick}
          />
        ))}
      </div>
    </div>
  );
}