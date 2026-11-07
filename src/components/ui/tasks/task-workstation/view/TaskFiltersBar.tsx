'use client';

import React from 'react';
import { FiSearch, FiColumns, FiList, FiCalendar, FiClock, FiPlus, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { TaskPriority, TaskStatus, ModuleType, TEAM_MEMBERS } from '../data/taskHelpers';

type ViewMode = 'kanban' | 'table' | 'calendar' | 'timeline';
type SortKey = 'none' | 'priority' | 'dueDate' | 'createdAt' | 'title';

interface TaskFiltersBarProps {
  search: string;
  setSearch: (val: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filterStatus: TaskStatus | 'ALL';
  setFilterStatus: (v: TaskStatus | 'ALL') => void;
  filterPriority: TaskPriority | 'ALL';
  setFilterPriority: (v: TaskPriority | 'ALL') => void;
  filterModule: ModuleType | 'ALL';
  setFilterModule: (v: ModuleType | 'ALL') => void;
  filterAssignee: string;
  setFilterAssignee: (v: string) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (v: 'asc' | 'desc') => void;
  onOpenCreateModal: () => void;
  totalCards: number;
}

const VIEW_TABS: { key: ViewMode; label: string; icon: React.ElementType }[] = [
  { key: 'kanban', label: 'Kanban', icon: FiColumns },
  { key: 'table', label: 'Table', icon: FiList },
  { key: 'calendar', label: 'Calendar', icon: FiCalendar },
  { key: 'timeline', label: 'Timeline', icon: FiClock },
];

const selectClass =
  'rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-slate-400 focus:bg-white transition cursor-pointer';

export default function TaskFiltersBar({
  search, setSearch,
  viewMode, setViewMode,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  filterModule, setFilterModule,
  filterAssignee, setFilterAssignee,
  sortKey, setSortKey,
  sortOrder, setSortOrder,
  onOpenCreateModal,
  totalCards,
}: TaskFiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      {/* Row 1: Title + View Tabs + Create Button */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-slate-800">Task Workstation</h1>
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
            {totalCards} total
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Switcher */}
          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
            {VIEW_TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  viewMode === key
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={13} /> {label}
              </button>
            ))}
          </div>

          {/* Create Task Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
          >
            <FiPlus size={14} /> Create Task
          </button>
        </div>
      </div>

      {/* Row 2: Filters + Search + Sort */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-44 rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')}
          className={selectClass}
        >
          <option value="ALL">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="IN_REVIEW">In Review</option>
          <option value="DONE">Done</option>
        </select>

        {/* Priority Filter */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'ALL')}
          className={selectClass}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>

        {/* Module Filter */}
        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value as ModuleType | 'ALL')}
          className={selectClass}
        >
          <option value="ALL">All Modules</option>
          <option value="GENERAL">General</option>
          <option value="SALES">Sales</option>
          <option value="MARKETING">Marketing</option>
          <option value="SUPPORT">Support</option>
        </select>

        {/* Assignee Filter */}
        <select
          value={filterAssignee}
          onChange={(e) => setFilterAssignee(e.target.value)}
          className={selectClass}
        >
          <option value="ALL">All Assignees</option>
          {TEAM_MEMBERS.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>

        {/* Sort Key */}
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className={selectClass}
        >
          <option value="none">Sort By</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
          <option value="createdAt">Created</option>
          <option value="title">Title</option>
        </select>

        {/* Sort Order Toggle */}
        {sortKey !== 'none' && (
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? <FiArrowUp size={13} /> : <FiArrowDown size={13} />}
            {sortOrder === 'asc' ? 'Asc' : 'Desc'}
          </button>
        )}
      </div>
    </div>
  );
}
