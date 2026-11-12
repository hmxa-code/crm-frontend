'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatHubHome from './ChatHubHome';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatTaskDrawer from './ChatTaskDrawer';
import ChatThreadDrawer from './ChatThreadDrawer';
import ChatUserProfileModal from './ChatUserProfileModal';
import CreateChannelModal from './CreateChannelModal';
import { useTaskStore } from '@/src/components/ui/tasks/data/taskStore';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import {
  FiArrowLeft,
  FiGrid,
  FiMessageSquare,
  FiCheckSquare,
  FiCalendar,
  FiX,
  FiColumns,
  FiSquare
} from 'react-icons/fi';
import CalendarView from '@/src/components/ui/calendar/CalendarView';
import ChatCalendarDrawer from './ChatCalendarDrawer';
import { INITIAL_EVENTS } from '@/src/services/calendar/calendar-service';
import { CalendarEvent } from '@/src/types/index';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

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
  const router = useRouter();
  const { tasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState<'hub' | 'chat' | 'calendar'>('hub');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [showCalendarPanel, setShowCalendarPanel] = useState(false);
  const [showTaskPanel, setShowTaskPanel] = useState(false);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSplitView, setIsSplitView] = useState(false);

  const [channels, setChannels] = useState([
    { id: 'c-general', name: 'general', isPrivate: false, unreadCount: 0, messagingPermission: 'all' },
    { id: 'c-sales', name: 'sales-hotline', isPrivate: false, unreadCount: 3, messagingPermission: 'all' },
    { id: 'c-marketing', name: 'marketing-campaigns', isPrivate: false, unreadCount: 1, messagingPermission: 'all' },
    { id: 'c-tasks', name: 'task-dispatches', isPrivate: false, unreadCount: 2, messagingPermission: 'all' },
  ]);

  const [users] = useState([
    {
      id: 'u-me',
      name: 'You (Demo Admin)',
      email: 'admin@wholcure.com',
      phone: '+92 300 1234567',
      department: 'Management',
      role: 'Super Admin',
      title: 'CRM Lead Administrator',
      location: 'Karachi, Pakistan',
      avatarBg: 'bg-slate-900',
      status: 'online' as const,
      statusText: 'Reviewing CRM Deal Pipelines',
      activeDeals: '14 Active Opportunities ($180k)'
    },
    {
      id: 'u-1',
      name: 'Ali Raza',
      email: 'ali.raza@wholcure.com',
      phone: '+92 321 4455667',
      department: 'Sales Team',
      role: 'Sales Executive',
      title: 'Lead Closing Specialist',
      location: 'Karachi, Pakistan',
      avatarBg: 'bg-slate-700',
      status: 'online' as const,
      statusText: 'In client meeting • Available on chat',
      activeDeals: '8 Deals ($95k)'
    },
    {
      id: 'u-2',
      name: 'Sarah Khan',
      email: 'sarah.k@wholcure.com',
      phone: '+92 333 7788990',
      department: 'Growth Marketing',
      role: 'Marketing Head',
      title: 'Campaigns & Growth Lead',
      location: 'Islamabad, Pakistan',
      avatarBg: 'bg-slate-800',
      status: 'busy' as const,
      statusText: 'Launching Q4 Ad Funnel',
      activeDeals: '5 Campaigns Active'
    },
    {
      id: 'u-3',
      name: 'Hamza Malik',
      email: 'hamza.m@wholcure.com',
      phone: '+92 312 9988771',
      department: 'Engineering',
      role: 'Technical Lead',
      title: 'Full Stack Engineer',
      location: 'Lahore, Pakistan',
      avatarBg: 'bg-slate-600',
      status: 'online' as const,
      statusText: 'Deploying CRM Multi-Window Engine',
      activeDeals: 'Sprint 24 In Progress'
    },
  ]);

  const [sessions, setSessions] = useState<ChatSession[]>([
    { id: 'session-1', type: 'channel', targetId: 'c-general', title: 'general', subtitle: 'Company-wide announcements' },
    { id: 'session-2', type: 'channel', targetId: 'c-tasks', title: 'task-dispatches', subtitle: 'Live task synchronization stream' },
  ]);

  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      senderId: 'u-1',
      channelId: 'c-general',
      content: 'Assalam-o-Alaikum team! Q4 CRM targets locked hain. Workspace pipeline review karein.',
      timestamp: '09:30 AM',
      repliesCount: 0
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [profileUser, setProfileUser] = useState<any>(null);
  const [threadMessage, setThreadMessage] = useState<any>(null);

  const handleShareEventInChat = (event: CalendarEvent) => {
    const formattedDate = format(new Date(event.startDate), 'MMM dd, yyyy');
    const formattedTime = `${format(new Date(event.startDate), 'hh:mm a')} - ${format(new Date(event.endDate), 'hh:mm a')}`;
    const targetChannelId =
      sessions.find((s) => s.id === activeSessionId && s.type === 'channel')?.targetId || 'c-general';

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
    setIsMobileSidebarOpen(false);
    const exists = sessions.find((s) => s.targetId === targetId && s.type === type);
    if (exists) {
      setActiveSessionId(exists.id);
      return;
    }
    const title =
      type === 'channel'
        ? channels.find((c) => c.id === targetId)?.name
        : users.find((u) => u.id === targetId)?.name;
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      type,
      targetId,
      title: title || 'Chat',
      subtitle: 'Active Session'
    };
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

  const currentActiveSession =
    sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const secondSession =
    sessions.find((s) => s.id !== activeSessionId) || null;

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f8fafc] text-slate-800 font-sans antialiased select-none">
      {/* 1. Desktop Ultra-Left Navigation Rail */}
      <aside className="hidden md:flex w-14 sm:w-16 bg-white border-r border-slate-200/90 flex-col items-center py-4 justify-between shrink-0 z-30">
        <div className="flex flex-col items-center gap-2.5 w-full">
          <button
            onClick={() => router.push('/dashboard')}
            title="Back to CRM Dashboard"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
          >
            <FiArrowLeft size={18} />
          </button>

          <div className="w-8 h-px bg-slate-200 my-1" />

          {/* Home Hub Switcher */}
          <button
            onClick={() => setActiveTab('hub')}
            title="Workspace Home Hub"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
              activeTab === 'hub'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiGrid size={18} />
          </button>

          {/* Multi-Window Chat Switcher */}
          <button
            onClick={() => setActiveTab('chat')}
            title="Active Chat Workspace"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shadow-2xs cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiMessageSquare size={18} />
          </button>

          {/* Calendar Workspace Switcher */}
          <button
            onClick={() => setActiveTab('calendar')}
            title="Team Calendar & Schedule"
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shadow-2xs relative cursor-pointer ${
              activeTab === 'calendar'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FiCalendar size={18} />
            {calendarEvents.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {calendarEvents.length}
              </span>
            )}
          </button>

          {/* Task Board Trigger */}
          <button
            onClick={() => setShowTaskPanel(!showTaskPanel)}
            title="Task Board"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all shadow-2xs relative cursor-pointer"
          >
            <FiCheckSquare size={18} />
            {tasks.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {tasks.length}
              </span>
            )}
          </button>
        </div>

        {/* Current User Avatar */}
        <div
          onClick={() => setProfileUser(users[0])}
          className="cursor-pointer"
          title="My Profile"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-md border-2 border-white transition-opacity hover:opacity-90">
            <img
              src={getDiceBearAvatar(users[0]?.name || 'Admin')}
              alt={users[0]?.name || 'Admin'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </aside>

      {/* 2. Dynamic Content View */}
      {activeTab === 'hub' ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
          {/* Top Header with Mobile-only Back Button */}
          <div className="bg-white border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => router.push('/dashboard')}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 shrink-0"
                title="Back to CRM Dashboard"
              >
                <FiArrowLeft size={15} />
                <span className="text-[11px] font-bold hidden xs:inline">Dashboard</span>
              </button>

              <div className="hidden md:block h-5 w-px bg-slate-200 shrink-0" />

              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                    Team Hub
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    Presence & coordination.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('calendar')}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] sm:text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <FiCalendar size={12} />
                <span className="hidden xs:inline">Calendar</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <FiMessageSquare size={12} />
                <span>Chat</span>
              </button>
            </div>
          </div>

          <ChatHubHome
            users={users}
            onOpenDM={(userId) => openTarget('dm', userId)}
            events={calendarEvents}
            onOpenCalendar={() => setActiveTab('calendar')}
            onOpenAddEventModal={() => setActiveTab('calendar')}
            onEventClick={() => setActiveTab('calendar')}
          />
        </div>
      ) : activeTab === 'calendar' ? (
        <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
          {/* Calendar Top Header with Mobile-only Back Button */}
          <div className="bg-white border-b border-slate-200/90 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => router.push('/dashboard')}
                className="md:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1 shrink-0"
                title="Back to CRM Dashboard"
              >
                <FiArrowLeft size={15} />
                <span className="text-[11px] font-bold hidden xs:inline">Dashboard</span>
              </button>

              <div className="hidden md:block h-5 w-px bg-slate-200 shrink-0" />

              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0">
                  <h1 className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight truncate">
                    Calendar ({calendarEvents.length})
                  </h1>
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    Meeting scheduler & workstation.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setActiveTab('hub')}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] sm:text-xs transition flex items-center gap-1 cursor-pointer"
              >
                <FiGrid size={12} />
                <span>Hub</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className="px-3 sm:px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
              >
                <FiMessageSquare size={12} />
                <span>Chat</span>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-2 sm:p-5">
            <CalendarView
              className="flex h-full w-full bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
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
        <div className="flex-1 flex overflow-hidden relative">
          {isMobileSidebarOpen && (
            <div
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
            />
          )}

          <div className="hidden md:flex h-full">
            <ChatSidebar
              primaryColor="#0f172a"
              channels={channels}
              users={users}
              activeSessions={sessions}
              activeSessionId={activeSessionId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openTarget={openTarget}
              setShowTaskPanel={setShowTaskPanel}
              setIsCreateChannelOpen={() => setIsCreateChannelOpen(true)}
              setProfileUser={setProfileUser}
              taskCount={tasks.length}
              calendarCount={calendarEvents.length}
              onOpenCalendar={() => setShowCalendarPanel(true)}
            />
          </div>

          {/* Mobile Drawer (Includes both Rail & Sidebar) */}
          <div
            className={`md:hidden fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
            }`}
          >
            {/* Mobile Navigation Rail */}
            <div className="w-14 bg-white border-r border-slate-200/90 flex flex-col items-center py-4 justify-between shrink-0">
              <div className="flex flex-col items-center gap-2.5 w-full">
                <button
                  onClick={() => router.push('/dashboard')}
                  title="Back to CRM Dashboard"
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                >
                  <FiArrowLeft size={18} />
                </button>
                <div className="w-8 h-px bg-slate-200 my-1" />
                <button
                  onClick={() => { setActiveTab('hub'); setIsMobileSidebarOpen(false); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  title="Hub"
                >
                  <FiGrid size={18} />
                </button>
                <button
                  onClick={() => { setActiveTab('chat'); setIsMobileSidebarOpen(false); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-md cursor-pointer"
                  title="Chat"
                >
                  <FiMessageSquare size={18} />
                </button>
                <button
                  onClick={() => { setActiveTab('calendar'); setIsMobileSidebarOpen(false); }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                  title="Calendar"
                >
                  <FiCalendar size={18} />
                </button>
              </div>
              <div onClick={() => setProfileUser(users[0])} className="cursor-pointer" title="Profile">
                <div className="w-9 h-9 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-md border-2 border-white">
                  <img src={getDiceBearAvatar(users[0]?.name || 'Admin')} alt="Admin" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <ChatSidebar
              primaryColor="#0f172a"
              channels={channels}
              users={users}
              activeSessions={sessions}
              activeSessionId={activeSessionId}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              openTarget={openTarget}
              setShowTaskPanel={setShowTaskPanel}
              setIsCreateChannelOpen={() => setIsCreateChannelOpen(true)}
              setProfileUser={setProfileUser}
              taskCount={tasks.length}
              calendarCount={calendarEvents.length}
              onOpenCalendar={() => setShowCalendarPanel(true)}
              onCloseMobileDrawer={() => setIsMobileSidebarOpen(false)}
            />
          </div>

          <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-hidden">
            {/* Top Header Bar */}
            <div className="h-13 bg-white border-b border-slate-200/90 px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="md:hidden p-1.5 sm:px-2 sm:py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer flex items-center gap-1"
                  title="Back to Dashboard"
                >
                  <FiArrowLeft size={15} />
                  <span className="text-[11px] font-bold hidden sm:inline">Dashboard</span>
                </button>
              </div>

              <div className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 px-1">
                {sessions.map((s) => {
                  const isActive = activeSessionId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => setActiveSessionId(s.id)}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer border transition-all shrink-0 ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200/80'
                      }`}
                      title={s.subtitle}
                    >
                      <span className={`text-[11px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                        {s.type === 'channel' ? '#' : '@'}
                      </span>
                      <span className="max-w-[80px] sm:max-w-[130px] truncate">{s.title}</span>

                      {sessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            closeSession(s.id);
                          }}
                          className={`p-0.5 rounded transition cursor-pointer ${
                            isActive
                              ? 'text-slate-200 hover:text-white hover:bg-white/20'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-300'
                          }`}
                          title="Close window tab"
                        >
                          <FiX size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {sessions.length > 1 && (
                  <button
                    onClick={() => setIsSplitView(!isSplitView)}
                    className={`hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                      isSplitView
                        ? 'bg-slate-100 text-slate-900 border-slate-300'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                    title={isSplitView ? 'Switch to Single Window View' : 'Switch to Split Dual Window View'}
                  >
                    {isSplitView ? <FiSquare size={13} /> : <FiColumns size={13} />}
                    <span>{isSplitView ? 'Single View' : 'Split View'}</span>
                  </button>
                )}

                <button
                  onClick={() => setShowCalendarPanel(!showCalendarPanel)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                  title="Toggle Team Calendar Panel"
                >
                  <FiCalendar size={13} className="text-slate-800" />
                  <span>Calendar ({calendarEvents.length})</span>
                </button>

                <button
                  onClick={() => setShowTaskPanel(!showTaskPanel)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
                  title="Toggle Task Board"
                >
                  <FiCheckSquare size={13} className="text-slate-800" />
                  <span className="hidden sm:inline">Tasks</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                    {tasks.length}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden bg-white">
              {currentActiveSession && (
                <div
                  className={`flex-1 flex flex-col h-full min-w-0 ${
                    isSplitView && secondSession ? 'hidden lg:flex lg:w-1/2 lg:border-r lg:border-slate-200' : 'w-full'
                  }`}
                >
                  <ChatWindow
                    session={currentActiveSession}
                    isFocused={true}
                    messages={messages}
                    getUser={(id) => users.find((u) => u.id === id) || users[0]}
                    onSendMessage={(sessionId, text, attachments) => {
                      setMessages([
                        ...messages,
                        {
                          id: `m-${Date.now()}`,
                          senderId: 'u-me',
                          channelId: currentActiveSession.type === 'channel' ? currentActiveSession.targetId : undefined,
                          recipientId: currentActiveSession.type === 'dm' ? currentActiveSession.targetId : undefined,
                          content: text,
                          attachments,
                          timestamp: nowTime(),
                          repliesCount: 0,
                        },
                      ]);
                    }}
                    onCloseSession={(sessionId, e) => {
                      e.stopPropagation();
                      closeSession(sessionId);
                    }}
                    onOpenTaskPanel={() => setShowTaskPanel(true)}
                    setThreadMessage={setThreadMessage}
                    setProfileUser={setProfileUser}
                    onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
                  />
                </div>
              )}

              {isSplitView && secondSession && (
                <div className="hidden lg:flex lg:w-1/2 flex-col h-full min-w-0">
                  <ChatWindow
                    session={secondSession}
                    isFocused={false}
                    messages={messages}
                    getUser={(id) => users.find((u) => u.id === id) || users[0]}
                    onSendMessage={(sessionId, text, attachments) => {
                      setMessages([
                        ...messages,
                        {
                          id: `m-${Date.now()}`,
                          senderId: 'u-me',
                          channelId: secondSession.type === 'channel' ? secondSession.targetId : undefined,
                          recipientId: secondSession.type === 'dm' ? secondSession.targetId : undefined,
                          content: text,
                          attachments,
                          timestamp: nowTime(),
                          repliesCount: 0,
                        },
                      ]);
                    }}
                    onCloseSession={(sessionId, e) => {
                      e.stopPropagation();
                      closeSession(sessionId);
                    }}
                    onOpenTaskPanel={() => setShowTaskPanel(true)}
                    setThreadMessage={setThreadMessage}
                    setProfileUser={setProfileUser}
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      )}

      {/* Connected Create Channel Modal */}
      <CreateChannelModal
        isOpen={isCreateChannelOpen}
        onClose={() => setIsCreateChannelOpen(false)}
        onCreateChannel={(newChannelData) => {
          const newId = `c-${Date.now()}`;
          const formattedChannel = {
            id: newId,
            name: newChannelData.name,
            isPrivate: newChannelData.isPrivate,
            unreadCount: 0,
            messagingPermission: newChannelData.messagingPermission,
          };
          setChannels([...channels, formattedChannel]);
          toast.success(`Channel #${newChannelData.name} created successfully!`);
          openTarget('channel', newId);
        }}
        primaryColor="#0f172a"
      />

      <ChatCalendarDrawer
        isOpen={showCalendarPanel}
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
        onEventClick={() => {
          setActiveTab('calendar');
          setShowCalendarPanel(false);
        }}
        onShareEventInChat={handleShareEventInChat}
      />

      <ChatTaskDrawer
        isOpen={showTaskPanel}
        onClose={() => setShowTaskPanel(false)}
        onShareTaskInChat={(title, id, priority, assignee) => {
          setMessages([
            ...messages,
            {
              id: `m-${Date.now()}`,
              senderId: 'u-me',
              channelId: 'c-general',
              content: `📎 Shared Task: ${title}`,
              timestamp: nowTime(),
              repliesCount: 0,
              taskRef: {
                id,
                title,
                priority,
                status: 'TODO',
                assigneeName: assignee,
                dueDate: 'Today'
              }
            }
          ]);
        }}
        onOpenCreateTaskModal={() => setShowTaskPanel(true)}
      />

      <ChatThreadDrawer
        isOpen={!!threadMessage}
        onClose={() => setThreadMessage(null)}
        threadMessage={threadMessage}
        primaryColor="#0f172a"
        getUser={(id) => users.find((u) => u.id === id) || users[0]}
        onSendThreadReply={(msgId, text) => {
          setMessages(
            messages.map((m) =>
              m.id === msgId
                ? {
                    ...m,
                    repliesCount: (m.repliesCount || 0) + 1,
                    thread: [
                      ...(m.thread || []),
                      {
                        id: `t-${Date.now()}`,
                        senderId: 'u-me',
                        content: text,
                        timestamp: nowTime()
                      }
                    ]
                  }
                : m
            )
          );
          setThreadMessage((prev: any) =>
            prev
              ? {
                  ...prev,
                  repliesCount: (prev.repliesCount || 0) + 1,
                  thread: [
                    ...(prev.thread || []),
                    {
                      id: `t-${Date.now()}`,
                      senderId: 'u-me',
                      content: text,
                      timestamp: nowTime()
                    }
                  ]
                }
              : null
          );
        }}
      />

      <ChatUserProfileModal
        profileUser={profileUser}
        onClose={() => setProfileUser(null)}
        primaryColor="#0f172a"
        onOpenDM={(userId) => openTarget('dm', userId)}
      />
    </div>
  );
}