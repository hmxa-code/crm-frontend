"use client";

import React from 'react';
import { startOfYear, eachMonthOfInterval, format, startOfMonth, eachDayOfInterval, endOfMonth, endOfWeek, startOfWeek, isSameDay } from 'date-fns';
import { CalendarEvent } from '@/src/types/index';

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthSelect: (date: Date) => void;
}

export function YearView({ currentDate, events, onMonthSelect }: YearViewProps) {
  const yearStart = startOfYear(currentDate);
  const months = eachMonthOfInterval({
    start: yearStart,
    end: new Date(yearStart.getFullYear(), 11, 31)
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
      {months.map((month) => {
        const mStart = startOfMonth(month);
        const mEnd = endOfMonth(mStart);
        const days = eachDayOfInterval({ start: startOfWeek(mStart), end: endOfWeek(mEnd) });

        return (
          <div
            key={month.toString()}
            onClick={() => onMonthSelect(month)}
            className="p-3 sm:p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer hover:shadow-xs transition-all flex flex-col"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 mb-2 sm:mb-3 text-center">{format(month, 'MMMM')}</h3>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-center font-bold text-slate-400 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] text-center">
              {days.map((day, idx) => {
                const hasEvents = events.some(e => isSameDay(e.startDate, day));
                return (
                  <span
                    key={idx}
                    className={`p-1 rounded-sm flex items-center justify-center h-6 sm:h-auto ${
                      day.getMonth() !== month.getMonth() ? 'text-slate-200' : 'text-slate-600 font-medium'
                    } ${hasEvents ? 'bg-slate-900 text-white font-bold' : ''}`}
                  >
                    {day.getDate()}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}