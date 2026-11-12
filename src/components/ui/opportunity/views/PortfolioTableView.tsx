import React from 'react';
import { FiEye, FiTrash2 } from 'react-icons/fi';
import { useOpportunityStore } from '@/src/stores/useOpportunityStore';
import { StageBadge } from '../shared/StageBadge';
import { Opportunity } from '@/src/types/dealflow/opportunity';

interface PortfolioTableViewProps {
  opportunities: Opportunity[];
}

export function PortfolioTableView({ opportunities }: PortfolioTableViewProps) {
  const { setSelectedDealId, openOverviewDrawer, deleteOpportunity } = useOpportunityStore();

  const handleRowClick = (id: string) => {
    setSelectedDealId(id);
    openOverviewDrawer();
  };

  return (
    <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-[24px_140px_1fr_120px_100px_110px_60px_60px] gap-3 px-6 py-3 bg-slate-100 border-b border-slate-300 text-[10px] font-bold uppercase tracking-wider text-slate-600">
        <div>#</div>
        <div>Code</div>
        <div>Account & Title</div>
        <div>Owner</div>
        <div className="text-right">Value</div>
        <div>Stage</div>
        <div className="text-right">Prob.</div>
        <div className="text-right">Actions</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-200">
        {opportunities.map((op, idx) => (
          <div 
            key={op.id}
            className="grid grid-cols-[24px_140px_1fr_120px_100px_110px_60px_60px] gap-3 px-6 py-3.5 hover:bg-slate-50 transition-colors items-center group cursor-pointer"
            onClick={() => handleRowClick(op.id)}
          >
            <div className="text-xs font-mono text-slate-400">{idx + 1}</div>
            <div>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
                {op.dealCode}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{op.accountName}</div>
              <div className="text-[11px] text-slate-500 truncate max-w-[220px]">{op.dealTitle}</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center">
                {op.ownerAvatar}
              </div>
              <span className="text-xs text-slate-700 truncate">{op.ownerName}</span>
            </div>
            <div className="text-xs font-mono font-bold text-slate-900 text-right">
              ${op.amount.toLocaleString()}
            </div>
            <div>
              <StageBadge stage={op.stage} />
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-800">
                {op.closeProbability}%
              </span>
            </div>
            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(op.id);
                }}
                title="View Details"
                className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
              >
                <FiEye size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Delete ${op.dealCode}?`)) {
                    deleteOpportunity(op.id);
                  }
                }}
                title="Delete Opportunity"
                className="p-1.5 text-slate-600 hover:text-black hover:bg-slate-100 rounded-lg transition-all"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          </div>
        ))}

        {opportunities.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No opportunities found
          </div>
        )}
      </div>
    </div>
  );
}