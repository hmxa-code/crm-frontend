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

export default function TaskCalendarView({ tasks, onView, onEdit }: TaskCalendarViewProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  return (
    <div className="rounded-2xl border border-slate-300 bg-white p-4 sm:p-6 shadow-xs">
      <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <FiCalendar className="text-slate-900" size={18} />
          <h3 className="text-base font-bold text-slate-900">Calendar Schedule & Deadlines</h3>
        </div>
        <span className="rounded-full bg-slate-100 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-800">
          {sortedTasks.length} scheduled
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedTasks.length === 0 ? (
          <p className="py-12 text-center text-xs font-semibold text-slate-500 col-span-full">
            No scheduled tickets found.
          </p>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-300 bg-white p-4 shadow-xs transition hover:border-slate-400 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-800">
                    {task.moduleType}
                  </span>
                  <span className="rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-800">
                    {task.status}
                  </span>
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-900">{task.title}</h4>
                <p className="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">{task.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 font-bold">
                  <FiClock size={11} />
                  Due: {task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : 'Not Set'}
                </span>

                <div className="flex items-center gap-1">
                  <button onClick={() => onView(task)} className="rounded-lg p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition">
                    <FiEye size={13} />
                  </button>
                  <button onClick={() => onEdit(task)} className="rounded-lg p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition">
                    <FiEdit2 size={13} />
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