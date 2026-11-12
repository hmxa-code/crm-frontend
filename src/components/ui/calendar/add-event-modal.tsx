"use client";

import React, { useState, useEffect } from 'react';
import { CalendarEvent } from '@/src/types/index';
import { TEAM_MEMBERS } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';
import { 
  FiX, 
  FiCalendar, 
  FiClock, 
  FiUser, 
  FiTag, 
  FiCheckSquare, 
  FiFileText, 
  FiFlag,
  FiZap 
} from 'react-icons/fi';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDate: Date | null;
  onSaveEvent: (event: CalendarEvent, syncToTasks?: boolean) => void;
}

export function AddEventModal({ isOpen, onClose, preselectedDate, onSaveEvent }: AddEventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<CalendarEvent['color']>('blue');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [durationHours, setDurationHours] = useState('1');
  const [category, setCategory] = useState<'SALES' | 'MARKETING' | 'SUPPORT' | 'GENERAL'>('SALES');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('HIGH');
  const [assigneeId, setAssigneeId] = useState('u1');
  const [syncToTasks, setSyncToTasks] = useState(true);
  const [errors, setErrors] = useState<{title?: string; date?: string}>({});

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setColor('blue');
      setCategory('SALES');
      setPriority('HIGH');
      setAssigneeId('u1');
      setSyncToTasks(true);
      setErrors({});
      const targetDate = preselectedDate ? preselectedDate : new Date();
      setStartDate(targetDate.toISOString().split('T')[0]);
    }
  }, [isOpen, preselectedDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const newErrors: {title?: string; date?: string} = {};
    if (!title.trim()) {
      newErrors.title = 'Event / Task title is required';
    }
    if (!startDate) {
      newErrors.date = 'Date is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(startDateTime.getTime() + parseFloat(durationHours) * 60 * 60 * 1000);
    const assignedMember = TEAM_MEMBERS.find((m) => m.id === assigneeId);

    const nowTimestamp = Date.now();
    const eventId = `evt-${nowTimestamp}`;
    const generatedTaskId = `task-${nowTimestamp}`;

    const newEvent: CalendarEvent = {
      id: eventId,
      taskId: generatedTaskId,
      title: title.trim(),
      description: description.trim() || `Scheduled in CRM Calendar • Module: ${category} • Priority: ${priority}`,
      startDate: isNaN(startDateTime.getTime()) ? new Date() : startDateTime,
      endDate: isNaN(endDateTime.getTime()) ? new Date(Date.now() + 3600000) : endDateTime,
      color,
      category,
      priority,
      status: 'TODO',
      assignee: assignedMember?.name,
      estimatedHours: parseFloat(durationHours),
    };

    onSaveEvent(newEvent, syncToTasks);
  };

  const colorOptions: { key: CalendarEvent['color']; label: string; bgClass: string }[] = [
    { key: 'blue', label: 'Blue', bgClass: 'bg-blue-500' },
    { key: 'purple', label: 'Purple', bgClass: 'bg-purple-500' },
    { key: 'green', label: 'Green', bgClass: 'bg-emerald-500' },
    { key: 'orange', label: 'Orange', bgClass: 'bg-orange-500' },
    { key: 'red', label: 'Red (Urgent)', bgClass: 'bg-rose-500' },
    { key: 'gray', label: 'Slate', bgClass: 'bg-slate-400' },
  ];

  const quickTemplates = [
    { label: 'Hot Lead Follow-up', category: 'SALES' as const, priority: 'HIGH' as const, color: 'blue' as const },
    { label: 'Enterprise Client Demo', category: 'SALES' as const, priority: 'URGENT' as const, color: 'green' as const },
    { label: 'Sprint Sync & Task Dispatch', category: 'GENERAL' as const, priority: 'MEDIUM' as const, color: 'purple' as const },
    { label: 'Q4 Drip Campaign Review', category: 'MARKETING' as const, priority: 'MEDIUM' as const, color: 'orange' as const },
  ];

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden flex justify-end">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose} 
      />

      {/* Slide-over Drawer taking full viewport height */}
      <aside className="relative w-full sm:w-[480px] md:w-[520px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-10 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="h-16 px-4 sm:px-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 shrink-0">
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
          
          {/* Clean Title without extra icon */}
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight truncate">Schedule Task / Event</h2>
            <p className="text-[11px] text-slate-500 font-medium">CRM Workspace Drawer Mode</p>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer shrink-0 ml-auto"
            title="Close Drawer"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Body Form */}
        <form id="add-event-schedule-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          
          {/* Quick Preset Buttons */}
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              Quick Templates
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickTemplates.map((tmpl) => (
                <button
                  key={tmpl.label}
                  type="button"
                  onClick={() => {
                    setTitle(tmpl.label);
                    setCategory(tmpl.category);
                    setPriority(tmpl.priority);
                    setColor(tmpl.color);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                >
                  + {tmpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <FiTag size={12} className="text-slate-400" />
              <span>Event / Task Title *</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Corporate Client Product Demo — Zeta Corp"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${errors.title ? 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/20' : 'border-slate-200 focus:border-sky-500 focus:ring-sky-500/20'} text-xs font-semibold text-slate-900 bg-white placeholder-slate-400 focus:outline-none transition`}
            />
            {errors.title && (
              <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Module & Priority Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FiZap size={12} className="text-amber-500" />
                <span>CRM Module</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="SALES">Sales / Commercial</option>
                <option value="MARKETING">Marketing & Funnels</option>
                <option value="SUPPORT">Customer Support</option>
                <option value="GENERAL">General Operations</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FiFlag size={12} className="text-rose-500" />
                <span>Priority</span>
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="URGENT">Urgent (Red Alert)</option>
              </select>
            </div>
          </div>

          {/* Assignee Selection */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <FiUser size={12} className="text-slate-400" />
              <span>Assigned Team Member</span>
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none focus:border-slate-400 cursor-pointer"
            >
              {TEAM_MEMBERS.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.initials})
                </option>
              ))}
            </select>
          </div>

          {/* Date, Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FiCalendar size={12} className="text-slate-400" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border ${errors.date ? 'border-rose-400 focus:border-rose-400' : 'border-slate-200 focus:border-slate-400'} text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none transition`}
              />
              {errors.date && (
                <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FiClock size={12} className="text-slate-400" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                <FiClock size={12} className="text-slate-400" />
                <span>Duration</span>
              </label>
              <select
                value={durationHours}
                onChange={(e) => setDurationHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/70 focus:outline-none focus:border-slate-400 cursor-pointer"
              >
                <option value="0.5">30 Mins</option>
                <option value="1">1 Hour</option>
                <option value="1.5">1.5 Hours</option>
                <option value="2">2 Hours</option>
                <option value="4">Half Day (4h)</option>
                <option value="8">Full Day (8h)</option>
              </select>
            </div>
          </div>

          {/* Color Category Tags */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 block">
              Badge Color Accent
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {colorOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setColor(opt.key)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${opt.bgClass} ${
                    color === opt.key ? 'ring-2 ring-offset-2 ring-slate-900 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={opt.label}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
              <FiFileText size={12} className="text-slate-400" />
              <span>Description / Notes</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add agenda, client requirements, checklist items..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition resize-none"
            />
          </div>

          {/* Sync to Task Management Toggle */}
          <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="p-2 rounded-lg bg-emerald-600 text-white shadow-2xs shrink-0">
                <FiCheckSquare size={14} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-950 truncate">Sync to Task Workstation</p>
                <p className="text-[10px] text-emerald-700 truncate">Creates active ticket in Task Store</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={syncToTasks}
                onChange={(e) => setSyncToTasks(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </form>

        {/* Fixed Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-event-schedule-form"
            onClick={handleSubmit}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white shadow-xs transition cursor-pointer active:scale-95"
          >
            Schedule & Save Task
          </button>
        </div>
      </aside>
    </div>
  );
}