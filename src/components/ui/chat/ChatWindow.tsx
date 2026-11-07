'use client';

import React, { useRef, useState } from 'react';
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
  FiCornerDownRight,
  FiPaperclip,
  FiFileText,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';
import type { ChatAttachment } from './ChatView';


interface ChatWindowProps {
  session: any;
  isFocused: boolean;
  primaryColor: string;
  messages: any[];
  getUser: (id: string) => any;
  onSendMessage: (sessionId: string, text: string, attachments?: ChatAttachment[]) => void;
  onCloseSession: (sessionId: string, e: React.MouseEvent) => void;
  onOpenTaskPanel: () => void;
  onOpenCalendarPanel?: () => void;
  onOpenCalendarEvent?: (eventId: string) => void;
  setThreadMessage: (msg: any) => void;
  setProfileUser: (user: any) => void;
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
  primaryColor,
  messages,
  getUser,
  onSendMessage,
  onCloseSession,
  onOpenTaskPanel,
  onOpenCalendarPanel,
  onOpenCalendarEvent,
  setThreadMessage,
  setProfileUser,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<ChatAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const sessionMessages = messages.filter((m) => {
    if (session.type === 'channel') return m.channelId === session.targetId;
    return (
      (m.senderId === 'u-me' && m.recipientId === session.targetId) ||
      (m.senderId === session.targetId && m.recipientId === 'u-me')
    );
  });

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    onSendMessage(session.id, inputText.trim(), pendingFiles.length ? pendingFiles : undefined);
    setInputText('');
    setPendingFiles([]);
    setShowEmoji(false);
  };

  return (
    <div
      style={isFocused ? { outlineColor: primaryColor } : undefined}
      className={`flex-1 min-w-[340px] flex flex-col h-full bg-white transition-all ${
        isFocused ? 'ring-2 ring-inset' : 'opacity-95'
      }`}
    >
      {/* Window Header */}
      <div className={`h-13 px-4 border-b flex items-center justify-between shrink-0 ${isFocused ? 'bg-white border-slate-200' : 'bg-slate-50/50 border-slate-100'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {session.type === 'channel' ? (
            <div style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }} className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
              {session.isPrivate ? <FiLock size={13} /> : <FiHash size={15} />}
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200/50">
              <img
                src={getDiceBearAvatar(session.title)}
                alt={session.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="truncate">
            <h3 className="font-bold text-xs text-slate-900 truncate">{session.title}</h3>
            <p className="text-[10px] text-slate-400 truncate">{session.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition" title="Start Call"><FiPhone size={13} /></button>
          <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition" title="Start Video Huddle"><FiVideo size={13} /></button>
          <button onClick={(e) => onCloseSession(session.id, e)} className="p-1.5 hover:bg-slate-100 hover:text-rose-600 rounded-lg transition" title="Close Window">
            <FiX size={13} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1.5 bg-slate-50/40 scrollbar-thin" ref={messageContainerRef}>
        {sessionMessages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10">
            <div style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }} className="w-12 h-12 rounded-2xl flex items-center justify-center">
              <FiHash size={20} />
            </div>
            <p className="text-xs font-bold text-slate-700">
              {session.title} ki shuruaat karein
            </p>
            <p className="text-[10px] text-slate-400 max-w-[240px] leading-relaxed">
              Pehla message bhejein — emoji, files, ya task cards sab yahan share ho sakte hain.
            </p>
          </div>
        )}

        {sessionMessages.map((msg) => {
          const sender = getUser(msg.senderId);
          return (
            <div key={msg.id} className="group relative flex items-start gap-2.5 p-2 rounded-xl hover:bg-white hover:shadow-2xs transition border border-transparent hover:border-slate-200/60">
              <div
                onClick={() => setProfileUser(sender)}
                className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer border border-slate-200/50"
              >
                <img
                  src={getDiceBearAvatar(sender.name)}
                  alt={sender.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span onClick={() => setProfileUser(sender)} className="font-bold text-xs text-slate-900 hover:underline cursor-pointer">
                    {sender.name}
                  </span>
                  <span className="text-[9px] text-slate-400">{msg.timestamp}</span>
                </div>

                {msg.content && (
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap break-words">{msg.content}</div>
                )}

                {/* File Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {msg.attachments.map((att: ChatAttachment) =>
                      isImage(att.type) && att.url ? (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-[180px] rounded-xl border border-slate-200 overflow-hidden bg-white hover:border-slate-300 transition shadow-2xs"
                          title={`${att.name} (${formatSize(att.size)})`}
                        >
                          <img src={att.url} alt={att.name} className="w-full h-24 object-cover" />
                          <div className="px-2 py-1 text-[9px] text-slate-500 truncate border-t border-slate-100">
                            {att.name} • {formatSize(att.size)}
                          </div>
                        </a>
                      ) : (
                        <a
                          key={att.id}
                          href={att.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 transition shadow-2xs max-w-[220px]"
                          title={formatSize(att.size)}
                        >
                          <span style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }} className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                            <FiFileText size={13} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-[10px] font-bold text-slate-700 truncate">{att.name}</span>
                            <span className="block text-[9px] text-slate-400">{formatSize(att.size)}</span>
                          </span>
                        </a>
                      )
                    )}
                  </div>
                )}

                {msg.taskRef && (
                  <div className="mt-2 p-3 bg-white border-2 border-emerald-500/30 rounded-xl shadow-2xs max-w-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <FiCheckSquare size={11} /> ClickUp Task Card
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                        {msg.taskRef.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.taskRef.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                      <span>Assignee: <strong>{msg.taskRef.assigneeName}</strong></span>
                      <span>Due: {msg.taskRef.dueDate}</span>
                    </div>
                    <button
                      onClick={onOpenTaskPanel}
                      className="mt-2 w-full py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition text-center flex items-center justify-center gap-1"
                    >
                      <span>Open in Workstation</span>
                      <FiExternalLink size={10} />
                    </button>
                  </div>
                )}

                {msg.eventRef && (
                  <div className="mt-2 p-3 bg-white border-2 border-blue-500/30 rounded-xl shadow-2xs max-w-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                        <FiCalendar size={11} /> Team Schedule / Event
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                        {msg.eventRef.time || 'Upcoming'}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.eventRef.title}</h4>
                    {msg.eventRef.description && (
                      <p className="text-[10px] text-slate-500 mb-1.5 line-clamp-2 leading-relaxed">
                        {msg.eventRef.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                      <span>Date: <strong>{msg.eventRef.date}</strong></span>
                      <span>Category: <strong className="capitalize">{msg.eventRef.color || 'blue'}</strong></span>
                    </div>
                    {onOpenCalendarPanel && (
                      <button
                        onClick={onOpenCalendarPanel}
                        className="mt-2 w-full py-1 text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition text-center flex items-center justify-center gap-1"
                      >
                        <span>View in Calendar</span>
                        <FiExternalLink size={10} />
                      </button>
                    )}
                  </div>
                )}

                {msg.repliesCount > 0 && (
                  <button onClick={() => setThreadMessage(msg)} style={{ color: primaryColor }} className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold hover:underline">
                    <FiCornerDownRight size={11} />
                    <span>{msg.repliesCount} replies</span>
                  </button>
                )}

                {/* Hover thread action on any message */}
                {msg.repliesCount === 0 && (
                  <button
                    onClick={() => setThreadMessage(msg)}
                    className="mt-0.5 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-slate-700 opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiCornerDownRight size={10} />
                    <span>Reply in thread</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Composer */}
      <div className="p-3 bg-white border-t border-slate-100 relative">
        {showEmoji && (
          <div className="absolute bottom-16 right-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
            <EmojiPicker
              theme={Theme.LIGHT}
              onEmojiClick={(data) => setInputText((prev) => prev + data.emoji)}
              width={280}
              height={340}
            />
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="hidden"
        />

        <form
          onSubmit={handleSend}
          className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-slate-300 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all shadow-2xs"
        >
          {/* Pending attachment chips */}
          {pendingFiles.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-2.5 pt-2.5">
              {pendingFiles.map((f) => (
                <div key={f.id} className="flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  {isImage(f.type) && f.url ? (
                    <img src={f.url} alt={f.name} className="w-6 h-6 rounded object-cover" />
                  ) : (
                    <span style={{ backgroundColor: `${primaryColor}12`, color: primaryColor }} className="w-6 h-6 rounded flex items-center justify-center">
                      <FiFileText size={11} />
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-slate-600 max-w-[120px] truncate">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setPendingFiles((prev) => prev.filter((p) => p.id !== f.id))}
                    className="p-0.5 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove"
                  >
                    <FiX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={`Message ${session.type === 'channel' ? '#' : '@'}${session.title}...`}
            className="w-full bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none"
          />
          <div className="px-2.5 py-1.5 bg-slate-100/60 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-slate-500">
              <button
                type="button"
                onClick={() => setShowEmoji(!showEmoji)}
                className={`p-1.5 hover:bg-slate-200 rounded-lg transition ${showEmoji ? 'text-slate-800' : ''}`}
                title="Emoji"
              >
                <FiSmile size={13} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition"
                title="Attach files"
              >
                <FiPaperclip size={13} />
              </button>
              {onOpenCalendarPanel && (
                <button
                  type="button"
                  onClick={onOpenCalendarPanel}
                  className="p-1.5 hover:bg-slate-200 rounded-lg transition text-slate-500 hover:text-blue-600"
                  title="Team Calendar & Schedule"
                >
                  <FiCalendar size={13} />
                </button>
              )}
              <span className="hidden sm:inline text-[9px] text-slate-400 pl-1.5">
                {pendingFiles.length > 0 ? `${pendingFiles.length} file(s) attached` : 'Emoji, files ya calendar event share karein'}
              </span>
            </div>
            <button
              type="submit"
              disabled={!canSend}
              style={{ backgroundColor: primaryColor }}
              className="px-3 py-1 rounded-lg disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 transition"
            >
              <span>Send</span>
              <FiSend size={10} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}