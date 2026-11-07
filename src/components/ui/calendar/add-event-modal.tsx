"use client";

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/src/types/index';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate: Date | null;
  onSaveEvent: (event: CalendarEvent) => void;
}

export function AddEventModal({ isOpen, onClose, preselectedDate, onSaveEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('12:00');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setColor('blue');
      const targetDate = preselectedDate ? preselectedDate : new Date();
      setStartDate(targetDate.toISOString().split('T')[0]);
    }
  }, [isOpen, preselectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

    onSaveEvent({
      id: Math.random().toString(36).substring(7),
      title: title || 'Untitled Event',
      description,
      startDate: startDateTime,
      endDate: endDateTime,
      color,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" onClick={onClose} />
      
      {/* Centered Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col transition-all transform scale-100">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800">Schedule New Task</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-200/60 text-slate-500 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Lead Pitch Meeting"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                placeholder="Notes, context, or links..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-slate-950/10 focus:border-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Category</label>
              <div className="flex gap-2.5">
                {(['blue', 'purple', 'green', 'orange', 'red', 'gray'] as const).map((col) => {
                  const bgClasses = {
                    blue: 'bg-blue-500',
                    purple: 'bg-purple-500',
                    green: 'bg-emerald-500',
                    orange: 'bg-orange-500',
                    red: 'bg-rose-500',
                    gray: 'bg-slate-400'
                  };
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setColor(col)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        color === col ? 'border-slate-800 scale-110 shadow-sm' : 'border-transparent'
                      } ${bgClasses[col]}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md transition-all"
              >
                Save & Register Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}