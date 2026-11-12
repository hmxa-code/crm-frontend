'use client';

import React, { useState, useMemo } from 'react';
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiCalendar, 
  FiClock, 
  FiCheckCircle, 
  FiEye,
  FiPlus
} from 'react-icons/fi';
import { ContentItem } from '@/src/types/marketing/content-engine';
import { ChannelPlatformBadge } from '../shared/ChannelPlatformBadge';
import { ContentStatusBadge } from '../shared/ContentStatusBadge';

interface ContentCalendarViewProps {
  items: ContentItem[];
  onView: (item: ContentItem) => void;
  onNewPostClick?: () => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({ 
  items, 
  onView,
  onNewPostClick 
}) => {
  // Default to November 2026 as per our app metadata timestamp (2026-11)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 1)); // Nov 2026

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const monthYearLabel = useMemo(() => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 10, 10)); // Today in 2026
  };

  // Build calendar matrix
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateKey: string }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = totalDaysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ day: dayNum, isCurrentMonth: false, dateKey });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, isCurrentMonth: true, dateKey });
    }

    // Next month padding to fill complete grid of 35 or 42
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, isCurrentMonth: false, dateKey });
    }

    return days;
  }, [currentDate]);

  // Map items by dateKey (YYYY-MM-DD)
  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};

    items.forEach((item) => {
      const rawDate = item.scheduled_at || item.published_at || item.createdAt;
      if (rawDate) {
        try {
          const d = new Date(rawDate);
          if (!isNaN(d.getTime())) {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (!map[key]) map[key] = [];
            map[key].push(item);
          }
        } catch {
          // ignore parsing error
        }
      }
    });

    return map;
  }, [items]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden font-sans space-y-4 p-4 sm:p-5">
      {/* Calendar Header with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <FiCalendar size={18} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">{monthYearLabel}</h2>
            <p className="text-xs text-slate-500">Multi-channel cross-publishing timeline schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Today
          </button>
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer border-r border-slate-200"
              title="Previous Month"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Next Month"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
          {onNewPostClick && (
            <button
              onClick={onNewPostClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-2xs transition-all cursor-pointer"
            >
              <FiPlus size={13} />
              <span>Schedule Post</span>
            </button>
          )}
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Day Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {calendarDays.map(({ day, isCurrentMonth, dateKey }) => {
          const dayItems = itemsByDate[dateKey] || [];
          const isToday = dateKey === '2026-11-10';

          return (
            <div
              key={dateKey}
              className={`min-h-[90px] sm:min-h-[120px] p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-colors ${
                !isCurrentMonth
                  ? 'bg-slate-50/40 border-slate-100 text-slate-300'
                  : isToday
                  ? 'bg-blue-50/30 border-blue-300 ring-1 ring-blue-400/30 text-slate-900'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-extrabold w-5 h-5 rounded-full flex items-center justify-center ${
                    isToday ? 'bg-blue-600 text-white' : ''
                  }`}
                >
                  {day}
                </span>

                {dayItems.length > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600">
                    {dayItems.length}
                  </span>
                )}
              </div>

              {/* Day Items Stack */}
              <div className="space-y-1 my-1 overflow-y-auto max-h-[70px] scrollbar-none">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item._id}
                    onClick={() => onView(item)}
                    title={item.caption}
                    className={`p-1 rounded-lg border text-[10px] font-semibold cursor-pointer truncate transition-all hover:scale-[1.02] shadow-2xs ${
                      item.status === 'Published'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                        : item.status === 'Scheduled'
                        ? 'bg-blue-50 text-blue-900 border-blue-200'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                          item.status === 'Published' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`}
                      />
                      <span className="truncate">{item.caption}</span>
                    </div>
                  </div>
                ))}

                {dayItems.length > 2 && (
                  <p className="text-[9px] font-bold text-slate-400 pl-1">
                    +{dayItems.length - 2} more
                  </p>
                )}
              </div>

              {/* Day footer spacer */}
              <div className="text-[8px] text-slate-400 font-mono hidden sm:block">
                {isCurrentMonth && dayItems.length > 0 && (
                  <span>{dayItems.map((i) => (i.target_platforms || []).join(', ')).join(' • ')}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
