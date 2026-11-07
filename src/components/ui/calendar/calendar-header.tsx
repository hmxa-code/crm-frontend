"use client";

import React from 'react';
import { format } from 'date-fns';
import { CalendarView } from '@/src/types/index';

interface CalendarHeaderProps {
  currentDate: Date;
  activeView: CalendarView;
  setActiveView: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export const colorStyles: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100/50',
  purple: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100/50',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50',
  orange: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100/50',
  red: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100/50',
  gray: 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100/50',
};

export function CalendarHeader({
  currentDate,
  activeView,
  setActiveView,
  onPrev,
  onNext,
  onToday,
}: CalendarHeaderProps) {
  const views: { id: CalendarView; label: string }[] = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'year', label: 'Year' },
    { id: 'agenda', label: 'Agenda' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Navigation Controls */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-slate-800 min-w-[140px] tracking-tight">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/40">
          <button
            onClick={onPrev}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-all"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/40 self-start sm:self-auto">
        {views.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeView === v.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}