'use client';

import React, { useState } from 'react';
import { 
  FiColumns, 
  FiTable, 
  FiAlertTriangle, 
  FiSearch, 
  FiPlus 
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  mockVentureDeals, 
  mockStagnationMetrics 
} from '@/src/services/rengrowcure/ventureMatrixService';
import { VentureDeal, DealStage, StagnationRiskMetric } from '@/src/types/rengrowcure/ventureMatrix';

// Subcomponents modularized following marketing folder structure
import { VentureKpiStrip } from './shared/VentureKpiStrip';
import { PipelineKanbanView } from './views/PipelineKanbanView';
import { PortfolioTableView } from './views/PortfolioTableView';
import { StagnationRiskView } from './views/StagnationRiskView';
import { CreateDealDrawer } from './modals/CreateDealDrawer';
import { DealOverviewSheet } from './modals/DealOverviewSheet';

const PIPELINE_STAGES: DealStage[] = [
  'Discovery',
  'Value Prop',
  'Proposal',
  'Contract',
  'Closed Won',
  'Closed Lost'
];

type TabKey = 'kanban' | 'portfolio' | 'stagnation';

export default function VentureMatrixModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('kanban');
  const [deals, setDeals] = useState<VentureDeal[]>(mockVentureDeals);
  const [stagnationMetrics, setStagnationMetrics] = useState<StagnationRiskMetric[]>(mockStagnationMetrics);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<VentureDeal | null>(null);

  const handleCreateDeal = (newDeal: VentureDeal) => {
    setDeals([newDeal, ...deals]);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(d => d.id !== dealId));
    if (selectedDeal?.id === dealId) {
      setSelectedDeal(null);
    }
  };

  const handleMoveStage = (dealId: string, direction: 'prev' | 'next') => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const curIdx = PIPELINE_STAGES.indexOf(d.stage);
        let nextIdx = direction === 'next' ? curIdx + 1 : curIdx - 1;
        if (nextIdx < 0) nextIdx = 0;
        if (nextIdx >= PIPELINE_STAGES.length) nextIdx = PIPELINE_STAGES.length - 1;
        return { ...d, stage: PIPELINE_STAGES[nextIdx], stagnationDays: 0 };
      }
      return d;
    }));
  };

  const handleTriggerEscalation = (deal: VentureDeal) => {
    alert(`Escalation kinetic alert dispatched for ${deal.accountName} (${deal.ownerName})!`);
  };

  const filteredDeals = deals.filter(d => 
    d.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.dealTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.dealCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + d.amount, 0);

  const weightedForecast = deals
    .filter(d => d.stage !== 'Closed Lost')
    .reduce((sum, d) => sum + (d.amount * (d.closeProbability / 100)), 0);

  return (
    <div className="w-full space-y-4">
      <RenGrowCureHeader currentModule="venture-matrix" />

      {/* Financial KPIs Strip */}
      <VentureKpiStrip
        deals={deals}
        totalPipelineValue={totalPipelineValue}
        weightedForecast={weightedForecast}
      />

      {/* Main Tab Controller & Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kanban' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiColumns size={14} className="text-cyan-600" />
            <span>Kanban Pipeline</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'portfolio' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiTable size={14} className="text-indigo-600" />
            <span>Portfolio Index (Table)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
              {deals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('stagnation')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stagnation' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FiAlertTriangle size={14} className="text-rose-600" />
            <span>Stagnation & Risk Matrix</span>
          </button>
        </div>

        {/* Global Action & Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-2.5 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Filter deals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <FiPlus size={14} />
            <span>New Opportunity</span>
          </button>
        </div>
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'kanban' && (
        <PipelineKanbanView
          stages={PIPELINE_STAGES}
          deals={filteredDeals}
          onMoveStage={handleMoveStage}
          onSelectDeal={setSelectedDeal}
        />
      )}

      {/* TAB 2: PORTFOLIO INDEX */}
      {activeTab === 'portfolio' && (
        <PortfolioTableView
          deals={filteredDeals}
          onDeleteDeal={handleDeleteDeal}
          onSelectDeal={setSelectedDeal}
        />
      )}

      {/* TAB 3: STAGNATION & RISK */}
      {activeTab === 'stagnation' && (
        <StagnationRiskView
          metrics={stagnationMetrics}
          deals={deals}
          onTriggerEscalation={handleTriggerEscalation}
        />
      )}

      {/* Modals & Drawers */}
      <CreateDealDrawer
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        stages={PIPELINE_STAGES}
        onCreateDeal={handleCreateDeal}
      />

      <DealOverviewSheet
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
      />
    </div>
  );
}
