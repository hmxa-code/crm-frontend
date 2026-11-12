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
  IN_REVIEW: 'bg-violet-500',
  DONE: 'bg-emerald-500',
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
    <div className="w-full overflow-x-auto pb-4 no-scrollbar">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 min-w-full lg:min-w-0">
        {STATUS_COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.key)}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 sm:bg-white p-3.5 sm:p-4 shadow-xs shrink-0 w-full"
            >
              <div className="mb-3.5 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOTS[col.key]}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    {col.label}
                  </span>
                </div>
                <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[11px] font-bold text-slate-800">
                  {columnTasks.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {columnTasks.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs font-medium text-slate-400 py-8 bg-white/50">
                    No tickets in this stage
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      className="group relative rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs transition hover:shadow-md hover:border-slate-300 cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-2">
                          {task.title}
                        </h4>
                        <span className="shrink-0 rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-800">
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-semibold text-slate-700">{task.moduleType}</span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 font-mono text-[9px] text-slate-500">
                            <FiCalendar size={10} />
                            {new Date(task.dueDate).toISOString().split('T')[0]}
                          </span>
                        )}
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <select
                          value={task.status}
                          onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-800 focus:outline-none cursor-pointer w-28 truncate"
                        >
                          {STATUS_COLUMNS.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onView(task)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="View Details"
                          >
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => onEdit(task)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                            title="Edit Task"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDelete(task._id)}
                            className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                            title="Delete Task"
                          >
                            <FiTrash2 size={13} />
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
    </div>
  );
}