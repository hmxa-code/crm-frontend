'use client';

import React, { useState } from 'react';
import { FiSearch, FiFilter, FiSliders, FiTrash2, FiCheckSquare, FiSquare } from 'react-icons/fi';
import { ScoringProfile } from '@/src/types/rengrowcure/leadIntel';
import ModelBadge from '../shared/ModelBadge';

interface ModelDirectoryViewProps {
  profiles: ScoringProfile[];
  onSelectForBalancer: (profile: ScoringProfile) => void;
  onDeleteProfile: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
}

export default function ModelDirectoryView({
  profiles,
  onSelectForBalancer,
  onDeleteProfile,
  onBulkDelete,
}: ModelDirectoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch =
      p.profileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.modelId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier =
      selectedTierFilter === 'ALL' || p.targetTier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const allFilteredSelected =
    filteredProfiles.length > 0 &&
    filteredProfiles.every((p) => selectedIds.includes(p.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProfiles.map((p) => p.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Are you sure you want to delete ${selectedIds.length} selected model(s)?`)) {
      if (onBulkDelete) {
        onBulkDelete(selectedIds);
      } else {
        selectedIds.forEach((id) => onDeleteProfile(id));
      }
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Clean Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search predictive scoring models by code or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <FiFilter size={12} /> Tier:
          </span>
          {(['ALL', 'Enterprise', 'Mid-Market', 'SMB', 'Strategic'] as const).map(
            (tier) => (
              <button
                key={tier}
                onClick={() => setSelectedTierFilter(tier)}
                className={`text-xs px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${
                  selectedTierFilter === tier
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tier}
              </button>
            )
          )}
        </div>
      </div>

      {/* Bulk Action Bar when items selected */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded p-3 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
            <span>{selectedIds.length} model(s) selected</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FiTrash2 size={13} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Models Directory Table */}
      <div className="bg-white border border-slate-200/80 rounded overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">Model ID / Name</th>
                <th className="py-3.5 px-4">Target Tier</th>
                <th className="py-3.5 px-4">Thresholds (MQL / SQL)</th>
                <th className="py-3.5 px-4">Evaluations</th>
                <th className="py-3.5 px-4">Win Conversion</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredProfiles.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-cyan-50/50' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOne(p.id)}
                        className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{p.profileName}</div>
                      <span className="text-[10px] font-mono text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-100/80 inline-block mt-0.5">
                        {p.modelId}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <ModelBadge tier={p.targetTier} type="tier" />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className="text-amber-600 font-mono">MQL &ge; {p.mqlThreshold}</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-emerald-600 font-mono">SQL &ge; {p.sqlThreshold}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{p.evaluationCount.toLocaleString()} leads</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">{p.conversionRate}%</span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 rounded"
                            style={{ width: `${Math.min(p.conversionRate * 2, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <ModelBadge status={p.status} type="status" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onSelectForBalancer(p)}
                          className="p-1.5 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors cursor-pointer"
                          title="Configure Weights in Balancer"
                        >
                          <FiSliders size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteProfile(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Model"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
