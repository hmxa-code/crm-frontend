'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiArrowLeft, FiColumns, FiCheckSquare, FiPlus, FiMessageSquare, FiHash, FiClock, FiFolder, FiUsers, FiCalendar, FiFileText, FiSettings, FiSearch, FiAtSign, FiVolumeX, FiChevronDown, FiChevronRight, FiLock } from 'react-icons/fi';
import { getCRMSettings, type CRMSettings, DEFAULT_CRM_SETTINGS } from '@/src/utils/crmSettings';
import { useTaskStore } from '@/src/components/ui/tasks/data/taskStore';
import ChatWindowSession from './ChatWindowSession';
import ChatTaskDrawer from './ChatTaskDrawer';
import { BsPinAngle } from 'react-icons/bs';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import type { ChatMessage } from './ChatView';


export default function ChatWorkspaceView() {
  const [crmSettings, setCRMSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);
  const { tasks } = useTaskStore();

  useEffect(() => {
    const update = () => setCRMSettings(getCRMSettings());
    update();
    window.addEventListener('crm-settings-updated', update);
    return () => window.removeEventListener('crm-settings-updated', update);
  }, []);

  const primaryColor = crmSettings.primaryColor || '#00aaff';

  const [activeRailTab, setActiveRailTab] = useState('chats');
  const [secondaryFilter, setSecondaryFilter] = useState<'all' | 'dms' | 'mentions' | 'channels'>('all');
  const [openSections, setOpenSections] = useState({ pins: true, conversations: true, threads: true });

  const toggleSection = (key: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const [channels] = useState([
    { id: 'c-general', name: 'general', isPrivate: false },
    { id: 'c-sales', name: 'sales-hotline', isPrivate: false },
    { id: 'c-tasks', name: 'task-dispatches', isPrivate: false },
  ]);

  const [users] = useState([
    { id: 'u-me', name: 'You (Demo Admin)', avatarBg: 'bg-emerald-600', status: 'online', title: 'Admin', role: 'Super Admin', email: 'admin@wholcure.com' },
    { id: 'u-1', name: 'Ali Raza', avatarBg: 'bg-blue-600', status: 'online', title: 'Sales Executive', role: 'Member', email: 'ali@wholcure.com' },
    { id: 'u-2', name: 'Sarah Khan', avatarBg: 'bg-purple-600', status: 'busy', title: 'Marketing Head', role: 'Member', email: 'sarah@wholcure.com' },
  ]);

  const [sessions, setSessions] = useState([
    { id: 'session-1', type: 'channel', targetId: 'c-general', title: 'general', subtitle: 'Company-wide announcements' },
    { id: 'session-2', type: 'channel', targetId: 'c-tasks', title: 'task-dispatches', subtitle: 'Live task synchronization stream' },
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm-1', senderId: 'u-1', channelId: 'c-general', content: 'Assalam-o-Alaikum team! Q4 CRM targets locked hain.', timestamp: '09:30 AM' },
  ]);

  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<any>(null);
  const [threadMessage, setThreadMessage] = useState<any>(null);

  const openTarget = (type: 'channel' | 'dm', targetId: string) => {
    const exists = sessions.find((s) => s.targetId === targetId && s.type === type);
    if (exists) {
      setActiveSessionId(exists.id);
      return;
    }
    const title = type === 'channel' ? channels.find((c) => c.id === targetId)?.name : users.find((u) => u.id === targetId)?.name;
    const newSession = { id: `session-${Date.now()}`, type, targetId, title: title || 'Chat', subtitle: 'Active Session' };
    setSessions([...sessions, newSession]);
    setActiveSessionId(newSession.id);
  };

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
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fa] text-slate-800 font-sans antialiased select-none">
      
      {/* 1. Primary Slim Icon Rail (Zoho Style) */}
      <aside className="w-16 bg-slate-100 border-r border-slate-200/90 flex flex-col items-center py-3 justify-between shrink-0 z-30">
        <div className="flex flex-col items-center gap-2.5 w-full">
          <Link href="/dashboard" title="Back to CRM" className="w-10 h-10 rounded-xl bg-white hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition shadow-2xs">
            <FiArrowLeft size={17} />
          </Link>
          <div className="w-8 h-[1px] bg-slate-200 my-0.5" />
          
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRailTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveRailTab(item.id)}
                style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
                  isActive ? 'shadow-xs font-bold' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                <Icon size={16} />
                <span className="text-[9px] scale-90">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
          <button onClick={() => setShowTaskPanel(true)} title="ClickUp Task Workstation" className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center transition shadow-2xs">
            <FiCheckSquare size={17} />
          </button>
          <button title="Settings" className="w-10 h-10 rounded-xl hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition">
            <FiSettings size={17} />
          </button>
        </div>
      </aside>

      {/* 2. Secondary Navigation Sidebar (Zoho Style Sub-Menu) */}
      <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none z-20">
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs text-slate-600 focus-within:bg-white focus-within:border-slate-300 transition">
            <FiSearch size={13} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs text-slate-800 placeholder-slate-400 w-full"
            />
          </div>

          <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-slate-100 text-slate-500">
            <button onClick={() => setSecondaryFilter('all')} className={`p-1.5 rounded-lg text-xs transition ${secondaryFilter === 'all' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'}`} title="All Chats">
              <FiMessageSquare size={13} />
            </button>
            <button onClick={() => setSecondaryFilter('dms')} className={`p-1.5 rounded-lg text-xs transition ${secondaryFilter === 'dms' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'}`} title="Direct Messages">
              <FiUsers size={13} />
            </button>
            <button onClick={() => setSecondaryFilter('mentions')} className={`p-1.5 rounded-lg text-xs transition ${secondaryFilter === 'mentions' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'}`} title="Mentions">
              <FiAtSign size={13} />
            </button>
            <button onClick={() => setSecondaryFilter('channels')} className={`p-1.5 rounded-lg text-xs transition ${secondaryFilter === 'channels' ? 'bg-slate-200 text-slate-900 font-bold' : 'hover:bg-slate-100'}`} title="Channels">
              <FiHash size={13} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-3 scrollbar-thin text-xs">
          {/* MY PINS */}
          <div>
            <button onClick={() => toggleSection('pins')} className="w-full flex items-center justify-between py-1 px-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-800">
              <div className="flex items-center gap-1.5">
                {openSections.pins ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                <span>My Pins</span>
              </div>
            </button>
            {openSections.pins && (
              <div className="space-y-0.5 mt-1 pl-2">
                <button onClick={() => openTarget('channel', 'c-general')} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 font-medium truncate">
                  <BsPinAngle size={11} className="text-amber-500 shrink-0" />
                  <span className="truncate"># Developers</span>
                </button>
              </div>
            )}
          </div>

          {/* CONVERSATIONS */}
          <div>
            <div className="flex items-center justify-between py-1 px-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <button onClick={() => toggleSection('conversations')} className="flex items-center gap-1.5 hover:text-slate-800">
                {openSections.conversations ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
                <span>Conversations</span>
              </button>
              <button onClick={() => {}} className="hover:text-slate-900">
                <FiPlus size={13} />
              </button>
            </div>
            {openSections.conversations && (
              <div className="space-y-0.5 mt-1">
                {channels.map((ch) => {
                  const isActive = sessions.find((s) => s.id === activeSessionId)?.targetId === ch.id;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => openTarget('channel', ch.id)}
                      style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium transition ${isActive ? 'font-bold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'}`}
                    >
                      {ch.isPrivate ? <FiLock size={12} /> : <FiHash size={12} />}
                      <span className="truncate">{ch.name}</span>
                    </button>
                  );
                })}

                {users.filter(u => u.id !== 'u-me').map((user) => {
                  const isActive = sessions.find((s) => s.id === activeSessionId)?.targetId === user.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => openTarget('dm', user.id)}
                      style={isActive ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl font-medium transition ${isActive ? 'font-bold shadow-2xs' : 'text-slate-700 hover:bg-slate-100'}`}
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
        </div>
      </aside>

      {/* 3. Main Multi-Window Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#f4f7fa] overflow-hidden">
        <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                style={activeSessionId === s.id ? { backgroundColor: `${primaryColor}15`, color: primaryColor } : undefined}
                className="px-3 py-1 rounded-xl text-xs font-bold cursor-pointer border"
              >
                #{s.title}
              </div>
            ))}
          </div>
          <button onClick={() => setShowTaskPanel(!showTaskPanel)} className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
            ClickUp Tasks ({tasks.length})
          </button>
        </div>

        <div className="flex-1 flex overflow-x-auto divide-x divide-slate-200 bg-white">
          {sessions.map((session) => (
            <ChatWindowSession
              key={session.id}
              session={session}
              isFocused={activeSessionId === session.id}
              primaryColor={primaryColor}
              messages={messages}
              getUser={(id) => users.find((u) => u.id === id) || users[0]}
              onSendMessage={(sessionId, text) => {
                setMessages([...messages, { id: `m-${Date.now()}`, senderId: 'u-me', channelId: session.type === 'channel' ? session.targetId : undefined, recipientId: session.type === 'dm' ? session.targetId : undefined, content: text, timestamp: 'Now' }]);
              }}
              onCloseSession={(id, e) => {
                e.stopPropagation();
                if (sessions.length > 1) setSessions(sessions.filter((s) => s.id !== id));
              }}
              onOpenTaskPanel={() => setShowTaskPanel(true)}
              onOpenTaskModal={() => setShowTaskPanel(true)}
              setThreadMessage={setThreadMessage}
              setProfileUser={setProfileUser}
            />
          ))}
        </div>
      </main>

      {/* Connected Task Drawer */}
      <ChatTaskDrawer
        isOpen={showTaskPanel}
        onClose={() => setShowTaskPanel(false)}
        onShareTaskInChat={(title, id, priority, assignee) => {
          setMessages([...messages, { id: `m-${Date.now()}`, senderId: 'u-me', channelId: 'c-general', content: `📎 Shared Task: ${title}`, timestamp: 'Now', taskRef: { id, title, priority, status: 'TODO', assigneeName: assignee, dueDate: 'Today' } }]);
        }}
        onOpenCreateTaskModal={() => setShowTaskPanel(true)}
      />
    </div>
  );
}