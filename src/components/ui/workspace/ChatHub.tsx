'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FiHash, FiPlus, FiSearch, FiSend, FiX, FiChevronDown, FiChevronRight,
  FiSmile, FiPaperclip, FiMoreHorizontal, FiUser, FiCheck, FiBell,
  FiMessageSquare, FiLink, FiEdit2, FiTrash2, FiAtSign, FiVideo,
  FiStar, FiBookmark, FiAlertCircle,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';


// ─── Interfaces ────────────────────────────────────────────────────────────────

type OnlineStatus = 'online' | 'busy' | 'away' | 'offline';

interface ChatUser {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  status: OnlineStatus;
  role: string;
}

interface Reaction {
  emoji: string;
  userIds: string[];
}

interface TaskRef {
  id: string;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  assigneeId: string;
}

interface FileAttachment {
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'doc' | 'csv';
}

interface ChatMessage {
  id: string;
  channelId: string;
  authorId: string;
  text: string;
  createdAt: string;
  reactions: Reaction[];
  isPinned?: boolean;
  taskRef?: TaskRef;
  fileAttachment?: FileAttachment;
  threadCount?: number;
}

interface Channel {
  id: string;
  name: string;
  unread: number;
  isPrivate?: boolean;
  description?: string;
}

interface DirectMessage {
  userId: string;
  unread: number;
}

// ─── Seed Data ─────────────────────────────────────────────────────────────────

const USERS: ChatUser[] = [
  { id: 'u-me',     name: 'Demo Admin',    initials: 'DA', avatarBg: 'bg-emerald-500', status: 'online',  role: 'Admin'          },
  { id: 'u-ali',    name: 'Ali Raza',      initials: 'AR', avatarBg: 'bg-blue-500',    status: 'online',  role: 'Sales Exec'     },
  { id: 'u-sarah',  name: 'Sarah Khan',    initials: 'SK', avatarBg: 'bg-purple-500',  status: 'busy',    role: 'Sales Lead'     },
  { id: 'u-hamza',  name: 'Hamza Malik',   initials: 'HM', avatarBg: 'bg-indigo-500',  status: 'online',  role: 'Ops Manager'    },
  { id: 'u-zainab', name: 'Zainab Ahmed',  initials: 'ZA', avatarBg: 'bg-rose-500',    status: 'away',    role: 'Marketing'      },
  { id: 'u-bilal',  name: 'Bilal Farooq',  initials: 'BF', avatarBg: 'bg-amber-500',   status: 'offline', role: 'Engineering'    },
];

const CHANNELS: Channel[] = [
  { id: 'ch-general',    name: 'general',           unread: 0, description: 'Company-wide announcements and updates' },
  { id: 'ch-sales',      name: 'sales-hotline',     unread: 3, description: 'Live lead tracking and deal updates'    },
  { id: 'ch-marketing',  name: 'marketing-campaigns', unread: 0, description: 'Campaign planning and results'        },
  { id: 'ch-tasks',      name: 'task-dispatches',   unread: 2, description: 'Automated task assignments and updates' },
  { id: 'ch-realestate', name: 'real-estate-deals', unread: 1, description: 'Property deals and client follow-ups'   },
];

const DMS: DirectMessage[] = [
  { userId: 'u-ali',    unread: 0 },
  { userId: 'u-sarah',  unread: 2 },
  { userId: 'u-hamza',  unread: 0 },
  { userId: 'u-zainab', unread: 1 },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  // general
  {
    id: 'msg-1', channelId: 'ch-general', authorId: 'u-hamza',
    text: 'Good morning team! Quick reminder: Q4 review call is tomorrow at 10 AM. Please have your dashboards ready 📊',
    createdAt: '2024-12-09T09:00:00Z',
    reactions: [{ emoji: '👍', userIds: ['u-me', 'u-ali'] }, { emoji: '✅', userIds: ['u-sarah'] }],
    isPinned: true, threadCount: 3,
  },
  {
    id: 'msg-2', channelId: 'ch-general', authorId: 'u-sarah',
    text: 'Also sharing the updated onboarding deck — please review before EOD. Feedback welcome from everyone!',
    createdAt: '2024-12-09T09:15:00Z',
    reactions: [{ emoji: '🔥', userIds: ['u-ali', 'u-zainab'] }],
    fileAttachment: { name: 'Onboarding_Q4_v3.pdf', size: '2.4 MB', type: 'pdf' },
  },
  {
    id: 'msg-3', channelId: 'ch-general', authorId: 'u-zainab',
    text: 'Instagram campaign went live this morning. Impressions already at 12K after 2 hours 🚀',
    createdAt: '2024-12-09T10:30:00Z',
    reactions: [{ emoji: '🎉', userIds: ['u-me', 'u-ali', 'u-hamza'] }],
  },
  {
    id: 'msg-4', channelId: 'ch-general', authorId: 'u-me',
    text: 'Great work Zainab! Let\'s keep an eye on the CPC and adjust budget if needed by afternoon.',
    createdAt: '2024-12-09T10:45:00Z',
    reactions: [],
  },
  // task-dispatches
  {
    id: 'msg-5', channelId: 'ch-tasks', authorId: 'u-hamza',
    text: 'New task dispatched: Nexus Hospital follow-up due Friday. Sara please confirm client availability 🗓️',
    createdAt: '2024-12-09T11:00:00Z',
    reactions: [{ emoji: '👀', userIds: ['u-sarah'] }],
    taskRef: {
      id: 't-1', title: 'Nexus Hospital Enterprise Proposal',
      status: 'IN_PROGRESS', priority: 'HIGH', assigneeId: 'u-sarah',
    },
  },
  {
    id: 'msg-6', channelId: 'ch-tasks', authorId: 'u-ali',
    text: 'Al-Shifa Health task assigned. Starting the proposal today — expect first draft by Wednesday.',
    createdAt: '2024-12-09T11:30:00Z',
    reactions: [{ emoji: '💪', userIds: ['u-me'] }],
    taskRef: {
      id: 't-11', title: 'Al-Shifa Health Custom Proposal',
      status: 'TODO', priority: 'HIGH', assigneeId: 'u-ali',
    },
  },
  // DM with Ali
  {
    id: 'msg-7', channelId: 'dm-u-ali', authorId: 'u-me',
    text: 'Hey Ali, how\'s the Al-Shifa proposal coming along? Need it before Thursday for the exec review.',
    createdAt: '2024-12-09T12:00:00Z',
    reactions: [],
  },
  {
    id: 'msg-8', channelId: 'dm-u-ali', authorId: 'u-ali',
    text: 'On it! I\'ve got the pricing section done. Working on the customization scope now. Should be ready by Wednesday EOD 🙏',
    createdAt: '2024-12-09T12:05:00Z',
    reactions: [{ emoji: '👍', userIds: ['u-me'] }],
  },
];

const DM_AUTO_REPLIES: Record<string, string[]> = {
  'u-ali':    ['Sure, I\'ll get that done!', 'On it — will update you shortly.', 'Thanks for the heads up!'],
  'u-sarah':  ['Got it! Sending the deck now.', 'Will loop in legal as well.', 'Confirmed, updating CRM now.'],
  'u-hamza':  ['Understood, will coordinate.', 'Already on it — thanks!', 'I\'ll ping the team.'],
  'u-zainab': ['Campaign is running well!', 'Will adjust budget if needed.', 'Scheduling the review now.'],
};

const EMOJIS = ['👍', '🔥', '🎉', '✅', '💪', '👀', '❤️', '😂'];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getUser(id: string): ChatUser | undefined {
  return USERS.find(u => u.id === id);
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

const STATUS_COLORS: Record<OnlineStatus, string> = {
  online:  'bg-green-400',
  busy:    'bg-red-400',
  away:    'bg-yellow-400',
  offline: 'bg-slate-300',
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'text-red-600 bg-red-50',
  HIGH:   'text-orange-600 bg-orange-50',
  MEDIUM: 'text-blue-600 bg-blue-50',
  LOW:    'text-slate-500 bg-slate-100',
};

const STATUS_LABEL: Record<string, string> = {
  TODO:        'To Do',
  IN_PROGRESS: 'In Progress',
  DONE:        'Done',
};

// ─── Avatar ────────────────────────────────────────────────────────────────────

function UserAvatar({
  userId, size = 'sm', showStatus = false,
}: {
  userId: string; size?: 'sm' | 'md' | 'lg'; showStatus?: boolean;
}) {
  const u = getUser(userId);
  if (!u) return null;
  const sz = size === 'sm' ? 'w-7 h-7' : size === 'md' ? 'w-9 h-9' : 'w-11 h-11';
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border border-slate-200/60 shadow-2xs`}>
        <img
          src={getDiceBearAvatar(u.name)}
          alt={u.name}
          className="w-full h-full object-cover"
        />
      </div>
      {showStatus && (
        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${STATUS_COLORS[u.status]}`} />
      )}
    </div>
  );
}

// ─── Task Reference Card ───────────────────────────────────────────────────────

function TaskRefCard({ task }: { task: TaskRef }) {
  return (
    <div className="mt-2 border border-slate-200 rounded-xl overflow-hidden bg-white w-72">
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Task</span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-semibold text-slate-800 mb-1">{task.title}</p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{STATUS_LABEL[task.status] ?? task.status}</span>
          <span className="text-slate-300">·</span>
          <UserAvatar userId={task.assigneeId} size="sm" />
          <span className="text-xs text-slate-500">{getUser(task.assigneeId)?.name}</span>
        </div>
      </div>
    </div>
  );
}

// ─── File Attachment Card ──────────────────────────────────────────────────────

function FileCard({ file }: { file: FileAttachment }) {
  const iconColors: Record<string, string> = {
    pdf: 'bg-red-100 text-red-600',
    image: 'bg-blue-100 text-blue-600',
    doc: 'bg-indigo-100 text-indigo-600',
    csv: 'bg-green-100 text-green-600',
  };
  return (
    <div className="mt-2 flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 py-2.5 w-64">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${iconColors[file.type]}`}>
        {file.type.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
        <p className="text-xs text-slate-400">{file.size}</p>
      </div>
      <FiPaperclip className="text-slate-400 flex-shrink-0" size={14} />
    </div>
  );
}

// ─── Message Bubble ────────────────────────────────────────────────────────────

function MessageBubble({
  msg, onReact, onOpenThread,
}: {
  msg: ChatMessage;
  onReact: (msgId: string, emoji: string) => void;
  onOpenThread: (msg: ChatMessage) => void;
}) {
  const author = getUser(msg.authorId);
  const isMe = msg.authorId === 'u-me';
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group flex items-start gap-3 px-4 py-2 hover:bg-slate-50 rounded-lg transition-colors relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => { setShowActions(false); setShowEmojiPicker(false); }}
    >
      <UserAvatar userId={msg.authorId} size="md" showStatus />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-slate-900">{author?.name}</span>
          {isMe && <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">You</span>}
          <span className="text-xs text-slate-400">{formatTime(msg.createdAt)}</span>
          {msg.isPinned && (
            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded flex items-center gap-1">
              <FiBookmark size={10} /> Pinned
            </span>
          )}
        </div>

        <p className="text-sm text-slate-700 leading-relaxed">{msg.text}</p>

        {msg.taskRef && <TaskRefCard task={msg.taskRef} />}
        {msg.fileAttachment && <FileCard file={msg.fileAttachment} />}

        {/* Reactions */}
        {msg.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {msg.reactions.map(r => (
              <button
                key={r.emoji}
                onClick={() => onReact(msg.id, r.emoji)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition-colors ${
                  r.userIds.includes('u-me')
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r.emoji} <span>{r.userIds.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Thread count */}
        {msg.threadCount && msg.threadCount > 0 && (
          <button
            onClick={() => onOpenThread(msg)}
            className="mt-1.5 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
          >
            <FiMessageSquare size={11} /> {msg.threadCount} replies
          </button>
        )}
      </div>

      {/* Action toolbar */}
      {showActions && (
        <div className="absolute right-4 top-1 flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg shadow-sm z-10">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(v => !v)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <FiSmile size={14} />
            </button>
            {showEmojiPicker && (
              <div className="absolute right-0 top-8 bg-white border border-slate-200 rounded-xl shadow-xl p-2 flex flex-wrap gap-1 w-36 z-20">
                {EMOJIS.map(e => (
                  <button
                    key={e}
                    onClick={() => { onReact(msg.id, e); setShowEmojiPicker(false); }}
                    className="text-base hover:bg-slate-100 rounded p-1 transition-colors"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenThread(msg)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <FiMessageSquare size={14} />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
            <FiBookmark size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Create Channel Modal ──────────────────────────────────────────────────────

function CreateChannelModal({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) {
  const [name, setName] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Create Channel</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><FiX size={18} /></button>
        </div>
        <div className="px-6 py-4">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">Channel Name</label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
            <FiHash className="text-slate-400" size={14} />
            <input
              value={name}
              onChange={e => setName(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
              placeholder="new-channel-name"
              className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button
            onClick={() => { if (name.trim()) { onCreate(name); onClose(); } }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            Create Channel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quick Task Modal ──────────────────────────────────────────────────────────

function QuickTaskModal({ onClose, onAdd }: { onClose: () => void; onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-semibold text-slate-800">Quick Task</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><FiX size={18} /></button>
        </div>
        <div className="px-6 py-4">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Task title..."
            autoFocus
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
          <button
            onClick={() => { if (title.trim()) { onAdd(title); onClose(); } }}
            className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Thread Drawer ─────────────────────────────────────────────────────────────

function ThreadDrawer({ msg, onClose }: { msg: ChatMessage; onClose: () => void }) {
  const [reply, setReply] = useState('');
  const [replies, setReplies] = useState<ChatMessage[]>([]);

  function sendReply() {
    if (!reply.trim()) return;
    setReplies(prev => [...prev, {
      id: `reply-${Date.now()}`, channelId: msg.channelId, authorId: 'u-me',
      text: reply, createdAt: new Date().toISOString(), reactions: [],
    }]);
    setReply('');
  }

  return (
    <div className="fixed inset-0 z-40 flex" onClick={onClose}>
      <div className="flex-1" />
      <div
        className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
          <h4 className="text-sm font-semibold text-slate-800">Thread</h4>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-200 text-slate-400"><FiX size={16} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Original message */}
          <div className="pb-3 border-b border-slate-100">
            <div className="flex items-start gap-2">
              <UserAvatar userId={msg.authorId} size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{getUser(msg.authorId)?.name}</span>
                  <span className="text-xs text-slate-400">{formatTime(msg.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">{msg.text}</p>
              </div>
            </div>
          </div>
          {/* Replies */}
          {replies.map(r => (
            <div key={r.id} className="flex items-start gap-2">
              <UserAvatar userId={r.authorId} size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">{getUser(r.authorId)?.name}</span>
                  <span className="text-xs text-slate-400">{formatTime(r.createdAt)}</span>
                </div>
                <p className="text-sm text-slate-700 mt-0.5">{r.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="px-3 py-3 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
            <input
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendReply()}
              placeholder="Reply in thread..."
              className="flex-1 bg-transparent text-sm text-slate-800 focus:outline-none"
            />
            <button onClick={sendReply} className="text-slate-900 hover:text-slate-700 transition-colors">
              <FiSend size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── User Profile Popover ──────────────────────────────────────────────────────

function UserProfilePopover({ userId, onClose }: { userId: string; onClose: () => void }) {
  const u = getUser(userId);
  if (!u) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-72 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className={`h-16 ${u.avatarBg} opacity-20`} />
        <div className="px-5 pb-5 -mt-8">
          <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border-4 border-white mb-3 shadow-md">
            <img
              src={getDiceBearAvatar(u.name)}
              alt={u.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-base font-bold text-slate-900">{u.name}</h4>
          <p className="text-sm text-slate-500 mb-3">{u.role}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[u.status]}`} />
            <span className="text-xs text-slate-600 capitalize">{u.status}</span>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-900 text-sm font-medium hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5">
              <FiMessageSquare size={14} /> Message
            </button>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm hover:bg-slate-200 transition-colors">
              <FiX size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ChatHub() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [channels, setChannels] = useState<Channel[]>(CHANNELS);
  const [activeChannel, setActiveChannel] = useState<string>('ch-general');
  const [activeDm, setActiveDm] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const [threadMsg, setThreadMsg] = useState<ChatMessage | null>(null);
  const [profileUser, setProfileUser] = useState<string | null>(null);
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showQuickTask, setShowQuickTask] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>(['ch-general']);
  const [activeTab, setActiveTab] = useState('ch-general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChannelId = activeDm ? `dm-${activeDm}` : activeChannel;

  const visibleMessages = messages.filter(m => m.channelId === currentChannelId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [visibleMessages.length]);

  function sendMessage() {
    if (!inputText.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: currentChannelId,
      authorId: 'u-me',
      text: inputText,
      createdAt: new Date().toISOString(),
      reactions: [],
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    // Auto-reply simulation for DMs
    if (activeDm) {
      setIsTyping(true);
      const replies = DM_AUTO_REPLIES[activeDm] ?? ['Got it!'];
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: `msg-auto-${Date.now()}`,
          channelId: currentChannelId,
          authorId: activeDm,
          text: replies[Math.floor(Math.random() * replies.length)],
          createdAt: new Date().toISOString(),
          reactions: [],
        }]);
      }, 1100);
    }
  }

  function toggleReaction(msgId: string, emoji: string) {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const existingIdx = m.reactions.findIndex(r => r.emoji === emoji);
      if (existingIdx >= 0) {
        const r = m.reactions[existingIdx];
        const alreadyReacted = r.userIds.includes('u-me');
        const updatedUserIds = alreadyReacted
          ? r.userIds.filter(id => id !== 'u-me')
          : [...r.userIds, 'u-me'];
        const newReactions = updatedUserIds.length === 0
          ? m.reactions.filter((_, i) => i !== existingIdx)
          : m.reactions.map((r2, i) => i === existingIdx ? { ...r2, userIds: updatedUserIds } : r2);
        return { ...m, reactions: newReactions };
      }
      return { ...m, reactions: [...m.reactions, { emoji, userIds: ['u-me'] }] };
    }));
  }

  function switchTo(channelId: string, dmUserId?: string) {
    if (dmUserId) {
      setActiveDm(dmUserId);
      setActiveChannel('');
      const tab = `dm-${dmUserId}`;
      if (!openTabs.includes(tab)) setOpenTabs(prev => prev.slice(-2).concat(tab));
      setActiveTab(tab);
    } else {
      setActiveDm(null);
      setActiveChannel(channelId);
      if (!openTabs.includes(channelId)) setOpenTabs(prev => prev.slice(-2).concat(channelId));
      setActiveTab(channelId);
    }
    // Clear unread
    setChannels(prev => prev.map(c => c.id === channelId ? { ...c, unread: 0 } : c));
  }

  function addChannel(name: string) {
    const id = `ch-${name}`;
    setChannels(prev => [...prev, { id, name, unread: 0 }]);
  }

  const activeChannelObj = channels.find(c => c.id === activeChannel);
  const activeDmUser = activeDm ? getUser(activeDm) : null;
  const headerTitle = activeDm ? activeDmUser?.name ?? 'DM' : `#${activeChannelObj?.name ?? ''}`;

  return (
    <div className="flex h-full bg-white overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* ── Sidebar ── */}
      <div className="w-64 flex-shrink-0 bg-slate-50 flex flex-col border-r border-slate-200">
        {/* Workspace header */}
        <div className="px-4 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Komketra</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500">6 members online</span>
              </div>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><FiEdit2 size={13} /></button>
          </div>
        </div>

        {/* Tab pills */}
        {openTabs.length > 0 && (
          <div className="px-3 py-2 flex gap-1 flex-wrap border-b border-slate-200 bg-slate-100/50">
            {openTabs.map(tabId => {
              const ch = channels.find(c => c.id === tabId);
              const dm = USERS.find(u => `dm-${u.id}` === tabId);
              const label = ch ? `#${ch.name.slice(0, 8)}` : dm ? dm.initials : tabId;
              return (
                <button
                  key={tabId}
                  onClick={() => { setActiveTab(tabId); switchTo(tabId.startsWith('dm-') ? '' : tabId, tabId.startsWith('dm-') ? tabId.replace('dm-', '') : undefined); }}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${activeTab === tabId ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Channels */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="px-3 mb-1">
            <button
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 w-full"
              onClick={() => setChannelsOpen(v => !v)}
            >
              {channelsOpen ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
              Channels
              <span className="ml-auto text-slate-400">{channels.length}</span>
            </button>
          </div>
          {channelsOpen && (
            <div className="mb-2">
              {channels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => switchTo(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
                    activeChannel === ch.id && !activeDm
                      ? 'bg-slate-900 text-white rounded-lg mx-1 w-[calc(100%-8px)] shadow-sm'
                      : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                >
                  <FiHash size={14} className="flex-shrink-0 opacity-70" />
                  <span className="flex-1 text-left truncate">{ch.name}</span>
                  {ch.unread > 0 && (
                    <span className="bg-slate-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium flex-shrink-0">
                      {ch.unread}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={() => setShowCreateChannel(true)}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
              >
                <FiPlus size={14} /> Add Channel
              </button>
            </div>
          )}

          {/* DMs */}
          <div className="px-3 mb-1">
            <button
              className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 w-full"
              onClick={() => setDmsOpen(v => !v)}
            >
              {dmsOpen ? <FiChevronDown size={12} /> : <FiChevronRight size={12} />}
              Direct Messages
            </button>
          </div>
          {dmsOpen && (
            <div>
              {DMS.map(dm => {
                const u = getUser(dm.userId);
                if (!u) return null;
                return (
                  <button
                    key={dm.userId}
                    onClick={() => switchTo('', dm.userId)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm transition-colors ${
                      activeDm === dm.userId
                        ? 'bg-slate-900 text-white rounded-lg mx-1 w-[calc(100%-8px)] shadow-sm'
                        : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border border-slate-200/60 shadow-2xs">
                        <img
                          src={getDiceBearAvatar(u.name)}
                          alt={u.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white ${STATUS_COLORS[u.status]}`} />
                    </div>
                    <span className="flex-1 text-left truncate">{u.name}</span>
                    {dm.unread > 0 && (
                      <span className="bg-slate-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium flex-shrink-0">
                        {dm.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Me */}
        <div className="px-3 py-3 border-t border-slate-200 bg-white">
          <button
            onClick={() => setProfileUser('u-me')}
            className="flex items-center gap-2.5 w-full hover:bg-slate-100 rounded-lg px-2 py-1.5 transition-colors"
          >
            <UserAvatar userId="u-me" size="sm" showStatus />
            <div className="flex-1 text-left">
              <p className="text-xs font-semibold text-slate-900">Demo Admin</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
            <FiMoreHorizontal className="text-slate-400" size={14} />
          </button>
        </div>
      </div>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            {activeDm ? (
              <>
                <button onClick={() => setProfileUser(activeDm)}>
                  <UserAvatar userId={activeDm} size="md" showStatus />
                </button>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{activeDmUser?.name}</h3>
                  <p className="text-xs text-slate-500 capitalize">{activeDmUser?.status} · {activeDmUser?.role}</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                  <FiHash className="text-slate-700" size={15} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{headerTitle}</h3>
                  {activeChannelObj?.description && (
                    <p className="text-xs text-slate-500">{activeChannelObj.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowQuickTask(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <FiPlus size={12} /> Quick Task
            </button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><FiSearch size={15} /></button>
            <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"><FiBell size={15} /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-0.5">
          {visibleMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <FiMessageSquare className="text-slate-400" size={20} />
              </div>
              <p className="text-sm font-medium text-slate-700 mb-1">No messages yet</p>
              <p className="text-xs text-slate-400">Be the first to say something!</p>
            </div>
          ) : (
            visibleMessages.map(msg => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                onReact={toggleReaction}
                onOpenThread={setThreadMsg}
              />
            ))
          )}
          {isTyping && (
            <div className="flex items-center gap-3 px-4 py-2">
              <UserAvatar userId={activeDm ?? 'u-ali'} size="md" />
              <div className="bg-slate-100 rounded-xl px-3 py-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2">
            <button className="text-slate-400 hover:text-slate-600 flex-shrink-0"><FiPaperclip size={16} /></button>
            <input
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={`Message ${headerTitle}...`}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 flex-shrink-0">
              <button className="text-slate-400 hover:text-slate-600"><FiAtSign size={16} /></button>
              <button className="text-slate-400 hover:text-slate-600"><FiSmile size={16} /></button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim()}
                className="ml-1 p-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiSend size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals & drawers */}
      {threadMsg && <ThreadDrawer msg={threadMsg} onClose={() => setThreadMsg(null)} />}
      {profileUser && <UserProfilePopover userId={profileUser} onClose={() => setProfileUser(null)} />}
      {showCreateChannel && <CreateChannelModal onClose={() => setShowCreateChannel(false)} onCreate={addChannel} />}
      {showQuickTask && <QuickTaskModal onClose={() => setShowQuickTask(false)} onAdd={() => {}} />}
    </div>
  );
}