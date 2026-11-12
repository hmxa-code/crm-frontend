'use client';

import React from 'react';
import { FiX, FiClock, FiCalendar, FiUser, FiActivity, FiFileText } from 'react-icons/fi';
import { useOpportunityStore } from '@/src/stores/useOpportunityStore';
import { StageBadge } from '../shared/StageBadge';
import { SlaRiskBadge } from '../shared/SlaRiskBadge';

export function OpportunityOverviewDrawer() {
  const { 
    opportunities, 
    selectedDealId, 
    isOverviewDrawerOpen,
    closeOverviewDrawer,
    updateOpportunity
  } = useOpportunityStore();

  const selectedDeal = opportunities.find(op => op.id === selectedDealId);

  if (!selectedDeal) return null;

  const stageProgress = (stages: string[], currentStage: string) => {
    const currentIndex = stages.indexOf(currentStage);
    return Math.round(((currentIndex + 1) / stages.length) * 100);
  };

  const stages = ['Discovery', 'Value Prop', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

  return (
    <div className={`fixed inset-0 z-[9999] flex transition-all duration-300 ${isOverviewDrawerOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isOverviewDrawerOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeOverviewDrawer}
      />

      {/* Drawer Panel */}
      <div 
        className={`absolute right-0 top-0 h-full w-full md:w-[520px] bg-white shadow-2xl border-l border-slate-300 flex flex-col transition-transform duration-300 ease-out ${isOverviewDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-300 bg-white sticky top-0 z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                  {selectedDeal.dealCode}
                </span>
                <StageBadge stage={selectedDeal.stage} />
                <SlaRiskBadge risk={selectedDeal.slaBreachRisk} />
              </div>
              <h2 className="text-lg font-bold text-slate-900">{selectedDeal.accountName}</h2>
              <p className="text-xs text-slate-600 mt-0.5">{selectedDeal.dealTitle}</p>
            </div>
            <button 
              onClick={closeOverviewDrawer}
              className="p-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Stage Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              <span>Pipeline Progress</span>
              <span>{stageProgress(stages, selectedDeal.stage)}%</span>
            </div>
            <div className="h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-500"
                style={{ width: `${stageProgress(stages, selectedDeal.stage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Total Value</span>
              <span className="text-base font-bold text-slate-900 font-mono">${selectedDeal.amount.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">MRR</span>
              <span className="text-base font-bold text-slate-900 font-mono">${selectedDeal.mrr.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Probability</span>
              <span className="text-base font-bold text-slate-900 font-mono">{selectedDeal.closeProbability}%</span>
            </div>
          </div>

          {/* Key Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Key Details</h3>
            
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-black text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                <FiUser size={12} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Account Executive</span>
                <span className="text-xs font-semibold text-slate-900">{selectedDeal.ownerName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                <FiCalendar size={12} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Expected Close</span>
                <span className="text-xs font-semibold text-slate-900">{selectedDeal.expectedCloseDate}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                <FiClock size={12} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Stagnation</span>
                <span className="text-xs font-semibold text-slate-900">
                  {selectedDeal.stagnationDays} days in stage
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0">
                <FiActivity size={12} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Health Score</span>
                <span className="text-xs font-bold text-slate-900">{selectedDeal.healthScore}/100</span>
              </div>
            </div>
          </div>

          {/* Strategic Notes */}
          {selectedDeal.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <FiFileText size={12} />
                Strategic Notes
              </h3>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
                <p className="text-xs text-slate-700 leading-relaxed">{selectedDeal.notes}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-300 bg-slate-50">
          <button
            onClick={closeOverviewDrawer}
            className="w-full px-4 py-2.5 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}