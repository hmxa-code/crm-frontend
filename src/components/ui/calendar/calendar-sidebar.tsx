"use client";

import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  startOfWeek, 
  endOfWeek, 
  isSameDay, 
  isSameMonth 
} from 'date-fns';
import { CalendarEvent } from '@/src/types/index';

interface CalendarSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEventClick: () => void;
}

// Category dot badges matching CRM styles
const badgeDotStyles: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-400',
};

export function CalendarSidebar({ 
  currentDate, 
  setCurrentDate, 
  events, 
  onEventClick,
  onAddEventClick 
}: CalendarSidebarProps) {
  
  // Mini Calendar Calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Upcoming Events Filter (Future or current day events)
  const upcomingEvents = events
    .filter(event => new Date(event.startDate).getTime() >= startOfMonth(new Date()).getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4); // Show top 4 dynamic upcoming items

  return (
    <div className="w-72 border-r border-slate-100 p-5 flex flex-col gap-6 bg-white flex-none">
      
      {/* 1. Quick Add Action Button */}
      <button
        onClick={onAddEventClick}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
        Create Schedule
      </button>

      <hr className="border-slate-100" />

      {/* 2. Mini-Calendar UI Panel */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>

        {/* Week Days Label */}
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-slate-400 mb-2">
          {weekDays.map((wd, i) => (
            <span key={i} className="w-7 h-7 flex items-center justify-center">{wd}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-[11px]">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, currentDate);
            const hasEvents = events.some(e => isSameDay(new Date(e.startDate), day));

            return (
              <button
                key={idx}
                onClick={() => setCurrentDate(day)}
                className={`w-7 h-7 rounded-full flex flex-col items-center justify-center relative font-semibold transition-all ${
                  !isCurrentMonth ? 'text-slate-300 opacity-40' : 'text-slate-700'
                } ${
                  isSelected ? 'bg-slate-900 text-white font-extrabold' : 'hover:bg-slate-50'
                } ${isToday && !isSelected ? 'border border-slate-900' : ''}`}
              >
                <span>{day.getDate()}</span>
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 bg-slate-400 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 3. Upcoming Schedule Checklist */}
      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-4">
          Upcoming Checklist
        </h3>

        <div className="flex flex-col gap-3.5 overflow-y-auto pr-1 flex-1 scrollbar-none">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="group p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 hover:bg-white cursor-pointer transition-all flex items-start gap-3 shadow-3xs"
              >
                {/* Dynamic Category Color indicator */}
                <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-none ${badgeDotStyles[event.color] || 'bg-slate-400'}`} />
                
                <div className="flex flex-col min-w-0">
                  <h4 className="text-xs font-bold text-slate-700 group-hover:text-slate-900 truncate leading-tight transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">
                    {format(new Date(event.startDate), 'MMM dd, hh:mm a')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic font-medium py-4">No events registered.</p>
          )}
        </div>
      </div>

    </div>
  );
}