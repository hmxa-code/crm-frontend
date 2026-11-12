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

  // Filtered dataset
  const filteredCampaigns = useMemo(() => {
    if (!campaigns || !Array.isArray(campaigns)) return [];
    return campaigns.filter((item) => {
      const name = item?.campaign_name || '';
      const aud = item?.target_audience || '';
      const q = (searchQuery || '').toLowerCase();
      const matchesSearch = name.toLowerCase().includes(q) || aud.toLowerCase().includes(q);

      const matchesChannel = channelFilter === 'all' || item?.campaign_type === channelFilter;
      const matchesStatus = statusFilter === 'all' || item?.status === statusFilter;

      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [campaigns, searchQuery, channelFilter, statusFilter]);

  // Aggregate Metrics Summary
  const metrics = useMemo(() => {
    const list = Array.isArray(campaigns) ? campaigns : [];
    const total = list.length;
    const active = list.filter((c) => c?.status === 'Active').length;
    const totalAudience = list.reduce((acc, c) => acc + (c?.target_count || 0), 0);
    const totalBudget = list.reduce((acc, c) => acc + (c?.budget || 0), 0);
    const avgOpen =
      total > 0
        ? (list.reduce((acc, c) => acc + (c?.open_rate || 0), 0) / total).toFixed(1)
        : '0';
    const avgConv =
      total > 0
        ? (list.reduce((acc, c) => acc + (c?.conversion_rate || 0), 0) / total).toFixed(1)
        : '0';

    return { total, active, totalAudience, totalBudget, avgOpen, avgConv };
  }, [campaigns]);

  return (
    <div className="w-full space-y-4 font-sans pb-6 px-2 sm:px-4 lg:px-6 py-3 text-slate-900 bg-[#f8fafc] min-h-screen">
      <Toaster position="top-right" />

      {/* Module Header & Subtitle */}
      <div className="flex flex-col gap-3 bg-white border border-slate-300 rounded-xl p-3.5 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
              Marketing Campaigns Hub
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-2xl mt-0.5">
              Manage enterprise campaign lifecycles, cross-channel cohorts, target reach pools, and telemetry analytics.
            </p>
          </div>
          <button
            onClick={() => {
              setCampaignToEdit(null);
              setIsDrawerOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 w-full sm:w-auto"
          >
            <FiPlus size={14} className="text-white" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Executive Metric Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-600">Active Cohorts</span>
            <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900">
              <FiLayers size={13} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono text-slate-900">
            {metrics.active} <span className="text-xs font-normal text-slate-500">/ {metrics.total} total</span>
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            Deployed cross-channel programs
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-600">Target Reach Pool</span>
            <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900">
              <FiUsers size={13} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono text-slate-900">
            {metrics.totalAudience.toLocaleString()}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            Verified decision makers
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-600">Total Program Budget</span>
            <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900">
              <FiDollarSign size={13} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono text-slate-900">
            ${metrics.totalBudget.toLocaleString()}
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            Allocated direct media & syndication
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold text-slate-600">Engagement / Win Rate</span>
            <div className="p-1.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-900">
              <FiTrendingUp size={13} />
            </div>
          </div>
          <div className="mt-2 text-lg sm:text-xl font-bold font-mono text-slate-900">
            {metrics.avgOpen}% <span className="text-slate-300">/</span> <span className="text-slate-900">{metrics.avgConv}%</span>
          </div>
          <div className="mt-0.5 text-[10px] text-slate-500">
            Average Open rate / Conversion
          </div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search & Selectors */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 w-full">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-2.5 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:border-black focus:outline-none text-slate-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="w-1/2 sm:w-auto text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 outline-none cursor-pointer text-slate-800"
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
              className="w-1/2 sm:w-auto text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 outline-none cursor-pointer text-slate-800"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Draft">Draft</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center justify-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-stretch sm:self-auto">
          <button
            onClick={() => setViewMode('table')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'table' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            <FiList size={13} />
            <span>Table</span>
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'kanban' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            <FiColumns size={13} />
            <span>Kanban</span>
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'analytics' ? 'bg-black text-white shadow-xs' : 'text-slate-600 hover:text-black'
            }`}
          >
            <FiPieChart size={13} />
            <span>Telemetry</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Render with horizontal overflow support */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-300 p-12 flex flex-col items-center justify-center">
          <FiLoader className="text-xl text-slate-800 animate-spin mb-2" />
          <p className="text-xs font-bold text-slate-700">Loading Enterprise Campaign Repository...</p>
        </div>
      ) : (
        <div className="w-full overflow-x-auto">
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