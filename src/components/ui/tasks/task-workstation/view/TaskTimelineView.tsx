'use client';

import React from 'react';
import { Task } from '../data/taskHelpers';
import { FiClock, FiCheckCircle, FiEye, FiEdit2 } from 'react-icons/fi';

interface TaskTimelineViewProps {
  tasks: Task[];
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function TaskTimelineView({ tasks, onView, onEdit }: TaskTimelineViewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <FiClock className="text-slate-700" size={20} />
          <h3 className="text-base font-bold text-slate-800">Task Progression Timeline</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {tasks.length} tasks
        </span>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-6">
        {tasks.length === 0 ? (
          <p className="py-10 text-center text-sm font-medium text-slate-400">No timeline data available.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="relative group">
              <span className="absolute -left-[32.5px] top-3.5 h-3.5 w-3.5 rounded-full border-2 border-slate-400 bg-white shadow-sm transition group-hover:border-blue-400" />

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:bg-white hover:shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-slate-800">{task.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200">
                      {task.status}
                    </span>
                    <button onClick={() => onView(task)} className="rounded p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition">
                      <FiEye size={12} />
                    </button>
                    <button onClick={() => onEdit(task)} className="rounded p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition">
                      <FiEdit2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-500">{task.description || 'No description provided.'}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold text-slate-500 border-t border-slate-100 pt-2.5">
                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    <FiCheckCircle size={10} /> Priority: {task.priority}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    Module: {task.moduleType}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}