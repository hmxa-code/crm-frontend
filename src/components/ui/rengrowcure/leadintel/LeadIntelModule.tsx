'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiDatabase,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi';
import RenGrowCureHeader from '../shared/RenGrowCureHeader';
import { 
  leadIntelService
} from '@/src/services/rengrowcure/leadIntelService';
import { ScoringProfile, QualificationRule, ScoringTelemetryEvent } from '@/src/types/rengrowcure/leadIntel';

// Import Modularized Views, Modals & Kpi Strip
import ModelDirectoryView from './views/ModelDirectoryView';
import WeightBalancerView from './views/WeightBalancerView';
import QualificationMatrixView from './views/QualificationMatrixView';
import TelemetryAuditView from './views/TelemetryAuditView';
import CreateModelModal from './modals/CreateModelModal';
import AddPromotionRuleModal from './modals/AddPromotionRuleModal';
import LeadIntelKpiStrip from './shared/LeadIntelKpiStrip';
import toast from 'react-hot-toast';

type TabKey = 'directory' | 'balancer' | 'qualification' | 'telemetry';

export default function LeadIntelModule() {
  const [activeTab, setActiveTab] = useState<TabKey>('directory');
  const [profiles, setProfiles] = useState<ScoringProfile[]>([]);
  const [rules, setRules] = useState<QualificationRule[]>([]);
  const [telemetry, setTelemetry] = useState<ScoringTelemetryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Interactive Balancer active profile state
  const [selectedProfileForBalancer, setSelectedProfileForBalancer] = useState<ScoringProfile | null>(null);
  const [balancerWeights, setBalancerWeights] = useState<Record<string, number>>({});

  // Modals / Drawers state
  const [isCreateModelOpen, setIsCreateModelOpen] = useState(false);
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false);
  const [ruleToEdit, setRuleToEdit] = useState<QualificationRule | null>(null);

  // Fetch all LeadIntel data dynamically from backend
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [profilesResponse, rulesResponse, telemetryResponse] = await Promise.allSettled([
        leadIntelService.getProfiles(1, 100),
        leadIntelService.getRules(),
        leadIntelService.getTelemetry()
      ]);

      if (profilesResponse.status === 'fulfilled' && profilesResponse.value?.data) {
        const fetchedProfiles = profilesResponse.value.data;
        setProfiles(fetchedProfiles);
        if (fetchedProfiles.length > 0) {
          setSelectedProfileForBalancer(prev => {
            const stillExists = fetchedProfiles.find((p: ScoringProfile) => p.id === prev?.id);
            if (stillExists) return stillExists;
            setBalancerWeights(fetchedProfiles[0].weights || {});
            return fetchedProfiles[0];
          });
        }
      }

      if (rulesResponse.status === 'fulfilled' && rulesResponse.value?.data) {
        setRules(rulesResponse.value.data);
      }

      if (telemetryResponse.status === 'fulfilled' && telemetryResponse.value?.data) {
        setTelemetry(telemetryResponse.value.data);
      }
    } catch (error) {
      console.error('Failed to load LeadIntel data from backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateProfile = async (newProfile: any) => {
    try {
      await leadIntelService.createProfile(newProfile);
      toast.success('LeadIntel predictive model deployed successfully');
      setIsCreateModelOpen(false);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to create model');
      console.error(error);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await leadIntelService.deleteProfile(id);
      setProfiles(prev => prev.filter(p => p.id !== id));
      if (selectedProfileForBalancer?.id === id) {
        setSelectedProfileForBalancer(null);
        setBalancerWeights({});
      }
      toast.success('LeadIntel model removed');
    } catch (error) {
      toast.error('Failed to delete model');
      console.error(error);
    }
  };

  // Bulk Delete Models
  const handleBulkDeleteProfiles = async (ids: string[]) => {
    try {
      await leadIntelService.bulkDeleteProfiles(ids);
      setProfiles(prev => prev.filter(p => !ids.includes(p.id)));
      if (selectedProfileForBalancer && ids.includes(selectedProfileForBalancer.id)) {
        setSelectedProfileForBalancer(null);
        setBalancerWeights({});
      }
      toast.success(`${ids.length} model(s) deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete selected models');
      console.error(error);
    }
  };

  const handleDeleteRule = async (id: string) => {
    try {
      await leadIntelService.deleteRule(id);
      const rulesResponse = await leadIntelService.getRules();
      setRules(rulesResponse.data || []);
      toast.success('Promotion rule deleted');
    } catch (error) {
      toast.error('Failed to delete rule');
      console.error(error);
    }
  };

  // Toggle Rule Status (Active / Paused)
  const handleToggleRuleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await leadIntelService.updateRule(id, { isActive: currentStatus });
      setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: currentStatus } : r));
      toast.success(`Rule ${currentStatus ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update rule status');
    }
  };

  // Bulk Delete Qualification Rules
  const handleBulkDeleteRules = async (ids: string[]) => {
    try {
      await leadIntelService.bulkDeleteRules(ids);
      setRules(prev => prev.filter(r => !ids.includes(r.id)));
      toast.success(`${ids.length} promotion rule(s) deleted`);
    } catch (error) {
      toast.error('Failed to delete selected rules');
      console.error(error);
    }
  };

  // Single Delete Telemetry Event
  const handleDeleteTelemetry = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/rengrowcure/lead-intel/telemetry/${id}`, { method: 'DELETE' });
      setTelemetry(prev => prev.filter(t => t.id !== id));
      toast.success('Telemetry record removed');
    } catch {
      toast.error('Failed to remove telemetry record');
    }
  };

  // Bulk Delete Telemetry Events
  const handleBulkDeleteTelemetry = async (ids: string[]) => {
    try {
      await leadIntelService.bulkDeleteTelemetry(ids);
      setTelemetry(prev => prev.filter(t => !ids.includes(t.id)));
      toast.success(`${ids.length} telemetry event(s) deleted`);
    } catch (error) {
      toast.error('Failed to delete telemetry events');
      console.error(error);
    }
  };

  const handleWeightChange = (key: string, val: number) => {
    setBalancerWeights(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveWeights = async () => {
    if (selectedProfileForBalancer) {
      try {
        await leadIntelService.updateProfile(selectedProfileForBalancer.id, {
          weights: balancerWeights,
          lastUpdated: 'Just now'
        });
        setProfiles(prev => prev.map(p => 
          p.id === selectedProfileForBalancer.id 
            ? { ...p, weights: balancerWeights, lastUpdated: 'Just now' } 
            : p
        ));
        toast.success(`Weights calibrated for ${selectedProfileForBalancer.profileName}`);
      } catch (error) {
        toast.error('Failed to save calibrated weights');
        console.error(error);
      }
    }
  };

  // Bulk Seed dynamic testing data handler (~10 dynamic models + telemetry events)
  const handleBulkSeed = async () => {
    setIsSeeding(true);
    try {
      await leadIntelService.seedDynamicData();
      toast.success('10 Dynamic LeadIntel Models & Telemetry records loaded!');
      await fetchAllData();
    } catch (error) {
      console.error(error);
      toast.error('Failed to seed bulk dynamic data');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="w-full space-y-4 font-sans">
      <RenGrowCureHeader currentModule="leadintel" />

      {/* Top Dynamic KPI Summary Strip */}
      <LeadIntelKpiStrip 
        totalModels={profiles.length}
        activeRules={rules.filter(r => r.isActive).length}
        avgLatency="14ms"
        clusterStatus="Active"
      />

      {/* Main Tab Controller & Global Dynamic Actions */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'directory' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Model Directory</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              {profiles.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('balancer')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'balancer' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Weight Balancer</span>
          </button>

          <button
            onClick={() => setActiveTab('qualification')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'qualification' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Qualification Matrix</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
              {rules.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'telemetry' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Telemetry Audit</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              {telemetry.length}
            </span>
          </button>
        </div>

        {/* Global Action Buttons including Bulk Testing Data */}
        <div className="flex items-center gap-2">
          {/* 10 Bulk Dynamic Data Entry Feature */}
          <button
            onClick={handleBulkSeed}
            disabled={isSeeding}
            title="Create 10 dynamic realistic models & telemetry logs for testing"
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <FiDatabase size={13} className={isSeeding ? 'animate-spin' : ''} />
            <span>{isSeeding ? 'Generating 10...' : '+10 Bulk Dynamic Test'}</span>
          </button>

          {activeTab === 'directory' && (
            <button
              onClick={() => setIsCreateModelOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <FiPlus size={14} />
              <span>Create Model</span>
            </button>
          )}

          {activeTab === 'qualification' && (
            <button
              onClick={() => {
                setRuleToEdit(null);
                setIsAddRuleOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <FiPlus size={14} />
              <span>Add Promotion Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* RENDER ACTIVE TAB VIEW */}
      {activeTab === 'directory' && (
        <ModelDirectoryView
          profiles={profiles}
          onSelectForBalancer={(p) => {
            setSelectedProfileForBalancer(p);
            setBalancerWeights(p.weights || {});
            setActiveTab('balancer');
          }}
          onDeleteProfile={handleDeleteProfile}
          onBulkDelete={handleBulkDeleteProfiles}
        />
      )}

      {activeTab === 'balancer' && (
        <WeightBalancerView
          selectedProfile={selectedProfileForBalancer}
          balancerWeights={balancerWeights}
          profiles={profiles}
          onWeightChange={handleWeightChange}
          onSaveWeights={handleSaveWeights}
          onSelectProfile={(p) => {
            setSelectedProfileForBalancer(p);
            setBalancerWeights(p.weights || {});
          }}
        />
      )}

      {activeTab === 'qualification' && (
        <QualificationMatrixView
          rules={rules}
          onOpenAddModal={() => {
            setRuleToEdit(null);
            setIsAddRuleOpen(true);
          }}
          onEditRule={(rule) => {
            setRuleToEdit(rule);
            setIsAddRuleOpen(true);
          }}
          onToggleRuleStatus={handleToggleRuleStatus}
          onDeleteRule={handleDeleteRule}
          onBulkDeleteRules={handleBulkDeleteRules}
        />
      )}

      {activeTab === 'telemetry' && (
        <TelemetryAuditView 
          telemetry={telemetry}
          onRefreshTelemetry={fetchAllData}
          onDeleteTelemetry={handleDeleteTelemetry}
          onBulkDeleteTelemetry={handleBulkDeleteTelemetry}
        />
      )}

      {/* SLIDING DRAWERS / MODALS */}
      <CreateModelModal
        isOpen={isCreateModelOpen}
        onClose={() => setIsCreateModelOpen(false)}
        onCreate={handleCreateProfile}
      />

      <AddPromotionRuleModal
        isOpen={isAddRuleOpen}
        onClose={() => {
          setIsAddRuleOpen(false);
          setRuleToEdit(null);
        }}
        rulesCount={rules.length}
        initialRule={ruleToEdit}
        onRuleSaved={fetchAllData}
        setRules={setRules}
      />
    </div>
  );
}
