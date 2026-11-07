'use client';

import React from 'react';
import {
  FiHash,
  FiLock,
  FiSearch,
  FiPlus,
  FiMessageSquare,
  FiCheckSquare,
  FiCalendar,
  FiInfo,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';


const STATUS_DOT: Record<string, string> = {
  online: 'bg-emerald-500',
  busy: 'bg-rose-500',
  away: 'bg-amber-500',
  offline: 'bg-slate-400',
};

interface ChatSidebarProps {
  primaryColor: string;
  channels: Array<{ id: string; name: string; isPrivate: boolean; unreadCount?: number }>;
  users: Array<{ id: string; name: string; avatarBg: string; status: string; title: string; role: string }>;
  activeSessions: Array<{ id: string; targetId: string; type: string }>;
  activeSessionId: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openTarget: (type: 'channel' | 'dm', targetId: string) => void;
  setShowTaskPanel: (show: boolean) => void;
  setIsCreateChannelOpen: (open: boolean) => void;
  setProfileUser: (user: any) => void;
  taskCount: number;
  calendarCount?: number;
  onOpenCalendar?: () => void;
}

export default function ChatSidebar({
  primaryColor,
  channels,
  users,
  activeSessions,
  activeSessionId,
  searchQuery,
  setSearchQuery,
  openTarget,
  setShowTaskPanel,
  setIsCreateChannelOpen,
  setProfileUser,
  taskCount,
  calendarCount,
  onOpenCalendar,
}: ChatSidebarProps) {
  const q = searchQuery.trim().toLowerCase();
  const filteredChannels = q ? channels.filter((c) => c.name.toLowerCase().includes(q)) : channels;
  const filteredUsers = q ? users.filter((u) => u.id !== 'u-me' && u.name.toLowerCase().includes(q)) : users.filter((u) => u.id !== 'u-me');

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 select-none z-20">
      {/* Workspace Brand Header */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            style={{ backgroundColor: primaryColor }}
            className="w-7 h-7 rounded-lg text-white font-bold text-[11px] flex items-center justify-center shrink-0 shadow-2xs"
          >
            W
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-[13px] text-slate-900 tracking-tight truncate leading-none">Wholcure CRM</h1>
            <span className="text-[10px] text-slate-400 font-medium">Chat Workspace</span>
          </div>
        </div>
        <button
          onClick={() => setIsCreateChannelOpen(true)}
          title="Create New Channel"
          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all shrink-0"
        >
          <FiPlus size={14} />
        </button>
      </div>

      {/* Quick Search */}
      <div className="px-3 pt-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 border border-slate-200/70 text-xs text-slate-600 focus-within:bg-white focus-within:border-slate-300 transition-all">
          <FiSearch size={13} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search channels or team..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
          />
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin">
        <div className="space-y-0.5">
          <button
            onClick={() => openTarget('channel', 'c-general')}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <FiMessageSquare size={14} className="text-slate-400" />
            <span>All Threads</span>
          </button>
          <button
            onClick={() => setShowTaskPanel(true)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <div className="flex items-center gap-2.5">
              <FiCheckSquare size={14} className="text-emerald-600" />
              <span>Task Board</span>
            </div>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
              {taskCount}
            </span>
          </button>
          <button
            onClick={() => onOpenCalendar ? onOpenCalendar() : null}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
          >
            <div className="flex items-center gap-2.5">
              <FiCalendar size={14} className="text-blue-600" />
              <span>Team Calendar</span>
            </div>
            {calendarCount !== undefined && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                {calendarCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-[1px] bg-slate-100 mx-1" />

        {/* Channels Section */}
        <div>
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Channels ({filteredChannels.length})</span>
            <button
              onClick={() => setIsCreateChannelOpen(true)}
              style={{ color: primaryColor }}
              className="hover:opacity-80 transition"
            >
              <FiPlus size={13} />
            </button>
          </div>

          <div className="space-y-0.5 mt-1">
            {filteredChannels.map((channel) => {
              const isOpen = activeSessions.some((s) => s.type === 'channel' && s.targetId === channel.id);
              const isActive = activeSessions.find((s) => s.id === activeSessionId)?.targetId === channel.id;

              return (
                <button
                  key={channel.id}
                  onClick={() => openTarget('channel', channel.id)}
                  style={
                    isActive
                      ? { backgroundColor: primaryColor, color: '#fff' }
                      : isOpen
                      ? { backgroundColor: `${primaryColor}12`, color: primaryColor }
                      : undefined
                  }
                  className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? 'shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {channel.isPrivate ? <FiLock size={12} /> : <FiHash size={13} />}
                    <span className="truncate">{channel.name}</span>
                  </div>
                  {!isActive && !!channel.unreadCount && channel.unreadCount > 0 && (
                    <span
                      style={
                        isOpen
                          ? { backgroundColor: primaryColor, color: '#fff' }
                          : undefined
                      }
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                        isOpen ? '' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Messages Section */}
        <div>
          <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Direct Messages ({filteredUsers.length})</span>
          </div>

          <div className="space-y-0.5 mt-1">
            {filteredUsers.map((user) => {
              const isOpen = activeSessions.some((s) => s.type === 'dm' && s.targetId === user.id);
              const isActive = activeSessions.find((s) => s.id === activeSessionId)?.targetId === user.id;

              return (
                <div
                  key={user.id}
                  style={
                    isActive
                      ? { backgroundColor: primaryColor, color: '#fff' }
                      : isOpen
                      ? { backgroundColor: `${primaryColor}12`, color: primaryColor }
                      : undefined
                  }
                  className={`group/user w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                    isActive ? 'shadow-2xs' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <button
                    onClick={() => openTarget('dm', user.id)}
                    className="flex items-center gap-2.5 truncate flex-1 text-left min-w-0"
                  >
                    <div className="relative shrink-0">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/50">
                        <img
                          src={getDiceBearAvatar(user.name)}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-[1.5px] border-white ${STATUS_DOT[user.status] || 'bg-slate-400'}`} />
                    </div>
                    <span className="truncate font-semibold">{user.name}</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileUser(user);
                    }}
                    className={`p-1 rounded-md opacity-0 group-hover/user:opacity-100 hover:bg-black/10 transition shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                    title="View profile"
                  >
                    <FiInfo size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
