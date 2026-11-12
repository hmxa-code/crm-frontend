'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FiRefreshCw, 
  FiUsers, 
  FiEye, 
  FiTrendingUp, 
  FiShield, 
  FiSearch, 
  FiCheckCircle, 
  FiRotateCcw,
} from 'react-icons/fi';
import { SocialAccount, SocialPlatform } from '@/src/types/marketing/social-account';
import { SocialAccountsService } from '@/src/services/marketing/SocialAccountsService';
import { SocialAccountCard } from '@/src/components/ui/marketing/social-accounts/AccountConnectionCard';
import { OAuthConnectButtons } from '@/src/components/ui/marketing/social-accounts/OAuthConnectButtons';
import toast, { Toaster } from 'react-hot-toast';

export default function SocialAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'connected' | 'attention'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await SocialAccountsService.getConnectedAccounts();
      setAccounts(data || []);
    } catch {
      toast.error('Failed to load social accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id: string) => {
    if (confirm('Are you sure you want to disconnect this social channel? Scheduled posts for this account will be paused.')) {
      await SocialAccountsService.disconnectAccount(id);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
      toast.success('Social account disconnected.');
    }
  };

  const handleReconnect = async (id: string) => {
    const updated = await SocialAccountsService.reconnectAccount(id);
    if (updated) {
      setAccounts((prev) => prev.map((a) => (a._id === id ? updated : a)));
      toast.success('OAuth token refreshed & re-authenticated!');
    }
  };

  const handleToggleAutoSync = async (id: string) => {
    await SocialAccountsService.toggleAutoSync(id);
    setAccounts((prev) =>
      prev.map((a) => (a._id === id ? { ...a, auto_sync: !a.auto_sync } : a))
    );
  };

  const handleSyncSingle = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a._id === id) {
          return {
            ...a,
            followers_count: (a.followers_count || 1000) + Math.floor(Math.random() * 20) + 2,
            last_synced: 'Just now',
          };
        }
        return a;
      })
    );
    toast.success('Account feed telemetry synced!');
  };

  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const synced = await SocialAccountsService.syncAllNow();
      setAccounts(synced);
      toast.success('All connected channel feeds synchronized!');
    } catch {
      toast.error('Sync failed.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const handleResetBaseline = async () => {
    if (confirm('Reset social channels to enterprise baseline?')) {
      const baseline = await SocialAccountsService.resetToDefaultAccounts();
      setAccounts(baseline);
      toast.success('Social accounts restored to pristine enterprise seed.');
    }
  };

  const handleAccountAdded = (newAcc: SocialAccount) => {
    setAccounts((prev) => [newAcc, ...prev]);
  };

  // Filtered accounts
  const filteredAccounts = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return [];
    return accounts.filter((acc) => {
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch =
        (acc?.account_name || '').toLowerCase().includes(q) ||
        (acc?.handle || '').toLowerCase().includes(q) ||
        (acc?.platform || '').toLowerCase().includes(q);

      const matchesTab =
        filterTab === 'all'
          ? true
          : filterTab === 'connected'
          ? acc?.status === 'Connected'
          : acc?.status !== 'Connected';

      const matchesPlatform = platformFilter === 'all' || acc?.platform === platformFilter;

      return matchesSearch && matchesTab && matchesPlatform;
    });
  }, [accounts, searchQuery, filterTab, platformFilter]);

  // Macro metrics
  const macroStats = useMemo(() => {
    const list = Array.isArray(accounts) ? accounts : [];
    const total = list.length;
    const connected = list.filter((a) => a?.status === 'Connected').length;
    const attention = list.filter((a) => a?.status !== 'Connected').length;
    const totalFollowers = list.reduce((acc, a) => acc + (a?.followers_count || 0), 0);
    const totalImpressions = list.reduce((acc, a) => acc + (a?.impressions_30d || 0), 0);
    const avgEngagement =
      total > 0
        ? (list.reduce((acc, a) => acc + (a?.engagement_rate || 0), 0) / total).toFixed(1)
        : '0.0';

    return { total, connected, attention, totalFollowers, totalImpressions, avgEngagement };
  }, [accounts]);

  return (
    <div className="w-full text-slate-900 font-sans antialiased space-y-6 pb-12">
      <Toaster position="top-right" />

      <div className="w-full space-y-6">
        {/* Executive Header Ribbon */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Social Accounts & OAuth Integration Hub
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Manage multi-network OAuth 2.0 credentials, token health, automated telemetry polling, and cross-channel distribution.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
            >
              <FiRefreshCw size={13} className={isSyncingAll ? 'animate-spin text-blue-600' : ''} />
              <span>{isSyncingAll ? 'Synchronizing All...' : 'Sync All Feeds'}</span>
            </button>

            <button
              onClick={handleResetBaseline}
              title="Reset to default seed accounts"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FiRotateCcw size={13} />
              <span className="hidden sm:inline">Reset Baseline</span>
            </button>
          </div>
        </div>

        {/* Macro KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Network Reach</span>
              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                <FiUsers size={14} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {macroStats.totalFollowers.toLocaleString()}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5 block">
              Across {macroStats.total} synchronized platforms
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">30d Total Impressions</span>
              <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                <FiEye size={14} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {macroStats.totalImpressions.toLocaleString()}
            </p>
            <span className="text-[10px] text-purple-600 font-bold mt-0.5 block">
              +18.4% vs previous 30 days
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Authorized</span>
              <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                <FiCheckCircle size={14} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-2">
              {macroStats.connected} / {macroStats.total}
            </p>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              {macroStats.attention > 0 ? `${macroStats.attention} require attention` : 'All tokens healthy'}
            </span>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Engagement Rate</span>
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <FiTrendingUp size={14} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
              {macroStats.avgEngagement}%
            </p>
            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">
              Industry baseline: 3.2%
            </span>
          </div>
        </div>

        {/* Add Connection Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Connect New Channel Integration
              </h3>
              <p className="text-[11px] text-slate-500">
                Grant OAuth 2.0 authorization to schedule posts, sync live audience analytics, and auto-dispatch content.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              <FiShield className="text-blue-600" size={12} /> Enterprise Encryption
            </span>
          </div>
          <OAuthConnectButtons onAccountAdded={handleAccountAdded} />
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All ({macroStats.total})
            </button>
            <button
              onClick={() => setFilterTab('connected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'connected' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Connected ({macroStats.connected})
            </button>
            <button
              onClick={() => setFilterTab('attention')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterTab === 'attention' ? 'bg-white text-amber-700 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Needs Attention ({macroStats.attention})
            </button>
          </div>

          {/* Search & Platform Filter */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                type="text"
                placeholder="Search account name, handle, or network..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all">All Networks</option>
              <option value="Instagram">Instagram</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter / X</option>
              <option value="YouTube">YouTube</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="TikTok">TikTok</option>
            </select>
          </div>
        </div>

        {/* Active Accounts Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Authorized Channels ({filteredAccounts.length})
            </h3>
            <span className="text-[11px] text-slate-400">
              Automated polling interval: <strong className="text-slate-600 font-semibold">Every 15 mins</strong>
            </span>
          </div>

          {filteredAccounts.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
              <p className="text-sm font-bold text-slate-800">No social accounts match your filters</p>
              <p className="text-xs text-slate-400">Try clearing the search query or connecting a new channel above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-5 items-stretch">
              {filteredAccounts.map((acc) => (
                <SocialAccountCard
                  key={acc._id}
                  account={acc}
                  onDisconnect={handleDisconnect}
                  onReconnect={handleReconnect}
                  onToggleAutoSync={handleToggleAutoSync}
                  onSyncSingle={handleSyncSingle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
