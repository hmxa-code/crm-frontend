'use client';

import React, { useState, useEffect } from 'react';
import {
  FiX, FiEdit2, FiTrash2, FiCalendar, FiClock, FiMessageSquare,
  FiCheckSquare, FiTag, FiUser, FiLink, FiPaperclip
} from 'react-icons/fi';
import { Task, TaskStatus, getMember, STATUS_COLUMNS } from '../data/taskHelpers';
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
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/30 backdrop-blur-xs" onClick={onClose}>
      <div
        className="h-full w-full max-w-[480px] bg-white shadow-2xl border-l border-slate-300 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 shrink-0 bg-white">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              {task.status}
            </span>
            <span className="rounded-lg border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-800">
              {task.priority}
            </span>
            <span className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
              {task.moduleType}
            </span>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-black transition">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">{task.title}</h2>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 shadow-2xs">
              <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <FiUser size={10} /> Assignee
              </p>
              {assignee ? (
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white shrink-0">
                    {assignee.initials}
                  </span>
                  <span className="text-xs font-semibold text-slate-800 truncate">{assignee.name}</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Unassigned</span>
              )}
            </div>

            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 shadow-2xs">
              <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <FiCalendar size={10} /> Due Date
              </p>
              <p className="text-xs font-semibold text-slate-800 font-mono">
                {task.dueDate ? task.dueDate.split('T')[0] : '— Not set'}
              </p>
            </div>

            {task.estimatedHours && (
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 shadow-2xs">
                <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <FiClock size={10} /> Estimated
                </p>
                <p className="text-xs font-semibold text-slate-800">{task.estimatedHours}h</p>
              </div>
            )}

            <div className="rounded-xl border border-slate-300 bg-slate-50 p-3 shadow-2xs">
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Change Status</p>
              <select
                value={task.status}
                onChange={(e) => updateTaskStatus(task._id, e.target.value as TaskStatus)}
                className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {STATUS_COLUMNS.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <FiTag size={10} /> Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-lg bg-slate-100 border border-slate-300 px-2.5 py-0.5 text-[11px] font-semibold text-slate-800 shadow-2xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {totalSubs > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <FiCheckSquare size={10} /> Subtasks
                </p>
                <span className="text-[10px] font-bold text-slate-500">{completedSubs}/{totalSubs} ({progress}%)</span>
              </div>
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                <div className="h-full rounded-full bg-black transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-1.5">
                {(task.subtasks ?? []).map((st) => (
                  <div key={st.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs shadow-2xs">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      readOnly
                      className="rounded border-slate-300 text-black focus:ring-black"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.attachments && task.attachments.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <FiLink size={10} /> Links & Reference URLs
              </p>
              <div className="space-y-1.5">
                {task.attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs shadow-2xs">
                    <FiPaperclip size={11} className="text-slate-500 shrink-0" />
                    <a href={att} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline truncate font-medium">
                      {att}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <FiMessageSquare size={10} /> Activity & Comments
            </p>
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto">
              {comments.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs shadow-2xs">
                  <p className="text-slate-800">{c.text}</p>
                  <span className="mt-1 block text-[9px] text-slate-500">{c.time}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(); } }}
                placeholder="Add a note or comment..."
                className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:border-black shadow-2xs"
              />
              <button
                onClick={handleAddComment}
                className="rounded-xl bg-black px-4 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
              >
                Post
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-2 bg-white">
          <button
            onClick={() => { onDelete(task._id); onClose(); }}
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-2xs"
          >
            <FiTrash2 size={13} /> Delete
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition shadow-2xs"
            >
              Close
            </button>
            <button
              onClick={() => onEdit(task)}
              className="flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-xs"
            >
              <FiEdit2 size={13} /> Edit Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}