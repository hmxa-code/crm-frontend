'use client';

import React from 'react';
import { FiColumns, FiTable, FiPlus, FiSearch } from 'react-icons/fi';
import { useOpportunityStore } from '@/src/stores/useOpportunityStore';
import { CreateOpportunityModal } from './modals/CreateOpportunityModal';
import { OpportunityOverviewDrawer } from './modals/OpportunityOverviewDrawer';
import { PipelineKanbanView } from './views/PipelineKanbanView';
import { PortfolioTableView } from './views/PortfolioTableView';
import { OpportunityKpiStrip } from './shared/OpportunityKpiStrip';

type TabKey = 'kanban' | 'portfolio';

export function OpportunityModule() {
  const { 
    opportunities, 
    pipelineStages, 
    setSearchQuery,
    openCreateModal
  } = useOpportunityStore();

  const [activeTab, setActiveTab] = React.useState<TabKey>('kanban');
  const [searchQuery, setSearchQueryLocal] = React.useState('');

  const filteredOpportunities = opportunities.filter(op => 
    op.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.dealCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    op.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPipelineValue = opportunities
    .filter(op => op.stage !== 'Closed Lost')
    .reduce((sum, op) => sum + op.amount, 0);

  const weightedForecast = opportunities
    .filter(op => op.stage !== 'Closed Lost')
    .reduce((sum, op) => sum + (op.amount * (op.closeProbability / 100)), 0);

  const totalDeals = opportunities.length;
  const closedWon = opportunities.filter(op => op.stage === 'Closed Won').length;
  const winRate = totalDeals > 0 ? Math.round((closedWon / totalDeals) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      {/* 0. Module Header / Title Section */}
      <div className="flex flex-col gap-1.5 bg-white border border-slate-300 rounded-2xl p-5 shadow-xs">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
          Deal Flow & Opportunity System
        </h1>
        <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
          Track enterprise sales pipelines, manage stage transitions, monitor deal health scores, and forecast revenue metrics.
        </p>
      </div>

      {/* KPI Strip */}
      <OpportunityKpiStrip
        totalPipelineValue={totalPipelineValue}
        weightedForecast={weightedForecast}
        totalDeals={totalDeals}
        closedWon={closedWon}
        winRate={winRate}
      />

      {/* Header with Tabs & Actions */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kanban' 
                ? 'bg-black text-white shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <FiColumns size={14} className={activeTab === 'kanban' ? 'text-white' : 'text-slate-600'} />
            <span>Board View</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'portfolio' 
                ? 'bg-black text-white shadow-xs' 
                : 'text-slate-600 hover:text-black'
            }`}
          >
            <FiTable size={14} className={activeTab === 'portfolio' ? 'text-white' : 'text-slate-600'} />
            <span>Table Index View</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeTab === 'portfolio' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
            }`}>
              {opportunities.length}
            </span>
          </button>
        </div>

        {/* Search & Action */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-slate-500" size={13} />
            <input
              type="text"
              placeholder="Filter opportunities..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQueryLocal(e.target.value);
                setSearchQuery(e.target.value);
              }}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
            />
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <FiPlus size={14} className="text-white" />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {activeTab === 'kanban' && (
        <PipelineKanbanView
          stages={pipelineStages}
          opportunities={filteredOpportunities}
        />
      )}

      {/* Portfolio View */}
      {activeTab === 'portfolio' && (
        <PortfolioTableView
          opportunities={filteredOpportunities}
        />
      )}

      {/* Modals & Drawers */}
      <CreateOpportunityModal />
      <OpportunityOverviewDrawer />
    </div>
  );
}