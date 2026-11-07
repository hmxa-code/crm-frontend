'use client';

import React from 'react';
import {
  FiVideo,
  FiCalendar,
  FiClock,
  FiUserCheck,
  FiCoffee,
  FiMessageSquare,
  FiArrowUpRight,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';


import { format, isSameDay } from 'date-fns';
import { CalendarEvent, badgeDotStyles } from '@/src/types/index';
import { useAttendance } from '@/src/utils/attendanceStore';

interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  status: 'online' | 'busy' | 'away' | 'offline';
  avatarBg: string;
}

interface ChatHubHomeProps {
  users: User[];
  onOpenDM: (userId: string) => void;
  primaryColor?: string;
  events?: CalendarEvent[];
  onOpenCalendar?: () => void;
  onOpenAddEventModal?: () => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const STATUS_DOT: Record<string, string> = {
  online: 'bg-emerald-500',
  busy: 'bg-rose-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-400',
};

export default function ChatHubHome({
  users,
  onOpenDM,
  primaryColor = '#00aaff',
  events = [],
  onOpenCalendar,
  onOpenAddEventModal,
  onEventClick,
}: ChatHubHomeProps) {
  const {
    adminRecord,
    isCheckedIn,
    isOnBreak,
    elapsedFormattedHMS,
    elapsedFormattedHM,
    checkIn,
    checkOut,
    toggleBreak,
  } = useAttendance();

  const onlineUsers = users.filter((u) => u.status === 'online');
  const awayUsers = users.filter((u) => u.status !== 'online');
  const today = new Date();
  const todayEvents = events.filter((e) => isSameDay(new Date(e.startDate), today));

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] text-slate-900 overflow-y-auto p-6 space-y-4 select-none scrollbar-thin">

      {/* 1. Control Center Header — Live Synced with Attendance Store */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold tracking-wide border ${
            isCheckedIn
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70'
              : isOnBreak
              ? 'bg-amber-50 text-amber-700 border-amber-200/70'
              : 'bg-slate-100 text-slate-600 border-slate-200/70'
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${
              isCheckedIn ? 'bg-emerald-500 animate-pulse' : isOnBreak ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
            <span>
              {isCheckedIn
                ? 'Remote Work Active'
                : isOnBreak
                ? 'On 15m Break'
                : 'Checked Out / Shift Saved'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
            <FiClock size={12} className="text-slate-400" />
            <span>
              Shift Elapsed:{' '}
              <strong className="text-slate-900 font-mono">
                {isCheckedIn || isOnBreak ? elapsedFormattedHMS : elapsedFormattedHM}
              </strong>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isCheckedIn || isOnBreak ? (
            <>
              <button
                type="button"
                onClick={checkOut}
                className="group flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-600 text-rose-700 hover:text-white text-[11px] font-semibold transition border border-rose-200 shadow-2xs"
                title="Check Out from Shift"
              >
                <FiUserCheck size={13} className="transition-transform group-hover:scale-110" />
                <span>Check Out</span>
              </button>

              <button
                type="button"
                onClick={toggleBreak}
                className={`group flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[11px] font-semibold transition border shadow-2xs ${
                  isOnBreak
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white hover:bg-amber-500 text-amber-700 hover:text-white border-amber-200'
                }`}
                title={isOnBreak ? 'Resume Work' : '15m Rest Break'}
              >
                <FiCoffee size={13} className="transition-transform group-hover:scale-110" />
                <span>{isOnBreak ? 'Resume Work' : '15m Break'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={checkIn}
              className="group flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition shadow-2xs"
              title="Start Working Shift"
            >
              <FiUserCheck size={13} className="transition-transform group-hover:scale-110" />
              <span>Check In Now</span>
            </button>
          )}

          <button
            style={{ backgroundColor: primaryColor }}
            className="group flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-[11px] font-semibold transition shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <FiVideo size={13} className="transition-transform group-hover:scale-110" />
            <span>Meet Now</span>
          </button>
        </div>
      </div>

      {/* 2. Bento Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* At Work (Online Members) Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-3xs flex flex-col transition hover:border-slate-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">At Work</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {onlineUsers.length} Online
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {onlineUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onOpenDM(u.id)}
                className="group/item flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/50 hover:border-slate-300 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-2xs border border-slate-200/60">
                      <img
                        src={getDiceBearAvatar(u.name)}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[u.status]}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{u.email}</p>
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 transition-all shadow-2xs">
                  <FiMessageSquare size={13} />
                </div>
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className="text-[11px] text-slate-400 text-center py-6">Koi team member online nahi hai.</p>
            )}
          </div>
        </div>

        {/* Away / Break Card */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-3xs flex flex-col transition hover:border-slate-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Away / Break</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200/60">
              {awayUsers.length} Inactive
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1 scrollbar-thin">
            {awayUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => onOpenDM(u.id)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 hover:bg-slate-100 border border-slate-200/40 hover:border-slate-300 cursor-pointer transition opacity-80 hover:opacity-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-2xs border border-slate-200/60">
                      <img
                        src={getDiceBearAvatar(u.name)}
                        alt={u.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_DOT[u.status]}`} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{u.name}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate">{u.title}</p>
                  </div>
                </div>
              </div>
            ))}
            {awayUsers.length === 0 && (
              <p className="text-[11px] text-slate-400 text-center py-6">Poora team available hai.</p>
            )}
          </div>
        </div>

        {/* Scheduled Meetings / Focus Panel */}
        <div className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-3xs flex flex-col justify-between transition hover:border-slate-300">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                <FiCalendar size={12} className="text-slate-400" /> Meetings Today
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
                  {todayEvents.length} Calls
                </span>
                {onOpenCalendar && (
                  <button
                    onClick={onOpenCalendar}
                    className="text-[10px] font-bold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
            </div>

            {todayEvents.length > 0 ? (
              <div className="space-y-2 flex-1 overflow-y-auto pr-1 max-h-[220px] scrollbar-thin">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick ? onEventClick(event) : onOpenCalendar?.()}
                    className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/90 border border-slate-200/60 hover:border-slate-300 cursor-pointer transition flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${badgeDotStyles[event.color] || 'bg-slate-400'}`} />
                        <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
                      </div>
                      <span className="text-[9px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                        {format(new Date(event.startDate), 'hh:mm a')}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">
                        {event.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2.5">
                <div className="p-3.5 rounded-2xl bg-slate-50 text-slate-300 border border-slate-100">
                  <FiCalendar size={22} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-900">All caught up for today</p>
                  <p className="text-[10px] text-slate-400 max-w-[220px] leading-relaxed">
                    Your schedule is clear. Launch instant huddles directly from your channels anytime.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={onOpenAddEventModal || onOpenCalendar}
              style={{ backgroundColor: primaryColor }}
              className="group w-full py-2.5 rounded-xl text-white text-[11px] font-bold transition flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md"
            >
              <span>Schedule New Huddle</span>
              <FiArrowUpRight size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            {onOpenCalendar && (
              <button
                onClick={onOpenCalendar}
                className="w-full py-2 rounded-xl text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span>Open Calendar Workspace</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
