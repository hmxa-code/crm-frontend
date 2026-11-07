'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiMessageSquare, FiColumns, FiZap, FiUsers, FiRefreshCw } from 'react-icons/fi';
import TaskBoard from './TaskBoard';
import ChatHub from './ChatHub';

// ─── Types ─────────────────────────────────────────────────────────────────────

type TabId = 'tasks' | 'chat' | 'split';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
}

// ─── Tabs config ───────────────────────────────────────────────────────────────

const TABS: Tab[] = [
  { id: 'tasks', label: 'Task Board',  icon: <FiGrid size={16} />,         shortcut: 'T' },
  { id: 'chat',  label: 'Chat Hub',   icon: <FiMessageSquare size={16} />, shortcut: 'C' },
  { id: 'split', label: 'Split View', icon: <FiColumns size={16} />,       shortcut: 'S' },
];

// ─── Animation variants ────────────────────────────────────────────────────────

const variants = {
  enter: { opacity: 0, y: 10 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

// ─── Main Component ────────────────────────────────────────────────────────────

export default function UnifiedWorkspace() {
  const [activeTab, setActiveTab] = useState<TabId>('tasks');
  const [lastSync, setLastSync] = useState<string>('');

  // Sync time display
  useEffect(() => {
    function updateSync() {
      setLastSync(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }
    updateSync();
    const interval = setInterval(updateSync, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Don't fire if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if (e.key === 'T' || e.key === 't') setActiveTab('tasks');
      if (e.key === 'C' || e.key === 'c') setActiveTab('chat');
      if (e.key === 'S' || e.key === 's') setActiveTab('split');
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 px-6 pt-6 pb-0 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <FiZap className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Wholcure Workspace</h1>
              <p className="text-blue-200 text-xs mt-0.5">Unified task management &amp; team communication</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {/* Online users avatars */}
            <div className="flex -space-x-2">
              {['bg-emerald-400', 'bg-blue-400', 'bg-purple-400', 'bg-rose-400'].map((bg, i) => (
                <div key={i} className={`w-7 h-7 ${bg} rounded-full border-2 border-blue-600`} />
              ))}
            </div>
            <span className="text-blue-200 text-xs ml-1">+2 online</span>
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-center gap-1">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-slate-50 text-blue-700 shadow-sm'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
                <kbd className={`ml-1 text-xs rounded px-1 py-0.5 font-mono ${
                  isActive ? 'bg-blue-100 text-blue-600' : 'bg-white/10 text-blue-300'
                }`}>
                  {tab.shortcut}
                </kbd>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="h-full"
          >
            {activeTab === 'tasks' && (
              <div className="h-full overflow-auto">
                <TaskBoard />
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="min-h-[calc(100vh-200px)] p-4">
                <div className="h-[calc(100vh-230px)] min-h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                  <ChatHub />
                </div>
              </div>
            )}

            {activeTab === 'split' && (
              <div className="flex flex-row h-full overflow-hidden gap-0">
                {/* Task Board panel */}
                <div className="w-[55%] flex-shrink-0 overflow-auto border-r border-slate-200">
                  <TaskBoard />
                </div>
                {/* Chat Hub panel */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="h-full">
                    <ChatHub />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Status Bar ── */}
      <div className="flex items-center justify-between px-5 py-2 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <FiGrid size={11} />
            <span>12 tasks active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUsers size={11} />
            <span>6 team members online</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <FiRefreshCw size={10} />
          <span>Last sync: {lastSync}</span>
        </div>
      </div>
    </div>
  );
}
