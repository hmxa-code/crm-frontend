'use client';

import React, { useState } from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiCheckCircle, 
  FiToggleLeft, 
  FiToggleRight, 
  FiFilter, 
  FiSearch, 
  FiShield, 
  FiArrowRight,
  FiZap,
  FiCrosshair
} from 'react-icons/fi';
import { QualificationRule } from '@/src/types/rengrowcure/leadIntel';

interface QualificationMatrixViewProps {
  rules: QualificationRule[];
  onOpenAddModal: () => void;
  onEditRule?: (rule: QualificationRule) => void;
  onToggleRuleStatus?: (id: string, currentStatus: boolean) => void;
  onDeleteRule: (id: string) => void;
  onBulkDeleteRules?: (ids: string[]) => void;
}

export default function QualificationMatrixView({
  rules,
  onOpenAddModal,
  onEditRule,
  onToggleRuleStatus,
  onDeleteRule,
  onBulkDeleteRules,
}: QualificationMatrixViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<'All' | 'Cold' | 'Warm' | 'MQL'>('All');

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.ruleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.conditionField.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.autoAction.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'All' || rule.fromStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const allFilteredSelected =
    filteredRules.length > 0 && filteredRules.every((r) => selectedIds.includes(r.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRules.map((r) => r.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Permanently remove ${selectedIds.length} promotion rule(s)?`)) {
      if (onBulkDeleteRules) {
        onBulkDeleteRules(selectedIds);
      } else {
        selectedIds.forEach((id) => onDeleteRule(id));
      }
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner / Explanation Ribbon */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <FiShield size={18} className="text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Lifecycle Qualification Matrix & State Promotion Rules
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                DATABASE SYNCED
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated deterministic rules that inspect composite weights from the Balancer and promote leads from Cold &rarr; Warm &rarr; MQL &rarr; SQL.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95 shrink-0"
        >
          <FiPlus size={14} />
          <span>Add Promotion Rule</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <FiSearch className="absolute left-3.5 top-3 text-slate-400" size={14} />
          <input
            type="text"
            placeholder="Search qualification rules by condition, action, or rule code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1 mr-1">
            <FiFilter size={12} /> Origin Stage:
          </span>
          {(['All', 'Cold', 'Warm', 'MQL'] as const).map((stage) => (
            <button
              key={stage}
              onClick={() => setStageFilter(stage)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                stageFilter === stage
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {stage}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <span className="font-bold text-rose-800">
            {selectedIds.length} rule(s) selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 text-slate-600 hover:text-slate-900 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBulkDelete}
              className="flex items-center gap-1.5 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FiTrash2 size={12} />
              <span>Delete Selected ({selectedIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Select All Checkbox Header */}
      {filteredRules.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500">
          <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={handleToggleSelectAll}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
            />
            <span>Select All Filtered Rules ({filteredRules.length})</span>
          </label>
          <span className="text-[11px] font-mono">
            {rules.filter((r) => r.isActive).length} active of {rules.length} configured
          </span>
        </div>
      )}

      {/* Rules Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => {
          const isSelected = selectedIds.includes(rule.id);
          return (
            <div
              key={rule.id}
              className={`bg-white border rounded-xl p-4.5 shadow-xs hover:border-slate-300 transition-all space-y-3.5 ${
                isSelected ? 'border-cyan-400 bg-cyan-50/20' : 'border-slate-200/80'
              }`}
            >
              {/* Card Top Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelectOne(rule.id)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200">
                    {rule.ruleCode}
                  </span>
                  <span className="text-[10px] font-mono font-medium text-slate-400">
                    Priority #{rule.priority || 1}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => onToggleRuleStatus && onToggleRuleStatus(rule.id, !rule.isActive)}
                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      rule.isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Click to toggle active state"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {rule.isActive ? 'ACTIVE' : 'PAUSED'}
                  </button>

                  {/* Edit action */}
                  {onEditRule && (
                    <button
                      onClick={() => onEditRule(rule)}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Rule"
                    >
                      <FiEdit2 size={13} />
                    </button>
                  )}

                  {/* Delete action */}
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Rule"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title & Stage Transition Pill */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{rule.name}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60 text-[11px]">
                    From: <strong>{rule.fromStage}</strong>
                  </span>
                  <FiArrowRight size={12} className="text-slate-400" />
                  <span className="font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px]">
                    To: <strong>{rule.toStage}</strong>
                  </span>
                </div>
              </div>

              {/* Condition & Action Logic Box */}
              <div className="bg-slate-50/80 border border-slate-200/70 rounded-lg p-3 text-xs space-y-1.5">
                <div className="font-mono text-[11px] text-slate-700 flex items-center gap-1.5">
                  <span className="text-slate-400 font-sans font-bold text-[10px] uppercase">WHEN</span>
                  <span className="text-cyan-800 font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {rule.conditionField}
                  </span>
                  <span className="text-slate-500 font-sans text-[11px]">{rule.operator}</span>
                  <span className="text-indigo-700 font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {rule.value}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 flex items-start gap-1.5 pt-1 border-t border-slate-200/50">
                  <span className="text-slate-400 font-sans font-bold text-[10px] uppercase shrink-0 mt-0.5">THEN</span>
                  <span className="text-slate-800 font-medium leading-relaxed">{rule.autoAction}</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {filteredRules.length === 0 && (
        <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center text-xs space-y-2">
          <p className="font-bold text-slate-700">No promotion rules matched your search</p>
          <p className="text-slate-400">Try adjusting your filters or click "Add Promotion Rule" to create one.</p>
        </div>
      )}
    </div>
  );
}
