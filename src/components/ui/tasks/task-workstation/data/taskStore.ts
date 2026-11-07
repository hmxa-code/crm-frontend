'use client';

import { useTaskSuiteStore } from '../../data/taskSuiteStore';
import { Task, TaskStatus } from './taskHelpers';

/**
 * useTaskStore maintains backwards compatibility for components
 * directly importing from task-workstation/data/taskStore.
 * It delegates to the unified useTaskSuiteStore.
 */
export const useTaskStore = () => {
  const tasks = useTaskSuiteStore((s) => s.tasks);
  const addTask = useTaskSuiteStore((s) => s.addTask);
  const updateTask = useTaskSuiteStore((s) => s.updateTask);
  const updateTaskStatus = useTaskSuiteStore((s) => s.updateTaskStatus);
  const deleteTask = useTaskSuiteStore((s) => s.deleteTask);
  const resetToSeed = useTaskSuiteStore((s) => s.resetToSeed);

  return {
    tasks,
    addTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    resetToSeed,
  };
};
