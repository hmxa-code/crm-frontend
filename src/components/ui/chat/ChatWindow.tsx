'use client';

import React, { useRef, useState, useEffect } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import {
  FiHash,
  FiLock,
  FiPhone,
  FiVideo,
  FiX,
  FiSmile,
  FiSend,
  FiCheckSquare,
  FiCalendar,
  FiExternalLink,
  FiPaperclip,
  FiFileText,
  FiMessageSquare,
  FiMenu
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import type { ChatAttachment } from './ChatView';

interface ChatWindowProps {
  session: any;
  isFocused: boolean;
  primaryColor?: string;
  messages: any[];
  getUser: (id: string) => any;
  onSendMessage: (sessionId: string, text: string, attachments?: ChatAttachment[]) => void;
  onCloseSession: (sessionId: string, e: React.MouseEvent) => void;
  onOpenTaskPanel: () => void;
  onOpenCalendarPanel?: () => void;
  onOpenCalendarEvent?: (eventId: string) => void;
  setThreadMessage: (msg: any) => void;
  setProfileUser: (user: any) => void;
  onToggleMobileSidebar?: () => void;
}

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const isImage = (type: string) => type.startsWith('image/');

export default function ChatWindow({
  session,
  isFocused,
  messages,
  getUser,
  onSendMessage,
  onCloseSession,
  onOpenTaskPanel,
  setThreadMessage,
  setProfileUser,
  onToggleMobileSidebar,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<ChatAttachment[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const emojiTriggerRef = useRef<HTMLButtonElement>(null);

  const sessionMessages = messages.filter((m) => {
    if (session.type === 'channel') return m.channelId === session.targetId;
    return (
      (m.senderId === 'u-me' && m.recipientId === session.targetId) ||
      (m.senderId === session.targetId && m.recipientId === 'u-me')
    );
  });

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages.length]);

  // Click outside listener for emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showEmoji &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        emojiTriggerRef.current &&
        !emojiTriggerRef.current.contains(event.target as Node)
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmoji]);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const mapped: ChatAttachment[] = Array.from(files).map((f) => ({
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      size: f.size,
      type: f.type || 'file',
      url: isImage(f.type) ? URL.createObjectURL(f) : undefined,
    }));
    setPendingFiles((prev) => [...prev, ...mapped]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const canSend = inputText.trim().length > 0 || pendingFiles.length > 0;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSend) return;
    onSendMessage(session.id, inputText.trim(), pendingFiles.length ? pendingFiles : undefined);
    setInputText('');
    setPendingFiles([]);
    setShowEmoji(false);
  };

  return (
    <div
      className={`flex-1 min-w-0 flex flex-col h-full bg-white transition-all ${
        isFocused ? 'ring-1 ring-slate-900/10' : 'opacity-95'
      }`}
    >
      {/* Window Header */}
      <div className="h-14 px-3 sm:px-4 border-b border-slate-200/90 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition shrink-0 cursor-pointer"
              title="Channels & DMs"
            >
              <FiMenu size={17} />
            </button>
          )}

          {session.type === 'channel' ? (
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200">
              {session.isPrivate ? <FiLock size={13} /> : <FiHash size={15} />}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
              <img
                src={getDiceBearAvatar(session.title)}
                alt={session.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 truncate tracking-tight">
              {session.title}
            </h3>
            <p className="text-[10px] text-slate-400 truncate">{session.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500 shrink-0">
          <button
            className="p-2 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition cursor-pointer"
            title="Start Audio Call"
          >
            <FiPhone size={14} />
          </button>
          <button
            className="p-2 hover:bg-slate-100 hover:text-slate-900 rounded-lg transition cursor-pointer"
            title="Start Video Huddle"
          >
            <FiVideo size={14} />
          </button>
          <button
            onClick={(e) => onCloseSession(session.id, e)}
            className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition cursor-pointer"
            title="Close Window Tab"
          >
            <FiX size={15} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 bg-slate-50/50 scrollbar-thin">
        {sessionMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2.5 py-12">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
              <FiHash size={22} />
            </div>
            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                Welcome to #{session.title}
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                This is the start of this conversation. Send text messages, attachments, or task cards below.
              </p>
            </div>
          </div>
        )}

        {sessionMessages.map((msg) => {
          const sender = getUser(msg.senderId);
          const isMe = msg.senderId === 'u-me';

          return (
            <div
              key={msg.id}
              className="group relative flex items-start gap-2.5 sm:gap-3 p-2.5 rounded-xl hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-slate-200/60"
            >
              <div
                onClick={() => setProfileUser(sender)}
                className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer border border-slate-200 shadow-2xs"
              >
                <img
                  src={getDiceBearAvatar(sender?.name || 'User')}
                  alt={sender?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    onClick={() => setProfileUser(sender)}
                    className="font-bold text-xs text-slate-900 hover:underline cursor-pointer"
                  >
                    {sender?.name || 'User'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                  {isMe && (
                    <span className="text-[9px] font-bold text-slate-900 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                      You
                    </span>
                  )}
                </div>

                {msg.content && (
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                )}

                {/* File Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.attachments.map((att: ChatAttachment) =>
                      isImage(att.type) && att.url ? (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[200px] rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition shadow-xs"
                          title={`${att.name} (${formatSize(att.size)})`}
                        >
                          <img src={att.url} alt={att.name} className="w-full h-28 object-cover" />
                          <div className="px-2 py-1 text-[10px] text-slate-600 truncate border-t border-slate-100">
                            {att.name} • {formatSize(att.size)}
                          </div>
                        </a>
                      ) : (
                        <a
                          key={att.id}
                          href={att.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition shadow-xs max-w-xs"
                          title={formatSize(att.size)}
                        >
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
                            <FiFileText size={14} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-slate-800 truncate">
                              {att.name}
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              {formatSize(att.size)}
                            </span>
                          </span>
                        </a>
                      )
                    )}
                  </div>
                )}

                {/* Task Card Reference */}
                {msg.taskRef && (
                  <div className="mt-2.5 p-3.5 bg-white border border-slate-300 rounded-xl shadow-xs max-w-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <FiCheckSquare size={12} /> ClickUp Task Card
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {msg.taskRef.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.taskRef.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>
                        Assignee: <strong className="text-slate-800">{msg.taskRef.assigneeName}</strong>
                      </span>
                      <span>Due: {msg.taskRef.dueDate}</span>
                    </div>
                    <button
                      onClick={onOpenTaskPanel}
                      className="mt-2.5 w-full py-1.5 text-[11px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition text-center flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200"
                    >
                      <span>Open Task in Workstation</span>
                      <FiExternalLink size={11} />
                    </button>
                  </div>
                )}

                {/* Event Card Reference */}
                {msg.eventRef && (
                  <div className="mt-2.5 p-3.5 bg-white border border-slate-300 rounded-xl shadow-xs max-w-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                        <FiCalendar size={12} /> Team Schedule / Event
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.eventRef.title}</h4>
                    <div className="text-[11px] text-slate-600 mb-2">
                      <span>{msg.eventRef.date}</span> • <span>{msg.eventRef.time}</span>
                    </div>
                    {msg.eventRef.description && (
                      <p className="text-[11px] text-slate-500 mb-2">{msg.eventRef.description}</p>
                    )}
                  </div>
                )}

                {/* Thread reply button */}
                <div className="mt-1 flex items-center gap-3">
                  <button
                    onClick={() => setThreadMessage(msg)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    <FiMessageSquare size={12} />
                    <span>{msg.repliesCount ? `${msg.repliesCount} replies` : 'Reply in thread'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {/* Input Composer Area */}
      <div className="p-3 border-t border-slate-200/90 bg-white relative shrink-0">
        {/* Pending attachment chips */}
        {pendingFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 pb-2.5 mb-2 border-b border-slate-100">
            {pendingFiles.map((file, idx) => (
              <span
                key={file.id}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700"
              >
                <FiPaperclip size={11} className="text-slate-400" />
                <span className="max-w-[130px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setPendingFiles(pendingFiles.filter((_, i) => i !== idx))}
                  className="hover:text-rose-600 p-0.5 rounded cursor-pointer"
                >
                  <FiX size={11} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Soft, Native-feeling Emoji Picker Popover */}
        {showEmoji && (
          <div
            ref={emojiPickerRef}
            className="absolute bottom-16 left-3 z-50 shadow-2xl rounded-2xl border border-slate-200 overflow-hidden bg-white/95 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
          >
            <EmojiPicker
              theme={Theme.LIGHT}
              onEmojiClick={(emojiData) => {
                setInputText((prev) => prev + emojiData.emoji);
              }}
              width={310}
              height={360}
              searchPlaceHolder="Search emoji..."
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 bg-slate-50/90 border border-slate-200 focus-within:border-slate-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 rounded-2xl p-2 transition-all shadow-2xs"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
            multiple
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer shrink-0 mb-0.5"
            title="Attach Files"
          >
            <FiPaperclip size={16} />
          </button>

          <button
            ref={emojiTriggerRef}
            type="button"
            onClick={() => setShowEmoji(!showEmoji)}
            className={`p-2 rounded-xl transition cursor-pointer shrink-0 mb-0.5 ${
              showEmoji
                ? 'bg-slate-200 text-slate-900'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60'
            }`}
            title="Insert Emoji"
          >
            <FiSmile size={16} />
          </button>

          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={`Message ${session.type === 'channel' ? '#' : '@'}${session.title}...`}
            className="flex-1 min-w-0 bg-transparent py-2 text-xs text-slate-900 placeholder-slate-400 outline-none resize-none max-h-24 scrollbar-thin"
          />

          <button
            type="submit"
            disabled={!canSend}
            className={`p-2.5 rounded-xl transition-all shrink-0 cursor-pointer mb-0.5 ${
              canSend
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <FiSend size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}