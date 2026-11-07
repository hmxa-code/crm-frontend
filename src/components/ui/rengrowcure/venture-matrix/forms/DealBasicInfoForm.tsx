import React from 'react';
import { DealStage } from '@/src/types/rengrowcure/ventureMatrix';

interface DealBasicInfoFormProps {
  dealCode: string;
  setDealCode: (v: string) => void;
  account: string;
  setAccount: (v: string) => void;
  title: string;
  setTitle: (v: string) => void;
  amount: number;
  setAmount: (v: number) => void;
  stage: DealStage;
  setStage: (v: DealStage) => void;
  stages: DealStage[];
  probability: number;
  setProbability: (v: number) => void;
  owner: string;
  setOwner: (v: string) => void;
}

export const DealBasicInfoForm: React.FC<DealBasicInfoFormProps> = ({
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
}) => {
  return (
    <div className="space-y-3.5">
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Deal Identifier / Opportunity Code *
        </label>
        <input
          type="text"
          placeholder="e.g. OPP-WHC-5001"
          value={dealCode}
          onChange={(e) => setDealCode(e.target.value)}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-cyan-500 bg-slate-50 focus:bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Account / Health Client Name *
        </label>
        <input
          type="text"
          placeholder="e.g. Mayo Clinic Health Services"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-cyan-500 bg-slate-50 focus:bg-white"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Deal Title & Scope *
        </label>
        <input
          type="text"
          placeholder="e.g. Enterprise Commercial Suite & Analytics"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-cyan-500 bg-slate-50 focus:bg-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Pipeline Stage
          </label>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value as DealStage)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-cyan-500"
          >
            {stages.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Contract ARR ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-cyan-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Close Probability (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={probability}
            onChange={(e) => setProbability(Number(e.target.value))}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Deal Owner / Executive
          </label>
          <input
            type="text"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-cyan-500"
          />
        </div>
      </div>
    </div>
  );
};
