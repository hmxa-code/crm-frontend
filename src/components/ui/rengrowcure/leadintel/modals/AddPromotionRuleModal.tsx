'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiEdit2 } from 'react-icons/fi';
import { QualificationRule } from '@/src/types/rengrowcure/leadIntel';
import { leadIntelService } from '@/src/services/rengrowcure/leadIntelService';
import toast from 'react-hot-toast';

interface AddPromotionRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  rulesCount: number;
  initialRule?: QualificationRule | null;
  onRuleSaved?: () => void;
  setRules: React.Dispatch<React.SetStateAction<QualificationRule[]>>;
}

export default function AddPromotionRuleModal({
  isOpen,
  onClose,
  rulesCount,
  initialRule,
  onRuleSaved,
  setRules,
}: AddPromotionRuleModalProps) {
  const [ruleName, setRuleName] = useState('');
  const [fromStage, setFromStage] = useState<'Cold' | 'Warm' | 'MQL'>('Cold');
  const [toStage, setToStage] = useState<'Warm' | 'MQL' | 'SQL'>('Warm');
  const [conditionField, setConditionField] = useState('composite_score');
  const [operator, setOperator] = useState<'greater_than' | 'equals' | 'contains' | 'in_range'>('greater_than');
  const [value, setValue] = useState<string | number>(65);
  const [autoAction, setAutoAction] = useState('Auto-enroll in High-Intent Enterprise Drip Cadence');
  const [priority, setPriority] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Sync state when editing existing rule or creating new
  useEffect(() => {
    if (initialRule) {
      setRuleName(initialRule.name);
      setFromStage(initialRule.fromStage);
      setToStage(initialRule.toStage);
      setConditionField(initialRule.conditionField);
      setOperator(initialRule.operator);
      setValue(initialRule.value);
      setAutoAction(initialRule.autoAction);
      setPriority(initialRule.priority || 1);
      setIsActive(initialRule.isActive ?? true);
    } else {
      setRuleName('');
      setFromStage('Cold');
      setToStage('Warm');
      setConditionField('composite_score');
      setOperator('greater_than');
      setValue(65);
      setAutoAction('Auto-enroll in High-Intent Enterprise Drip Cadence');
      setPriority(rulesCount + 1);
      setIsActive(true);
    }
  }, [initialRule, isOpen, rulesCount]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      toast.error('Please enter a rule title');
      return;
    }

    try {
      if (initialRule) {
        // Update existing rule
        await leadIntelService.updateRule(initialRule.id, {
          name: ruleName,
          fromStage,
          toStage,
          conditionField,
          operator,
          value: isNaN(Number(value)) ? value : Number(value),
          autoAction,
          priority: Number(priority),
          isActive,
        });
        toast.success(`Rule "${ruleName}" updated successfully!`);
      } else {
        // Create new rule
        const count = await leadIntelService.getRulesCount().catch(() => rulesCount);
        const codeSuffix = String(count + 1).padStart(2, '0');
        await leadIntelService.createRule({
          ruleCode: `RULE-UPG-${codeSuffix}`,
          name: ruleName,
          fromStage,
          toStage,
          conditionField,
          operator,
          value: isNaN(Number(value)) ? value : Number(value),
          autoAction,
          priority: Number(priority),
          isActive: true,
        });
        toast.success(`Promotion Rule "${ruleName}" created successfully!`);
      }

      // Refresh list
      const rulesResponse = await leadIntelService.getRules();
      if (rulesResponse?.data) {
        setRules(rulesResponse.data);
      }
      if (onRuleSaved) onRuleSaved();
      onClose();
    } catch (error) {
      console.error('Failed to save rule:', error);
      toast.error('Failed to save promotion rule');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/40 backdrop-blur-xs transition-all">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-900 text-white rounded-lg">
              {initialRule ? <FiEdit2 size={16} /> : <FiCheckCircle size={16} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {initialRule ? 'Edit Lifecycle Promotion Rule' : 'Add Automated Promotion Rule'}
              </h3>
              <p className="text-[11px] text-slate-500">
                Configure stage transitions triggered by composite lead scoring
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 py-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Rule Title / Label</label>
            <input
              type="text"
              placeholder="e.g. Executive Demo Scheduled Promotion"
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Origin Lifecycle Stage</label>
              <select
                value={fromStage}
                onChange={(e) => setFromStage(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900 cursor-pointer"
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="MQL">MQL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Lifecycle Stage</label>
              <select
                value={toStage}
                onChange={(e) => setToStage(e.target.value as any)}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900 cursor-pointer"
              >
                <option value="Warm">Warm</option>
                <option value="MQL">MQL</option>
                <option value="SQL">SQL</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Evaluation Predicate</h4>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Field</label>
                <select
                  value={conditionField}
                  onChange={(e) => setConditionField(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="composite_score">Composite Score</option>
                  <option value="demo_scheduled">Demo Scheduled</option>
                  <option value="linkedin_touches">LinkedIn Touches</option>
                  <option value="webinar_attendance">Webinar Attendance</option>
                  <option value="pricing_hits_24h">Pricing Hits (24h)</option>
                  <option value="email_sequence_clicks">Email Clicks</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Operator</label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="greater_than">greater_than (&gt;)</option>
                  <option value="equals">equals (==)</option>
                  <option value="contains">contains</option>
                  <option value="in_range">in_range</option>
                </select>
              </div>

              <div className="col-span-1">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Value Threshold</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
                  placeholder="e.g. 65"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Automated Action Upon Promotion</label>
            <input
              type="text"
              value={autoAction}
              onChange={(e) => setAutoAction(e.target.value)}
              placeholder="e.g. Route to Senior AE & Enroll in Enterprise Drip"
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 text-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Execution Priority</label>
              <input
                type="number"
                min="1"
                max="99"
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
              <select
                value={isActive ? 'true' : 'false'}
                onChange={(e) => setIsActive(e.target.value === 'true')}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 cursor-pointer"
              >
                <option value="true">Active (Enabled)</option>
                <option value="false">Paused (Disabled)</option>
              </select>
            </div>
          </div>
        </form>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-all cursor-pointer active:scale-95"
          >
            {initialRule ? 'Save Changes' : 'Deploy Rule'}
          </button>
        </div>

      </div>
    </div>
  );
}
