import React, { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import { VentureDeal, DealStage } from '@/src/types/rengrowcure/ventureMatrix';
import { DealBasicInfoForm } from '../forms/DealBasicInfoForm';

interface CreateDealDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stages: DealStage[];
  onCreateDeal: (deal: VentureDeal) => void;
}

export const CreateDealDrawer: React.FC<CreateDealDrawerProps> = ({
  isOpen,
  onClose,
  stages,
  onCreateDeal
}) => {
  const [dealCode, setDealCode] = useState(`OPP-WHC-${Math.floor(1000 + Math.random() * 9000)}`);
  const [account, setAccount] = useState('');
  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('Marcus Vance');
  const [amount, setAmount] = useState(50000);
  const [stage, setStage] = useState<DealStage>('Discovery');
  const [probability, setProbability] = useState(40);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealCode || !account || !title) return;

    const newDeal: VentureDeal = {
      id: `vd-${Date.now()}`,
      dealCode,
      accountName: account,
      dealTitle: title,
      ownerName: owner,
      ownerAvatar: owner.split(' ').map(n => n[0]).join(''),
      stage,
      amount: Number(amount),
      mrr: Math.round(Number(amount) / 12),
      arr: Number(amount),
      closeProbability: Number(probability),
      expectedCloseDate: '2026-12-31',
      stagnationDays: 0,
      slaBreachRisk: 'Low',
      healthScore: 88,
      lastTouchpoint: 'Deal created today via Opportunity Drawer',
      primaryContact: 'Key Stakeholder',
      industry: 'Healthcare Enterprise'
    };

    onCreateDeal(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600">
              <FiPlus size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Venture Opportunity</h3>
              <p className="text-[11px] text-slate-500">Add an enterprise pipeline record with forecast velocity</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <DealBasicInfoForm
            dealCode={dealCode}
            setDealCode={setDealCode}
            account={account}
            setAccount={setAccount}
            title={title}
            setTitle={setTitle}
            amount={amount}
            setAmount={setAmount}
            stage={stage}
            setStage={setStage}
            stages={stages}
            probability={probability}
            setProbability={setProbability}
            owner={owner}
            setOwner={setOwner}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              Create Opportunity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
