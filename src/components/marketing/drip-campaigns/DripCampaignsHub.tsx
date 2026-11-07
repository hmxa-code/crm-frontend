'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiLoader,
  FiZap,
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
      toast.success('10 Dynamic test drip campaigns created!');
      await loadCampaigns();
    } catch {
      toast.error('Failed to create test drip campaigns');
    } finally {
      setIsSeeding(false);
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
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            <FiZap size={12} />
            <span>Automation Pathways</span>
          </div>
          <h1 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Drip Campaigns
          </h1>
          <p className="mt-1 text-sm text-slate-500 max-w-xl">
            Orchestrate time, event, and behavior sequences. Opened, clicked, converted, and
            completion metrics are generated from send telemetry — never entered by hand.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiList size={13} />
              Table
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FiColumns size={13} />
              Kanban
            </button>
          </div>
          <button
            type="button"
            onClick={handleSeedDynamic}
            disabled={isSeeding}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            title="Generate ~10 Dynamic Testing Drip Sequences"
          >
            <FiDatabase className={`text-sm ${isSeeding ? 'animate-spin' : ''}`} />
            <span>{isSeeding ? 'Creating 10...' : '+10 Bulk Dynamic Test'}</span>
          </button>
          <Link
            href="/marketing/drip-campaigns/create"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <FiPlus className="text-sm" />
            New pathway
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Active leads in flight', value: summary.totalActiveLeads.toLocaleString(), icon: FiUsers },
          { label: 'Avg open rate', value: `${summary.averageOpenRate}%`, icon: FiMail },
          { label: 'Avg click rate', value: `${summary.averageClickRate}%`, icon: FiMousePointer },
          { label: 'Avg conversion', value: `${summary.averageConversionRate}%`, icon: FiTrendingUp },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{card.label}</p>
                <Icon className="text-blue-600" size={16} />
              </div>
              <p className="text-xl font-extrabold text-slate-900">{card.value}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {summary.activeSequences} live of {summary.totalSequences} sequences
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search sequences, personas, or triggers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <select
            value={triggerFilter}
            onChange={(e) => setTriggerFilter(e.target.value as 'all' | DripTriggerType)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 outline-none cursor-pointer"
          >
            <option value="all">All triggers</option>
            <option value="Time-Based">Time-Based</option>
            <option value="Event-Based">Event-Based</option>
            <option value="Behavior-Based">Behavior-Based</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | DripCampaignStatus)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/60 outline-none cursor-pointer"
          >
            <option value="all">All statuses</option>
            <option value="Draft">Draft</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCampaigns}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs font-bold text-slate-500">{filtered.length} sequences</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center justify-center">
          <FiLoader className="text-3xl text-blue-600 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-700">Loading drip matrix...</p>
        </div>
      ) : viewMode === 'table' ? (
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
  );
};
