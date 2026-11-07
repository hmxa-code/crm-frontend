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
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
        <FiClock className="text-slate-800" size={18} />
        <h3 className="text-sm font-bold text-slate-800">Task Progression Timeline</h3>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-6 my-2">
        {tasks.length === 0 ? (
          <p className="py-8 text-xs font-medium text-slate-400">No timeline data available.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="relative group">
              <span className="absolute -left-[31.5px] top-4 h-3.5 w-3.5 rounded-full border-2 border-slate-800 bg-white shadow-xs" />

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/40 p-4 transition hover:border-slate-300 hover:bg-white shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800">{task.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {task.status}
                    </span>
                    <button onClick={() => onView(task)} className="p-1 text-slate-400 hover:text-slate-800">
                      <FiEye size={12} />
                    </button>
                    <button onClick={() => onEdit(task)} className="p-1 text-slate-400 hover:text-amber-600">
                      <FiEdit2 size={12} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{task.description || 'No description provided.'}</p>
                <div className="mt-3 text-[10px] font-semibold text-slate-400 flex items-center gap-1.5 border-t border-slate-100 pt-2">
                  <FiCheckCircle size={11} className="text-slate-600" /> Priority: {task.priority} | Module: {task.moduleType}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}