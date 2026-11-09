'use client';

import React from 'react';
import { Task, TaskStatus } from '../data/taskHelpers';
import { FiCalendar, FiClock, FiEye, FiEdit2 } from 'react-icons/fi';

interface TaskCalendarViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function TaskCalendarView({ tasks, onStatusChange, onView, onEdit }: TaskCalendarViewProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-slate-700" size={20} />
          <h3 className="text-base font-bold text-slate-800">Calendar Schedule & Deadlines</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {sortedTasks.length} scheduled
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedTasks.length === 0 ? (
          <p className="py-12 text-center text-sm font-medium text-slate-400 col-span-full">
            No scheduled tickets found.
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="rounded bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                  {task.moduleType}
                </span>
                <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border border-slate-200">
                  {task.status}
                </span>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-slate-800">{task.title}</h4>
              <p className="mt-2 line-clamp-2 text-xs text-slate-500">{task.description}</p>
              
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                  <FiClock size={11} />
                  Due: {task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'Not Set'}
                </span>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => onView(task)} className="rounded p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                    <FiEye size={12} />
                  </button>
                  <button onClick={() => onEdit(task)} className="rounded p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition">
                    <FiEdit2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}