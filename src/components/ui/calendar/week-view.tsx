"use client";

import React from 'react';
import { 
  startOfWeek, 
  addDays, 
  format, 
  isSameDay, 
  startOfDay,
  eachHourOfInterval,
  addHours
} from 'date-fns';
import { CalendarEvent } from '@/src/types/index';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

// Custom theme mapping for sleek events
const badgeColorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200/60 hover:bg-blue-100/70',
  purple: 'bg-purple-50 text-purple-700 border-purple-200/60 hover:bg-purple-100/70',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100/70',
  orange: 'bg-orange-50 text-orange-700 border-orange-200/60 hover:bg-orange-100/70',
  red: 'bg-rose-50 text-rose-700 border-rose-200/60 hover:bg-rose-100/70',
  gray: 'bg-slate-50 text-slate-700 border-slate-200/60 hover:bg-slate-100/70',
};

export function WeekView({ currentDate, events, onEventClick }: WeekViewProps) {
  // Get start of the week (Sunday)
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  
  // Generate the 7 days of the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generate 24 hours timeline (8:00 AM to 8:00 PM)
  const todayStart = startOfDay(currentDate);
  const hours = eachHourOfInterval({
    start: addHours(todayStart, 8),
    end: addHours(todayStart, 20),
  });

  return (
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
      
      {/* Scrollable container for Mobile/Tablet responsiveness */}
      <div className="flex-1 overflow-x-auto overflow-y-auto max-h-[600px] scrollbar-thin">
        <div className="min-w-[700px] md:min-w-full flex flex-col h-full">
          
          {/* 1. Week Columns Header */}
          <div className="grid grid-cols-8 border-b border-slate-100 bg-slate-50/50 text-center sticky top-0 z-10">
            {/* Empty corner cell for timezone/hour offset */}
            <div className="py-3 sm:py-4 border-r border-slate-100 flex items-center justify-center text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
              Time
            </div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              return (
                <div 
                  key={day.toString()} 
                  className={`py-2.5 sm:py-3 border-r border-slate-100 last:border-r-0 flex flex-col items-center justify-center ${
                    isToday ? 'bg-slate-900/5' : ''
                  }`}
                >
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-tight">
                    {format(day, 'E')}
                  </span>
                  <span className={`mt-0.5 sm:mt-1 text-xs sm:text-sm font-extrabold flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full ${
                    isToday ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-800'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 2. Scrollable Hours and Events Grid */}
          <div className="flex-1">
            {hours.map((hour) => {
              const hourString = format(hour, 'hh:00 a');

              return (
                <div key={hour.toString()} className="grid grid-cols-8 border-b border-slate-100/70 last:border-0 min-h-[65px] sm:min-h-[70px]">
                  {/* Hour Indicator */}
                  <div className="border-r border-slate-100 pr-2 sm:pr-3 flex items-center justify-end text-[10px] sm:text-[11px] font-bold text-slate-400">
                    {hourString}
                  </div>

                  {/* Day slots for the current hour block */}
                  {weekDays.map((day) => {
                    const dayHourEvents = events.filter((event) => {
                      return (
                        isSameDay(event.startDate, day) &&
                        event.startDate.getHours() === hour.getHours()
                      );
                    });

                    return (
                      <div 
                        key={day.toString()} 
                        className="p-1 border-r border-slate-100/70 last:border-r-0 relative group hover:bg-slate-50/30 transition-all flex flex-col gap-1 min-h-[65px] sm:min-h-[70px]"
                      >
                        {dayHourEvents.map((event) => {
                          const colorClass = badgeColorStyles[event.color] || badgeColorStyles.gray;
                          return (
                            <div
                              key={event.id}
                              onClick={() => onEventClick(event)}
                              className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer transition-all duration-200 shadow-3xs flex flex-col justify-between h-full ${colorClass}`}
                            >
                              <div className="flex flex-col">
                                <span className="text-[10px] sm:text-[11px] font-extrabold leading-tight tracking-tight line-clamp-1">
                                  {event.title}
                                </span>
                                {event.description && (
                                  <span className="text-[8px] sm:text-[9px] opacity-75 line-clamp-1 mt-0.5 leading-none">
                                    {event.description}
                                  </span>
                                )}
                              </div>
                              <span className="text-[8px] sm:text-[9px] font-bold mt-1 opacity-90 block">
                                {format(event.startDate, 'h:mm a')}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}