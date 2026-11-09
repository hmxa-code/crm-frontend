'use client';

import React from 'react';
import Link from 'next/link';
import { CalendarEvent } from '@/src/types/index';
import { 
  FiX, 
  FiClock, 
  FiUser, 
  FiCalendar, 
  FiCheckCircle, 
  FiTrash2, 
  FiMessageSquare, 
  FiExternalLink,
  FiFlag,
  FiFolder
} from 'react-icons/fi';

interface EventSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDeleteEvent: (id: string) => void;
  onShareInChat?: (event: CalendarEvent) => void;
  onUpdateEventStatus?: (eventId: string, newStatus: string) => void;
}

export function EventSidebar({ 
  isOpen, 
  onClose, 
  event, 
  onDeleteEvent, 
  onShareInChat,
  onUpdateEventStatus,
}: EventSidebarProps) {
  if (!isOpen || !event) return null;

  const colorTagStyles: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    red: 'bg-rose-50 text-rose-700 border-rose-200',
    gray: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const priorityBadgeStyles: Record<string, string> = {
    URGENT: 'bg-rose-50 text-rose-700 border-rose-200',
    HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
    MEDIUM: 'bg-amber-50 text-amber-700 border-amber-200',
    LOW: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  const statusBadgeStyles: Record<string, string> = {
    DONE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
    IN_REVIEW: 'bg-purple-50 text-purple-700 border-purple-200',
    TODO: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* 1. Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      
      {/* 2. Slide-over Drawer Panel */}
      <aside className="relative w-full sm:w-[420px] md:w-[460px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          {/* Mobile Back Button */}
          <button 
            type="button"
            onClick={onClose} 
            className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer shrink-0"
            title="Go Back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-slate-900 text-white shadow-xs shrink-0">
              <FiCalendar size={16} className="text-sky-400" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">Schedule Details</h2>
              <p className="text-[11px] text-slate-400 font-medium">Task & Event Metrics</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer shrink-0"
            title="Close Drawer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Dynamic Detail Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
          
          {/* Status & Priority Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${
              colorTagStyles[event.color] || colorTagStyles.gray
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {event.category || event.color} MODULE
            </span>

            {event.priority && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${
                priorityBadgeStyles[event.priority] || priorityBadgeStyles.MEDIUM
              }`}>
                <FiFlag size={11} />
                {event.priority}
              </span>
            )}

            {event.status && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-lg border uppercase tracking-wider ${
                statusBadgeStyles[event.status] || statusBadgeStyles.TODO
              }`}>
                <FiCheckCircle size={11} />
                {event.status}
              </span>
            )}
          </div>

          {/* Event Title */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {event.title}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-1.5 flex items-center gap-1.5">
              <FiClock size={13} className="text-slate-400 shrink-0" />
              <span className="truncate">
                {new Date(event.startDate).toLocaleString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric', 
                  hour: 'numeric', 
                  minute: '2-digit' 
                })} — {new Date(event.endDate).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </span>
            </p>
          </div>

          {/* Assignee & Resource Allocation */}
          <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 grid grid-cols-2 gap-3">
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <FiUser size={11} /> Assignee
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">
                {event.assignee || 'Assigned to Team'}
              </p>
            </div>

            <div className="min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                <FiFolder size={11} /> Estimated Time
              </span>
              <p className="text-xs font-bold text-slate-800 truncate">
                {event.estimatedHours ? `${event.estimatedHours} Hours` : '1.0 Hour'}
              </p>
            </div>
          </div>

          {/* Quick Status Toggle */}
          {onUpdateEventStatus && (
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                Update Task Status
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onUpdateEventStatus(event.id, st)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition cursor-pointer truncate ${
                      event.status === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description & Internal Agenda */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Description & Notes
            </h4>
            <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80 whitespace-pre-line break-words">
              {event.description || "No dynamic internal notes registered for this task."}
            </div>
          </div>

          {/* Direct Link to Task Workstation */}
          <div className="pt-2">
            <Link
              href="/tasks/workspace"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              <span>View In ClickUp Task Workstation</span>
              <FiExternalLink size={12} />
            </Link>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex flex-col gap-2 shrink-0">
          {onShareInChat && (
            <button
              type="button"
              onClick={() => onShareInChat(event)}
              className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200/80 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <FiMessageSquare size={14} />
              <span>Share in Workspace Chat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteEvent(event.id)}
            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <FiTrash2 size={14} />
            <span>Remove From Schedule</span>
          </button>
        </div>
      </aside>
    </div>
  );
}
