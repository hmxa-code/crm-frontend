'use client';

import React, { useState, useEffect } from 'react';
import {
  FiX, FiEdit2, FiTrash2, FiCalendar, FiClock, FiMessageSquare,
  FiCheckSquare, FiTag, FiUser, FiLink, FiPaperclip
} from 'react-icons/fi';
import { Task, TaskStatus, getMember, getPriorityConfig, getStatusConfig, STATUS_COLUMNS } from '../data/taskHelpers';
import { useTaskStore } from '../data/taskStore';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskDetailDrawer({ isOpen, task, onClose, onEdit, onDelete }: TaskDetailDrawerProps) {
  const { updateTaskStatus } = useTaskStore();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<{ id: string; text: string; time: string }[]>([]);

  useEffect(() => {
    if (isOpen && task) {
      setCommentText('');
      setComments([
        { id: '1', text: 'Task initialized in workstation.', time: new Date(task.createdAt || Date.now()).toLocaleDateString() },
      ]);
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const priorityConfig = getPriorityConfig(task.priority);
  const statusConfig = getStatusConfig(task.status);
  const assignee = getMember(task.assigneeId);
  const completedSubs = (task.subtasks ?? []).filter((s) => s.completed).length;
  const totalSubs = (task.subtasks ?? []).length;
  const progress = totalSubs > 0 ? Math.round((completedSubs / totalSubs) * 100) : 0;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments([
      ...comments,
      { id: Date.now().toString(), text: commentText.trim(), time: new Date().toLocaleTimeString() },
    ]);
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${statusConfig.badgeBg}`}>
              <span className={`inline-block h-1.5 w-1.5 rounded-full mr-1 ${statusConfig.dot}`} />
              {statusConfig.label}
            </span>
            <span className={`rounded border px-2 py-0.5 text-[10px] font-bold uppercase ${priorityConfig.className}`}>
              {priorityConfig.label}
            </span>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
              {task.moduleType}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title + Description */}
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">{task.title}</h2>
            <p className="mt-2 text-xs text-slate-500 leading-relaxed whitespace-pre-line">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <FiUser size={10} /> Assignee
              </p>
              {assignee ? (
                <div className="flex items-center gap-1.5">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white shrink-0 ${assignee.color}`}>
                    {assignee.initials}
                  </span>
                  <span className="text-xs font-semibold text-slate-700 truncate">{assignee.name}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Unassigned</span>
              )}
            </div>

            {/* Due Date */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <FiCalendar size={10} /> Due Date
              </p>
              <p className="text-xs font-semibold text-slate-700 font-mono">
                {task.dueDate ? task.dueDate.split('T')[0] : '— Not set'}
              </p>
            </div>

            {/* Est. Hours */}
            {task.estimatedHours && (
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <FiClock size={10} /> Estimated
                </p>
                <p className="text-xs font-semibold text-slate-700">{task.estimatedHours}h</p>
              </div>
            )}

            {/* Status changer */}
            <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">Change Status</p>
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task._id, e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                {STATUS_COLUMNS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <FiTag size={10} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {totalSubs > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <FiCheckSquare size={10} /> Subtasks
                </p>
                <span className="text-[10px] font-bold text-slate-500">{completedSubs}/{totalSubs} ({progress}%)</span>
              </div>
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-800 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-1.5">
                {(task.subtasks ?? []).map((st) => (
                  <div key={st.id} className={`flex items-center gap-2 rounded-lg border p-2 text-xs ${st.completed ? 'border-emerald-100 bg-emerald-50/40' : 'border-slate-100 bg-slate-50/60'}`}>
                    <span className={`h-3.5 w-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${st.completed ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                      {st.completed && <span className="text-white text-[8px]">✓</span>}
                    </span>
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Links & Attachments */}
          {task.attachments && task.attachments.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <FiLink size={10} /> Links & Reference URLs
              </p>
              <div className="space-y-1.5">
                {task.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/60 p-2 text-xs">
                    <FiPaperclip size={11} className="text-slate-400 shrink-0" />
                    <a href={att} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate font-medium">
                      {att}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <FiMessageSquare size={10} /> Activity & Comments
            </p>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs">
                  <p className="text-slate-700">{c.text}</p>
                  <span className="mt-1 block text-[9px] text-slate-400">{c.time}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                placeholder="Add a note or comment..."
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs outline-none focus:border-slate-400 focus:bg-white"
              />
              <button
                onClick={handleAddComment}
                className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-between gap-2">
          <button
            onClick={() => { onDelete(task._id); onClose(); }}
            className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <FiTrash2 size={13} /> Delete
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              <FiEdit2 size={13} /> Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}