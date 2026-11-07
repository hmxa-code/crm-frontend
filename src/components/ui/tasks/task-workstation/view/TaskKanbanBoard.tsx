'use client';

import React from 'react';
import { FiCalendar, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Task, TaskStatus, STATUS_COLUMNS } from '../data/taskHelpers';

interface TaskKanbanBoardProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

const STATUS_DOTS: Record<TaskStatus, string> = {
  TODO: 'bg-blue-500',
  IN_PROGRESS: 'bg-amber-500',
  IN_REVIEW: 'bg-emerald-500',
  DONE: 'bg-slate-400',
};

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

export default function TaskKanbanBoard({
  tasks,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
}: TaskKanbanBoardProps) {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 overflow-x-auto pb-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATUS_COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.key);
        return (
          <div
            key={col.key}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.key)}
            className="flex min-w-[270px] min-h-[300px] flex-col rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition-colors"
          >
            <div className="mb-3.5 flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOTS[col.key]}`} />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {col.label}
                </span>
              </div>
              <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3">
              {columnTasks.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs font-medium text-slate-400 bg-white/40">
                  No tickets in this stage
                </div>
              ) : (
                columnTasks.map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task._id)}
                    className="group relative rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition hover:border-slate-300 hover:shadow-md cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        {task.title}
                      </h4>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase border ${getPriorityBadge(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="mt-1.5 line-clamp-2 text-[11px] text-slate-500">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-600">{task.moduleType}</span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                          <FiCalendar size={11} />
                          {new Date(task.dueDate).toISOString().split('T')[0]}
                        </span>
                      )}
                    </div>

                    <div className="mt-2.5 pt-1.5 border-t border-slate-50 flex items-center justify-between">
                      <select
                        value={task.status}
                        onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                        className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {STATUS_COLUMNS.map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.label}
                          </option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => onView(task)}
                          className="p-1 text-slate-400 hover:text-slate-800 transition"
                          title="View Details"
                        >
                          <FiEye size={12} />
                        </button>
                        <button
                          onClick={() => onEdit(task)}
                          className="p-1 text-slate-400 hover:text-amber-600 transition"
                          title="Edit Task"
                        >
                          <FiEdit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDelete(task._id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
                          title="Delete Task"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}