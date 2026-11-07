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
  FiPaperclip,
  FiCheckSquare,
  FiTrendingUp,
  FiSend,
  FiExternalLink,
  FiCornerDownRight,
  FiFileText,
} from 'react-icons/fi';
import { BsPinAngle } from 'react-icons/bs';
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
  primaryColor,
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

  return (
    <div
      style={isFocused ? { outlineColor: primaryColor } : undefined}
      className={`flex-1 min-w-[340px] flex flex-col h-full bg-white transition-all ${
        isFocused ? 'ring-2 ring-inset' : 'opacity-95'
      }`}
    >
      {/* Session Header */}
      <div className={`h-13 px-4 border-b flex items-center justify-between shrink-0 ${isFocused ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100'}`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          {session.type === 'channel' ? (
            <div style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }} className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
              {session.isPrivate ? <FiLock size={14} /> : <FiHash size={16} />}
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
          <button className="p-1.5 hover:bg-slate-100 rounded-lg"><FiPhone size={14} /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg"><FiVideo size={14} /></button>
          <button onClick={(e) => onCloseSession(session.id, e)} className="p-1.5 hover:bg-slate-100 hover:text-rose-600 rounded-lg">
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

                <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">{msg.content}</div>

                {/* Embedded ClickUp Task Card */}
                {msg.taskRef && (
                  <div className="mt-2 p-3 bg-white border-2 border-emerald-500/30 rounded-xl shadow-xs max-w-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        <FiCheckSquare size={12} /> ClickUp Task Card
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
                      <FiExternalLink size={11} />
                    </button>
                  </div>
                )}

                {msg.repliesCount > 0 && (
                  <button onClick={() => setThreadMessage(msg)} style={{ color: primaryColor }} className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold hover:underline">
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
          <div className="absolute bottom-16 right-4 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
            <EmojiPicker
              theme={Theme.LIGHT}
              onEmojiClick={(data) => setInputText((prev) => prev + data.emoji)}
              width={280}
              height={340}
            />
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!inputText.trim()) return;
            onSendMessage(session.id, inputText);
            setInputText('');
          }}
          className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:bg-white transition-all shadow-2xs"
        >
          <textarea
            rows={2}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message ${session.title}...`}
            className="w-full bg-transparent px-3 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none resize-none"
          />
          <div className="px-2.5 py-1.5 bg-slate-100/60 border-t border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-500">
              <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="p-1.5 hover:bg-slate-200 rounded-lg">
                <FiSmile size={14} />
              </button>
              <button type="button" onClick={onOpenTaskModal} className="p-1.5 hover:bg-emerald-100 rounded-lg text-emerald-600">
                <FiCheckSquare size={14} />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{ backgroundColor: primaryColor }}
              className="px-3 py-1 rounded-lg disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1 transition"
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