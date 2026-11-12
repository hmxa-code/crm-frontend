'use client';

import React, { useState } from 'react';
import { FiX, FiHash, FiLock, FiUsers, FiShield, FiCheck } from 'react-icons/fi';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: (channelData: {
    name: string;
    description: string;
    isPrivate: boolean;
    messagingPermission: 'all' | 'admin' | 'specific';
  }) => void;
  primaryColor?: string;
}

export default function CreateChannelModal({
  isOpen,
  onClose,
  onCreateChannel,
  primaryColor = '#0f172a',
}: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [messagingPermission, setMessagingPermission] = useState<'all' | 'admin' | 'specific'>('all');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim()) return;

    onCreateChannel({
      name: channelName.trim().toLowerCase().replace(/\s+/g, '-'),
      description: description.trim(),
      isPrivate,
      messagingPermission,
    });

    // Reset & close
    setChannelName('');
    setDescription('');
    setIsPrivate(false);
    setMessagingPermission('all');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 text-white shadow-xs">
              <FiHash size={16} />
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">Create New Channel</h3>
              <p className="text-[10px] text-slate-500 font-medium">Configure permissions & messaging rules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[80vh] scrollbar-thin">
          
          {/* Channel Name */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              Channel Name *
            </label>
            <div className="flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus-within:bg-white focus-within:border-slate-400 transition">
              <span className="text-slate-400 font-bold mr-1.5">#</span>
              <input
                type="text"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
                placeholder="e.g. q4-marketing-launch"
                className="w-full bg-transparent border-none outline-none text-xs text-slate-900 font-semibold placeholder-slate-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this channel about?"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700">
                {isPrivate ? <FiLock size={14} /> : <FiUsers size={14} />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Make Private Channel</h4>
                <p className="text-[10px] text-slate-500">Only invited members can view and join</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPrivate(!isPrivate)}
              className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                isPrivate ? 'bg-slate-900' : 'bg-slate-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  isPrivate ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Messaging Permissions (WhatsApp / Slack style) */}
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">
              Who can send messages in this channel?
            </label>
            <div className="space-y-2">
              {[
                { key: 'all', label: 'All Members', desc: 'Everyone in the channel can chat and reply' },
                { key: 'admin', label: 'Admin Only (Broadcast)', desc: 'Only admins/creators can send messages' },
                { key: 'specific', label: 'Specific Persons Allowed', desc: 'Select authorized speakers only' },
              ].map((opt) => (
                <div
                  key={opt.key}
                  onClick={() => setMessagingPermission(opt.key as any)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                    messagingPermission === opt.key
                      ? 'border-slate-900 bg-slate-50 shadow-2xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      messagingPermission === opt.key ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300'
                    }`}>
                      {messagingPermission === opt.key && <FiCheck size={10} />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{opt.label}</h5>
                      <p className="text-[10px] text-slate-500">{opt.desc}</p>
                    </div>
                  </div>
                  <FiShield size={14} className={messagingPermission === opt.key ? 'text-slate-900' : 'text-slate-300'} />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!channelName.trim()}
              style={{ backgroundColor: primaryColor }}
              className="flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-xs transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
            >
              Create Channel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}