"use client";

import React from 'react';
import { 
  format, 
  isSameDay, 
  startOfDay,
  eachHourOfInterval,
  addHours
} from 'date-fns';
import { CalendarEvent } from '@/src/types/index';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const badgeColorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60 hover:bg-blue-100/70',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60 hover:bg-purple-100/70',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/70',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/60 hover:bg-orange-100/70',
  red: 'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/70',
  gray: 'bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100/70',
};

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const todayStart = startOfDay(currentDate);
  const hours = eachHourOfInterval({
    start: addHours(todayStart, 8),
    end: addHours(todayStart, 20),
  });

  const dailyEvents = events.filter((event) => isSameDay(event.startDate, currentDate));

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
      {/* 1. Day Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-800">
            {format(currentDate, 'dd')}
          </span>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {format(currentDate, 'EEEE')}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
              {format(currentDate, 'MMMM yyyy')}
            </span>
          </div>
        </div>
        <span className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] sm:text-[11px] font-bold tracking-wider self-end sm:self-auto">
          {dailyEvents.length} {dailyEvents.length === 1 ? 'EVENT' : 'EVENTS'} TODAY
        </span>
      </div>

      {/* 2. Scrollable Hour Timeline */}
      <div className="flex-1 overflow-y-auto max-h-[500px] sm:max-h-[550px]">
        {hours.map((hour) => {
          const hourString = format(hour, 'hh:00 a');
          const hourlyEvents = dailyEvents.filter(
            (event) => event.startDate.getHours() === hour.getHours()
          );

          return (
            <div key={hour.toString()} className="grid grid-cols-12 border-b border-slate-100/70 last:border-0 min-h-[70px] sm:min-h-[80px]">
              {/* Hour Column */}
              <div className="col-span-3 sm:col-span-2 border-r border-slate-100 pr-2 sm:pr-4 flex items-center justify-end text-[10px] sm:text-xs font-bold text-slate-400 truncate">
                {hourString}
              </div>

              {/* Event Cards Column */}
              <div className="col-span-9 sm:col-span-10 p-2 flex flex-col gap-2 bg-white hover:bg-slate-50/10 transition-all justify-center">
                {hourlyEvents.length > 0 ? (
                  hourlyEvents.map((event) => {
                    const colorClass = badgeColorStyles[event.color] || badgeColorStyles.gray;
                    return (
                      <div
                        key={event.id}
                        onClick={() => onEventClick(event)}
                        className={`p-3 sm:p-3.5 rounded-xl border cursor-pointer transition-all duration-200 shadow-3xs flex flex-col gap-1 ${colorClass}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <span className="text-xs font-extrabold tracking-tight">
                            {event.title}
                          </span>
                          <span className="text-[10px] font-bold opacity-80 shrink-0">
                            {format(event.startDate, 'hh:mm a')} - {format(event.endDate, 'hh:mm a')}
                          </span>
                        </div>
                        {event.description && (
                          <p className="text-[11px] opacity-75 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <span className="text-[10px] sm:text-[11px] text-slate-300 font-semibold italic pl-2 select-none">
                    No tasks scheduled
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}