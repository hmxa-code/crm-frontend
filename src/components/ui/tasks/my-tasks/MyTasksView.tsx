'use client';

import React, { useState, useMemo } from 'react';
import {
  FiCalendar,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiAlertTriangle,
  FiSearch,
  FiFilter,
  FiColumns,
  FiList,
  FiGrid,
  FiCheckSquare,
  FiSquare,
  FiTag,
  FiFolder,
  FiTrendingUp,
  FiChevronRight,
} from 'react-icons/fi';
import {
  Task,
  TaskStatus,
  TaskPriority,
  STATUS_COLUMNS,
  getPriorityConfig,
  getStatusConfig,
} from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';
import { useTaskSuiteStore } from '@/src/components/ui/tasks/data/taskSuiteStore';
import Link from 'next/link';

interface MyTasksViewProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
}

type ViewMode = 'cards' | 'table' | 'kanban';

export default function MyTasksView({
  tasks,
  onStatusChange,
  onDelete,
  onView,
  onEdit,
}: MyTasksViewProps) {
  const { toggleSubtask, projects } = useTaskSuiteStore();

  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'status' | 'title'>('dueDate');

  // Currently assigned tasks to Muhammad Hamza ('u1') or unassigned
  const myAllTasks = useMemo(() => {
    return tasks.filter((t) => t.assigneeId === 'u1' || !t.assigneeId);
  }, [tasks]);

  // Filtered & Sorted
  const filteredTasks = useMemo(() => {
    return myAllTasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description || '').toLowerCase().includes(search.toLowerCase()) ||
          (task.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
          (task.projectName || '').toLowerCase().includes(search.toLowerCase());

        const matchesStatus = selectedStatus === 'ALL' || task.status === selectedStatus;
        const matchesPriority = selectedPriority === 'ALL' || task.priority === selectedPriority;
        const matchesProject = selectedProjectId === 'ALL' || task.projectId === selectedProjectId;

        return matchesSearch && matchesStatus && matchesPriority && matchesProject;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        }
        if (sortBy === 'priority') {
          const weights: Record<TaskPriority, number> = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
          return weights[a.priority] - weights[b.priority];
        }
        if (sortBy === 'status') {
          const sWeights: Record<TaskStatus, number> = { TODO: 0, IN_PROGRESS: 1, IN_REVIEW: 2, DONE: 3 };
          return sWeights[a.status] - sWeights[b.status];
        }
        return a.title.localeCompare(b.title);
      });
  }, [myAllTasks, search, selectedStatus, selectedPriority, selectedProjectId, sortBy]);

  // Metrics
  const totalCount = myAllTasks.length;
  const inProgressCount = myAllTasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const urgentCount = myAllTasks.filter((t) => t.priority === 'URGENT' || t.priority === 'HIGH').length;
  const doneCount = myAllTasks.filter((t) => t.status === 'DONE').length;
  const completionRate = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <FiCheckCircle className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                My Assigned Tasks
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Personal operational workstation queue • Muhammad Hamza (Lead Architect)
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/tasks/time-tracker"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-xs"
          >
            <FiClock className="h-4 w-4 text-sky-400" />
            Launch Project Time Tracker
          </Link>
          <Link
            href="/tasks/task-workstation"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FiColumns className="h-4 w-4" />
            Full Workstation Board
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Work Queue</span>
            <span className="rounded-xl bg-slate-50 p-2 text-slate-600 border border-slate-100">
              <FiList className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Assigned across projects</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">In Active Progress</span>
            <span className="rounded-xl bg-amber-50 p-2 text-amber-600 border border-amber-100">
              <FiClock className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-amber-600">{inProgressCount}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">Currently underway</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">Urgent SLA Items</span>
            <span className="rounded-xl bg-red-50 p-2 text-red-600 border border-red-100">
              <FiAlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-red-600">{urgentCount}</div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">High priority tickets</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Completion Score</span>
            <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 border border-emerald-100">
              <FiTrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 text-3xl font-black text-emerald-600">{completionRate}%</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-600">{doneCount}/{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Enterprise Filter & View Switcher Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assigned tasks, tags, projects..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <FiFolder className="text-slate-400" size={14} />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Projects</option>
              {projects.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <FiFilter className="text-slate-400" size={14} />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Statuses</option>
              {STATUS_COLUMNS.map((col) => (
                <option key={col.key} value={col.key}>
                  {col.label}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-xs font-semibold text-slate-700 outline-none transition focus:border-sky-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        {/* View Switcher & Sorting */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>

          <div className="flex rounded-xl border border-slate-200 bg-slate-50/70 p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Card Grid View"
            >
              <FiGrid size={13} /> Cards
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                viewMode === 'table'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Data Table View"
            >
              <FiList size={13} /> Table
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-semibold transition ${
                viewMode === 'kanban'
                  ? 'bg-white font-bold text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Personal Kanban Board"
            >
              <FiColumns size={13} /> Kanban
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. CARDS VIEW (ENTERPRISE FOCUS CARDS) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'cards' && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => {
            const priorityCfg = getPriorityConfig(task.priority);
            const statusCfg = getStatusConfig(task.status);
            const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
            const totalSubtasks = (task.subtasks || []).length;
            const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

            return (
              <div
                key={task._id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  {/* Top Bar: Module / Project / Priority */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                        {task.moduleType}
                      </span>
                      {task.projectName && (
                        <span className="rounded-md bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700 border border-sky-100">
                          {task.projectName}
                        </span>
                      )}
                    </div>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityCfg.className}`}
                    >
                      {priorityCfg.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => onView(task)}
                    className="mt-3 cursor-pointer text-sm font-bold text-slate-900 transition hover:text-sky-600 leading-snug"
                  >
                    {task.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {task.description || 'No description provided.'}
                  </p>

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded bg-slate-50 border border-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                        >
                          <FiTag size={9} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Subtasks Progress & Interactive Checklist */}
                  {totalSubtasks > 0 && (
                    <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <FiCheckSquare size={13} className="text-sky-500" />
                          Checklist
                        </span>
                        <span className="font-bold text-slate-700">
                          {completedSubtasks}/{totalSubtasks} ({subtaskProgress}%)
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                        <div
                          className="h-full rounded-full bg-sky-500 transition-all duration-300"
                          style={{ width: `${subtaskProgress}%` }}
                        />
                      </div>
                      <div className="mt-2.5 space-y-1.5">
                        {task.subtasks!.slice(0, 3).map((sub) => (
                          <div
                            key={sub.id}
                            onClick={() => toggleSubtask(task._id, sub.id)}
                            className="flex cursor-pointer items-center gap-2 text-[11px] text-slate-700 hover:text-sky-600"
                          >
                            {sub.completed ? (
                              <FiCheckSquare className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <FiSquare className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                            )}
                            <span className={sub.completed ? 'line-through text-slate-400' : 'font-medium'}>
                              {sub.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-5 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                        <FiCalendar size={12} />
                        {task.dueDate ? task.dueDate.split('T')[0] : 'No deadline'}
                      </span>
                      {task.estimatedHours && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                          {task.estimatedHours}h est
                        </span>
                      )}
                    </div>

                    {/* Status Dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-100"
                    >
                      {STATUS_COLUMNS.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Card Actions Bar (View, Edit, Delete) */}
                  <div className="mt-3 flex items-center justify-between border-t border-slate-100/80 pt-2">
                    <button
                      onClick={() => onView(task)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-sky-600 transition"
                    >
                      View Details <FiChevronRight size={12} />
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onView(task)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
                        title="View Details"
                      >
                        <FiEye size={13} />
                      </button>
                      <button
                        onClick={() => onEdit(task)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 transition"
                        title="Edit Task"
                      >
                        <FiEdit2 size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(task._id)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 transition"
                        title="Delete Task"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. TABLE VIEW (ENTERPRISE DATA MATRIX) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'table' && filteredTasks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/70 font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3">Task Details</th>
                  <th className="px-5 py-3">Project</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Checklist</th>
                  <th className="px-5 py-3">Due Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => {
                  const priorityCfg = getPriorityConfig(task.priority);
                  const statusCfg = getStatusConfig(task.status);
                  const completedSubtasks = (task.subtasks || []).filter((s) => s.completed).length;
                  const totalSubtasks = (task.subtasks || []).length;

                  return (
                    <tr key={task._id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 hover:text-sky-600 cursor-pointer text-xs" onClick={() => onView(task)}>
                          {task.title}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-400 line-clamp-1">
                          {task.description || 'No description provided'}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {task.projectName || 'General'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${priorityCfg.className}`}>
                          {priorityCfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <select
                          value={task.status}
                          onChange={(e) => onStatusChange(task._id, e.target.value as TaskStatus)}
                          className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 outline-none cursor-pointer hover:border-slate-300"
                        >
                          {STATUS_COLUMNS.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3.5">
                        {totalSubtasks > 0 ? (
                          <span className="font-mono text-[11px] font-semibold text-slate-700">
                            {completedSubtasks}/{totalSubtasks}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                        {task.dueDate ? task.dueDate.split('T')[0] : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onView(task)}
                            className="rounded-md p-1.5 text-slate-400 hover:text-slate-800"
                            title="View"
                          >
                            <FiEye size={13} />
                          </button>
                          <button
                            onClick={() => onEdit(task)}
                            className="rounded-md p-1.5 text-slate-400 hover:text-amber-600"
                            title="Edit"
                          >
                            <FiEdit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDelete(task._id)}
                            className="rounded-md p-1.5 text-slate-400 hover:text-red-500"
                            title="Delete"
                          >
                            <FiTrash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. KANBAN VIEW (PERSONAL STATUS LANES) */}
      {/* ------------------------------------------------------------- */}
      {viewMode === 'kanban' && filteredTasks.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATUS_COLUMNS.map((column) => {
            const laneTasks = filteredTasks.filter((t) => t.status === column.key);

            return (
              <div
                key={column.key}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 shadow-xs min-h-[500px]"
              >
                {/* Lane Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`} />
                    <h3 className="text-xs font-bold text-slate-800">{column.label}</h3>
                  </div>
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black text-slate-600 border border-slate-200">
                    {laneTasks.length}
                  </span>
                </div>

                {/* Task Cards in Lane */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {laneTasks.map((task) => {
                    const priorityCfg = getPriorityConfig(task.priority);

                    return (
                      <div
                        key={task._id}
                        className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 truncate max-w-[110px]">
                            {task.projectName || task.moduleType}
                          </span>
                          <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${priorityCfg.className}`}>
                            {priorityCfg.label}
                          </span>
                        </div>

                        <h4
                          onClick={() => onView(task)}
                          className="mt-2 text-xs font-bold text-slate-900 cursor-pointer hover:text-sky-600 leading-snug line-clamp-2"
                        >
                          {task.title}
                        </h4>

                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1 font-mono">
                            <FiCalendar size={11} />
                            {task.dueDate ? task.dueDate.split('T')[0] : '—'}
                          </span>
                          <button
                            onClick={() => onView(task)}
                            className="rounded p-1 text-slate-400 hover:text-slate-800"
                            title="View"
                          >
                            <FiEye size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {laneTasks.length === 0 && (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                      No tasks in this lane
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
