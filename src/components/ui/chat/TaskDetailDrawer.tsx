'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiEdit2, FiUser, FiTag, FiCalendar, FiCheckCircle, FiMessageSquare } from 'react-icons/fi';
import { useTaskStore, getMember, getList, STATUS_OPTIONS, PRIORITY_OPTIONS, type WorkspaceTask } from '@/src/components/ui/tasks/task-workstation/data/taskStore';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  task: WorkspaceTask | null;
  onClose: () => void;
  onSaveUpdate: (task: Partial<WorkspaceTask>) => void;
  primaryColor?: string;
}

export default function TaskDetailDrawer({
  isOpen,
  task,
  onClose,
  onSaveUpdate,
}: TaskDetailDrawerProps) {
  const { team, lists } = useTaskStore();
  const [activeTab, setActiveTab] = useState<'edit' | 'activity'>('edit');
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (isOpen && task) {
      setCommentText('');
      setActiveTab('edit');
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleStatusChange = (newStatus: typeof task.status) => {
    onSaveUpdate({ status: newStatus });
  };

  const handlePriorityChange = (newPriority: typeof task.priority) => {
    onSaveUpdate({ priority: newPriority });
  };

  const handleAssigneeChange = (assigneeId: string) => {
    onSaveUpdate({ assigneeId });
  };

  const handleListChange = (listId: string) => {
    onSaveUpdate({ listId });
  };

  const handleDueDateChange = (dueDate: string) => {
    onSaveUpdate({ dueDate });
  };

  const handleTitleChange = (title: string) => {
    onSaveUpdate({ title });
  };

  const handleDescriptionChange = (description: string) => {
    onSaveUpdate({ description });
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    onSaveUpdate({
      comments: [...task.comments, {
        id: `c-${Date.now()}`,
        authorId: 'u-me',
        text: commentText.trim(),
        createdAt: new Date().toISOString(),
      }],
    });
    setCommentText('');
  };

  const activityHistory = [
    { action: 'Ticket created', time: new Date(task.createdAt).toLocaleString(), user: getMember(task.reporterId)?.name || 'Unknown' },
    ...task.comments.map(c => ({ action: `Comment added by ${getMember(c.authorId)?.name || 'User'}`, time: new Date(c.createdAt).toLocaleString(), user: getMember(c.authorId)?.name || 'Unknown' }))
  ];

  return (
    <aside className="w-80 md:w-96 lg:w-[420px] xl:w-[480px] border-l border-slate-200 bg-white flex flex-col shrink-0 z-50 shadow-2xl animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="h-14 px-5 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-slate-900 text-white shadow-xs">
            <FiEdit2 size={14} />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-800 tracking-tight">Ticket Details & Editor</h3>
            <p className="text-[10px] text-slate-400 font-medium">Workstation Drawer Mode</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-all"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="px-5 py-2 border-b border-slate-100 flex items-center gap-1 bg-slate-50/50">
        {['edit', 'activity'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === tab
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {tab === 'edit' ? 'Edit Ticket' : 'Activity Log'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'edit' ? (
          <div className="p-5 space-y-4">
            {/* Title & Description Fields */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Ticket Title *
              </label>
              <input
                type="text"
                value={task.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:border-slate-400 focus:bg-white"
                placeholder="Ticket title..."
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1 block">
                Description
              </label>
              <textarea
                rows={3}
                value={task.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-slate-50/50 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
                placeholder="Add detailed description..."
              />
            </div>

            {/* Status Section */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Status</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handleStatusChange(opt.key)}
                    className={`px-3 py-2 rounded-xl border transition-all text-left ${
                      task.status === opt.key
                        ? 'border-slate-800 bg-slate-50 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                      <span className="text-xs">{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Section */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2 block">Priority</label>
              <div className="grid grid-cols-2 gap-2">
                {PRIORITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => handlePriorityChange(opt.key)}
                    className={`px-3 py-2 rounded-xl border transition-all text-left ${
                      task.priority === opt.key
                        ? 'border-slate-800 bg-slate-50 text-slate-900 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${opt.className}`}>
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee & List */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <FiUser size={10} /> Assignee
                </label>
                <select
                  value={task.assigneeId}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none"
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  <FiTag size={10} /> List
                </label>
                <select
                  value={task.listId}
                  onChange={(e) => handleListChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>{l.space} / {l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <FiCalendar size={10} /> Due Date
              </label>
              <input
                type="date"
                value={task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ''}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50/50 focus:outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="p-5">
            <h4 className="text-xs font-bold text-slate-800 mb-4">Activity Timeline</h4>
            <div className="space-y-4">
              {activityHistory.map((item, idx) => (
                <div key={idx} className="flex gap-3 relative pb-3 border-b border-slate-100 last:border-none">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800">{item.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="px-5 pb-5 pt-3 border-t border-slate-100 mt-4">
          <div className="flex items-center gap-2 mb-3">
            <FiMessageSquare size={13} className="text-slate-500" />
            <h4 className="text-xs font-bold text-slate-800">Comments ({task.comments.length})</h4>
          </div>
          
          <div className="space-y-2.5 mb-3 max-h-36 overflow-y-auto">
            {task.comments.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No comments yet.</p>
            ) : (
              task.comments.map((comment) => (
                <div key={comment.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold text-slate-700">{getMember(comment.authorId)?.name || 'User'}</span>
                    <span className="text-[9px] text-slate-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addComment();
                }
              }}
              placeholder="Write a comment..."
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50 focus:outline-none focus:border-slate-400"
            />
            <button
              onClick={addComment}
              disabled={!commentText.trim()}
              className="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold disabled:opacity-50 hover:bg-slate-800 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}