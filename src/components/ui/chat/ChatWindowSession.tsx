'use client';

import React, { useState } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import {
  FiHash,
  FiLock,
  FiPhone,
  FiVideo,
  FiX,
  FiSmile,
  FiCheckSquare,
  FiSend,
  FiExternalLink,
  FiCornerDownRight,
} from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';

interface ChatWindowSessionProps {
  session: any;
  isFocused: boolean;
  primaryColor: string;
  messages: any[];
  getUser: (id: string) => any;
  onSendMessage: (sessionId: string, text: string) => void;
  onCloseSession: (sessionId: string, e: React.MouseEvent) => void;
  onOpenTaskPanel: () => void;
  onOpenTaskModal: () => void;
  setThreadMessage: (msg: any) => void;
  setProfileUser: (user: any) => void;
}

export default function ChatWindowSession({
  session,
  isFocused,
  messages,
  getUser,
  onSendMessage,
  onCloseSession,
  onOpenTaskPanel,
  onOpenTaskModal,
  setThreadMessage,
  setProfileUser,
}: ChatWindowSessionProps) {
  const [inputText, setInputText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  const sessionMessages = messages.filter((m) => {
    if (session.type === 'channel') return m.channelId === session.targetId;
    return (
      (m.senderId === 'u-me' && m.recipientId === session.targetId) ||
      (m.senderId === session.targetId && m.recipientId === 'u-me')
    );
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(session.id, inputText.trim());
    setInputText('');
    setShowEmoji(false);
  };

  return (
    <div
      style={isFocused ? { outlineColor: '#0f172a' } : undefined}
      className={`flex-1 min-w-[340px] flex flex-col h-full bg-white transition-all ${
        isFocused ? 'ring-2 ring-inset ring-slate-900' : 'opacity-95'
      }`}
    >
      {/* Session Header */}
      <div className={`h-13 px-4 border-b flex items-center justify-between shrink-0 ${isFocused ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-50/40 border-slate-100'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {session.type === 'channel' ? (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 bg-slate-100 text-slate-800 border border-slate-200">
              {session.isPrivate ? <FiLock size={14} /> : <FiHash size={16} />}
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
          <div className="truncate">
            <h3 className="font-bold text-xs text-slate-900 truncate">{session.title}</h3>
            <p className="text-[10px] text-slate-500 truncate">{session.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <button className="p-1.5 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"><FiPhone size={14} /></button>
          <button className="p-1.5 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"><FiVideo size={14} /></button>
          <button onClick={(e) => onCloseSession(session.id, e)} className="p-1.5 hover:bg-slate-200/60 hover:text-slate-900 rounded-xl transition cursor-pointer">
            <FiX size={14} />
          </button>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/30 scrollbar-thin">
        {sessionMessages.map((msg) => {
          const sender = getUser(msg.senderId);
          return (
            <div key={msg.id} className="group relative flex items-start gap-2.5 p-2 rounded-xl hover:bg-white hover:shadow-2xs transition border border-transparent hover:border-slate-200/60">
              <div
                onClick={() => setProfileUser(sender)}
                className="w-7 h-7 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 cursor-pointer border border-slate-200"
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
                  <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
                </div>

                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                {/* Embedded ClickUp Task Card */}
                {msg.taskRef && (
                  <div className="mt-2 p-3 bg-white border border-slate-200 rounded-xl shadow-xs max-w-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-800 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                        <FiCheckSquare size={12} /> ClickUp Task Card
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                        {msg.taskRef.priority}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">{msg.taskRef.title}</h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100">
                      <span>Assignee: <strong className="text-slate-800">{msg.taskRef.assigneeName}</strong></span>
                      <span>Due: <strong className="text-slate-800">{msg.taskRef.dueDate}</strong></span>
                    </div>
                    <button
                      onClick={onOpenTaskPanel}
                      className="mt-2 w-full py-1.5 text-[10px] font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition text-center flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Open in Workstation</span>
                      <FiExternalLink size={11} />
                    </button>
                  </div>
                )}

                {msg.repliesCount > 0 && (
                  <button onClick={() => setThreadMessage(msg)} className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-slate-900 hover:underline cursor-pointer">
                    <FiCornerDownRight size={12} />
                    <span>{msg.repliesCount} replies</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="p-3 bg-white border-t border-slate-100 relative">
        {showEmoji && (
          <div className="absolute bottom-20 left-3 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <EmojiPicker
              theme={Theme.LIGHT}
              onEmojiClick={(data) => setInputText((prev) => prev + data.emoji)}
              width={320}
              height={380}
            />
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:bg-white focus-within:border-slate-900 transition-all shadow-2xs p-2"
        >
          <textarea
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={`Message ${session.title}...`}
            className="w-full bg-transparent px-2 py-1 text-xs text-slate-900 placeholder-slate-400 outline-none resize-none max-h-24 scrollbar-thin"
          />
          <div className="px-2 pt-1.5 mt-1 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-500">
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-1.5 hover:bg-slate-200 rounded-xl transition cursor-pointer">
                <FiSmile size={14} />
              </button>
              <button type="button" onClick={onOpenTaskModal} className="p-1.5 hover:bg-slate-200 rounded-xl transition text-slate-700 cursor-pointer">
                <FiCheckSquare size={14} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 transition hover:bg-slate-800 cursor-pointer"
            >
              <span>Send</span>
              <FiSend size={11} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}