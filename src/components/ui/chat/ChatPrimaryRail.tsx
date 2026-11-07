'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FiMessageSquare,
  FiHash,
  FiClock,
  FiFolder,
  FiUsers,
  FiCalendar,
  FiFileText,
  FiSettings,
  FiArrowLeft,
  FiCheckSquare,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

interface ChatPrimaryRailProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  primaryColor: string;
  setShowTaskPanel: (show: boolean) => void;
}

export default function ChatPrimaryRail({
  activeTab,
  setActiveTab,
  primaryColor,
  setShowTaskPanel,
}: ChatPrimaryRailProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  const navItems = [
    { id: 'chats', label: 'Chats', icon: FiMessageSquare },
    { id: 'channels', label: 'Channels', icon: FiHash },
    { id: 'history', label: 'History', icon: FiClock },
    { id: 'files', label: 'Files', icon: FiFolder },
    { id: 'org', label: 'Org', icon: FiUsers },
    { id: 'calendar', label: 'Calendar', icon: FiCalendar },
    { id: 'notes', label: 'Notes', icon: FiFileText },
  ];

  return (
    <aside
      className={`bg-slate-50 border-r border-slate-200/80 flex flex-col items-center py-4 justify-between shrink-0 select-none z-30 transition-all duration-300 ease-in-out ${
        isMinimized ? 'w-20' : 'w-24'
      }`}
    >
      <div className="flex flex-col items-center gap-3 w-full px-2">
        {/* Back to Main CRM */}
        <Link
          href="/dashboard"
          title="Back to CRM"
          className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-2xs border border-slate-200/60"
        >
          <FiArrowLeft size={18} />
        </Link>

        <div className="w-10 h-[1px] bg-slate-200 my-1" />

        {/* Navigation Items */}
        <div className="flex flex-col gap-1.5 w-full items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                className={`group relative w-full py-2.5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'shadow-sm font-bold'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200/60'
                }`}
              >
                <Icon size={18} className="transition-transform group-hover:scale-110" />
                <span className="text-[10px] tracking-tight font-medium scale-95">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Controls & Minimize Toggle */}
      <div className="flex flex-col items-center gap-2.5 w-full px-2">
        <button
          onClick={() => setShowTaskPanel(true)}
          title="ClickUp Task Workstation"
          className="w-11 h-11 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200/80 flex items-center justify-center transition-all shadow-2xs"
        >
          <FiCheckSquare size={18} />
        </button>

        <button
          title="Settings"
          className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-900 hover:text-white text-slate-500 border border-slate-200/60 flex items-center justify-center transition-all shadow-2xs"
        >
          <FiSettings size={18} />
        </button>

        <div className="w-10 h-[1px] bg-slate-200 my-0.5" />

        {/* Maximize / Minimize Toggle Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          title={isMinimized ? 'Expand Sidebar' : 'Collapse Sidebar'}
          className="w-11 h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80 flex items-center justify-center transition-all shadow-2xs"
        >
          {isMinimized ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}