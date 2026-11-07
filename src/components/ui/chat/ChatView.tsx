'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ChatHubHome from './ChatHubHome';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatTaskDrawer from './ChatTaskDrawer';
import ChatThreadDrawer from './ChatThreadDrawer';
import ChatUserProfileModal from './ChatUserProfileModal';
import { useTaskStore } from '@/src/components/ui/tasks/data/taskStore';
import { getCRMSettings, type CRMSettings, DEFAULT_CRM_SETTINGS } from '@/src/utils/crmSettings';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import { FiArrowLeft, FiGrid, FiMessageSquare, FiCheckSquare, FiCalendar, FiPlus, FiX } from 'react-icons/fi';
import CalendarView from '@/src/components/ui/calendar/CalendarView';
import ChatCalendarDrawer from './ChatCalendarDrawer';
import { INITIAL_EVENTS } from '@/src/services/calendar/calendar-service';
import { CalendarEvent } from '@/src/types/index';
import { format } from 'date-fns';


export interface ChatAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface ChatThreadReply {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  channelId?: string;
  recipientId?: string;
  content: string;
  attachments?: ChatAttachment[];
  timestamp: string;
  repliesCount?: number;
  thread?: ChatThreadReply[];
  taskRef?: {
    id: string;
    title: string;
    priority: string;
    status: string;
    assigneeName: string;
    dueDate: string;
  };
  eventRef?: {
    id: string;
    title: string;
    description?: string;
    date: string;
    time: string;
    color: string;
  };
}

export interface ChatSession {
  id: string;
  type: 'channel' | 'dm';
  targetId: string;
  title: string;
  subtitle: string;
}

const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function ChatView() {
  const [crmSettings, setCRMSettings] = useState<CRMSettings>(DEFAULT_CRM_SETTINGS);
  const { tasks } = useTaskStore();

  // 'hub' = Zoho Cliq Remote Work Home View | 'chat' = Multi-Window Workspace | 'calendar' = Full Calendar Workstation
  const [activeTab, setActiveTab] = useState<'hub' | 'chat' | 'calendar'>('hub');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);

  useEffect(() => {
    const update = () => setCRMSettings(getCRMSettings());
    update();
    window.addEventListener('crm-settings-updated', update);
    return () => window.removeEventListener('crm-settings-updated', update);
  }, []);

  const primaryColor = crmSettings.primaryColor || '#00aaff';

  const [channels] = useState([
    { id: 'c-general', name: 'general', isPrivate: false, unreadCount: 0 },
    { id: 'c-sales', name: 'sales-hotline', isPrivate: false, unreadCount: 3 },
    { id: 'c-marketing', name: 'marketing-campaigns', isPrivate: false, unreadCount: 1 },
    { id: 'c-tasks', name: 'task-dispatches', isPrivate: false, unreadCount: 2 },
  ]);

  const [users] = useState([
    { id: 'u-me', name: 'You (Demo Admin)', email: 'admin@wholcure.com', phone: '+92 300 1234567', department: 'Management', role: 'Super Admin', title: 'CRM Lead Administrator', location: 'Karachi, Pakistan', avatarBg: 'bg-emerald-600', status: 'online' as const, statusText: 'Reviewing CRM Deal Pipelines 🚀', activeDeals: '14 Active Opportunities ($180k)' },
    { id: 'u-1', name: 'Ali Raza', email: 'ali.raza@wholcure.com', phone: '+92 321 4455667', department: 'Sales Team', role: 'Sales Executive', title: 'Lead Closing Specialist', location: 'Karachi, Pakistan', avatarBg: 'bg-blue-600', status: 'online' as const, statusText: 'In client meeting • Available on chat', activeDeals: '8 Deals ($95k)' },
    { id: 'u-2', name: 'Sarah Khan', email: 'sarah.k@wholcure.com', phone: '+92 333 7788990', department: 'Growth Marketing', role: 'Marketing Head', title: 'Campaigns & Growth Lead', location: 'Islamabad, Pakistan', avatarBg: 'bg-purple-600', status: 'busy' as const, statusText: 'Launching Q4 Ad Funnel 🎯', activeDeals: '5 Campaigns Active' },
    { id: 'u-3', name: 'Hamza Malik', email: 'hamza.m@wholcure.com', phone: '+92 312 9988771', department: 'Engineering', role: 'Technical Lead', title: 'Full Stack Engineer', location: 'Lahore, Pakistan', avatarBg: 'bg-indigo-600', status: 'online' as const, statusText: 'Deploying CRM Multi-Window Engine 💻', activeDeals: 'Sprint 24 In Progress' },
  ]);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'session-1', type: 'channel', targetId: 'c-general', title: 'general', subtitle: 'Company-wide announcements' },
    { id: 'session-2', type: 'channel', targetId: 'c-tasks', title: 'task-dispatches', subtitle: 'Live task synchronization stream' },
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'm-1', senderId: 'u-1', channelId: 'c-general', content: 'Assalam-o-Alaikum team! Q4 CRM targets locked hain. Workspace pipeline review karein.', timestamp: '09:30 AM', repliesCount: 0 },
  ]);

  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<any>(null);
  const [threadMessage, setThreadMessage] = useState<any>(null);

  const handleShareEventInChat = (event: CalendarEvent) => {
    const formattedDate = format(new Date(event.startDate), 'MMM dd, yyyy');
    const formattedTime = `${format(new Date(event.startDate), 'hh:mm a')} - ${format(new Date(event.endDate), 'hh:mm a')}`;
    const targetChannelId = sessions.find((s) => s.id === activeSessionId && s.type === 'channel')?.targetId || 'c-general';
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        senderId: 'u-me',
        channelId: targetChannelId,
        content: `📅 Shared Calendar Event: ${event.title}`,
        timestamp: nowTime(),
        repliesCount: 0,
        eventRef: {
          id: event.id,
          title: event.title,
          description: event.description,
          date: formattedDate,
          time: formattedTime,
          color: event.color,
        },
      },
    ]);
    setActiveTab('chat');
    setShowCalendarPanel(false);
  };

  const openTarget = (type: 'channel' | 'dm', targetId: string) => {
    setActiveTab('chat');
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

  const closeSession = (sessionId: string) => {
    if (sessions.length <= 1) return;
    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    if (activeSessionId === sessionId) {
      setActiveSessionId(remaining[0]?.id || '');
    }
  };

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f8fafc] text-slate-800 font-sans antialiased select-none">
      {/* 1. Ultra-Left Navigation Rail */}
      <aside className="w-16 bg-white border-r border-slate-200/90 flex flex-col items-center py-4 justify-between shrink-0 z-30">
        <div className="flex flex-col items-center gap-2.5 w-full">
          <Link
            href="/dashboard"
            title="Back to CRM Dashboard"
            className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition shadow-2xs"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div className="w-8 h-[1px] bg-slate-200 my-1" />

          {/* Zoho Cliq Home Hub Switcher */}
          <button
            onClick={() => setActiveTab('hub')}
            title="Remote Work Hub Home"
            style={activeTab === 'hub' ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition shadow-2xs ${
              activeTab === 'hub' ? 'shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <FiGrid size={18} />
          </button>

          {/* Multi-Window Chat Switcher */}
          <button
            onClick={() => setActiveTab('chat')}
            title="Multi-Window Chat Workspace"
            style={activeTab === 'chat' ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition shadow-2xs ${
              activeTab === 'chat' ? 'shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <FiMessageSquare size={18} />
          </button>

          {/* Calendar Workspace Switcher */}
          <button
            onClick={() => setActiveTab('calendar')}
            title="Team Calendar & Schedule"
            style={activeTab === 'calendar' ? { backgroundColor: primaryColor, color: '#fff' } : undefined}
            className={`w-11 h-11 rounded-xl flex items-center justify-center transition shadow-2xs relative ${
              activeTab === 'calendar' ? 'shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <FiCalendar size={18} />
            {calendarEvents.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {calendarEvents.length}
              </span>
            )}
          </button>

          {/* Task Board Trigger */}
          <button
            onClick={() => setShowTaskPanel(!showTaskPanel)}
            title="ClickUp Task Board"
            className="w-11 h-11 rounded-xl flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200/80 transition shadow-2xs relative"
          >
            <FiCheckSquare size={18} />
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {tasks.length}
              </span>
            )}
          </button>
        </div>

        {/* Current User Avatar */}
        <div onClick={() => setProfileUser(users[0])} className="cursor-pointer" title="My Profile">
          <div
            className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-md border-2 border-white transition hover:opacity-90"
          >
            <img
              src={getDiceBearAvatar(users[0]?.name || 'Admin')}
              alt={users[0]?.name || 'Admin'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </aside>

      {/* 2. Dynamic Content View (Hub Home vs Multi-Chat vs Calendar) */}
      {activeTab === 'hub' ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
          {/* Top Header Bar for Hub — Dashboard Style */}
          <div className="bg-white border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              >
                <FiGrid size={16} />
              </div>
              <div>
                <h1 className="text-sm font-bold text-slate-900 tracking-tight">Chat Workspace</h1>
                <p className="text-[11px] text-slate-500 font-medium">
                  Remote work hub • Presence, huddles, meetings aur team coordination.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <FiCalendar size={13} className="text-blue-600" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                style={{ backgroundColor: primaryColor }}
                className="px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-2xs transition hover:opacity-90 flex items-center gap-1.5"
              >
                <FiMessageSquare size={13} />
                <span>Open Chat Workspace</span>
              </button>
            </div>
          </div>

          {/* Zoho Cliq Light Theme Home View */}
          <ChatHubHome
            users={users}
            onOpenDM={(userId) => openTarget('dm', userId)}
            primaryColor={primaryColor}
            events={calendarEvents}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenAddEventModal={() => setActiveTab('calendar')}
            onEventClick={() => setActiveTab('calendar')}
          />
        </div>
      ) : activeTab === 'calendar' ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
          {/* Top Header Bar for Calendar */}
          <div className="bg-white border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div
                style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              >
                <FiCalendar size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-bold text-slate-900 tracking-tight">Team Calendar & Schedules</h1>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/60">
                    {calendarEvents.length} Events
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Enterprise CRM meeting scheduler, client pitches, sprint huddles aur calendar workstation.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('hub')}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
              >
                <FiGrid size={13} />
                <span>Hub Home</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                style={{ backgroundColor: primaryColor }}
                className="px-4 py-2 rounded-xl text-white font-semibold text-xs shadow-2xs transition hover:opacity-90 flex items-center gap-1.5"
              >
                <FiMessageSquare size={13} />
                <span>Open Chat Workspace</span>
              </button>
            </div>
          </div>

          {/* Full CRM Calendar System */}
          <div className="flex-1 overflow-hidden p-4">
            <CalendarView
              className="flex h-full w-full bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
              events={calendarEvents}
              onAddEvent={(newEvent) => {
                setCalendarEvents((prev) => [...prev, newEvent]);
              }}
              onDeleteEvent={(id) => {
                setCalendarEvents((prev) => prev.filter((e) => e.id !== id));
              }}
              onShareInChat={handleShareEventInChat}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <ChatSidebar
            primaryColor={primaryColor}
            channels={channels}
            users={users}
            activeSessions={sessions}
            activeSessionId={activeSessionId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            openTarget={openTarget}
            setShowTaskPanel={setShowTaskPanel}
            setIsCreateChannelOpen={() => {}}
            setProfileUser={setProfileUser}
            taskCount={tasks.length}
            calendarCount={calendarEvents.length}
            onOpenCalendar={() => setShowCalendarPanel(true)}
          />

          {/* Multi-Window Chat Stream Area */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
            {/* Session Tab Bar — Dashboard Style */}
            <div className="h-12 bg-white border-b border-slate-200/80 px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
                <button
                  onClick={() => setActiveTab('hub')}
                  className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center gap-1 shrink-0"
                >
                  <FiArrowLeft size={12} />
                  Hub
                </button>
                {sessions.map((s) => {
                  const isActive = activeSessionId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      style={
                        isActive
                          ? { backgroundColor: `${primaryColor}12`, color: primaryColor, borderColor: `${primaryColor}45` }
                          : undefined
                      }
                      className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer border transition shrink-0 ${
                        isActive ? 'shadow-2xs' : 'border-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                      }`}
                      title={s.subtitle}
                    >
                      <span className="text-[10px] opacity-70">{s.type === 'channel' ? '#' : '@'}</span>
                      <span className="max-w-[110px] truncate">{s.title}</span>
                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSession(s.id);
                          }}
                          className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-black/10 transition"
                          title="Close window"
                        >
                          <FiX size={11} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setShowCalendarPanel(!showCalendarPanel)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-blue-200 text-blue-700 text-[11px] font-bold hover:bg-blue-50 transition flex items-center gap-1.5"
                  title="Toggle Team Calendar Panel"
                >
                  <FiCalendar size={12} />
                  Calendar ({calendarEvents.length})
                </button>
                <button
                  onClick={() => setShowTaskPanel(!showTaskPanel)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-emerald-200 text-emerald-700 text-[11px] font-bold hover:bg-emerald-50 transition flex items-center gap-1.5"
                  title="Toggle ClickUp Task Board"
                >
                  <FiCheckSquare size={12} />
                  Tasks ({tasks.length})
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-x-auto divide-x divide-slate-200 bg-white">
              {sessions.map((session) => (
                <ChatWindow
                  key={session.id}
                  session={session}
                  isFocused={activeSessionId === session.id}
                  primaryColor={primaryColor}
                  messages={messages}
                  getUser={(id) => users.find((u) => u.id === id) || users[0]}
                  onSendMessage={(sessionId, text, attachments) => {
                    setMessages([
                      ...messages,
                      {
                        id: `m-${Date.now()}`,
                        senderId: 'u-me',
                        channelId: session.type === 'channel' ? session.targetId : undefined,
                        recipientId: session.type === 'dm' ? session.targetId : undefined,
                        content: text,
                        attachments,
                        timestamp: nowTime(),
                        repliesCount: 0,
                      },
                    ]);
                  }}
                  onCloseSession={(id, e) => {
                    e.stopPropagation();
                    closeSession(id);
                  }}
                  onOpenTaskPanel={() => setShowTaskPanel(true)}
                  onOpenCalendarPanel={() => setShowCalendarPanel(true)}
                  setThreadMessage={setThreadMessage}
                  setProfileUser={setProfileUser}
                />
              ))}
            </div>
          </main>
        </div>
      )}

      {/* Connected Calendar Drawer */}
      <ChatCalendarDrawer
        isOpen={showCalendarPanel}
        primaryColor={primaryColor}
        onClose={() => setShowCalendarPanel(false)}
        events={calendarEvents}
        onOpenCreateEventModal={() => {
          setActiveTab('calendar');
          setShowCalendarPanel(false);
        }}
        onOpenFullCalendar={() => {
          setActiveTab('calendar');
          setShowCalendarPanel(false);
        }}
        onEventClick={(evt) => {
          setActiveTab('calendar');
          setShowCalendarPanel(false);
        }}
        onShareEventInChat={handleShareEventInChat}
      />

      {/* Connected Task Drawer */}
      <ChatTaskDrawer
        isOpen={showTaskPanel}
        primaryColor={primaryColor}
        onClose={() => setShowTaskPanel(false)}
        onShareTaskInChat={(title, id, priority, assignee) => {
          setMessages([...messages, { id: `m-${Date.now()}`, senderId: 'u-me', channelId: 'c-general', content: `📎 Shared Task: ${title}`, timestamp: nowTime(), repliesCount: 0, taskRef: { id, title, priority, status: 'TODO', assigneeName: assignee, dueDate: 'Today' } }]);
        }}
        onOpenCreateTaskModal={() => setShowTaskPanel(true)}
      />

      {/* Thread Drawer */}
      <ChatThreadDrawer
        isOpen={!!threadMessage}
        onClose={() => setThreadMessage(null)}
        threadMessage={threadMessage}
        primaryColor={primaryColor}
        getUser={(id) => users.find((u) => u.id === id) || users[0]}
        onSendThreadReply={(msgId, text) => {
          setMessages(messages.map((m) => m.id === msgId ? { ...m, repliesCount: (m.repliesCount || 0) + 1, thread: [...(m.thread || []), { id: `t-${Date.now()}`, senderId: 'u-me', content: text, timestamp: nowTime() }] } : m));
          setThreadMessage((prev: any) => prev ? { ...prev, repliesCount: (prev.repliesCount || 0) + 1, thread: [...(prev.thread || []), { id: `t-${Date.now()}`, senderId: 'u-me', content: text, timestamp: nowTime() }] } : null);
        }}
      />

      {/* User Profile Modal */}
      <ChatUserProfileModal
        profileUser={profileUser}
        primaryColor={primaryColor}
        onClose={() => setProfileUser(null)}
        onOpenDM={(userId) => openTarget('dm', userId)}
      />
    </div>
  );
}
