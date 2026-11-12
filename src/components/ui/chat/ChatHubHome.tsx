'use client';

import React from 'react';
import {
  FiVideo,
  FiCalendar,
  FiClock,
  FiUserCheck,
  FiCoffee,
  FiMessageSquare,
  FiUsers,
  FiActivity,
  FiPlus,
  FiPhoneCall
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import { format, isSameDay } from 'date-fns';
import { CalendarEvent, badgeDotStyles } from '@/src/types/index';
import { useAttendance } from '@/src/utils/attendanceStore';
import toast from 'react-hot-toast';

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
  setProfileUser?: (user: User) => void;
}

const STATUS_DOT: Record<string, string> = {
  online: 'bg-emerald-500 ring-1.5 ring-white',
  busy: 'bg-rose-500 ring-1.5 ring-white',
  away: 'bg-amber-500 ring-1.5 ring-white',
  offline: 'bg-slate-400 ring-1.5 ring-white',
};

export default function ChatHubHome({
  users,
  onOpenDM,
  events = [],
  onOpenCalendar,
  onOpenAddEventModal,
  onEventClick,
  setProfileUser,
}: ChatHubHomeProps) {
  const {
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

  const handleStartQuickHuddle = () => {
    toast.success('Instant team huddle room initialized!', {
      icon: '🎙️',
      duration: 3000,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] text-slate-900 overflow-y-auto p-3 sm:p-6 space-y-3.5 sm:space-y-5 select-none scrollbar-thin">
      {/* Compact Responsive Command Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold tracking-wide border transition-all ${
              isCheckedIn
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : isOnBreak
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                isCheckedIn
                  ? 'bg-emerald-500 animate-pulse'
                  : isOnBreak
                  ? 'bg-amber-500'
                  : 'bg-slate-400'
              }`}
            />
            <span>
              {isCheckedIn ? 'Active Shift' : isOnBreak ? 'On Break' : 'Checked Out'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200">
            <FiClock size={12} className="text-blue-600 shrink-0" />
            <span>
              Duration:{' '}
              <strong className="text-slate-900 font-mono font-bold">
                {isCheckedIn || isOnBreak ? elapsedFormattedHMS : elapsedFormattedHM}
              </strong>
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {isCheckedIn || isOnBreak ? (
            <>
              <button
                type="button"
                onClick={checkOut}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              >
                <FiUserCheck size={13} className="text-rose-600 shrink-0" />
                <span>Check Out</span>
              </button>

              <button
                type="button"
                onClick={toggleBreak}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all border shadow-xs cursor-pointer ${
                  isOnBreak
                    ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <FiCoffee size={13} className={isOnBreak ? 'text-white' : 'text-amber-600'} />
                <span>{isOnBreak ? 'Resume' : 'Break'}</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={checkIn}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
            >
              <FiUserCheck size={13} />
              <span>Check In</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleStartQuickHuddle}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
          >
            <FiVideo size={13} />
            <span>Huddle</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* At Work Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Active Team</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                {onlineUsers.length} Online
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {onlineUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => onOpenDM(u.id)}
                  className="group flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/60 hover:border-slate-300 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setProfileUser?.(u);
                      }}
                      className="relative shrink-0 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                        <img src={getDiceBearAvatar(u.name)} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${STATUS_DOT[u.status]}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{u.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate">{u.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onOpenDM(u.id); }}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 cursor-pointer"
                      title="DM"
                    >
                      <FiMessageSquare size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toast.success(`Calling ${u.name}`); }}
                      className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 cursor-pointer"
                      title="Call"
                    >
                      <FiPhoneCall size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Away / Break Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight">Away & Breaks</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {awayUsers.length} Inactive
              </span>
            </div>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
              {awayUsers.map((u) => (
                <div
                  key={u.id}
                  onClick={() => onOpenDM(u.id)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/50 hover:bg-slate-100/80 border border-slate-200/50 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      onClick={(e) => { e.stopPropagation(); setProfileUser?.(u); }}
                      className="relative shrink-0 cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                        <img src={getDiceBearAvatar(u.name)} alt={u.name} className="w-full h-full object-cover grayscale-25" />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${STATUS_DOT[u.status]}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{u.name}</h4>
                      <p className="text-[10px] text-slate-400 truncate">{u.title}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
                    {u.status === 'busy' ? 'In Call' : 'Away'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduled Meetings */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between md:col-span-2 xl:col-span-1">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center gap-1.5">
                <FiCalendar className="text-slate-700" size={13} />
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Huddles Today</h3>
              </div>
              {onOpenCalendar && (
                <button onClick={onOpenCalendar} className="text-[11px] font-bold text-slate-900 hover:underline cursor-pointer">
                  Calendar &rarr;
                </button>
              )}
            </div>

            {todayEvents.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick ? onEventClick(event) : onOpenCalendar?.()}
                    className="p-2.5 rounded-xl bg-slate-50/70 hover:bg-slate-100 border border-slate-200/70 cursor-pointer transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${badgeDotStyles[event.color] || 'bg-slate-600'}`} />
                      <h4 className="text-xs font-bold text-slate-900 truncate">{event.title}</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                      {format(new Date(event.startDate), 'hh:mm a')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No huddles booked today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}