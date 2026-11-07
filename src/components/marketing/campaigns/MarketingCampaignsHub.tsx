'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiColumns,
  FiList,
  FiPieChart,
  FiRefreshCw,
  FiLoader,
  FiZap,
  FiCheckCircle,
  FiLayers,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiExternalLink,
  FiCpu,
  FiArrowRight,
  FiShield
} from 'react-icons/fi';
import { Campaign, CampaignEditablePayload, CampaignStatus } from '@/src/types/marketing/campaign';
import { CampaignsService, ENTERPRISE_HARDCODED_CAMPAIGNS } from '@/src/services/marketing/CampaignsService';
import { CampaignTableView } from './views/CampaignTableView';
import { CampaignKanbanView } from './views/CampaignKanbanView';
import { CampaignAnalyticsView } from './views/CampaignAnalyticsView';
import { CreateCampaignDrawer } from './modals/CreateCampaignDrawer';
import { CampaignOverviewSheet } from './modals/CampaignOverviewSheet';
import toast, { Toaster } from 'react-hot-toast';

export const MarketingCampaignsHub: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'analytics'>('table');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modals & Drawers state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [campaignToEdit, setCampaignToEdit] = useState<Campaign | null>(null);
  const [selectedCampaignForOverview, setSelectedCampaignForOverview] = useState<Campaign | null>(null);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await CampaignsService.getAllCampaigns();
      setCampaigns(data || ENTERPRISE_HARDCODED_CAMPAIGNS);
    } catch {
      setCampaigns(ENTERPRISE_HARDCODED_CAMPAIGNS);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (payload: CampaignEditablePayload) => {
    if (campaignToEdit) {
      const updated = await CampaignsService.updateCampaign(campaignToEdit._id, payload);
      if (updated) {
        setCampaigns((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      }
      toast.success('Campaign updated successfully');
    } else {
      const created = await CampaignsService.createCampaign(payload);
      setCampaigns((prev) => [created, ...prev]);
      toast.success('Campaign deployed successfully');
    }
    setIsDrawerOpen(false);
  };

  const handleStatusChange = async (id: string, newStatus: CampaignStatus) => {
    setCampaigns((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
    );
    await CampaignsService.updateCampaignStatus(id, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      await CampaignsService.deleteCampaign(id);
      toast.success('Campaign removed.');
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    setCampaigns((prev) => prev.filter((c) => !ids.includes(c._id)));
    await CampaignsService.bulkDeleteCampaigns(ids);
    toast.success(`${ids.length} campaign(s) removed.`);
  };

  const handleResetToBaseline = async () => {
    if (confirm('Reset campaign repository to pristine enterprise hardcoded baseline?')) {
      const resetData = await CampaignsService.resetToDefaultEnterpriseSeed();
      setCampaigns(resetData);
      toast.success('Campaign repository restored to baseline.');
    }
  };

  // Filtered dataset
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((item) => {
      const matchesSearch =
        item.campaign_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.target_audience.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesChannel = channelFilter === 'all' || item.campaign_type === channelFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [campaigns, searchQuery, channelFilter, statusFilter]);

  // Aggregate Metrics Summary
  const metrics = useMemo(() => {
    const total = campaigns.length;
    const active = campaigns.filter((c) => c.status === 'Active').length;
    const totalAudience = campaigns.reduce((acc, c) => acc + (c.target_count || 0), 0);
    const totalBudget = campaigns.reduce((acc, c) => acc + (c.budget || 0), 0);
    const avgOpen =
      total > 0
        ? (campaigns.reduce((acc, c) => acc + (c.open_rate || 0), 0) / total).toFixed(1)
        : '0';
    const avgConv =
      total > 0
        ? (campaigns.reduce((acc, c) => acc + (c.conversion_rate || 0), 0) / total).toFixed(1)
        : '0';

    return { total, active, totalAudience, totalBudget, avgOpen, avgConv };
  }, [campaigns]);

  return (
    <div className="w-full space-y-5 font-sans pb-10">
      <Toaster position="top-right" />

      {/* Enterprise Executive Header Ribbon */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Enterprise Marketing Campaigns Hub
            </h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
              STANDALONE EXECUTION
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Centralized orchestration for multi-channel demand generation, audience cohorts, and direct reach. All automated pipeline actions and multi-step branches are decoupled and managed via the 
            <Link href="/workflows" className="text-cyan-700 hover:text-cyan-800 font-semibold inline-flex items-center gap-1 ml-1 underline">
              CRM Workflow Automation Engine <FiArrowRight size={11} />
            </Link>
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div className="flex items-center gap-2.5 self-start md:self-center flex-wrap">
          <Link
            href="/workflows"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            title="Open central CRM automation engine"
          >
            <FiZap size={13} className="text-amber-600" />
            <span>Workflow Engine</span>
          </Link>

          <button
            onClick={handleResetToBaseline}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Reset to pristine baseline"
          >
            <FiRefreshCw size={13} />
          </button>

          <button
            onClick={() => {
              setCampaignToEdit(null);
              setIsDrawerOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <FiPlus size={14} />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Executive Metric Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold text-slate-500">Active Cohorts</span>
            <FiLayers size={14} className="text-cyan-600" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900">
            {metrics.active} <span className="text-xs font-normal text-slate-400">/ {metrics.total} total</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Deployed cross-channel programs
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold text-slate-500">Target Reach Pool</span>
            <FiUsers size={14} className="text-indigo-600" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900">
            {metrics.totalAudience.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Verified healthcare decision makers
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold text-slate-500">Total Program Budget</span>
            <FiDollarSign size={14} className="text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900">
            ${metrics.totalBudget.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Allocated direct media & syndication
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold text-slate-500">Engagement / Win Rate</span>
            <FiTrendingUp size={14} className="text-amber-600" />
          </div>
          <div className="mt-2 text-xl font-bold font-mono text-slate-900">
            {metrics.avgOpen}% <span className="text-slate-300">/</span> <span className="text-emerald-600">{metrics.avgConv}%</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Average Open rate / Conversion
          </div>
        </div>
      </div>

      {/* Central Automation Notice Ribbon */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-amber-100 text-amber-800">
            <FiShield size={14} />
          </div>
          <div>
            <span className="font-bold text-slate-800">Decoupled Automation Architecture:</span>{' '}
            <span className="text-slate-600">
              Per enterprise governance, marketing campaigns function purely as marketing execution channels. All automated triggers, drip schedules, dynamic branch decisions, and task routing are handled by the single master Workflow Engine.
            </span>
          </div>
        </div>
        <Link
          href="/workflows"
          className="shrink-0 font-bold text-cyan-800 hover:text-cyan-950 inline-flex items-center gap-1 underline text-xs"
        >
          <span>View Automated Workflows</span>
          <FiArrowRight size={12} />
        </Link>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search & Selectors */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search campaigns by name, target audience, or channel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
            />
          </div>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer text-slate-800"
          >
            <option value="all">All Channels</option>
            <option value="Email">Email</option>
            <option value="SMS">SMS</option>
            <option value="Social">Social</option>
            <option value="Push">Push</option>
            <option value="Multi-Channel">Multi-Channel</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 outline-none cursor-pointer text-slate-800"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('table')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FiList size={13} />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FiColumns size={13} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FiPieChart size={13} />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Render */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-16 flex flex-col items-center justify-center">
          <FiLoader className="text-2xl text-slate-600 animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-700">Loading Enterprise Campaign Repository...</p>
        </div>
      ) : (
        <div>
          {viewMode === 'table' && (
            <CampaignTableView
              campaigns={filteredCampaigns}
              onView={(c) => setSelectedCampaignForOverview(c)}
              onEdit={(c) => {
                setCampaignToEdit(c);
                setIsDrawerOpen(true);
              }}
              onDelete={handleDelete}
              onBulkDelete={handleBulkDelete}
            />
          )}

          {viewMode === 'kanban' && (
            <CampaignKanbanView
              campaigns={filteredCampaigns}
              onStatusChange={handleStatusChange}
              onView={(c) => setSelectedCampaignForOverview(c)}
              onEdit={(c) => {
                setCampaignToEdit(c);
                setIsDrawerOpen(true);
              }}
            />
          )}

          {viewMode === 'analytics' && (
            <CampaignAnalyticsView
              campaigns={filteredCampaigns}
              onSelectCampaign={(c) => setSelectedCampaignForOverview(c)}
            />
          )}
        </div>
      )}

      {/* Drawers / Modals */}
      <CreateCampaignDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setCampaignToEdit(null);
        }}
        onSubmit={handleCreateOrUpdate}
        campaignToEdit={campaignToEdit}
      />

      <CampaignOverviewSheet
        campaign={selectedCampaignForOverview}
        onClose={() => setSelectedCampaignForOverview(null)}
        onEdit={(c) => {
          setSelectedCampaignForOverview(null);
          setCampaignToEdit(c);
          setIsDrawerOpen(true);
        }}
      />
    </div>
  );
};
