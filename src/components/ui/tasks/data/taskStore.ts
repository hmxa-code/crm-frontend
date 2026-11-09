'use client';

import { useTaskSuiteStore } from './taskSuiteStore';
import {
  Task,
  TaskStatus,
  TaskPriority,
  ModuleType,
  Subtask,
  TaskComment,
  TeamMember,
  TEAM_MEMBERS,
  getMember,
  STATUS_COLUMNS,
  PRIORITY_OPTIONS,
  getPriorityConfig,
  getStatusConfig,
  SEED_TASKS,
} from '../task-workstation/data/taskHelpers';

export type { Task, TaskStatus, TaskPriority, ModuleType, Subtask, TaskComment, TeamMember };

export interface WorkspaceTask extends Omit<Task, '_id'> {
  id: string;
  _id: string;
  listId?: string;
  reporterId?: string;
}

export interface TaskListOption {
  id: string;
  name: string;
  space: string;
}

export const LISTS: TaskListOption[] = [
  { id: 'l1', name: 'CRM Operations', space: 'Sales & Ops' },
  { id: 'l2', name: 'Marketing Funnels', space: 'Growth' },
  { id: 'l3', name: 'Customer Support', space: 'Operations' },
  { id: 'l4', name: 'Product Engineering', space: 'Tech' },
];

export const getList = (id?: string) => LISTS.find((l) => l.id === id) || LISTS[0];

export const STATUS_OPTIONS = STATUS_COLUMNS;
export { TEAM_MEMBERS, getMember, PRIORITY_OPTIONS, getPriorityConfig, getStatusConfig };

// Helper to normalize task objects so both .id and ._id work everywhere
export const normalizeWorkspaceTask = (t: Task): WorkspaceTask => ({
  ...t,
  id: t._id,
  _id: t._id,
  subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
  comments: Array.isArray(t.comments) ? t.comments : [],
  tags: Array.isArray(t.tags) ? t.tags : ['Task'],
  dueDate: t.dueDate || new Date().toISOString(),
  createdAt: t.createdAt || new Date().toISOString(),
  updatedAt: t.updatedAt || new Date().toISOString(),
  listId: t.projectId || (t.moduleType === 'SALES' ? 'l1' : t.moduleType === 'MARKETING' ? 'l2' : t.moduleType === 'SUPPORT' ? 'l3' : 'l4'),
  reporterId: t.assigneeId || 'u1',
});

/**
 * useTaskStore provides reactive access to the unified task suite store
 * with full backwards-compatibility for WorkspaceTask and taskStore.
 */
export const useTaskStore = () => {
  const rawTasks = useTaskSuiteStore((s) => s.tasks);
  const addTaskOriginal = useTaskSuiteStore((s) => s.addTask);
  const updateTaskOriginal = useTaskSuiteStore((s) => s.updateTask);
  const updateTaskStatusOriginal = useTaskSuiteStore((s) => s.updateTaskStatus);
  const deleteTaskOriginal = useTaskSuiteStore((s) => s.deleteTask);
  const resetToSeedOriginal = useTaskSuiteStore((s) => s.resetToSeed);

  const tasks: WorkspaceTask[] = rawTasks.map(normalizeWorkspaceTask);

  const addTask = (task: Partial<WorkspaceTask> | Partial<Task>) => {
    const taskId = (task as any).id || (task as any)._id || `task-${Date.now()}`;
    const newTask: Task = {
      _id: taskId,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      status: task.status || 'TODO',
      priority: task.priority || 'MEDIUM',
      moduleType: task.moduleType || 'GENERAL',
      assigneeId: task.assigneeId || 'u1',
      tags: task.tags || ['Task'],
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      dueDate: task.dueDate || new Date().toISOString(),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTaskOriginal(newTask);
  };

  const updateTask = (taskId: string, patch: Partial<WorkspaceTask> | Partial<Task>) => {
    updateTaskOriginal(taskId, patch as Partial<Task>);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    updateTaskStatusOriginal(taskId, status);
  };

  const deleteTask = (taskId: string) => {
    deleteTaskOriginal(taskId);
  };

  return {
    tasks,
    team: TEAM_MEMBERS,
    lists: LISTS,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    resetToSeed: resetToSeedOriginal,
  };
};

/**
 * taskStore imperative singleton for direct state updates outside of hooks
 */
export const taskStore = {
  getState: () => {
    const rawTasks = useTaskSuiteStore.getState().tasks;
    return {
      tasks: rawTasks.map(normalizeWorkspaceTask),
      team: TEAM_MEMBERS,
      lists: LISTS,
    };
  },
  addTask: (task: Partial<WorkspaceTask> | Partial<Task>) => {
    const taskId = (task as any).id || (task as any)._id || `task-${Date.now()}`;
    const newTask: Task = {
      _id: taskId,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      status: task.status || 'TODO',
      priority: task.priority || 'MEDIUM',
      moduleType: task.moduleType || 'GENERAL',
      assigneeId: task.assigneeId || 'u1',
      tags: task.tags || ['Task'],
      subtasks: task.subtasks || [],
      comments: task.comments || [],
      dueDate: task.dueDate || new Date().toISOString(),
      createdAt: task.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    useTaskSuiteStore.getState().addTask(newTask);
  },
  updateTask: (taskId: string, patch: Partial<WorkspaceTask> | Partial<Task>) => {
    useTaskSuiteStore.getState().updateTask(taskId, patch as Partial<Task>);
  },
  updateTaskStatus: (taskId: string, status: TaskStatus) => {
    useTaskSuiteStore.getState().updateTaskStatus(taskId, status);
  },
  deleteTask: (taskId: string) => {
    useTaskSuiteStore.getState().deleteTask(taskId);
  },
  resetToSeed: () => {
    useTaskSuiteStore.getState().resetToSeed();
  },
};

export default useTaskStore;
