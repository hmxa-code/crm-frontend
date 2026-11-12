'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FiCheckSquare,
  FiX,
  FiPlus,
  FiExternalLink,
  FiClock,
} from 'react-icons/fi';
import { useTaskStore, taskStore } from '@/src/components/ui/tasks/data/taskStore';
import TaskDetailDrawer from './TaskDetailDrawer';
import { type WorkspaceTask } from '@/src/components/ui/tasks/data/taskStore';

interface ChatTaskDrawerProps {
  isOpen: boolean;
  primaryColor?: string;
  onClose: () => void;
  onShareTaskInChat: (taskTitle: string, taskId: string, priority: string, assignee: string) => void;
  onOpenCreateTaskModal: () => void;
}

export default function ChatTaskDrawer({
  isOpen,
  primaryColor = '#0f172a',
  onClose,
  onShareTaskInChat,
  onOpenCreateTaskModal,
}: ChatTaskDrawerProps) {
  const router = useRouter();
  const { tasks } = useTaskStore();
  const [filter, setFilter] = useState<string>('ALL');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) || null;

  const handleTaskClick = (task: WorkspaceTask) => {
    setSelectedTaskId(selectedTaskId === task.id ? null : task.id);
  };

  const handleCloseDetailDrawer = () => {
    setSelectedTaskId(null);
  };

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  const urgentCount = tasks.filter((t) => t.priority === 'URGENT').length;
  const inProgressCount = tasks.filter((t) => t.status === 'IN_PROGRESS').length;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden"
        onClick={onClose}
      />
      <aside className="fixed inset-y-0 right-0 md:static w-[88vw] max-w-[380px] md:w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 z-40 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white shadow-2xs">
              <FiCheckSquare size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900">Task Management Board</h3>
              <p className="text-[10px] text-slate-500">Live Synced with Task Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Task Summary Badges */}
        <div className="p-3 bg-slate-50/60 border-b border-slate-100 grid grid-cols-3 gap-2 text-center">
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-400 font-semibold block">Total</span>
            <strong className="text-xs text-slate-800">{tasks.length}</strong>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-700 font-semibold block">In Progress</span>
            <strong className="text-xs text-slate-900">{inProgressCount}</strong>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] text-slate-700 font-semibold block">Urgent</span>
            <strong className="text-xs text-slate-900">{urgentCount}</strong>
          </div>
        </div>

        {/* Filters & Quick Add */}
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-1">
            {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                style={filter === st ? { backgroundColor: '#0f172a', color: '#fff' } : undefined}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition ${
                  filter === st ? 'shadow-2xs bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
          <button
            onClick={onOpenCreateTaskModal}
            className="p-1.5 text-slate-900 hover:bg-slate-100 rounded-lg font-bold text-xs flex items-center gap-1"
            title="Create New Task"
          >
            <FiPlus size={14} />
          </button>
        </div>

        {/* Task List Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 scrollbar-thin bg-slate-50/30">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              Is filter me koi task nahi hai.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTaskId === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`p-3 bg-white rounded-xl border transition duration-150 cursor-pointer ${
                    isSelected
                      ? 'border-slate-900 ring-2 ring-slate-900/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{task.title}</h4>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                        task.priority === 'URGENT'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'HIGH'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{task.description}</p>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <FiClock size={11} />
                      <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShareTaskInChat(
                          task.title,
                          task.id,
                          task.priority,
                          task.assigneeId || 'Team'
                        );
                      }}
                      className="font-bold text-slate-900 hover:underline"
                    >
                      Share in Chat
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => router.push('/tasks/workspace')}
            className="text-xs font-bold text-slate-800 hover:text-slate-900 flex items-center gap-1.5"
          >
            <span>Open Full Task Workstation</span>
            <FiExternalLink size={12} />
          </button>
        </div>
      </aside>

      {/* Side-by-side Task Detail & Update Drawer */}
      <TaskDetailDrawer
        isOpen={!!selectedTask}
        task={selectedTask}
        onClose={handleCloseDetailDrawer}
        onSaveUpdate={(patch) => {
          if (selectedTask) {
            taskStore.updateTask(selectedTask.id, patch);
          }
        }}
        primaryColor={primaryColor}
      />
    </>
  );
}