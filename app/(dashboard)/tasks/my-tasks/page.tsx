'use client';

import React, { useState } from 'react';
import MyTasksView from '../../../../src/components/ui/tasks/my-tasks/MyTasksView';
import { useTaskStore } from '@/src/components/ui/tasks/task-workstation/data/taskStore';
import TaskDetailDrawer from '@/src/components/ui/tasks/task-workstation/modals/TaskDetailDrawer';
import TaskFormDrawer from '@/src/components/ui/tasks/task-workstation/modals/TaskFormDrawer';
import { Task, TaskStatus } from '@/src/components/ui/tasks/task-workstation/data/taskHelpers';

export default function MyTasksPage() {
  const { tasks, updateTaskStatus, deleteTask } = useTaskStore();
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleOpenView = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(false);
    setIsFormOpen(true);
  };

  return (
    <div className="p-3 sm:p-5 lg:p-6 bg-slate-50/40 min-h-screen overflow-x-hidden">
      <MyTasksView
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={deleteTask}
        onView={handleOpenView}
        onEdit={handleOpenEdit}
      />

      <TaskDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onEdit={handleOpenEdit}
        onDelete={deleteTask}
      />

      <TaskFormDrawer
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        taskToEdit={selectedTask}
      />
    </div>
  );
}