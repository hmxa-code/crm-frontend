'use client';

import React, { useState, useMemo } from 'react';
import TaskFiltersBar from './TaskFiltersBar';
import TaskKanbanBoard from './TaskKanbanBoard';
import TaskListView from './TaskListView';
import TaskCalendarView from './TaskCalendarView';
import TaskTimelineView from './TaskTimelineView';
import TaskFormDrawer from '../modals/TaskFormDrawer';
import TaskDetailDrawer from '../modals/TaskDetailDrawer';
import { useTaskStore } from '../data/taskStore';
import { Task, TaskStatus, TaskPriority, ModuleType } from '../data/taskHelpers';

type SortKey = 'none' | 'priority' | 'dueDate' | 'createdAt' | 'title';

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  URGENT: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export default function TaskWorkspace() {
  const { tasks, updateTaskStatus, deleteTask } = useTaskStore();

  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'calendar' | 'timeline'>('kanban');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'ALL'>('ALL');
  const [filterModule, setFilterModule] = useState<ModuleType | 'ALL'>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');
  const [sortKey, setSortKey] = useState<SortKey>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.moduleType.toLowerCase().includes(search.toLowerCase()) ||
        (t.projectName ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (t.tags ?? []).some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = filterStatus === 'ALL' || t.status === filterStatus;
      const matchPriority = filterPriority === 'ALL' || t.priority === filterPriority;
      const matchModule = filterModule === 'ALL' || t.moduleType === filterModule;
      const matchAssignee = filterAssignee === 'ALL' || t.assigneeId === filterAssignee;
      return matchSearch && matchStatus && matchPriority && matchModule && matchAssignee;
    });

    if (sortKey !== 'none') {
      result = [...result].sort((a, b) => {
        let cmp = 0;
        if (sortKey === 'priority') {
          cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        } else if (sortKey === 'dueDate') {
          cmp = (a.dueDate ?? '').localeCompare(b.dueDate ?? '');
        } else if (sortKey === 'createdAt') {
          cmp = (a.createdAt ?? '').localeCompare(b.createdAt ?? '');
        } else if (sortKey === 'title') {
          cmp = a.title.localeCompare(b.title);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
    }

    return result;
  }, [tasks, search, filterStatus, filterPriority, filterModule, filterAssignee, sortKey, sortOrder]);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  const handleOpenView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-5 p-2 md:p-4 bg-slate-50/30 min-h-screen">
      <TaskFiltersBar
        search={search}
        setSearch={setSearch}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenCreateModal={handleOpenCreate}
        totalCards={filteredTasks.length}
      />

      {viewMode === 'kanban' && (
        <TaskKanbanBoard
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
        />
      )}

      {viewMode === 'table' && (
        <TaskListView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onDelete={deleteTask}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
        />
      )}

      {viewMode === 'calendar' && (
        <TaskCalendarView
          tasks={filteredTasks}
          onStatusChange={handleStatusChange}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
        />
      )}

      {viewMode === 'timeline' && (
        <TaskTimelineView
          tasks={filteredTasks}
          onView={handleOpenView}
          onEdit={handleOpenEdit}
        />
      )}

      <TaskFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        taskToEdit={selectedTask}
      />

      <TaskDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onEdit={handleOpenEdit}
        onDelete={deleteTask}
      />
    </div>
  );
}