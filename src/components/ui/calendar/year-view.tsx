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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {months.map((month) => {
        const mStart = startOfMonth(month);
        const mEnd = endOfMonth(mStart);
        const days = eachDayOfInterval({ start: startOfWeek(mStart), end: endOfWeek(mEnd) });

        return (
          <div
            key={month.toString()}
            onClick={() => onMonthSelect(month)}
            className="p-4 bg-white border border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer hover:shadow-xs transition-all"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-3 text-center">{format(month, 'MMMM')}</h3>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center font-bold text-slate-400 mb-2">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-[10px] text-center">
              {days.map((day, idx) => {
                const hasEvents = events.some(e => isSameDay(e.startDate, day));
                return (
                  <span
                    key={idx}
                    className={`p-1 rounded-sm ${
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