'use client';

import { FiX } from 'react-icons/fi';
import { getDiceBearAvatar } from '@/src/utils/avatarHelper';

interface ChatUserProfileModalProps {
  profileUser: any;
  primaryColor: string;
  onClose: () => void;
  onOpenDM: (userId: string) => void;
}

export default function ChatUserProfileModal({
  profileUser,
  primaryColor,
  onClose,
  onOpenDM,
}: ChatUserProfileModalProps) {
  if (!profileUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header Cover */}
        <div
          style={{
            background: `linear-gradient(135deg, #0f172a, #334155)`,
          }}
          className="h-20 p-4 flex justify-end items-start"
        >
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="-mt-10 mb-3 flex items-end justify-between">
            <div
              className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-lg border-4 border-white"
            >
              <img
                src={getDiceBearAvatar(profileUser.name)}
                alt={profileUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${
                profileUser.status === 'online'
                  ? 'bg-slate-100 border-slate-300 text-slate-800'
                  : profileUser.status === 'busy'
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              ● {profileUser.status}
            </span>
          </div>

          <h3 className="font-bold text-lg text-slate-900">{profileUser.name}</h3>
          <p className="text-xs font-semibold text-slate-700">
            {profileUser.title || profileUser.role}
          </p>
          <p className="text-xs text-slate-500 mt-1 italic">
            &quot;{profileUser.statusText || 'Active on CRM Workspace'}&quot;
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Department</span>
              <span className="font-semibold text-slate-800">{profileUser.department || 'Operations'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Email</span>
              <span className="font-semibold text-slate-800">{profileUser.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Phone</span>
              <span className="font-semibold text-slate-800">{profileUser.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Location</span>
              <span className="font-semibold text-slate-800">{profileUser.location || 'Karachi, Pakistan'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Pipeline</span>
              <span className="font-semibold text-slate-900">{profileUser.activeDeals || 'Active'}</span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => {
                onOpenDM(profileUser.id);
                onClose();
              }}
              style={{ backgroundColor: '#0f172a' }}
              className="flex-1 py-2 rounded-xl text-white font-semibold text-xs shadow-xs transition text-center hover:opacity-90 bg-slate-900"
            >
              Send Message
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}