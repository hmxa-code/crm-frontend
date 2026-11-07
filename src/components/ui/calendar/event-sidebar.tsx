"use client";

import React from 'react';
import { CalendarEvent } from '@/src/types/index';

interface EventSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  onDeleteEvent: (id: string) => void;
  onShareInChat?: (event: CalendarEvent) => void;
}

export function EventSidebar({ isOpen, onClose, event, onDeleteEvent, onShareInChat }: EventSidebarProps) {
  if (!isOpen || !event) return null;

  return (
    <>
      {/* Sleek Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-50 transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      {/* Side drawer containing detailed event metrics */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col transition-transform duration-300 transform translate-x-0">
        
        {/* Header container */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Schedule Metrics</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Dynamic Detail Body Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          <div>
            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md ${
              event.color === 'blue' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
              event.color === 'purple' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
              event.color === 'green' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
              event.color === 'orange' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
              event.color === 'red' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
            }`}>
              {event.color.toUpperCase()} CATEGORY
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">{event.title}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-2">
              {event.startDate.toLocaleString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric', 
                hour: 'numeric', 
                minute: '2-digit' 
              })}
            </p>
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description / Notes</h4>
            <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {event.description || "No dynamic internal parameters registered for this event."}
            </div>
          </div>
        </div>

        {/* Control Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col gap-2">
          {onShareInChat && (
            <button
              type="button"
              onClick={() => onShareInChat(event)}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Share Event in Chat
            </button>
          )}

          <button
            type="button"
            onClick={() => onDeleteEvent(event.id)}
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Remove Event Entry
          </button>
        </div>

      </div>
    </>
  );
}