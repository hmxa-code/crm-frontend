'use client';

import React, { useState, useRef } from 'react';
import {
  FiPlus, FiSearch, FiFilter, FiGrid, FiList, FiX, FiEdit2, FiTrash2,
  FiChevronDown, FiChevronRight, FiCalendar, FiTag, FiUser, FiCheck,
  FiMessageSquare, FiClock, FiAlertCircle, FiCheckCircle, FiFlag,
  FiMoreHorizontal, FiPaperclip, FiSend,
} from 'react-icons/fi';

// ─── Interfaces ────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  role: string;
}

interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
type TaskPriority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
type ModuleType = 'SALES' | 'MARKETING' | 'SUPPORT' | 'GENERAL';

interface WorkspaceTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  listId: string;
  moduleType: ModuleType;
  tags: string[];
  subtasks: SubTask[];
  comments: Comment[];
  dueDate: string;
}

interface TaskList {
  id: string;
  name: string;
  space: string;
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const TEAM: TeamMember[] = [
  { id: 'u-sara',   name: 'Sara Khan',     initials: 'SK', avatarBg: 'bg-blue-500',    role: 'Sales Lead'   },
  { id: 'u-ahmed',  name: 'Ahmed Malik',   initials: 'AM', avatarBg: 'bg-emerald-500', role: 'Ops Manager'  },
  { id: 'u-fatima', name: 'Fatima Noor',   initials: 'FN', avatarBg: 'bg-purple-500',  role: 'Marketing'    },
  { id: 'u-hassan', name: 'Hassan Raza',   initials: 'HR', avatarBg: 'bg-amber-500',   role: 'QA/Support'   },
  { id: 'u-bilal',  name: 'Bilal Sheikh',  initials: 'BS', avatarBg: 'bg-indigo-500',  role: 'Engineering'  },
  { id: 'u-ali',    name: 'Ali Raza',      initials: 'AR', avatarBg: 'bg-rose-500',    role: 'Sales Exec'   },
];

const LISTS: TaskList[] = [
  { id: 'list-followups',  name: 'Follow-ups',     space: 'CRM Ops'   },
  { id: 'list-deals',      name: 'Deal Execution', space: 'Sales'     },
  { id: 'list-campaigns',  name: 'Campaigns',      space: 'Marketing' },
  { id: 'list-sprint',     name: 'Sprint Board',   space: 'Product'   },
];

const INITIAL_TASKS: WorkspaceTask[] = [
  {
    id: 't-1', title: 'Nexus Hospital Enterprise Proposal', status: 'IN_PROGRESS', priority: 'HIGH',
    assigneeId: 'u-sara', listId: 'list-deals', moduleType: 'SALES', tags: ['proposal', 'client'],
    description: 'Email revised pricing deck and confirm demo slot',
    subtasks: [{ id: 'st-1', title: 'Attach PDF', done: true }, { id: 'st-2', title: 'CC legal', done: false }],
    comments: [], dueDate: '2024-12-15',
  },
  {
    id: 't-2', title: 'WhatsApp Lead Qualification - Karachi', status: 'TODO', priority: 'URGENT',
    assigneeId: 'u-sara', listId: 'list-followups', moduleType: 'SALES', tags: ['inbound', 'hot'],
    description: 'Confirm specialty bed count and competitor CRM usage',
    subtasks: [], comments: [], dueDate: '2024-12-10',
  },
  {
    id: 't-3', title: 'Ramadan Drip Campaign QA', status: 'IN_REVIEW', priority: 'MEDIUM',
    assigneeId: 'u-fatima', listId: 'list-campaigns', moduleType: 'MARKETING', tags: ['drip', 'qa'],
    description: 'Check delay steps merge tags and unsubscribe footer',
    subtasks: [{ id: 'st-3', title: 'Preview mobile', done: true }],
    comments: [], dueDate: '2024-12-18',
  },
  {
    id: 't-4', title: 'Task Board Empty State Fix', status: 'TODO', priority: 'LOW',
    assigneeId: 'u-bilal', listId: 'list-sprint', moduleType: 'GENERAL', tags: ['ui'],
    description: 'Empty columns should show how to create first card',
    subtasks: [], comments: [], dueDate: '2024-12-25',
  },
  {
    id: 't-5', title: 'City Pharmacy Account Onboarding', status: 'IN_PROGRESS', priority: 'HIGH',
    assigneeId: 'u-ahmed', listId: 'list-followups', moduleType: 'GENERAL', tags: ['onboarding'],
    description: 'Create parent company and 4 branches assign account owner',
    subtasks: [{ id: 'st-4', title: 'Import CSV', done: false }],
    comments: [], dueDate: '2024-12-12',
  },
  {
    id: 't-6', title: 'Support Macro Video Walkthrough', status: 'DONE', priority: 'MEDIUM',
    assigneeId: 'u-hassan', listId: 'list-sprint', moduleType: 'SUPPORT', tags: ['enablement'],
    description: '5 minute loom covering tickets tasks and calendar handoff',
    subtasks: [],
    comments: [{ id: 'c-1', authorId: 'u-ahmed', text: 'Uploaded to enablement folder', createdAt: '2024-12-08T14:00:00Z' }],
    dueDate: '2024-12-08',
  },
  {
    id: 't-7', title: 'Q4 Opportunity Forecast Deck', status: 'TODO', priority: 'HIGH',
    assigneeId: 'u-sara', listId: 'list-deals', moduleType: 'SALES', tags: ['forecast'],
    description: 'Pull pipeline by stage and highlight stalled deals older than 21 days',
    subtasks: [], comments: [], dueDate: '2024-12-20',
  },
  {
    id: 't-8', title: 'DHA Plot 22 Inspection Response', status: 'IN_REVIEW', priority: 'URGENT',
    assigneeId: 'u-hassan', listId: 'list-followups', moduleType: 'GENERAL', tags: ['real-estate'],
    description: 'Share contractor ETA and attach permit scan',
    subtasks: [], comments: [], dueDate: '2024-12-11',
  },
  {
    id: 't-9', title: 'Product Launch Social Media Posts', status: 'TODO', priority: 'MEDIUM',
    assigneeId: 'u-fatima', listId: 'list-campaigns', moduleType: 'MARKETING', tags: ['social', 'launch'],
    description: 'LinkedIn and Instagram carousel legal must sign off captions',
    subtasks: [], comments: [], dueDate: '2024-12-22',
  },
  {
    id: 't-10', title: 'Close Stale Tickets 14+ Days', status: 'DONE', priority: 'LOW',
    assigneeId: 'u-hassan', listId: 'list-sprint', moduleType: 'SUPPORT', tags: ['hygiene'],
    description: 'Bulk review and resolve or re-assign with comment',
    subtasks: [], comments: [], dueDate: '2024-12-05',
  },
  {
    id: 't-11', title: 'Al-Shifa Health Custom Proposal', status: 'TODO', priority: 'HIGH',
    assigneeId: 'u-ali', listId: 'list-deals', moduleType: 'SALES', tags: ['enterprise', 'proposal'],
    description: 'Prepare custom enterprise proposal for Al-Shifa Health $45k deal',
    subtasks: [], comments: [], dueDate: '2024-12-17',
  },
  {
    id: 't-12', title: 'CRM Dashboard Mobile Responsive Fix', status: 'IN_PROGRESS', priority: 'MEDIUM',
    assigneeId: 'u-bilal', listId: 'list-sprint', moduleType: 'GENERAL', tags: ['mobile', 'ui'],
    description: 'Fix responsive breakpoints for dashboard widgets on mobile',
    subtasks: [
      { id: 'st-5', title: 'Test on iPhone', done: false },
      { id: 'st-6', title: 'Test on Android', done: true },
    ],
    comments: [], dueDate: '2024-12-19',
  },
];

// ─── Style Maps ────────────────────────────────────────────────────────────────

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  URGENT: 'bg-red-50 text-red-700 border-red-200',
  HIGH:   'bg-orange-50 text-orange-700 border-orange-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
  LOW:    'bg-slate-100 text-slate-600 border-slate-200',
};

const PRIORITY_DOT: Record<TaskPriority, string> = {
  URGENT: 'bg-red-500',
  HIGH:   'bg-orange-500',
  MEDIUM: 'bg-blue-500',
  LOW:    'bg-slate-400',
};

const COLUMN_STYLES: Record<TaskStatus, { header: string; dot: string; label: string }> = {
  TODO:        { header: 'bg-slate-100 text-slate-700',  dot: 'bg-slate-400',  label: 'To Do'       },
  IN_PROGRESS: { header: 'bg-blue-50 text-blue-700',     dot: 'bg-blue-500',   label: 'In Progress' },
  IN_REVIEW:   { header: 'bg-amber-50 text-amber-700',   dot: 'bg-amber-500',  label: 'In Review'   },
  DONE:        { header: 'bg-green-50 text-green-700',   dot: 'bg-green-500',  label: 'Done'        },
};

const MODULE_STYLES: Record<ModuleType, string> = {
  SALES:     'bg-blue-100 text-blue-700',
  MARKETING: 'bg-purple-100 text-purple-700',
  SUPPORT:   'bg-amber-100 text-amber-700',
  GENERAL:   'bg-slate-100 text-slate-600',
};

const COLUMNS: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getMember(id: string): TeamMember | undefined {
  return TEAM.find(m => m.id === id);
}

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function isOverdue(d: string): boolean {
  return new Date(d) < new Date('2024-12-09');
}

// ─── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ memberId, size = 'sm' }: { memberId: string; size?: 'sm' | 'md' | 'lg' }) {
  const m = getMember(memberId);
  if (!m) return null;
  const sz = size === 'sm' ? 'w-6 h-6 text-xs' : size === 'md' ? 'w-8 h-8 text-sm' : 'w-10 h-10 text-base';
  return (
    <div className={`${sz} ${m.avatarBg} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
      {m.initials}
    </div>
  );
}

// ─── Priority Badge ────────────────────────────────────────────────────────────

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium border ${PRIORITY_STYLES[priority]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT[priority]}`} />
      {priority}
    </span>
  );
}

// ─── Module Badge ──────────────────────────────────────────────────────────────

function ModuleBadge({ module }: { module: ModuleType }) {
  return (
    <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${MODULE_STYLES[module]}`}>
      {module}
    </span>
  );
}

// ─── Task Card ─────────────────────────────────────────────────────────────────

function TaskCard({
  task, onSelect, onDragStart,
}: {
  task: WorkspaceTask;
  onSelect: (t: WorkspaceTask) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const doneSubs = task.subtasks.filter(s => s.done).length;
  const overdue = isOverdue(task.dueDate);

  return (
    <div
      draggable
      onDragStart={e => onDragStart(e, task.id)}
      onClick={() => onSelect(task)}
      className="bg-white rounded-xl border border-slate-200 p-3 cursor-pointer hover:shadow-md hover:border-slate-300 transition-all group select-none"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <PriorityBadge priority={task.priority} />
        <ModuleBadge module={task.moduleType} />
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-slate-800 mb-1 leading-snug group-hover:text-blue-700 transition-colors">
        {task.title}
      </p>

      {/* Description */}
      <p className="text-xs text-slate-500 mb-2 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {task.tags.map(tag => (
            <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Avatar memberId={task.assigneeId} size="sm" />
          {task.subtasks.length > 0 && (
            <span className="text-xs text-slate-400">
              {doneSubs}/{task.subtasks.length}
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              <FiMessageSquare size={10} /> {task.comments.length}
            </span>
          )}
        </div>
        <span className={`text-xs flex items-center gap-1 ${overdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
          <FiCalendar size={10} />
          {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}

// ─── Empty Column ──────────────────────────────────────────────────────────────

function EmptyColumn({ status, onAdd }: { status: TaskStatus; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <FiCheckCircle className="text-slate-400" size={18} />
      </div>
      <p className="text-sm font-medium text-slate-500 mb-1">No tasks here</p>
      <p className="text-xs text-slate-400 mb-3">Drag a card here or create a new task</p>
      <button
        onClick={onAdd}
        className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
      >
        <FiPlus size={12} /> Add first task
      </button>
    </div>
  );
}

// ─── Task Modal (Add / Edit) ───────────────────────────────────────────────────

function TaskModal({
  task,
  onClose,
  onSave,
}: {
  task: Partial<WorkspaceTask> | null;
  onClose: () => void;
  onSave: (t: WorkspaceTask) => void;
}) {
  const isEdit = !!task?.id;
  const [form, setForm] = useState<Partial<WorkspaceTask>>({
    title: '', description: '', status: 'TODO', priority: 'MEDIUM',
    assigneeId: 'u-sara', listId: 'list-sprint', moduleType: 'GENERAL',
    tags: [], subtasks: [], comments: [], dueDate: '2024-12-25',
    ...task,
  });

  function handle(field: keyof WorkspaceTask, val: unknown) {
    setForm(f => ({ ...f, [field]: val }));
  }

  function submit() {
    if (!form.title?.trim()) return;
    onSave({
      id: form.id ?? `t-${Date.now()}`,
      title: form.title!,
      description: form.description ?? '',
      status: form.status as TaskStatus,
      priority: form.priority as TaskPriority,
      assigneeId: form.assigneeId!,
      listId: form.listId!,
      moduleType: form.moduleType as ModuleType,
      tags: form.tags ?? [],
      subtasks: form.subtasks ?? [],
      comments: form.comments ?? [],
      dueDate: form.dueDate!,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">{isEdit ? 'Edit Task' : 'Create Task'}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Title</label>
            <input
              value={form.title}
              onChange={e => handle('title', e.target.value)}
              placeholder="Task title..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Description</label>
            <textarea
              value={form.description}
              onChange={e => handle('description', e.target.value)}
              rows={3}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Status</label>
              <select
                value={form.status}
                onChange={e => handle('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {COLUMNS.map(s => <option key={s} value={s}>{COLUMN_STYLES[s].label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Priority</label>
              <select
                value={form.priority}
                onChange={e => handle('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Assignee</label>
              <select
                value={form.assigneeId}
                onChange={e => handle('assigneeId', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Module</label>
              <select
                value={form.moduleType}
                onChange={e => handle('moduleType', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {(['SALES', 'MARKETING', 'SUPPORT', 'GENERAL'] as ModuleType[]).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">List</label>
              <select
                value={form.listId}
                onChange={e => handle('listId', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {LISTS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1 block">Due Date</label>
              <input
                type="date"
                value={form.dueDate}
                onChange={e => handle('dueDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isEdit ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Task Detail Drawer ────────────────────────────────────────────────────────

function TaskDrawer({
  task,
  onClose,
  onUpdate,
  onDelete,
}: {
  task: WorkspaceTask;
  onClose: () => void;
  onUpdate: (t: WorkspaceTask) => void;
  onDelete: (id: string) => void;
}) {
  const [commentText, setCommentText] = useState('');
  const member = getMember(task.assigneeId);
  const list = LISTS.find(l => l.id === task.listId);

  function toggleSubtask(stId: string) {
    onUpdate({
      ...task,
      subtasks: task.subtasks.map(s => s.id === stId ? { ...s, done: !s.done } : s),
    });
  }

  function addComment() {
    if (!commentText.trim()) return;
    onUpdate({
      ...task,
      comments: [...task.comments, {
        id: `c-${Date.now()}`,
        authorId: 'u-sara',
        text: commentText,
        createdAt: new Date().toISOString(),
      }],
    });
    setCommentText('');
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1" />
      <div
        className="w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <ModuleBadge module={task.moduleType} />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <FiTrash2 size={15} />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 transition-colors">
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Title */}
          <h2 className="text-base font-bold text-slate-900 leading-snug">{task.title}</h2>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <p className="text-slate-400 uppercase tracking-wide font-medium">Assignee</p>
              <div className="flex items-center gap-1.5">
                <Avatar memberId={task.assigneeId} size="sm" />
                <span className="text-slate-700 font-medium">{member?.name}</span>
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-slate-400 uppercase tracking-wide font-medium">Due Date</p>
              <p className={`font-medium flex items-center gap-1 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-slate-700'}`}>
                <FiCalendar size={11} /> {formatDate(task.dueDate)}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-slate-400 uppercase tracking-wide font-medium">List</p>
              <p className="text-slate-700 font-medium">{list?.name ?? '—'}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-slate-400 uppercase tracking-wide font-medium">Space</p>
              <p className="text-slate-700 font-medium">{list?.space ?? '—'}</p>
            </div>
          </div>

          {/* Status selector */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Status</p>
            <div className="flex flex-wrap gap-2">
              {COLUMNS.map(s => (
                <button
                  key={s}
                  onClick={() => onUpdate({ ...task, status: s })}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${
                    task.status === s
                      ? `${COLUMN_STYLES[s].header} border-current shadow-sm`
                      : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {COLUMN_STYLES[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Description</p>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg px-3 py-2">
              {task.description || <span className="text-slate-400 italic">No description</span>}
            </p>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs">#{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">
                Subtasks ({task.subtasks.filter(s => s.done).length}/{task.subtasks.length})
              </p>
              <div className="space-y-1.5">
                {task.subtasks.map(st => (
                  <button
                    key={st.id}
                    onClick={() => toggleSubtask(st.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-left transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                      st.done ? 'bg-blue-500 border-blue-500' : 'border-slate-300'
                    }`}>
                      {st.done && <FiCheck size={10} className="text-white" />}
                    </div>
                    <span className={`text-sm ${st.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {st.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">
              Comments ({task.comments.length})
            </p>
            <div className="space-y-3 mb-3">
              {task.comments.map(c => {
                const author = getMember(c.authorId);
                return (
                  <div key={c.id} className="flex gap-2.5">
                    <Avatar memberId={c.authorId} size="sm" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-slate-700">{author?.name}</span>
                        <span className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addComment()}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={addComment} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <FiSend size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className="text-xs font-medium text-current opacity-70 mb-1">{label}</p>
      <p className="text-2xl font-bold text-current">{value}</p>
      {sub && <p className="text-xs text-current opacity-60 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── List View ─────────────────────────────────────────────────────────────────

function ListView({ tasks, onSelect }: { tasks: WorkspaceTask[]; onSelect: (t: WorkspaceTask) => void }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
            <th className="px-4 py-2.5 text-left font-medium rounded-tl-lg">Task</th>
            <th className="px-4 py-2.5 text-left font-medium">Status</th>
            <th className="px-4 py-2.5 text-left font-medium">Priority</th>
            <th className="px-4 py-2.5 text-left font-medium">Module</th>
            <th className="px-4 py-2.5 text-left font-medium">Assignee</th>
            <th className="px-4 py-2.5 text-left font-medium rounded-tr-lg">Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map(task => (
            <tr
              key={task.id}
              onClick={() => onSelect(task)}
              className="hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{task.title}</p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{task.description}</p>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${COLUMN_STYLES[task.status].header}`}>
                  {COLUMN_STYLES[task.status].label}
                </span>
              </td>
              <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
              <td className="px-4 py-3"><ModuleBadge module={task.moduleType} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Avatar memberId={task.assigneeId} size="sm" />
                  <span className="text-slate-600 text-xs">{getMember(task.assigneeId)?.name}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                  {formatDate(task.dueDate)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TaskBoard() {
  const [tasks, setTasks] = useState<WorkspaceTask[]>(INITIAL_TASKS);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');
  const [selectedTask, setSelectedTask] = useState<WorkspaceTask | null>(null);
  const [modalTask, setModalTask] = useState<Partial<WorkspaceTask> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const dragId = useRef<string | null>(null);

  // Filtered tasks
  const filtered = tasks.filter(t => {
    const q = search.toLowerCase();
    if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    if (filterAssignee !== 'ALL' && t.assigneeId !== filterAssignee) return false;
    return true;
  });

  // Stats
  const open = tasks.filter(t => t.status !== 'DONE').length;
  const urgent = tasks.filter(t => t.priority === 'URGENT').length;
  const inProg = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const donePct = Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100);

  // DnD
  function handleDragStart(e: React.DragEvent, id: string) {
    dragId.current = id;
    e.dataTransfer.effectAllowed = 'move';
  }
  function handleDrop(e: React.DragEvent, status: TaskStatus) {
    e.preventDefault();
    if (!dragId.current) return;
    setTasks(prev => prev.map(t => t.id === dragId.current ? { ...t, status } : t));
    dragId.current = null;
  }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); }

  function saveTask(t: WorkspaceTask) {
    setTasks(prev => {
      const idx = prev.findIndex(x => x.id === t.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = t;
        return next;
      }
      return [...prev, t];
    });
    setShowModal(false);
    setModalTask(null);
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    setSelectedTask(null);
  }

  function openAdd(status: TaskStatus = 'TODO') {
    setModalTask({ status });
    setShowModal(true);
  }

  function openEdit(task: WorkspaceTask) {
    setModalTask(task);
    setShowModal(true);
    setSelectedTask(null);
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 pt-5 pb-1">
        <StatCard label="Open Tasks"   value={open}    sub="Active items"   color="bg-slate-100 text-slate-700 border-slate-200"   />
        <StatCard label="Urgent"       value={urgent}  sub="Need attention"  color="bg-red-50 text-red-700 border-red-200"          />
        <StatCard label="In Progress"  value={inProg}  sub="Being worked on" color="bg-blue-50 text-blue-700 border-blue-200"       />
        <StatCard label="Done"         value={`${donePct}%`} sub="Completion rate" color="bg-green-50 text-green-700 border-green-200" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 px-5 py-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority filter */}
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as TaskPriority | 'ALL')}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Priorities</option>
          {(['URGENT', 'HIGH', 'MEDIUM', 'LOW'] as TaskPriority[]).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {/* Assignee filter */}
        <select
          value={filterAssignee}
          onChange={e => setFilterAssignee(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Assignees</option>
          {TEAM.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
          <button
            onClick={() => setView('kanban')}
            className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${view === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FiGrid size={14} /> Kanban
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${view === 'list' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FiList size={14} /> List
          </button>
        </div>

        {/* Add task */}
        <button
          onClick={() => openAdd()}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <FiPlus size={15} /> New Task
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-5 pb-5">
        {view === 'list' ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <ListView tasks={filtered} onSelect={setSelectedTask} />
          </div>
        ) : (
          <div className="flex gap-4 min-w-max pb-2">
            {COLUMNS.map(status => {
              const col = COLUMN_STYLES[status];
              const colTasks = filtered.filter(t => t.status === status);
              return (
                <div
                  key={status}
                  className="w-72 flex flex-col rounded-xl border border-slate-200 bg-white overflow-hidden"
                  onDrop={e => handleDrop(e, status)}
                  onDragOver={handleDragOver}
                >
                  {/* Column header */}
                  <div className={`flex items-center justify-between px-3 py-2.5 ${col.header}`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                      <span className="text-sm font-semibold">{col.label}</span>
                      <span className="text-xs bg-white/60 rounded-full px-1.5 py-0.5 font-medium">
                        {colTasks.length}
                      </span>
                    </div>
                    <button
                      onClick={() => openAdd(status)}
                      className="p-1 rounded hover:bg-white/50 transition-colors"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-2.5 space-y-2 overflow-y-auto min-h-[200px]">
                    {colTasks.length === 0 ? (
                      <EmptyColumn status={status} onAdd={() => openAdd(status)} />
                    ) : (
                      colTasks.map(task => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onSelect={setSelectedTask}
                          onDragStart={handleDragStart}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <TaskModal
          task={modalTask}
          onClose={() => { setShowModal(false); setModalTask(null); }}
          onSave={saveTask}
        />
      )}
      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={t => { setTasks(prev => prev.map(x => x.id === t.id ? t : x)); setSelectedTask(t); }}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
