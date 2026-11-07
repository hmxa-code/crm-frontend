'use client';

import React, { useState } from 'react';
import {
  FiCalendar,
  FiX,
  FiPlus,
  FiExternalLink,
  FiClock,
  FiShare2,
} from 'react-icons/fi';
import { format, isSameDay, startOfMonth } from 'date-fns';
import { CalendarEvent, badgeDotStyles } from '@/src/types/index';

interface ChatCalendarDrawerProps {
  isOpen: boolean;
  primaryColor?: string;
  onClose: () => void;
  events: CalendarEvent[];
  onOpenCreateEventModal: () => void;
  onOpenFullCalendar: () => void;
  onEventClick: (event: CalendarEvent) => void;
  onShareEventInChat: (event: CalendarEvent) => void;
}

export default function ChatCalendarDrawer({
  isOpen,
  primaryColor = '#00aaff',
  onClose,
  events,
  onOpenCreateEventModal,
  onOpenFullCalendar,
  onEventClick,
  onShareEventInChat,
}: ChatCalendarDrawerProps) {
  const [filter, setFilter] = useState<'ALL' | 'TODAY' | 'UPCOMING'>('ALL');

  if (!isOpen) return null;

  const today = new Date();

  const filteredEvents = events.filter((e) => {
    const eDate = new Date(e.startDate);
    if (filter === 'TODAY') {
      return isSameDay(eDate, today);
    }
    if (filter === 'UPCOMING') {
      return eDate.getTime() >= today.getTime();
    }
    return true;
  }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  const todayCount = events.filter((e) => isSameDay(new Date(e.startDate), today)).length;
  const upcomingCount = events.filter((e) => new Date(e.startDate).getTime() >= today.getTime()).length;

  return (
    <aside className="w-80 md:w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 z-30 shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
        <div className="flex items-center gap-2.5">
          <div
            style={{ backgroundColor: primaryColor }}
            className="p-1.5 rounded-lg text-white shadow-2xs"
          >
            <FiCalendar size={16} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900">Team Calendar & Schedule</h3>
            <p className="text-[10px] text-slate-500">Live CRM meeting stream</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
          title="Close drawer"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Calendar Metrics Badges */}
      <div className="p-3 bg-slate-50/60 border-b border-slate-100 grid grid-cols-3 gap-2 text-center">
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-slate-400 font-semibold block">Total</span>
          <strong className="text-xs text-slate-800">{events.length}</strong>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-blue-600 font-semibold block">Today</span>
          <strong className="text-xs text-blue-700">{todayCount}</strong>
        </div>
        <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] text-emerald-600 font-semibold block">Upcoming</span>
          <strong className="text-xs text-emerald-700">{upcomingCount}</strong>
        </div>
      </div>

      {/* Filter Tabs & Quick Actions */}
      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-1">
          {(['ALL', 'TODAY', 'UPCOMING'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={filter === tab ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                filter === tab ? 'shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={onOpenCreateEventModal}
          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg font-bold text-xs flex items-center gap-1 transition"
          title="Schedule New Event"
        >
          <FiPlus size={14} />
          <span className="text-[11px] font-bold">New</span>
        </button>
      </div>

      {/* Event Cards Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-slate-50/40 scrollbar-thin">
        {filteredEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <FiCalendar size={28} className="mx-auto opacity-30" />
            <p className="text-xs font-semibold">Koi scheduled activity nahi mili.</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
            const isEventToday = isSameDay(new Date(event.startDate), today);
            return (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="group p-3 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 hover:shadow-2xs cursor-pointer transition flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${badgeDotStyles[event.color] || 'bg-slate-400'}`} />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {event.title}
                    </span>
                  </div>
                  {isEventToday && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200/60">
                      Today
                    </span>
                  )}
                </div>

                {event.description && (
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <FiClock size={11} className="text-slate-400" />
                    <span className="font-medium text-slate-600">
                      {format(new Date(event.startDate), 'MMM dd, hh:mm a')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onShareEventInChat(event);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition flex items-center gap-1 font-semibold"
                    title="Share in Chat"
                  >
                    <FiShare2 size={11} />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full Calendar Jump Button */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <button
          onClick={onOpenFullCalendar}
          style={{ backgroundColor: primaryColor }}
          className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs hover:opacity-90 transition"
        >
          <span>Open Full Calendar Workspace</span>
          <FiExternalLink size={13} />
        </button>
      </div>
    </aside>
  );
}
