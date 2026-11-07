'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCalendar, FiClock, FiTag, FiCheckSquare, FiPlus, FiTrash2, FiLink, FiPaperclip } from 'react-icons/fi';
import { Task, TaskStatus, TaskPriority, ModuleType, TEAM_MEMBERS, STATUS_COLUMNS } from '../data/taskHelpers';
import { useTaskStore } from '../data/taskStore';

interface TaskFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const PRIORITY_OPTS: { value: TaskPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

const MODULE_OPTS: { value: ModuleType; label: string }[] = [
  { value: 'GENERAL', label: 'General' },
  { value: 'SALES', label: 'Sales' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'SUPPORT', label: 'Support' },
];

export default function TaskFormDrawer({ isOpen, onClose, taskToEdit }: TaskFormDrawerProps) {
  const { addTask, updateTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [moduleType, setModuleType] = useState<ModuleType>('GENERAL');
  const [assigneeId, setAssigneeId] = useState('u1');
  const [dueDate, setDueDate] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);

  // Links State
  const [linkInput, setLinkInput] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description ?? '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      setModuleType(taskToEdit.moduleType);
      setAssigneeId(taskToEdit.assigneeId ?? 'u1');
      setDueDate(taskToEdit.dueDate ? taskToEdit.dueDate.split('T')[0] : '');
      setEstimatedHours(taskToEdit.estimatedHours ? String(taskToEdit.estimatedHours) : '');
      setTags(taskToEdit.tags ?? []);
      setSubtasks(taskToEdit.subtasks ?? []);
      setAttachments(taskToEdit.attachments ?? []);
    } else {
      setTitle(''); setDescription(''); setStatus('TODO'); setPriority('MEDIUM');
      setModuleType('GENERAL'); setAssigneeId('u1'); setDueDate('');
      setEstimatedHours(''); setTags([]); setSubtasks([]); setAttachments([]);
    }
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput(''); }
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      setSubtasks([...subtasks, { id: `st-${Date.now()}`, title: subtaskInput.trim(), completed: false }]);
      setSubtaskInput('');
    }
  };

  const handleAddLink = () => {
    const l = linkInput.trim();
    if (l && !attachments.includes(l)) {
      setAttachments([...attachments, l]);
      setLinkInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title,
      description,
      status,
      priority,
      moduleType,
      assigneeId,
      tags,
      subtasks,
      attachments,
      estimatedHours: estimatedHours ? Number(estimatedHours) : undefined,
      dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    };

    if (taskToEdit) {
      updateTask(taskToEdit._id, payload);
    } else {
      addTask({
        _id: `task-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  const completedCount = subtasks.filter((s) => s.completed).length;
  const progressPct = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  const labelClass = 'block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1';
  const inputClass = 'w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition';

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {taskToEdit ? 'Update task details' : 'Fill in the details to create a task'}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} id="task-form" className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className={labelClass}>Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add context, scope, or notes..."
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={inputClass}>
                {STATUS_COLUMNS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={inputClass}>
                {PRIORITY_OPTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee & Module */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Assignee</label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)} className={inputClass}>
                {TEAM_MEMBERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Module</label>
              <select value={moduleType} onChange={(e) => setModuleType(e.target.value as ModuleType)} className={inputClass}>
                {MODULE_OPTS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          </div>

          {/* Due Date & Est Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><FiCalendar size={10} /> Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={`${labelClass} flex items-center gap-1`}><FiClock size={10} /> Est. Hours</label>
              <input type="number" min={0} placeholder="e.g. 8" value={estimatedHours} onChange={(e) => setEstimatedHours(e.target.value)} className={inputClass} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><FiTag size={10} /> Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Type tag & press Enter"
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddTag} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">Add</button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    #{t}
                    <button type="button" onClick={() => setTags(tags.filter((x) => x !== t))} className="text-slate-400 hover:text-red-500 transition">
                      <FiX size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks */}
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className={`${labelClass} flex items-center gap-1 mb-0`}><FiCheckSquare size={10} /> Subtasks</label>
              {subtasks.length > 0 && <span className="text-[10px] font-bold text-slate-400">{completedCount}/{subtasks.length} ({progressPct}%)</span>}
            </div>
            {subtasks.length > 0 && (
              <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-slate-800 transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            )}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                placeholder="Add subtask step..."
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddSubtask} className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50 transition">
                <FiPlus size={14} />
              </button>
            </div>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => setSubtasks(subtasks.map((s) => s.id === st.id ? { ...s, completed: !s.completed } : s))}
                      className="rounded border-slate-300"
                    />
                    <span className={st.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>{st.title}</span>
                  </label>
                  <button type="button" onClick={() => setSubtasks(subtasks.filter((s) => s.id !== st.id))} className="text-slate-300 hover:text-red-500 transition">
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Links & Reference URLs */}
          <div>
            <label className={`${labelClass} flex items-center gap-1`}><FiLink size={10} /> Links & Reference URLs</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddLink(); } }}
                placeholder="Paste URL or document link..."
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddLink} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">Attach</button>
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((att, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-1.5 text-xs">
                    <span className="flex items-center gap-1.5 text-blue-600 font-medium truncate flex-1">
                      <FiPaperclip size={11} />
                      <a href={att} target="_blank" rel="noreferrer" className="hover:underline truncate">{att}</a>
                    </span>
                    <button type="button" onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-red-500 transition ml-2">
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-100 px-6 py-4 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition">
            Cancel
          </button>
          <button type="submit" form="task-form" className="rounded-lg bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm">
            {taskToEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}