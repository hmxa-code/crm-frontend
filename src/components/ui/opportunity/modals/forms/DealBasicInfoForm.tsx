import React from 'react';
import { DealStage } from '@/src/types/dealflow/opportunity';

interface DealBasicInfoFormProps {
  dealCode: string;
  setDealCode: (value: string) => void;
  account: string;
  setAccount: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
  amount: number;
  setAmount: (value: number) => void;
  stage: string;
  setStage: (value: string) => void;
  stages: DealStage[];
  probability: number;
  setProbability: (value: number) => void;
  owner: string;
  setOwner: (value: string) => void;
}

export function DealBasicInfoForm({
  dealCode,
  setDealCode,
  account,
  setAccount,
  title,
  setTitle,
  amount,
  setAmount,
  stage,
  setStage,
  stages,
  probability,
  setProbability,
  owner,
  setOwner
}: DealBasicInfoFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Account Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="e.g., Acme Corp"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Deal Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Enterprise License"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Owner <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            placeholder="Account Executive name"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Initial Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none cursor-pointer"
          >
            {stages.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Total Value ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="0"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Close Probability (%)
          </label>
          <div className="relative">
            <input
              type="number"
              value={probability}
              onChange={(e) => {
                const val = Math.min(100, Math.max(0, Number(e.target.value)));
                setProbability(val);
              }}
              min="0"
              max="100"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
            />
            <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Deal Code
          </label>
          <input
            type="text"
            value={dealCode}
            onChange={(e) => setDealCode(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
          />
        </div>
      </div>
    </div>
  );
}
