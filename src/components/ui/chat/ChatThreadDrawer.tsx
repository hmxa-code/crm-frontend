'use client';

import React, { useState } from 'react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { FiX, FiMessageSquare, FiSmile, FiSend } from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';

interface ChatThreadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  threadMessage: any;
  primaryColor: string;
  getUser: (id: string) => any;
  onSendThreadReply: (messageId: string, replyText: string) => void;
}

export default function ChatThreadDrawer({
  isOpen,
  onClose,
  threadMessage,
  primaryColor,
  getUser,
  onSendThreadReply,
}: ChatThreadDrawerProps) {
  const [threadInput, setThreadInput] = useState('');
  const [openEmoji, setOpenEmoji] = useState(false);

  if (!isOpen || !threadMessage) return null;

  const rootSender = getUser(threadMessage.senderId);

  return (
    <aside className="w-80 md:w-96 border-l border-slate-200 bg-white flex flex-col shrink-0 z-30 shadow-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <FiMessageSquare size={15} className="text-slate-800" />
          <h3 className="font-bold text-xs text-slate-900">Thread Discussion</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-lg transition"
        >
          <FiX size={15} />
        </button>
      </div>

      {/* Root Message Card */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/40">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/50">
            <img
              src={getDiceBearAvatar(rootSender.name)}
              alt={rootSender.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-bold text-xs text-slate-900">{rootSender.name}</span>
          <span className="text-[10px] text-slate-400">{threadMessage.timestamp}</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed mt-1">{threadMessage.content}</p>
      </div>

      {/* Thread Replies Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {threadMessage.thread && threadMessage.thread.length > 0 ? (
          threadMessage.thread.map((t: any) => {
            const replySender = getUser(t.senderId);
            return (
              <div key={t.id} className="flex items-start gap-2.5 p-1.5 hover:bg-slate-50 rounded-lg">
                <div className="w-6 h-6 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 mt-0.5 border border-slate-200/50">
                  <img
                    src={getDiceBearAvatar(replySender.name)}
                    alt={replySender.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-slate-900">{replySender.name}</span>
                    <span className="text-[10px] text-slate-400">{t.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words">{t.content}</p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-slate-400 text-center py-6">
            No replies yet. Type below to start this thread.
          </p>
        )}
      </div>

      {/* Reply Composer */}
      <div className="p-3 border-t border-slate-100 relative bg-white">
        {openEmoji && (
          <div className="absolute bottom-14 right-2 z-50 shadow-2xl rounded-2xl overflow-hidden border border-slate-200">
            <EmojiPicker
              theme={Theme.LIGHT}
              onEmojiClick={(data) => {
                setThreadInput((prev) => prev + data.emoji);
                setOpenEmoji(false);
              }}
              width={280}
              height={340}
            />
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!threadInput.trim()) return;
            onSendThreadReply(threadMessage.id, threadInput);
            setThreadInput('');
          }}
          className="flex items-center gap-1.5"
        >
          <button
            type="button"
            onClick={() => setOpenEmoji(!openEmoji)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
            title="Add Emoji"
          >
            <FiSmile size={16} />
          </button>
          <input
            type="text"
            value={threadInput}
            onChange={(e) => setThreadInput(e.target.value)}
            placeholder="Reply in thread..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!threadInput.trim()}
            style={{ backgroundColor: '#0f172a' }}
            className="p-2 disabled:opacity-40 text-white rounded-xl transition shadow-2xs hover:opacity-90 bg-slate-900"
          >
            <FiSend size={13} />
          </button>
        </form>
      </div>
    </aside>
  );
}