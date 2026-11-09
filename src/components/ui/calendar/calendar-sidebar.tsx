'use client';

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
import { FiPlus, FiFilter } from 'react-icons/fi';

interface CalendarSidebarProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onAddEventClick: () => void;
  filterCategory?: string;
  onFilterCategoryChange?: (category: string) => void;
}

const badgeDotStyles: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  red: 'bg-rose-500',
  gray: 'bg-slate-400',
};

const CATEGORIES = [
  { id: 'ALL', label: 'All Modules' },
  { id: 'SALES', label: 'Sales' },
  { id: 'MARKETING', label: 'Marketing' },
  { id: 'GENERAL', label: 'General' },
];

export function CalendarSidebar({ 
  currentDate, 
  setCurrentDate, 
  events, 
  onEventClick,
  onAddEventClick,
  filterCategory = 'ALL',
  onFilterCategoryChange,
}: CalendarSidebarProps) {
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const upcomingEvents = events
    .filter(event => new Date(event.startDate).getTime() >= startOfMonth(new Date()).getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 5);

  return (
    <div className="w-full lg:w-72 border-r border-slate-100 p-4 sm:p-5 flex flex-col gap-4 sm:gap-5 bg-white flex-none">
      
      {/* 1. Quick Add Action Button */}
      <button
        type="button"
        onClick={onAddEventClick}
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-98"
      >
        <FiPlus size={15} />
        Create Schedule
      </button>

      {/* 2. Module / Category Filter */}
      {onFilterCategoryChange && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
            <span className="flex items-center gap-1">
              <FiFilter size={11} /> Filter Module
            </span>
            <span className="text-slate-500">{filterCategory}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-slate-100/70 p-1 rounded-xl">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterCategoryChange(cat.id)}
                className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all truncate cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <hr className="border-slate-100" />

      {/* 3. Mini-Calendar UI Panel */}
      <div>
        <div className="flex justify-between items-center mb-3 px-1">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>

        {/* Week Days Label */}
        <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-slate-400 mb-2">
          {weekDays.map((wd, i) => (
            <span key={i} className="flex items-center justify-center h-6">{wd}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-[11px] justify-items-center">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, currentDate);
            const hasEvents = events.some(e => isSameDay(new Date(e.startDate), day));

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentDate(day)}
                className={`w-7 h-7 rounded-full flex flex-col items-center justify-center relative font-semibold transition-all cursor-pointer ${
                  !isCurrentMonth ? 'text-slate-300 opacity-40' : 'text-slate-700'
                } ${
                  isSelected ? 'bg-slate-900 text-white font-extrabold' : 'hover:bg-slate-100'
                } ${isToday && !isSelected ? 'border border-slate-900' : ''}`}
              >
                <span>{day.getDate()}</span>
                {hasEvents && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 bg-sky-500 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* 4. Upcoming Schedule Checklist */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Upcoming Tasks
          </h3>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {upcomingEvents.length}
          </span>
        </div>

        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 scrollbar-none max-h-[220px] lg:max-h-none">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => onEventClick(event)}
                className="group p-2.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-white cursor-pointer transition-all flex items-start gap-2.5 shadow-3xs text-left w-full active:scale-[0.99]"
              >
                <span className={`w-2 h-2 rounded-full mt-1.5 flex-none ${badgeDotStyles[event.color] || 'bg-slate-400'}`} />
                
                <div className="flex flex-col min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-700 group-hover:text-slate-900 truncate leading-tight transition-colors">
                    {event.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {format(new Date(event.startDate), 'MMM dd, hh:mm a')}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic font-medium py-2">No upcoming events found.</p>
          )}
        </div>
      </div>

    </div>
  );
}
