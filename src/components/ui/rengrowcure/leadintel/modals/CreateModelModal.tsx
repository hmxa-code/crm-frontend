'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiAward, FiRefreshCw } from 'react-icons/fi';
import { ScoringProfile } from '@/src/types/rengrowcure/leadIntel';

interface CreateModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newProfile: ScoringProfile) => void;
}

export default function CreateModelModal({ isOpen, onClose, onCreate }: CreateModelModalProps) {
  const [modelCode, setModelCode] = useState('');
  const [profileName, setProfileName] = useState('');
  const [targetTier, setTargetTier] = useState<ScoringProfile['targetTier']>('Enterprise');
  const [mqlThreshold, setMqlThreshold] = useState(65);
  const [sqlThreshold, setSqlThreshold] = useState(85);

  // Generate a dynamic unique model code automatically when opened
  useEffect(() => {
    if (isOpen) {
      generateUniqueCode(targetTier);
    }
  }, [isOpen]);

  const generateUniqueCode = (tier: string) => {
    const prefix = tier ? tier.slice(0, 3).toUpperCase() : 'MOD';
    const rand = Math.floor(1000 + Math.random() * 9000);
    setModelCode(`MODEL-${prefix}-${rand}`);
  };

  const handleTierChange = (tier: ScoringProfile['targetTier']) => {
    setTargetTier(tier);
    generateUniqueCode(tier);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName) return;

    const newProfile: any = {
      modelId: modelCode || `MODEL-${Date.now().toString(36).toUpperCase()}`,
      profileName: profileName,
      targetTier: targetTier,
      weights: {
        fb: 15,
        linkedin: 25,
        demo: 30,
        email: 15,
        webinar: 10,
        websiteVisits: 20,
      },
      mqlThreshold: Number(mqlThreshold),
      sqlThreshold: Number(sqlThreshold),
      maxScore: 100,
      status: 'Active',
      evaluationCount: 0,
      conversionRate: 0,
      lastUpdated: 'Just now',
    };

    onCreate(newProfile);
    setProfileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end bg-slate-900/40 backdrop-blur-xs transition-all">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto border-l border-slate-200 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-50 text-cyan-600 rounded border border-cyan-100">
              <FiAward size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create LeadIntel Scoring Model</h3>
              <p className="text-[11px] text-slate-500">Deploy a dynamic predictive qualification matrix</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 py-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Unique Dynamic Model Code</label>
              <button
                type="button"
                onClick={() => generateUniqueCode(targetTier)}
                className="text-[11px] text-cyan-700 hover:text-cyan-800 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <FiRefreshCw size={11} /> Auto-generate
              </button>
            </div>
            <input
              type="text"
              value={modelCode}
              onChange={(e) => setModelCode(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-mono text-cyan-800 font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Model Name / Description</label>
            <input
              type="text"
              placeholder="e.g. Healthcare Clinical Trial Accelerator"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Account Tier</label>
            <select
              value={targetTier}
              onChange={(e) => handleTierChange(e.target.value as any)}
              className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-slate-900 cursor-pointer"
            >
              <option value="Enterprise">Enterprise</option>
              <option value="Mid-Market">Mid-Market</option>
              <option value="SMB">SMB</option>
              <option value="Strategic">Strategic</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">MQL Threshold</label>
              <input
                type="number"
                value={mqlThreshold}
                onChange={(e) => setMqlThreshold(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">SQL Threshold</label>
              <input
                type="number"
                value={sqlThreshold}
                onChange={(e) => setSqlThreshold(Number(e.target.value))}
                className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-200 rounded font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
          </div>
        </form>

        {/* Drawer Footer Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded shadow-xs transition-all cursor-pointer active:scale-95"
          >
            Deploy Model
          </button>
        </div>

      </div>
    </div>
  );
}
