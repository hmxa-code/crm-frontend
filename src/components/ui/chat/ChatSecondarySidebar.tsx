'use client';

import React, { useState } from 'react';
import { BsPinAngle } from 'react-icons/bs';
import {
  FiSearch,
  FiPlus,
  FiLock,
  FiHash,
  FiMessageSquare,
  FiAtSign,
  FiUsers,
  FiVolumeX,
  FiChevronDown,
  FiChevronRight,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';


interface ChatSecondarySidebarProps {
  primaryColor: string;
  channels: Array<{ id: string; name: string; isPrivate: boolean }>;
  users: Array<{ id: string; name: string; avatarBg: string; status: string }>;
  activeSessions: Array<{ id: string; targetId: string }>;
  activeSessionId: string;
  openTarget: (type: 'channel' | 'dm', targetId: string) => void;
  setIsCreateChannelOpen: (open: boolean) => void;
}

export default function ChatSecondarySidebar({
  primaryColor,
  channels,
  users,
  activeSessions,
  activeSessionId,
  openTarget,
  setIsCreateChannelOpen,
}: ChatSecondarySidebarProps) {
  const [filterType, setFilterType] = useState<'all' | 'dms' | 'mentions' | 'channels'>('all');
  const [openSections, setOpenSections] = useState({
    pins: true,
    conversations: true,
    threads: true,
  });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none z-20">
      {/* Top Search Input */}
      <div className="p-3 border-b border-slate-100">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs text-slate-600 focus-within:bg-white focus-within:border-slate-300 transition">
          <FiSearch size={13} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
          />
        </div>

        {/* Zoho Filter Icons Bar (All, DMs, Mentions, Channels) */}
        <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-slate-100 text-slate-500">
          <button
            onClick={() => setFilterType('all')}
            className={`p-1.5 rounded-lg text-xs transition ${
              filterType === 'all' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'
            }`}
            title="All Chats"
          >
            <FiMessageSquare size={13} />
          </button>
          <button
            onClick={() => setFilterType('dms')}
            className={`p-1.5 rounded-lg text-xs transition ${
              filterType === 'dms' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'
            }`}
            title="Direct Messages"
          >
            <FiUsers size={13} />
          </button>
          <button
            onClick={() => setFilterType('mentions')}
            className={`p-1.5 rounded-lg text-xs transition ${
              filterType === 'mentions' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'
            }`}
            title="Mentions"
          >
            <FiAtSign size={13} />
          </button>
          <button
            onClick={() => setFilterType('channels')}
            className={`p-1.5 rounded-lg text-xs transition ${
              filterType === 'channels' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'
            }`}
            title="Channels"
          >
            <FiHash size={13} />
          </button>
        </div>
      </div>

      {/* Accordion Lists */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3 scrollbar-thin text-xs">
        {/* MY PINS */}
        <div>
          <button
            onClick={() => toggleSection('pins')}
            className="w-full flex items-center justify-between py-1 px-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800"
          >
            <div className="flex items-center gap-1.5">
              {openSections.pins ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
              <span>My Pins</span>
            </div>
          </button>

          {openSections.pins && (
            <div className="space-y-0.5 mt-1 pl-2">
              <button
                onClick={() => openTarget('channel', 'c-general')}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium truncate"
              >
                <BsPinAngle size={11} className="text-amber-500 shrink-0" />
                <span className="truncate"># Developers</span>
              </button>
            </div>
          )}
        </div>

        {/* CONVERSATIONS (DMs & Channels) */}
        <div>
          <div className="flex items-center justify-between py-1 px-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <button
              onClick={() => toggleSection('conversations')}
              className="flex items-center gap-1.5 hover:text-slate-800"
            >
              {openSections.conversations ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
              <span>Conversations</span>
            </button>
            <button onClick={() => setIsCreateChannelOpen(true)} className="hover:text-slate-900">
              <FiPlus size={13} />
            </button>
          </div>

          {openSections.conversations && (
            <div className="space-y-0.5 mt-1">
              {/* Channels */}
              {channels.map((ch) => {
                const isActive = activeSessions.find((s) => s.id === activeSessionId)?.targetId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => openTarget('channel', ch.id)}
                    style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium transition ${
                      isActive ? 'font-bold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {ch.isPrivate ? <FiLock size={12} /> : <FiHash size={12} />}
                    <span className="truncate">{ch.name}</span>
                  </button>
                );
              })}

              {/* Direct Messages */}
              {users.filter(u => u.id !== 'u-me').map((user) => {
                const isActive = activeSessions.find((s) => s.id === activeSessionId)?.targetId === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => openTarget('dm', user.id)}
                    style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                    className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium transition ${
                      isActive ? 'font-bold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/50">
                      <img
                        src={getDiceBearAvatar(user.name)}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="truncate">{user.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* THREADS */}
        <div>
          <button
            onClick={() => toggleSection('threads')}
            className="w-full flex items-center justify-between py-1 px-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800"
          >
            <div className="flex items-center gap-1.5">
              {openSections.threads ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
              <span>Threads</span>
            </div>
          </button>

          {openSections.threads && (
            <div className="space-y-0.5 mt-1 pl-2">
              <button className="w-full text-left px-2 py-1 rounded-lg text-slate-600 hover:bg-slate-100 truncate">
                # general — Q4 CRM Targets
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}