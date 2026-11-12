'use client';

import React, { useEffect } from 'react';
import { FiX, FiFileText } from 'react-icons/fi';
import { useOpportunityStore } from '@/src/stores/useOpportunityStore';

export function CreateOpportunityModal() {
  const { isCreateModalOpen, closeCreateModal, addOpportunity, pipelineStages } = useOpportunityStore();
  
  const [dealCode, setDealCode] = React.useState(`OPP-${Math.floor(1000 + Math.random() * 9000)}`);
  const [account, setAccount] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [owner, setOwner] = React.useState('Marcus Vance');
  const [amount, setAmount] = React.useState(50000);
  const [stage, setStage] = React.useState<string>('Discovery');
  const [probability, setProbability] = React.useState<number>(40);
  const [notes, setNotes] = React.useState('');

  useEffect(() => {
    if (isCreateModalOpen && pipelineStages.length > 0) {
      setStage(pipelineStages[0]);
    }
  }, [isCreateModalOpen, pipelineStages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealCode || !account || !title) return;

    const newOpportunity = {
      id: `op-${Date.now()}`,
      dealCode,
      accountName: account,
      dealTitle: title,
      ownerName: owner,
      ownerAvatar: owner.split(' ').map(n => n[0]).join(''),
      stage: stage as any,
      amount: Number(amount),
      mrr: Math.round(Number(amount) / 12),
      arr: Number(amount),
      closeProbability: Number(probability),
      expectedCloseDate: '2026-12-31',
      stagnationDays: 0,
      slaBreachRisk: 'Low' as const,
      healthScore: 88,
      lastTouchpoint: 'Opportunity created via drawer',
      primaryContact: 'Key Stakeholder',
      industry: 'Technology',
      notes
    };

    addOpportunity(newOpportunity);
    closeCreateModal();
    
    // Reset form
    setDealCode(`OPP-${Math.floor(1000 + Math.random() * 9000)}`);
    setAccount('');
    setTitle('');
    setAmount(50000);
    setProbability(40);
    setNotes('');
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex transition-all duration-300 ${isCreateModalOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isCreateModalOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeCreateModal}
      />

      {/* Slide-over Drawer Panel */}
      <div 
        className={`absolute right-0 top-0 h-full w-full md:w-[520px] bg-white shadow-2xl border-l border-slate-300 flex flex-col transition-transform duration-300 ease-out ${isCreateModalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-300 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create New Opportunity</h2>
            <p className="text-xs text-slate-500">Configure parameters and inject into deal pipeline</p>
          </div>
          <button 
            onClick={closeCreateModal}
            className="p-2 text-slate-500 hover:text-black hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Drawer Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Deal Code Tag */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-900 shrink-0">
              <span className="font-mono font-bold text-xs">OPP</span>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-900 block">Identifier Code</label>
              <span className="text-xs font-mono font-bold text-slate-600">{dealCode}</span>
            </div>
          </div>

          {/* Core Basic Details */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Account Name <span className="text-slate-900">*</span>
              </label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Deal Title <span className="text-slate-900">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Enterprise Software License"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Owner
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Initial Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all appearance-none cursor-pointer font-semibold"
                >
                  {pipelineStages.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financials & Probabilities */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2">
              Financial Breakdown
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Total Value ($)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min="0"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none font-mono font-bold transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Close Probability (%)
                </label>
                <input
                  type="number"
                  value={probability}
                  onChange={(e) => setProbability(Math.min(100, Math.max(0, Number(e.target.value))))}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none font-mono transition-all"
                />
              </div>
            </div>
          </div>

          {/* Strategic Notes */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <FiFileText size={12} />
              <span>Strategic Notes</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter contextual details or next steps..."
              rows={4}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 text-slate-900 rounded-xl focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
            />
          </div>

          {/* Drawer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
            <button
              type="button"
              onClick={closeCreateModal}
              className="flex-1 px-4 py-2.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 text-xs font-bold text-white bg-black hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Create Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}