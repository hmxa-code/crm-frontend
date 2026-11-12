'use client';

import React from 'react';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Task, TaskStatus, STATUS_COLUMNS } from '../data/taskHelpers';

interface TaskListViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

export default function TaskListView({
  tasks,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
}: TaskListViewProps) {
  return (
    <div className="rounded-2xl border border-slate-300 bg-white shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[700px]">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-4 sm:px-5 py-3 font-semibold uppercase tracking-wider">Ticket</th>
              <th className="px-4 sm:px-5 py-3 font-semibold uppercase tracking-wider">Status</th>
              <th className="px-4 sm:px-5 py-3 font-semibold uppercase tracking-wider">Priority</th>
              <th className="px-4 sm:px-5 py-3 font-semibold uppercase tracking-wider">Module</th>
              <th className="px-4 sm:px-5 py-3 font-semibold uppercase tracking-wider">Due Date</th>
              <th className="px-4 sm:px-5 py-3 text-right font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-slate-500 font-medium">
                  No tickets available.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className="transition hover:bg-slate-50">
                  <td className="px-4 sm:px-5 py-3.5">
                    <div className="font-bold text-slate-900">{task.title}</div>
                    {task.description && (
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{task.description}</p>
                    )}
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                      className="rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer outline-none focus:border-black shadow-2xs"
                    >
                      {STATUS_COLUMNS.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5">
                    <span className="inline-flex items-center rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-800">
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 font-semibold text-slate-800">{task.moduleType}</td>
                  <td className="px-4 sm:px-5 py-3.5 font-mono text-slate-600 text-[11px]">
                    {task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '-'}
                  </td>
                  <td className="px-4 sm:px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(task)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition"
                        title="View Details"
                      >
                        <FiEye size={13} />
                      </button>
                      <button
                        onClick={() => onEdit(task)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition"
                        title="Edit Task"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:text-black hover:bg-slate-100 transition"
                        title="Delete Task"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}