'use client';

import React, { useState } from 'react';
import { 
  FiRefreshCw, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiTrash2, 
  FiTrendingUp, 
  FiUsers, 
  FiEye, 
  FiFileText,
  FiExternalLink,
  FiShield
} from 'react-icons/fi';
import { SocialAccount } from '@/src/types/marketing/social-account';
import { ChannelPlatformBadge } from '../content-engine/shared/ChannelPlatformBadge';

interface SocialAccountCardProps {
  account: SocialAccount;
  onDisconnect: (id: string) => void;
  onReconnect: (id: string) => void;
  onToggleAutoSync: (id: string) => void;
  onSyncSingle: (id: string) => void;
}

export const SocialAccountCard: React.FC<SocialAccountCardProps> = ({ 
  account, 
  onDisconnect,
  onReconnect,
  onToggleAutoSync,
  onSyncSingle
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncSingle(account._id);
      setIsSyncing(false);
    }, 600);
  };

  const isConnected = account.status === 'Connected';
  const isExpired = account.status === 'Expired';

  const getPlatformAccent = () => {
    switch (account.platform) {
      case 'Instagram':
        return 'from-pink-500/10 to-rose-500/5 border-pink-200/80';
      case 'LinkedIn':
        return 'from-sky-500/10 to-blue-500/5 border-sky-200/80';
      case 'Facebook':
        return 'from-blue-600/10 to-indigo-500/5 border-blue-200/80';
      case 'Twitter':
        return 'from-slate-600/10 to-slate-800/5 border-slate-300';
      case 'YouTube':
        return 'from-red-600/10 to-rose-500/5 border-red-200/80';
      case 'WhatsApp':
        return 'from-emerald-500/10 to-teal-500/5 border-emerald-200/80';
      case 'TikTok':
        return 'from-rose-500/10 to-neutral-700/5 border-rose-200/80';
      default:
        return 'from-indigo-500/10 to-cyan-500/5 border-indigo-200/80';
    }
  };

  return (
    <div className={`h-full w-full bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between overflow-hidden ${
      isExpired ? 'border-amber-300 ring-1 ring-amber-200/80 shadow-xs' : 'border-slate-200/90 shadow-2xs'
    }`}>
      {/* Top Banner with Platform Accent */}
      <div className={`p-3.5 sm:p-4 bg-gradient-to-r ${getPlatformAccent()} border-b border-slate-100 flex items-start justify-between gap-2.5 sm:gap-3`}>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="relative shrink-0">
            <img 
              src={account.avatar_url || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=100&auto=format&fit=crop&q=80'} 
              alt={account.account_name} 
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover border border-white shadow-2xs"
            />
            <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
              isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate tracking-tight" title={account.account_name}>
                {account.account_name}
              </h4>
              <span className="shrink-0">
                <ChannelPlatformBadge platform={account.platform} size="sm" />
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-mono text-slate-500 truncate mt-0.5">{account.handle || `@${account.account_id}`}</p>
            {account.category && (
              <span className="text-[10px] text-slate-500 font-medium truncate block mt-0.5">
                {account.category}
              </span>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <div className="shrink-0 ml-1">
          {isConnected ? (
            <span className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0 whitespace-nowrap">
              <FiAlertTriangle className="text-amber-500" size={11} />
              Re-auth Needed
            </span>
          )}
        </div>
      </div>

      {/* Body: Telemetry Metrics Grid */}
      <div className="p-3.5 sm:p-4 space-y-3 sm:space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-50/80 p-2 sm:p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 truncate">
              <FiUsers size={10} className="shrink-0" /> <span className="truncate">Audience</span>
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 truncate">
              {(account.followers_count || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 truncate">
              <FiEye size={10} className="shrink-0" /> <span className="truncate">30d Reach</span>
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 truncate">
              {(account.impressions_30d || 0).toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 truncate">
              <FiTrendingUp size={10} className="shrink-0" /> <span className="truncate">Engagement</span>
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-emerald-600 mt-1 truncate">
              {account.engagement_rate || 4.2}%
            </p>
          </div>

          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 truncate">
              <FiFileText size={10} className="shrink-0" /> <span className="truncate">Posts</span>
            </span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 truncate">
              {account.posts_count || 24}
            </p>
          </div>
        </div>

        {/* Scopes & Sync status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-[10px] font-medium text-slate-400 truncate">
              Synced: <strong className="text-slate-700 font-semibold">{account.last_synced || 'Recently'}</strong>
            </span>
            <span className="text-slate-300 shrink-0">•</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0">
              <FiShield size={10} className="text-blue-500" /> OAuth 2.0
            </span>
          </div>

          <label className="inline-flex items-center gap-1.5 cursor-pointer select-none shrink-0 self-end sm:self-auto">
            <input 
              type="checkbox" 
              checked={account.auto_sync ?? true}
              onChange={() => onToggleAutoSync(account._id)}
              className="sr-only peer"
            />
            <div className="w-7 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative"></div>
            <span className="text-[10px] font-bold text-slate-600">Auto-sync</span>
          </label>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          {isConnected ? (
            <button
              type="button"
              onClick={handleSyncClick}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FiRefreshCw size={11} className={isSyncing ? 'animate-spin text-blue-600' : ''} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Data'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReconnect(account._id)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <FiRefreshCw size={11} />
              <span>Reconnect Token</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => onDisconnect(account._id)}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <FiTrash2 size={11} />
          <span>Disconnect</span>
        </button>
      </div>
    </div>
  );
};
