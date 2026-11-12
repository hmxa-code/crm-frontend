'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiLoader,
  FiColumns,
  FiList,
  FiUsers,
  FiMail,
  FiMousePointer,
  FiTrendingUp,
  FiDatabase,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import {
  DripCampaign,
  DripCampaignStatus,
  DripTriggerType,
  summarizeDripCampaigns,
} from '@/src/types/marketing/drip-campaign';
import { DripCampaignsService } from '@/src/services/marketing/DripCampaignsService';
import { DripTableView } from './views/DripTableView';
import { DripKanbanView } from './views/DripKanbanView';

export const DripCampaignsHub: React.FC = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<DripCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerFilter, setTriggerFilter] = useState<'all' | DripTriggerType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | DripCampaignStatus>('all');
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDynamic = async () => {
    setIsSeeding(true);
    try {
      await DripCampaignsService.seedDynamicDrips();
      toast.success('Dynamic test drip campaigns created!');
      await loadCampaigns();
    } catch {
      toast.error('Failed to create test drip campaigns');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleResetBaseline = async () => {
    if (confirm('Reset drip sequences repository to initial enterprise seed?')) {
      const reset = await DripCampaignsService.resetToDefaultBaseline();
      setCampaigns(reset);
      toast.success('Drip repository restored to baseline.');
    }
  };

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await DripCampaignsService.getAll();
      setCampaigns(data || []);
    } catch {
      toast.error('Failed to load drip sequences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleStatusChange = async (id: string, status: DripCampaignStatus) => {
    setCampaigns((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    await DripCampaignsService.updateStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this drip sequence?')) return;
    setCampaigns((prev) => prev.filter((c) => c._id !== id));
    await DripCampaignsService.delete(id);
    toast.success('Sequence removed.');
  };

  const handleBulkDelete = async (ids: string[]) => {
    setCampaigns((prev) => prev.filter((c) => !ids.includes(c._id)));
    await DripCampaignsService.bulkDelete(ids);
    toast.success(`${ids.length} sequence(s) removed.`);
  };

  const filtered = useMemo(() => {
    return campaigns.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (item.title || '').toLowerCase().includes(q) ||
        (item.targetPersona || '').toLowerCase().includes(q) ||
        (item.triggerDetail || '').toLowerCase().includes(q);
      const matchesTrigger = triggerFilter === 'all' || item.triggerType === triggerFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesTrigger && matchesStatus;
    });
  }, [campaigns, searchQuery, triggerFilter, statusFilter]);

  const summary = useMemo(() => summarizeDripCampaigns(campaigns), [campaigns]);

  return (
    <div className="w-full space-y-3 font-sans pb-4 px-1 sm:px-3 lg:px-4 py-2 text-slate-900 bg-[#f8fafc] min-h-screen">
      <Toaster position="top-right" />

      {/* --- Clean Top Module Header (Exact Layout matching Image) --- */}
      <div className="flex flex-col gap-3 bg-white border border-slate-300 rounded-xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900">
              Drip Campaigns Hub
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mt-0.5">
              Orchestrate time, event, and behavior sequences. Real-time send telemetry and conversion metrics.
            </p>
          </div>
          <Link
            href="/marketing/drip-campaigns/create"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0 w-full sm:w-auto"
          >
            <FiPlus size={14} className="text-white" />
            <span className="text-white">New pathway</span>
          </Link>
        </div>
      </div>

      {/* --- Executive Metric Cards Strip --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[
          { label: 'Active Leads', value: summary.totalActiveLeads.toLocaleString(), icon: FiUsers },
          { label: 'Avg Open Rate', value: `${summary.averageOpenRate}%`, icon: FiMail },
          { label: 'Avg Click Rate', value: `${summary.averageClickRate}%`, icon: FiMousePointer },
          { label: 'Avg Conversion', value: `${summary.averageConversionRate}%`, icon: FiTrendingUp },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-slate-300 p-3 shadow-2xs">
              <div className="flex items-center justify-between mb-1 text-slate-500 text-xs">
                <span className="font-bold text-slate-600 text-[10px] uppercase tracking-wider truncate">{card.label}</span>
                <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900 shrink-0">
                  <Icon size={12} />
                </div>
              </div>
              <div className="mt-1 text-base sm:text-lg font-extrabold font-mono text-slate-900">
                {card.value}
              </div>
              <div className="mt-0.5 text-[9px] text-slate-500 truncate">
                {summary.activeSequences} live / {summary.totalSequences} total
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Controls Bar & View Mode Switcher --- */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Search Box & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-2.5 text-slate-500 text-xs" />
            <input
              type="text"
              placeholder="Search sequences, personas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-black focus:outline-none text-slate-900 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-1.5">
            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value as 'all' | DripTriggerType)}
              className="w-full sm:w-auto text-[11px] font-semibold px-2 py-1.5 rounded-lg border border-slate-300 bg-slate-50 outline-none cursor-pointer text-slate-800"
            >
              <option value="all">All triggers</option>
              <option value="Time-Based">Time-Based</option>
              <option value="Event-Based">Event-Based</option>
              <option value="Behavior-Based">Behavior-Based</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | DripCampaignStatus)}
              className="w-full sm:w-auto text-[11px] font-semibold px-2 py-1.5 rounded-lg border border-slate-300 bg-slate-50 outline-none cursor-pointer text-slate-800"
            >
              <option value="all">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* View Mode & Helper Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              <FiList size={12} />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-black text-white shadow-2xs' : 'text-slate-600 hover:text-black'
              }`}
            >
              <FiColumns size={12} />
              <span>Kanban</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleSeedDynamic}
              disabled={isSeeding}
              className="p-1.5 text-slate-600 hover:text-black border border-slate-200 bg-white rounded-md transition-colors cursor-pointer"
              title="Generate Dynamic Test Drip Sequences"
            >
              <FiDatabase className={`text-xs ${isSeeding ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              type="button"
              onClick={handleResetBaseline}
              className="p-1.5 text-slate-600 hover:text-black border border-slate-200 bg-white rounded-md transition-colors cursor-pointer"
              title="Reset repository to baseline"
            >
              <FiRefreshCw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Workspace Render --- */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-300 p-12 flex flex-col items-center justify-center">
          <FiLoader className="text-xl text-slate-900 animate-spin mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading drip matrix...</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
          {viewMode === 'table' ? (
            <DripTableView
              campaigns={filtered}
              onView={(c) => router.push(`/marketing/drip-campaigns/${c._id}`)}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          ) : (
            <DripKanbanView
              campaigns={filtered}
              onStatusChange={handleStatusChange}
              onView={(c) => router.push(`/marketing/drip-campaigns/${c._id}`)}
            />
          )}
        </div>
      )}
    </div>
  );
};