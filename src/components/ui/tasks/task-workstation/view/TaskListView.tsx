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

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'URGENT':
      return 'bg-red-50 text-red-600 border-red-200';
    case 'HIGH':
      return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'MEDIUM':
      return 'bg-blue-50 text-blue-600 border-blue-200';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export default function TaskListView({
  tasks,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
}: TaskListViewProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50/70 text-slate-500">
          <tr>
            <th className="px-5 py-4 font-semibold uppercase tracking-wider">Ticket</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-wider">Status</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-wider">Priority</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-wider">Module</th>
            <th className="px-5 py-4 font-semibold uppercase tracking-wider">Due Date</th>
            <th className="px-5 py-4 text-right font-semibold uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-5 py-16 text-center text-slate-400 font-medium">
                No tickets available.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task._id} className="transition hover:bg-slate-50/60">
                <td className="px-5 py-4">
                  <div className="font-semibold text-slate-800">{task.title}</div>
                  {task.description && (
                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{task.description}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                    className="w-full max-w-[140px] rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer outline-none focus:border-blue-400 transition"
                  >
                    {STATUS_COLUMNS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded px-2.5 py-1 text-[10px] font-bold uppercase border ${getPriorityBadge(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-5 py-4 font-medium text-slate-600">{task.moduleType}</td>
                <td className="px-5 py-4 font-mono text-slate-500 text-[11px]">
                  {task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '-'}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onView(task)}
                      className="rounded p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                      title="View Details"
                    >
                      <FiEye size={13} />
                    </button>
                    <button
                      onClick={() => onEdit(task)}
                      className="rounded p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition"
                      title="Edit Task"
                    >
                      <FiEdit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(task._id)}
                      className="rounded p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
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
  );
}